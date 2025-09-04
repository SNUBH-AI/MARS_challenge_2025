-- =====================================================
-- 프롬프트 연구 대회 플랫폼 Database Schema
-- PostgreSQL 15+
-- =====================================================

-- 1. 팀 관리 테이블
-- =====================================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    api_token VARCHAR(255) NOT NULL UNIQUE, -- 해시화된 토큰 저장
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_teams_api_token ON teams(api_token);
CREATE INDEX idx_teams_email ON teams(email);
CREATE INDEX idx_teams_created_at ON teams(created_at);

-- 2. 제출물 관리 테이블
-- =====================================================
CREATE TYPE submission_status AS ENUM (
    'pending',      -- 대기열
    'validating',   -- 검증 중
    'queued',       -- 평가 대기
    'evaluating',   -- 평가 진행 중
    'completed',    -- 완료
    'failed',       -- 실패
    'cancelled'     -- 취소됨
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL, -- S3 저장 경로
    file_size_bytes BIGINT NOT NULL,
    file_hash VARCHAR(64), -- SHA-256 해시
    status submission_status DEFAULT 'pending',
    score DECIMAL(10, 4), -- 평가 점수 (NULL if not evaluated)
    is_final_choice BOOLEAN DEFAULT false, -- 최종 선택 여부
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validation_started_at TIMESTAMP WITH TIME ZONE,
    validation_completed_at TIMESTAMP WITH TIME ZONE,
    evaluation_started_at TIMESTAMP WITH TIME ZONE,
    evaluation_completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    validation_logs JSONB DEFAULT '{}',
    evaluation_logs JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_submissions_team_id ON submissions(team_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
CREATE INDEX idx_submissions_score ON submissions(score DESC NULLS LAST);
CREATE INDEX idx_submissions_is_final ON submissions(is_final_choice) WHERE is_final_choice = true;

-- 3. 일일 제출 제한 추적 테이블
-- =====================================================
CREATE TABLE submission_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    submission_date DATE NOT NULL,
    submission_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, submission_date)
);

CREATE INDEX idx_submission_quotas_team_date ON submission_quotas(team_id, submission_date);

-- 4. LLM API 사용량 추적 테이블 (연구용)
-- =====================================================
CREATE TABLE llm_usage_logs (
    id UUID DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    endpoint_type VARCHAR(50) NOT NULL, -- 'research' or 'evaluation'
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    minute_bucket TIMESTAMP WITH TIME ZONE NOT NULL, -- 분 단위 버킷
    tokens_used INT,
    response_time_ms INT,
    status_code INT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (id, request_timestamp)
) PARTITION BY RANGE (request_timestamp);

CREATE INDEX idx_llm_usage_team_minute ON llm_usage_logs(team_id, minute_bucket);
CREATE INDEX idx_llm_usage_timestamp ON llm_usage_logs(request_timestamp);

-- 5. 분당 LLM 사용량 집계 테이블 (성능 최적화용)
-- =====================================================
CREATE TABLE llm_usage_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    minute_bucket TIMESTAMP WITH TIME ZONE NOT NULL,
    request_count INT DEFAULT 0,
    last_request_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(team_id, minute_bucket)
);

CREATE INDEX idx_rate_limits_team_minute ON llm_usage_rate_limits(team_id, minute_bucket);

-- 6. 평가 배치 관리 테이블
-- =====================================================
CREATE TYPE batch_status AS ENUM (
    'pending',
    'running',
    'completed',
    'failed'
);

CREATE TABLE evaluation_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number SERIAL UNIQUE,
    status batch_status DEFAULT 'pending',
    total_submissions INT DEFAULT 0,
    evaluated_submissions INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    seed_value INT, -- 난수 시드
    docker_image VARCHAR(255),
    error_logs TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_batches_status ON evaluation_batches(status);
CREATE INDEX idx_batches_started_at ON evaluation_batches(started_at);

-- 7. 배치-제출물 연결 테이블
-- =====================================================
CREATE TABLE batch_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES evaluation_batches(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    evaluation_order INT NOT NULL, -- 배치 내 평가 순서
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(batch_id, submission_id)
);

CREATE INDEX idx_batch_submissions_batch ON batch_submissions(batch_id);
CREATE INDEX idx_batch_submissions_submission ON batch_submissions(submission_id);

-- 8. 감사 로그 테이블 (옵션)
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_team ON audit_logs(team_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- 1. Updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Updated_at 트리거들
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submission_quotas_updated_at BEFORE UPDATE ON submission_quotas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. 일일 제출 제한 체크 함수
CREATE OR REPLACE FUNCTION check_submission_limit(p_team_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INT;
    v_limit INT := 3; -- 하루 3회 제한
BEGIN
    SELECT submission_count INTO v_count
    FROM submission_quotas
    WHERE team_id = p_team_id 
    AND submission_date = CURRENT_DATE;
    
    IF v_count IS NULL THEN
        RETURN TRUE; -- 오늘 첫 제출
    END IF;
    
    RETURN v_count < v_limit;
END;
$$ LANGUAGE plpgsql;

-- 4. 제출물 생성 시 쿼터 업데이트 함수
CREATE OR REPLACE FUNCTION update_submission_quota()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO submission_quotas (team_id, submission_date, submission_count)
    VALUES (NEW.team_id, DATE(NEW.submitted_at), 1)
    ON CONFLICT (team_id, submission_date)
    DO UPDATE SET 
        submission_count = submission_quotas.submission_count + 1,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quota_on_submission
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_submission_quota();

-- 5. 분당 LLM 사용량 체크 함수
CREATE OR REPLACE FUNCTION check_llm_rate_limit(
    p_team_id UUID,
    p_limit INT DEFAULT 10
)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INT;
    v_current_minute TIMESTAMP WITH TIME ZONE;
BEGIN
    v_current_minute := date_trunc('minute', CURRENT_TIMESTAMP);
    
    SELECT request_count INTO v_count
    FROM llm_usage_rate_limits
    WHERE team_id = p_team_id 
    AND minute_bucket = v_current_minute;
    
    IF v_count IS NULL THEN
        RETURN TRUE; -- 이 분에 첫 요청
    END IF;
    
    RETURN v_count < p_limit;
END;
$$ LANGUAGE plpgsql;

-- 6. LLM 사용량 기록 함수
CREATE OR REPLACE FUNCTION record_llm_usage(
    p_team_id UUID,
    p_endpoint_type VARCHAR(50),
    p_tokens INT DEFAULT NULL,
    p_response_time INT DEFAULT NULL,
    p_status_code INT DEFAULT 200
)
RETURNS VOID AS $$
DECLARE
    v_minute_bucket TIMESTAMP WITH TIME ZONE;
BEGIN
    v_minute_bucket := date_trunc('minute', CURRENT_TIMESTAMP);
    
    -- 사용 로그 기록
    INSERT INTO llm_usage_logs (
        team_id, endpoint_type, minute_bucket, 
        tokens_used, response_time_ms, status_code
    ) VALUES (
        p_team_id, p_endpoint_type, v_minute_bucket,
        p_tokens, p_response_time, p_status_code
    );
    
    -- Rate limit 카운터 업데이트
    INSERT INTO llm_usage_rate_limits (team_id, minute_bucket, request_count, last_request_at)
    VALUES (p_team_id, v_minute_bucket, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (team_id, minute_bucket)
    DO UPDATE SET 
        request_count = llm_usage_rate_limits.request_count + 1,
        last_request_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 파티션 테이블 생성 (LLM 사용 로그용)
-- =====================================================

-- 2025년 1월 파티션
CREATE TABLE llm_usage_logs_y2025m01 PARTITION OF llm_usage_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 2025년 2월 파티션
CREATE TABLE llm_usage_logs_y2025m02 PARTITION OF llm_usage_logs
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- 2025년 3월 파티션
CREATE TABLE llm_usage_logs_y2025m03 PARTITION OF llm_usage_logs
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- =====================================================
-- 뷰 생성 (리더보드 및 팀 히스토리)
-- =====================================================

-- 리더보드 뷰 (Materialized View for performance)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
    t.id as team_id,
    t.team_name,
    COALESCE(
        MAX(CASE WHEN s.is_final_choice THEN s.score END),
        MAX(s.score)
    ) as final_score,
    COUNT(s.id) as submission_count,
    t.created_at as registration_date,
    MAX(s.submitted_at) as last_submission_date,
    COUNT(CASE WHEN s.is_final_choice THEN 1 END) > 0 as has_final_choice
FROM teams t
LEFT JOIN submissions s ON t.id = s.team_id AND s.status = 'completed'
WHERE t.is_active = true
GROUP BY t.id, t.team_name, t.created_at
HAVING COUNT(s.id) > 0 OR t.created_at > CURRENT_DATE - INTERVAL '30 days';

CREATE UNIQUE INDEX idx_leaderboard_team ON leaderboard(team_id);
CREATE INDEX idx_leaderboard_score ON leaderboard(final_score DESC NULLS LAST);
CREATE INDEX idx_leaderboard_registration ON leaderboard(registration_date);

-- 팀 상세 히스토리 뷰
CREATE VIEW team_submission_history AS
SELECT 
    s.id as submission_id,
    s.team_id,
    t.team_name,
    s.file_name,
    s.status,
    s.score,
    s.is_final_choice,
    s.submitted_at,
    s.evaluation_completed_at,
    s.error_message,
    eb.batch_number,
    ROW_NUMBER() OVER (PARTITION BY s.team_id ORDER BY s.submitted_at DESC) as submission_rank
FROM submissions s
JOIN teams t ON s.team_id = t.id
LEFT JOIN batch_submissions bs ON s.id = bs.submission_id
LEFT JOIN evaluation_batches eb ON bs.batch_id = eb.id
ORDER BY s.submitted_at DESC;

-- 리더보드 새로고침 함수
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 초기 데이터 생성 (테스트용)
-- =====================================================

-- 테스트 팀 생성
INSERT INTO teams (team_name, email, api_token) VALUES 
('테스트팀1', 'test1@example.com', 'test_token_1_hash'),
('테스트팀2', 'test2@example.com', 'test_token_2_hash'),
('테스트팀3', 'test3@example.com', 'test_token_3_hash');

-- 초기 리더보드 생성
SELECT refresh_leaderboard();

-- 데이터베이스 설정 완료 메시지
DO $$
BEGIN
    RAISE NOTICE 'MARS Challenge 데이터베이스 초기화가 완료되었습니다.';
    RAISE NOTICE '- 팀 수: %', (SELECT COUNT(*) FROM teams);
    RAISE NOTICE '- 테이블 수: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '- 함수 수: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
END $$;

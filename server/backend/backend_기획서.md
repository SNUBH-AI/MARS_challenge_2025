uv 사용, fastapi 사용, postgresql 사용

파일 구조

backend/
  .env.example
  pyproject.toml              # (poetry) 또는 requirements.txt / uv.lock
  README.md
  alembic.ini
  alembic/
    env.py
    script.py.mako
    versions/
      2025_09_03_init_schema.py   # 스키마 마이그레이션(초기)
  app/
    main.py                      # FastAPI 앱 팩토리/라우팅 등록
    __init__.py
    core/
      config.py                  # 설정 로더(pydantic-settings)
      logging.py                 # 구조적 로깅/uvicorn log config
      security.py                # API 토큰 인증(헤더/쿼리), 역할/권한
      rate_limit.py              # Redis 기반 레이트리미트(분당 10회 등)
      pagination.py              # 공통 페이지네이션 파서/응답
      deps.py                    # DI 의존성(세션/현재팀/권한)
      errors.py                  # 예외/핸들러/에러스키마
      s3.py                      # boto3/S3 클라이언트
      time.py                    # tz aware helpers, minute bucket 등
    db/
      session.py                 # async SQLAlchemy 세션/엔진
      base.py                    # Declarative Base
      models/
        __init__.py
        team.py
        submission.py
        submission_quota.py
        llm_usage_log.py
        llm_usage_rate_limit.py
        evaluation_batch.py
        batch_submission.py
        audit_log.py
        views.py                 # ORM 매핑이 필요한 경우(뷰/머뷰)
      repositories/
        __init__.py
        team_repo.py
        submission_repo.py
        quota_repo.py
        usage_repo.py
        batch_repo.py
        audit_repo.py
        leaderboard_repo.py
    api/
      __init__.py
      router.py                 # /api prefix 라우터 통합
      v1/
        __init__.py
        auth.py                 # 로그인(이메일+API 토큰 검증→JWT/세션)
        teams.py                # 팀 조회/활성화(관리자)
        submissions.py          # 업로드/리스트/상세/최종선택 토글
        leaderboard.py          # 리더보드 질의
        batches.py              # 배치 조회/시작(관리자)/상세
        usage.py                # LLM 사용량/초과율
        audit.py                # 감사로그 조회
        health.py               # 헬스체크/메트릭
    schemas/
      __init__.py
      common.py                 # BaseResponse, Page, Error
      auth.py                   # LoginRequest/Response
      team.py
      submission.py
      leaderboard.py
      batch.py
      usage.py
      audit.py
    services/
      __init__.py
      auth_service.py           # 토큰 검증, 팀 조회, JWT 발급(선택)
      submission_service.py     # 검증/해시/S3업로드/상태전이 + 쿼터
      leaderboard_service.py    # 뷰/머뷰 질의 + 정렬/필터
      batch_service.py          # 배치 생성/큐잉/상태조회
      usage_service.py          # 사용로그 기록/버킷/요율 계산
      audit_service.py          # 감사로그 기록 헬퍼
      rate_limit_service.py     # 팀별 minute 버킷 체크/증가
    workers/
      __init__.py
      queue.py                  # Celery/RQ/Dramatiq 초기화
      tasks.py                  # 평가 태스크: 도커 실행, 시드, 로그수집
      evaluators/
        docker_runner.py        # docker SDK 호출/컨테이너 라이프사이클
        sandbox.py              # 리소스 제한, 타임아웃
        parsers.py              # 점수/로그 파싱
    middlewares/
      __init__.py
      request_context.py        # request id / team id 컨텍스트 로깅
      rate_limit_mw.py          # 글로벌/엔드포인트 레이트리미트(옵션)
      audit_mw.py               # 감사 로그 자동 기록(옵션)
    utils/
      hashing.py                # sha256 파일해시
      crypto.py                 # api_token 해시/검증
      file.py                   # 파일 확장자/사이즈 검사(.py)
      json.py                   # safe json dump
      errors.py                 # 도메인 예외
    migrations/                 # (선택) Alembic 헬퍼 스크립트
      helpers.py
    tests/
      __init__.py
      conftest.py               # 테스트 DB/Redis/S3 더블
      e2e/
      unit/
        test_submissions.py
        test_rate_limit.py
        test_batches.py

## 라이브러리 버전
React 18 + Vite + tailwind 4.1 + typescript

## 핵심 시나리오
### 인증
팀 단위 로그인(이메일 + API 토큰). 비밀번호 없음.

### 제출: 
.py 파일 업로드 → 서버 검증/큐잉 진행 상황 실시간 폴링 → 완료 시 점수 노출.

### 리더보드: 
최고 점수(또는 최종 선택) 기준 정렬

### 팀 상세: 
제출 히스토리/상태/점수/에러 로그(텍스트) / 최종 선택 지정.

## 라우팅 구조

- /login 로그인(이메일+API 토큰)

- /leaderboard 리더보드(기본 진입점)

- /team 팀 대시보드(내 팀 카드/메타, 오늘 제출 가능 횟수, 최근 제출 5개)

- /team/submissions 제출 리스트(상태/점수/시간/오류) + 업로드

- /team/submissions/:id 제출 상세(상태 타임라인, 로그 뷰어, 최종선택 토글)

## 주요 페이지 설계
### Leaderboard

정렬 priority : 점수, 제출 수

표 컬럼: 팀 이름 | 점수 | 제출 수 | 마지막 제출일

### Team Dashboard
#### 팀 정보
한 줄에 팀명, 오늘 남은 제출 횟수, 최고 점수
최근 제출 5개(상태 배지, 점수, 제출 시각)
#### 제출 탭
업로드 박스(.py만 허용, drag&drop)
표 : 파일명 | 상태 | 점수 | 제출 시각 | 최종선택 | 액션
상태 현황 : 평가 중, 완료, 실패
에러메시지 있으면 표시 

## 파일구조
src/
  app/
    main.tsx
    App.tsx
    routes.tsx
    layout/
      AppShell.tsx
      TopNav.tsx
    styles/
      index.css        # Tailwind 엔트리 + @layer components로 공통 클래스 정의

  shared/
    ui/               # 재사용 가능한 순수 UI (디자인 시스템 느낌)
      Button.tsx
      Badge.tsx
      Card.tsx
      Table.tsx
      Input.tsx
      UploadDropzone.tsx
      EmptyState.tsx
    api/
      http.ts
      queryClient.ts
    auth/
      auth.ts
      useAuth.ts
    hooks/
      useToast.ts
      useConfirm.ts
      usePollingQuery.ts
    utils/
      classnames.ts
      date.ts
      format.ts
      validators.ts
      download.ts
      constants.ts
      env.ts
    types/
      index.ts
      api.ts
    assets/
      logo.svg
      empty-illustration.svg

  features/
    auth/
      LoginPage.tsx
      services/
        auth.service.ts
    leaderboard/
      LeaderboardPage.tsx
      components/
        LeaderboardTable.tsx
        LeaderboardFilters.tsx
      services/
        leaderboard.service.ts
    team/
      TeamDashboardPage.tsx
      TeamSubmissionsPage.tsx
      SubmissionDetailPage.tsx
      components/
        TeamSummary.tsx
        submissions/
          SubmissionTable.tsx
          SubmissionRow.tsx
      services/
        teams.service.ts
        submissions.service.ts
        batches.service.ts
        usage.service.ts
        audit.service.ts
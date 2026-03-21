# Auth Container/Presentational Pattern

## 목적

인증 UI는 로그인 페이지와 메인 오버레이에서 같은 카드 구조를 재사용하고 있습니다.  
이때 화면 마크업, 폼 상태, API 호출, 모드 전환이 한 컴포넌트에 섞이면 다음 문제가 생깁니다.

- 로그인 카드와 회원가입 카드가 UI 외 책임까지 같이 갖게 됨
- 페이지와 오버레이가 같은 전환 로직을 중복으로 구현하게 됨
- 카피 수정, 필드 추가, 검증 변경 시 영향 범위가 커짐

그래서 인증 영역에는 `Container/Presentational Pattern`을 적용했습니다.

## 패턴 선택 이유

이 프로젝트의 인증 영역은 아래 성격이 강합니다.

- 화면은 비슷하지만 진입 위치가 2곳임
- 로그인과 회원가입의 상태 전환이 있음
- 입력 상태, 검증, API 호출, 토스트, 라우팅이 함께 동작함

이 경우 가장 단순하고 유지보수하기 쉬운 방식은 다음 분리입니다.

- Container: 상태 관리, API 호출, 전환 제어
- Presentational: props를 받아 렌더링만 수행

## 현재 구조

### 1. Container

#### [`src/shared/components/auth/auth-flow.tsx`](/C:/Project/Telegro_FE_Migrate/src/shared/components/auth/auth-flow.tsx)

인증 영역의 최상위 컨테이너입니다.

- 현재 모드(`login | signup`)를 관리
- 로그인 폼 훅과 회원가입 폼 훅을 연결
- 어떤 카드를 보여줄지 결정

즉, "무엇을 보여줄지"를 결정하는 컴포넌트입니다.

#### [`src/shared/hooks/use-login-form.ts`](/C:/Project/Telegro_FE_Migrate/src/shared/hooks/use-login-form.ts)

로그인 전용 컨테이너 훅입니다.

- `id`, `password` 상태 관리
- 로그인 API 호출
- 성공 시 토스트 표시
- 권한별 이동 경로 계산 후 라우팅
- 실패 시 에러 메시지 처리

즉, "로그인 폼이 어떻게 동작하는지"를 담당합니다.

#### [`src/shared/hooks/use-signup-form.ts`](/C:/Project/Telegro_FE_Migrate/src/shared/hooks/use-signup-form.ts)

회원가입 전용 컨테이너 훅입니다.

- 1단계/2단계 상태 관리
- 회원가입 입력값 전체 관리
- 비밀번호 확인 검증
- 다음 단계 이동 제어
- Daum 우편번호 스크립트 로드
- 주소 검색 결과 반영
- 회원가입 API 호출
- 성공 시 폼 초기화 후 로그인 모드 복귀

즉, "회원가입 폼 로직 전체"를 담당합니다.

### 2. Presentational

#### [`src/shared/components/auth/login-card.tsx`](/C:/Project/Telegro_FE_Migrate/src/shared/components/auth/login-card.tsx)

로그인 화면 전용 표시 컴포넌트입니다.

- 입력 필드 렌더링
- 버튼 렌더링
- 카피 렌더링
- 컨테이너에서 내려준 이벤트를 호출

이 컴포넌트는 직접 API를 호출하지 않습니다.

#### [`src/shared/components/auth/signup-card.tsx`](/C:/Project/Telegro_FE_Migrate/src/shared/components/auth/signup-card.tsx)

회원가입 화면 전용 표시 컴포넌트입니다.

- 2단계 UI 렌더링
- 헤더 로고와 뒤로가기 아이콘 렌더링
- 우편번호 검색 버튼 렌더링
- 진행 바 렌더링
- 컨테이너에서 받은 상태와 이벤트만 사용

이 컴포넌트 역시 직접 검증이나 API 호출을 하지 않습니다.

### 3. Shared UI

#### [`src/shared/components/auth/auth-card.tsx`](/C:/Project/Telegro_FE_Migrate/src/shared/components/auth/auth-card.tsx)

인증 UI 공용 프리미티브입니다.

- `AuthCardShell`
- `AuthField`
- `AuthActionButton`
- `AuthProgressBar`

로그인/회원가입 카드가 같은 너비, 높이 감각, 버튼 스타일을 유지하도록 돕는 공용 레이어입니다.

### 4. Entry Point

#### [`src/pages/auth/login.tsx`](/C:/Project/Telegro_FE_Migrate/src/pages/auth/login.tsx)

페이지에서는 `AuthFlow`만 렌더링합니다.  
즉, 페이지는 인증 세부 로직을 알지 않습니다.

#### [`src/shared/components/auth/login-overlay.tsx`](/C:/Project/Telegro_FE_Migrate/src/shared/components/auth/login-overlay.tsx)

메인 오버레이도 동일하게 `AuthFlow`만 렌더링합니다.  
즉, 페이지와 오버레이가 같은 인증 흐름을 재사용합니다.

## 데이터 흐름

### 로그인

1. `login.tsx` 또는 `login-overlay.tsx`가 `AuthFlow`를 렌더링
2. `AuthFlow`가 `useLoginForm()` 실행
3. `useLoginForm()`이 상태와 `handleSubmit` 생성
4. `AuthFlow`가 그 값을 `LoginCard`에 props로 전달
5. 사용자가 입력/제출
6. `LoginCard`는 props로 받은 핸들러만 호출
7. 실제 로그인 처리와 라우팅은 `useLoginForm()`이 수행

### 회원가입

1. `AuthFlow`가 `useSignupForm()` 실행
2. `useSignupForm()`이 단계 상태, 입력 상태, 주소 검색 로직 생성
3. `AuthFlow`가 이를 `SignupCard`에 props로 전달
4. 사용자가 다음/이전/주소검색/회원가입 수행
5. `SignupCard`는 받은 핸들러만 호출
6. 실제 검증, API 호출, 성공 후 초기화는 `useSignupForm()`이 수행

## 적용 전후 차이

### 적용 전

- `login-card.tsx` 안에 로그인 API 호출, 토스트, 라우팅, 오버레이 전환이 같이 있었음
- 회원가입도 UI와 검증/주소검색/API 호출이 강하게 결합돼 있었음
- 페이지와 오버레이가 각각 인증 전환 구조를 알게 되기 쉬웠음

### 적용 후

- `auth-flow.tsx`가 전환 책임을 단일화
- `use-login-form.ts`, `use-signup-form.ts`가 동작 책임을 분리
- `login-card.tsx`, `signup-card.tsx`는 화면 렌더링에 집중
- 페이지와 오버레이는 `AuthFlow`만 재사용하면 됨

## 이 구조의 장점

- 같은 인증 흐름을 여러 진입점에서 재사용하기 쉬움
- UI 수정과 로직 수정을 서로 분리해서 작업 가능
- 테스트 대상을 분리하기 쉬움
- 카드 컴포넌트가 단순해져 디자이너 시안 반영이 쉬움
- 추후 소셜 로그인, 약관 단계, 추가 필드 확장 시 컨테이너만 늘리면 됨

## 이 구조에서 지켜야 할 기준

앞으로 인증 관련 코드를 수정할 때는 아래 기준을 유지합니다.

- 카드 컴포넌트에서 직접 API 호출하지 않기
- 카드 컴포넌트에서 직접 라우팅하지 않기
- 토스트, 검증, 외부 스크립트 로드는 컨테이너 훅에서 처리하기
- 공통 스타일은 `auth-card.tsx`에 모으기
- 새로운 인증 모드는 가능하면 `AuthFlow`에서 전환하기

## 한 줄 요약

이 인증 구조는 `AuthFlow + form hook`이 동작을 담당하고, `LoginCard/SignupCard`는 화면만 담당하도록 나눈 `Container/Presentational Pattern`입니다.

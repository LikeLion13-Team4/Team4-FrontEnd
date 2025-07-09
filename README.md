## **1. 브랜치 네이밍 규칙**
| 브랜치 유형 | 설명 | 예시 |
| --- | --- | --- |
| main | 배포 가능한 안정적인 코드가 존재하는 메인 브랜치 | `main` |
| develop | 개발자들이 작업한 기능(feature branch)을 병합하여 통합하는 개발 브랜치 | `develop` |
| feature | 새로운 기능 개발 시 생성하는 브랜치 | `feat/login-page`, `feat/main-page` |
| fix | 버그 수정 시 생성하는 브랜치 | `fix/login-error` |
| hotfix | 긴급하게 수정해야 하는 버그 발생 시 main에서 분기하여 작업 후 main과 develop에 병합 | `hotfix/login-error` |

<br />

## **2. 커밋 메시지 규칙**

**형식:**

```
<타입>: <변경사항 요약>
```

**커밋 타입 목록:**

| 타입         | 용도                       | 예시                             |
| ---------- | ------------------------ | ------------------------------ |
| `feat`     | 새로운 기능 추가                | `feat: 사용자 로그인 기능 구현`          |
| `fix`      | 버그 수정                    | `fix: 회원가입 시 이메일 유효성 오류 수정`    |
| `docs`     | 문서 수정 (README, 주석 등)     | `docs: README 커밋 규칙 추가`        |
| `design`   | UI/스타일 등 **비기능적 디자인 변경** | `design: 버튼 색상 변경 및 margin 조정` |
| `refactor` | 코드 리팩토링 (기능 변화 없음)       | `refactor: 컴포넌트 분리 및 네이밍 정리`   |
| `chore`    | 기타 설정, 빌드, 패키지 설치 등      | `chore: axios 설치 및 기본 api 설정`  |


### 2-1. 커밋 메시지 예시

```bash
git commit -m "feat: 커밋 프로파일 카드 컴포넌트 생성"
git commit -m "fix: 날짜 포맷 오류 수정"
git commit -m "docs: 프로젝트 구조 설명 추가"
git commit -m "design: input 컴포넌트 스타일 개선"
git commit -m "refactor: fetch 함수 useQuery로 변경"
git commit -m "chore: eslint 설정 추가 및 적용"
```



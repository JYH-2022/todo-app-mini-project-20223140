# ✨ Todo List App

풀스택 Todo 리스트 앱 - React + Vite + Express + MongoDB Atlas + Vercel 배포

## 🔗 링크

- **배포 URL**: https://todo-app-mini-project-20223140.vercel.app
- **GitHub**: https://github.com/JYH-2022/todo-app-mini-project-20223140

---

## 🛠 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| 배포 | Vercel (GitHub 연동 자동 배포) |

---

## ✅ 기능 목록

### 기본 기능 (MVP)
- Todo 항목 추가 (최대 100자)
- Todo 목록 조회
- 완료 체크 / 해제
- Todo 삭제
- 완료된 항목 일괄 삭제

### 추가 기능
- 🔍 **실시간 검색** — 키워드 입력 시 즉시 필터링, 검색어 하이라이팅
- 📊 **진행률 바** — 전체 Todo 중 완료 비율을 시각적으로 표시
- 🕐 **생성 시간 표시** — "방금 전 / 3분 전 / 2시간 전" 형식으로 표시
- 🌙 **다크모드** — 토글 버튼으로 전환, 설정 자동 저장
- 📖 **사용 설명서** — ? 버튼 클릭 시 모달 팝업
- 🎨 **애니메이션** — 항목 추가/삭제/체크 시 부드러운 효과
- 🛡 **입력값 유효성 검사** — 빈 값, 100자 초과 방지 (프론트 + 백엔드 이중 검사)

---

## 📁 프로젝트 구조

```
todo-app/
├── backend/
│   ├── index.js        # Express 서버 + API 엔드포인트
│   ├── package.json
│   └── .env            # 환경변수 (gitignore)
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # 메인 React 컴포넌트
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── vercel.json         # Vercel 배포 설정
├── .gitignore
└── README.md
```

---

## 🚀 로컬 실행 방법

### 1. 백엔드

```bash
cd backend
npm install
cp .env.example .env
# .env에 MONGODB_URI 입력
npm run dev
# http://localhost:5000
```

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

> 백엔드와 프론트엔드를 **동시에** 실행해야 정상 작동합니다.

---

## 🌐 API 명세

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/todos | 전체 Todo 조회 |
| POST | /api/todos | Todo 추가 |
| PUT | /api/todos/:id | 완료 상태 변경 |
| DELETE | /api/todos/:id | Todo 삭제 |

---

## ⚙️ 환경변수

| 변수명 | 설명 |
|--------|------|
| MONGODB_URI | MongoDB Atlas 연결 문자열 |
| PORT | 서버 포트 (기본값: 5000) |
| VITE_API_URL | 프론트에서 사용할 백엔드 URL |

---


# Todo List App

풀스택 Todo 리스트 앱 - React + Vite + Express + MongoDB Atlas + Vercel 배포

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| 배포 | Vercel |

## 기능

- ✅ Todo 추가
- ✅ Todo 목록 조회
- ✅ 완료 체크/해제
- ✅ Todo 삭제
- ✅ 완료된 항목 일괄 삭제

## 로컬 실행 방법

### 1. 백엔드

```bash
cd backend
npm install
cp .env.example .env
# .env에 MONGODB_URI 입력
npm run dev
```

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

프론트엔드: http://localhost:5173  
백엔드: http://localhost:5000

## 배포

Vercel에 GitHub 연동으로 자동 배포.  
환경변수 `MONGODB_URI`를 Vercel 대시보드에서 설정 필요.

## 배포 URL

https://todo-app-학번.vercel.app

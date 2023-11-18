const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();

// SQLite 데이터베이스 설정
const db = new sqlite3.Database('database.db');

// 세션 설정
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// 뷰 엔진 설정 (이 부분은 선택적이며, 필요에 따라 수정 가능)
app.set('view engine', 'ejs');

// 미들웨어: 세션이 존재하지 않으면 로그인 페이지로 리다이렉션
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

// 루트 경로: 세션 확인 후 고득점 페이지로 이동
app.get('/', requireLogin, (req, res) => {
  res.render('dashboard', { userId: req.session.userId });
});

// 로그인 페이지
app.get('/login', (req, res) => {
  res.render('login');
});

// 로그인 요청 처리
app.post('/login', (req, res) => {
  // 실제 로그인 처리 로직은 여기에 들어갑니다.
  // 성공 시 세션에 사용자 ID를 저장하고 고득점 데이터를 SQLite에 저장합니다.
  const userId = 'user123'; // 로그인 성공한 사용자의 ID라고 가정

  req.session.userId = userId;

  // 고득점 데이터를 SQLite에 저장하는 로직
  const highScore = 100; // 예시로 100점으로 가정
  db.run('INSERT INTO high_scores (user_id, score) VALUES (?, ?)', [userId, highScore], (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('High score saved to SQLite database.');
    }
  });

  res.redirect('/');
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

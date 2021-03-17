import React from 'react';
import './Login.css';

const Login = () => {

  const socialLoginHandler = () => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=a9141b639cb5a1982bb6');
  };

  return (
    <div className="login-box">
      <div className="login-title">Login</div>
      <div className="login-items">
        <div className="login-input">
          <input className="login-email" placeholder="Email" type="text" />
          <input className="login-password" placeholder="Password" type="text" />
        </div>
        <div className="login-btns">
          <button className="login-signin">로그인</button>
          <button className="login-signup">회원가입</button>
          <button className="login-github" onClick={socialLoginHandler}>Github Login</button>
        </div>
      </div>
    </div>
  );
};


export default Login;
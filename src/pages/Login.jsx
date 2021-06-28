import React, { useState } from 'react';
import PropTypes from 'prop-types';

Login.propTypes = {
  showform : PropTypes.func.isRequired,
  notification : PropTypes.func.isRequired,
};

function Login(props) {
  const { showform, notification } = props
  const [validate, setValidate] = useState(true);
  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const [isLogin, setIsLogin] = useState(true);

  function changeLogin(a) {
    setValidate(true)
    a === '1' ? setIsLogin(true) : setIsLogin(false)
  }

  async function submit(e) {
    let url = ''
    isLogin ? url = 'login' : url = 'register'
    e.preventDefault()
    try {
      const response = await fetch(`https://todo-mvc-api-typeorm.herokuapp.com/auth/${url}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      let res = await response.json()
      if(isLogin && res.token) {
        localStorage.setItem('token', JSON.stringify(res))
        showform()
        setValidate(true)
        notification(`Wellcome ${res.username}`)
      }else if(isLogin && !res.token){
        setValidate(false)
      }else if(res.username){
        notification('Sign Up Success !')
      }else {
        setValidate(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="loginForm">
      <div className="form-container">
        <div>
          <button onClick={() => changeLogin('1')} style={isLogin ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }} className="btn-log btn-login">Login</button>
          <button onClick={() => changeLogin('2')} style={!isLogin ? { backgroundColor: 'green' } : { backgroundColor: 'gray' }} className="btn-reg btn-login">Register</button>
        </div>
        <div className="icon-time" onClick={showform}>
          <i className="fas fa-times"></i>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="name" >username</label>
          <input id="name" type="text" className="form-control" value={user.username} onChange={e => setUser({...user, username : e.target.value})} />
          <br />
          <label htmlFor="pwd" >password</label>
          <input id="pwd" type="text" className="form-control" value={user.password} onChange={e => setUser({...user, password : e.target.value})} />
          <small style={validate ? {display : 'none'} : {display : 'block'}}>username or password is incorrect</small>
          <br />
          {isLogin ? <button className="btn btn-primary mt-4" >Login</button> : <button className="btn btn-primary mt-4">Register</button>}
        </form>
      </div>
    </div>
  );
}

export default Login;
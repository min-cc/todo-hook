import React, { useEffect, useState } from 'react';
import TodoLists from '../components/TodoLists';
import Login from './Login';

function Home() {
  const [checkLogin, setCheckLogin] = useState(() => localStorage.token ? true : false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    async function getListTodo() {
      let tok = ''
      if (localStorage.token) {
        tok = JSON.parse(localStorage.token).token
      }
      const todos = await fetch('https://todo-mvc-api-typeorm.herokuapp.com/api/todos', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${tok}`
        },
      })
      let value = await todos.json()
      setList(value.items || [])
    }
    getListTodo()
  }, [user])

  useEffect(() => {
    if (localStorage.token) {
      setCheckLogin(true)
      setUser(JSON.parse(localStorage.token).username)
    } else {
      setCheckLogin(false)
      setUser('')
    }
  })

  async function addTodo(content) {
    if (content !== '') {
      let value = await fetch('https://todo-mvc-api-typeorm.herokuapp.com/api/todos', {
        body: JSON.stringify({ content: content }),
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${JSON.parse(localStorage.token).token}`
        },
      })
      let a = await value.json()
      let newList = [...list]
      newList.unshift(a)
      setList(newList)
      notification('Add todo success !')
    } else {
      return false
    }
  }

  async function removeTodo(id) {
    await fetch(`https://todo-mvc-api-typeorm.herokuapp.com/api/todos/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${JSON.parse(localStorage.token).token}`
      },
    })
    let index = list.findIndex((x) => x.id === id)
    let newList = [...list]
    newList.splice(index, 1)
    setList(newList)
  }

  function change() {
    setShowForm(!showForm)
  }

  async function editTodo(id, cnt) {
    await fetch(`https://todo-mvc-api-typeorm.herokuapp.com/api/todos/${id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${JSON.parse(localStorage.token).token}`
      },
      body: JSON.stringify({
        status: 'active',
        content: cnt
      })
    })
    let newList = [...list]
    let a = newList.map((x) => {
      if (x.id === id) {
        return { ...x, content: cnt }
      } else {
        return x
      }
    })
    setList(a)
    notification('Edit success !')
  }

  async function logout() {
    localStorage.removeItem('token')
    await setList([])
    setCheckLogin(false)
  }

  function notification(mes) {
    setMessage(mes)
    let notifi = document.getElementsByClassName('notification')[0]
    notifi.style.display = 'block'
    setTimeout(() => {
      notifi.style.display = 'none'
    }, 3000)
  }

  function search(value) {
    let newList = [...list]
    let a = newList.filter((x) => {
      return x.content.indexOf(value) !== -1
    })
    setList(a)
  }

  return (
    <div>
      <header>
        <div>
          <p>Todo App</p>
        </div>
        <div>
          <span>{user}</span>
          <button style={checkLogin ? { display: 'inline' } : { display: 'none' }} className="btn btn-danger" onClick={logout}>logout</button>
          <button style={!checkLogin ? { display: 'inline' } : { display: 'none' }} className="btn btn-success" onClick={change}>Login/Register</button>
        </div>
      </header>
      <div style={{ display: 'none' }} className="notification animate__animated animate__tada">
        <p>{message}</p>
      </div>
      <div style={showForm ? { display: 'block' } : { display: 'none' }}>
        <Login showform={change} notification={notification} />
      </div>
      <main>
        <TodoLists list={list} add={addTodo} remove={removeTodo} edit={editTodo} search={search} />
      </main>
    </div>
  );
}

export default Home;
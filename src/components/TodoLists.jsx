import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react/cjs/react.development';

TodoLists.propTypes = {
  list: PropTypes.array.isRequired,
  add: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  search : PropTypes.func.isRequired
};

function TodoLists(props) {
  const [content, setContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [selectTodo, setSelectTodo] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const { list, add, remove, edit, search } = props

  function addTodo(e) {
    e.preventDefault()
    setContent('')
    add(content)
  }

  function editTodo(id, content) {
    setEditContent(content)
    setSelectTodo(id)
  }

  async function save(id, cnt){
    await edit(id, cnt)
    setSelectTodo(false)
  }

  function searchTodo(e){
    e.preventDefault()
    search(searchValue)
  }

  return (
    <div>
      <div className="todo-list-box">
        <form onSubmit={addTodo}>
          <input placeholder="What will you do today ..." className="input-form" type="text" onChange={e => setContent(e.target.value)} value={content} />
          <button className="button-form">Add</button>
        </form>
        <form onSubmit={searchTodo}>
          <input type="text" placeholder="Search todos ..." className="input-form" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
        </form>
      </div>
      <div>
        {list.map((x) => (
          <div className="list-todo" key={x.id}>
            {selectTodo !== x.id ? <p>{x.content}</p> : <input className="input-edit" type="text" onChange={e => setEditContent(e.target.value)} value={editContent} />}
            <div>
              {selectTodo !== x.id ?
                <div>
                  <i className="fal fa-edit" title="Edit" onClick={() => editTodo(x.id, x.content)} ></i>
                  <i className="far fa-trash-alt" title="Remove" onClick={() => remove(x.id)}></i>
                </div>
                : <div>
                  <i className="fal fa-save" title="Save" onClick={() => save(x.id, editContent)} ></i>
                  <i className="fas fa-times" title="Exit" onClick={() => setSelectTodo(false)}></i>
                </div>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoLists;
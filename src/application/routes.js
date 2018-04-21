import { getCookie } from './helpers/getCokie';
const baseUrl = 'http://' + $(location).attr('hostname') + ':8000';
const csrftoken = getCookie('csrftoken');

export function handle_index() {
  const url = baseUrl + '/auth/';
  const loginUrl = url + 'login/';

  const content = `
    <br />
    <div class='form-container'>
    <h1>Simple Registration Form</h1>
      <form id='form-registartation' method='POST' action="${url}" >
        <input class='input-username' name='username' type='text' placeholder='write your username' required>
        <input class='input-email' name='email' type='email' placeholder='write your email' required>
        <input class='input-password' name='password' type='password' placeholder='write your password' required>
        <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
        <button type='submit'>Submit</button>
      </form>
    </div>
    <div id='errors' hidden></div>
    <h1>Simple Login Form</h1>
    <form id='form-login' method='POST' action="${loginUrl}" >
      <input class='input-username' name='username' type='text' placeholder='write your username' required>
      <input class='input-password' name='password' type='password' placeholder='write your password' required>
      <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
      <button type='submit'>Submit</button>
    </form>
  </div>
  <div id='errors' hidden></div>
  `;
  $('#root').empty().html(content);
};

export function handle_todo() {
  const url = baseUrl + '/todo/';
  let todos = [];
  const  content = `
    <button id='logout'>Logout</button>
    <br />
    <div class='todos-container'>
      <h1>Simple ToDo form</h1>
      <form id='form-todo' method='POST' action="${url}" >
        <input id='input-title name='title' type='text' placeholder='write your todo' required >
        <input id='daterangepicker' name='date_range' type='text'>
        <button type='submit'>Submit</button>
        <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
      </form>
      <br />
      <div id='todos'>${todos}</div>
    </div>
  `;
  $.ajax({
    type: 'GET',
    url: url,
    headers: {
        'Authorization': `Token ${localStorage.getItem('auth_token')}`
    },
    success: function(data) {
      data.forEach(function(todo) {
          var todo = `
            <div class='todo'>
                <h3>${todo.title}</h3>
            </div>
          `;
          todos.append(todo);
      });
    }
    });
    $('#root').empty().html(content);
};


import getCookie from './helpers/getCokie';
import 'daterangepicker';
const baseUrl = 'http://' + $(location).attr('hostname') + ':8000';
const csrftoken = getCookie('csrftoken');

export function handle_index() {
  const url = baseUrl + '/auth/';
  const loginUrl = url + 'login/';

  $('.daterangepicker').remove();

  const content = `
    <br />
    <div id='form-container'>
    <div id='registration-container'>
    <h1>Simple Registration Form</h1>
      <form id='form-registartation' method='POST' action="${url}" >
        <input class='input-username' name='username' type='text' placeholder='write your username'>
        <input class='input-email' name='email' type='email' placeholder='write your email'>
        <input class='input-password' name='password' type='password' placeholder='write your password'>
        <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
        <button type='submit'>Submit</button>
      </form>
    <div id='registration-errors' hidden></div>
    </div>
    <div id='login-container'>
    <h1>Simple Login Form</h1>
    <form id='form-login' method='POST' action="${loginUrl}" >
      <input class='input-username' name='username' type='text' placeholder='write your username'>
      <input class='input-password' name='password' type='password' placeholder='write your password'>
      <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
      <button type='submit'>Submit</button>
    </form>
    <div id='login-errors' hidden></div>
    </div>
  </div>
  `;
  $('#root').empty().html(content);
};

export function handle_todo() {
  const url = baseUrl + '/todo/';
  let todos = [];
  

  $.ajax({
    type: 'GET',
    url: url,
    headers: {
        'Authorization': `Token ${localStorage.getItem('auth_token')}`
    },
    success: function(data) {
      data.forEach(function(todo) {
          todo = `
            <div class='todo'>
                <h3>${todo.title}</h3>
            </div>
          `;
          todos.push(todo);
      });
      console.log(todos);
      const content = `
        <button id='logout'>Logout</button>
        <br />
        <div class='todos-container'>
          <h1>Simple ToDo form</h1>
          <form id='form-todo' method='POST' action="${url}" >
            <input id='input-title' name='title' type='text' placeholder='write your todo'>
            <input id='daterangepicker' name='date_range' type='text'>
            <button type='submit'>Submit</button>
            <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
          </form>
          <div id='todo-errors' hidden></div>
          <br />
          <div id='todos'>${todos.join('')}</div>
        </div>
      `;

      $('#root').empty().html(content);
    
      $('#daterangepicker').daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
      });
    }
    });
};


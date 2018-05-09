import getCookie from './helpers/getCokie';
import todoRepr from './helpers/todoRepr';
import router from './router';
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
      <form id='form-registartation' method='POST' action="${url}" novalidate>
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
  $('#root').html(content);
};

export function handle_todo() {
  const url = baseUrl + '/todo/';
  let todos = '';
  

  $.ajax({
    type: 'GET',
    url: url,
    headers: {
        'Authorization': `Token ${localStorage.getItem('auth_token')}`
    },
    error: function(err) {
      switch(err.status) {
        case 401:
          router('/logout');
          break;
        case 406:
          console.log(err);
          break;
        default:
          console.log('err', err);
      }
    },
    success: function(data) {
      todos = todoRepr(data);
      console.log('test_todos', todos);
      
      const categories = Object.keys(todos).map(category => `
        <div class="categorie ${category.toLowerCase().replace(/' '/g, /'_'/)}">
          <h3>${category}</h3>
          <div class='todos'>${todos[category]}</div>
        </div>
      `);
      
      console.log('categories', categories);
      const content = `
        <button id='logout'>Logout</button>
        <br />
        <div class='todos-container'>
          <h1>Simple ToDo form</h1>
          <form id='form-todo' method='POST' action="${url}" >
            <input id='input-title' name='title' type='text' placeholder='write your todo'>
            <input id='daterangepicker' name='date_range' type='text' placeholder='Choice start and end date of todo'>
            <button type='submit'>Submit</button>
            <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
          </form>
          <div id='todo-errors' hidden></div>
          <br />
          <div class='todos'>${categories.join('')}</div>
        </div>
      `;

      $('#root').html(content);
    
      $('#daterangepicker').daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
      });
    }
    });
};

import todoRepr from './helpers/todoRepr';
import categorieRepr from './helpers/categorieRepr';
import user from './helpers/getUser';
import router from './router';
import { baseAPIUrl, csrftoken } from './constants';
import 'daterangepicker';

const url = baseAPIUrl + '/auth/';

export function handle_index() {
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
        <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
        <button type='submit'>Submit</button>
      </form>
    <div id='registration-errors' hidden></div>
    </div>
    <div id='login-container'>
    <h1>Simple Login Form</h1>
    <form id='form-login' method='POST' action="${loginUrl}" >
      <input class='input-username' name='username' type='text' placeholder='write your username or email'>
      <input class='input-password' name='password' type='password' placeholder='write your password'>
      <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
      <button type='submit'>Submit</button>
    </form>
    <div id='login-errors' hidden></div>
    </div>
  </div>
  `;
  $('#root').html(content);
};

export function handle_todo() {
  const url = baseAPIUrl + '/todo/';
  let todos = '';

  $.ajax({
    type: 'GET',
    url: url,
    headers: {
        'Authorization': `Token ${user().auth_token}`
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
      const categories = categorieRepr(todos);
      const content = `
        <button id='logout'>Logout</button>
        <br />
        <div class='todos-container'>
          <h1>Simple ToDo form</h1>
          <form id='form-todo' method='POST' action="${url}" >
            <input id='input-title' name='title' type='text' placeholder='write your todo'>
            <input id='daterangepicker' name='date_range' type='text' placeholder='Choice start and end date of todo'>
            <button type='submit'>Submit</button>
            <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
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

export function handle_activate(data, queryParams) {
  if (!$.isEmptyObject(queryParams)) {
    const url = baseAPIUrl + '/activate-user/';
    $.ajax({
      type: 'POST',
      url: url,
      data: queryParams,
      error: function(err) {
        console.log('handle_activate', err);
        window.location.search = '';
        router();
      },
      success: function(data) {
        localStorage.setItem('user', JSON.stringify(data));
        router('/todo');
      }
    });
  }
  const content = `
    <div>
      <h3>Please activate your account</h3>
      <p>Dear, <strong>${data.username}</strong>, activation link sended to your email - <strong>${data.email}</strong></p>
      <div id='resend-activation-email'>Click here for resending of activation link</div>
    </div>
  `;

  $('#root').html(content);
}

export function handle_not_found() {
  const content = `
    <div>Not found</div>
    <div id='back-to-index'>Click here to retrun to index</div>
  `;
  $('#root').html(content);
}

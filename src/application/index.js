const getCookie = require('./helpers/getCokie').getCookie;
const baseUrl = 'http://' + $(location).attr('hostname') + ':8000';
const csrftoken = getCookie('csrftoken');

function router(route) {
  switch(route) {
    case 'auth':
      handle_index();
      break;
    case 'todo':
      handle_todo();
      break;
    case 'logout':
      handle_index();
      break;
  }
};

function handle_index() {
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
  $('#root').html(content);
};

function handle_todo() {
  const url = baseUrl + '/todo/';
  const  content = `
    <button id='logout'>Logout</button>
    <br />
    <div class='todos-container'>
      <h1>Simple ToDo form</h1>
      <form id='form-todo' method='POST' action="${url}" >
        <input id='input-title name='title' type='text' placeholder='write your todo' required >
        <button type='submit'>Submit</button>
        <input type='hidden' name='csrfmiddlewaretoken' value='${getCookie("csrftoken")}'>
      </form>
    </div>
  `;
  $('#root').html(content);
  console.log('start')
  $.ajax({
    type: 'GET',
    url: url,
    //TODO handle with authorization permissions
    //data: `Authorization: Token ${sessionStorage.getItem('auth_token')}`,
    success: function(data) {
      console.log(data);
    }
  })
};

$(function() {
  if (sessionStorage.auth_token) {
    router('todo');
  } else {
    router('auth');
  };

  $(document).on('submit', '#form-registartation', function(e) {
    e.preventDefault();

    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        dataType: 'JSON',
        success: function(data) {
          if (data.username)  {
            sessionStorage.setItem('auth_token', data.auth_token);
            router('todo');
          }
        },
    });
  });

  $(document).on('submit', '#form-login', function(e) {
    e.preventDefault();

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      dataType: 'JSON',
      success: function(data) {
        if (data.username) {
          sessionStorage.setItem('auth_token', data.auth_token);
          router('todo');
        };
      }
    });
  });

  $(document).on('click','#logout', function(e) {
    sessionStorage.removeItem('auth_token');
    router('logout');
  });

});

import { baseAPIUrl, csrftoken } from '../constants';

export default () => {
  const dateRangePicker = document.querySelector('.daterangepicker');
  if (dateRangePicker) dateRangePicker.remove();
  const url = baseAPIUrl + '/auth/';
  const loginUrl = url + 'login/';

  const headerTitle = `
    <h4>ToDo Auth</h4>
  `;

  const content = `
    <div id="auth-content">
    <br />
    <div id='info-content'>
      <h2>Welcome to the ToDo application!</h2>
      <ul>
      <li><p>Here you can create your own todo list!</p></li>
      <li><p>Planning your tasks and check the progress</p></li>
      <li><p>Just Sign Up or Sign In if you already have account</p></li>
      </ul>
      <h2>Be more efficient with Django ToDo Application!</h2>
    </div>
    <div id='form-container'>
      <div id='header-form-container'>
        <button id='switch-to-sign-in'>Sign In</button>
        <button id='switch-to-sign-up'>Sign Up</button>
      </div>
      <div id='registration-container'>
        <h1></h1>
        <form id='form-registration' method='POST' action="${url}" novalidate>
          <input class='input-username' name='username' type='text' placeholder='write your username'>
          <input class='input-email' name='email' type='email' placeholder='write your email'>
          <input class='input-password' name='password' type='password' placeholder='write your password'>
          <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
          <button type='submit'>Submit</button>
        </form>
        <div id='registration-errors'></div>
      </div>
      <div id='login-container' class='active-form'>
        <h1></h1>
        <form id='form-login' method='POST' action="${loginUrl}" >
          <input class='input-username' name='username' type='text' placeholder='write your username or email'>
          <input class='input-password' name='password' type='password' placeholder='write your password'>
          <a href="/restore-password">Forgot a password?</a>
          <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
          <button type='submit'>Submit</button>
        </form>
        <div id='login-errors'></div>
      </div>
    </div>
    </div>
  `;

  document.querySelector('#header-end').innerHTML = '';
  document.querySelector('#header-title').innerHTML = headerTitle;
  document.querySelector('#main-content').innerHTML = content;
};
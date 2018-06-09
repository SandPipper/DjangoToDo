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

  document.querySelector('#header-end').innerHTML = '';
  document.querySelector('#header-title').innerHTML = headerTitle;
  document.querySelector('#main-content').innerHTML = content;
};
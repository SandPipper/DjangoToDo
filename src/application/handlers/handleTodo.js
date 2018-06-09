import 'daterangepicker';
import router from '../router';
import user from '../helpers/getUser';
import todoRepr from '../helpers/todoRepr';
import categorieRepr from '../helpers/categorieRepr';
import { baseAPIUrl, csrftoken } from '../constants';

export default () => {
  const url = baseAPIUrl + '/todo/';

  const headerTitle = `
    <h4>ToDo WorkSpace</h4>
  `;

  const headerEnd = `
    <button id='logout'>Log Out</button>
  `;

  $('#header-title').html(headerTitle);
  $('#header-end').html(headerEnd);

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
      const todos = todoRepr(data);
      const categories = categorieRepr(todos);
      const content = `
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

      $('#main-content').html(content);
    
      $('#daterangepicker').daterangepicker({
        locale: {
          format: 'YYYY-MM-DD'
        },
      });
    }
    });
};
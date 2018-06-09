import router from '../router';
import { baseAPIUrl } from '../constants';

export default (data, queryParams) => {
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

  const headerTitle = `
    <h4>Confirm your account</h4>
  `;

  const headerEnd = `
    <button id='logout'>Log Out</button>
  `;

  const content = `
    <div>
      <h3>Please activate your account</h3>
      <p>Dear, <strong>${data.username}</strong>, activation link sended to your email - <strong>${data.email}</strong></p>
      <div id='resend-activation-email'>Click here for resending of activation link</div>
    </div>
  `;
  $('#header-title').html(headerTitle);
  $('#header-end').html(headerEnd);
  $('#main-content').html(content);
}
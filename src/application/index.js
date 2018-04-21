// require('daterangepicker');
import 'daterangepicker';
import { router } from './router';

$(function() {
  // $.ajax({

  // })
  if (localStorage.auth_token) {
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
            localStorage.setItem('auth_token', data.auth_token);
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
          localStorage.setItem('auth_token', data.auth_token);
          router('todo');
        };
      }
    });
  });

  $(document).on('click','#logout', function(e) {
    localStorage.removeItem('auth_token');
    router('logout');
  });

  $(function() {
    $('#daterangepicker').daterangepicker();
  });

  $(document).on('submit', '#form-todo', function(e) {
      e.preventDefault();
      console.log($(this).serialize());
      $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: $(this).serialize(),
          dataType: 'JSON',
          headers: {
              'Authorization': `Token ${sessionStorage.getItem('auth_token')}`
          },
          success: function(data) {
              $(this)[0].reset();
              $('#todos').append(data);
          },
      });


  });

});

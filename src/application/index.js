import '../assets/sass/style.scss';
import 'daterangepicker';
import router from './router';
import todoRepr from './helpers/todoRepr';
import handleErrors from './helpers/handleErrors';

$(function() {
  if (localStorage.auth_token) {
    router('todo');
  } else {
    router('auth');
  };

  $(document).on('submit', '#form-registartation', function(e) {
    e.preventDefault();
    const this_form = this;

    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        dataType: 'JSON',
        error: function(error) {
          handleErrors(this_form, error.responseJSON.message);
        },
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
    const this_form = this;

    $.ajax({
      type: $(this).attr('method'),
      url: $(this).attr('action'),
      data: $(this).serialize(),
      dataType: 'JSON',
      error: function(error) {
        handleErrors(this_form, error.responseJSON.message);
      },
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

  $(document).on('submit', '#form-todo', function(e) {
      e.preventDefault();
      const this_form = this;
      const formData = $(this).serializeArray();
      const date = formData[1].value.split(' - ');
      const data = {
        csrfmiddlewaretoken: formData[2].value,
        title: formData[0].value,
        date_start: date[0],
        date_end: date[1],
      };
      $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: data,
          dataType: 'JSON',
          headers: {
              'Authorization': `Token ${localStorage.getItem('auth_token')}`
          },
          error: function(error) {
            handleErrors(this_form, error.responseJSON.message);
          },
          success: function(data) {

              $(this_form)[0].reset();
              $(`#form-todo input`).each(function(){
                $(this).css({ borderColor: '#f2f2f2', color: 'grey' });
              });
              $('#todo-errors').html('');


              $('#todo-errors').hide()

              const data_content = todoRepr(data);
              $('#todos').empty().append(data_content);
          },
      });


  });

});

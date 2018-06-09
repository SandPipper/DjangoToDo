import '../assets/sass/style.scss';
import 'daterangepicker';
import router from './router';
import todoRepr from './helpers/todoRepr';
import categorieRepr from './helpers/categorieRepr';
import handleErrors from './helpers/handleErrors';
import user from './helpers/getUser';
import mainContainerHandler from './mainContainer';
import { baseAPIUrl } from './constants';

  mainContainerHandler();
  router(window.location.pathname);

  $(document).on('submit', '#form-registartation', function(e) {
    e.preventDefault();
    const this_form = this;

    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        error: function(error) {
          console.log('test_error', error);
          handleErrors(this_form, error.responseJSON.message);
        },
        success: function(data) {
          if (data.username)  {
            localStorage.setItem('user', JSON.stringify(data));
            if (data.is_active) {
              router('/todo');
            } else {
              router('/activate');
            }
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
      error: function(error) {
        handleErrors(this_form, error.responseJSON.message);
      },
      success: function(data) {
        if (data.username) {
          console.log('test_data', data)
          localStorage.setItem('user', JSON.stringify(data));
          if (data.is_active) {
            router('/todo');
          } else {
            router('/activate', data);
          }
        };
      }
    });
  });

  $(document).on('click','#logout', function(e) {
    localStorage.removeItem('user');
    router('/logout');
  });

  $(document).on('submit', '#form-todo', function(e) {
      e.preventDefault();
      const this_form = this;
      const formData = $(this).serializeArray();
      const date = formData[2].value.split(' - ');
      const data = {
        csrfmiddlewaretoken: formData[3].value,
        title: formData[0].value,
        body: formData[1].value,
        date_start: date[0],
        date_end: date[1],
      };
      $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: data,
          headers: {
              'Authorization': `Token ${user().auth_token}`
          },
          error: function(error) {
            console.log('error', error)
            handleErrors(this_form, error.responseJSON.message);
          },
          success: function(data) {

              $(this_form)[0].reset();
              $(`#form-todo input`).each(function(){
                $(this).css({ borderColor: '#f2f2f2', color: 'grey' });
              });
              $('#todo-errors').html('');
              const data_content = todoRepr(data);
              const categories = categorieRepr(data_content);

              $('.categories').html(categories);
          },
      });


  });

  $(document).on('click', '.todo_rm', function() {

    const title = $(this).prevAll('h3');
    const data = {
      title: title.text(),
    }
    const url = baseAPIUrl + '/todo/';

    $.ajax({
      type: 'DELETE',
      url: url,
      data: data,
      headers: {
        'Authorization': `Token ${user().auth_token}`
      },
      error: function(error) {
        console.log('rm_error', error);
      },
      success: function(data) {
        title.parent().remove();
      }
    })
  });



  $(document).on('click', '#back-to-index', function() {
    router();
  });

  $(document).on('click', '#resend-activation-email', function() {
    const url = baseAPIUrl + '/activate-user/';
    $.ajax({
      type: 'GET',
      url: url,
      data: {
        email: user().email,
      },
      error: function(error) {
        console.log('resend-activ-email', error);
        if (error.status === 401) return router();
      },
      success: function() {
        return router();
      }
    })
  });
  
  $(document).on('click', '.categorie-button', function() {
    const active = $('.categorie-active');
    const isSecondClick = $(this).parent().hasClass('categorie-active');

    if (active) {
      $(active).removeClass('categorie-active');
    }
    if (!isSecondClick) {
      $(this).parent().addClass('categorie-active');
    }
    
  });

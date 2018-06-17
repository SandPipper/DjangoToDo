import '../assets/sass/style.scss';
import 'daterangepicker';
import router from './router';
import todoRepr from './helpers/todoRepr';
import categorieRepr from './helpers/categorieRepr';
import handleErrors from './helpers/handleErrors';
import user from './helpers/getUser';
import showModalRM from './helpers/showModalRM';
import showModalEdit from './helpers/showModalEdit';
import mainContainerHandler from './mainContainer';
import { baseAPIUrl } from './constants';

// render main content
mainContainerHandler();
// trigger router system
router(window.location.pathname);


// actions
/************************************************************/

$(document).on('submit', '#form-registration', function(e) {
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
            $(`#form-todo input, textarea`).each(function(){
              $(this).css({ borderColor: '#f2f2f2', color: 'grey' });
            });
            $('#todo-errors').html('');
            const data_content = todoRepr(data);
            const categories = categorieRepr(data_content);

            $('.categories').html(categories);
        },
    });


});

$(document).on('click', '.todo_rm', function(e) {
  const selector = e.handleObj.selector.slice(1, e.handleObj.selector.length);
  const id = $(this).parent('.todo').data('id');
  const data = {
     id,
  }
  const url = baseAPIUrl + '/todo/';
  if ($('.del-target')) $('.del-target').removeClass('del-target');

  $(this).parent('.todo').addClass('del-target');
  showModalRM(selector, data, url);
});

$(document).on('click', '.button-yes.button-todo_rm', function() {
  const url = $(this).data('url');
  const data = $(this).data('obj');
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
      $('.del-target').remove();
      $('.modal').remove();
    }
  });
});

$(document).on('click', '.button-no', function() {
  $('.del-target').removeClass('del-target');
  $('.edit-target').removeClass('edit-target');
  $('.modal').remove();
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
  const isSecondClick = $(this).parents('.categorie').hasClass('categorie-active');

  if (active) {
    $(active).removeClass('categorie-active');
  }
  if (!isSecondClick) {
    $(this).parents('.categorie').addClass('categorie-active');
  }
});

$(document).on('click', '#switch-to-sign-in', function() {
  const signInForm = $('#login-container');
  const signUpForm = $('#registration-container');
  signInForm.addClass('active-form');
  signUpForm.removeClass('active-form')
});

$(document).on('click', '#switch-to-sign-up', function() {
  const signInForm = $('#login-container');
  const signUpForm = $('#registration-container');
  signUpForm.addClass('active-form');
  signInForm.removeClass('active-form')
});

$(document).on('click', '.todo_open', function() {
  const todo = $(this).parent('.todo');
  const text = todo.find('p');
  text.hasClass('open-todo-body') ? text.removeClass('open-todo-body') : text.addClass('open-todo-body');
  todo.hasClass('open-todo') ? todo.removeClass('open-todo') : todo.addClass('open-todo');
});

$(document).on('click', '.todo-edit', function(e) {

  const todo = $(this).parents('.todo')
  todo.addClass('edit-target');

  const title = todo.children('h3').text().trim();
  const body = todo.children('p').text().trim();
  const dateRange = todo.find('h5');
  const dateStart = dateRange[0].innerHTML.split(': ')[1];
  const dateEnd = dateRange[1].innerHTML.split(': ')[1];
  const categorie = todo.parents('.categorie').find('.categorie-header h2').text();

  const data = {
    title,
    body,
    start_date: dateStart,
    end_date: dateEnd,
    categorie
  };

  const url = baseAPIUrl + '/todo/';
  const selector = e.handleObj.selector.slice(1, e.handleObj.selector.length);

  showModalEdit(selector, data, url);

});

$(document).on('click', '.button-yes.button-todo-edit', function() {
  const form = $('.modal-todo-edit form');
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: form.serialize(),
    headers: {
        'Authorization': `Token ${user().auth_token}`
    },
    error: function(error) {
      console.log('error', error)
      handleErrors(form, error.responseJSON.message);
    },
    success: function(data) {
      const editedTodo = $('.edit-target');
      editedTodo.children('h3').text(data.title);
      editedTodo.children('p').text(data.body);

      const startDate = `Start date: ${data.start_date}`;
      const endDate = `End date: ${data.end_date}`;
      editedTodo.find('h5')[0].innerHTML = startDate;
      editedTodo.find('h5')[1].innerHTML = endDate;
      $('.modal').remove();
      $('.edit-target').removeClass('edit-target');
    }, 
  })

});

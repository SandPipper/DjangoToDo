import handleErrors from "../helpers/handleErrors";
import Router from "../Router";

$(document).on('click', '#switch-to-sign-in', function() {
  const signInForm = $('#login-container');
  const signUpForm = $('#registration-container');
  signInForm.addClass('active-form');
  signUpForm.removeClass('active-form');
});

$(document).on('click', '#switch-to-sign-up', function() {
  const signInForm = $('#login-container');
  const signUpForm = $('#registration-container');
  signUpForm.addClass('active-form');
  signInForm.removeClass('active-form');
});

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
            Router.navigate('/todo');
          } else {
            Router.navigate('/activate');
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
          Router.navigate('/todo');
        } else {
          Router.navigate('/activate', data);
        }
      };
    }
  });
});

$(document).on('click','#logout', function(e) {
  localStorage.removeItem('user');
  Router.navigate('/logout');
});

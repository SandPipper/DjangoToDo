import Router from "../Router";
import {baseAPIUrl} from "../constants";
import User from "../helpers/getUser";
import handleErrors from "../helpers/handleErrors";

$(document).on('click', '#back-to-index', function() {
  Router.navigate();
});

$(document).on('submit', '#form-restore-password-step-1', function(e) {
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
           const content = `
            <p>Please check your email</p>
          `;

           document.querySelector('#main-content').innerHTML = content;
        }
    });
});

$(document).on('click', '#resend-activation-email', function() {
  const url = baseAPIUrl + '/activate-user/';
  $.ajax({
    type: 'GET',
    url: url,
    data: {
      email: User().email,
    },
    error: function(error) {
      console.log('resend-activ-email', error);
      if (error.status === 401) return Router.navigate();
    },
    success: function() {
      return Router.navigate();
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
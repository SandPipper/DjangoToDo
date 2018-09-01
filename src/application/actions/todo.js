import User from "../helpers/getUser";
import handleErrors from "../helpers/handleErrors";
import todoRepr from "../helpers/todoRepr";
import categorieRepr from "../helpers/categoryRepr";
import { baseAPIUrl } from "../constants";
import showModalRM from "../helpers/showModalRM";

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
            'Authorization': `Token ${User().auth_token}`
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
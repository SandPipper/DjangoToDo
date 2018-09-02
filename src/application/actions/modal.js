import User from "../helpers/getUser";
import handleErrors from "../helpers/handleErrors";
import {baseAPIUrl} from "../constants";
import showModalEdit from "../helpers/showModalEdit";

$(document).on('click', '.todo_open', function() {
  const todo = $(this).parent('.todo');
  const text = todo.find('p');
  const all = $('header,footer,.todos-header,.todo').not(todo);
  all.toggleClass('hide');
  $('body,html').animate({ scrollTop: todo.offset().top / 2 }, 300);
  text.toggleClass('open-todo-body');
  todo.toggleClass('open-todo');
});

$(document).on('click', '.todo-edit', function(e) {

  const todo = $(this).parents('.todo');
  todo.addClass('edit-target');
  // TODO refactor this to Model class
  const id = todo.data('id');
  const title = todo.children('h3').text().trim();
  const body = todo.children('p').text().trim();
  const dateRange = todo.find('h5');
  const dateStart = dateRange[0].innerHTML.split(': ')[1];
  const dateEnd = dateRange[1].innerHTML.split(': ')[1];
  const auto_ended = !!todo.find('span')[0].innerHTML;
  const category = todo.parents('.category').find('.category-header h2').text();

  const data = {
    id,
    title,
    body,
    start_date: dateStart,
    end_date: dateEnd,
    auto_ended,
    category
  };

  const url = baseAPIUrl + '/todo/';
  const selector = e.handleObj.selector.slice(1, e.handleObj.selector.length);

  showModalEdit(selector, data, url);

});

$(document).on('click', '.button-yes.button-todo_rm', function() {
  const url = $(this).data('url');
  const data = $(this).data('obj');
  $.ajax({
    type: 'DELETE',
    url: url,
    data: data,
    headers: {
      'Authorization': `Token ${User().auth_token}`
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

$(document).on('click', '.button-yes.button-todo-edit', function() {
  const form = $('.modal-todo-edit form');
  const disabled = form.find(':input:disabled').removeAttr('disabled');
  const data = form.serializeArray();
  disabled.attr('disabled', 'disabled');
  $.ajax({
    type: form.attr('method'),
    url: form.attr('action'),
    data: data,
    headers: {
        'Authorization': `Token ${User().auth_token}`
    },
    error: function(error) {
      console.log('error', error)
      handleErrors(form, error.responseJSON);
    },
    success: function(data) {
      const editedTodo = $('.edit-target');
      editedTodo.children('h3').html('<i class="fa fa-pencil todo-edit" aria-hidden="true"></i>' + ' ' + data.title);
      editedTodo.children('p').text(data.body);
      const startDate = `Start date: ${data.date_start}`;
      const endDate = `End date: ${data.date_end}`;
      editedTodo.find('h5')[0].innerHTML = startDate;
      editedTodo.find('h5')[1].innerHTML = endDate;
      $('.modal').remove();
      $('.edit-target').removeClass('edit-target');
    },
  })
});

$(document).on('click', '.button-no', function() {
  $('.del-target').removeClass('del-target');
  $('.edit-target').removeClass('edit-target');
  $('.modal').remove();
});


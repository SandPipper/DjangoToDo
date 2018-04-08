$(function() {

  const content = `
    <div class='form-container'>
      <h1>Simple Form</h1>
      <form id='form-message'>
        <input id='input-message' type='text' placeholder='writte your message'>
        <button id='button-message' type='submit'>Submit</button>
      </form>
    </div>
    <div id='errors'></div>
    <div id='messages'></div>
  `;

  $('#root').append(content);

  $('#form-message').on('submit', function(evt) {
    evt.preventDefault();
    if ($('#input-message').val().length) {
      $('#errors').html('');
      $('#messages').append(`<p class='message'>${$('#input-message').val()}</p>`);
      $(this)[0].reset();
    } else {
      $('#errors').html('').append('<p>You need writte something in form!</p>')
    }
  });

  $(document).on('click', '.message' ,function() {
    $(this).remove();
  });

});
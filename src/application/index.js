$(function() {

  const content = `
    <br />
    <div class='form-container'>
    <h1>Simple Form</h1>
      <form id='form-message'>
        <input id='input-message' type='text' placeholder='writte your message'>
        <button id='button-message' type='submit'>Submit</button>
      </form>
    </div>
    <div id='errors' hidden><p>You need writte something in form!</p></div>
    <div id='messages'></div>
  `;

  $('#root').append(content);

  $('#form-message').on('submit', function(evt) {

    evt.preventDefault();

    const inputVal = $('#input-message').val();

    if (inputVal) {

      $('#errors').hide();

      $('#messages').append(
        `<p class='message'>${inputVal}</p>`
      );
      
      $(this)[0].reset();
      // $('#input-message').val('');

    } else {

      $('#errors').show();

    }
  }); 

  $(document).on('click', '.message' ,function() {
    $(this).remove();
  });

});

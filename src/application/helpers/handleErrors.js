export default (thisForm, errorMessage) => {
  console.log('thisForm', thisForm)
  // take element for errors output for this form
  const errorOutput = $(thisForm).next();
  // unhightlight fields in form
  $(thisForm).find('input, textarea').each(function() {
    $(this).css({ borderColor: '#f2f2f2', color: 'grey' });
  })
  // I think better rewrite a little rewrite respone API to avoid this if statement
  if (typeof errorMessage !== 'string') {
  
    // construct html string representation for errors output and highlight field with errors;
    errorMessage = Object.keys(errorMessage).reduce((acc, err) => {
      // find needed field
      let field = $(thisForm).children(`
          ${err === 'body' ? 'textarea' : 'input'}[name=${err !== 'date_start' ? err : 'date_range' }]
        `);
      // highlight field with errors
      field.css({ borderColor: '#e80909', color: '#ff0000' }); 

      acc += errorMessage[err].reduce((allMess, mess) => {
        if (err === 'date_end') return allMess;
        allMess += `<div class='errors'><p>${err !== 'date_start' ? err : 'date_range' } - ${mess}</p></div>`;
        return allMess;
      }, '');

      return acc;
    }, '');
  }
  errorOutput.show().html(errorMessage);
};
import { baseAPIUrl, csrftoken } from '../constants';

export default (selector, data, url) => {
  const isStarted = data.categorie === 'Started';
  const modalWindow = `
    <div class="modal modal-${selector}">
      <h2>Edit your ToDo</h2>
      <div class='todos-form'>
        <form id='form-todo' method='PUT' action="${url}" >
          <input id='input-title' name='title' type='text' placeholder='write status to your todo' value='${data.title}'>
          <textarea ud='input-body' name='body' type='text' placeholder='write your todo' value='${data.body}'>${data.body}</textarea>
          <input id='daterpicker-start' name='date_start' type='text' placeholder='Choice start date of todo' value='${data.start_date}' ${isStarted && 'disabled'}>
          <input id='datepicker-end' name='date_end' type='text' placeholder='Choice end date of todo' value='${data.end_date}'>
          <div id='auto-ended-wrap'>
            <input id='auto-ended' name='auto_ended' type='checkbox'>
            <label>Do you need that after date-end is come, your todo move to Ended?</label>
          </div>   
          <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
          <input type='hidden' name='id' value='${data.id}'>
        </form>
        <div id='todo-errors'></div>
      </div>
      <div class="choice-buttons">
        <button class="modal-button button-yes button-${selector}">Accept</button>
        <button class="modal-button button-no button-${selector}">Cancel</button>
      </div>
    </div>
  `;

  $(document.body).append(modalWindow);
}
export default (selector, data, url) => {
  const obj = JSON.stringify(data);
  const modalWindow = `
    <div class="modal modal-${selector}">
      <h2>Are you sure that you want it?</h2>
      <div class="choice-buttons">
        <button class="modal-button button-yes button-${selector}" data-obj='${obj}' data-url="${url}">Accept</button>
        <button class="modal-button button-no button-${selector}">Cancel</button>
      </div>
    </div>
  `;
  $(document.body).append(modalWindow);
}
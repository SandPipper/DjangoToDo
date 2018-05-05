export default data => data.reduce((acc, todo) => {
  acc += `
  <div class='todo'>
      <h3>${todo.title}</h3>
      <div class='todo-body'>
        <h5>Start date: ${todo.date_start}</h5>
        <h5>End date: ${todo.date_end}</h5>
      </div>
  </div>
  `;
  return acc;
}, '');
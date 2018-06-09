export default data => data.reduce((acc, todo) => {
  if (!todo.title) {
    acc['TYPES'] = todo;
    return acc;
  }
  const todo_template = `
  <div class='todo'>
      <h3>${todo.title}</h3>
      <p>${todo.body}</p>
      <div class='todo-body'>
        <h5>Start date: ${todo.date_start}</h5>
        <h5>End date: ${todo.date_end}</h5>
      </div>
      <button class='todo_rm' type='delete'>Remove</button>
  </div>
  `;
  acc[todo.status] ? acc[todo.status] += todo_template : acc[todo.status] = todo_template;
  return acc;
}, {});
export default data => data.reduce((acc, todo) => {
  if (!todo.title) {
    acc['TYPES'] = todo;
    return acc;
  }
  const todo_template = `
  <div class='todo'>
      <button class='todo_rm todo-menu-button' type='delete'>X</button>
      <button class='todo_open todo-menu-button'>☐</button>
      <button class='todo_turn_off todo-menu-button'>_</button>
      <h3>${todo.title}</h3>
      <p>${todo.body}</p>
      <div class='todo-body'>
        <h5>Start date: ${todo.date_start}</h5>
        <h5>End date: ${todo.date_end}</h5>
      </div>
      
  </div>
  `;
  acc[todo.status] ? acc[todo.status] += todo_template : acc[todo.status] = todo_template;
  return acc;
}, {});
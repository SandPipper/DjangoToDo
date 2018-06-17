export default data => data.reduce((acc, todo) => {
  if (!todo.title) {
    acc['TYPES'] = todo;
    return acc;
  }
  const isNotEnded = todo.status !== 'Ended';
  const todo_template = `
  <div class='todo' data-id=${todo.id}>
      <button class='todo_rm todo-menu-button' type='delete'>X</button>
      <button class='todo_open todo-menu-button'>☐</button>
      ${isNotEnded ? "<button class='todo_track todo-menu-button'><i class='fa fa-eye' aria-hidden='true'></i></button>" : ''}
      <h3>
        ${isNotEnded ? "<i class='fa fa-pencil todo-edit' aria-hidden='true'></i>" : ''}
        ${todo.title}
      </h3>
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
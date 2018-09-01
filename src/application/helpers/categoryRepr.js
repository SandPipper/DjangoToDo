export default todos => {
  const TYPES = todos.TYPES;

  return TYPES.map(type => {
    const categories = Object.keys(todos);
    const category = type[0];
      return `
        <div class="category ${category.toLowerCase().replace(/ /g, '_')}">
          <div class="category-header">
            <h2>${category}</h2>
            <div class="category-button">
              <div class="triangle"></div>
            </div>
          </div>
          <div class='todos'>${categories.indexOf(category) >= 0 ? todos[category] : ''}</div>
        </div>
      `;
  });
}
  

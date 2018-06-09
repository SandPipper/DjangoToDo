export default todos => {
  const TYPES = todos.TYPES;

  return TYPES.map(type => {
    const categories = Object.keys(todos);
    const categorie = type[0];
    if (categories.indexOf(categorie) >= 0) {
      return `
        <div class="categorie ${categorie.toLowerCase().replace(/' '/g, /'_'/)}">
          <h3>${categorie}</h3>
          <div class='todos'>${todos[categorie]}</div>
        </div>
      `;
    } else {
      return `
        <div class="categorie ${categorie.toLowerCase().replace(/' '/g, /'_'/)}">
          <h3>${categorie}</h3>
          <div class='todos'></div>
        </div>
      `;
    }
  });
}
  

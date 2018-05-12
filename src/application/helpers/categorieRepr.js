export default todos => Object.keys(todos).sort((a, b) => b.length - a.length).map(category => `
<div class="categorie ${category.toLowerCase().replace(/' '/g, /'_'/)}">
  <h3>${category}</h3>
  <div class='todos'>${todos[category]}</div>
</div>
`)
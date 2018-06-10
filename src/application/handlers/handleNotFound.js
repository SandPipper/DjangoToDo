export default (user) => {
  const content = `
    <div>
      <h3>Not found</h3>
      <div id='back-to-index'>Click here to retrun to index</div>
    </div>
  `;
  const headerTitle = `
    <h4>Page is not found</h4>
  `;
  const headerEnd = `
    ${user ? '<button id="logout">Log Out</button>' : '<button id="logout">Log In</button>'}
  `;

  document.querySelector('#header-title').innerHTML = headerTitle;
  document.querySelector('#header-end').innerHTML = headerEnd;
  document.querySelector('#main-content').innerHTML = content;
}
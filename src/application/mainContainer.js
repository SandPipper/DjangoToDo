export default () => {
  const blocks = ['header', 'main', 'footer'];
  const content = blocks.reduce((acc, block) => {
    let blockContent;

    switch (block) {
      case 'header':
        blockContent = `
          <div id="header-logo">
            <h1>ToDo</h1>
          </div>
          <div id="header-title">
          </div>
          <div id="header-end">
          </div>
        `;
        break;
      case 'main':
        blockContent = ``;
        break;
      case 'footer':
        blockContent = '<h2>Copyright © 2018</h2>';
        break;
    }
    
    acc += `
      <${block}>
        <div class="wrap">
          <div id="${block}-content">
            ${blockContent}
          </div>
        </div>
      </${block}>
    `;
    return acc;
  }, '');

  const root = document.querySelector('#root');
  root.innerHTML = content;
}
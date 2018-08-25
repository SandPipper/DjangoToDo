import { baseAPIUrl, csrftoken } from "../constants";

export default () => {
    const url = baseAPIUrl + '/restore-password/';

    const headerTitle = `
       <h4>Restore password</h4>  
    `;

    const headerEnd = `
        <button id="logout">Log In</button>
    `;

    const content = `
        <form id='form-restore-password-step-1' method='POST' action="${url}" >
          <input class='input-username' name='email' type='email' placeholder='write your email'>
          <input type='hidden' name='csrfmiddlewaretoken' value='${csrftoken}'>
          <button type='submit'>Submit</button>
        </form>
        <div id='restore-password-step-1-errors'></div>
    `;

    document.querySelector('#header-end').innerHTML = headerEnd;
    document.querySelector('#header-title').innerHTML = headerTitle;
    document.querySelector('#main-content').innerHTML = content;
}
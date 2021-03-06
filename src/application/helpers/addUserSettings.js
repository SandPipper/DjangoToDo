// handle user settings
import User from "./getUser";

export default () => {
    const headerLogo = $('#header-logo');
    const userSettings = headerLogo.children('#user-settings');
    const _user = User();
    if (_user) {
        if (userSettings.length) return
        const username = _user.username;
        headerLogo.prepend(`
            <h3 id="user-settings">
                <i class='fa fa-user' aria-hidden='true'></i>
                ${username[0].toUpperCase() + username.slice(1, username.length)}
            </h3>
        `);
    } else {
        userSettings.remove();
    }
}

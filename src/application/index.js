import '../assets/sass/style.scss';
import 'daterangepicker';
import Router from './Router';
import mainContainerHandler from './mainContainer';
import handleIndex from "./handlers/handleIndex";
import handleNotFound from "./handlers/handleNotFound";
import addUserSettings from "./helpers/addUserSettings";
import handleRestorePassword from "./handlers/handleRestorePassword";
import handleTodo from "./handlers/handleTodo";
import handleActivate from "./handlers/handleActivate";
import * as actions from './actions';
import getQueryParams from "./helpers/getQueryParams";

// added route for 404 page
Router.defaultRoute = data => {
    handleNotFound(data);
}

Router.addDoAlways(addUserSettings);

Router.addRoute(['/', '/index', '/auth'], handleIndex, data => {
  if (data && data.is_active === false) return '/activate';
  if (data && data.is_active) return '/todo';
});

Router.addRoute('/restore-password', handleRestorePassword, data => {
  if (data) return '/';
});

Router.addRoute('/todo', handleTodo, data => {
  if (data && data.is_active === false) return '/activate';
  if (!data) return '/';
});

Router.addRoute('/logout', handleIndex, () => {}, '/');

Router.addRoute('/activate', handleActivate, data => {
  const queryParams = getQueryParams(window.location.search);
  if (!data || data.is_active && !queryParams.token) return '/';
});

// render main content
mainContainerHandler();
// trigger router system
Router.navigate(window.location.pathname);
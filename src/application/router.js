import handleActivate from './handlers/handleActivate';
import handleIndex from './handlers/handleIndex';
import handleTodo from './handlers/handleTodo';
import handleNotFound from './handlers/handleNotFound';
import handleRestorePassword from './handlers/handleRestorePassword';
import getQueryParams from './helpers/getQueryParams';
import addUserSettings from './helpers/addUserSettings';

export default function router(route='/', data=JSON.parse(localStorage.getItem('user'))) {
  switch(route) {
    case '/':
    case '/index':
    case '/auth':
      if (data && data.is_active === false) return router('/activate');
      if (data && data.is_active) return router('/todo');
      history.pushState('', 'index', '/index');
      handleIndex();
      break;

    case '/restore-password':
      if (data) return router();
      handleRestorePassword() ;
      break;

    case '/todo':
      if (data && data.is_active === false) return router('/activate');
      if (!data) return router();
      history.pushState('', 'todo', '/todo');
      handleTodo();
      break;

    case '/logout':
      history.pushState('', 'index', '/index');
      handleIndex();
      break;

    case '/activate':
      if (!data) return router();
      const queryParams = getQueryParams(window.location.search);
      handleActivate(data, queryParams);
      break;

    default:
      history.pushState('', 'not found', '/not-found');
      handleNotFound(data);
      break;
  }
  addUserSettings();
};
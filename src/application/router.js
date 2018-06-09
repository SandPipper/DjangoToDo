import handleActivate from './handlers/handleActivate';
import handleIndex from './handlers/handleIndex';
import handleTodo from './handlers/handleTodo';
import handleNotFound from './handlers/handleNotFound';
// import handleHeader from './handlers/handleHeader';
import getQueryParams from './helpers/getQueryParams';

export default function router(route='/', data=JSON.parse(localStorage.getItem('user'))) {
  console.log('router ', window.location);
  console.log('router route', route);
  switch(route) {
    case '/':
    case '/auth':
      if (data && data.is_active === false) return router('/activate');
      if (data && data.is_active) return router('/todo');
      history.pushState('', 'index', '/index');
      handleIndex();
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
      // history.pushState('', 'activate', `/activate`);
      handleActivate(data, queryParams);
      break;
    default:
      history.pushState('', 'not found', '/not-found');
      handleNotFound(data);
      break;
  }
};
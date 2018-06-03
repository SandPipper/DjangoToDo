import { handle_index, handle_todo, handle_activate, handle_not_found } from './routes';
import getQueryParams from './helpers/getQueryParams';

export default function router(route='/', data=JSON.parse(localStorage.getItem('user'))) {
  console.log('router ', window.location)
  console.log('router route', route)
  switch(route) {
    case '/':
    case '/auth':
      if (data && data.is_active === false) return router('/activate');
      if (data && data.is_active) return router('/todo');
      history.pushState('', 'index', '/index');
      handle_index();
      break;
    case '/todo':
      if (data && data.is_active === false) return router('/activate');
      if (!data) return router();
      history.pushState('', 'todo', '/todo');
      handle_todo();
      break;
    case '/logout':
      history.pushState('', 'index', '/index');
      handle_index();
      break;
    case '/activate':
      if (!data) return router();
      const queryParams = getQueryParams(window.location.search);
      // history.pushState('', 'activate', `/activate`);
      handle_activate(data, queryParams);
      break;
    default:
      history.pushState('', 'not found', '/not-found');
      handle_not_found();
      break;
  }
};
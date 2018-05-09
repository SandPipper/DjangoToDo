import { handle_index, handle_todo } from './routes';

export default function router(route) {
  switch(route) {
    case '/auth':
      history.pushState('', 'index', '/index');
      handle_index();
      break;
    case '/todo':
      history.pushState('', 'todo', '/todo');
      handle_todo();
      break;
    case '/logout':
      history.pushState('', 'index', '/index');
      handle_index();
      break;
  }
};
import { handle_index, handle_todo } from './routes';

export default function router(route) {
  switch(route) {
    case 'auth':
      handle_index();
      break;
    case 'todo':
      handle_todo();
      break;
    case 'logout':
      handle_index();
      break;
  }
};
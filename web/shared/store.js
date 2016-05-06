import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

export default function create(initial) {
  const createMiddlewareStore = applyMiddleware(thunk)(createStore);
  return createMiddlewareStore(reducer, initial);
}

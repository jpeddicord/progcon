import { createStore, compose, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import reducer from './reducer';

export default function create(initial) {
  return createStore(reducer, initial, compose(
    applyMiddleware(thunk),
    typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f,
  ));
}

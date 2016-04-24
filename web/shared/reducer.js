import { createStore, applyMiddleware, combineReducers } from 'redux';
import contests from './modules/contests';

export default combineReducers({
  contests,
});

import { combineReducers } from 'redux';
import contests from './modules/contests';
import problems from './modules/problems';

export default combineReducers({
  contests,
  problems,
});

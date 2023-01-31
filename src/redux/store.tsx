import {combineReducers, createStore} from 'redux';
import {UserReducer} from './reducers/userReducers';

const reducers = combineReducers({
  userReducer: UserReducer,
});

const store = createStore(reducers);

export default store;

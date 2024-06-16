import { combineReducers } from 'redux';
import someReducer from './someReducer.js'; // Import your individual reducers

const rootReducer = combineReducers({
  some: someReducer, // Add your individual reducers here
});

export default rootReducer;
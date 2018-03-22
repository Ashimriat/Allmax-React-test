import {combineReducers} from 'redux';
import tasksList from './tasksList'
import tasksFilter from './tasksFilter';

export default combineReducers({
	tasksList,
	tasksFilter
});
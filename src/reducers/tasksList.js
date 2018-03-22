import LocalStorageManager from '../classes/LocalStorageManager';


const lsManager = new LocalStorageManager();
const createNewTaskObj = function() {
	function S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1);}
    let newTaskId = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    let newTaskObj = {
        id: newTaskId,
        title: '',
        description: '',
        importance: '',
        deadlineDate: '',
        completionDate: '',

        isCompleted: false,
        isEditing: true,
        isCreated: false
    };
    return newTaskObj;
}
const initialState = lsManager.tasksIdsList.length > 0 ? lsManager.tasksIdsList.map(taskId => lsManager.getTask(taskId)) : [];

export default function tasksList(state = initialState, action) {
	if (action.type === 'ADD_TASK') {
		const newState = [...state, createNewTaskObj()];
		return newState;
	}
	if (action.type === 'DELETE_TASK') {
		lsManager.deleteTask(action.taskToDeleteId)
		const newState = state.filter(({id}) => id !== action.taskToDeleteId);
		return newState;
	}
	if (action.type === 'UPDATE_TASK') {
		lsManager.updateTask(action.updatedTaskData);
		const newState = [...state];
		newState.filter ( (task, index, temporaryTasksList) => {
            if (task.id === action.updatedTaskData.id) temporaryTasksList.splice(index, 1, action.updatedTaskData)
        });
        return newState;
	}
	return state;
}
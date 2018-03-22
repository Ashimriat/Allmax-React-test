class LocalStorageManager {

	constructor(){
		const tasksIds = localStorage.getItem('tasksIds');
		this.tasksIdsList = tasksIds ? tasksIds.split(',') : [];

		this.deleteTask = this.deleteTask.bind(this);
		this.updateTask = this.updateTask.bind(this);
		this.getTask = this.getTask.bind(this)
	};
	
	registerNewTask(taskToRegisterId) {
		this.tasksIdsList.push(taskToRegisterId);
        localStorage.setItem('tasksIds', this.tasksIdsList);
	}

	deleteTask(taskToDeleteId) {
		let deletedTaskIdIndex = this.tasksIdsList.indexOf(taskToDeleteId);
		this.tasksIdsList.splice(deletedTaskIdIndex, 1);
		if (this.tasksIdsList.length === 0) {
            localStorage.clear();
        } else {
            localStorage.setItem('tasksIds', this.tasksIdsList);
            localStorage.removeItem(taskToDeleteId);
        }
	} 

	updateTask(updatedTaskData) {
		if (!this.tasksIdsList.includes(updatedTaskData.id)) this.registerNewTask(updatedTaskData.id);
        localStorage.setItem(updatedTaskData.id, JSON.stringify(updatedTaskData));    
    }
   
    getTask(taskId) {
    	return JSON.parse(localStorage.getItem(taskId));
    }

}

export default LocalStorageManager;
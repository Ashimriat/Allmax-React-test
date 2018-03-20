import React, { Component } from 'react';
import Task from '../Task/Task';
import './TaskList.css';

class TaskList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            tasks: props.tasksList,
            filter: 'Все'
        };

        this.tasksIdsList = props.tasksIdsList;

        this.addNewTask = this.addNewTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.createNewTaskId = this.createNewTaskId.bind(this);
        this.createNewTaskObj = this.createNewTaskObj.bind(this);
        this.changeTasksFilter = this.changeTasksFilter.bind(this);
        this.registerNewTask = this.registerNewTask.bind(this);
    }

    createNewTaskId() {
        function S4() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1);}
        let newTaskId = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        return newTaskId;
    }

    createNewTaskObj(newTaskId) {
        let newTaskObj = [{
            id: newTaskId,
            title: '',
            description: '',
            importance: 'Обычная',
            deadlineDate: '',
            completionDate: '',

            isCompleted: false,
            isEditing: true,
            isCreated: false
        }];
        return newTaskObj;
    }

    addNewTask(){
        let newTaskId = this.createNewTaskId();
        let newTaskObj = this.createNewTaskObj(newTaskId);
        this.setState(prevState => {return {tasks: prevState.tasks.concat(newTaskObj)}});
    }

    registerNewTask(newTaskId) {
        let addedTasksIdsList = this.tasksIdsList.concat(newTaskId);
        this.tasksIdsList = addedTasksIdsList;
        localStorage.setItem('tasksIds', addedTasksIdsList);
    }

    updateTask(newTaskData) {
        if (!this.tasksIdsList.includes(newTaskData.id)) this.registerNewTask(newTaskData.id);
        localStorage.setItem(newTaskData.id, JSON.stringify(newTaskData));    
        let updatedTasksList = this.state.tasks;
        updatedTasksList.filter ( (task, index, updatedTasksList) => 
            {if (task.id === newTaskData.id) updatedTasksList.splice(index, 1, newTaskData)});
        this.setState({tasks: updatedTasksList});
        
    }

    deleteTask(taskId) {
        let deletedTaskIdIndex = this.tasksIdsList.indexOf(taskId);
        this.tasksIdsList.splice(deletedTaskIdIndex, 1);
        if (this.tasksIdsList.length === 0) {
            localStorage.clear();
        } else {
            localStorage.setItem('tasksIds', this.tasksIdsList);
            localStorage.removeItem(taskId);
        }
        let newTasksList = this.state.tasks;
        newTasksList.filter( (task, index, newTasksList) => 
            {if (task.id === taskId) newTasksList.splice(index, 1)} );
        this.setState({tasks: newTasksList});
    }

    changeTasksFilter(event){
        let newFilterValue = event.target.value;
        this.setState({filter: newFilterValue});
    }

    render() {
        let filter = this.state.filter;
        let isShowAllTasks = filter === 'Все' ? true : false;
        let tasksFiltrated = this.state.tasks.filter(task => 
            {if (isShowAllTasks || task.importance === filter ) return task});
        let tasksToRender = tasksFiltrated.map(taskInfo => 
            <li key={taskInfo.id} className="task-list__li"><Task taskInfo={taskInfo} updateTask={this.updateTask} deleteTask={this.deleteTask}/></li>
        );

        return (
            <div className="task-list-block">
                <h1 className="task-list-title">Список задач</h1>
                <div className="list-controls">
                    <button className="task-list-btn btn-add" onClick={this.addNewTask}>Добавить задачу</button>
                    <p className="tasks-filter">Показывать задачи:
                        <select className="filter__select" onChange={this.changeTasksFilter}>
                            <option className="filter__option" value="Все">Все</option>
                            <option className="filter__option" value="Обычная">Обычные</option>
                            <option className="filter__option" value="Важная">Важные</option>
                            <option className="filter__option" value="Очень важная">Очень важные</option>
                        </select>
                    </p>
                </div>
                <ul className="task-list">{tasksToRender}</ul>
            </div>
        );
    }

}

export default TaskList;
import React, { Component } from 'react';
import Task from '../Task/Task';
import './TaskList.css';
import {connect} from 'react-redux';

class TaskList extends Component {
    
    constructor(props) {
        super(props);
        
        this.addNewTask = this.addNewTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    };

    addNewTask(){
        this.props.addTask()
    };

    updateTask(newTaskData) {
        this.props.updateTask(newTaskData);        
    };

    deleteTask(taskId) {
        this.props.deleteTask(taskId);
    };

    changeFilter(){
        let newFilterValue = this.filter.value;
        this.props.changeTasksFilter(newFilterValue);
    };

    render() {
        let isShowAllTasks = this.props.filter === 'Все' ? true : false;
        let tasksFiltrated = this.props.tasks.filter(task => 
            {if (isShowAllTasks || task.importance === this.props.filter || task.isEditing) return task});
        let tasksToRender = tasksFiltrated.map(taskInfo => 
            <li key={taskInfo.id} className="task-list__li"><Task taskInfo={taskInfo} updateTask={this.updateTask} deleteTask={this.deleteTask}/></li>
        );

        return (
            <div className="task-list-block">
                <h1 className="task-list-title">Список задач</h1>
                <div className="list-controls">
                    <button className="task-list-btn btn-add" onClick={this.addNewTask}>Добавить задачу</button>
                    <p className="tasks-filter" onChange={this.changeFilter}>Показывать задачи:
                        <select className="filter__select" onChange={this.changeTasksFilter} ref={(filter) => {this.filter = filter}}>
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
    };

}

export default connect(
    state => ({
        tasks: state.tasksList,
        filter: state.tasksFilter,
    }),
    dispatch => ({
        changeTasksFilter: (newFilterValue) => {
            dispatch({type: 'CHANGE_FILTER', newFilter: newFilterValue})
        },
        addTask: () => {
            dispatch({type: 'ADD_TASK'})
        },
        updateTask: (updatedTask) => {
            dispatch({type: 'UPDATE_TASK', updatedTaskData: updatedTask})
        },
        deleteTask: (taskId) => {
            dispatch({type: 'DELETE_TASK', taskToDeleteId: taskId})
        }
    })
)(TaskList);
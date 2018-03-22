import React, { PureComponent } from 'react';
import TaskEditForm from '../TaskEditForm/TaskEditForm';
import './Task.css';
import DateManager from '../classes/DateManager';

class Task extends PureComponent {

    constructor(props) {

        super(props);

        this.state = {
            isCompleted: props.taskInfo.isCompleted,
            isEditing: props.taskInfo.isEditing,
            isOpen: false,
        };

        this.deadlineDate = props.taskInfo.deadlineDate;
        this.deadlineDateDisplayString = '';
        this.completionDate = props.taskInfo.completionDate;
        this.completionDateDisplayString = '';
        this.dateManager = new DateManager();

        this.isOutdated = this.isOutdated.bind(this);
        this.changeTaskInfoDisplay = this.changeTaskInfoDisplay.bind(this);
        this.changeTaskComplete = this.changeTaskComplete.bind(this);
        this.updateTaskData = this.updateTaskData.bind(this);
        this.editTask = this.editTask.bind(this);
        this.defineDatesDisplay = this.defineDatesDisplay.bind(this);
        this.generateTaskBody = this.generateTaskBody.bind(this);
    };
    
    isOutdated() {
        let currentDate = this.dateManager.getLocalDate();
        let deadlineDateString = this.deadlineDate;
        if (this.deadlineDate === '') {
            return false;
        }
        if (~deadlineDateString.indexOf('HH:mm')) {
            deadlineDateString = deadlineDateString.substr(0, 11) + '00:00' + deadlineDateString.substr(16, 13);
        }
        let deadlineDate = new Date(Date.parse(deadlineDateString));
        
        if (!this.state.isCompleted && ((currentDate - deadlineDate) > 0)) {
            return true;
        }
        return false;
    };

    changeTaskInfoDisplay() {
        this.setState(prevState => {return {isOpen: !prevState.isOpen}});
    };

    changeTaskComplete() {

        if (this.state.isCompleted) {
            this.completionDate = '';
        } else {
            let todayDateLocal = this.dateManager.getLocalDate();
            let temporaryDateDay = todayDateLocal.toISOString().substr(0,10);
            let temporaryDateTime = todayDateLocal.toISOString().substr(11, 5);
            this.completionDate = this.dateManager.getFullLocalDateISO(temporaryDateDay, temporaryDateTime);
        }
        let updatedTaskData = {
            id: this.props.taskInfo.id,
            title: this.props.taskInfo.title,
            description: this.props.taskInfo.description,
            importance: this.props.taskInfo.importance,
            deadlineDate: this.props.taskInfo.deadlineDate,
            completionDate: this.completionDate,
            isCompleted: !this.state.isCompleted, 
            isEditing: false,
            isCreated: true
        }
        this.setState(prevState => {return {isCompleted: !prevState.isCompleted}});
        this.props.updateTask(updatedTaskData);
    };

    updateTaskData(newTaskData) {
        this.deadlineDate = newTaskData.deadlineDate;
        this.completionDate = newTaskData.completionDate;
        this.setState({
            isCompleted: newTaskData.isCompleted,
            isEditing: false
        });
        this.props.updateTask(newTaskData);
    };

    editTask(){
        this.setState({isEditing: true});
    };

    defineDatesDisplay() {
        let dates = [this.deadlineDate, this.completionDate];
        let datesStrings = [];
        
        for (let i = 0; i < 2; i++) {
            if (dates[i] === '')  {
                datesStrings[i] = 'Не задано';
            } else if (~dates[i].indexOf('HH:mm')) {
                dates[i] = dates[i].substr(0, 11) + '00:00' + dates[i].substr(16, 13);
                datesStrings[i] = new Date(Date.parse(dates[i])).toLocaleString("ru", {year: 'numeric', month: 'long', day: 'numeric'});
            } else {
                datesStrings[i] = new Date(Date.parse(dates[i])).toLocaleString("ru", {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'});
            }
        }
        this.deadlineDateDisplayString = datesStrings[0];
        this.completionDateDisplayString = datesStrings[1];
    };

    generateTaskBody() {
        this.defineDatesDisplay();
        let titleClasses =  this.isOutdated() ? "title outdated": "title";
        titleClasses = this.state.isCompleted ? "title completed" : titleClasses;
        const taskInfoBlock = this.state.isOpen && (
            <main className="task-info">
                <section className="details">
                    <p className="importance"><span className="point-title">Важность задачи:</span> {this.props.taskInfo.importance}</p>
                    <p className="description"><span className="point-title">Описание задачи:</span> {this.props.taskInfo.description ? this.props.taskInfo.description : "Описание отсутствует"}</p>
                </section>
                <section className="dates">
                    <p className="deadline"><span className="point-title">Дедлайн:</span> {this.deadlineDateDisplayString}</p>
                    <p className="completion"><span className="point-title">Дата выполнения:</span> {this.completionDateDisplayString}</p>
                </section>
            </main>);
        const taskEditForm = <TaskEditForm taskInfo={this.props.taskInfo} saveDataChanges={this.updateTaskData} cancelTaskCreation={this.props.deleteTask}/>
        const taskBody = ( 
            <div className="task-item">
                <header className="task-header">
                    <input type="checkbox" name="completed" className="task-complete" checked={this.state.isCompleted} onChange={this.changeTaskComplete}/>
                    <h2 className={titleClasses} onClick={this.changeTaskInfoDisplay}>{this.props.taskInfo.title}</h2>
                </header>
                {taskInfoBlock}
                <footer className="task-footer">
                    <button onClick={this.editTask} className="task-btn btn-edit">Редактировать задачу</button>
                    <button onClick={() => {this.props.deleteTask(this.props.taskInfo.id)}} className="task-btn btn-delete">Удалить задачу</button>
                </footer>
            </div>)
        if (this.state.isEditing) {
            return taskEditForm;
        } else {
            return taskBody;          
        }   
    };

    render() {
        const taskBodyToRender = this.generateTaskBody();
        return (
			<div>
				{taskBodyToRender}
		    </div>
        );
    };

}

export default Task;
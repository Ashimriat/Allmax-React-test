import React, { Component } from 'react';
import TaskEditForm from '../TaskEditForm/TaskEditForm';
import './Task.css';

class Task extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isCompleted: props.taskInfo.isCompleted,
            isEditing: props.taskInfo.isEditing,
            isOpen: false,
        };

        this.deadlineDate = props.taskInfo.deadlineDate;
        this.deadlineDateString = '';
        this.completionDate = props.taskInfo.completionDate;
        this.completionDateString = '';

        this.isOutdated = this.isOutdated.bind(this);
        this.generateTaskBody = this.generateTaskBody.bind(this);
        this.changeTaskDisplay = this.changeTaskDisplay.bind(this);
        this.changeTaskComplete = this.changeTaskComplete.bind(this);
        this.updateTaskData = this.updateTaskData.bind(this);
        this.editTask = this.editTask.bind(this);
        this.defineDatesStrings = this.defineDatesStrings.bind(this);
        this.getFullLocalDateData = this.getFullLocalDateData.bind(this);
        this.getGMTZone = this.getGMTZone.bind(this);
        this.getLocalDate = this.getLocalDate.bind(this);

    }
    
    isOutdated() {
        let currentDate = this.getLocalDate();
        let deadlineDateString = this.deadlineDate;
        if (this.deadlineDate === '') {
            console.log("Дедлайн не задан");
            return false;
        }
        if (~deadlineDateString.indexOf('HH:mm')) {
            deadlineDateString = deadlineDateString.substr(0, 11) + '00:00' + deadlineDateString.substr(16, 13);
        }
        let deadlineDate = new Date(Date.parse(deadlineDateString));
        
        if (!this.state.isCompleted && ((currentDate - deadlineDate) > 0)) {
            console.log("Дедлайн просрочен");
            return true;
        }
        console.log("Дедлайн не просрочен");
        return false;
    };

    changeTaskDisplay() {
        this.setState(prevState => {return {isOpen: !prevState.isOpen}});
    }

    getGMTZone(date) {
        let timeZonesDifference = -(date.getTimezoneOffset());
        let hoursDifference = timeZonesDifference / 60;
        let minutesDifference = timeZonesDifference % 60;
        let zString = null;
        if (hoursDifference < 10) hoursDifference = '0' + hoursDifference; 
        if (minutesDifference < 10) minutesDifference = '0' + minutesDifference; 
        if (timeZonesDifference > 0) {
            zString = '+' + hoursDifference + ':' + minutesDifference;
        } else {
            zString = '-' + hoursDifference + ':' + minutesDifference;
        } 
        return zString;
    }

    getFullLocalDateData(day, time){
        let todayDate = new Date();
        let dayString = day;
        let timeString = time;
        let zString = this.getGMTZone(todayDate);
        let dateString = dayString + 'T' + timeString + ':00.000' + zString;
        return dateString;
    }

    getLocalDate(){
        let todayDate = new Date();
        let timeZonesDifference = -(todayDate.getTimezoneOffset());
        let hoursDifference = timeZonesDifference / 60;
        let minutesDifference = timeZonesDifference % 60;
        let todayDateUTCHours = todayDate.getHours();
        let todayDateUTCMinutes = todayDate.getMinutes();
        let localDateHours = todayDateUTCHours;
        let localDateMinutes = todayDateUTCMinutes;
        if (timeZonesDifference > 0) {
            localDateHours += hoursDifference;
            localDateMinutes += minutesDifference;
        } else {
            localDateHours -= hoursDifference;
            localDateMinutes -= minutesDifference;
        }
        let todayDateLocal = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), localDateHours, localDateMinutes);
        return todayDateLocal;
    }

    changeTaskComplete() {

        if (this.state.isCompleted) {
            this.completionDate = '';
        } else {
            let todayDateLocal = this.getLocalDate();
            let temporaryDateDay = todayDateLocal.toISOString().substr(0,10);
            let temporaryDateTime = todayDateLocal.toISOString().substr(11, 5);
            this.completionDate = this.getFullLocalDateData(temporaryDateDay, temporaryDateTime);
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
    }

    updateTaskData(newTaskData) {

        const isTaskCompleted = (newTaskData.completionDate) ? true : false;
        let updatedTaskData = {
            id: newTaskData.id,
            title: newTaskData.title,
            description: newTaskData.description,
            importance: newTaskData.importance,
            deadlineDate: newTaskData.deadlineDate,
            completionDate: newTaskData.completionDate,
            isCompleted: isTaskCompleted, 
            isEditing: false,
            isCreated: true
        }; 
        this.deadlineDate = updatedTaskData.deadlineDate;
        this.completionDate = updatedTaskData.completionDate;
        this.setState({
            isCompleted: isTaskCompleted,
            isEditing: false
        });
        this.props.updateTask(updatedTaskData);
    }

    editTask(){
        this.setState({isEditing: true});
    };

    defineDatesStrings() {

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

        this.deadlineDateString = datesStrings[0];
        this.completionDateString = datesStrings[1];
    }

    generateTaskBody() {
        this.defineDatesStrings();
        let titleClasses =  this.isOutdated() ? "title outdated": "title";
        titleClasses = this.state.isCompleted ? "title completed" : titleClasses;
        const taskInfoBlock = this.state.isOpen && (
            <main className="task-info">
                <section className="details">
                    <p className="importance"><span className="point-title">Важность задачи:</span> {this.props.taskInfo.importance}</p>
                    <p className="description"><span className="point-title">Описание задачи:</span> {this.props.taskInfo.description}</p>
                </section>
                <section className="dates">
                    <p className="deadline"><span className="point-title">Дедлайн:</span> {this.deadlineDateString}</p>
                    <p className="completion"><span className="point-title">Дата выполнения:</span> {this.completionDateString}</p>
                </section>
            </main>);
        const taskEditForm = <TaskEditForm taskInfo={this.props.taskInfo} saveDataChanges={this.updateTaskData} timezonesConverter={this.getGMTZone}/>
        const taskBody = ( 
            <div className="task-item">
                <header className="task-header">
                    <input type="checkbox" name="completed" className="task-complete" checked={this.state.isCompleted} onChange={this.changeTaskComplete}/>
                    <h2 className={titleClasses} onClick={this.changeTaskDisplay}>{this.props.taskInfo.title}</h2>
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
    }

    render() {
        const taskBodyToRender = this.generateTaskBody();
        return (
			<div>
				{taskBodyToRender}
		    </div>
        );
    }

}

export default Task;
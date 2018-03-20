import React, { Component } from 'react';
import './TaskEditForm.css';

class TaskEditForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.taskInfo.id,
            title: props.taskInfo.title,
            description: props.taskInfo.description,
            importance: props.taskInfo.importance,
            deadlineDateDay: props.taskInfo.deadlineDate.substring(0,10),
            deadlineDateTime: props.taskInfo.deadlineDate.substring(11,16),
            completionDateDay: props.taskInfo.completionDate.substring(0,10),
            completionDateTime: props.taskInfo.completionDate.substring(11,16),
 
            isCreated: props.taskInfo.isCreated
        }

        this.saveTaskData = this.saveTaskData.bind(this);
        this.resetTaskData = this.resetTaskData.bind(this);
        this.getFullDateData = this.getFullDateData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.convertTimezone = props.timezonesConverter;

    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });      
    }

    resetTaskData(event){
        event.preventDefault();

        this.setState(prevState => 
            { 
                return {
                    title: '',
                    description: '',
                    importance: prevState.importance,
                    deadlineDateDay: '',
                    deadlineDateTime: '',
                    completionDateDay: '',
                    completionDateTime: '',
                }
            }
        );
    };

    convertTimezone(date) {
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

    getFullDateData(day,time){
        let dayString = day;
        let timeString = time;
        let todayDate = new Date();
        let zString = this.convertTimezone(todayDate);
        let dateString = '';
        if (dayString === '' && timeString === '') {
            return dateString;
        } 
        if (dayString === '' && timeString !== '') {
            let defaultDateDay = todayDate.toISOString();
            dayString = defaultDateDay.substr(0, 10);
        }
        if (timeString === '') timeString = 'HH:mm';
        dateString = dayString + 'T' + timeString + ':00.000' + zString;
        return dateString;
    }

    saveTaskData(event){

        event.stopPropagation();

        let updatedTaskData = {
            id: this.state.id,
            title: this.state.title,
            description: this.state.description,
            importance: this.state.importance,
            deadlineDate: this.getFullDateData(this.state.deadlineDateDay, this.state.deadlineDateTime),
            completionDate: this.getFullDateData(this.state.completionDateDay, this.state.completionDateTime),
            isCreated: true
        };

        this.props.saveDataChanges(updatedTaskData);

    }
    

	render() {
        const completedDateField = this.state.isCreated && (
                <label>
                    <p className="text completed-text">Дата выполнения:</p>
                    <input className="form-element form-completed__date" type="date" name="completionDateDay" value={this.state.completionDateDay} onChange={this.handleInputChange}/>
                    <input className="form-element form-completed__time" type="time" name="completionDateTime" value={this.state.completionDateTime} onChange={this.handleInputChange}/>
                </label>
        );
        return (
            <form onSubmit={this.saveTaskData} className="task-editing-form">
                <ul className="form-list">
                    <li className="form-field form-title">
                        <label>
                            <p className="text title-text">Название задачи:</p> 
                            <input required className="form-element form-title__text" type="text" name="title" placeholder="Название задачи" value={this.state.title} onChange={this.handleInputChange}/>
                        </label>
                    </li>
                    <li className="form-field form-description">
                        <label>
                            <p className="text description-text">Описание задачи:</p>
                            <textarea rows="10" className="form-element form-description__textarea" name="description" placeholder="Описание задачи" value={this.state.description} onChange={this.handleInputChange}/>
                        </label>
                    </li>
                    <li className="form-field form-importance">
                        <label>
                            <p className="text importance-text">Важность задачи:</p> 
                            <select className="form-element form-importance__select" name="importance" value={this.state.importance} onChange={this.handleInputChange}>
                                <option value="Обычная">Обычная</option>
                                <option value="Важная">Важная</option>
                                <option value="Очень важная">Очень важная</option>
                            </select>
                        </label>
                    </li>
                    <li className="form-field form-deadline">
                        <label>
                            <p className="text deadline-text">Сделать до:</p>
                            <input className="form-element form-deadline__date" type="date" name="deadlineDateDay" value={this.state.deadlineDateDay} onChange={this.handleInputChange}/>
                            <input className="form-element form-deadline__time" type="time" name="deadlineDateTime" value={this.state.deadlineDateTime} onChange={this.handleInputChange}/>
                        </label>
                    </li>
                    <li className="form-field form-completed">
                        {completedDateField}
                    </li>
                    <li className="form-field form-buttons">
                        <button onClick={this.resetTaskData} className="form-btn btn-reset">Сбросить данные</button>
                        <button type='submit' className="form-btn btn-save">Сохранить задачу</button>
                    </li>
                </ul>
            </form>
        );
    }

}

export default TaskEditForm;

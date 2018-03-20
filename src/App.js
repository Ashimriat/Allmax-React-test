import React, { Component } from 'react';
import logo from './logo.svg';
import TaskList from './TaskList/TaskList';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.tasksIdsList = null;
    this.tasksList = null;
  }

  componentWillMount(){

    let tasksIds = localStorage.getItem("tasksIds");
    if (tasksIds !== null) {
      this.tasksIdsList = tasksIds.split(',');
      this.tasksList = this.tasksIdsList.map(taskId => JSON.parse(localStorage.getItem(taskId)));
    } else {
      this.tasksIdsList = [];
      this.tasksList = []
    }

  }

  render() {    

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <TaskList tasksIdsList={this.tasksIdsList} tasksList={this.tasksList}/>
      </div>
    );
  }

}

export default App;

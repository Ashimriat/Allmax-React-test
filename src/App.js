import React, { Component } from 'react';
import logo from './logo.svg';
import TaskList from './TaskList/TaskList';
import './App.css';
import {Provider} from 'react-redux'
import {createStore} from 'redux';
import reducer from './reducers/';

class App extends Component {

  constructor(props){
    super(props);
  }

  componentWillMount(){
    this.store = createStore(reducer);
  }

  render() {    


    return (
      <Provider store={this.store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <TaskList/>
        </div>
      </Provider>
    );
  }

}

export default App;

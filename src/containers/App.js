import React, { Component } from 'react';
import Game from '../components/Game'
import './App.css';

class App extends Component {
  state = {
    circle: {
      radius: 15
    }
  }

  render() {
    return (
      <div className="App" >
        <div>
          <Game circle={this.state.circle} />
        </div>
      </div>
    );
  }
}

export default App;

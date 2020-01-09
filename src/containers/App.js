import React, { Component } from 'react';
import Game from '../components/Game'
import './App.css';

class App extends Component {
  state = {
    bird: {
      radius: 15
    }
  }

  render() {
    return (
      <div className="App" >
        <div>
          <Game bird={this.state.bird} />
        </div>
      </div>
    );
  }
}

export default App;

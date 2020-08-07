import React from 'react';
import './App.css';
import { Button } from './components/Button';
import { InputBar } from './components/InputBar';
import { ClearButton } from './components/ClearButton';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  render() {
    return (
      <div className="App">
        <h1>{isNaN('.')}</h1>
        <div className="calc-wrapper">
          <InputBar input={this.state.input} />
          <div className="button-row">
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
            <Button>+</Button>
          </div>
          <div className="button-row">
            <Button>4</Button>
            <Button>5</Button>
            <Button>6</Button>
            <Button>-</Button>
          </div>
          <div className="button-row">
            <Button>7</Button>
            <Button>8</Button>
            <Button>9</Button>
            <Button>×</Button>
          </div>
          <div className="button-row">
            <Button>.</Button>
            <Button>0</Button>
            <Button>=</Button>
            <Button>÷</Button>
          </div>
          <div className="button-row">
            <ClearButton handleClear={() => this.setState({ input: '' })}>
              Clear
            </ClearButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

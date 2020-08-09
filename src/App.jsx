import React from 'react'
import './App.css'

import Button from './components/Button'
import InputBar from './components/InputBar'
import ClearButton from './components/ClearButton'
import RecentActivity from './components/RecentActivity'

import {create, all} from 'mathjs'

const config = {}
const math = create(all, config)
const operators = ['+', '-', '*', '/']

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayNum: '',
      equationToCalc: '',
      lastButtonPressWasOp: false,
      resultsList: [],
    }
  }

  // Function to handle the button press of numbers on the calculator.
  handleNumber = val => {
    // If the last button pressed was any of the following, + - * /
    // then clear the display.
    if (this.state.lastButtonPressWasOp) {
      this.setState({
        displayNum: '',
        lastButtonPressWasOp: false
      })
    }
    let newNum = this.state.displayNum
    if (newNum.substring(newNum.length - 4, newNum.length) === 'e+21') {
      // TODO give a "number to large, try again" error
      return
    }
    if (newNum.length > 14 || newNum.includes('e')) {
      newNum = Number(Number(newNum).toString() + val)
      newNum = math.format(newNum, {notation: 'exponential', precision: 10})
    }
    else {
      newNum += val
    }
    this.setState({displayNum: newNum})
  }

  /*
    handleOperator handles the button press of any of the following, + - * / =
    on the calculator.
  */
  handleOperator = val => {
    // Make sure equationToCalc isn't empty before checking the last character.
    if (this.state.equationToCalc !== '') {
      // If the last character in our current equation is any of the following, + - * /
      // and we receieve any of + - * /
      // then user input is invalid.
      if (operators.includes(this.state.equationToCalc.slice(-1))) {
        // TODO implement user input error
        return
      }
    }

    // Handle + - * / operators assuming user input is valid so far.
    if (val !== '=') {
      this.setState({
        equationToCalc: this.state.displayNum + val,
        lastButtonPressWasOp: true,
      })
      return
    }

    // Handle = operator.
    let result = math.evaluate(this.state.equationToCalc)
    let newEquation = this.state.equationToCalc
      + '='
      + result

    // Set the state of the newest entry for RecentActivity component
    // in the form of 1+2=3
    //
    // TODO make a queue instead of a weird array
    // https://www.javascripttutorial.net/javascript-queue
    let temp = this.state.resultsList
    if (this.state.resultsList.length === 10)
      temp.shift()
    temp.push(newEquation)
    this.setState({
      displayNum: result,
      equationToCalc: '',
      resultToDisplay: temp
    })
  }


  render() {
    return (
      <div className="App">
        <h1>{isNaN('.')}</h1>
        {/* TODO implement this container with inputEquation prop */}
        <RecentActivity
          resultToDisplay={this.state.resultsList}
        />
        <div className="calc-wrapper">
          <InputBar displayNum={this.state.displayNum} />
          <div className="button-row">
            <Button handleClick={this.handleNumber}>1</Button>
            <Button handleClick={this.handleNumber}>2</Button>
            <Button handleClick={this.handleNumber}>3</Button>
            <Button handleClick={this.handleOperator}>+</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleNumber}>4</Button>
            <Button handleClick={this.handleNumber}>5</Button>
            <Button handleClick={this.handleNumber}>6</Button>
            <Button handleClick={this.handleOperator}>-</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleNumber}>7</Button>
            <Button handleClick={this.handleNumber}>8</Button>
            <Button handleClick={this.handleNumber}>9</Button>
            <Button handleClick={this.handleOperator}>*</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleNumber}>.</Button>
            <Button handleClick={this.handleNumber}>0</Button>
            <Button handleClick={this.handleOperator}>=</Button>
            <Button handleClick={this.handleOperator}>/</Button>
          </div>
          <div className="button-row">
            <ClearButton handleClear={() => this.setState({input: ''})}>
              Clear
            </ClearButton>
          </div>
        </div>
      </div>
    )
  }
}

export default App
import React from 'react'
import './App.css'

import Button from './components/Button'
import InputBar from './components/InputBar'
import ClearButton from './components/ClearButton'
import RecentActivity from './components/RecentActivity'

import {create, all} from 'mathjs'

const math = create(all, {})
const operators = ['+', '-', '*', '/', '=']
const numLengthLimit = 11
const MAX_INT = Math.pow(2, 53)
const MIN_INT = -MAX_INT
const mulSymbol = '\u00D7'
const divSymbol = '\u00F7'
const plusMinusSymbol = '\u00B1'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayNum: '',
      equationToCalc: '',
      lastOp: '',
      lastButtonPressWasOp: false,
      resultsList: [],
    }
  }

  /*
   * switchSign handles the button that changes negative displayNum to positive
   * and positive displayNum to negative.
  */
  switchSign = () => {
    if (this.state.displayNum[0] === '-') {
      if (this.state.displayNum.length === 1) {
        this.setState({
          displayNum: ''
        })
      }
      else {
        this.setState({
          displayNum: this.state.displayNum.substring(1, this.state.displayNum.length)
        })
      }
    }
    else {
      this.setState({
        displayNum: '-' + this.state.displayNum
      })
    }
  }

  /*
   * pushToResultsList helps manage the state of resultsList when
   * values are pushed to it.
  */
  pushToResultsList = input => {
    let newList = this.state.resultsList
    if (this.state.resultsList.length === 10)
      newList.shift()
    newList.push(input)
    return newList
  }

  /*
   * roundRepeatingDecimal detects numbers in the form of e.g. 0.3599999999
   * and returns the rounded version e.g. 0.36
  */
  roundRepeatingDecimal = num => {
    num = num.toString()
    if (num.length > 5 && num.length - num.indexOf('.') + 1 >= 3) {
      for (let i = num.indexOf('.') + 3; i < num.length; i++) {
        if (num[i] === num[i - 1] && num[i] === num[i - 2]) {
          return Number(num).toFixed(i - 2).toString()
        }
      }
    }
    return num
  }

  /*
   * handleVal handles the button press of decimal and 0-9 on the calculator.
  */
  handleVal = val => {

    // lastButtonPressWasOp state should be set to false no matter what.
    this.setState({
      lastButtonPressWasOp: false
    })

    // Don't append new numbers to Infinity values.
    if (this.state.displayNum == Infinity || this.state.displayNum == -Infinity) {
      return
    }

    // If the displayNum already has a decimal point and the input is a decimal,
    // ignore the input unless the button previously pressed was some operator.
    if (this.state.displayNum.includes('.')
      && val === '.'
      && !this.state.lastButtonPressWasOp) {
      return
    }

    let newNum = this.state.displayNum

    // If the last button pressed was any of the following, + - * /
    // then clear what will be the updated displayNum state.
    if (this.state.lastButtonPressWasOp) {
      newNum = ''
    }

    // A number with e+21 is the minimum/maximum possible value for mathjs it seems,
    // so if the user is trying to add another digit to such number,
    // make displayNum Infinity.
    if (newNum.substring(newNum.length - 4, newNum.length) === 'e+21') {
      this.setState({
        displayNum: Infinity,
      })
    }

    if (newNum.length > numLengthLimit || newNum.includes('e')) {
      newNum = Number(Number(newNum).toString() + val)
      newNum = math.format(newNum, {notation: 'exponential', precision: 10})
    }
    else {
      newNum += val
    }
    this.setState({
      displayNum: newNum,
    })
  }

  /*
   * handleOperator handles the button press of any of the following, + - * / =
   * on the calculator.
  */
  handleOperator = op => {
    if (this.state.equationToCalc === '' && this.state.displayNum === '') {
      return
    }
    else {
      // If the last character in our current equation is any of the following, + - * /
      // and we receieve any of + - * /
      // then user input is invalid.
      if (operators.includes(this.state.equationToCalc.slice(-1)) && this.state.displayNum === '') {
        return
      }
    }

    // We need to convert these symbol so mathjs can recognize them properly.
    if (op === mulSymbol) {
      op = '*'
    }
    if (op === divSymbol) {
      op = '/'
    }

    // Handle cases where pressing the operator buttons
    // makes the equation invalid.
    let foundOp = false
    let foundEqualsOp = this.state.equationToCalc.includes('=')
    for (let o of operators) {
      if (this.state.equationToCalc.includes(o)) {
        foundOp = true
        break
      }
    }

    // If equationToCalc is in the form of 1+2
    // and the user presses + - * /
    // then evaluate 1+2
    // and make equationToCalc e.g. 3* (if the user pressed *)
    if (op !== '=' && !foundOp && !foundEqualsOp) {
      this.setState({
        equationToCalc: this.state.displayNum + op,
        lastButtonPressWasOp: true,
      })
      return
    }

    // If the input operator is = and the equation is in the form e.g. 8=
    // then change the equation to e.g. 8 and return.
    if (op === '=') {
      if (foundEqualsOp) {
        this.setState({
          equationToCalc: this.state.equationToCalc.replace('=', '')
        })
        return
      }
      if (!foundOp) {
        return
      }
    }

    // Under this condition, the user pressed = without giving a new equation.
    // So the calculator will display '6=6' which has shown to break some
    // other logic, so this is a guard case against that.
    if (this.state.displayNum !== '' && this.state.equationToCalc !== ''
      && !foundOp && !foundEqualsOp && op === '=') {
      return
    }

    // Perform the calculation.
    let result = ''
    try {
      result = math.evaluate(this.state.equationToCalc + this.state.displayNum)
    } catch (err) {
      return
    }

    // This is a safeguard against any weird Infinity result.
    if (isNaN(result)) {
      return
    }

    // Account for numeric overflow/underflow.
    if (result > MAX_INT) {
      result = Infinity
    }
    else if (result < MIN_INT) {
      result = -Infinity
    }

    // If the result contains a repeating decimal value (e.g. 0.3599999...etc),
    // then round the number (e.g. 0.36)
    // otherwise, no change.
    if (String(result).includes('.')) {
      result = this.roundRepeatingDecimal(result)
    }

    // Account for result length being too long for the InputBar
    // but not quite large enough to be Infinity.
    // It also seems to tidy the RecentActivity that when either displayNum or
    // RHS are in scientific notation, result should also be in scientific
    // notation.
    if (result.toString().length > numLengthLimit
      || this.state.displayNum.includes('e')
      || this.state.equationToCalc.includes('e')) {
      result = Number(Number(result).toString())
      result = math.format(result, {notation: 'exponential', precision: 10})
    }

    // Set the state of the newest entry for RecentActivity component
    // in the form of 1+2=3
    let newList = this.pushToResultsList(
      this.state.equationToCalc
      + this.state.displayNum
      + '='
      + result
    )

    // Handle = operator.
    if (!foundOp) {
      this.setState({
        displayNum: result.toString(),
        equationToCalc: '',
        resultToDisplay: newList,
        lastButtonPressWasOp: true
      })
      return
    }

    // Handle + - * / operators where
    // equationToCalc is in the form of 1+2
    this.setState({
      displayNum: result.toString(),
      equationToCalc: '',
      resultToDisplay: newList,
      lastButtonPressWasOp: true
    })
  }

  render() {
    return (
      <div className="App">
        <h1>{isNaN('.')}</h1>
        <RecentActivity
          resultToDisplay={this.state.resultsList}
        />
        <div className="calc-wrapper">
          <InputBar displayNum={this.state.displayNum} />
          <div className="button-row">
            <Button handleClick={this.handleVal}>1</Button>
            <Button handleClick={this.handleVal}>2</Button>
            <Button handleClick={this.handleVal}>3</Button>
            <Button handleClick={this.handleOperator}>+</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleVal}>4</Button>
            <Button handleClick={this.handleVal}>5</Button>
            <Button handleClick={this.handleVal}>6</Button>
            <Button handleClick={this.handleOperator}>-</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleVal}>7</Button>
            <Button handleClick={this.handleVal}>8</Button>
            <Button handleClick={this.handleVal}>9</Button>
            <Button handleClick={this.handleOperator}>{mulSymbol}</Button>
          </div>
          <div className="button-row">
            <Button handleClick={this.handleVal}>.</Button>
            <Button handleClick={this.handleVal}>0</Button>
            <Button handleClick={this.handleOperator}>=</Button>
            <Button handleClick={this.handleOperator}>{divSymbol}</Button>
          </div>
          <div className="button-row">
            <Button
              handleClick={this.switchSign}
              id='plus-minus-button'
            >{plusMinusSymbol}
            </Button>
            <ClearButton handleClear={() => this.setState({
              displayNum: '',
              equationToCalc: '',
              lastButtonPressWasOp: false
            })}>
              Clear
            </ClearButton>
          </div>
        </div>
      </div>
    )
  }
}

export default App

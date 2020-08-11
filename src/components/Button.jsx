import React from 'react';
import './Button.css';

const isOperator = (input) => !isNaN(input)
  || input === '.'
  || input === '='
  || input === '\u00B1';

const Button = (props) => (
  <div
    className={`button ${isOperator(props.children) ? null : 'operator'}`}
    onClick={() => props.handleClick(props.children)}
    id={props.id ? props.id : ''}
  >
    {props.children}
  </div>
);

export default Button;

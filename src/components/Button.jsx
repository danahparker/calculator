import React from 'react';
import './Button.css';

const isOperator = (input) => !isNaN(input) || input === '.' || input === '=';

const Button = (props) => (
  <div
    className={`button ${isOperator(props.children) ? null : 'operator'}`}
    onClick={() => props.handleClick(props.children)}
  >
    {props.children}
  </div>
);

export default Button;

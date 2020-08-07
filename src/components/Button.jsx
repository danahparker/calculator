import React from 'react';
import './Button.css';

const isOperator = (input) => !isNaN(input) || input === '.' || input === '=';

export const Button = (props) => (
  <div className={`button ${isOperator(props.children) ? null : 'operator'}`}>
    {props.children}
  </div>
);

export default Button;

import React from 'react';
import './InputBar.css';

const InputBar = (props) => (
  <div className="input-bar">
    <p className="input-text">
      {props.displayNum}
    </p>
  </div>
);

export default InputBar;

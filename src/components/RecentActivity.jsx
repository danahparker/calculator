import React from 'react';
import './RecentActivity.css';

const RecentActivity = (props) => (
  <div>
    <div>
      <h1>Recent Activity:</h1>
    </div>
    <div className="results-list">
      <ul>
        {props.resultToDisplay.map((str, index) => (
          <li key={index}>{str}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default RecentActivity;

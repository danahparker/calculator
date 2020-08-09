import React from 'react';
import './RecentActivity.css';

const RecentActivity = (props) => (
  <div>
    <div className="recent-activity-header">
      <h3>Recent Activity:</h3>
    </div>
    <div className="results-list">
      <ul>
        {props.resultToDisplay.map((str) => (
          <li key={str}>{str}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default RecentActivity;

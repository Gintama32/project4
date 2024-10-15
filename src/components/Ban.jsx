import React from 'react';

function Ban({ bannedAttributes, onRemoveBan }) {
  return (
    <div className="ban-container">
      <h1>Banned Attributes</h1>
      <ul>
        {bannedAttributes.map((attr, index) => (
          <li key={index} onClick={() => onRemoveBan(attr)}>
            {attr} (Click to remove)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Ban;

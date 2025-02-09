import React from "react";

const LiveCount = ({ currentNumber }) => {
  return (
    <div>
      <h2 className="serving">
        Now Serving: <span>{currentNumber}</span>
      </h2>
    </div>
  );
};

export default LiveCount;

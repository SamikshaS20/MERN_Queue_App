import React, { useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const JoinQueueForm = () => {
  const [name, setName] = useState("");

  const joinQueue = () => {
    if (name.trim()) {
      socket.emit("joinQueue", { name });
      setName("");
    }
  };
  return (
    <div className="input-section">
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinQueue} className="btn join-btn">
        Join Queue
      </button>
    </div>
  );
};

export default JoinQueueForm;

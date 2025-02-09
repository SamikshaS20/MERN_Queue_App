import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import QRScanner from "./components/QRScanner";
import LiveCount from "../components/LiveCount";
import QueueList from "../components/QueueList";
import JoinQueueForm from "../components/JoinQueueForm";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const UserPage = () => {
  
  console.log(process.env.REACT_APP_BACKEND_URL)
  const [queue, setQueue] = useState([]);
  const [joinQueue, setJoinQueue] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    socket.on("queueUpdate", (data) => {
      setQueue(data.queue);
      setCurrentNumber(data.currentNumber);
    });

    return () => socket.off("queueUpdate");
  }, []);

  const handleClick = () => {
    setJoinQueue(true);
  };

  console.log(joinQueue);

  return (
    <div className="container">
      <h1>Weight Measurement Queue</h1>
      <LiveCount currentNumber={currentNumber} />

      {!joinQueue && (
        <button
          onClick={handleClick}
          className="btn join-btn"
          style={{ marginBottom: "20px" }}
        >
          Join Queue
        </button>
      )}
      {joinQueue && <JoinQueueForm />}

      <QueueList
        queue={queue}
        setQueue={setQueue}
        setCurrentNumber={setCurrentNumber}
        isAdmin={true}
      />

      {/* <QRScanner /> */}
    </div>
  );
};

export default UserPage;

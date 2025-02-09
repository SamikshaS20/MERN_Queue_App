import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import QRScanner from "./components/QRScanner";
import LiveCount from "../components/LiveCount";
import JoinQueueForm from "../components/JoinQueueForm";
import QueueList from "../components/QueueList";

const socket = io("http://localhost:5000");

const AdminPage = () => {
  const [queue, setQueue] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    socket.on("queueUpdate", (data) => {
      setQueue(data.queue);
      setCurrentNumber(data.currentNumber);
    });

    return () => socket.off("queueUpdate");
  }, []);

  return (
    <div className="container">
      <h1>Queue Management</h1>
      <LiveCount currentNumber={currentNumber} />

      <JoinQueueForm />

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

export default AdminPage;

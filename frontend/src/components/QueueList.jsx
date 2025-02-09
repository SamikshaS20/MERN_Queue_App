import React from "react";
import { io } from "socket.io-client";
import { Trash2 } from "lucide-react"; // Importing trash icon

const socket = io(process.env.REACT_APP_BACKEND_URL);

const QueueList = ({ queue, setQueue, setCurrentNumber, isAdmin }) => {
  const nextPerson = () => {
    socket.emit("nextPerson");
    if (queue.length === 0) {
      setCurrentNumber(0);
    }
    socket.on("queueUpdate", (data) => {
      setQueue(data.queue);
      setCurrentNumber(data.currentNumber);
    });
  };

  const removePerson = (userId) => {
    socket.emit("removeFromQueue", userId);
    socket.on("queueUpdate", (data) => {
      setQueue(data.queue);
      setCurrentNumber(data.currentNumber);
    });
  };

  return (
    <div>
      <div className="queue-section">
        <h3>Waiting List:</h3>
        <ul>
          {queue.map((person) => (
            <li key={person._id} className="queue-item">
              <span className="queue-number">{person.number}</span>{" "}
              {person.name}
              {isAdmin && (
                <button
                  onClick={() => removePerson(person._id)}
                  className="btn delete-btn"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={nextPerson} className="btn next-btn">
        {queue.length === 0 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default QueueList;

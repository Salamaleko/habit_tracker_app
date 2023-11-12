"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pomodoro {
  taskDuration: number;
}

interface PomodoroProps {
  pomodoros: Pomodoro[];
}

const PomodorosTimer: React.FC<PomodoroProps> = ({ pomodoros }) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [taskDuration, setTaskDuration] = useState<number | null>(null);

  const startTimer = () => {
    setIsActive(true);
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    const currentTime = Date.now();
    let durationInSeconds = 0;
  
    if (startTime) {
      durationInSeconds = Math.floor((currentTime - startTime) / 1000);
  
      if (durationInSeconds <= 0) {
        durationInSeconds = 0;
      }
    }
  
    setMinutes(25);
    setSeconds(0);
    setStartTime(currentTime); // Set startTime to the current time
    setEndTime(currentTime);
    setTaskDuration(durationInSeconds);
    submitData(durationInSeconds);
  
    setIsActive(false);
  };
  
  
  

  const submitData = (taskDuration: number | null) => {
    if (startTime && endTime && taskDuration !== null) {
      const data = {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        taskDuration: taskDuration,
      };
      console.log('Data being submitted:', data);

      // Send the data to your API using Axios
      axios.post('/api/pomodoro', data)
        .then((response) => {
          console.log('Data submitted successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error submitting data:', error);
        });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            submitData(taskDuration); // Submit data when countdown finishes
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, minutes, seconds, taskDuration]);

  // Calculate total task duration from the fetched pomodoros
  const totalTaskDuration = pomodoros.reduce((total, pomodoro) => total + pomodoro.taskDuration, 0);

  return (
    <div>
      <div className="text-4xl text-center">
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </div>
      <div className="text-sm text-center mt-2">
        {startTime && `Start Time: ${new Date(startTime).toLocaleTimeString()}`}
        {endTime && `End Time: ${new Date(endTime).toLocaleTimeString()}`}
        {taskDuration !== null && `Task Duration: ${taskDuration.toFixed(2)} seconds`}
      </div>
      <div className="text-sm text-center mt-2">
        Total Task Duration: {totalTaskDuration.toFixed(2)} seconds
      </div>
      <div className="flex justify-center space-x-4 mt-4">
  {!isActive && (
    <button onClick={startTimer} className="bg-blue-500 text-white px-4 py-2">
      Start
    </button>
  )}
  {isActive && (
    <button onClick={stopTimer} className="bg-red-500 text-white px-4 py-2">
      Stop
    </button>
  )}
  <button onClick={resetTimer} className="bg-gray-500 text-white px-4 py-2">
    Reset
  </button>
</div>
    </div>
  );
};

export default PomodorosTimer;






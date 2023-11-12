"use client";
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import axios from 'axios';

interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  creationDate: Date;
}

interface ProductFormProps {
  habits: Habit[];
}

export const HabitForm: React.FC<ProductFormProps> = ({ habits }) => {
  const { handleSubmit, control, register } = useForm();
  const [selected, setSelected] = useState<Date | undefined>(undefined);

  const onSubmit = (data) => {
    // Convert the picked date to a valid Prisma DateTime format
    data.date = new Date(data.date).toISOString();
    // Convert 'score' and 'userId' to integers
    data.score = parseInt(data.score, 10);
    data.userId = parseInt(data.userId, 10);
    // Make the POST request with the updated data
    axios.post('/api/tracking/', data)
      .then((response) => {
        console.log('Form Data:', data);
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Date:</label>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DayPicker
              mode="single"
              selected={selected}
              onDayClick={(date) => {
                field.onChange(date);
                setSelected(date);
              }}
            />
          )}
        />
      </div>

      <div>
        <label>Is Completed:</label>
        <input type="checkbox" {...register('isCompleted')} />
      </div>

      <div>
        <label>Score:</label>
        <input type="number" {...register('score')} />
      </div>

      <div>
        <label>User ID:</label>
        <input type="number" {...register('userId')} />
      </div>

      <div>
        <label>Habit ID:</label>
        <select {...register('habitId')}>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

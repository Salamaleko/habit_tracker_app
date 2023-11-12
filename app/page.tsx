import { AddHabitForm } from '@/components/AddHabitForm'
import { HabitForm } from '@/components/AddHabitScoreForm'
import Image from 'next/image'
import { PrismaClient, Habit, PomodoroTimer } from '@prisma/client';
import PomodorosTimer from '@/components/PomodoroTimer';

const prisma = new PrismaClient();

export default async function Home() {
  let habits: Habit[] = [];
  let pomodoros: PomodoroTimer[] = [];

  try {
    habits = await prisma.habit.findMany({});
    pomodoros = await prisma.pomodoroTimer.findMany({});
  } catch (error) {
    console.error('Error fetching habits:', error);
  }

  return (
    <>
      <HabitForm habits={habits}></HabitForm>
      <PomodorosTimer pomodoros={pomodoros} ></PomodorosTimer>
    </>
  );
}

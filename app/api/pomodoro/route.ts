import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { startTime, endTime, taskDuration } = body;

  if (!startTime || !endTime || !taskDuration) {
    return NextResponse.error();
  }

  // You can add additional validation here if needed.

  const pomodoroTimer = await prisma.pomodoroTimer.create({
    data: {
      startTime,
      endTime,
      taskDuration: taskDuration,
    }
  });

  return NextResponse.json(pomodoroTimer);
}

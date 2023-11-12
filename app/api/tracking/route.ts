import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: Request) {

    const body = await request.json();
    let {
      userId,
      date,
      isCompleted,
      score,
      habitId,
    } = body;

    // Convert userId to an integer
    userId = parseInt(userId, 10);

    // Validate the request body to ensure all required fields are present
    const requiredFields = ['userId', 'date', 'isCompleted', 'score', 'habitId'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.error();
      }
    }

    const habitTrackingEntry = await prisma.habitTracking.create({
      data: {
        userId,
        date,
        isCompleted,
        score,
        habitId, // Assuming 'habit' is the Habit ID
      }
    });

    return NextResponse.json(habitTrackingEntry);
  }

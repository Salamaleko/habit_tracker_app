import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function POST(
  request: Request,
) {
  const body = await request.json();
  let {
    userId,
    name,
    description,
    user,
  } = body;

  // Convert userId to an integer
  userId = parseInt(userId, 10);

  // Get the current date and time
  const creationDate = new Date();

  Object.keys(body).forEach((value: any) => { 
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Now, userId is an integer
  const listing = await prisma.habit.create({
    data: {
      userId,
      name,
      description,
      creationDate,
      user,
    }
  });

  return NextResponse.json(listing);
}

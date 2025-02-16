import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { studentId, didRide } = await req.json();

    if (!studentId || typeof didRide !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const ride = await prisma.ride.create({
      data: {
        studentId,
        didRide,
        date: new Date()
      }
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Error creating ride:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the ride." },
      { status: 500 }
    );
  }
}

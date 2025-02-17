import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { studentIdentifier, didRide } = await req.json();

    if (!studentIdentifier || typeof didRide !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentIdentifier }
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const ride = await prisma.ride.create({
      data: {
        studentId: student.id,
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

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const studentIdentifier = searchParams.get("searchById") || "";
  const routenumber = searchParams.get("routenumber") || "";
  const notRiding = searchParams.get("notRiding") === "true";
  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }

  if (studentIdentifier) {
    where.studentIdentifier = {
      contains: studentIdentifier,
      mode: "insensitive"
    };
  }

  if (routenumber) {
    where.routenumber = { contains: routenumber, mode: "insensitive" };
  }

  if (notRiding) {
    where.rides = {
      none: {
        didRide: true,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    };
  }

  const students = await prisma.student.findMany({
    where,
    skip,
    take: limit,
    include: {
      rides: {
        orderBy: {
          date: "desc"
        },
        take: 1
      }
    }
  });
  console.log(students);

  const total = await prisma.student.count({ where });

  return NextResponse.json({
    students,
    total,
    page,
    limit
  });
}

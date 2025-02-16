const fs = require("fs");
const { parse } = require("csv-parse");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function importStudents() {
  const students = [];
  const parser = fs
    .createReadStream("students2.csv")
    .pipe(parse({ columns: true, trim: true }));

  for await (const row of parser) {
    students.push({
      name: row.name,
      studentIdentifier: row.studentIdentifier, // Changed from studentId to studentIdentifier
      routenumber: row.routenumber || "Student not routed",
      qrCode: row.qrCode || Math.random().toString(36).substr(2, 9)
    });
  }

  try {
    await prisma.student.createMany({ data: students });
    console.log(`Successfully imported ${students.length} students`);
  } catch (error) {
    console.error("Error importing students:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importStudents().catch((error) => {
  console.error("Error processing CSV file:", error);
});

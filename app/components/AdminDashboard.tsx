"use client";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { QRCodeCanvas } from "qrcode.react";

interface Student {
  studentIdentifier: string;
  id: string;
  name: string;
  qrCode: string;
  routenumber: string;
  rides: { didRide: boolean }[];
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchById, setSearchById] = useState(""); // New state for searching by student ID
  const [routenumber, setRoutenumber] = useState(""); // Changed to lowercase
  const [notRiding, setNotRiding] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudents();
  }, [page, search, searchById, routenumber, notRiding]); // Add searchById as a dependency

  const fetchStudents = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
      search,
      searchById, // Add searchById to the query parameters
      routenumber, // Changed to lowercase
      notRiding: notRiding.toString()
    });

    console.log("Fetching students with params:", params.toString()); // Debugging log

    try {
      const res = await fetch(`/api/students?${params}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Data:", data); // Debugging log
      setStudents(data.students);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => reportRef.current
  });

  const simulateScanner = async (studentIdentifier: string) => {
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ studentIdentifier, didRide: true })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Simulated ride:", data); // Debugging log
    } catch (error) {
      console.error("Error simulating scanner:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Report</h2>
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by student ID" // New input for searching by student ID
          value={searchById}
          onChange={(e) => setSearchById(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Filter by route number"
          value={routenumber} // Changed to lowercase
          onChange={(e) => setRoutenumber(e.target.value)} // Changed to lowercase
          className="border p-2 rounded"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={notRiding}
            onChange={(e) => setNotRiding(e.target.checked)}
            className="mr-2"
          />
          Not Riding
        </label>
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Print Report
        </button>
      </div>
      <div id="report" ref={reportRef}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Student ID</th>
              <th className="border border-gray-300 p-2">Route Number</th>
              <th className="border border-gray-300 p-2">QR Code</th>
              <th className="border border-gray-300 p-2">Last Ride Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border border-gray-300 p-2">{student.name}</td>
                <td className="border border-gray-300 p-2">
                  {student.studentIdentifier}
                </td>
                <td className="border border-gray-300 p-2">
                  {student.routenumber}
                </td>
                <td className="border border-gray-300 p-2">
                  <QRCodeCanvas value={student.qrCode} size={64} />
                </td>
                <td className="border border-gray-300 p-2">
                  {student.rides[0]?.didRide ? "Rode" : "Did not ride"}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => simulateScanner(student.studentIdentifier)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Simulate Scanner
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || isLoading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || isLoading}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

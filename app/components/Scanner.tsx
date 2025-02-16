"use client"

import { useState } from "react"

export default function Scanner() {
  const [scannedCode, setScannedCode] = useState("")

  const handleScan = async () => {
    // In a real-world scenario, this would be triggered by an actual scanner
    // For now, we'll simulate a scan with a random student ID
    const simulatedStudentId = Math.random().toString(36).substr(2, 9)

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: simulatedStudentId,
          didRide: true,
        }),
      })

      if (response.ok) {
        setScannedCode(simulatedStudentId)
      } else {
        console.error("Failed to record ride")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Scanner</h2>
      <button onClick={handleScan} className="bg-green-500 text-white px-4 py-2 rounded">
        Simulate Scan
      </button>
      {scannedCode && <p className="mt-4">Last scanned student ID: {scannedCode}</p>}
    </div>
  )
}


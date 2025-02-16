import AdminDashboard from "./components/AdminDashboard"
import Scanner from "./components/Scanner"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Student Bus Management</h1>
      <AdminDashboard />
      <Scanner />
    </main>
  )
}


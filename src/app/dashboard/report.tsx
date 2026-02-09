"use client"
import { useState, useEffect } from "react";
import { Bell, Phone, Users, Activity, Menu, X } from "lucide-react";

export default function Dashboard() {
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    avgWaitTime: "0s",
    resolvedCalls: 0,
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setCallStats({
        totalCalls: Math.floor(Math.random() * 1000),
        activeCalls: Math.floor(Math.random() * 50),
        avgWaitTime: `${Math.floor(Math.random() * 60)}s`,
        resolvedCalls: Math.floor(Math.random() * 800),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const callVolumeData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Call Volume",
        data: [120, 190, 300, 500, 200, 300, 400],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <Phone className="text-blue-500" />
                <h3 className="ml-2 text-gray-600">Total Calls</h3>
              </div>
              <p className="text-2xl font-bold">{callStats.totalCalls}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <Activity className="text-green-500" />
                <h3 className="ml-2 text-gray-600">Active Calls</h3>
              </div>
              <p className="text-2xl font-bold">{callStats.activeCalls}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <Users className="text-yellow-500" />
                <h3 className="ml-2 text-gray-600">Avg Wait Time</h3>
              </div>
              <p className="text-2xl font-bold">{callStats.avgWaitTime}</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center">
                <Users className="text-red-500" />
                <h3 className="ml-2 text-gray-600">Resolved Calls</h3>
              </div>
              <p className="text-2xl font-bold">{callStats.resolvedCalls}</p>
            </div>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Call Volume</h3>
              {/* <Bar data={callVolumeData} options={{ responsive: true }} /> */}
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold">Agent Performance</h3>
              {/* <Doughnut
                data={agentPerformanceData}
                options={{ responsive: true }}
              /> */}
            </div>
            <div className="col-span-1 rounded-lg bg-white p-6 shadow lg:col-span-2">
              <h3 className="mb-4 text-lg font-semibold">Call Queue</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Caller ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Agent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Wait Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="whitespace-nowrap px-6 py-4">
                          +1-555-01{i + 1}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          Agent {String.fromCharCode(65 + i)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${i % 2 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {i % 2 ? "Active" : "Waiting"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {/* {Math.floor(Math.random() * 60)} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

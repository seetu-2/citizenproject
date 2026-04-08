import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/api";
import StatusBadge from "../components/StatusBadge";

type Complaint = {
  id: string | number;
  title: string;
  description?: string;
  status: string;
  region: string;
  createdBy?: string;
  userId?: string;
  email?: string;
  createdAt?: string;
};

type TrendingRegion = {
  region: string;
  count: number;
};

const normalizeStatus = (status: string) => {
  const normalized = status?.toLowerCase();
  if (!normalized) return "Pending";
  if (normalized.includes("in progress") || normalized.includes("progress")) {
    return "In Progress";
  }
  if (normalized.includes("resolved")) {
    return "Resolved";
  }
  if (normalized.includes("reject")) {
    return "Rejected";
  }
  if (normalized.includes("pending")) {
    return "Pending";
  }
  return "Pending";
};

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [trending, setTrending] = useState<TrendingRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const [mine, trendData] = await Promise.all([
        apiRequest("/complaints"),
        apiRequest(
          `/complaints/region?email=${encodeURIComponent(user.email)}`
        ),
      ]);

      const myIssues = Array.isArray(mine) ? mine : [];
      setAllComplaints(myIssues);
      setMyComplaints(myIssues);

      const regionMap = Array.isArray(trendData)
        ? trendData.reduce((acc: Record<string, number>, item: any) => {
            const regionName = item.region || item.userName || "Unknown";
            acc[regionName] = (acc[regionName] || 0) + 1;
            return acc;
          }, {})
        : {};

      setTrending(
        Object.entries(regionMap).map(([regionName, count]) => ({
          region: regionName,
          count,
        }))
      );
    } catch (fetchError) {
      console.error("Dashboard fetch failed", fetchError);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.email]);

  const handleSubmitIssue = async () => {
    if (!title || !description || !region) {
      setError("Please fill in title, description, and region.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await apiRequest("/complaints", "POST", {
        title,
        description,
        region,
      });

      setTitle("");
      setDescription("");
      setRegion("");
      await fetchDashboardData();
    } catch (submitError) {
      console.error("Submit issue failed", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit the issue."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalResolved = useMemo(
    () =>
      allComplaints.filter(
        (complaint) => normalizeStatus(complaint.status) === "Resolved"
      ).length,
    [allComplaints]
  );

  const totalInProgress = useMemo(
    () =>
      allComplaints.filter(
        (complaint) => normalizeStatus(complaint.status) === "In Progress"
      ).length,
    [allComplaints]
  );

  const totalPending = useMemo(
    () =>
      allComplaints.filter(
        (complaint) => normalizeStatus(complaint.status) === "Pending"
      ).length,
    [allComplaints]
  );

  const headline = user?.name ? `${user.name}'s Dashboard` : "Citizen Dashboard";

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CitizenConnect - {headline}</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 space-y-6">
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded p-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Total Issues</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {allComplaints.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">
              {totalResolved}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {totalInProgress}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
            <p className="text-3xl font-bold text-orange-600">
              {totalPending}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold">My Issues</h2>
                <p className="text-sm text-gray-500">
                  Issues submitted by your account
                </p>
              </div>
              <button
                onClick={fetchDashboardData}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-gray-500">Loading issues...</p>
            ) : myComplaints.length === 0 ? (
              <p className="text-gray-500">No issues found for your account.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-3 text-sm text-gray-600">Title</th>
                      <th className="border-b p-3 text-sm text-gray-600">Status</th>
                      <th className="border-b p-3 text-sm text-gray-600">Region</th>
                      <th className="border-b p-3 text-sm text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myComplaints.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-gray-50">
                        <td className="border-b p-3 text-sm text-gray-800">
                          {complaint.title}
                        </td>
                        <td className="border-b p-3">
                          <StatusBadge
                            status={normalizeStatus(complaint.status)}
                          />
                        </td>
                        <td className="border-b p-3 text-sm text-gray-800">
                          {complaint.region}
                        </td>
                        <td className="border-b p-3 text-sm text-gray-500">
                          {complaint.createdAt
                            ? new Date(complaint.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Raise Issue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Issue title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  rows={4}
                  placeholder="Describe the problem"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Region
                </label>
                <input
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your region"
                />
              </div>
              <button
                onClick={handleSubmitIssue}
                disabled={submitting}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Issue"}
              </button>
            </div>
          </section>
        </div>

        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold">Trending Regions</h2>
              <p className="text-sm text-gray-500">
                Most reported regions across complaints
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading trending data...</p>
          ) : trending.length === 0 ? (
            <p className="text-gray-500">No trending region data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trending.map((regionData) => (
                <div
                  key={regionData.region}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {regionData.region}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">
                    {regionData.count}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

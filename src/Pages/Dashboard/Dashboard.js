import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { getLeadDashboardDetailsServ } from "../../services/lead.services";

const STATUS_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

function Dashboard() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await getLeadDashboardDetailsServ();
      setDetails(res?.data?.data);
    } catch (err) {
      console.error("Lead dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Dashboard" selectedItem="Dashboard" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          <h3 className="fw-bold mb-4">CRM Dashboard</h3>

          {/* ================= TOP METRICS ================= */}
          <div className="row g-4 mb-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="col-lg-3 col-md-6">
                  <Skeleton height={90} />
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-3 col-md-6">
                  <div className="card shadow-sm p-3 h-100">
                    <h6 className="text-muted">Total Leads</h6>
                    <h2 className="fw-bold">{details?.totalLeads || 0}</h2>
                  </div>
                </div>

                {details?.statusCounts?.map((s, i) => (
                  <div key={s._id} className="col-lg-3 col-md-6">
                    <div
                      className="card shadow-sm p-3 h-100"
                      style={{
                        borderLeft: `5px solid ${
                          STATUS_COLORS[i % STATUS_COLORS.length]
                        }`,
                      }}
                    >
                      <h6 className="text-muted">{s.name}</h6>
                      <h2 className="fw-bold">{s.count}</h2>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* ================= STATUS PIE + DAILY TREND ================= */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm p-4 h-100">
                <h5 className="fw-semibold mb-3">Leads by Status</h5>
                {loading ? (
                  <Skeleton height={260} />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={details?.statusCounts || []}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {details?.statusCounts?.map((_, index) => (
                          <Cell
                            key={index}
                            fill={
                              STATUS_COLORS[index % STATUS_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm p-4 h-100">
                <h5 className="fw-semibold mb-3">Daily Lead Creation</h5>
                {loading ? (
                  <Skeleton height={260} />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={details?.dailyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#10b981"
                        name="Leads"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

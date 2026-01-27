import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { toast } from "react-toastify";
import { scrapeLeadServ, getLeadDashboardDetailsServ } from "../../services/lead.services";
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

const STATUS_COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
];

const GenerateLead = () => {
    const [url, setUrl] = useState("");
    const [fields, setFields] = useState("");
    const [format, setFormat] = useState("json");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dashboardDetails, setDashboardDetails] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await getLeadDashboardDetailsServ();
            setDashboardDetails(res?.data?.data);
        } catch (err) {
            console.error("Lead dashboard error:", err);
        } finally {
            setDashboardLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!url) {
            toast.error("Please enter a URL");
            return;
        }
        // if (!fields) {
        //     toast.error("Please enter fields to extract");
        //     return;
        // }

        setLoading(true);
        setResult(null);

        try {
            const fieldsArray = fields.split(',').map(f => f.trim()).filter(f => f);
            const payload = {
                url,
                fields: fieldsArray,
                format
            };

            const response = await scrapeLeadServ(payload);

            if (format === 'csv' || format === 'json-file') {
                // Create a download link for the blob
                const href = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                // Try to extract filename from content-disposition
                const contentDisposition = response.headers['content-disposition'];
                let filename = `leads.${format === 'csv' ? 'csv' : 'json'}`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (filenameMatch && filenameMatch.length === 2) {
                        filename = filenameMatch[1];
                    }
                }
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(href);
                toast.success("File downloaded successfully");
            } else {
                setResult(response.data);
                toast.success("Leads generated successfully");
            }

        } catch (error) {
            console.error("Error generating leads:", error);
            toast.error(error.response?.data?.error || "Failed to generate leads. Please check the URL and fields.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bodyContainer">
            <Sidebar selectedMenu="Leads" selectedItem="Generate Lead" />
            <div className="mainContainer">
                <TopNav />
                <div className="p-4">
                    <h4 className="fw-bold mb-4">Generate Lead</h4>

                    {/* Input Section */}
                    <div className="card shadow-sm border-0 p-4 mb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Target URL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Fields (comma separated)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Name, Email, Phone, Company"
                                    value={fields}
                                    onChange={(e) => setFields(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label fw-semibold">Format</label>
                                <select
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    <option value="json">JSON (View)</option>
                                    <option value="json-file">JSON (File)</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                            <div className="col-12 mt-4 text-end">
                                <button
                                    className="btn btn-primary px-4"
                                    onClick={handleGenerate}
                                    disabled={loading}
                                >
                                    {loading ? "Generating..." : "Generate Lead"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {result && (
                        <div className="card shadow-sm border-0 p-4 mb-4">
                            <h5 className="fw-bold mb-3">Generated Data</h5>
                            <div className="bg-light p-3 rounded" style={{ maxHeight: "400px", overflow: "auto" }}>
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </div>
                        </div>
                    )}

                    {/* Charts Section */}
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card shadow-sm p-4 h-100">
                                <h5 className="fw-semibold mb-3">Leads by Status</h5>
                                {dashboardLoading ? (
                                    <Skeleton height={260} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={dashboardDetails?.statusCounts || []}
                                                dataKey="count"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label
                                            >
                                                {dashboardDetails?.statusCounts?.map((_, index) => (
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
                                {dashboardLoading ? (
                                    <Skeleton height={260} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={dashboardDetails?.dailyTrend || []}>
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
};

export default GenerateLead;

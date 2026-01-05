import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import Pagination from "../../Components/Pagination";
import ActionButtons from "../../Components/ActionButtons";
import { toast } from "react-toastify";
import moment from "moment";

import {
  createLeadServ,
  getLeadListServ,
  updateLeadServ,
  updateLeadStatusServ,
  deleteLeadServ,
  getLeadDetailsServ,
} from "../../services/lead.services";

import { getLeadStatusListServ } from "../../services/leadStatus.services";

const initialForm = {
  name: "",
  phoneNumber: "",
  email: "",
  city: "",
  state: "",
  country: "",
  notes: "",
};

const statusColorMap = {
  NEW: "#0d6efd",
  NOT_ANSWERED: "#6c757d",
  CALLBACK_1H: "#fd7e14",
  INTERESTED: "#198754",
  CUSTOMER: "#20c997",
  REJECTED: "#dc3545",
};

const ModalWrapper = ({ children, onClose, width }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: "1.5rem",
    }}
  >
    <div
      className="bg-white p-4 rounded-4 shadow-lg"
      style={{
        width,
        maxHeight: "95vh",
        overflowY: "auto",
        "--primary": "#10b981",
      }}
    >
      <div className="d-flex justify-content-end mb-3">
        <img
          src="https://cdn-icons-png.flaticon.com/128/9068/9068699.png"
          alt="close"
          style={{ height: 22, cursor: "pointer", opacity: 0.7 }}
          onClick={onClose}
        />
      </div>
      {children}
    </div>
  </div>
);

function Leads() {
  const [list, setList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
  });
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getLeadListServ(payload);
      setList(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    getLeadStatusListServ().then((res) =>
      setStatusList(res?.data?.data || [])
    );
  }, [payload]);

  const openViewModal = async (id) => {
    const res = await getLeadDetailsServ(id);
    setViewData(res?.data?.data);
    setSelectedStatus(res?.data?.data?.status?._id);
    setShowViewModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phoneNumber) {
      toast.error("Name & Phone required");
      return;
    }
    if (editing) {
      await updateLeadServ(editing._id, form);
      toast.success("Lead updated");
    } else {
      await createLeadServ(form);
      toast.success("Lead created");
    }
    setShowModal(false);
    fetchData();
  };

  const handleStatusUpdate = async () => {
    await updateLeadStatusServ(viewData._id, {
      statusId: selectedStatus,
    });
    toast.success("Status updated");
    setShowViewModal(false);
    fetchData();
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Leads" selectedItem="Leads" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="fw-bold">Leads</h4>
            <button
              className="btn btn-success"
              onClick={() => {
                setEditing(null);
                setForm(initialForm);
                setShowModal(true);
              }}
            >
              + Add Lead
            </button>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                className="form-control" style={{
                    lineHeight: "1.9"
                }}
                placeholder="Search name / phone"
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    searchKey: e.target.value,
                    pageNo: 1,
                  })
                }
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    status: e.target.value,
                    pageNo: 1,
                  })
                }
              >
                <option value="">All Status</option>
                {statusList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}><Skeleton height={20} /></td>
                  </tr>
                ) : list.length ? (
                  list.map((l, i) => (
                    <tr key={l._id}>
                      <td>{i + 1}</td>
                      <td>{l.name}</td>
                      <td>{l.phoneNumber}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              statusColorMap[l.status?.code] || "#198754",
                          }}
                        >
                          {l.status?.name}
                        </span>
                      </td>
                      <td className="text-center">
                        <ActionButtons
                          canView
                          canUpdate
                          canDelete
                          onView={() => openViewModal(l._id)}
                          onEdit={() => {
                            setEditing(l);
                            setForm(l);
                            setShowModal(true);
                          }}
                          onDelete={() =>
                            deleteLeadServ(l._id).then(fetchData)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            payload={payload}
            setPayload={setPayload}
            totalCount={total}
          />
        </div>

        {showViewModal && viewData && (
          <ModalWrapper onClose={() => setShowViewModal(false)} width={640}>
            <h4 className="fw-bold mb-4">{viewData.name}</h4>

            <div className="row g-4 mb-4">
              {[
                ["Phone", viewData.phoneNumber],
                ["Email", viewData.email || "-"],
                ["City", viewData.city || "-"],
                ["State", viewData.state || "-"],
                ["Country", viewData.country || "-"],
                ["Created On", moment(viewData.createdAt).format("DD MMM YYYY")],
              ].map(([label, value], i) => (
                <div key={i} className="col-md-6">
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
                </div>
              ))}

              <div className="col-12">
                <div style={{ fontSize: 12, color: "#6b7280" }}>Notes</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {viewData.notes || "-"}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div style={{ fontSize: 12, color: "#6b7280" }}>Status</div>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn w-100 text-white"
              style={{
                background: "var(--primary)",
                borderRadius: "0.5rem",
                padding: "12px",
                fontWeight: 600,
              }}
              onClick={handleStatusUpdate}
            >
              Update Status
            </button>
          </ModalWrapper>
        )}

        {showModal && (
          <ModalWrapper onClose={() => setShowModal(false)} width={540}>
            <h5 className="fw-bold mb-4">
              {editing ? "Edit Lead" : "Add Lead"}
            </h5>

            <div className="row g-3">
              {["name","phoneNumber","email","city","state","country"].map((f) => (
                <div key={f} className="col-md-6">
                  <input
                    className="form-control"
                    placeholder={f}
                    value={form[f] || ""}
                    onChange={(e) =>
                      setForm({ ...form, [f]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div className="col-12">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Notes"
                  value={form.notes || ""}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              className="btn w-100 text-white mt-4"
              style={{
                background: "var(--primary)",
                borderRadius: "0.5rem",
                padding: "12px",
                fontWeight: 600,
              }}
              onClick={handleSave}
            >
              {editing ? "Save Changes" : "Create Lead"}
            </button>
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}

export default Leads;

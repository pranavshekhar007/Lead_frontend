import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import Pagination from "../../Components/Pagination";
import {
  BsEye,
  BsPencil,
  BsTrash,
  BsLock,
  BsUnlock,
} from "react-icons/bs";

import {
  createLeadStatusServ,
  getLeadStatusListServ,
  updateLeadStatusServ,
  deleteLeadStatusServ,
} from "../../services/leadStatus.services";


const initialForm = {
  name: "",
  description: "",
  status: true,
  color: "#3B82F6",
};

const ModalWrapper = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 3000,
    }}
  >
    <div
      className="bg-white shadow-lg p-4"
      style={{ width: 520, borderRadius: "15px" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Add New Lead Status</h5>
        <span
          style={{ cursor: "pointer", fontSize: 22 }}
          onClick={onClose}
        >
          ×
        </span>
      </div>
      {children}
    </div>
  </div>
);

const getColorByName = (name) => {
  const colors = [
    "#EF4444", "#10B981", "#6366F1",
    "#F59E0B", "#3B82F6", "#8B5CF6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};


function LeadStatus() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 10,
  });
  const [total, setTotal] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getLeadStatusListServ(payload);
      setList(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
    } catch {
      toast.error("Failed to load lead status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [payload]);

  const openModal = (item = null) => {
    setEditing(item);
    setForm(
      item
        ? {
            name: item.name,
            description: item.description,
            status: item.status,
            color: item.color || "#3B82F6",
          }
        : initialForm
    );
    setShowModal(true);
  };
  

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Status name is required");
      return;
    }

    try {
      if (editing) {
        await updateLeadStatusServ(editing._id, form);
        toast.success("Status updated");
      } else {
        await createLeadStatusServ(form);
        toast.success("Status created");
      }
      setShowModal(false);
      fetchList();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this status permanently?")) return;
    await deleteLeadStatusServ(id);
    toast.success("Status deleted");
    fetchList();
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Leads" selectedItem="Lead Status" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold">Lead Status</h4>
            <button
              className="btn btn-success px-4"
              onClick={() => openModal()}
            >
              + Add Status
            </button>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search name"
                onChange={(e) =>
                  setPayload({
                    ...payload,
                    searchKey: e.target.value,
                    pageNo: 1,
                  })
                }
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <table className="table mb-0 align-middle">
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <Skeleton height={30} />
                    </td>
                  </tr>
                ) : list.length ? (
                  list.map((s, i) => (
                    <tr key={s._id}>
                      <td>
                        {(payload.pageNo - 1) *
                          payload.pageCount +
                          i +
                          1}
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: s.color,
                              display: "inline-block",
                            }}
                          />
                          <span className="fw-semibold">
                            {s.name}
                          </span>
                        </div>
                      </td>

                      <td style={{ color: "#6b7280" }}>
                        {s.description || "-"}
                      </td>

                      <td>
                        <span
                          className="px-3 py-1 rounded-pill fw-semibold"
                          style={{
                            background: s.status
                              ? "#e8f7ee"
                              : "#fdecea",
                            color: s.status
                              ? "#16a34a"
                              : "#dc2626",
                            fontSize: 13,
                          }}
                        >
                          {s.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>

                      <td className="text-end pe-4">
                       
                        <BsPencil
                          className="text-warning me-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => openModal(s)}
                        />
                        {s.status ? (
                          <BsLock className="text-warning me-3" />
                        ) : (
                          <BsUnlock className="text-success me-3" />
                        )}
                        <BsTrash
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDelete(s._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No record found
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

        {showModal && (
          <ModalWrapper onClose={() => setShowModal(false)}>
            <div className="mb-3">
              <label className="fw-semibold mb-1">
                Status Name *
              </label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="fw-semibold mb-1">Color *</label>
              <div className="d-flex gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                  style={{ width: 60, height: 40 }}
                />
                <input
                  className="form-control"
                  value={form.color}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="fw-semibold mb-1">
                Description
              </label>
              <textarea
                className="form-control"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <label className="fw-semibold mb-1">
                Status
              </label>
              <select
                className="form-select"
                value={form.status ? "true" : "false"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-light px-4"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success px-4"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}

export default LeadStatus;

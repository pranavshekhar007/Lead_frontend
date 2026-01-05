import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import Pagination from "../../Components/Pagination";
import { toast } from "react-toastify";
import NoRecordFound from "../../Components/NoRecordFound";
import ActionButtons from "../../Components/ActionButtons";

import {
  createLeadStatusServ,
  getLeadStatusListServ,
  updateLeadStatusServ,
  deleteLeadStatusServ,
} from "../../services/leadStatus.services";

const initialForm = {
  name: "",
  code: "",
  isFinal: false,
};

const ModalWrapper = ({ children, onClose }) => (
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
      style={{ width: 420 }}
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

function LeadStatus() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 10,
  });

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
    setForm(item || initialForm);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) {
      toast.error("Name & Code required");
      return;
    }

    if (editing) {
      await updateLeadStatusServ(editing._id, form);
      toast.success("Status updated");
    } else {
      await createLeadStatusServ(form);
      toast.success("Status created");
    }

    setShowModal(false);
    fetchList();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Disable this status?")) return;
    await deleteLeadStatusServ(id);
    toast.success("Status disabled");
    fetchList();
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Leads" selectedItem="Leads Status" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="fw-bold">Lead Status</h4>
            <button className="btn btn-success" onClick={() => openModal()}>
              + Add Status
            </button>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search name or code"
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

          <div className="card shadow-sm border-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Final</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}><Skeleton height={20} /></td>
                  </tr>
                ) : list.length ? (
                  list.map((s, i) => (
                    <tr key={s._id}>
                      <td>{(payload.pageNo - 1) * payload.pageCount + i + 1}</td>
                      <td>{s.name}</td>
                      <td><code>{s.code}</code></td>
                      <td>{s.isFinal ? "Yes" : "No"}</td>
                      <td className="text-center">
                        <ActionButtons
                          canUpdate
                          canDelete
                          onEdit={() => openModal(s)}
                          onDelete={() => handleDelete(s._id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}><NoRecordFound /></td>
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
            <h5 className="fw-bold mb-3">
              {editing ? "Edit Lead Status" : "Add Lead Status"}
            </h5>

            <input
              className="form-control mb-3"
              placeholder="Status Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="form-control mb-3 text-uppercase"
              placeholder="STATUS_CODE"
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
            />

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.isFinal}
                onChange={(e) =>
                  setForm({ ...form, isFinal: e.target.checked })
                }
              />
              <label className="form-check-label fw-semibold">
                Final Status
              </label>
            </div>

            <button
              className="btn w-100 text-white"
              style={{
                background: "#10b981",
                padding: "12px",
                fontWeight: 600,
              }}
              onClick={handleSave}
            >
              {editing ? "Update Status" : "Create Status"}
            </button>
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}

export default LeadStatus;

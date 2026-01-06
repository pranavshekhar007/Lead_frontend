import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import Skeleton from "react-loading-skeleton";
import Pagination from "../../Components/Pagination";
import { toast } from "react-toastify";
import { BsPencil, BsTrash, BsLock, BsUnlock } from "react-icons/bs";

import {
  createLeadSourceServ,
  getLeadSourceListServ,
  updateLeadSourceServ,
  toggleLeadSourceServ,
  deleteLeadSourceServ,
} from "../../services/leadSources.services";

const initialForm = {
  sourceName: "",
  description: "",
  status: true,
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
      style={{ width: 500, borderRadius: 14 }}
    >
      <div className="d-flex justify-content-between mb-3">
        <h5 className="fw-bold mb-0">Lead Source</h5>
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

function LeadSource() {
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
      const res = await getLeadSourceListServ(payload);
      setList(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
    } catch {
      toast.error("Failed to load lead sources");
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
    if (!form.sourceName) {
      toast.error("Source name is required");
      return;
    }

    try {
      if (editing) {
        await updateLeadSourceServ(editing._id, form);
        toast.success("Lead source updated");
      } else {
        await createLeadSourceServ(form);
        toast.success("Lead source created");
      }
      setShowModal(false);
      fetchList();
    } catch {
      toast.error("Save failed");
    }
  };

  const handleToggle = async (id) => {
    await toggleLeadSourceServ(id);
    fetchList();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead source?")) return;
    await deleteLeadSourceServ(id);
    toast.success("Lead source deleted");
    fetchList();
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Leads" selectedItem="Leads Sources" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          <div className="d-flex justify-content-between mb-3">
            <h4 className="fw-bold">Lead Sources</h4>
            <button
              className="btn btn-success px-4"
              onClick={() => openModal()}
            >
              + Add Source
            </button>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search source"
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
            <table className="table mb-0 align-middle">
              <thead style={{ background: "#f9fafb" }}>
                <tr>
                  <th>#</th>
                  <th>Source Name</th>
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

                      <td className="fw-semibold">
                        {s.sourceName}
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
                          <BsLock
                            className="text-warning me-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggle(s._id)}
                          />
                        ) : (
                          <BsUnlock
                            className="text-success me-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggle(s._id)}
                          />
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
                Source Name *
              </label>
              <input
                className="form-control"
                value={form.sourceName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sourceName: e.target.value,
                  })
                }
              />
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

export default LeadSource;

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { toast } from "react-toastify";

import {
  getLeadListServ,
  createLeadServ,
  updateLeadStatusServ,
  deleteLeadServ,
  updateLeadServ,
} from "../../services/lead.services";

import { getLeadStatusListServ } from "../../services/leadStatus.services";
import { getLeadSourceListServ } from "../../services/leadSources.services";

import LeadColumn from "./LeadColumn";
import AddLeadModal from "./AddLeadModal";

const initialForm = {
  leadName: "",
  email: "",
  phone: "",
  company: "",
  accountName: "",
  accountIndustry: "",
  website: "",
  position: "",
  leadValue: "",
  leadStatus: "",
  leadSource: "",
  address: "",
  notes: "",
};

function Leads() {
  const [allLeads, setAllLeads] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);

  // universal search & filter
  const [searchKey, setSearchKey] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [leadRes, statusRes, sourceRes] = await Promise.all([
        getLeadListServ({ pageNo: 1, pageCount: 500 }),
        getLeadStatusListServ(),
        getLeadSourceListServ({ pageNo: 1, pageCount: 100 }),
      ]);

      setAllLeads(leadRes?.data?.data || []);
      setStatuses(statusRes?.data?.data || []);
      setSources(sourceRes?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load leads data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onDragEnd = async ({ active, over }) => {
    if (!over) return;
    if (active.id === over.id) return;

    try {
      await updateLeadStatusServ(active.id, {
        statusId: over.id,
      });
      toast.success("Lead status updated");
      fetchAll();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openAdd = (statusId = "") => {
    setForm({ ...initialForm, leadStatus: statusId });
    setShowModal(true);
  };
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (lead) => {
    setEditingId(lead._id);
    setForm({
      leadName: lead.leadName,
      email: lead.email || "",
      phone: lead.phone,
      company: lead.company || "",
      accountName: lead.accountName || "",
      accountIndustry: lead.accountIndustry || "",
      website: lead.website || "",
      position: lead.position || "",
      leadValue: lead.leadValue || "",
      leadStatus: lead.leadStatus?._id,
      leadSource: lead.leadSource?._id || "",
      address: lead.address || "",
      notes: lead.notes || "",
    });
    setShowModal(true);
  };
  
  const saveLead = async () => {
    if (!form.leadName || !form.phone || !form.leadStatus) {
      toast.error("Required fields missing");
      return;
    }
  
    if (editingId) {
      await updateLeadServ(editingId, form);
      toast.success("Lead updated");
    } else {
      await createLeadServ(form);
      toast.success("Lead created");
    }
  
    setShowModal(false);
    setEditingId(null);
    fetchAll();
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await deleteLeadServ(id);
    toast.success("Lead deleted");
    fetchAll();
  };

  const filteredLeads = useMemo(() => {
    return allLeads.filter((l) => {
      const text = `
        ${l.leadName || ""}
        ${l.phone || ""}
        ${l.email || ""}
        ${l.company || ""}
      `.toLowerCase();

      const matchSearch = searchKey
        ? text.includes(searchKey.toLowerCase())
        : true;

      const matchStatus = statusFilter
        ? l.leadStatus?._id === statusFilter ||
          l.status?._id === statusFilter
        : true;

      return matchSearch && matchStatus;
    });
  }, [allLeads, searchKey, statusFilter]);

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Leads" selectedItem="Leads" />
      <div className="mainContainer">
        <TopNav />

        <div className="p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between mb-3">
            <h4 className="fw-bold">Leads</h4>
            <button
              className="btn btn-success"
              onClick={() => openAdd("")}
              style={{
                borderRadius: "10px"
              }}
            >
              + Add Lead
            </button>
          </div>

          {/* SEARCH & FILTER */}
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Search name / phone / email / company"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                style={{
                  lineHeight: "1.9",
                  borderRadius: "10px"
                }}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  borderRadius: "10px"
                }}
              >
                <option value="">All Status</option>
                {statuses.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KANBAN BOARD */}
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={onDragEnd}
          >
            <div className="kanban-board">
              {statuses.map((status) => (
                <LeadColumn
                key={status._id}
                status={status}
                leads={filteredLeads.filter(
                  (l) =>
                    l.leadStatus?._id === status._id ||
                    l.status?._id === status._id
                )}
                onAdd={openAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={(lead) => console.log("View lead", lead)} // optional
              />
              
              ))}
            </div>
          </DndContext>
        </div>

        {/* ADD LEAD MODAL */}
        {showModal && (
          <AddLeadModal
            form={form}
            setForm={setForm}
            statuses={statuses}
            sources={sources}
            onClose={() => setShowModal(false)}
            onSave={saveLead}
          />
        )}
      </div>
    </div>
  );
}

export default Leads;

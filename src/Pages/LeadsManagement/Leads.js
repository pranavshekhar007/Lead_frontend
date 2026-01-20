import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  DndContext,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { toast } from "react-toastify";

import {
  getLeadListServ,
  createLeadServ,
  updateLeadStatusServ,
  deleteLeadServ,
  updateLeadServ,
  reorderLeadsServ,
} from "../../services/lead.services";

import { getLeadStatusListServ } from "../../services/leadStatus.services";
import { getLeadSourceListServ } from "../../services/leadSources.services";

import LeadColumn from "./LeadColumn";
import LeadCard from "./LeadCard";
import AddLeadModal from "./AddLeadModal";
import DownloadExcelButton from "../../Components/DownloadExcelButton";
import UploadExcelInput from "../../Components/UploadExcelInput";

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
  const [activeLead, setActiveLead] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const onDragStart = (event) => {
    if (event.active.data.current?.type === "Lead") {
      setActiveLead(event.active.data.current.lead);
    }
  };

  const onDragEnd = async ({ active, over }) => {
    setActiveLead(null);
    if (!over) return;
    if (active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    const activeLeadData = activeData.lead;
    const activeStatusId = activeLeadData.leadStatus?._id || activeLeadData.leadStatus;

    let newStatusId = null;
    if (overData.type === "Column") {
      newStatusId = overData.status._id;
    } else if (overData.type === "Lead") {
      newStatusId = overData.lead.leadStatus?._id;
    }

    if (!newStatusId) return;

    if (activeStatusId === newStatusId) {
      const statusLeads = allLeads.filter(
        (l) => (l.leadStatus?._id || l.leadStatus) === activeStatusId
      );
      const oldIndex = statusLeads.findIndex((l) => l._id === active.id);
      const newIndex = statusLeads.findIndex((l) => l._id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedLeads = arrayMove(statusLeads, oldIndex, newIndex);
      const updates = reorderedLeads.map((lead, index) => ({
        id: lead._id,
        order: index,
      }));

      const otherLeads = allLeads.filter(
        (l) => (l.leadStatus?._id || l.leadStatus) !== activeStatusId
      );
      setAllLeads([...otherLeads, ...reorderedLeads]);

      try {
        await reorderLeadsServ(updates);
        toast.success("Lead order updated");
      } catch {
        toast.error("Failed to update order");
        fetchAll();
      }
    } else {
      try {
        await updateLeadStatusServ(activeLeadData._id, {
          leadStatus: newStatusId,
        });
        toast.success("Lead status updated");
        fetchAll();
      } catch {
        toast.error("Failed to update status");
      }
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

        <div className="p-4 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold mb-0">Leads</h4>
          <div className="d-flex gap-2">
            <DownloadExcelButton
              apiEndpoint={`${process.env.REACT_APP_BASE_URL}/lead/export`}
              fileName={`leads-export-${new Date().toISOString().split('T')[0]}.xlsx`}
              buttonText="Download Excel"
              style={{
                backgroundColor: '#28a745',
                borderRadius: '10px',
              }}
            />
            <UploadExcelInput
              apiEndpoint={`${process.env.REACT_APP_BASE_URL}/lead/import`}
              onSuccess={(data) => {
                toast.success(data.message || 'Leads imported successfully');
                fetchAll();
              }}
              onError={(error) => {
                toast.error(error || 'Failed to import leads');
              }}
              buttonText="Upload"
              style={{
                borderRadius: '10px',
              }}
            />
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
        </div>

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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
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
                onView={(lead) => console.log("View lead", lead)}
              />

            ))}
            <DragOverlay>
              {activeLead ? (
                <LeadCard
                  lead={activeLead}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={(lead) => console.log("View lead", lead)}
                />
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
      </div>

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
  );
}

export default Leads;

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import LeadCard from "./LeadCard";

export default function LeadColumn({
  status,
  leads,
  onAdd,
  onEdit,
  onDelete,
  onView,
}) {
  return (
    <div
      className="kanban-column"
      style={{
        width: 320,
        background: "#f8fafc",
        borderRadius: 14,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 260px)", // ✅ fixed column height
      }}
    >
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: status.color || "#3b82f6",
            }}
          />
          <span className="fw-semibold">{status.name}</span>
        </div>

        <span
          className="badge rounded-circle"
          style={{
            background: "#e5e7eb",
            color: "#111827",
            fontSize: 12,
            minWidth: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {leads.length}
        </span>
      </div>

      {/* ================= ADD LEAD BUTTON ================= */}
      <button
        className="btn mb-2"
        style={{
          border: "1.5px dashed #cbd5e1",
          borderRadius: 10,
          color: "#475569",
          background: "transparent",
          padding: "10px 0",
        }}
        onClick={() => onAdd(status._id)}
      >
        + Add Lead
      </button>

      {/* ================= SCROLLABLE CARDS ================= */}
      <div
        className="kanban-cards"
        style={{
          overflowY: "auto",
          paddingRight: 4,
          flex: 1,
        }}
      >
        <SortableContext
          items={leads.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

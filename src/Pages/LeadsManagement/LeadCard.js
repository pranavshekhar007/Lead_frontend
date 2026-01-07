import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BsThreeDots,
  BsEye,
  BsPencil,
  BsTrash,
  BsGripVertical,
} from "react-icons/bs";
import { useState, useRef, useEffect } from "react";
import moment from "moment";

export default function LeadCard({ lead, onEdit, onDelete, onView }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead._id });

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeft: `5px solid ${lead.leadStatus?.color || "#3b82f6"}`,
  };

  const initials = lead.leadName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="lead-card bg-white rounded-4 shadow-sm mb-2"
    >
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-start">
        {/* 🔹 DRAG HANDLE (ONLY THIS IS DRAGGABLE) */}
        <div
          className="d-flex align-items-center gap-2"
          {...attributes}
          {...listeners}
          style={{ cursor: "grab" }}
        >
          <BsGripVertical color="#9ca3af" />
          <h6 className="fw-bold mb-1">{lead.leadName}</h6>
        </div>

        {/* 🔹 THREE DOT MENU (NOT DRAGGABLE) */}
        <div
          ref={menuRef}
          style={{ position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <BsThreeDots
            style={{ cursor: "pointer", color: "#6b7280" }}
            onClick={() => setOpen((prev) => !prev)}
          />

          {open && (
            <div
              className="shadow-sm bg-white"
              style={{
                position: "absolute",
                right: 0,
                top: 24,
                width: 220,
                borderRadius: 12,
                zIndex: 999,
                overflow: "hidden",
              }}
            >
              <MenuItem icon={<BsEye />} text="View" onClick={() => onView(lead)} />
              <MenuItem icon={<BsPencil />} text="Edit" onClick={() => onEdit(lead)} />

              <Divider />

              <MenuItem
                icon={<BsTrash />}
                text="Delete"
                danger
                onClick={() => onDelete(lead._id)}
              />
            </div>
          )}
        </div>
      </div>

      {/* ================= BODY ================= */}
      {lead.email && <div className="text-muted small">{lead.email}</div>}
      <div className="text-muted small mb-2">{lead.company || "-"}</div>

      {lead.leadValue && (
        <div className="fw-semibold mb-2">
          ₹{Number(lead.leadValue).toLocaleString()}
        </div>
      ) || "N/A"}

      {/* ================= FOOTER ================= */}
      <div className="d-flex justify-content-between align-items-center mt-2">
        <span className="badge bg-success-subtle text-success px-3 py-1">
          Active
        </span>

        <small className="text-muted">
          {moment(lead.createdAt).format("YYYY-MM-DD")}
        </small>

        <div
          className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center"
          style={{ width: 32, height: 32, fontSize: 12 }}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}

/* ================= MENU ITEM ================= */
const MenuItem = ({ icon, text, onClick, danger }) => (
  <div
    onClick={onClick}
    style={{
      padding: "12px 16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontWeight: 500,
      color: danger ? "#dc2626" : "#111827",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {icon}
    {text}
  </div>
);

const Divider = () => (
  <div style={{ height: 1, background: "#e5e7eb" }} />
);

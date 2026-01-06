import React from "react";

function AddLeadModal({
  form,
  setForm,
  statuses,
  sources,
  onClose,
  onSave,
}) {
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 9998,
        }}
      />

      {/* MODAL */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: 760,
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* ================= HEADER ================= */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h5 className="fw-bold mb-0">Add New Lead</h5>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "#f3f4f6",
              borderRadius: 10,
              width: 36,
              height: 36,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div
          style={{
            padding: 24,
            overflowY: "auto",
            maxHeight: "65vh",
          }}
        >
          <div className="row g-3">
            {/* Lead Name */}
            <Field label="Lead Name *">
              <input
                className="form-control"
                value={form.leadName}
                onChange={(e) =>
                  setForm({ ...form, leadName: e.target.value })
                }
              />
            </Field>

            {/* Email */}
            <Field label="Email">
              <input
                className="form-control"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </Field>

            {/* Phone */}
            <Field label="Phone *">
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </Field>

            {/* Company */}
            <Field label="Company">
              <input
                className="form-control"
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />
            </Field>

            {/* Account Name */}
            <Field label="Account Name">
              <input
                className="form-control"
                value={form.accountName}
                onChange={(e) =>
                  setForm({ ...form, accountName: e.target.value })
                }
              />
            </Field>

            {/* Account Industry */}
            <Field label="Account Industry">
              <input
                className="form-control"
                value={form.accountIndustry}
                onChange={(e) =>
                  setForm({ ...form, accountIndustry: e.target.value })
                }
              />
            </Field>

            {/* Website */}
            <Field label="Website">
              <input
                className="form-control"
                value={form.website}
                onChange={(e) =>
                  setForm({ ...form, website: e.target.value })
                }
              />
            </Field>

            {/* Position */}
            <Field label="Position">
              <input
                className="form-control"
                value={form.position}
                onChange={(e) =>
                  setForm({ ...form, position: e.target.value })
                }
              />
            </Field>

            {/* Lead Value */}
            <Field label="Lead Value">
              <input
                type="number"
                className="form-control"
                value={form.leadValue}
                onChange={(e) =>
                  setForm({ ...form, leadValue: e.target.value })
                }
              />
            </Field>

            {/* Lead Status */}
            <Field label="Lead Status *">
              <select
                className="form-select"
                value={form.leadStatus}
                onChange={(e) =>
                  setForm({ ...form, leadStatus: e.target.value })
                }
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Lead Source */}
            <Field label="Lead Source">
              <select
                className="form-select"
                value={form.leadSource}
                onChange={(e) =>
                  setForm({ ...form, leadSource: e.target.value })
                }
              >
                <option value="">Select Source</option>
                {sources.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sourceName}
                  </option>
                ))}
              </select>
            </Field>

            {/* Address */}
            <Field label="Address" full>
              <textarea
                className="form-control"
                rows={2}
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </Field>

            {/* Notes */}
            <Field label="Notes" full>
              <textarea
                className="form-control"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
            </Field>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            style={{
              padding: "10px 28px",
              borderRadius: 10,
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= FIELD WRAPPER ================= */
const Field = ({ label, children, full }) => (
  <div className={full ? "col-12" : "col-md-6"}>
    <label
      style={{
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        color: "#374151",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

export default AddLeadModal;

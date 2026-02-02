import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPermissionListServ } from "../../services/permission.service";
import { getRoleDetailsServ, updateRoleServ } from "../../services/role.services";

const EditRoleModal = ({ show, onClose, onRoleUpdated, roleId }) => {
  const [roleData, setRoleData] = useState({
    name: "",
    description: "",
  });
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInitialData = async () => {
    if (!roleId) return;
    setLoading(true);

    try {
      const permsRes = await getPermissionListServ({ pageCount: 1000, pageNo: 1 });
      const perms = permsRes?.data?.data || permsRes?.data || [];
      setAvailablePermissions(perms);

      const roleRes = await getRoleDetailsServ(roleId);
      const roleDetails = roleRes?.data?.data || roleRes?.data;

      if (roleDetails) {
        setRoleData({
          name: roleDetails.name || "",
          description: roleDetails.description || "",
        });

        const initialSelected = (roleDetails.permissions || []).map(p => ({
          permissionId: p.permissionId?._id || p.permissionId,
          actions: p.selectedActions || [],
        }));
        setSelectedPermissions(initialSelected);
      }

    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load role");
    }
    setLoading(false);
  };

  const handleUpdateRole = async () => {
    if (!roleData.name.trim()) {
      return toast.error("Role Name is required");
    }

    const permissionsPayload = selectedPermissions
      .filter(p => p.actions.length > 0)
      .map(p => ({
        permissionId: p.permissionId,
        selectedActions: p.actions
      }));

    if (permissionsPayload.length === 0) {
      return toast.error("Please select at least one permission");
    }

    const payload = {
      name: roleData.name.trim(),
      description: roleData.description.trim(),
      permissions: permissionsPayload,
    };

    setIsSubmitting(true);
    try {
      await updateRoleServ(roleId, payload);
      toast.success("Role updated successfully");
      onRoleUpdated();
      handleCloseModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update role");
    }
    setIsSubmitting(false);
  };

  const handleCloseModal = () => {
    setRoleData({ name: "", description: "" });
    setSelectedPermissions([]);
    onClose();
  };

  const handleToggleModule = (permission) => {
    const existingPerm = selectedPermissions.find(p => p.permissionId === permission._id);

    if (existingPerm && existingPerm.actions.length === permission.actions.length) {
      setSelectedPermissions(prev => prev.filter(p => p.permissionId !== permission._id));
    } else {
      setSelectedPermissions(prev => {
        const filtered = prev.filter(p => p.permissionId !== permission._id);
        return [...filtered, { permissionId: permission._id, actions: permission.actions }];
      });
    }
  };

  const handleToggleAction = (permissionId, action) => {
    setSelectedPermissions(prev => {
      const existingPerm = prev.find(p => p.permissionId === permissionId);

      if (!existingPerm) {
        return [...prev, { permissionId, actions: [action] }];
      }

      const hasAction = existingPerm.actions.includes(action);
      const newActions = hasAction
        ? existingPerm.actions.filter(a => a !== action)
        : [...existingPerm.actions, action];

      if (newActions.length === 0) {
        return prev.filter(p => p.permissionId !== permissionId);
      }

      return prev.map(p =>
        p.permissionId === permissionId ? { ...p, actions: newActions } : p
      );
    });
  };

  const handleToggleAll = () => {
    const allSelected = selectedPermissions.length === availablePermissions.length &&
      selectedPermissions.every(sp => {
        const perm = availablePermissions.find(p => p._id === sp.permissionId);
        return perm && sp.actions.length === perm.actions.length;
      });

    if (allSelected) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(
        availablePermissions.map(p => ({
          permissionId: p._id,
          actions: [...p.actions]
        }))
      );
    }
  };

  const isActionSelected = (permissionId, action) => {
    return selectedPermissions.find(p => p.permissionId === permissionId)?.actions.includes(action) || false;
  };

  const getModuleSelectedCount = (permission) => {
    const selected = selectedPermissions.find(p => p.permissionId === permission._id);
    return selected ? selected.actions.length : 0;
  };

  const isModuleFullySelected = (permission) => {
    const selected = selectedPermissions.find(p => p.permissionId === permission._id);
    return selected && selected.actions.length === permission.actions.length;
  };

  const isModulePartiallySelected = (permission) => {
    const selected = selectedPermissions.find(p => p.permissionId === permission._id);
    return selected && selected.actions.length > 0 && selected.actions.length < permission.actions.length;
  };

  const totalSelected = selectedPermissions.reduce((sum, p) => sum + p.actions.length, 0);
  const totalAvailable = availablePermissions.reduce((sum, p) => sum + p.actions.length, 0);

  useEffect(() => {
    if (show && roleId) {
      fetchInitialData();
    }
  }, [show, roleId]);

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-semibold">Edit Role (ID: {roleId})</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            ></button>
          </div>

          <div className="modal-body p-4" style={{ maxHeight: "65vh", overflowY: "auto" }}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Role Name<span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Role Name"
                value={roleData.name}
                onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
                disabled={isSubmitting || loading}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Describe the purpose of this role (optional)"
                value={roleData.description}
                onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
                disabled={isSubmitting || loading}
              ></textarea>
            </div>

            <h6 className="fw-semibold mb-3">Role Permissions</h6>
            <p className="text-muted small mb-3">Select permissions for this role</p>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 pb-3 border-bottom">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAll"
                      checked={totalSelected === totalAvailable && totalAvailable > 0}
                      onChange={handleToggleAll}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="selectAll">
                      Select All Permissions
                    </label>
                    <span className="ms-2 text-primary small">
                      {totalSelected} of {totalAvailable} selected
                    </span>
                  </div>
                </div>

                <div className="permissions-list">
                  {availablePermissions.map((permission) => {
                    const selectedCount = getModuleSelectedCount(permission);
                    const totalCount = permission.actions?.length || 0;
                    const isFullySelected = isModuleFullySelected(permission);
                    const isPartiallySelected = isModulePartiallySelected(permission);

                    return (
                      <div key={permission._id} className="mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`module-${permission._id}`}
                              checked={isFullySelected}
                              onChange={() => handleToggleModule(permission)}
                              disabled={isSubmitting}
                              ref={input => {
                                if (input) {
                                  input.indeterminate = isPartiallySelected;
                                }
                              }}
                            />
                            <label className="form-check-label fw-medium" htmlFor={`module-${permission._id}`}>
                              {permission.module}
                            </label>
                          </div>
                          <span className="text-muted small">
                            {selectedCount} of {totalCount} selected
                          </span>
                        </div>

                        <div className="d-flex flex-wrap gap-3 ps-4">
                          {permission.actions?.map((action) => (
                            <div className="form-check form-check-inline" key={action}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${permission._id}-${action}`}
                                checked={isActionSelected(permission._id, action)}
                                onChange={() => handleToggleAction(permission._id, action)}
                                disabled={isSubmitting}
                              />
                              <label className="form-check-label text-capitalize" htmlFor={`${permission._id}-${action}`}>
                                {action}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn text-white"
              style={{ background: "#16A34A" }}
              onClick={handleUpdateRole}
              disabled={isSubmitting || loading || !roleData.name.trim() || totalSelected === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
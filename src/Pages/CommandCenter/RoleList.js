import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import TopNav from "../../Components/TopNav";
import {
  getRoleListServ,
  getPermissionListServ,
  deleteRoleServ,
  addRoleServ,
  updateRoleServ
} from "../../services/commandCenter.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import NoRecordFound from "../../Components/NoRecordFound";

function RoleList() {
  const [list, setList] = useState([]);
  const [statics, setStatics] = useState(null);
  const [payload, setPayload] = useState({
    searchKey: "",
    status: "",
    pageNo: 1,
    pageCount: 10,
    sortByField: "",
  });
  const [showSkelton, setShowSkelton] = useState(false);

  const handleGetRoleFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getRoleListServ(payload);
      setList(response?.data?.data);
      setStatics(response?.data?.documentCount);
    } catch (error) { }
    setShowSkelton(false);
  };

  const [permissionList, setPermissionList] = useState([]);
  const handleGetPermissionFunc = async () => {
    try {
      let response = await getPermissionListServ({ pageNo: 1, pageCount: 1000 });
      setPermissionList(response?.data?.data);
    } catch (error) { }
  };

  useEffect(() => {
    handleGetRoleFunc();
    handleGetPermissionFunc();
  }, [payload]);

  const [isLoading, setIsLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    permissions: {},
    show: false,
  });

  const groupPermissionsByModule = () => {
    const grouped = {};
    permissionList.forEach(perm => {
      if (!grouped[perm.module]) {
        grouped[perm.module] = [];
      }
      grouped[perm.module].push(...perm.actions);
    });
    return grouped;
  };

  const handleAddRoleFunc = async () => {
    setIsLoading(true);
    try {
      const permissionsArray = [];
      Object.keys(addFormData.permissions).forEach(module => {
        const selectedActions = addFormData.permissions[module];
        if (selectedActions.length > 0) {
          const permObj = permissionList.find(p => p.module === module);
          if (permObj) {
            permissionsArray.push({
              permissionId: permObj._id,
              selectedActions: selectedActions
            });
          }
        }
      });

      let response = await addRoleServ({
        name: addFormData.name,
        description: addFormData.description,
        permissions: permissionsArray
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setAddFormData({
          name: "",
          description: "",
          permissions: {},
          show: false,
        });
        handleGetRoleFunc();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Internal Server Error"
      );
    }
    setIsLoading(false);
  };

  const handleDeleteRoleFunc = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (confirmed) {
      try {
        let response = await deleteRoleServ(id);
        if (response?.data?.statusCode == "200") {
          toast?.success(response?.data?.message);
          handleGetRoleFunc();
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : "Internal Server Error"
        );
      }
    }
  };

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    permissions: {},
    _id: "",
  });

  const handleUpdateRoleFunc = async () => {
    setIsLoading(true);
    try {
      const permissionsArray = [];
      Object.keys(editFormData.permissions).forEach(module => {
        const selectedActions = editFormData.permissions[module];
        if (selectedActions.length > 0) {
          const permObj = permissionList.find(p => p.module === module);
          if (permObj) {
            permissionsArray.push({
              permissionId: permObj._id,
              selectedActions: selectedActions
            });
          }
        }
      });

      let response = await updateRoleServ({
        _id: editFormData._id,
        name: editFormData.name,
        description: editFormData.description,
        permissions: permissionsArray
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setEditFormData({
          name: "",
          description: "",
          permissions: {},
          show: false,
          _id: ""
        });
        handleGetRoleFunc();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Internal Server Error"
      );
    }
    setIsLoading(false);
  };

  const togglePermission = (formData, setFormData, module, action) => {
    const current = formData.permissions[module] || [];
    const updated = current.includes(action)
      ? current.filter(a => a !== action)
      : [...current, action];
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [module]: updated }
    });
  };

  const toggleModuleAll = (formData, setFormData, module, allActions) => {
    const current = formData.permissions[module] || [];
    const isAllSelected = allActions.every(a => current.includes(a));
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: isAllSelected ? [] : allActions
      }
    });
  };

  const toggleSelectAll = (formData, setFormData) => {
    const groupedPerms = groupPermissionsByModule();
    const allModules = Object.keys(groupedPerms);
    const isAllSelected = allModules.every(module =>
      groupedPerms[module].every(action => (formData.permissions[module] || []).includes(action))
    );

    if (isAllSelected) {
      setFormData({ ...formData, permissions: {} });
    } else {
      const newPermissions = {};
      allModules.forEach(module => {
        newPermissions[module] = groupedPerms[module];
      });
      setFormData({ ...formData, permissions: newPermissions });
    }
  };

  const getSelectedCount = (formData, module, allActions) => {
    const current = formData.permissions[module] || [];
    return current.length;
  };

  const isAllSelected = (formData) => {
    const groupedPerms = groupPermissionsByModule();
    const allModules = Object.keys(groupedPerms);
    return allModules.every(module =>
      groupedPerms[module].every(action => (formData.permissions[module] || []).includes(action))
    );
  };

  const getTotalPermissionsCount = () => {
    return permissionList.reduce((sum, perm) => sum + perm.actions.length, 0);
  };

  const getSelectedPermissionsCount = (formData) => {
    return Object.values(formData.permissions).reduce((sum, actions) => sum + actions.length, 0);
  };

  const renderPermissionModal = (formData, setFormData, title) => {
    const groupedPerms = groupPermissionsByModule();
    const allModules = Object.keys(groupedPerms);

    return (
      <div
        className="modal fade show d-flex align-items-center justify-content-center"
        tabIndex="-1"
        style={{ display: "block" }}
      >
        <div className="modal-dialog modal-dialog-scrollable" style={{ maxWidth: "700px" }}>
          <div
            className="modal-content"
            style={{
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title">
                {title} (ID: {formData._id || "New"})
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() =>
                  setFormData({
                    name: "",
                    description: "",
                    permissions: {},
                    show: false,
                    _id: ""
                  })
                }
              ></button>
            </div>

            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div className="mb-3">
                <label className="form-label">Role Name*</label>
                <input
                  className="form-control"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <h6 className="mb-3">Role Permissions</h6>
                <p className="text-muted small">Select permissions for this role</p>

                <div className="form-check mb-3 p-3 border rounded">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllPermissions"
                    checked={isAllSelected(formData)}
                    onChange={() => toggleSelectAll(formData, setFormData)}
                  />
                  <label className="form-check-label ms-2" htmlFor="selectAllPermissions">
                    <strong>Select All Permissions</strong>
                    <span className="text-muted ms-2">
                      {getSelectedPermissionsCount(formData)} of {getTotalPermissionsCount()} selected
                    </span>
                  </label>
                </div>

                {allModules.map((module, idx) => {
                  const actions = groupedPerms[module];
                  const selectedCount = getSelectedCount(formData, module, actions);
                  const isModuleAllSelected = actions.every(a => (formData.permissions[module] || []).includes(a));

                  return (
                    <div key={idx} className="border rounded p-3 mb-3">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`module-${idx}`}
                          checked={isModuleAllSelected}
                          onChange={() => toggleModuleAll(formData, setFormData, module, actions)}
                        />
                        <label className="form-check-label ms-2" htmlFor={`module-${idx}`}>
                          <strong>{module}</strong>
                          <span className="text-muted ms-2">
                            {selectedCount} of {actions.length} selected
                          </span>
                        </label>
                      </div>

                      <div className="ms-4 mt-2">
                        <div className="row">
                          {actions.map((action, aidx) => (
                            <div key={aidx} className="col-6 col-md-3 mb-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`perm-${idx}-${aidx}`}
                                  checked={(formData.permissions[module] || []).includes(action)}
                                  onChange={() => togglePermission(formData, setFormData, module, action)}
                                />
                                <label className="form-check-label" htmlFor={`perm-${idx}-${aidx}`}>
                                  {action.charAt(0).toUpperCase() + action.slice(1)}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setFormData({
                    name: "",
                    description: "",
                    permissions: {},
                    show: false,
                    _id: ""
                  })
                }
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={title === "Edit Role" ? handleUpdateRoleFunc : handleAddRoleFunc}
                disabled={!formData.name || isLoading}
              >
                {isLoading ? "Saving..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bodyContainer">
      <Sidebar selectedMenu="Command Center" selectedItem="Roles" />
      <div className="mainContainer">
        <TopNav />
        <div className="p-lg-4 p-md-3 p-2">
          <div className="row mx-0 p-0 d-flex align-items-center my-4">
            <div className="col-lg-2 mb-2 col-md-12 col-12">
              <h3 className="mb-0 text-bold text-secondary">Roles</h3>
            </div>
            <div className="col-lg-4 mb-2 col-md-6 col-12">
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Search roles..."
                  value={payload.searchKey}
                  onChange={(e) =>
                    setPayload({ ...payload, searchKey: e.target.value, pageNo: 1 })
                  }
                />
                <button className="btn btn-success">
                  <i className="bi bi-search"></i> Search
                </button>
              </div>
            </div>
            <div className="col-lg-3 mb-2 col-md-6 col-12 ms-auto">
              <button
                className="btn btn-success w-100"
                onClick={() => setAddFormData({ ...addFormData, show: true })}
              >
                <i className="bi bi-plus-circle me-2"></i>Add New Role
              </button>
            </div>
            <div className="col-lg-2 mb-2 col-md-6 col-12">
              <select
                className="form-select"
                value={payload.pageCount}
                onChange={(e) => setPayload({ ...payload, pageCount: parseInt(e.target.value), pageNo: 1 })}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: "#f8f9fa" }}>
                      <tr>
                        <th className="text-center py-3" style={{ width: "60px" }}>#</th>
                        <th className="py-3">Name</th>
                        <th className="py-3">Description</th>
                        <th className="py-3">Created At</th>
                        <th className="py-3">Permissions</th>
                        <th className="text-center py-3" style={{ width: "150px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showSkelton
                        ? [1, 2, 3, 4, 5]?.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center">
                                <Skeleton width={30} height={20} />
                              </td>
                              <td>
                                <Skeleton width={100} height={20} />
                              </td>
                              <td>
                                <Skeleton width={200} height={20} />
                              </td>
                              <td>
                                <Skeleton width={100} height={20} />
                              </td>
                              <td>
                                <Skeleton width={150} height={20} />
                              </td>
                              <td className="text-center">
                                <Skeleton width={100} height={20} />
                              </td>
                            </tr>
                          );
                        })
                        : list?.map((v, i) => {
                          const perms = v?.permissions || [];
                          const displayPerms = perms.slice(0, 3);
                          const remainingCount = perms.length - 3;

                          return (
                            <tr key={i}>
                              <td className="text-center font-weight-600">
                                {(payload.pageNo - 1) * payload.pageCount + i + 1}
                              </td>
                              <td className="font-weight-600" style={{ color: "#0d6efd" }}>
                                {v?.name}
                              </td>
                              <td className="text-muted">{v?.description || "view their details"}</td>
                              <td>{moment(v?.createdAt).format("YYYY-MM-DD")}</td>
                              <td>
                                {displayPerms.map((perm, pidx) => (
                                  <span
                                    key={pidx}
                                    className="badge bg-primary me-1 mb-1"
                                    style={{ fontSize: "11px" }}
                                  >
                                    {typeof perm === 'string' ? perm : perm.permissionId?.module}
                                  </span>
                                ))}
                                {remainingCount > 0 && (
                                  <span className="badge bg-secondary" style={{ fontSize: "11px" }}>
                                    +{remainingCount} more
                                  </span>
                                )}
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-sm btn-outline-primary me-1"
                                  title="View"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-warning me-1"
                                  title="Edit"
                                  onClick={() => {
                                    const permissionsObj = {};
                                    if (v?.permissions && Array.isArray(v.permissions)) {
                                      v.permissions.forEach(perm => {
                                        if (typeof perm === 'object' && perm.permissionId) {
                                          permissionsObj[perm.permissionId.module] = perm.selectedActions || [];
                                        }
                                      });
                                    }
                                    setEditFormData({
                                      name: v?.name,
                                      description: v?.description || "",
                                      permissions: permissionsObj,
                                      _id: v?._id,
                                    });
                                  }}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  title="Delete"
                                  onClick={() => handleDeleteRoleFunc(v?._id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  {list.length == 0 && !showSkelton && <NoRecordFound />}
                </div>
              </div>
            </div>

            {statics?.totalCount > payload.pageCount && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Showing {(payload.pageNo - 1) * payload.pageCount + 1} to{" "}
                  {Math.min(payload.pageNo * payload.pageCount, statics?.totalCount)} of{" "}
                  {statics?.totalCount} entries
                </div>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${payload.pageNo === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => setPayload({ ...payload, pageNo: payload.pageNo - 1 })}
                        disabled={payload.pageNo === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(Math.ceil(statics?.totalCount / payload.pageCount))].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === Math.ceil(statics?.totalCount / payload.pageCount) ||
                        (pageNum >= payload.pageNo - 2 && pageNum <= payload.pageNo + 2)
                      ) {
                        return (
                          <li
                            key={idx}
                            className={`page-item ${payload.pageNo === pageNum ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setPayload({ ...payload, pageNo: pageNum })}
                            >
                              {pageNum}
                            </button>
                          </li>
                        );
                      } else if (
                        pageNum === payload.pageNo - 3 ||
                        pageNum === payload.pageNo + 3
                      ) {
                        return (
                          <li key={idx} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    <li
                      className={`page-item ${payload.pageNo === Math.ceil(statics?.totalCount / payload.pageCount)
                        ? "disabled"
                        : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPayload({ ...payload, pageNo: payload.pageNo + 1 })}
                        disabled={
                          payload.pageNo === Math.ceil(statics?.totalCount / payload.pageCount)
                        }
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {addFormData?.show && renderPermissionModal(addFormData, setAddFormData, "Add Role")}
      {addFormData?.show && <div className="modal-backdrop fade show"></div>}

      {editFormData?._id && renderPermissionModal(editFormData, setEditFormData, "Edit Role")}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default RoleList;

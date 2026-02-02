import React, { useMemo, useState, useEffect } from "react";
import { useGlobalState } from "../GlobalProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { getPermissionListServ } from "../services/permission.service";

const GREEN = "#16a34a";

function Sidebar({ selectedMenu, selectedItem }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { globalState, setGlobalState } = useGlobalState();

  const [hoverExpand, setHoverExpand] = useState(false);
  const isExpanded = globalState?.showFullSidebar || hoverExpand;

  const allNavItems = useMemo(
    () => [
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/1828/1828765.png",
        menu: "Dashboard",
        subMenu: [{ name: "Dashboard", path: "/" }],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/1144/1144760.png",
        menu: "Staff",
        subMenu: [
          { name: "Users", path: "/user-list", module: "Users" },
          { name: "Role", path: "/role-list", module: "Role" },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/9720/9720869.png",
        menu: "Hr Management",
        subMenu: [
          { name: "Branches", path: "/branch-list", module: "Branches" },
          {
            name: "Department",
            path: "/department-list",
            module: "Department",
          },
          {
            name: "Designation",
            path: "/designation-list",
            module: "Designation",
          },
          {
            name: "Documents Type",
            path: "/document-type",
            module: "Documents Type",
          },
          { name: "Employee", path: "/employee-list", module: "Employee" },
          { name: "Award Types", path: "/award-type", module: "Award Types" },
          { name: "Awards", path: "/award-list", module: "Awards" },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/2278/2278049.png",
        menu: "Leave Management",
        subMenu: [
          { name: "Leave Types", path: "/leave-type", module: "Leave Types" },
          {
            name: "Leave Policies",
            path: "/leave-policy",
            module: "Leave Policies",
          },
          {
            name: "Leave Application",
            path: "/leave-application",
            module: "Leave Application",
          },
          {
            name: "Leave Balance",
            path: "/leave-balance",
            module: "Leave Balance",
          },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/3839/3839635.png",
        menu: "Attendance Management",
        subMenu: [
          { name: "Shifts", path: "/shift", module: "Shifts" },
          {
            name: "Attendance Policy",
            path: "/attendance-policy",
            module: "Attendance Policy",
          },
          {
            name: "Attendance Record",
            path: "/attendance-record",
            module: "Attendance Record",
          },
          {
            name: "Attendance Regularization",
            path: "/attendance-regularization",
            module: "Attendance Regularization",
          },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/3839/3839635.png",
        menu: "Collections",
        subMenu: [
          { name: "Collections", path: "/collection", module: "Collection" },
          { name: "Profit", path: "/profit", module: "Profit" },
          { name: "Expense", path: "/expense", module: "Expense" },
        ],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/3839/3839635.png",
        menu: "Finance Management",
        subMenu: [{ name: "Finance", path: "/finance", module: "Finance" }],
      },
      {
        menuIcon: "https://cdn-icons-png.flaticon.com/128/3839/3839635.png",
        menu: "Leads",
        subMenu: [
          { name: "Leads Status", path: "/leads-status", module: "Leads Status" },
          { name: "Leads Sources", path: "/leads-source", module: "Leads Sources" },
          { name: "Leads", path: "/leads", module: "Leads" },
          { name: "Generate Lead", path: "/generate-lead", module: "Leads" },
        ],
      },
    ],
    []
  );

  // Step 2️⃣: Get permission modules that user can "view"
  const [allowedModules, setAllowedModules] = useState([]);
  const [permissionMap, setPermissionMap] = useState({});

  // Fetch full permission list to create a map (handle unpopulated permissions)
  useEffect(() => {
    const fetchFullPermissions = async () => {
      try {
        const res = await getPermissionListServ({ pageCount: 1000, pageNo: 1 });
        const allPerms = res?.data?.data || res?.data || [];

        const map = {};
        allPerms.forEach(p => {
          if (p._id && p.module) {
            map[p._id] = p.module;
          }
        });
        setPermissionMap(map);
      } catch (err) {
        console.error("Failed to map permissions for sidebar:", err);
      }
    };
    fetchFullPermissions();
  }, []);

  useEffect(() => {
    if (globalState?.permissions) {
      try {
        const perms = Array.isArray(globalState.permissions)
          ? globalState.permissions
          : JSON.parse(globalState.permissions);

        const modulesWithView = perms
          .filter((p) => {
            // Check if 'view' is present in either new 'selectedActions' or old 'actions'
            const actions = p.selectedActions || p.actions || [];
            return actions.includes("view");
          })
          .map((p) => {
            // Priority 1: Populated permissionId object
            if (p.permissionId && p.permissionId.module) {
              return p.permissionId.module;
            }
            // Priority 2: Mapped from ID string
            if (p.permissionId && typeof p.permissionId === 'string') {
              return permissionMap[p.permissionId];
            }
            // Priority 3: Fallback checks
            if (p.permissionId && p.permissionId._id && permissionMap[p.permissionId._id]) {
              return permissionMap[p.permissionId._id];
            }
            return null;
          })
          .filter(Boolean); // Remove nulls

        // If 'Dashboard' is strictly not a permission module but we want it always
        // The filtering logic below handles 'Dashboard' explicitly, so this list is just extras.
        setAllowedModules(modulesWithView);
      } catch (err) {
        console.error("Failed to parse permissions:", err);
      }
    }
  }, [globalState.permissions, permissionMap]);

  // Step 3️⃣: Filter nav items based on allowed modules
  const filteredNavItems = allNavItems
    // .map((group) => ({
    //   ...group,
    //   subMenu: group.subMenu.filter(
    //     (s) => allowedModules.includes(s.module) || s.name === "Dashboard" // always show dashboard
    //   ),
    // }))
    // .filter((group) => group.subMenu.length > 0)
    ;

  const [openMenu, setOpenMenu] = useState(selectedMenu || "Dashboard");
  const isActivePath = (p) => pathname === p;

  return (
    <aside
      className={`hrm-sidebar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => !globalState?.showFullSidebar && setHoverExpand(true)}
      onMouseLeave={() => setHoverExpand(false)}
    >
      {/* Mobile Close */}
      <div className="d-flex justify-content-end p-2 d-md-none">
        <img
          src="https://cdn-icons-png.flaticon.com/128/753/753345.png"
          alt="Close"
          style={{ height: "20px", cursor: "pointer" }}
          onClick={() =>
            setGlobalState({ ...globalState, showFullSidebar: false })
          }
        />
      </div>

      {/* Brand */}
      <div className="hrm-brand no-hamburger">
        {isExpanded ? (
          <div className="hrm-wordmark" aria-label="HRM">
            <h1 className="om-sai">
              <span className="om-text">Dou</span>{" "}
              <span className="sai-text">Soft</span>
            </h1>
            <div className="enterprises-text">It Solution</div>
          </div>
        ) : (
          <img className="hrm-logo-compact" src="/crm.svg" alt="Logo" />
        )}
      </div>

      {/* Navigation */}
      <nav className="hrm-nav">
        {filteredNavItems.map((group) => {
          const expandedGroup = openMenu === group.menu;
          const isGroupSelected =
            expandedGroup ||
            group.subMenu.some(
              (s) => s.name === selectedItem || isActivePath(s.path)
            );

          return (
            <div
              key={group.menu}
              className={`hrm-group ${isGroupSelected ? "group-active" : ""}`}
            >
              <button
                className={`hrm-group-btn ${expandedGroup ? "open" : ""}`}
                onClick={() => setOpenMenu(expandedGroup ? "" : group.menu)}
                title={!isExpanded ? group.menu : undefined}
              >
                <img src={group.menuIcon} className="hrm-icon" alt="" />
                {isExpanded && (
                  <span className="hrm-group-text">{group.menu}</span>
                )}
                {isExpanded && (
                  <span className="chev">{expandedGroup ? "▾" : "▸"}</span>
                )}
              </button>

              <div
                className={`hrm-sub ${expandedGroup && isExpanded ? "show" : ""
                  }`}
              >
                {group.subMenu.map((s) => {
                  const active =
                    s.name === selectedItem || isActivePath(s.path);
                  return (
                    <button
                      key={s.name}
                      className={`hrm-sub-item ${active ? "active" : ""}`}
                      onClick={() => navigate(s.path)}
                      title={!isExpanded ? s.name : undefined}
                    >
                      <span className="dot" />
                      {isExpanded && <span className="label">{s.name}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

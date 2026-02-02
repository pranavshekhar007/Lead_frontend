import { useCallback } from 'react';
import { useGlobalState } from '../GlobalProvider';

export const usePermission = (moduleName = null) => {
  const { globalState } = useGlobalState();

  const checkPermission = useCallback((module, requiredAction = 'view') => {
    if (!globalState?.permissions) return false;

    try {
      const perms = Array.isArray(globalState.permissions)
        ? globalState.permissions
        : JSON.parse(globalState.permissions);

      const targetModule = module || moduleName;

      if (!targetModule) return false;
      const permission = perms.find((p) => {
        if (p?.permissionId?.module?.toLowerCase() === targetModule?.toLowerCase()) return true;

        return false;
      });

      if (!permission) return false;

      const actions = permission.selectedActions || permission.actions || [];
      return actions.includes(requiredAction);

    } catch (error) {
      console.error(error);
      return false;
    }
  }, [globalState.permissions, moduleName]);

  if (moduleName) {
    return {
      canView: checkPermission(moduleName, 'view'),
      canCreate: checkPermission(moduleName, 'create'),
      canUpdate: checkPermission(moduleName, 'update'),
      canDelete: checkPermission(moduleName, 'delete'),
      checkPermission
    };
  }

  return { checkPermission };
};

export default usePermission;

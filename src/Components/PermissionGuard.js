import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import usePermission from '../hooks/usePermission';
import Unauthorized from '../Pages/Unauthorized';

const PermissionGuard = ({ module, action = 'view', children }) => {
    const { checkPermission } = usePermission();
    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        if (!module) {
            setHasPermission(true);
            return;
        }
        const allowed = checkPermission(module, action);
        setHasPermission(allowed);
    }, [checkPermission, module, action]);

    if (hasPermission === null) {
        return null; // Loading state or similar
    }

    // if (!hasPermission) {
    //     return <Unauthorized />;
    // }

    return children;
};

export default PermissionGuard;

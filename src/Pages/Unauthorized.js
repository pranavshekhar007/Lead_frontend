import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', color: '#e74c3c' }}>403</h1>
            <h2>Unauthorized Access</h2>
            <p>You do not have permission to view this page.</p>
            <button
                onClick={() => navigate('/')}
                style={{
                    padding: '10px 20px',
                    marginTop: '20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default Unauthorized;

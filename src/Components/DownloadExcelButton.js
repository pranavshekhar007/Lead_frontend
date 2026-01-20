import React, { useState } from 'react';
import axios from 'axios';

const DownloadExcelButton = ({
    apiEndpoint,
    fileName = 'export.xlsx',
    buttonText = 'Download Excel',
    className = '',
    style = {}
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(apiEndpoint, {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to download file');
            setLoading(false);
            console.error('Download error:', err);
        }
    };

    return (
        <div>
            <button
                onClick={handleDownload}
                disabled={loading}
                className={className}
                style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    ...style
                }}
            >
                {loading ? 'Downloading...' : buttonText}
            </button>
            {error && (
                <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default DownloadExcelButton;

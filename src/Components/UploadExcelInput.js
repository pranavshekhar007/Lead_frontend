import React, { useState } from 'react';
import axios from 'axios';

const UploadExcelInput = ({
    apiEndpoint,
    onSuccess,
    onError,
    buttonText = 'Upload Excel',
    acceptTypes = '.xlsx,.xls',
    className = '',
    style = {}
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post(apiEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setLoading(false);
            setSelectedFile(null);

            if (onSuccess) {
                onSuccess(response.data);
            }

            const fileInput = document.getElementById('excel-file-input');
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to upload file';
            setError(errorMsg);
            setLoading(false);

            if (onError) {
                onError(errorMsg);
            }
            console.error('Upload error:', err);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    id="excel-file-input"
                    type="file"
                    accept={acceptTypes}
                    onChange={handleFileChange}
                    disabled={loading}
                    style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={handleUpload}
                    disabled={loading || !selectedFile}
                    className={className}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading || !selectedFile ? '#ccc' : '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        ...style
                    }}
                >
                    {loading ? 'Uploading...' : buttonText}
                </button>
            </div>
            {error && (
                <div style={{ color: 'red', fontSize: '14px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default UploadExcelInput;

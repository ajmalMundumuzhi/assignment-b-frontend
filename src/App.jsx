import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './App.css';

function App() {
    const [uploadStatus, setUploadStatus] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus('Uploading...');
            const res = await axios.post('https://agni-api.onrender.com/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadedFile(res.data.file.filename);
            setUploadStatus('Success!');
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('Failed. Please try again.');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="container">
            <h1>🔥 Agni's Purifier 🔥</h1>
            <p>Upload files for temporary keeping. Agni will purify them after 24 hours.</p>

            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop a file here, or click to select</p>}
            </div>

            {uploadStatus && <p className="status">{uploadStatus}</p>}
            {uploadedFile && <p className="success-message">File '{uploadedFile}' has been stored. It will be deleted in 24 hours.</p>}
        </div>
    );
}

export default App;
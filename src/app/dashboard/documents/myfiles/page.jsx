"use client";

import React, { useState, useRef } from "react";
import DashboardLayout from "../../components/dashboardlayout";
import { File, Upload, Download, Plus } from "lucide-react";

const MyFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setSelectedFiles(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    const newUploadedFiles = selectedFiles.map((file) => ({
      file,
      uploadDate: new Date(),
      description: fileDescription,
    }));

    setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
    setSelectedFiles([]);
    setFileDescription("");
  };

  const openFileInNewTab = (file) => {
    const fileUrl = URL.createObjectURL(file.file);
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (file) => {
    const fileUrl = URL.createObjectURL(file.file);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupFilesByDate = (files) => {
    const grouped = {};
    files.forEach((file) => {
      const dateKey = file.uploadDate.toLocaleDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(file);
    });
    return grouped;
  };

  const sortedUploadedFiles = Object.entries(groupFilesByDate(uploadedFiles)).sort(
    ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div
            className="border-dashed border-2 border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer mb-4"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <Plus size={48} className="text-gray-500 mb-2" />
            <p className="text-gray-600">Drag and drop files here, or click to select</p>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <textarea
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            placeholder="Add a description for all files..."
            className="w-full p-2 border rounded mb-4"
          />

          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Selected Files</h3>
              <ul className="space-y-2">
                {selectedFiles.map((file) => (
                  <li key={file.name} className="border rounded p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <File size={18} />
                        <span>{file.name}</span>
                        <span className="text-sm text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded cursor-pointer w-fit"
          >
            Upload Files
          </button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Uploaded Files</h2>
            {sortedUploadedFiles.map(([date, files]) => (
              <div key={date} className="mb-4">
                <h3 className="font-semibold mb-2">{date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => (
                    <div key={file.file.name} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <File size={18} />
                          <span>{file.file.name}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openFileInNewTab(file)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Open
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                          >
                            <Download size={16} />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{file.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyFiles;
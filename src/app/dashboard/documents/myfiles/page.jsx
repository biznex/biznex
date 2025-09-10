"use client";

import React, { useState, useRef } from "react";
import DashboardLayout from "../../components/dashboardlayout";
import { File, Download, Plus } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { create } from "qrcode";



const MyFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();

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

  const handleUpload = async () => {
  if (selectedFiles.length === 0) return;

  for (const file of selectedFiles) {
    try {
      // Step 1: Request signed URL from backend
      const response = await fetch(
        `https://biznex.onrender.com/s3up/generate-upload-url?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`,
        { method: "GET", mode: "cors" }
      );

      console.log("Requesting signed URL for:", file.name);

      if (!response.ok) {
        const text = await response.text();
        console.error("Backend response:", text);
        throw new Error("Failed to get upload URL from backend");
      }

      const { uploadURL, key } = await response.json();
      console.log("Signed URL:", uploadURL);
      console.log("File key:", key);

      // Step 2: Upload file to S3 using signed URL
      // Do NOT manually add x-amz-* headers; they are already included in the signed URL
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
      });

      if (!uploadResponse.ok) {
        const text = await uploadResponse.text(); // read error response from S3
        console.error("S3 upload error response:", text);
        throw new Error(`Failed to upload to S3 (status ${uploadResponse.status})`);
      }

      // Step 3: Construct public URL and store metadata
      const fileURL = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

      setUploadedFiles((prev) => [
        ...prev,
        {
          file,
          uploadDate: new Date(),
          description: fileDescription,
          url: fileURL,
        },
      ]);

      console.log("✅ Upload successful:", fileURL);

      const token = localStorage.getItem("token");
      const metaresponse = await fetch("https://biznex.onrender.com/document/create", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        withCredentials: true,
        body: JSON.stringify({ file_url:fileURL, description: fileDescription }),
      });

      console.log(metaresponse);
      if (!metaresponse.ok) {
        const text = await metaresponse.text();
        console.error("Metadata storage response:", text);
        throw new Error("Failed to store file metadata");
      }
      console.log("✅ Metadata stored for:", file.name);

    } catch (error) {
      console.error(`❌ Error uploading ${file.name}:`, error);
    }
  }

  // Reset selected files and description after upload
  setSelectedFiles([]);
  setFileDescription("");
};


  useEffect(() => {
      const fetchFileData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get("https://biznex.onrender.com/document/documents", {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true,
          });
  
          console.log("API Response:", response.data);
  
          if (response.status >= 200 && response.status < 300) {
            const products = response.data.documents;
            const mappedProducts = products.map((item) => ({
              doc_id: item.document_id,
              created_at: item.created_at,
              file_url: item.file_url,
              
              description: item.description || "No description",
            }));
            console.log("Mapped Products:", mappedProducts);
  
            setUploadedFiles(mappedProducts);
          }

          
        } catch (error) {
          console.error("Error fetching data:", error);
          if (error.response && error.response.status === 401) {
            alert("Unauthorized access, Failed to load dashboard data.. Please log in again.");
            router.push("/login");
          } else {
            console.error("Error fetching data:", error);
          }
        }
      };
      fetchFileData();
    }, [router]);


  const openFileInNewTab = (file) => {
    if (file.file_url) {
      window.open(file.file_url, "_blank"); // Open from S3
    } else {
      const fileUrl = URL.createObjectURL(file.file);
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownload = (file) => {
    const fileUrl = file.file_url || URL.createObjectURL(file.file);
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
      const dateKey = new Date(file.created_at || file.uploadDate).toLocaleDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(file);
    });
    return grouped;
  };

  const sortedUploadedFiles = Object.entries(
    groupFilesByDate(uploadedFiles)
  ).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA));

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
            <p className="text-gray-600">
              Drag and drop files here, or click to select
            </p>
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
                  {files.map((file) => {
                    // This logic determines the correct display name
                    let displayName = '';
                    if (file.file) {
                      // Case 1: For newly selected files before upload is complete
                      displayName = file.file.name;
                    } else if (file.file_url) {
                      // Case 2: For files fetched from the server
                      const fullFileName = decodeURIComponent(file.file_url.split('/').pop());
                      const firstHyphenIndex = fullFileName.indexOf('-');
                      
                      // Take the part of the string *after* the first hyphen
                      const cleanFileName = firstHyphenIndex > -1
                        ? fullFileName.substring(firstHyphenIndex + 1)
                        : fullFileName; // Fallback if no hyphen is found
                        
                      displayName = `${file.doc_id} - ${cleanFileName}`;
                    }

                    return (
                      <div key={file.doc_id || file.file?.name} className="border rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2 truncate">
                            <File size={18} />
                            <span className="truncate" title={displayName}>{displayName}</span>
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
                    );
                  })}
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

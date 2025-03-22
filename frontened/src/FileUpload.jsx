import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const uploadInProgress = useRef(false); // Prevent duplicate uploads

  const handleDrop = (event) => {
    event.preventDefault();
    if (uploading) return; // Prevent upload while another is ongoing

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event?.preventDefault(); // Prevent accidental form submission
    if (!file || uploading || uploadInProgress.current) return;

    console.log("Upload started"); // Debugging log
    uploadInProgress.current = true; // Mark upload as in progress
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const cloudName = dhavqcgxt;
    const apiKey = 716227869133191;

    if (!cloudName || !apiKey) {
      console.error("Missing Cloudinary environment variables.");
      setUploading(false);
      uploadInProgress.current = false;
      return;
    }

    try {
      // Request signature from backend
      const signatureResponse = await fetch("/api/getSignature");
      const { signature, timestamp } = await signatureResponse.json();

      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        console.log("Uploaded to Cloudinary:", data.secure_url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      uploadInProgress.current = false;
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div
        className="w-50 p-4 bg-white rounded shadow text-center border"
        style={{ border: "2px dashed #6c757d" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          id="fileInput"
          className="d-none"
          onChange={handleFileChange}
        />
        <div
          className="cursor-pointer"
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <label htmlFor="fileInput" className="text-muted d-block mb-3">
            {file ? file.name : "Drag & drop a file here or click to upload"}
          </label>
        </div>
        <button
          className="btn btn-primary mt-2"
          onClick={handleSubmit}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Send"}
        </button>
        {imageUrl && (
          <div className="mt-3">
            <p>Uploaded Image:</p>
            <img
              src={imageUrl}
              alt="Uploaded"
              className="img-fluid"
              width="200"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

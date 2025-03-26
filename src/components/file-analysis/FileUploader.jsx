// src/components/file-analysis/FileUploader.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from '../../redux/slices/fileSlice';
import { Button } from '../common/Button';
import { CloudUploadIcon, DocumentTextIcon } from '@heroicons/react/outline';

export const FileUploader = ({ tenantId, onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  const { isUploading } = useSelector(state => state.files);
  
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [description, setDescription] = useState('');
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const newFiles = Array.from(e.dataTransfer.files);
    
    // Validate file size (max 100MB)
    const validFiles = newFiles.filter(file => file.size <= 104857600);
    
    if (validFiles.length < newFiles.length) {
      // Show error message about file size limit
      alert('Some files exceed the 100MB size limit and were not added.');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Validate file size (max 100MB)
    const validFiles = newFiles.filter(file => file.size <= 104857600);
    
    if (validFiles.length < newFiles.length) {
      // Show error message about file size limit
      alert('Some files exceed the 100MB size limit and were not added.');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };
  
  const handleUpload = () => {
    if (files.length === 0) return;
    
    const options = {
      description: description.trim(),
    };
    
    // Upload each file
    files.forEach(file => {
      dispatch(uploadFile({ tenantId, file, options }));
    });
    
    // Close modal after upload is initiated
    onClose();
  };
  
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Upload Files
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload files for analysis. Maximum file size is 100MB.
                  </p>
                </div>
                
                <div className="mt-4">
                  <div
                    className={`
                      mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                      rounded-md cursor-pointer
                      ${dragging 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600'}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-1 text-center">
                      <CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PDF, DOCX, TXT, CSV, XLS, XLSX up to 100MB
                      </p>
                    </div>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Selected Files ({files.length})
                    </h4>
                    <ul className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                      {files.map((file, index) => (
                        <li key={index} className="py-2 flex justify-between items-center">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatBytes(file.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description (optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter a description for these files"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={isUploading || files.length === 0}
              className="w-full sm:w-auto sm:ml-3"
            >
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto mt-3 sm:mt-0"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
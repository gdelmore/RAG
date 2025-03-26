// src/components/file-analysis/FileAnalysisPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchFiles, 
  analyzeFile, 
  connectCloudStorage,
  fetchCloudFiles,
  analyzeCloudFile,
  clearAnalysisResults
} from '../../redux/slices/fileSlice';
import { useTenant } from '../../contexts/TenantContext';
import { PageHeader } from '../common/PageHeader';
import { Button } from '../common/Button';
import { FileList } from './FileList';
import { FileAnalysisResults } from './FileAnalysisResults';
import { CloudStorageConnector } from './CloudStorageConnector';
import { UploadIcon } from '@heroicons/react/outline';

// FileUploader component would need to be created
import { FileUploader } from './FileUploader';

const FileAnalysisPage = () => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showCloudConnector, setShowCloudConnector] = useState(false);
  
  const { 
    files, 
    cloudFiles,
    connectedStorages,
    analysisResults, 
    isLoading, 
    isUploading, 
    isAnalyzing 
  } = useSelector(state => state.files);
  
  useEffect(() => {
    if (tenant) {
      dispatch(fetchFiles({ tenantId: tenant.id, filters: {} }));
      dispatch(clearAnalysisResults());
    }
  }, [dispatch, tenant]);
  
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file.analyzed) {
      dispatch(analyzeFile({ tenantId: tenant.id, fileId: file.id }));
    } else {
      dispatch(clearAnalysisResults());
    }
  };
  
  const handleAnalyzeFile = () => {
    if (selectedFile && !selectedFile.analyzed) {
      dispatch(analyzeFile({ tenantId: tenant.id, fileId: selectedFile.id }));
    }
  };
  
  const handleConnectCloudStorage = (provider, credentials) => {
    dispatch(connectCloudStorage({ 
      tenantId: tenant.id, 
      provider, 
      credentials 
    }));
  };
  
  const handleCloudFileSelect = (provider, filePath) => {
    dispatch(analyzeCloudFile({ 
      tenantId: tenant.id, 
      provider, 
      filePath 
    }));
  };
  
  const toggleUploader = () => {
    setShowUploader(!showUploader);
  };
  
  const toggleCloudConnector = () => {
    setShowCloudConnector(!showCloudConnector);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="File Analysis"
        description="Upload and analyze documents to extract insights and answer questions."
        actions={
          <>
            <Button 
              variant="outline" 
              onClick={toggleCloudConnector}
            >
              Connect Cloud Storage
            </Button>
            <Button 
              onClick={toggleUploader}
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Upload Files
            </Button>
          </>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* File list */}
        <div>
          <FileList
            files={files}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            isLoading={isLoading}
          />
        </div>
        
        {/* File analysis results */}
        <div className="lg:col-span-2">
          <FileAnalysisResults
            file={selectedFile}
            results={analysisResults}
            isAnalyzing={isAnalyzing}
          />
          
          {selectedFile && !selectedFile.analyzed && !isAnalyzing && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleAnalyzeFile}
                isLoading={isAnalyzing}
                disabled={isAnalyzing}
              >
                Analyze File
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* File uploader modal */}
      {showUploader && (
        <FileUploader
          tenantId={tenant?.id}
          onClose={toggleUploader}
        />
      )}
      
      {/* Cloud storage connector */}
      {showCloudConnector && (
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
                  onClick={toggleCloudConnector}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <CloudStorageConnector
                connectedStorages={connectedStorages}
                onConnect={handleConnectCloudStorage}
                cloudFiles={cloudFiles}
                onFileSelect={handleCloudFileSelect}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAnalysisPage;
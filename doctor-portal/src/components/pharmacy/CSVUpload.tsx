import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Download,
  Eye,
  RefreshCw,
  Database,
  AlertCircle
} from 'lucide-react';

interface Medicine {
  'Medicine Name': string;
  'Generic Name': string;
  'Category': string;
  'Manufacturer': string;
  'Batch Number': string;
  'Stock Quantity': number;
  'Unit Price': number;
  'Expiry Date': string;
  'Minimum Stock Level': number;
  'Rack Location': string;
  'Prescription Required': string;
  'Description': string;
}

interface CSVUploadProps {
  onDataUploaded: (medicines: Medicine[]) => void;
  existingCount?: number;
}

const CSVUpload: React.FC<CSVUploadProps> = ({ onDataUploaded, existingCount = 0 }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewData, setPreviewData] = useState<Medicine[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = useCallback((csvText: string): Medicine[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const requiredHeaders = [
      'Medicine Name', 'Generic Name', 'Category', 'Manufacturer', 
      'Batch Number', 'Stock Quantity', 'Unit Price', 'Expiry Date',
      'Minimum Stock Level', 'Rack Location', 'Prescription Required', 'Description'
    ];

    // Validate headers
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const medicines: Medicine[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      try {
        const medicine: any = {};
        headers.forEach((header, index) => {
          medicine[header] = values[index];
        });

        // Type conversion and validation
        medicine['Stock Quantity'] = parseInt(medicine['Stock Quantity']);
        medicine['Unit Price'] = parseFloat(medicine['Unit Price']);
        medicine['Minimum Stock Level'] = parseInt(medicine['Minimum Stock Level']);

        if (isNaN(medicine['Stock Quantity']) || medicine['Stock Quantity'] < 0) {
          errors.push(`Row ${i + 1}: Invalid stock quantity`);
          continue;
        }

        if (isNaN(medicine['Unit Price']) || medicine['Unit Price'] <= 0) {
          errors.push(`Row ${i + 1}: Invalid unit price`);
          continue;
        }

        if (isNaN(medicine['Minimum Stock Level']) || medicine['Minimum Stock Level'] < 0) {
          errors.push(`Row ${i + 1}: Invalid minimum stock level`);
          continue;
        }

        // Validate date format
        const expiryDate = new Date(medicine['Expiry Date']);
        if (isNaN(expiryDate.getTime())) {
          errors.push(`Row ${i + 1}: Invalid expiry date format`);
          continue;
        }

        // Validate prescription required field
        if (!['Yes', 'No'].includes(medicine['Prescription Required'])) {
          errors.push(`Row ${i + 1}: Prescription Required must be 'Yes' or 'No'`);
          continue;
        }

        medicines.push(medicine as Medicine);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setValidationErrors(errors);
    return medicines;
  }, []);

  const handleFile = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please select a CSV file');
      setUploadStatus('error');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setErrorMessage('File size must be less than 5MB');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    setErrorMessage('');
    setValidationErrors([]);

    try {
      const text = await selectedFile.text();
      const medicines = parseCSV(text);
      
      if (medicines.length === 0) {
        throw new Error('No valid medicine records found in the CSV file');
      }

      setPreviewData(medicines);
      setShowPreview(true);
      setUploadStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  }, [parseCSV]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const confirmUpload = () => {
    onDataUploaded(previewData);
    setShowPreview(false);
    setFile(null);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelUpload = () => {
    setShowPreview(false);
    setFile(null);
    setPreviewData([]);
    setUploadStatus('idle');
    setErrorMessage('');
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/demo-medicines.csv';
    link.download = 'medicine-template.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-orange-400 bg-orange-50'
            : uploadStatus === 'error'
            ? 'border-red-300 bg-red-50'
            : uploadStatus === 'success'
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          {isUploading ? (
            <>
              <RefreshCw className="h-12 w-12 text-orange-500 mx-auto animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Processing CSV...</h3>
                <p className="text-gray-600">Please wait while we validate your file</p>
              </div>
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">File processed successfully!</h3>
                <p className="text-gray-600">
                  Found {previewData.length} medicine records
                  {validationErrors.length > 0 && (
                    <span className="text-yellow-600">
                      {' '}with {validationErrors.length} warnings
                    </span>
                  )}
                </p>
              </div>
            </>
          ) : uploadStatus === 'error' ? (
            <>
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload failed</h3>
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload Medicine Inventory</h3>
                <p className="text-gray-600">Drag and drop your CSV file here, or click to browse</p>
              </div>
            </>
          )}

          {uploadStatus !== 'success' && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </button>
          )}
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={cancelUpload}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">Validation Warnings</h4>
              <p className="text-sm text-yellow-700 mb-2">
                The following rows had issues and were skipped:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {validationErrors.length > 10 && (
                  <li className="italic">... and {validationErrors.length - 10} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </button>
          
          <div className="text-sm text-gray-600">
            <Database className="h-4 w-4 inline mr-1" />
            Current inventory: {existingCount} items
          </div>
        </div>

        {showPreview && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Data</span>
            </button>
            
            <button
              onClick={confirmUpload}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Import {previewData.length} Records</span>
            </button>
          </div>
        )}
      </div>

      {/* Preview Table */}
      {showPreview && previewData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Preview Data</h3>
            <p className="text-sm text-gray-600">Showing first 10 records</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 10).map((medicine, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {medicine['Medicine Name']}
                        </div>
                        <div className="text-sm text-gray-500">
                          {medicine['Generic Name']}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine.Category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        medicine['Stock Quantity'] <= medicine['Minimum Stock Level']
                          ? 'bg-red-100 text-red-800'
                          : medicine['Stock Quantity'] <= medicine['Minimum Stock Level'] * 1.5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {medicine['Stock Quantity']}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{medicine['Unit Price'].toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine['Expiry Date']}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medicine['Rack Location']}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {previewData.length > 10 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                ... and {previewData.length - 10} more records
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVUpload;

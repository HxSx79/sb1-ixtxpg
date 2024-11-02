import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      if (data) {
        try {
          const { read, utils } = await import('xlsx');
          const workbook = read(data, { 
            type: 'binary',
            cellDates: false, // Keep raw values for time processing
            cellNF: false,
            cellText: false
          });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet, { 
            raw: true,
            rawNumbers: true
          });
          
          console.log('Excel Data:', {
            firstRow: jsonData[0],
            timeValue: jsonData[0]?.Time,
            timeType: typeof jsonData[0]?.Time
          });
          
          onFileUpload(jsonData);
        } catch (error) {
          console.error('Excel Processing Error:', error);
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
        <Upload className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Upload Excel</span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
// ExportToExcel.js
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function ExportToExcel() {
  const [students, setStudents] = useState([]);
  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student_data.xlsx');
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/students');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={handleExportExcel}>Export Excel</button>
    </div>
  );
}

export default ExportToExcel;

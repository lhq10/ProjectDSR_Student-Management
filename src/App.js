import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import AddStudentForm from './components/AddStudentForm';
import StudentPerPage from './components/StudentPerPage';
import ExportToExcel from './components/ExportToExcel';

function App() {
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const handleShowStudents = () => {
    setShowStudents(!showStudents);
  };

  const [currentPage] = useState(1);
  const studentsPerPage = 5;
  const [showStudentsPerPage, setShowStudentsPerPage] = useState(false);
  const handleShowStudentsPerPage = () => {
    setShowStudentsPerPage(!showStudentsPerPage);
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

  const handleAddStudent = (student) => {
    fetch('http://127.0.0.1:8000/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    })
      .then(response => response.json())
      .then(data => {
        setStudents([...students, data]);
        window.location.reload();
      })
      .catch(error => console.error('Error adding student:', error));
    };

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

return (
  <div>
      <h1>Student Management System</h1>
      <button onClick={handleShowStudents}>
        {showStudents ? 'Hide Students' : 'Show Students'}
      </button>
      {showStudents && (
        <StudentList students={students} />
      )}
      <ExportToExcel/>

      <button onClick={handleShowStudentsPerPage}>
        {showStudentsPerPage ? 'Hide Students Per Page' : 'Show Students Per Page'}
      </button>
      {showStudentsPerPage && <StudentPerPage students={currentStudents} />}
      
      <AddStudentForm onAddStudent={handleAddStudent} />
    </div>
);
}

export default App;
import React, { useState, useEffect } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    StudentID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    DateOfBirth: '',
    Hometown: '',
    TotalScore: '',
  });

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

  const handleDelete = async (studentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/students/:student_id?student_id=${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // After successful deletion, update the list of students
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      StudentID: student.StudentID,
      FirstName: student.FirstName,
      LastName: student.LastName,
      Email: student.Email,
      DateOfBirth: student.DateOfBirth,
      Hometown: student.Hometown,
      TotalScore: student.TotalScore,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async () => {

    try {
      const response = await fetch(`http://127.0.0.1:8000/students/:student_id?student_id=${formData.StudentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // After successful update, reset editingStudent and fetchData
      setEditingStudent(null);
      fetchData();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date Of Birth</th>
            <th>Home Town</th>
            <th>Total Score</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.StudentID}>
              <td>{student.StudentID}</td>
              <td>{student.FirstName}</td>
              <td>{student.LastName}</td>
              <td>{student.Email}</td>
              <td>{student.DateOfBirth}</td>
              <td>{student.Hometown}</td>
              <td>{student.TotalScore}</td>
              <td>
                <button onClick={() => handleDelete(student.StudentID)}>Delete</button>
                <button onClick={() => handleEdit(student)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingStudent && (
        <form onSubmit={handleFormSubmit}>
          <input type="text" name="StudentID" value={formData.StudentID} onChange={handleFormChange} />
          <input type="text" name="FirstName" value={formData.FirstName} onChange={handleFormChange} />
          <input type="text" name="LastName" value={formData.LastName} onChange={handleFormChange} />
          <input type="email" name="Email" value={formData.Email} onChange={handleFormChange} />
          <input type="text" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleFormChange} />
          <input type="text" name="Hometown" value={formData.Hometown} onChange={handleFormChange} />
          <input type="number" name="TotalScore" value={formData.TotalScore} onChange={handleFormChange} />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default StudentList;

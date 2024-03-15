import React, { useState } from 'react';

function AddStudentForm({ onAddStudent }) {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    hometown: '',
    total_score: '',
  });

  const handleChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    onAddStudent(formData);
    setFormData({
      student_id: '',
      first_name: '',
      last_name: '',
      email: '',
      date_of_birth: '',
      hometown: '',
      total_score: '',
    });
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="student_id" placeholder="Student ID" value={formData.student_id} onChange={handleChange} required />
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="date_of_birth" placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} required />
        <input type="text" name="hometown" placeholder="Hometown" value={formData.hometown} onChange={handleChange} required />
        <input type="number" name="total_score" placeholder="Total Score" value={formData.total_score} onChange={handleChange} required />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudentForm;

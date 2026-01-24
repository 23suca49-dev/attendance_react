import React, { useState, useEffect } from 'react';
import { getAttendanceAPI } from '../services/attendanceService';
import '../styles/AttendanceForm.css';

function AttendanceForm({ onSubmit, editingRecord, onCancel }) {
  const [formData, setFormData] = useState({
    studentName: '',
    totalClasses: '',
    attendedClasses: '',
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        studentName: editingRecord.studentName || '',
        totalClasses: editingRecord.totalClasses || '',
        attendedClasses: editingRecord.attendedClasses || '',
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'studentName' ? value : parseInt(value, 10) || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentName || !formData.totalClasses || !formData.attendedClasses) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.attendedClasses > formData.totalClasses) {
      alert('Attended classes cannot be more than total classes');
      return;
    }

    try {
      if (editingRecord) {
        await getAttendanceAPI.update(editingRecord.id, formData);
      } else {
        await getAttendanceAPI.create(formData);
      }
      setFormData({
        studentName: '',
        totalClasses: '',
        attendedClasses: '',
      });
      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  const handleCancel = () => {
    setFormData({
      studentName: '',
      totalClasses: '',
      attendedClasses: '',
    });
    onCancel();
  };

  return (
    <div className="form-container">
      <h2>{editingRecord ? 'Edit Attendance Record' : 'Add New Attendance Record'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalClasses">Total Classes *</label>
          <input
            type="number"
            id="totalClasses"
            name="totalClasses"
            value={formData.totalClasses}
            onChange={handleChange}
            placeholder="e.g., 50"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="attendedClasses">Attended Classes *</label>
          <input
            type="number"
            id="attendedClasses"
            name="attendedClasses"
            value={formData.attendedClasses}
            onChange={handleChange}
            placeholder="e.g., 40"
            min="0"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-submit">
            {editingRecord ? 'Update Record' : 'Add Record'}
          </button>
          {editingRecord && (
            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AttendanceForm;

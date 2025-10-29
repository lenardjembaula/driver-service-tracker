import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';
import './add-department.css';

export default function AddDepartment() {
  const navigate = useNavigate();
  const [NewDepartment, SetNewDepartment] = useState({
    name: ''
  });

  const handleChange = (column_name) => (new_data) => {
    SetNewDepartment((prev_data) => ({ ...prev_data, [column_name]: new_data.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('department').insert(NewDepartment).select();

      Swal.fire(
        error ? 'Error' : 'Success',
        error ? 'Failed to add department.' : 'Department successfully added.',
        error ? 'error' : 'success'
      );
      if (!error) navigate('/department/index');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="department-container">
      <h2 className="department-header">New Department</h2>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="department-element">
          <div className="department-form">
            <div className="form-floating">
              <input
                type="text"
                id="department-name"
                className="form-control"
                placeholder="Department"
                value={NewDepartment.name}
                onChange={handleChange('name')}
              />
              <label htmlFor="department-name">Department</label>
            </div>
          </div>
        </div>
      </form>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add Department
        </button>
        <Link className="btn btn-outline-danger" to={'/department/index'}>
          Cancel
        </Link>
      </div>
    </div>
  );
}

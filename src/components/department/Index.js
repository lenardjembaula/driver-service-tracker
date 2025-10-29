import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';
import './index.css';

export default function DepartmentIndex() {
  const [Departments, SetDepartments] = useState([]);

  useEffect(() => {
    GetDepartments();
  }, []);

  async function GetDepartments() {
    const { data, error } = await supabase
      .from('department')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      Swal.fire('Error', 'Unable to fetch departments.', 'error');
    } else {
      console.log('Department: ', data);
      SetDepartments(data);
    }
  }

  async function handleDelete(id) {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this department.',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    });

    if (!isConfirmed) return;

    const { error } = await supabase.from('department').delete().eq('id', id);

    Swal.fire(
      error ? 'Error' : 'Deleted!',
      error ? 'Unable to delete this record.' : 'The department has been deleted.',
      error ? 'error' : 'success'
    );

    !error && GetDepartments();
  }

  return (
    <div className="department-container">
      <h2 className="department-header">List of Department</h2>

      <div className="department-contents">
        <div className="add-refresh-buttons">
          <Link
            className="btn btn-primary"
            role="button"
            to={'/department/create'}
            title="Add Department">
            Add Department <i className="bi bi-plus"></i>
          </Link>
          <button
            type="button"
            className="btn btn-outline-primary refresh"
            title="Refresh"
            onClick={GetDepartments}>
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>

        <div className="department-table">
          <table id="myTable" className="table align-middle text-nowrap">
            <thead>
              <tr>
                <th>Department ID</th>
                <th>Department</th>
                <th>Creation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Departments.map((department, index) => {
                return (
                  <tr key={index}>
                    <td>{department.id}</td>
                    <td>{department.name}</td>
                    <td>{department.created_at}</td>
                    <td>
                      <Link
                        className="btn btn-outline-warning me-1"
                        to={`/department/update/${department.id}`}
                        role="button"
                        title="Update">
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(department.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

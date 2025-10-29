import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import Swal from 'sweetalert2';

export default function EditDepartment() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [Department, SetDepartment] = useState({
    name: ''
  });

  useEffect(() => {
    if (!id) return;

    async function fetchDepartment() {
      const { data, error } = await supabase.from('department').select('*').eq('id', id).single();

      if (error) {
        console.log('Error', error);
      } else if (data) {
        SetDepartment(data);
      }
    }

    fetchDepartment();
  }, [id]);

  const handleChange = (column_name) => (new_data) => {
    SetDepartment((prev_data) => ({ ...prev_data, [column_name]: new_data.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('department')
        .update(Department)
        .eq('id', id)
        .select();

      Swal.fire(
        error ? 'Error' : 'Department Updated',
        error ? 'Unable to update department.' : 'Department updated successfully',
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

      <form autoComplete="off" onSubmit={handleUpdate}>
        <div className="department-element">
          <div className="department-form">
            <div className="form-floating">
              <input
                type="text"
                id="department-name"
                className="form-control"
                placeholder="Department"
                value={Department.name}
                onChange={handleChange('name')}
              />
              <label htmlFor="department-name">Department</label>
            </div>
          </div>
        </div>
      </form>

      <div className="action-buttons">
        <button type="submit" className="btn btn-primary" onClick={handleUpdate}>
          Update Department
        </button>
        <Link className="btn btn-outline-danger" to={'/department/index'}>
          Cancel
        </Link>
      </div>
    </div>
  );
}

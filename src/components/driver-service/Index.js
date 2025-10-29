import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

export default function ServiceIndex() {
  const [Service, SetService] = useState([]);

  useEffect(() => {
    GetServices();
  }, []);

  async function GetServices() {
    const { data, error } = await supabase
      .from('driver-service')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      Swal.fire('Error', 'Unable to get driver services data.', 'error');
    } else {
      // Format ng date to MMMM dd, yyyy
      // bago natin ipasa ung data
      const formattedData = formatServiceData(data);

      SetService(formattedData);
    }
  }

  async function handleDelete(id) {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this entry.',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    });
    if (!isConfirmed) return;
    const { error } = await supabase.from('driver-service').delete().eq('id', id);
    Swal.fire(
      error ? 'Error' : 'Deleted!',
      error ? 'Unable to delete the record.' : 'The record has been deleted.',
      error ? 'error' : 'success'
    );
    !error && GetServices();
  }

  function formatServiceData(data) {
    return data.map((item) => {
      // Helper para sa time formatting
      const formatTime = (t) => {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${
          h >= 12 ? 'PM' : 'AM'
        }`;
      };

      // Helper para sa date formatting sa UI
      return {
        ...item,
        date: item.date
          ? new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit'
            })
          : '',
        start_time: formatTime(item.start_time),
        end_time: formatTime(item.end_time)
      };
    });
  }

  return (
    <div className="my-4 container-fluid d-flex flex-column align-items-center">
      <h2 className="text-center mb-4">Service List</h2>

      <div>
        <div className="d-flex justify-content-center">
          <div className="col">
            <Link
              className="btn btn-primary me-1"
              role="button"
              to="/driver-service/create"
              title="Book Now">
              Book Now <i className="bi bi-plus text-dark"></i>
            </Link>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={GetServices}
              title="Refresh">
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        <table className="table align-middle text-nowrap">
          <thead>
            <tr>
              <th scope="col">Requestor</th>
              <th scope="col">Department</th>
              <th scope="col">Driver</th>
              <th scope="col">Service Details</th>
              <th scope="col">Service date</th>
              <th scope="col">Start time</th>
              <th scope="col">End time</th>
              <th scope="col" className="text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Service.map((Service, index) => {
              return (
                <tr key={index}>
                  <td>
                    {Service.requestor_first_name} {Service.requestor_last_name}
                  </td>
                  <td>{Service.requestor_department}</td>
                  <td>{Service.driver}</td>
                  <td>{Service.description}</td>
                  <td>{Service.date}</td>
                  <td>{Service.start_time}</td>
                  <td>{Service.end_time}</td>
                  <td>
                    <Link
                      className="btn btn-outline-warning me-1"
                      to={`/driver-service/update/${Service.id}`}
                      role="button"
                      title="Update">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(Service.id)}
                      title="Delete">
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
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

export default function DriverIndex() {
  const [driver, SetDriver] = useState([]);

  useEffect(() => {
    GetDrivers();
  }, []);

  async function GetDrivers() {
    const { data, error } = await supabase
      .from('driver')
      .select('*')
      .order('first_name', { ascending: true });

    if (error) {
      Swal.fire('Error', 'Unable to get drivers data.', 'error');
    } else {
      SetDriver(data);
    }
  }

  async function handleDelete(id) {
    const { isConfirmed } = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this driver data.',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    });

    if (!isConfirmed) return;

    const { error } = await supabase.from('driver').delete().eq('id', id);

    Swal.fire(
      error ? 'Error' : 'Deleted!',
      error ? 'Unable to delete this driver.' : 'The driver data has been deleted.',
      error ? 'error' : 'success'
    );
    !error && GetDrivers();
  }

  return (
    <div className="my-4 container-fluid d-flex flex-column align-items-center">
      <h2 className="text-center mb-4">Service Drivers</h2>

      <div>
        <div className="d-flex justify-content-center">
          <div className="col">
            <Link className="btn btn-primary me-1" role="button" to="/driver/adddriver">
              Add Driver <i className="bi bi-plus text-dark"></i>
            </Link>
            <button type="button" className="btn btn-outline-primary" onClick={GetDrivers}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>

        <table class="table align-middle text-nowrap">
          <thead>
            <tr>
              <th scope="col">First name</th>
              <th scope="col">Last name</th>
              <th scope="col">E-mail</th>
              <th scope="col">Contact No.</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {driver.map((driver, index) => {
              return (
                <tr key={index}>
                  <td>{driver.first_name}</td>
                  <td>{driver.last_name}</td>
                  <td>{driver.email_address}</td>
                  <td>{driver.phone_number}</td>
                  <td>
                    <Link
                      className="btn btn-outline-warning me-1"
                      role="button"
                      to={`/driver/updatedriver/${driver.id}`}>
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(driver.id)}>
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

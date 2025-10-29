import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

export default function UpdateDriver() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Driver Object to dito ilalagay ung selected driver.
  const [DriverData, SetDriverData] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: ''
  });

  // Fetch natin yung data ng driver na pinindot from the index
  useEffect(() => {
    if (!id) return;

    async function fetchDriver() {
      const { data, error } = await supabase.from('driver').select('*').eq('id', id).single();

      if (error) {
        console.error(error);
      } else if (data) {
        SetDriverData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email_address: data.email_address || '',
          phone_number: data.phone_number || ''
        });
      }
    }
    fetchDriver();
  }, [id]);

  // handleChange - Para naman kapag nag edit si user macacapture agad
  //                natin yung exact data na in-input ni user sa textbox.
  const handleChange = (key) => (e) => {
    SetDriverData((prev) => ({ ...prev, [key]: e.target.value })); // Function Part
  };

  // handleUpdate naman eto yung PATCH sa API
  // e.preventDefault() - Para to hindi mag rerefresh yung page natin
  //                      kapag nagbago yung nasa text box or ng edit
  //                      si user ng data sa textbox.
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('driver')
        .update({
          first_name: DriverData.first_name,
          last_name: DriverData.last_name,
          email_address: DriverData.email_address,
          phone_number: DriverData.phone_number
        })
        .eq('id', id)
        .select();

      if (error) {
        Swal.fire('Error', 'Failed to update driver.', 'error');
      } else {
        Swal.fire({
          title: 'Update Successful.',
          icon: 'success',
          text: 'Driver successfully updated.',
          timer: 1500,
          showConfirmButton: true
        }).then(() => navigate('/driver/index'));
      }

      // Catch -----
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="driver-container">
      <h2 className="text-center mb-4">New Driver</h2>

      <form autoComplete="off" onSubmit={handleUpdate}>
        <div className="driver-form">
          <div className="form-floating">
            <input
              type="text"
              id="first-name"
              className="form-control"
              placeholder="First Name"
              value={DriverData.first_name}
              onChange={handleChange('first_name')}
            />
            <label htmlFor="first-name">First Name</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              id="last-name"
              className="form-control"
              placeholder="Last Name"
              value={DriverData.last_name}
              onChange={handleChange('last_name')}
            />
            <label htmlFor="last-name">Last Name</label>
          </div>

          <div className="form-floating full-width">
            <input
              type="email"
              id="email-address"
              className="form-control"
              placeholder="Email Address"
              value={DriverData.email_address}
              onChange={handleChange('email_address')}
            />
            <label htmlFor="email-address">Email Address</label>
          </div>

          <div className="form-floating full-width">
            <input
              type="text"
              id="phone-number"
              className="form-control"
              placeholder="Phone Number"
              value={DriverData.phone_number}
              onChange={handleChange('phone_number')}
            />
            <label htmlFor="phone-number">Phone Number</label>
          </div>

          <div className="driver-buttons">
            <button type="submit" className="btn btn-primary">
              Update Driver
            </button>
            <a href="/driver/index" className="btn btn-outline-danger">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

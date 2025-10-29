import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './add-driver.css';
import Swal from 'sweetalert2';
import { supabase } from '../../utils/supabaseClient';

export default function AddDriver() {
  // Here are the codes
  const navigate = useNavigate();
  const [NewDriver, SetNewDriver] = useState({
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: ''
  });

  const handleChange = (column_name) => (data_to_input) => {
    SetNewDriver((prev) => ({ ...prev, [column_name]: data_to_input.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from('driver').insert(NewDriver).select();

      Swal.fire(
        error ? 'Error' : 'Success',
        error ? 'Failed to add driver.' : 'Driver successfully added.',
        error ? 'error' : 'success'
      );

      if (!error) navigate('/driver/index');
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // This is HTML for Page
  return (
    <div className="driver-container">
      <h2 className="text-center mb-4">New Driver</h2>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="driver-form">
          {/* First Name */}
          <div className="form-floating">
            <input
              type="text"
              id="first-name"
              className="form-control"
              placeholder="First Name"
              value={NewDriver.first_name}
              onChange={handleChange('first_name')}
            />
            <label htmlFor="first-name">First Name</label>
          </div>

          {/* Last Name */}
          <div className="form-floating">
            <input
              type="text"
              id="last-name"
              className="form-control"
              placeholder="Last Name"
              value={NewDriver.last_name}
              onChange={handleChange('last_name')}
            />
            <label htmlFor="last-name">Last Name</label>
          </div>

          {/* Email Address */}
          <div className="form-floating full-width">
            <input
              type="email"
              id="email-address"
              className="form-control"
              placeholder="Email Address"
              value={NewDriver.email_address}
              onChange={handleChange('email_address')}
            />
            <label htmlFor="email-address">Email Address</label>
          </div>

          {/* Phone Number */}
          <div className="form-floating full-width">
            <input
              type="text"
              id="phone-number"
              className="form-control"
              placeholder="Phone Number"
              value={NewDriver.phone_number}
              onChange={handleChange('phone_number')}
            />
            <label htmlFor="phone-number">Phone Number</label>
          </div>

          {/* Action Buttons */}
          <div className="driver-buttons">
            <button type="submit" className="btn btn-primary">
              Add Driver
            </button>
            <Link to="/driver/index" className="btn btn-outline-danger">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

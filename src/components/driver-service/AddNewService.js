import flatpickr from 'flatpickr';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'flatpickr/dist/flatpickr.min.css';
import './create-service.css';
import { supabase } from '../../utils/supabaseClient';

export default function AddNewService() {
  const navigate = useNavigate();

  const [Drivers, SetDrivers] = useState([]);
  const [Departments, SetDepartments] = useState([]);
  const [Errors, SetErrors] = useState({});

  const [NewService, SetNewService] = useState({
    requestor_first_name: '',
    requestor_last_name: '',
    requestor_email: '',
    requestor_department: '',
    purpose: '',
    description: '',
    date: '',
    start_time: '',
    end_time: '',
    driver: ''
  });

  // ✅ Real-time updates with validation
  const handleChange = (key) => (e) => {
    const value = e.target.value;
    SetNewService((prev) => ({ ...prev, [key]: value }));
    validateField(key, value);
  };

  // ✅ Real-time validation per field
  const validateField = (key, value) => {
    let errorMessage = '';

    switch (key) {
      case 'requestor_first_name':
        if (!value.trim()) errorMessage = 'First name is required.';
        break;
      case 'requestor_last_name':
        if (!value.trim()) errorMessage = 'Last name is required.';
        break;
      case 'requestor_email':
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!value.trim()) {
          errorMessage = 'Email is required.';
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address.';
        }
        break;
      case 'requestor_department':
        if (!value.trim()) errorMessage = 'Department is required.';
        break;
      case 'purpose':
        if (!value.trim()) errorMessage = 'Purpose is required.';
        break;
      case 'date':
        if (!value) errorMessage = 'Date is required.';
        break;
      case 'start_time':
        if (!value) errorMessage = 'Start time is required.';
        break;
      case 'end_time':
        if (!value) errorMessage = 'End time is required.';
        break;
      case 'driver':
        if (!value || value.trim() === '' || value === 'Select a Driver') {
          errorMessage = 'Driver is required.';
        }
        break;
      default:
        break;
    }

    SetErrors((prev) => ({ ...prev, [key]: errorMessage }));
  };

  // Initialize Date, Start and End Time
  useEffect(() => {
    // Date Selector
    flatpickr('#date', {
      dateFormat: 'Y-m-d',
      disableMobile: true,
      minDate: 'today',
      onChange: (selectedDates, dateStr) => {
        SetNewService((prev) => ({ ...prev, date: dateStr }));
        validateField('date', dateStr);
      }
    });

    // Start Time Selector
    flatpickr('#start_time', {
      enableTime: true,
      noCalendar: true,
      disableMobile: true,
      dateFormat: 'h:i K',
      defaultDate: '12:00 AM',
      formatDate: (d) =>
        `${String(d.getHours() % 12 || 12).padStart(2, '0')}:${String(d.getMinutes()).padStart(
          2,
          '0'
        )} ${d.getHours() >= 12 ? 'PM' : 'AM'}`,
      onChange: (selectedDates, timeStr) => {
        SetNewService((prev) => ({ ...prev, start_time: timeStr }));
        validateField('start_time', timeStr);
      }
    });

    // End Time Selector
    flatpickr('#end_time', {
      enableTime: true,
      noCalendar: true,
      disableMobile: true,
      dateFormat: 'h:i K',
      defaultDate: '12:00 AM',
      formatDate: (d) =>
        `${String(d.getHours() % 12 || 12).padStart(2, '0')}:${String(d.getMinutes()).padStart(
          2,
          '0'
        )} ${d.getHours() >= 12 ? 'PM' : 'AM'}`,
      onChange: (selectedDates, timeStr) => {
        SetNewService((prev) => ({ ...prev, end_time: timeStr }));
        validateField('end_time', timeStr);
      }
    });
  }, []);

  // GetDrivers Function
  async function GetDrivers() {
    const { data, error } = await supabase.from('driver').select('*');
    if (error) {
      Swal.fire('Error', 'Unable to get drivers.', 'error');
    } else {
      SetDrivers(data);
    }
  }

  async function GetDepartments() {
    const { data, error } = await supabase.from('department').select('*');
    console.log('Departments: ', data, error);
    if (error) {
      Swal.fire('Error', 'Unable to get departments.', 'error');
    } else {
      SetDepartments(data);
    }
  }

  // Pang call
  useEffect(() => {
    GetDrivers();
    GetDepartments();
  }, []);

  async function handleCancel() {
    const { isConfirmed } = await Swal.fire({
      title: 'Cancel Entry?',
      text: 'Do you want to cancel this entry?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Close it',
      cancelButtonText: 'No, Stay here'
    });

    if (isConfirmed) {
      window.location.href = 'https://www.google.com';
    }
  }

  async function handleReset() {
    SetNewService({
      purpose: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      driver: ''
    });

    document.querySelectorAll('#date, #start_time, #end_time').forEach((input) => {
      input._flatpickr?.clear();
    });

    SetErrors({});
  }

  // ✅ Submit with existing realtime errors check
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check kung may empty required fields
    const requiredFields = [
      'requestor_first_name',
      'requestor_last_name',
      'requestor_email',
      'requestor_department',
      'purpose',
      'date',
      'start_time',
      'end_time',
      'driver'
    ];

    // Validate all fields bago magproceed sa call ng API
    requiredFields.forEach((field) => {
      validateField(field, NewService[field]);
    });

    const missing = requiredFields.filter((f) => !NewService[f]);
    if (missing.length > 0) {
      Swal.fire('Missing Fields', 'Please fill in all required fields.', 'error');
      return;
    }

    // Check if may error bago mag-submit
    const hasError = Object.values(Errors).some((x) => x);
    if (hasError) {
      Swal.fire(
        'Validation Error',
        'Please fix the highlighted fields before submitting.',
        'error'
      );
      return;
    }

    // Insert to Supabase
    try {
      const { error } = await supabase.from('driver-service').insert([
        {
          requestor_first_name: NewService.requestor_first_name,
          requestor_last_name: NewService.requestor_last_name,
          requestor_email: NewService.requestor_email,
          requestor_department: NewService.requestor_department,
          purpose: NewService.purpose,
          description: NewService.description,
          date: NewService.date,
          start_time: NewService.start_time,
          end_time: NewService.end_time,
          driver: NewService.driver
        }
      ]);

      if (error) throw error;

      await Swal.fire({
        title: 'Success',
        text: 'Driver service booked successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      await handleReset();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="driver-service-container">
      <h2 className="text-center mb-4">Book a Service Driver</h2>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <div className="driver-service-form">
          {/* Requestor First Name */}
          <div className="form-floating">
            <input
              type="text"
              id="requestor_first_name"
              className={`form-control ${Errors.requestor_first_name ? 'is-invalid' : ''}`}
              placeholder="Requestor First Name"
              value={NewService.requestor_first_name}
              onChange={handleChange('requestor_first_name')}
            />
            <label htmlFor="requestor_first_name">Requestor's First name</label>
            {Errors.requestor_first_name && (
              <div className="invalid-feedback">{Errors.requestor_first_name}</div>
            )}
          </div>

          {/* Requestor Last Name */}
          <div className="form-floating">
            <input
              type="text"
              id="requestor_last_name"
              className={`form-control ${Errors.requestor_last_name ? 'is-invalid' : ''}`}
              placeholder="Requestor Last Name"
              value={NewService.requestor_last_name}
              onChange={handleChange('requestor_last_name')}
            />
            <label htmlFor="requestor_last_name">Requestor's Last Name</label>
            {Errors.requestor_last_name && (
              <div className="invalid-feedback">{Errors.requestor_last_name}</div>
            )}
          </div>

          {/* Requestor Email */}
          <div className="form-floating">
            <input
              type="text"
              id="requestor_email"
              className={`form-control ${Errors.requestor_email ? 'is-invalid' : ''}`}
              placeholder="Email"
              value={NewService.requestor_email}
              onChange={handleChange('requestor_email')}
            />
            <label htmlFor="requestor_email">Requestor's Email</label>
            {Errors.requestor_email && (
              <div className="invalid-feedback">{Errors.requestor_email}</div>
            )}
          </div>

          {/* Requestor Department */}
          <div className="form-floating">
            <select
              id="requestor_department"
              className={`form-select ${
                Errors.requestor_department
                  ? 'is-invalid'
                  : NewService.requestor_department
                  ? 'is-valid'
                  : ''
              }`}
              value={NewService.requestor_department}
              onClick={GetDepartments}
              onChange={handleChange('requestor_department')}>
              <option hidden disabled value="">
                Select a Department
              </option>
              {Departments.map((department) => (
                <option key={department.id} value={`${department.name}`}>
                  {department.name}
                </option>
              ))}
            </select>
            <label htmlFor="requestor_department">Department</label>
            {Errors.requestor_department && (
              <div className="invalid-feedback">{Errors.requestor_department}</div>
            )}
          </div>

          {/* Purpose */}
          <div className="form-floating">
            <input
              type="text"
              id="purpose"
              className={`form-control ${Errors.purpose ? 'is-invalid' : ''}`}
              placeholder="Purpose"
              value={NewService.purpose}
              onChange={handleChange('purpose')}
            />
            <label htmlFor="purpose">Purpose</label>
            {Errors.purpose && <div className="invalid-feedback">{Errors.purpose}</div>}
          </div>

          {/* Description */}
          <div className="form-floating full-width">
            <textarea
              id="description"
              className="form-control"
              placeholder="Description"
              value={NewService.description}
              onChange={handleChange('description')}
            />
            <label htmlFor="description">Description</label>
          </div>

          {/* Date */}
          <div className="form-floating">
            <input
              type="text"
              id="date"
              className={`form-control ${Errors.date ? 'is-invalid' : ''}`}
              placeholder="Date"
              value={NewService.date}
              onChange={handleChange('date')}
            />
            <label htmlFor="date">Date</label>
            {Errors.date && <div className="invalid-feedback">{Errors.date}</div>}
          </div>

          {/* Driver */}
          <div className="form-floating">
            <select
              id="driver"
              className={`form-select ${
                Errors.driver ? 'is-invalid' : NewService.driver ? 'is-valid' : ''
              }`}
              value={NewService.driver}
              onClick={GetDrivers}
              onChange={handleChange('driver')}>
              <option hidden disabled value="">
                Select a Driver
              </option>
              {Drivers.map((driver) => (
                <option key={driver.id} value={`${driver.first_name} ${driver.last_name}`}>
                  {driver.first_name} {driver.last_name}
                </option>
              ))}
            </select>
            <label htmlFor="driver">Driver</label>
            {Errors.driver && <div className="invalid-feedback">{Errors.driver}</div>}
          </div>

          {/* Start Time */}
          <div className="form-floating">
            <input
              type="text"
              id="start_time"
              className={`form-control ${Errors.start_time ? 'is-invalid' : ''}`}
              placeholder="Start Time"
              value={NewService.start_time}
              onChange={handleChange('start_time')}
            />
            <label htmlFor="start_time">Start Time</label>
            {Errors.start_time && <div className="invalid-feedback">{Errors.start_time}</div>}
          </div>

          {/* End Time */}
          <div className="form-floating">
            <input
              type="text"
              id="end_time"
              className={`form-control ${Errors.end_time ? 'is-invalid' : ''}`}
              placeholder="End Time"
              value={NewService.end_time}
              onChange={handleChange('end_time')}
            />
            <label htmlFor="end_time">End Time</label>
            {Errors.end_time && <div className="invalid-feedback">{Errors.end_time}</div>}
          </div>

          {/* Buttons */}
          <div className="driver-buttons">
            <button type="submit" className="btn btn-primary">
              Book Now
            </button>
            <Link className="btn btn-outline-danger" onClick={handleCancel}>
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TEAM_OPTIONS = ['Vikings', 'ThunderBolts', 'Gladiators', 'Volcanoes'];
const AREA_OPTIONS = ['Dematagoda', 'Wattala', 'Kirulapone', 'Wellawatte'];

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    area: '',
    team: '',
    school: '',
    remarks: '',
    payment:'',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await axios.post('https://campregistration-pv9e.onrender.com/api/users/add', data);
      alert('User added successfully!');
      console.log(res.data);
      navigate('/');
    } catch (err) {
      alert('Error adding user');
      console.error(err);
    }
  };

  return (
    <>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-300 mt-5"
      >
        See All Campers
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-10">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-10"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register User</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Area Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Area</label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Area</option>
              {AREA_OPTIONS.map((area, idx) => (
                <option key={idx} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Team Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Team</label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Team</option>
              {TEAM_OPTIONS.map((team, idx) => (
                <option key={idx} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">School</label>
            <input
              type="text"
              name="school"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <input
              type="text"
              name="remarks"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payments</label>
            <input
              type="text"
              name="payment"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;

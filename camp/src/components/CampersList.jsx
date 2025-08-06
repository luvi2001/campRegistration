import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

const TEAM_OPTIONS = ['Volcanoes', 'Gladiators', 'ThunderBolts', 'Vikings'];

const CampersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [campFilter, setCampFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://campregistration-pv9e.onrender.com/api/users/all');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this camper?')) return;
    try {
      await axios.delete(`https://campregistration-pv9e.onrender.com/api/users/delete/${id}`);
      setUsers(prev => prev.filter(user => user._id !== id));
      alert('Camper deleted successfully!');
    } catch (error) {
      console.error('Error deleting camper:', error);
      alert('Failed to delete camper.');
    }
  };

  const toggleArrival = async (id, field) => {
    try {
      const user = users.find(u => u._id === id);
      const updatedValue = !user[field];
      await axios.patch(`https://campregistration-pv9e.onrender.com/api/users/update/${id}`, {
        [field]: updatedValue
      });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, [field]: updatedValue } : u));
    } catch (error) {
      console.error('Error updating arrival status:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.put(
        `https://campregistration-pv9e.onrender.com/api/users/${editingUser._id}`,
        data
      );
      alert('Camper updated successfully!');
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update camper.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = areaFilter ? user.area === areaFilter : true;
    const matchesTeam = teamFilter
      ? (user.team || '').toLowerCase() === teamFilter.toLowerCase()
      : true;
    const matchesBus = busFilter === '' ? true : user.arrivedForBus === (busFilter === 'true');
    const matchesCamp = campFilter === '' ? true : user.arrivedCampSite === (campFilter === 'true');
    return matchesSearch && matchesArea && matchesTeam && matchesBus && matchesCamp;
  });

  const uniqueAreas = [...new Set(users.map(user => user.area).filter(Boolean))];
  const countByField = (field, value) => users.filter(user => user[field] === value).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Registered Campers</h2>
          <div className="text-sm md:text-base text-gray-700 flex flex-wrap gap-4 mt-2">
            {TEAM_OPTIONS.map((team, idx) => {
              const count = users.filter(user => (user.team || '').toLowerCase() === team.toLowerCase()).length;
              return (
                <span key={idx} className="bg-gray-100 px-3 py-1 rounded">
                  {team}: {count}
                </span>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => navigate('register')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          + Add New Camper
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <input type="text" placeholder="Search by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border rounded w-full" />
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Area (All: {users.length})</option>
          {uniqueAreas.map((area, idx) => <option key={idx} value={area}>{area} ({countByField('area', area)})</option>)}
        </select>
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Team</option>
          {TEAM_OPTIONS.map((team, idx) => (
            <option key={idx} value={team}>{team}</option>
          ))}
        </select>
        <select value={busFilter} onChange={(e) => setBusFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Bus Arrival</option>
          <option value="true">Arrived</option>
          <option value="false">Not Arrived</option>
        </select>
        <select value={campFilter} onChange={(e) => setCampFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Camp Arrival</option>
          <option value="true">Arrived</option>
          <option value="false">Not Arrived</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-white p-4 rounded shadow border relative">
            {user.image && <img src={`https://campregistration-pv9e.onrender.com/uploads/${user.image}`} alt={user.name} className="w-full h-48 object-cover rounded mb-4" />}
            <h3 className="text-xl font-semibold mb-2 flex justify-between">
              {user.name || 'Unnamed Camper'}
              <FaEdit onClick={() => handleEdit(user)} className="text-blue-600 cursor-pointer hover:text-blue-800" />
            </h3>
            <p><strong>Age:</strong> {user.age || 'N/A'}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
            <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
            <p><strong>Area:</strong> {user.area || 'N/A'}</p>
            <p><strong>Team:</strong> {user.team || 'N/A'}</p>
            <p><strong>School:</strong> {user.school || 'N/A'}</p>
            <p><strong>Remarks:</strong> {user.remarks || 'N/A'}</p>
            <p><strong>Paid Amount:</strong> {user.payment ?? 'N/A'}</p>
            <div className="flex gap-2 mt-3">
<button
  onClick={() => {
    const confirmMsg = user.arrivedForBus
      ? 'Mark this camper as NOT arrived for the bus?'
      : 'Mark this camper as arrived for the bus?';
    if (window.confirm(confirmMsg)) {
      toggleArrival(user._id, 'arrivedForBus');
    }
  }}
  className={`px-3 py-1 rounded text-white ${user.arrivedForBus ? 'bg-green-600' : 'bg-gray-600'}`}
>
  Bus: {user.arrivedForBus ? 'Yes' : 'No'}
</button>
<button
  onClick={() => {
    const confirmMsg = user.arrivedCampSite
      ? 'Mark this camper as NOT arrived at the camp site?'
      : 'Mark this camper as arrived at the camp site?';
    if (window.confirm(confirmMsg)) {
      toggleArrival(user._id, 'arrivedCampSite');
    }
  }}
  className={`px-3 py-1 rounded text-white ${user.arrivedCampSite ? 'bg-green-600' : 'bg-gray-600'}`}
>
  Camp: {user.arrivedCampSite ? 'Yes' : 'No'}
</button>
            </div>
            <button onClick={() => handleDelete(user._id)} className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300 w-full">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Update Camper</h3>
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" className="w-full mb-2 p-2 border rounded" />
            <input name="age" type="number" value={formData.age || ''} onChange={handleChange} placeholder="Age" className="w-full mb-2 p-2 border rounded" />
            <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="Phone" className="w-full mb-2 p-2 border rounded" />
            <input name="school" value={formData.school || ''} onChange={handleChange} placeholder="School" className="w-full mb-2 p-2 border rounded" />
            <input name="remarks" value={formData.remarks || ''} onChange={handleChange} placeholder="Remarks" className="w-full mb-2 p-2 border rounded" />
            <input name="team" value={formData.team || ''} onChange={handleChange} placeholder="Team" className="w-full mb-2 p-2 border rounded" />
            <input name="payment" type="number" value={formData.payment || ''} onChange={handleChange} placeholder="Payment" className="w-full mb-2 p-2 border rounded" />
            <input name="image" type="file" onChange={handleChange} className="w-full mb-2" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdateSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampersList;

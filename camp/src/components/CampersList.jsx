import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CampersList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [busFilter, setBusFilter] = useState('');
  const [campFilter, setCampFilter] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://campregistration-pv9e.onrender.com/api/users/all');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArea = areaFilter ? user.area === areaFilter : true;
    const matchesTeam = teamFilter ? user.team === teamFilter : true;
    const matchesBus = busFilter === '' ? true : user.arrivedForBus === (busFilter === 'true');
    const matchesCamp = campFilter === '' ? true : user.arrivedCampSite === (campFilter === 'true');
    return matchesSearch && matchesArea && matchesTeam && matchesBus && matchesCamp;
  });

  const uniqueAreas = [...new Set(users.map(user => user.area))];
  const uniqueTeams = [...new Set(users.map(user => user.team))];

  const countByField = (field, value) => users.filter(user => user[field] === value).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center md:text-left">Registered Campers</h2>
        <button
          onClick={() => navigate('register')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          + Add New Camper
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />

        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Area (All: {users.length})</option>
          {uniqueAreas.map((area, idx) => (
            <option key={idx} value={area}>
              {area} ({countByField('area', area)})
            </option>
          ))}
        </select>

        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Team (All: {users.length})</option>
          {uniqueTeams.map((team, idx) => (
            <option key={idx} value={team}>
              {team} ({countByField('team', team)})
            </option>
          ))}
        </select>

        <select value={busFilter} onChange={(e) => setBusFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Bus Arrival</option>
          <option value="true">Arrived ({countByField('arrivedForBus', true)})</option>
          <option value="false">Not Arrived ({countByField('arrivedForBus', false)})</option>
        </select>

        <select value={campFilter} onChange={(e) => setCampFilter(e.target.value)} className="p-2 border rounded">
          <option value="">Camp Arrival</option>
          <option value="true">Arrived ({countByField('arrivedCampSite', true)})</option>
          <option value="false">Not Arrived ({countByField('arrivedCampSite', false)})</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user, index) => (
          <div key={index} className="bg-white p-4 rounded shadow border">
            <img
              src={`https://campregistration-pv9e.onrender.com/uploads/${user.image}`}
              alt={user.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Phone:</strong> {user.phoneNumber}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Area:</strong> {user.area}</p>
            <p><strong>Team:</strong> {user.team}</p>
            <p><strong>School:</strong> {user.school}</p>
            <p><strong>Remarks:</strong> {user.remarks || 'N/A'}</p>
            <p><strong>Paid Amount:</strong> {user.payment || 'N/A'}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleArrival(user._id, 'arrivedForBus')}
                className={`px-3 py-1 rounded text-white ${user.arrivedForBus ? 'bg-green-600' : 'bg-gray-600'}`}
              >
                Bus: {user.arrivedForBus ? 'Yes' : 'No'}
              </button>
              <button
                onClick={() => toggleArrival(user._id, 'arrivedCampSite')}
                className={`px-3 py-1 rounded text-white ${user.arrivedCampSite ? 'bg-green-600' : 'bg-gray-600'}`}
              >
                Camp: {user.arrivedCampSite ? 'Yes' : 'No'}
              </button>
            </div>

            <button
              onClick={() => handleDelete(user._id)}
              className="mt-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-300 w-full"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampersList;

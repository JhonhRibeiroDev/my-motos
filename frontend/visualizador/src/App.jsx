import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = 'http://localhost:3000'; // Ajuste se necessário

function App() {
  const [users, setUsers] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch users
    axios.get(`${apiBaseUrl}/usuarios`)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch motorcycles
    axios.get(`${apiBaseUrl}/motos`)
      .then(response => setMotorcycles(response.data))
      .catch(error => console.error('Error fetching motorcycles:', error));

    // Fetch services
    axios.get(`${apiBaseUrl}/servicos`)
      .then(response => setServices(response.data))
      .catch(error => console.error('Error fetching services:', error));

    // Fetch mechanics
    axios.get(`${apiBaseUrl}/mecanicos`)
      .then(response => setMechanics(response.data))
      .catch(error => console.error('Error fetching mechanics:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filterData = (data) => {
    if (!searchQuery) return data;
    return data.filter(item =>
      Object.values(item).some(val =>
        val && val.toString().toLowerCase().includes(searchQuery)
      )
    );
  };

  const filteredUsers = filterData(users);
  const filteredMotorcycles = filterData(motorcycles);
  const filteredServices = filterData(services);
  const filteredMechanics = filterData(mechanics);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">My Motos Dashboard</h1>
      
      <div className="mb-8 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Age</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Gender</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Email</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Phone</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Points</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Referred By</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Created At</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.gender}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.points}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.referred_by}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.created_at}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Motorcycles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">User ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Brand</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Model</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Year</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Engine Capacity</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Color</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">VIN</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredMotorcycles.map(motorcycle => (
                <tr key={motorcycle.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.user_id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.brand}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.model}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.year}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.engine_capacity}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.color}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.vin}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{motorcycle.purchase_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Motorcycle ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Service Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Description</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Mileage</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Service Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Cost</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{service.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.motorcycle_id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.service_name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.mileage}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.service_date}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.cost}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{service.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Mechanics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Age</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Specialty</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-900">Years of Experience</th>
              </tr>
            </thead>
            <tbody>
              {filteredMechanics.map(mechanic => (
                <tr key={mechanic.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{mechanic.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{mechanic.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{mechanic.age}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{mechanic.specialty}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{mechanic.years_of_experience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, setData } from '../data/localStorage';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [searchPatientId, setSearchPatientId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newApp, setNewApp] = useState({ patientId: '', appointmentDate: '' });

  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    setAppointments(getData('incidents') || []);
    setPatients(getData('patients') || []);
    setTreatments(getData('treatments') || []);
  }, []);

  const saveAppointments = (updated) => {
    setAppointments(updated);
    setData('incidents', updated);
  };

  const handleConfirm = (id, newStatus) => {
    const updated = appointments.map(app =>
      app.id === id ? { ...app, status: newStatus } : app
    );
    saveAppointments(updated);
  };

  const handleFieldChange = (id, field, value) => {
    const updated = appointments.map(app => {
      if (app.id === id) {
        const newValue = field === 'cost' ? Math.max(0, parseInt(value) || 0) : value;
        return { ...app, [field]: newValue };
      }
      return app;
    });
    saveAppointments(updated);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    const updated = appointments.filter(app => app.id !== id);
    saveAppointments(updated);
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newApp.patientId || !newApp.appointmentDate) {
      alert('Please fill in all fields');
      return;
    }

    const patient = patients.find(p => p.id === newApp.patientId);
    const newAppointment = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      patientId: patient.id,
      title: patient.name,
      appointmentDate: newApp.appointmentDate,
      status: 'Pending',
      nextDate: '',
      cost: '',
      files: [],
    };

    const updated = [...appointments, newAppointment];
    saveAppointments(updated);
    setNewApp({ patientId: '', appointmentDate: '' });
    setCurrentPage(1);
  };

  const filteredAppointments = appointments.filter((app) => {
    const patientIdMatch = app.patientId.toString().includes(searchPatientId);
    const dateMatch = searchDate ? app.appointmentDate.startsWith(searchDate) : true;
    return patientIdMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">🗓️ Manage Appointments</h2>

      <form
  onSubmit={handleAddAppointment}
  className="bg-white border p-6 rounded-lg shadow-md mb-8 space-y-4"
>
   <h3 className="text-lg font-semibold text-gray-700 mb-2 text-center">
      Add Direct Appointment
    </h3>
  <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
    <select
      value={newApp.patientId}
      onChange={(e) => setNewApp({ ...newApp, patientId: e.target.value })}
      required
      className="p-2 border rounded w-full md:w-1/3 focus:outline-blue-500"
    >
      <option value="">Select Patient</option>
      {patients.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name} ({p.contact})
        </option>
      ))}
    </select>
    <input
      type="datetime-local"
      value={newApp.appointmentDate}
      onChange={(e) => setNewApp({ ...newApp, appointmentDate: e.target.value })}
      required
      className="p-2 border rounded w-full md:w-1/3 focus:outline-blue-500"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-fit"
    >
      Add Appointment
    </button>
  </div>
</form>


      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by Patient ID"
          value={searchPatientId}
          onChange={(e) => {
            setSearchPatientId(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-full md:w-1/2 focus:outline-blue-500"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => {
            setSearchDate(e.target.value);
            setCurrentPage(1);
          }}
          className="p-2 border rounded w-full md:w-1/2 focus:outline-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
              <th className="p-3">Patient ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Appt</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Treatment</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAppointments.length > 0 ? currentAppointments.map((app) => {
              const status = app.status || 'Pending';
              return (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{app.patientId}</td>
                  <td className="p-3">{app.title}</td>
                  <td className="p-3">{new Date(app.appointmentDate).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={app.nextDate || ''}
                      onChange={(e) => handleFieldChange(app.id, 'nextDate', e.target.value)}
                      className="border p-1 rounded w-full text-sm focus:outline-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      value={app.cost || ''}
                      onChange={(e) => handleFieldChange(app.id, 'cost', e.target.value)}
                      className="border p-1 rounded w-full text-sm focus:outline-blue-500"
                    />
                  </td>
                  <td className="p-3">
                    {app.files && app.files.length > 0 ? (
                      <div className="space-y-1">
                        {app.files.map((file, i) => (
                          <a key={i} href={file.url} download={file.name} className="text-blue-600 underline block">
                            📄 {file.name}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No files</span>
                    )}
                  </td>
                  <td className="p-3 space-y-1">
                    {status === 'Pending' ? (
                      <button onClick={() => handleConfirm(app.id, 'Completed')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full text-sm transition">
                        ✅ Mark Completed
                      </button>
                    ) : (
                      <button onClick={() => handleConfirm(app.id, 'Pending')} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 w-full text-sm transition">
                        ⏳ Mark Pending
                      </button>
                    )}
                    <button onClick={() => handleDelete(app.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 w-full text-sm transition">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500 italic">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 transition"
          >
            ⬅️ Prev
          </button>
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50 transition"
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default Appointments;

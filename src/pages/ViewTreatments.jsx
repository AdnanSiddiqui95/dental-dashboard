import { useEffect, useState } from 'react';
import { getData } from '../data/localStorage';

const ViewTreatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchAppointmentId, setSearchAppointmentId] = useState('');
  const [searchPatientId, setSearchPatientId] = useState('');

  useEffect(() => {
    const loadedTreatments = getData('treatments') || [];
    const loadedAppointments = getData('incidents') || [];
    setTreatments(loadedTreatments);
    setAppointments(loadedAppointments);
  }, []);

  const getPatientId = (appointmentId) => {
    const app = appointments.find(a => a.id === appointmentId);
    return app?.patientId || 'Unknown';
  };

  const filteredTreatments = treatments.filter(t => {
    const patientId = getPatientId(t.appointmentId);
    const matchesAppointment = t.appointmentId.toLowerCase().includes(searchAppointmentId.toLowerCase());
    const matchesPatient = patientId.toLowerCase().includes(searchPatientId.toLowerCase());
    return matchesAppointment && matchesPatient;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Treatments</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filter by Appointment ID"
          value={searchAppointmentId}
          onChange={(e) => setSearchAppointmentId(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
        <input
          type="text"
          placeholder="Filter by Patient ID"
          value={searchPatientId}
          onChange={(e) => setSearchPatientId(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Appointment ID</th>
              <th className="p-2">Patient ID</th>
              <th className="p-2">Description</th>
              <th className="p-2">Date</th>
              <th className="p-2">Files</th>
            </tr>
          </thead>
          <tbody>
            {filteredTreatments.map(treat => (
              <tr key={treat.id} className="border-b">
                <td className="p-2">{`AP-${appointments.findIndex(app => app.id === treat.appointmentId) + 1}`}</td>
                <td className="p-2">{getPatientId(treat.appointmentId)}</td>
                <td className="p-2">{treat.description}</td>
                <td className="p-2">{new Date(treat.date).toLocaleString()}</td>
                <td className="p-2">
                  {treat.files && treat.files.length > 0 ? (
                    treat.files.map((f, i) => (
                      <a
                        key={i}
                        href={f.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-blue-500 underline"
                      >
                        {f.name}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">No files</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredTreatments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No treatments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTreatments;

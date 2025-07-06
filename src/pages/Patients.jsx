import { useState, useEffect } from 'react';
import { getData, setData } from '../data/localStorage';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({ name: '', dob: '', contact: '', healthInfo: '', id: '' });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const storedPatients = getData("patients") || [];
    setPatients(storedPatients);

    const storedAppointments = getData("incidents") || [];
    const storedTreatments = getData("treatments") || [];

    setAppointments(storedAppointments);
    setTreatments(storedTreatments);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      const updated = patients.map(p => p.id === form.id ? { ...form } : p);
      setPatients(updated);
      setData("patients", updated);
    } else {
      const newId = `D${patients.length + 1}`;
      const newPatient = { ...form, id: newId };
      const updated = [...patients, newPatient];
      setPatients(updated);
      setData("patients", updated);
    }

    setForm({ name: '', dob: '', contact: '', healthInfo: '', id: '' });
    setEditMode(false);
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditMode(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    const updated = patients.filter(p => p.id !== id);
    setPatients(updated);
    setData("patients", updated);
  };

  const getPatientTreatments = (patientId) => {
    const relatedAppointments = appointments.filter(app => app.patientId === patientId);
    const appointmentIds = relatedAppointments.map(app => app.id);
    return treatments.filter(treat => appointmentIds.includes(treat.appointmentId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient Management</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="p-2 border rounded"
          />
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            required
            placeholder="Contact Number"
            className="p-2 border rounded"
          />
          <input
            name="healthInfo"
            value={form.healthInfo}
            onChange={handleChange}
            placeholder="Health Info"
            className="p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editMode ? 'Update Patient' : 'Add Patient'}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Patient ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Contact</th>
              <th className="p-2">Health Info</th>
              <th className="p-2">Treatment</th>
              <th className="p-2">Files</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map(patient => {
                const patientTreatments = getPatientTreatments(patient.id);
                const latestTreatment = patientTreatments.length > 0
                  ? patientTreatments[patientTreatments.length - 1]
                  : null;

                return (
                  <tr key={patient.id} className="border-b">
                    <td className="p-2">{patient.id}</td>
                    <td className="p-2">{patient.name}</td>
                    <td className="p-2">{patient.dob}</td>
                    <td className="p-2">{patient.contact}</td>
                    <td className="p-2">{patient.healthInfo}</td>
                    <td className="p-2">
                      {latestTreatment?.description || 'No treatment yet'}
                    </td>
                    <td className="p-2">
                      {latestTreatment?.files?.length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-blue-700">
                          {latestTreatment.files.map((f, i) => (
                            <li key={i}>
                              <a href={f.url} download={f.name} className="underline">
                                📄 {f.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No files</span>
                      )}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;

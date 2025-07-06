import { useState, useEffect } from 'react';
import { getData, setData } from '../data/localStorage';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AddTreatment = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const apps = getData('incidents') || [];
    setAppointments(apps.filter(app => app.status !== 'Completed'));
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const fileData = selectedFiles.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setFiles(fileData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAppointment || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTreatment = {
      id: uuidv4(),
      appointmentId: selectedAppointment,
      description,
      date: new Date().toISOString(),
      files,
    };

    const existingTreatments = getData('treatments') || [];
    const updatedTreatments = [...existingTreatments, newTreatment];
    setData('treatments', updatedTreatments);

    const allAppointments = getData('incidents') || [];
    const updatedAppointments = allAppointments.map(app =>
      app.id === selectedAppointment
        ? {
            ...app,
            status: 'Completed',
            files: [...(app.files || []), ...files],
          }
        : app
    );

    setData('incidents', updatedAppointments);

    alert('Treatment added with files. Appointment marked as completed.');
    navigate('/appointments');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Treatment</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Appointment</label>
          <select
            value={selectedAppointment}
            onChange={(e) => setSelectedAppointment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choose Appointment --</option>
            {appointments.map((app, index) => (
              <option key={app.id} value={app.id}>
                {`Appt-${index + 1}: ${app.title} (Patient ID: ${app.patientId}) - ${new Date(app.appointmentDate).toLocaleString()}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the treatment..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {files.length > 0 && (
            <ul className="mt-3 list-disc list-inside text-sm text-gray-600">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 font-medium"
          >
            Save Treatment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTreatment;

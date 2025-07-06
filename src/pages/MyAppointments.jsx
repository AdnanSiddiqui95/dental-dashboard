import { useEffect, useState } from 'react';
import { getData } from '../data/localStorage';
import { useAuth } from '../context/AuthContext';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = getData('incidents') || [];
    const myAppointments = stored.filter(app => app.patientId === user.patientId);
    setAppointments(myAppointments);
  }, [user.patientId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments yet.</p>
      ) : (
        appointments.map((app) => (
          <div
            key={app.id}
            className="bg-white border rounded-lg p-4 mb-5 shadow-md space-y-3"
          >
            <div className="text-xl font-semibold"><strong>🧑 Name:</strong> {app.title}</div>
            <div><strong>📅 Date:</strong> {new Date(app.appointmentDate).toLocaleString()}</div>
            <div><strong>📝 Description:</strong> {app.description}</div>
            {app.comments && <div><strong>💬 Comments:</strong> {app.comments}</div>}

            <div>
              <strong>🧾 Treatment Files:</strong>{' '}
              {app.files && app.files.length > 0 ? (
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {app.files.map((file, index) => (
                    <li key={index}>
                      <a
                        href={file.url}
                        download={file.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        📄 {file.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-500 ml-2">Not yet added</span>
              )}
            </div>

            <div>
              <strong>📌 Status:</strong>{' '}
              <span
                className={`font-semibold ${
                  app.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {app.status || 'Pending'}
              </span>
            </div>

            <div>
              <strong>💰 Cost:</strong>{' '}
              {app.cost !== undefined && app.cost !== '' ? `₹${app.cost}` : <span className="text-gray-500">-</span>}
            </div>

            <div>
              <strong>📆 Next Appointment:</strong>{' '}
              {app.nextDate ? app.nextDate : <span className="text-gray-500">-</span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;

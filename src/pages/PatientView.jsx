import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getData } from "../data/localStorage";

const PatientView = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user?.patientId) return;

    const allAppointments = getData("incidents");
    const filtered = allAppointments.filter(
      (app) => app.patientId === user.patientId
    );
    setAppointments(filtered);
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">You have no appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div
              key={app.id}
              className="bg-white shadow rounded p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{app.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(app.appointmentDate).toLocaleString()}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>Description:</strong> {app.description}
              </p>
              <p className="text-gray-700">
                <strong>Comments:</strong> {app.comments}
              </p>
              <p className="text-gray-700">
                <strong>Treatment:</strong> {app.treatment || "Not yet added"}
              </p>
              <p className="text-gray-700">
                <strong>Status:</strong> {app.status || "Pending"}
              </p>
              <p className="text-gray-700">
                <strong>Cost:</strong> ₹{app.cost || "-"}
              </p>
              <p className="text-gray-700">
                <strong>Next Appointment:</strong> {app.nextDate || "-"}
              </p>

              {app.files && app.files.length > 0 && (
                <div className="mt-2">
                  <strong>Files:</strong>
                  <ul className="list-disc ml-5 text-blue-600">
                    {app.files.map((f, idx) => (
                      <li key={idx}>
                        <a href={f.url} target="_blank" rel="noreferrer">
                          {f.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientView;

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getData } from '../data/localStorage';

const Dashboard = () => {
  const { user, isAdmin, isPatient } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allAppointments = getData('incidents') || [];
        const allTreatments = getData('treatments') || [];

        if (isAdmin) {
          setAppointments(allAppointments);
          setTreatments(allTreatments);
        } else if (isPatient && user?.patientId) {
          const myAppointments = allAppointments.filter(app => app.patientId === user.patientId);
          const myAppointmentIds = myAppointments.map(app => app.id);
          const myTreatments = allTreatments.filter(treat => myAppointmentIds.includes(treat.appointmentId));
          setAppointments(myAppointments);
          setTreatments(myTreatments);
        }
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, isAdmin, isPatient]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paginatedAppointments = appointments
    .filter(app => new Date(app.appointmentDate) >= new Date())
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const paginatedTreatments = treatments
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalAppointmentPages = Math.ceil(
    appointments.filter(app => new Date(app.appointmentDate) >= new Date()).length / itemsPerPage
  );
  const totalTreatmentPages = Math.ceil(treatments.length / itemsPerPage);

  const SkeletonRow = () => (
    <tr className="border-t animate-pulse">
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
      <td className="p-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 w-full px-4 sm:px-6 md:px-8">

      {/* Welcome Section */}
      <div className="bg-white border-l-4 border-blue-600 p-6 mb-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">
          Welcome, <span className="font-extrabold">{user?.email}</span>
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Role: <strong>{user?.role}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-blue-700 mb-4">Upcoming Appointments</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <table className="w-full text-sm">
              <tbody>
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          ) : paginatedAppointments.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No upcoming appointments.</p>
          ) : (
            <>
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-blue-50 text-blue-800">
                  <tr>
                    <th className="p-4 text-left font-semibold">Patient ID</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppointments.map((app) => (
                    <tr key={app.id} className="border-t hover:bg-blue-50 transition-colors">
                      <td className="p-4">{app.patientId}</td>
                      <td className="p-4">{app.title}</td>
                      <td className="p-4">{formatDate(app.appointmentDate)}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                          title={`Status: ${app.status || 'Pending'}`}
                        >
                          {app.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalAppointmentPages > 1 && (
                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalAppointmentPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalAppointmentPages, p + 1))}
                    disabled={currentPage === totalAppointmentPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent Treatments */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-blue-700 mb-4">Recent Treatments</h3>
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <table className="w-full text-sm">
              <tbody>
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          ) : paginatedTreatments.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No recent treatments.</p>
          ) : (
            <>
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-blue-50 text-blue-800">
                  <tr>
                    <th className="p-4 text-left font-semibold">Appointment ID</th>
                    <th className="p-4 text-left font-semibold">Patient ID</th>
                    <th className="p-4 text-left font-semibold">Description</th>
                    <th className="p-4 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTreatments.map((treat) => (
                    <tr key={treat.id} className="border-t hover:bg-blue-50 transition-colors">
                      <td className="p-4">{treat.appointmentId}</td>
                      <td className="p-4">
                        {appointments.find((a) => a.id === treat.appointmentId)?.patientId || 'Unknown'}
                      </td>
                      <td className="p-4 truncate max-w-xs" title={treat.description}>
                        {treat.description}
                      </td>
                      <td className="p-4">{formatDate(treat.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalTreatmentPages > 1 && (
                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalTreatmentPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalTreatmentPages, p + 1))}
                    disabled={currentPage === totalTreatmentPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-blue-600 p-6 rounded-lg shadow-lg text-center text-white transform hover:scale-105 transition-transform">
          <div className="text-4xl font-bold">{appointments.length}</div>
          <div className="text-lg mt-2">Total Appointments</div>
        </div>
        <div className="bg-green-600 p-6 rounded-lg shadow-lg text-center text-white transform hover:scale-105 transition-transform">
          <div className="text-4xl font-bold">{treatments.length}</div>
          <div className="text-lg mt-2">Total Treatments</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
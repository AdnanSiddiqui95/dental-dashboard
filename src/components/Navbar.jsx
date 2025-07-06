import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAdmin, isPatient, logout } = useAuth();
  const navigate = useNavigate();
const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `relative px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-600 ${
      isActive(path) ? 'text-blue-600 font-semibold bg-blue-100' : 'text-gray-800'
    }`;

  const navItems = {
    admin: [
      { path: '/patients', label: 'Patients', tooltip: 'View all patients' },
      { path: '/appointments', label: 'Appointments', tooltip: 'Manage appointments' },
      { path: '/calendar', label: 'Calendar', tooltip: 'View schedule' },
      { path: '/add-treatment', label: 'Add Treatment', tooltip: 'Add new treatment' },
      { path: '/view-treatments', label: 'View Treatments', tooltip: 'View all treatments' },
    ],
    patient: [
      { path: '/book-appointment', label: 'Book Appointment', tooltip: 'Schedule new appointment' },
      { path: '/my-data', label: 'My Appointments', tooltip: 'View your appointments' },
    ],
  };

  return (
    <nav className="bg-white text-gray-900 p-4 sm:p-6 md:p-8 shadow-md sticky top-0 z-100 border-b border-gray-200">
     <div className="w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">

  {/* Branding on the extreme left */}
  <div className="flex-shrink-0">
    <Link
      to="/dashboard"
      className="text-2xl sm:text-3xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
      aria-label="Dental Center Home"
    >
      🦷 Dental Center
    </Link>
  </div>

  {/* Navigation items on the right */}
  {user && (
    <>
      <div className="hidden lg:flex flex-wrap gap-4 items-center text-sm sm:text-base">
        {(isAdmin ? navItems.admin : isPatient ? navItems.patient : []).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={linkClasses(item.path)}
            title={item.tooltip}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.label}
            {isActive(item.path) && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </Link>
        ))}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 ease-in-out text-white font-semibold hover:scale-105"
          aria-label="Sign out of your account"
          title="Sign out of your account"
        >
          Logout
        </button>
      </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-800 focus:outline-none hover:bg-blue-100 rounded p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden absolute top-[72px] sm:top-20 md:top-24 left-0 right-0 bg-white border-t border-gray-200 shadow-md transition-all duration-300 ease-in-out">
                <div className="flex flex-col p-4 gap-3">
                  {(isAdmin ? navItems.admin : isPatient ? navItems.patient : []).map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`${linkClasses(item.path)} block py-3`}
                      onClick={() => setIsMenuOpen(false)}
                      title={item.tooltip}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 ease-in-out text-white font-semibold text-left"
                    aria-label="Sign out of your account"
                    title="Sign out of your account"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
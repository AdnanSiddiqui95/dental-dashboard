import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getData, setData } from '../data/localStorage';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', comments: '' });

  const allSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    const stored = getData('incidents') || [];
    setAppointments(stored);
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getTakenSlots = (date) => {
    return appointments
      .filter((app) => {
        const appDate = new Date(app.appointmentDate);
        return appDate.toDateString() === date.toDateString();
      })
      .map((app) => {
        const time = new Date(app.appointmentDate).toTimeString().slice(0, 5);
        return time;
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime) return alert('Please select a time slot.');

    const fullDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    fullDateTime.setHours(hours);
    fullDateTime.setMinutes(minutes);

    const newAppointment = {
      id: uuidv4(),
      patientId: user.patientId,
      ...form,
      appointmentDate: fullDateTime.toISOString(),
      status: 'Pending',
      files: [],
    };

    const updated = [...appointments, newAppointment];
    setData('incidents', updated);
    alert('Appointment booked!');
    navigate('/my-data');
  };

  const takenSlots = getTakenSlots(selectedDate);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🗓️ Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="title"
          placeholder="Full Name"
          value={form.title}
          onChange={handleFormChange}
          className="w-full p-2 border rounded focus:outline-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Describe the issue..."
          value={form.description}
          onChange={handleFormChange}
          className="w-full p-2 border rounded focus:outline-blue-500"
          required
        />
        <textarea
          name="comments"
          placeholder="Additional Comments (Optional)"
          value={form.comments}
          onChange={handleFormChange}
          className="w-full p-2 border rounded focus:outline-blue-500"
        />

        <div>
          <label className="block font-semibold mb-2 text-gray-700">Select Date</label>
          <Calendar value={selectedDate} onChange={setSelectedDate} className="rounded shadow" />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700 mt-4">Select Time Slot</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allSlots.map((slot) => {
              const disabled = takenSlots.includes(slot);
              const selected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedTime(slot)}
                  className={`p-2 rounded border text-sm transition ${
                    disabled
                      ? 'bg-gray-300 cursor-not-allowed'
                      : selected
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-blue-100'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-4 transition"
        >
          ✅ Confirm Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;

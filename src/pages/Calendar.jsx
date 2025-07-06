import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { useEffect, useState } from 'react';
import { getData } from '../data/localStorage';
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Calendar = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const data = getData('incidents') || [];
    setAppointments(data);
  }, []);

  const events = appointments.map((app) => ({
    title: `${app.title} (PID: ${app.patientId || 'N/A'})`,
    start: new Date(app.appointmentDate),
    end: new Date(new Date(app.appointmentDate).getTime() + 30 * 60 * 1000),
    status: app.status || 'Pending',
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#2196f3';

    switch (event.status) {
      case 'Completed':
        backgroundColor = '#4caf50'; // green
        break;
      case 'Pending':
        backgroundColor = '#ff9800'; // orange
        break;
      case 'Cancelled':
        backgroundColor = '#f44336'; // red
        break;
      default:
        backgroundColor = '#2196f3'; // blue for other statuses
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        padding: '4px',
      },
    };
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointment Calendar (Admin View)</h1>
      <div className="bg-white rounded shadow p-4">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="week"
          min={new Date(1970, 1, 1, 9, 0)}
          max={new Date(1970, 1, 1, 17, 0)}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
};

export default Calendar;

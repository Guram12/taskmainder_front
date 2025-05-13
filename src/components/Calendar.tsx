import '../styles/Calendar.css';
import React from 'react';
import { board } from '../utils/interface';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


interface CalendarProps {
  boards: board[];
}

const Calendar: React.FC<CalendarProps> = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  return (
    <div className="calendar_container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateCalendar', 'DateCalendar']}>
          <DemoItem label="Controlled calendar">
            <DateCalendar value={value} onChange={(newValue) => setValue(newValue)}  views={['year', 'month', 'day']} />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      <h1>1.გასაკეთებელი დავალებები</h1>
      <h1>5. Task Prioritization </h1>
      <h1>2. Notifications System</h1>

    </div>
  );
};

export default Calendar;
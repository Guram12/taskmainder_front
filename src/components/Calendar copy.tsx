import '../styles/Calendar.css';
import React, { useState , useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';





function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

// ======================================= fake fetch function =========================================

function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() => getRandomNumber(1, daysInMonth));

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

// ==================================  server day component =========================================
function ServerDay(props: PickersDayProps & { highlightedDays?: number[]; onDayClick?: (day: Dayjs) => void }) {
  const { highlightedDays = [], day, outsideCurrentMonth, onDayClick, ...other } = props;

  const isSelected = !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;
  const isToday = dayjs().isSame(day, 'day'); // Check if the day is today

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌟' : undefined} // Add a star or any badge content
      color={isToday ? 'primary' : 'default'} // Highlight the current day with a badge color
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        onClick={() => isSelected && onDayClick?.(day)} // Trigger click only for marked days
        sx={{
          ...(isToday && {
            border: '2px solid #1976d2', // Add a border for the current day
            borderRadius: '50%',
          }),
        }}
      />
    </Badge>
  );
}




// ==================================  calendar component =========================================


const Calendar: React.FC = () => {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState<number[]>([]);
  // as default i should select current day 
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const [selectedDayInfo, setSelectedDayInfo] = useState<Dayjs | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

 useEffect(() => {
    fetchHighlightedDays(dayjs());
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDayClick = (day: Dayjs) => {
    setSelectedDayInfo(day);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDayInfo(null);
  };

  return (
    <div className="calendar_container">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={value}
          onChange={(newValue) => setValue(newValue)}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
              onDayClick: handleDayClick, // Pass the click handler
            } as any,
          }}
        
          
        />
      </LocalizationProvider>



      {/* Dialog to display information */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Day Information</DialogTitle>
        <DialogContent>
          {selectedDayInfo ? (
            <p>
              You clicked on: <strong>{selectedDayInfo.format('YYYY-MM-DD')}</strong>
            </p>
          ) : (
            <p>No information available.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendar;
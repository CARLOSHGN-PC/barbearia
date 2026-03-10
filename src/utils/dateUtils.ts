import { addMinutes, format, isBefore, isSameDay, parse, set, startOfDay } from 'date-fns';
import { Appointment, Settings } from '../types';

export const generateTimeSlots = (
  date: Date,
  barberId: string,
  serviceDuration: number,
  appointments: Appointment[],
  settings: Settings
): string[] => {
  const dayOfWeek = date.getDay();
  const businessHours = settings.businessHours[dayOfWeek];

  if (businessHours.isClosed) {
    return [];
  }

  const slots: string[] = [];
  const now = new Date();
  
  const openTime = parse(businessHours.open, 'HH:mm', date);
  const closeTime = parse(businessHours.close, 'HH:mm', date);

  // Filter appointments for the selected barber on the selected date
  const barberAppointments = appointments.filter(
    (app) => app.barberId === barberId && app.date === format(date, 'yyyy-MM-dd') && app.status !== 'cancelado'
  );

  let currentSlot = openTime;

  while (isBefore(addMinutes(currentSlot, serviceDuration), closeTime) || currentSlot.getTime() + serviceDuration * 60000 === closeTime.getTime()) {
    const slotStart = currentSlot;
    const slotEnd = addMinutes(currentSlot, serviceDuration);

    // Check if slot is in the past
    if (isSameDay(date, now) && isBefore(slotStart, now)) {
      currentSlot = addMinutes(currentSlot, 15); // Increment by 15 mins
      continue;
    }

    // Check for conflicts with existing appointments
    const hasConflict = barberAppointments.some((app) => {
      const appStart = parse(app.startTime, 'HH:mm', date);
      const appEnd = parse(app.endTime, 'HH:mm', date);

      return (
        (isBefore(slotStart, appEnd) && isBefore(appStart, slotEnd)) ||
        slotStart.getTime() === appStart.getTime()
      );
    });

    if (!hasConflict) {
      slots.push(format(slotStart, 'HH:mm'));
    }

    // Move to next possible slot (e.g., every 15 minutes)
    currentSlot = addMinutes(currentSlot, 15);
  }

  return slots;
};

export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const start = parse(startTime, 'HH:mm', new Date());
  const end = addMinutes(start, durationMinutes);
  return format(end, 'HH:mm');
};

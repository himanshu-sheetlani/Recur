import { useState } from "react";
import { Calendar, CalendarDayButton } from "../ui/calendar";
import type { DayButtonProps } from "react-day-picker";

interface ReviewCalendarProps {
  reviewedDays: Date[];
}

export default function ReviewCalendar({
  reviewedDays,
}: ReviewCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
  const isReviewed = (date: Date) =>
    reviewedDays.some(
      d => d.toDateString() === date.toDateString()
    );

  function ReviewDayButton(props: DayButtonProps) {
    return (
      <div className="relative">
        <CalendarDayButton {...props} />

        {isReviewed(props.day.date) && (
          <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-500" />
        )}
      </div>
    );
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      components={{
        DayButton: ReviewDayButton,
      }}
    />
  );
}
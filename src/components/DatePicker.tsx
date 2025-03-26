import Calendar from "react-calendar";
import { formatDate } from "./helpers";

type DatePickerProps = {
  holidaysDates: string[];
  onClickDay: (date: Date) => void;
};

const DatePicker = ({ onClickDay, holidaysDates }: DatePickerProps) => {
  const isSunday = (date: Date): boolean => date.getDay() === 0;
  const isHoliday = (date: Date): boolean =>
    holidaysDates.includes(formatDate(date));

  return (
    <div className="border border-[#CBB6E5] rounded-md p-5 bg-white min-h-[293px] min-w-xs max-w-xs">
      <Calendar
        locale="en-US"
        calendarType="iso8601"
        onClickDay={onClickDay}
        showNeighboringMonth={false}
        view="month"
        maxDetail="month"
        nextLabel="&#x25B6;"
        prevLabel="&#x25C0;"
        tileClassName={({ date }: { date: Date }) =>
          isSunday(date)
            ? "text-[#898DA9] cursor-default disabled"
            : isHoliday(date)
              ? "text-[#898DA9] cursor-pointer"
              : "cursor-pointer"
        }
        tileDisabled={({ date }: { date: Date }) => isSunday(date)}
        className="text-[#000853]"
      />
    </div>
  );
};

export default DatePicker;

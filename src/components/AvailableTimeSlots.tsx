import { useState } from "react";

type AvailableTimeSlotProps = {
  time: string;
  isSelected: boolean;
  onClick: (time: string) => void;
};

type AvailableTimeSlotsProps = {
  onSelectTime?: (time: string) => void;
};

const AvailableTimeSlot = ({
  time,
  isSelected,
  onClick,
}: AvailableTimeSlotProps) => {
  return (
    <button
      className={`h-[46px] border rounded-lg w-[78px] text-center transition-colors bg-white hover:cursor-pointer ${
        isSelected ? "border-[#9747FF]" : "border-[#CBB6E5]"
      }`}
      onClick={(e) => {
        e.preventDefault();
        return onClick(time);
      }}
    >
      {time}
    </button>
  );
};

const AvailableTimeSlots = ({ onSelectTime }: AvailableTimeSlotsProps) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const times = ["10:00", "11:00", "12:00", "13:00", "14:00"];

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    onSelectTime?.(time);
  };

  return (
    <div className="w-full sm:w-auto">
      <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1 justify-end">
        {times.map((time) => (
          <AvailableTimeSlot
            key={time}
            time={time}
            isSelected={selectedTime === time}
            onClick={handleTimeClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableTimeSlots;

import React, { useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import TextField from "./TextField";
import Slider from "./Slider";
import FileUpload from "./FileUpload";
import DatePicker from "./DatePicker";
import AvailableTimeSlots from "./AvailableTimeSlots";
import Button from "./Button";
import InfoIcon from "./InfoIcon";
import ExclamationIcon from "./ExclamationIcon.tsx";
import { formatDate } from "./helpers";

const emailTest = (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  photo: File | null;
  selectedDate: string | null;
  selectedTime: string | null;
  errors: Partial<Record<keyof Omit<FormState, "errors">, string>>;
};

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  age: 8,
  photo: null,
  selectedDate: null,
  selectedTime: null,
  errors: {},
};

type FormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<FormState, "errors">; // <-- Usunięcie "errors"
      value: number | string | File | null;
    }
  | {
      type: "SET_DATE";
      field: keyof Omit<FormState, "errors">;
      date: string | null;
    }
  | {
      type: "SET_TIME";
      field: keyof Omit<FormState, "errors">;
      time: string | null;
    }
  | { type: "SET_ERROR"; field: keyof Omit<FormState, "errors">; error: string } // <-- Usunięcie "errors"
  | { type: "CLEAR_ERROR"; field: keyof Omit<FormState, "errors"> }
  | { type: "RESET_FORM" };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: "" },
      };
    case "SET_DATE":
      return { ...state, selectedDate: action.date };
    case "SET_TIME":
      return { ...state, selectedTime: action.time };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case "CLEAR_ERROR": {
      const newErrors = { ...state.errors };
      delete newErrors[action.field as keyof typeof newErrors];
      return { ...state, errors: newErrors };
    }
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

const Form = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [holidays, setHolidays] = useState<{ date: string; name: string }[]>(
    [],
  );
  const [isSelectedDate, setIsSelectedDate] = useState<boolean>(false);
  const [isPastDate, setIsPastDate] = useState<boolean>(false);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const result = await axios.get("/api/holidays?country=PL");
        setHolidays(result.data);
      } catch (err) {
        console.error((err as Error).message);
      }
    };
    fetchHolidays();
  }, []);

  const holidaysDates = useMemo(
    () => holidays.map((holiday) => holiday.date),
    [holidays],
  );

  const isSelectedDayHoliday =
    state.selectedDate && holidaysDates.includes(state.selectedDate);

  const handleDayClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const formattedDate = formatDate(date);
    dispatch({ type: "SET_DATE", field: "selectedDate", date: formattedDate });
    setIsSelectedDate(true);

    if (date < today) {
      setIsPastDate(true);
      dispatch({
        type: "SET_ERROR",
        field: "selectedDate",
        error: "wrong_date",
      });
      dispatch({ type: "SET_TIME", field: "selectedTime", time: null });
    } else {
      dispatch({ type: "CLEAR_ERROR", field: "selectedDate" });
      dispatch({
        type: "SET_DATE",
        field: "selectedDate",
        date: formattedDate,
      });
      setIsSelectedDate(true);
      setIsPastDate(false);
    }
  };

  const handleSelectTime = (time: string) => {
    dispatch({ type: "SET_TIME", field: "selectedTime", time: time });
  };

  useEffect(() => {
    if (isSelectedDayHoliday) {
      dispatch({ type: "SET_TIME", field: "selectedTime", time: null });
    }
  }, [isSelectedDayHoliday]);

  const holidaysName = useMemo(() => {
    const foundHoliday = holidays.find((x) => x.date === state.selectedDate);
    return foundHoliday ? foundHoliday.name : null;
  }, [state.selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: "SET_FIELD",
      field: e.target.name as keyof Omit<FormState, "errors">,
      value: e.target.value,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (!value) {
      dispatch({
        type: "SET_ERROR",
        field: name as keyof Omit<FormState, "errors">,
        error: "required_field",
      });
    } else if (name === "email" && emailTest(value)) {
      dispatch({
        type: "SET_ERROR",
        field: "email",
        error: "invalid_email",
      });
    }
  };

  const errorMessages: Record<string, React.ReactNode> = {
    required_field: "This field is required",
    invalid_email: (
      <span className="flex items-center">
        <ExclamationIcon />
        <span className="flex flex-col pl-2 text-[#000853]">
          Please use correct formatting.
          <span>Example: address@email.com</span>
        </span>
      </span>
    ),
    wrong_date: "You cannot select a past date.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("firstName", state.firstName);
    formData.append("lastName", state.lastName);
    formData.append("email", state.email);
    if (state.age) formData.append("age", state.age.toString());
    if (state.selectedDate)
      formData.append("date", state.selectedDate.toString());
    if (state.selectedTime)
      formData.append("time", state.selectedTime.toString());
    if (state.photo) formData.append("photo", state.photo);

    try {
      const response = await fetch("http://letsworkout.pl/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Something went wrong");

      console.log("Form sent successfully!");
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.error("Error sending form:", error);
    }
  };

  const isFormValid = () => {
    if (
      state.firstName.trim() !== "" &&
      state.lastName.trim() !== "" &&
      state.email.trim() !== "" &&
      !state.errors.email &&
      state.photo !== null &&
      state.selectedDate !== null &&
      state.selectedTime !== null
    ) {
      return true;
    }
  };

  return (
    <form className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full min-w-xs max-w-xs sm:max-w-[420px] md:max-w-[420px] lg:max-w-[420px] my-14">
        <h1 className="text-xl sm:text-2xl font-bold mb-5 text-[#000853]">
          Personal Info
        </h1>
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
            First Name
          </h2>
          <TextField
            name="firstName"
            value={state.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorMessages[state.errors.firstName ?? ""]}
          />
        </div>
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
            Last Name
          </h2>
          <TextField
            name="lastName"
            value={state.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorMessages[state.errors.lastName ?? ""]}
          />
        </div>
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
            Email Address
          </h2>
          <TextField
            name="email"
            value={state.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errorMessages[state.errors.email ?? ""]}
            className={state.errors.email && "email-error-colors"}
          />
        </div>
        <div className="mb-14 pl-[11px]">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
            Age
          </h2>
          <div className="flex items-center justify-between">
            <span>8</span>
            <span>100</span>
          </div>
          <Slider
            value={state.age}
            onChange={(value) =>
              dispatch({ type: "SET_FIELD", field: "age", value: value })
            }
          />
        </div>
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
            Photo
          </h2>
          <FileUpload
            onChange={(file) =>
              dispatch({ type: "SET_FIELD", field: "photo", value: file })
            }
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mt-6 mb-4 text-[#000853]">
          Your Workout
        </h1>
        <h2 className="text-sm sm:text-base font-semibold mb-1 text-[#000853]">
          Date
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <DatePicker
            holidaysDates={holidaysDates}
            onClickDay={handleDayClick}
          />
          {!isSelectedDayHoliday && isSelectedDate && !isPastDate && (
            <div className="flex flex-wrap gap-2">
              <AvailableTimeSlots onSelectTime={handleSelectTime} />
            </div>
          )}
        </div>
        {state.errors.selectedDate && (
          <div className="text-red-600 text-sm mt-1">
            {errorMessages[state.errors.selectedDate]}
          </div>
        )}
        {isSelectedDayHoliday && (
          <div className="flex items-center pt-2">
            <InfoIcon />
            <span className="text-[#000853] pl-2">It is {holidaysName}</span>
          </div>
        )}
        <div className="mt-6">
          <Button
            buttonText="Send Application"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          />
        </div>
      </div>
    </form>
  );
};

export default Form;

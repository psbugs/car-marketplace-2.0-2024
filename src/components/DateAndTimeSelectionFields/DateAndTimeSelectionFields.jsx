import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { culture } from "../../constants/common-constants";
import { getTimeSlots } from "../../redux/TestDriveSlice";
import { getEdgeClass, timeFormatterForDropdownOptions } from "../../utils";
import StyledHeadingBox from "../common-components/StyledHeadingBox/StyledHeadingBox";

const DateAndTimeSelectionFields = ({
  setFieldValue,
  vehicleDetails,
  values,
  desiredDateRef,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { timeSlots = false } = useSelector((state) => state.testDrive);
  const { uiConfigData = false, edge = false } =
    useSelector((state) => state?.uiConfig) || {};

  const testDriveLeadTime = uiConfigData?.testDrive?.testDriveLeadTime;
  const testDriveDuration = uiConfigData?.testDrive?.defaultTestDriveDuration;

  // Get first available day to book test drive session
  const getNearestAvailableDate = () => {
    const parseDuration = (duration) => {
      if (!duration || typeof duration !== "string")
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const parts = duration.split(/[:.]/).map(Number);

      if (parts?.length !== 4)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const [days, hours, minutes, seconds] = parts;
      return { days, hours, minutes, seconds };
    };

    const { days, hours, minutes, seconds } = parseDuration(testDriveLeadTime);

    const currentDateTime = new Date();
    currentDateTime?.setDate(currentDateTime?.getDate() + days);
    currentDateTime?.setHours(currentDateTime?.getHours() + hours);
    currentDateTime?.setMinutes(currentDateTime?.getMinutes() + minutes);
    currentDateTime?.setSeconds(currentDateTime?.getSeconds() + seconds);
    return currentDateTime;
  };

  const [desiredDate, setDesiredDate] = useState(
    values?.desiredDate ? values?.desiredDate : getNearestAvailableDate(),
  );

  // Check the selected day which matches with timeSlots API response.
  const matchedDay = timeSlots?.openingHours.filter(
    (slot) =>
      slot?.weekDay ===
      desiredDate?.toLocaleDateString("en-US", { weekday: "long" }),
  );

  // Calculate available time slots
  const calculateTimeSlots = () => {
    const parseDurationToMinutes = () => {
      if (!testDriveDuration) return 0;
      const [hours, minutes, seconds] = testDriveDuration
        ?.split(":")
        ?.map(Number);
      return hours * 60 + minutes + Math.floor(seconds / 60);
    };

    const getMinutes = (time) => {
      if (!time) return 0;
      const [hours, minutes] = time?.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const formatTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours)?.padStart(2, "0")}:${String(mins)?.padStart(2, "0")}`;
    };

    const durationInMinutes = parseDurationToMinutes();

    if (!Array.isArray(matchedDay) || matchedDay.length === 0) return [];

    return matchedDay?.flatMap(({ from, to }) => {
      const startMinutes = getMinutes(from);
      const endMinutes = getMinutes(to);
      const slotCount = Math.floor(
        (endMinutes - startMinutes) / durationInMinutes,
      );
      return Array.from({ length: slotCount }, (_, i) =>
        formatTime(startMinutes + i * durationInMinutes),
      );
    });
  };

  // Slots must be recalculated only when matchedDay changes.
  const slots = useMemo(
    () => calculateTimeSlots(),
    // eslint-disable-next-line
    [matchedDay],
  );

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const view = queryParams.get("view");

  // Time slot API call
  useEffect(() => {
    if (
      vehicleDetails?.ownerId &&
      (view === "vehicle-details" || view === "favorites")
    ) {
      dispatch(getTimeSlots(vehicleDetails?.ownerId));
    }
  }, [vehicleDetails?.ownerId, dispatch, view]);

  // Generated Time dropdown options
  const options = [
    { value: "", label: t("/.Please choose") },
    ...(slots?.length
      ? slots.map((item) => ({
          value: item,
          label: item,
        }))
      : []),
  ];
  // Initial state of time should first check if the date is selected and has the desired time. If yes set that time initially. (used for back functionality)
  const defaultDate = desiredDate ? desiredDate : values?.desiredDate;
  const [selectedTime, setSelectedTime] = useState(() => {
    if (defaultDate) {
      timeFormatterForDropdownOptions(defaultDate);
    }
    return "";
  });
  // Check for the today date
  const isToday = (date) => {
    const today = new Date();
    return (
      date?.getDate() === today?.getDate() &&
      date?.getMonth() === today?.getMonth() &&
      date?.getFullYear() === today?.getFullYear()
    );
  };

  // Value selected from dropdown
  const handleTimeChange = (e) => {
    setFieldValue("timeValue", e?.target?.value);
    setSelectedTime(e?.target?.value);
  };

  // When time is selected combine that to the Date selected for testDrive:{DateTime}
  const combineDateAndTime = (date, time) => {
    if (date && time) {
      const combinedDate = new Date(date);
      const [hours, minutes] = time?.split(":");
      combinedDate?.setHours(hours);
      combinedDate?.setMinutes(minutes);
      return combinedDate;
    }
    return null;
  };
  // Date change handler
  const handleDateChange = (date) => {
    setDesiredDate(date);
    setFieldValue("desiredDate", combineDateAndTime(date, selectedTime));
  };

  // Clean time value on date change
  useEffect(() => {
    setFieldValue("timeValue", "");
    setSelectedTime("");
  }, [desiredDate, setFieldValue]);

  // Set value of desireddate
  useEffect(() => {
    if (desiredDate && selectedTime) {
      setFieldValue(
        "desiredDate",
        combineDateAndTime(desiredDate, selectedTime),
      );
    }
  }, [desiredDate, selectedTime, setFieldValue]);

  // Set value of time
  useEffect(() => {
    if (desiredDate || values?.desiredDate) {
      setFieldValue(
        "timeValue",
        timeFormatterForDropdownOptions(desiredDate || values?.desiredDate),
      );
    }
  }, [desiredDate, selectedTime, setFieldValue, values?.desiredDate]);

  return (
    <div ref={desiredDateRef}>
      <StyledHeadingBox
        header={t("/vehicleDetails.Desired date")}
        className={"mt-0"}
      />
      <div className="text-sm text-[var(--davy-gray-color)] mb-4">
        {" "}
        {t("/vehicleDetails.Please select your preferred date.")}
        <span className="text-red-700">*</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center">
          <Calendar
            onChange={handleDateChange}
            tileClassName={({ date }) =>
              isToday(date) ? "!bg-gray-600" : null
            }
            value={desiredDate || values?.desiredDate}
            minDate={getNearestAvailableDate()}
            locale={culture}
            className={"bg-[var(--white-smoke-color)]"}
          />
        </div>
        {options?.length > 1 ? (
          <>
            <label
              className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
              htmlFor="timeValue"
            >
              {t("/vehicleDetails.Time")}
              <span className="text-red-700">*</span>
            </label>
            <select
              className={`${getEdgeClass(edge, "rounded-md")} w-full ps-10 pe-2 focus:ring-[var(--primary-dark-color)] focus:shadow-none bg-[var(--text-white-black)]`}
              onChange={handleTimeChange}
              value={selectedTime || values?.timeValue}
            >
              {options?.map(({ value, label }) => {
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </>
        ) : (
          <div>{t("/vehicleDetails.No slots found for the selected day!")}</div>
        )}
      </div>
    </div>
  );
};
export default DateAndTimeSelectionFields;

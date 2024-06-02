import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useMemo } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CustomToolbar } from "./calendarCustomComponent";
import { BASE_URL, convertUtcDateAndTime } from "./useCommonUsableFunctions";
import { useState } from "react";
import { EventModal } from "./EventModal";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AllCalendar = () => {
  useEffect(() => {
    fetchEvents();
  }, []);

  const [event, setEvent] = useState(null);

  const [events, setEvents] = useState([]);

  const localizer = useMemo(() => momentLocalizer(moment), []);

  const viewSelectedEvent = (event) => {
    event["description"] = event.description.replace(/<[^>]*>/g, "");
    event["startDate"] = moment(
      event?.id ? event.start.dateTime : event.startDate
    ).format("YYYY-MM-DD");
    event["endDate"] = moment(
      event?.id ? event.end.dateTime : event.endDate
    ).format("YYYY-MM-DD");
    event["startTime"] = moment(
      event?.id ? event.start.dateTime : event.startTime
    ).format("HH:mm");
    event["endTime"] = moment(
      event?.id ? event.end.dateTime : event.endTime
    ).format("HH:mm");
    setEvent(event);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/calendar/fetchEvents`);
      if (response.status == 200) {
        setEvents(response.data);
      } else {
        toast.dismiss("something webt wrong");
      }
    } catch (err) {
      toast.dismiss(err.message);
      console.error(err);
    }
  };

  const googleAuthenticate = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/google/googleAuthUrl`);
      if (response.status == 200) {
        if (response.data?.isAuthenticated) {
          getGoogleEvents();
          return;
        }
        window.open(response.data.redirectCalendarUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getGoogleEvents = async () => {
    const response = await axios.get(`${BASE_URL}/google/calendarEvents`);
    setEvents(response.data);
  };

  const handleCreateSlot = ({ start, end }) => {
    const data = {
      startDate: moment(start).format("YYYY-MM-DD"),
      endDate: moment(end).format("YYYY-MM-DD"),
    };
    setEvent(data);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: "#32de84",
      color: "white",
      fontSize: "15px",
      fontWeight: "bolder",
      border: "none",
    };
    style.backgroundColor = "blue";

    return {
      className: "",
      style,
    };
  };

  const updateEvents = (eventData, type) => {
    let newEvents = [];
    if (type == "deleteEvent") {
      if (eventData?.id) {
        newEvents = events.filter((event) => event.id != eventData.id);
      } else if (eventData._id) {
        newEvents = events.filter((event) => event._id != eventData._id);
      }
      setEvents([...newEvents]);
      return;
    } else {
      if (eventData?._id) {
        let eventIndex;
        const existedEvent = events.filter((event, index) => {
          if (event._id == eventData._id) {
            eventIndex = index;
            return event;
          }
        });

        if (existedEvent?.length) {
          eventData["start"] = moment(eventData.startDate);
          eventData["end"] = moment(eventData.endDate);
          events[eventIndex] = eventData;
        } else {
          eventData["start"] = moment(eventData.startDate);
          eventData["end"] = moment(eventData.endDate);
          events.push(eventData);
        }
      } else if (eventData?.id) {
        let eventIndex;
        const existedEvent = events.filter((event, index) => {
          if (event.id == eventData.id) {
            eventIndex = index;
            return event;
          }
        });
        if (existedEvent?.length) {
          events[eventIndex] = eventData;
          setEvents(events);
          return;
        }
        events.push(eventData);
      }
      setEvents([...events]);
    }
  };

  const removeGoogleUser = async () => {
    await axios.get(`${BASE_URL}/google/removeAccessToken`);
  };

  return (
    <div style={{ overflow: "auto", overflowY: "hidden", height: "680px" }}>
      <div>
        <button onClick={googleAuthenticate}>Google Authenticate</button>

        <button onClick={removeGoogleUser}>Remove User</button>
      </div>
      <Calendar
        selectable={true}
        localizer={localizer}
        events={events}
        titleAccessor={(val) => val.summary}
        style={{ overflow: "hidden" }}
        startAccessor={(val) => {
          if (val.id) {
            return convertUtcDateAndTime(
              val.start.dateTime,
              val?.start.dateTime
                ? moment(val.start.dateTime).format("hh:mm A")
                : "00:00"
            );
          } else if (val._id) {
            return convertUtcDateAndTime(
              val.startDate,
              val?.startTime ? moment(val.startTime).format("hh:mm A") : "00:00"
            );
          }
        }}
        endAccessor={(val) => {
          if (val.id)
            return convertUtcDateAndTime(
              val.end.dateTime,
              val?.end.dateTime
                ? moment(val.end.dateTime).format("hh:mm A")
                : "00:00"
            );
          else if (val._id) {
            return convertUtcDateAndTime(
              val.endDate,
              val?.endTime ? moment(val.endTime).format("hh:mm A") : "00:00"
            );
          }
        }}
        views={["month", "week", "day"]}
        components={{
          toolbar: CustomToolbar,
        }}
        timeslots={2}
        onSelectEvent={viewSelectedEvent}
        eventPropGetter={eventStyleGetter}
        onSelectSlot={handleCreateSlot}
      />
      {event && (
        <EventModal
          isOpen={event}
          setIsOpen={setEvent}
          callback={(event, type) => updateEvents(event, type)}
        />
      )}
    </div>
  );
};

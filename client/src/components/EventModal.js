import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "./useCommonUsableFunctions";
import moment from "moment";
import { useState } from "react";

export const EventModal = ({
  isOpen,
  setIsOpen,
  eventData,
  callback,
  viewModal,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    getValues,
    setError,
  } = useForm();

  useEffect(() => {
    if (isOpen) reset(isOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(null);
  };

  const addUpdateEvent = async (newEventData) => {
    try {
      toast.dismiss();
      const eventId = watch("id") ? watch("id") : watch("_id");
      let response;
      if (!eventId) {
        response = await axios.post(
          `${BASE_URL}/calendar/addEvent`,
          newEventData
        );
        toast.success("Event Added");
      } else if (eventId) {
        response = await axios.put(
          `${BASE_URL}/calendar/updateEvent/` + eventId,
          newEventData
        );
        toast.success("Event Updated");
      }
      if (response.status == 200) {
        callback(response.data);
      } else {
        toast.dismiss("Error Occured");
      }
      handleClose();
    } catch (err) {
      toast.error("error occured");
      console.error(err);
    }
  };

  const checkDateTime = () => {
    // date check

    if (new Date(watch("endDate")) < new Date(watch("startDate"))) {
      setError("endDate", {
        type: "manual",
        message: "Please Enter Date Greater Than Start Date",
      });
    } else {
      setError("endDate", undefined);
    }

    if (new Date(watch("startDate")) > new Date(watch("endDate"))) {
      setError("startDate", {
        type: "manual",
        message: "Please Enter Date Less Than End Date",
      });
    } else {
      setError("startDate", undefined);
    }

    // time check
    if (
      moment(watch("startDate")).format("YYYY-MM-DD") ===
      moment(watch("endDate")).format("YYYY-MM-DD")
    ) {
      if (
        moment(watch("startTime"), "HH:mm") >= moment(watch("endTime"), "HH:mm")
      ) {
        setError("startTime", {
          type: "manual",
          message: "Please Enter Time Less Than Start Time",
        });
      } else {
        setError("startTime", undefined);
      }
      if (
        moment(watch("endTime"), "HH:mm") <= moment(watch("startTime"), "HH:mm")
      ) {
        setError("endTime", {
          type: "manual",
          message: "Please Enter Time greater Than Start Time",
        });
      } else {
        setError("endTime", undefined);
      }
    } else {
      setError("startTime", undefined);
      setError("endTime", undefined);
    }
  };

  const deleteSelectedEvent = async () => {
    try {
      const eventId = watch("id") ? watch("id") : watch("_id");
      const response = await axios.delete(
        `${BASE_URL}/calendar/deleteEvent/` + eventId
      );
      if (response.status == 200) {
        callback(getValues(), "deleteEvent");
        toast.success("Event deleted successfully !");
      } else {
        toast.error("something went wrong");
      }
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Modal show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 className="modal-title" id="addEventModalLabel">
              {watch("id") ? "Update" : "Add"} Event
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(addUpdateEvent)}>
            <div className="form-group mb-3">
              <label>Event Title:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Event Title"
                {...register("summary", { required: "Please Enter End Date" })}
              />
              {errors?.summary && (
                <span className="text-danger">{errors?.summary.message}</span>
              )}
            </div>
            <div className="form-group mb-3">
              <label>Start Date:</label>
              <input
                type="date"
                className="form-control"
                {...register("startDate", {
                  required: "Please Enter Start Date",
                  onChange: () => checkDateTime(),
                })}
              />
              {errors?.startDate && (
                <span className="text-danger">{errors?.startDate.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                className="form-control"
                {...register("endDate", {
                  required: "Please Enter End Date",
                  onChange: () => checkDateTime(),
                })}
              />
              {errors?.endDate && (
                <span className="text-danger">{errors?.endDate.message}</span>
              )}
            </div>
            <div className="form-group mb-3">
              <label>Start Time:</label>
              <input
                type="time"
                className="form-control"
                {...register("startTime", {
                  required: "Please Enter Start Time",
                  onChange: () => checkDateTime(),
                })}
              />
              {errors?.startTime && (
                <span className="text-danger">{errors?.startTime.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                className="form-control"
                {...register("endTime", {
                  required: "Please Enter End Time",
                  onChange: () => checkDateTime(),
                })}
              />
              {errors?.endTime && (
                <span className="text-danger">{errors?.endTime.message}</span>
              )}
            </div>
            <div className="form-group mb-3">
              <label>Description :</label>
              <textarea
                className="form-control"
                placeholder="Description ........"
                {...register("description", {
                  required: "Please Enter Description",
                })}
                rows={5}
              />
              {errors?.description && (
                <span className="text-danger">
                  {errors?.description.message}
                </span>
              )}
            </div>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => handleClose()}
                className="btn btn-secondary"
              >
                Close
              </button>

              <button type="submit" className="btn btn-primary">
                {watch("id") ? "Update" : `Add`} Event
              </button>

              {(watch("id") || watch("_id")) && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setDeleteModal(true)}
                >
                  Delete Event
                </button>
              )}
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      <Modal onHide={() => setDeleteModal(true)} show={deleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you really want to delete this event {watch("summary")}</p>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteSelectedEvent()}
            >
              Delete
            </button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
};

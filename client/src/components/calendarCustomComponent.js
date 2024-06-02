export const CustomToolbar = ({
  label,
  onNavigate,
  views,
  view,
  onView,
  callback,
}) => {
  return (
    <div className="d-flex justify-content-sm-between">
      <span className="d-flex">
        <div className="d-flex">
          <p
            type="button"
            className="btn-dark prev-calendar-btn align-items-center justify-content-center cursor-pointer"
            onClick={() => onNavigate("PREV")}
          >
            <span className="calendar-btn-font">{"<"}</span>
            {/* <i className="uil uil-angle-left" /> */}
          </p>
          <p
            type="button"
            className="btn-dark next-calendar-btn align-items-center justify-content-center cursor-pointer"
            onClick={() => onNavigate("NEXT")}
          >
            <span className="calendar-btn-font">{">"}</span>
            {/* <i className="uil uil-angle-left" /> */}
          </p>
        </div>
        <p
          type="button"
          className="btn-dark today-calendar-btn mx-3 align-items-center justify-content-center cursor-pointer"
          onClick={() => onNavigate("TODAY")}
        >
          <span className="calendar-btn-font">{"today"}</span>
        </p>
      </span>
      <span>{label} </span>
      <span className="d-flex">
        <div className="d-flex">
          {views.map((name) => (
            <p
              className="btn-dark today-calendar-btn d-flex cursor-pointer"
              onClick={() => onView(name)}
            >
              <span className="calendar-btn-font mx-1 px-1">{name}</span>
            </p>
          ))}
        </div>
      </span>
    </div>
  );
};

import React from "react";

const Switch = ({ isOn, handleToggle, id }) => {

  const setOn = isOn == "false" || isOn == false ? false : true

  return (
    <>
      <input
        checked={setOn}
        onChange={handleToggle}
        className="smartnft-switch-checkbox"
        type="checkbox"
        id={`react-switch-new-${id}`}
        />
        <label
            style={{ background: setOn && '#06D6A0' }}
            className="smartnft-switch-label"
            htmlFor={`react-switch-new-${id}`}
        >
        <span className={`smartnft-switch-button`} />
      </label>
    </>
  );
};

export default Switch;


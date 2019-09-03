import React from "react";
import spinner from "../../img/Spinner.gif";

const Spinner = () => {
  return (
    <>
      <img
        src={spinner}
        style={{ width: "200", margin: "auto", display: "block" }}
        alt="Loading..."
      ></img>
    </>
  );
};

export default Spinner;

import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const NoDeployedContract = () => {
  return (
    <div className="error">
      <p className="error__message">
        {__("No deployed Contracts found.", SLUG)}
      </p>
    </div>
  );
};

export default NoDeployedContract;

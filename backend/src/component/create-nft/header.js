import React from "react";
import { SLUG } from "../../../../common/store";
const { __ } = wp.i18n;

const FormHeader = () => {
  return (
    <div className="form-header">
      <h2 className="form-header__title">{__("Create New NFT", SLUG)}</h2>
    </div>
  );
};

export default FormHeader;

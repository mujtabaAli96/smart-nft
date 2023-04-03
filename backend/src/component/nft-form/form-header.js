import React from "react";
const { __ } = wp.i18n;
import { SLUG } from "../../../../common/store";

const FormHeader = () => {
  return (
    <div className="form-header">
      <h2 className="form-header__title">{__("Create New NFT", SLUG)}</h2>
    </div>
  );
};

export { FormHeader };

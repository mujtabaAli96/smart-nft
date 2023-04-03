import React, { useState } from "react";
import { SLUG } from "../../../../common/store";
import { ProAddons } from "./ProAddons";
const { __ } = wp.i18n;

export const AddonsMain = () => {
  return (
    <div className="addons-container">
        <h1 className="heading">{__("Premium Add-ons", SLUG)}</h1>
        <p className="desc">{__("Supercharge your Smart NFT with premium Add-ons", SLUG)}</p>
        <ProAddons />
    </div>
  );
};

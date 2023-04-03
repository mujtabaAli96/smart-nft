import React, { useContext } from "react";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS, BACKENDMEDIAURL } from "../../../../common/store";
const { __ } = wp.i18n;

const FreeMinting = () => {
  if( SETTINGS.nftpages?.create?.freeminting === "false" || !SETTINGS.nftpages?.create?.freeminting ) return null;
  const { state, dispatch } = useContext(CreateNftContext);

  const toggleFreeMinting = (value) => {
    dispatch({ type: "TOGGLE_FREE_MINTING", payload: value });
  };

  return (
    <div className="create-nft-form__switcher-section">
      <p className="header-two">{__("Free minting", SLUG)}</p>
      <label className="switch">
        <input
          type="checkbox"
          checked={state.isFreeMinting}
          onChange={(e) => toggleFreeMinting(e.target.checked)}
        />
        <span className="slider round"></span>
      </label>

      <p className="pra-one">
        {__("Free mint your nft. You dont need any gas fee.", SLUG)}
      </p>
    </div>
  );
};

export default FreeMinting;

import React, { useContext, useState } from "react";
import { UnlockableFileUploads } from "./unlockable-files";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS } from "../../../../common/store";
const { __ } = wp.i18n;

const UnlockableContentDefault = () => {
  if (
    SETTINGS.nftpages?.create?.unlockable === "false" ||
    !SETTINGS.nftpages?.create?.unlockable
  ) {
    return null;
  }
  const { state, dispatch } = useContext(CreateNftContext);
  const [unlockableActive, setUnlockableActive] = useState(false);

  const onChange = (e) => {
    const value = e.target.value.trim();
    dispatch({ type: "CHANGE_UNLOCKABLE_CONTENT", payload: value });
  };

  const onActiveOrDeactive = (e) => {
    setUnlockableActive(!unlockableActive);
    if (!e.target.checked)
      dispatch({ type: "CHANGE_UNLOCKABLE_CONTENT", payload: null });
  };

  console.log(state);
  return (
    <div>
      <div className="create-nft-form__switcher-section">
        <p className="header-two">{__("Unlockable Content", SLUG)}</p>
        <label className="switch">
          <input type="checkbox" onChange={onActiveOrDeactive} />
          <span className="slider round"></span>
        </label>
        <p className="pra-one ">
          {__("Only owner can view this content.", SLUG)}
        </p>
      </div>

      {unlockableActive ? (
        <label htmlFor="unlockable-content">
          <textarea
            onChange={onChange}
            id="unlockable-content"
            cols="30"
            rows="5"
            placeholder={__("Unlockable content...", SLUG)}
          ></textarea>
        </label>
      ) : null}
    </div>
  );
};

const unlockabless = () => {
  return <UnlockableFileUploads key="unlockable-files" />;
};

const UnlockableContent = () => {
  const component = wp.hooks.applyFilters(
    "RENDER_UNLOCKABLE_FILES",
    [<UnlockableContentDefault key="unlockable" />],
    unlockabless
  );
  return component;
};

export default UnlockableContent;

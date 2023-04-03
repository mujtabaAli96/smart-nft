import React, { useContext } from "react";
import { FilterContext } from "./state";
import { Icons } from "../../../../common/component/icons";
import { SETTINGS } from "../../../../common/store";

export const SocialIcons = () => {
  //gurd close for dashboard controll
  if (SETTINGS.collections?.single?.links === "false") return null;

  const { state, dispatch } = useContext(FilterContext);
  const { socialProfiles } = state.collectionMeta?.term_meta;

  if (!socialProfiles) return null;

  return (
    <div className="profile-header__socials">
      {socialProfiles.map(
        (elem, index) =>
          elem.url !== "" && (
            <a key={elem.index} href={elem.url} target="_blank">
              <span className="social-profiles-tooltip">{elem.name}</span>
              {Icons[elem.name]}
            </a>
          )
      )}
    </div>
  );
};

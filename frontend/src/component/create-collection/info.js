import React, { useContext, useState } from "react";
import { CreateCollectionContext } from "./state";
import {
  SLUG,
  FRONTENDMEDIAURL,
  BACKEND_AJAX_URL,
} from "../../../../common/store";
const { __ } = wp.i18n;
import { Icons } from "../../../../common/component/icons";
const Name = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);
  console.log(state);

  const collectionExist = async function (name) {
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          collection_name: name,
          action: "collection_exist",
        },
      });
      console.log(res);
      dispatch({ type: "CHANGE_COLLECTION_EXIST", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="collection-name-symbol">
      <div>
        <label htmlFor="name">
          <p>{__("Name", SLUG)}</p>
          <input
            type="text"
            id="name"
            value={state.name}
            placeholder={__("i.e: Tweleve Anonymous Tournaments", SLUG)}
            onChange={(e) => {
              dispatch({ type: "CHANGE_NAME", payload: e.target.value });
              collectionExist(e.target.value.trim());
            }}
          />
          {!state.collectionExist && state.name !== "" && (
            <p className="available">{__("Name available", SLUG)}</p>
          )}
          {state.collectionExist && (
            <p className="not-available">{__("Name not available", SLUG)}</p>
          )}
        </label>
      </div>
      <div>
        <label htmlFor="name">
          <p>{__("Symbol", SLUG)}</p>
          <input
            type="text"
            id="symbol"
            value={state.symbol}
            placeholder={__("i.e: TAT", SLUG)}
            onChange={(e) => {
              dispatch({ type: "CHANGE_SYMBOL", payload: e.target.value });
            }}
          />
        </label>
      </div>
    </div>
  );
};

const Description = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);

  return (
    <label htmlFor="description">
      <p>{__("Description", SLUG)}</p>
      <textarea
        type="text"
        id="description"
        value={state.description}
        placeholder={__(
          "Markdown syntax is supported. 0 of 1000 characters used.",
          SLUG
        )}
        onChange={(e) => {
          dispatch({ type: "CHANGE_DESCRIPTION", payload: e.target.value });
        }}
      />
    </label>
  );
};

// Updated links
// Array
// v1.5.0
const Links = () => {
  const { state, dispatch } = useContext(CreateCollectionContext);
  console.log(state.socialProfiles);
  const socialprofiles = state.socialProfiles;
  const [morelinks, setMoreLinks] = useState(false);
  const updateSocialProfile = (newfields) => {
    dispatch({
      type: "CHANGE_SOCIAL_PROFILES",
      payload: newfields,
    });
  };
  const changeSocials = (key, value, index) => {
    socialprofiles[index][key] = value;
    updateSocialProfile(socialprofiles);
  };
  const removeField = (index) => {
    socialprofiles.splice(index, 1);
    updateSocialProfile(socialprofiles);
  };
  const addlink = (name) => {
    const newProfileFields = [
      ...socialprofiles,
      {
        name: name,
        url: "",
      },
    ];
    // addSocialProfile(newProfileFields)
    updateSocialProfile(newProfileFields);
  };
  const platforms = [
    {
      name: __("website", SLUG),
    },
    {
      name: __("facebook", SLUG),
    },
    {
      name: __("twitter", SLUG),
    },
    {
      name: __("linkedin", SLUG),
    },
    {
      name: __("youtube", SLUG),
    },
    {
      name: __("tiktok", SLUG),
    },
    {
      name: __("discord", SLUG),
    },
    {
      name: __("telegram", SLUG),
    },
    {
      name: __("reddit", SLUG),
    },
    {
      name: __("instagram", SLUG),
    },
    {
      name: __("tumblr", SLUG),
    },
    {
      name: __("vk", SLUG),
    },
    {
      name: __("snapchat", SLUG),
    },
  ];

  return (
    <div>
      <p>{__("Collection links", SLUG)}</p>
      <div className="profile-socials">
        {socialprofiles &&
          socialprofiles.map((elem, i) => (
            <div className="profile-socials__input-group" key={i}>
              <span className="profile-socials__input-group__icon">
                {Icons[elem.name]}
              </span>
              <input
                type="text"
                value={elem.url}
                onChange={(e) => changeSocials("url", e.target.value, i)}
                placeholder={__(`Enter your ${elem.name} link`, SLUG)}
              />
              <span
                className="profile-socials__input-group__delete"
                onClick={(e) => removeField(i)}
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 4H2.5H14.5"
                    stroke="#A7A7A7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 4V14.5C13 14.8978 12.842 15.2794 12.5607 15.5607C12.2794 15.842 11.8978 16 11.5 16H4C3.60218 16 3.22064 15.842 2.93934 15.5607C2.65804 15.2794 2.5 14.8978 2.5 14.5V4M4.75 4V2.5C4.75 2.10218 4.90804 1.72064 5.18934 1.43934C5.47064 1.15804 5.85218 1 6.25 1H9.25C9.64782 1 10.0294 1.15804 10.3107 1.43934C10.592 1.72064 10.75 2.10218 10.75 2.5V4"
                    stroke="#A7A7A7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.25 7.75V12.25"
                    stroke="#A7A7A7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.25 7.75V12.25"
                    stroke="#A7A7A7"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          ))}
        <span
          style={{ marginBottom: 10, display: "block" }}
          className="add-new-field"
          onClick={(e) => setMoreLinks(!morelinks)}
        >
          + {__("Add new field", SLUG)}
        </span>
        {morelinks && (
          <div className="add-more-profiles">
            <ul style={{ padding: 0 }}>
              {platforms.map((elem, index) => (
                <li key={index} onClick={(e) => addlink(elem.name)}>
                  <span className="add-more-profiles__icon">
                    {/* <img src={`${FRONTENDMEDIAURL}socials/${elem.name}.svg`} /> */}
                    {Icons[elem.name]}
                  </span>
                  <span>{elem.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Form = () => {
  return (
    <div className="create-collection__info">
      <Name />
      <Description />
      <Links />
    </div>
  );
};

export default Form;

import React, { useContext } from "react";
import { CreateCategoryContext } from "./state";
import {
  SLUG,
  FRONTENDMEDIAURL,
  BACKEND_AJAX_URL,
} from "../../../../common/store";
const { __ } = wp.i18n;

const Name = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);

  const categoryExist = async function (name) {
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          category_name: name,
          action: "smartnft_category_exist",
        },
      });
      console.log(res);
      dispatch({ type: "CHANGE_CATEGORY_EXIST", payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <label htmlFor="name">
      <p>{__("Name", SLUG)}</p>
      <input
        type="text"
        id="name"
        value={state.name}
        placeholder={__("Enter your display name", SLUG)}
        onChange={(e) => {
          dispatch({ type: "CHANGE_NAME", payload: e.target.value });
          categoryExist(e.target.value.trim());
        }}
      />
      {!state.collectionExist && state.name !== "" && (
        <p className="available">{__("Name available", SLUG)}</p>
      )}
      {state.collectionExist && (
        <p className="not-available">{__("Name not available", SLUG)}</p>
      )}
    </label>
  );
};

const Description = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);

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

const Links = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);
  const links = [
    {
      iconUrl: `${FRONTENDMEDIAURL}web.svg`,
      placeholder: __("yoursite.io", SLUG),
      type: "CHANGE_CUSTOM_SITE",
    },
    {
      iconUrl: `${FRONTENDMEDIAURL}discord.svg`,
      placeholder: __("https://discord.gg/", SLUG),
      type: "CHANGE_DISCORD",
    },
    {
      iconUrl: `${FRONTENDMEDIAURL}telegram.svg`,
      placeholder: __("https://t.me/", SLUG),
      type: "CHANGE_TELEGRAM",
    },
  ];

  return (
    <>
      {links.map((cur, i) => (
        <label key={i} className="links">
          <img src={cur.iconUrl} />
          <input
            type="text"
            placeholder={cur.placeholder}
            onChange={(e) => {
              dispatch({ type: cur.type, payload: e.target.value });
            }}
          />
        </label>
      ))}
    </>
  );
};

const Form = () => {
  return (
    <div className="create-category__info">
      <Name />
      <Description />
    </div>
  );
};

export default Form;

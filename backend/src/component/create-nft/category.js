import React, { useContext, useState, useEffect } from "react";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS } from "../../../../common/store";
import useCategories from "../../../../common/hook/useCategories.hook";
const { __ } = wp.i18n;

const Category = () => {
  if( SETTINGS.nftpages?.create?.category === "false" || !SETTINGS.nftpages?.create?.category ) return null;

  const { state, dispatch } = useContext(CreateNftContext);
  const { getCategories } = useCategories();
  const [categories, setCategories] = useState([]);

  const [isCategoriesFieldOpen, setCategoriesFieldOpen] = useState(false);
  const [categoriesSuggetions, setCategoriesSuggetion] = useState([]);
  const [showCategoriesSuggetion, setShowCategoriesSuggetion] = useState(false);

  console.log(categories, categoriesSuggetions);

  useEffect(() => {
    async function fetchCategories() {
      const res = await getCategories();
      console.log(res);
      setCategories(res);
    }
    fetchCategories();
  }, []);

  const changeCategoriesStatus = (e) => {
    const isChecked = e.target.checked;
    setCategoriesFieldOpen(isChecked);
    setShowCategoriesSuggetion(isChecked);
    setCategoriesSuggetion(categories);
    if (!isChecked) {
      setCategoriesSuggetion([]);
      dispatch({
        type: "CHANGE_CATEGORY",
        payload: { name: "", slug: "", id: "" },
      });
    }
  };

  const onChange = (e) => {
    const value = e.target.value.toLowerCase();
    const found = categories.filter((cat) =>
      cat.term_data.name.toLowerCase().startsWith(value)
    );
    setCategoriesSuggetion(found);
    setShowCategoriesSuggetion(true);
    dispatch({
      type: "CHANGE_CATEGORY",
      payload: { name: value, slug: "", id: "" },
    });
  };

  return (
    <div className="categories__con">
      <div className="categories">
        <p className="header-two">{__("Category", SLUG)}</p>
        <label className="switch">
          <input type="checkbox" onChange={changeCategoriesStatus} />
          <span className="slider round"></span>
        </label>
        <p className="pra-one">{__("Put this item into a Category", SLUG)}</p>
      </div>

      {isCategoriesFieldOpen ? (
        <input
          type="text"
          placeholder={__("Category name...", SLUG)}
          value={state.category.name}
          onChange={onChange}
        />
      ) : null}

      {categoriesSuggetions.length ? (
        <Suggetions
          categoriesSuggetions={categoriesSuggetions}
          setCategoriesSuggetion={setCategoriesSuggetion}
          setShowCategoriesSuggetion={setShowCategoriesSuggetion}
          dispatch={dispatch}
        />
      ) : null}

      {!categoriesSuggetions.length && showCategoriesSuggetion ? (
        <NoSuggetions />
      ) : null}
    </div>
  );
};

const Suggetions = ({
  categoriesSuggetions,
  setCategoriesSuggetion,
  setShowCategoriesSuggetion,
  dispatch,
}) => {
  const onClick = (cat) => {
    setCategoriesSuggetion([]);
    setShowCategoriesSuggetion(false);
    dispatch({
      type: "CHANGE_CATEGORY",
      payload: {
        name: cat.term_data.name,
        slug: cat.term_data.slug,
        id: cat.term_data.term_id,
      },
    });
  };

  return (
    <div className="categories__suggetions">
      {categoriesSuggetions.map((cat) => (
        <span key={cat.term_data.term_id} onClick={() => onClick(cat)}>
          {cat.term_data.name}
        </span>
      ))}
    </div>
  );
};

const NoSuggetions = () => {
  return (
    <div>
      <span>{__("No category found.", SLUG)}</span>
    </div>
  );
};

export default Category;

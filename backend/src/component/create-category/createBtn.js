import React, { useState, useContext } from "react";
import { CreateCategoryContext } from "./state";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
const { __ } = wp.i18n;

const CreateCategoryBtn = () => {
  const { state, dispatch } = useContext(CreateCategoryContext);
  const [isClicked, setIsClicked] = useState(false);

  const createCategory = async () => {
    try {
      if (!state.name) {
        errorMessage(__("Category name cant be empty.", SLUG));
        setIsClicked(false);
        return;
      }

      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          ...state,
          action: "smartnft_create_category",
        },
      });

      successMessage(__("Category Created Successfully", SLUG));
      console.log(res);
      setTimeout(() => {
        //location.reload();
        //
      }, 3000);
    } catch (err) {
      setIsClicked(false);
      console.log(err);
      errorMessage(__("Category Creation Fail.", SLUG));
    }
  };

  return (
    <button
      className="create-category__btn btn-main-black"
      disabled={isClicked}
      onClick={(e) => {
        setIsClicked(true);
        createCategory();
      }}
    >
      {__("Create", SLUG)}
    </button>
  );
};

export default CreateCategoryBtn;

import React, { useReducer } from "react";
import {
  CreateCategoryContext,
  REDUCER,
  INISIAL_STATE,
} from "./component/create-category/state";
import useWeb3provider from "../../common/hook/wallet.hook";
import Header from "./component/create-category/header";
import ImageUploader from "./component/create-category/img-upload";
import Form from "./component/create-category/info";
import CreateCategoryBtn from "./component/create-category/createBtn";
import MainErrorCapturer from "../../common/component/error-comp/main-error";

const CreateCategoryComponent = () => {
  const [state, dispatch] = useReducer(REDUCER, INISIAL_STATE);
  const { account } = useWeb3provider();

  return (
    <MainErrorCapturer>
      <CreateCategoryContext.Provider
        value={{ state: { ...state, accAdd: account[0] }, dispatch }}
      >
        <div className="create-category">
          <Header />
          <div className="create-category__form-imgupload-container">
            <Form />
            <ImageUploader />
          </div>
          <CreateCategoryBtn />
        </div>
      </CreateCategoryContext.Provider>
    </MainErrorCapturer>
  );
};

export default CreateCategoryComponent;

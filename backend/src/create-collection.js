import React, { useEffect, useReducer } from "react";
import { createRoot } from "react-dom/client";
import {
  CreateCollectionContext,
  REDUCER,
  INISIAL_STATE,
} from "./component/create-collection/state";
import useWeb3provider from "../../common/hook/wallet.hook";
import Header from "./component/create-collection/header";
import ImageUploader from "./component/create-collection/img-upload";
import Form from "./component/create-collection/info";
import CreateCollectionBtn from "./component/create-collection/createBtn";
import MainErrorCapturer from "../../common/component/error-comp/main-error";

const CreateCollection = () => {
  const [state, dispatch] = useReducer(REDUCER, INISIAL_STATE);
  const { account } = useWeb3provider();
  console.log(state);

  return (
    <MainErrorCapturer>
      <CreateCollectionContext.Provider
        value={{ state: { ...state, accAdd: account[0] }, dispatch }}
      >
        <div className="create-collection">
          <Header />
          <div className="create-collection__form-imgupload-container">
            <Form />
            <ImageUploader />
          </div>
          <CreateCollectionBtn />
        </div>
      </CreateCollectionContext.Provider>
    </MainErrorCapturer>
  );
};

//export default CreateCollection

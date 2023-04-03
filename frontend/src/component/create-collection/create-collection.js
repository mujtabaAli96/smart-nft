import React, { useReducer } from "react";
import Header from "./header";
import ImageUploader from "./img-upload";
import Form from "./info";
import CreateCollectionBtn from "./createBtn";
import Networks from "./networks";
import SelectContractStandard from "./select-contract-standard";
import SelectFreeOrActual from "./dummy-actual";

import { CreateCollectionContext, REDUCER, INISIAL_STATE } from "./state";
import useWeb3provider from "../../../../common/hook/wallet.hook";

const CreateCollection = ({ redirectToSinglePage }) => {
  const [state, dispatch] = useReducer(REDUCER, INISIAL_STATE);
  const web3Provider = useWeb3provider();

  const component = [
    <Networks web3Provider={web3Provider} />,
    <SelectContractStandard />,
    <SelectFreeOrActual />,
    <div className="create-collection">
      <Header />
      <div className="create-collection__form-imgupload-container">
        <Form />
        <ImageUploader />
      </div>
      <CreateCollectionBtn
        redirectToSinglePage={redirectToSinglePage}
        web3Provider={web3Provider}
      />
    </div>,
  ];

  return (
    <CreateCollectionContext.Provider
      value={{
        state: { ...state, creator: web3Provider.account[0] },
        dispatch,
      }}
    >
      {component[state.component]}
    </CreateCollectionContext.Provider>
  );
};

export default CreateCollection;

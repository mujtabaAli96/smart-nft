import React, { useState, useContext } from "react";
import { CreateCollectionContext } from "./state";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
//import { CreateCollection } from "../../../../common/component/popup";
import Erc721Contract from "../../../../contracts/Erc721";
import Erc1155Contract from "../../../../contracts/Erc1155";
import LoadingPopup from "./success-error-popup";
const { __ } = wp.i18n;

const getContract = (standard) => {
  if (standard == "Erc721") return Erc721Contract;
  if (standard == "Erc1155") return Erc1155Contract;
};

const CreateCollectionBtn = ({ redirectToSinglePage, web3Provider }) => {
  const { state, dispatch } = useContext(CreateCollectionContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const createCollection = async () => {
    try {
      if (!state.name) {
        return errorMessage(__("Collection name cant be empty.", SLUG));
      }

      if (!state.symbol) {
        return errorMessage(__("Symbol cant be empty.", SLUG));
      }

      if (!state.standard) {
        return errorMessage(__("Standard cant be empty.", SLUG));
      }

      if (state.collectionExist) {
        return errorMessage(__("Collection already exist.", SLUG));
      }

      setIsOpenPopup(true);

      console.log("isFree", state.isFree);
      let res;
      if (!state.isFree) {
        res = await web3Provider.deployContract({
          solidityCompiledJsonObj: getContract(state.standard),
          signer: web3Provider.signer,
          name: state.name,
          symbol: state.symbol,
        });
      } else {
        res = state.contractAddress;
      }

      const data = {
        ...state,
        contractAddress: res,
        network: state.selectedContract.network,
      };
      delete data.deployedContracts;
      delete data.selectedContract;

      console.log(data);

      const saveCollection = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: { collection: { ...data }, action: "smartnft_create_collection" },
      });

      successMessage(__("Collection creation successful.", SLUG));
      setIsLoading(false);

      if (!redirectToSinglePage) {
        return setTimeout(() => {
          window.location.reload();
        }, 3000);
      }

      setTimeout(() => {
        window.location.assign(saveCollection.data.col_link);
      }, 3000);
    } catch (err) {
      console.log(err);
      errorMessage(__("Collection Creation Fail.", SLUG));
      setIsOpenPopup(false);
    }
  };

  return (
    <>
      <button className="btn-main-black" onClick={createCollection}>
        {__("Create collection", SLUG)}
      </button>
      {isOpenPopup ? <LoadingPopup isLoading={isLoading} /> : null}
    </>
  );
};

export default CreateCollectionBtn;

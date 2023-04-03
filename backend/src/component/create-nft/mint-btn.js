import React, { useContext, useState } from "react";
import { parseEther } from "ethers/lib/utils";
import { CreateNftContext } from "./state";
import { SLUG, SETTINGS } from "../../../../common/store";
import useContractGenaretor from "../../../../common/hook/contract-genaretor.hook";
import LoadingPopupPortal from "./loading-popup";
import SuccessPopupPortal from "./success-popup";
import { showErrorForIncopleteData } from "./error";
import useIPFSProvider from "../../../../common/hook/ipfs.hook";
import useNft from "../../../../common/hook/useNft.hook";
import useTxHash from "../../../../common/hook/useTxhash.hook";
import useErc1155Owners from "../../../../common/hook/useErc1155Owners";
import useActivity from "../../../../common/hook/useActivity.hook";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

const timeToSecond = (date, time) => {
  return new Date(`${date}T${time}:00`).getTime() / 1000;
};

const MintBtn = ({ web3Provider }) => {
  const { state, dispatch } = useContext(CreateNftContext);
  const tokenContract = useContractGenaretor(
    state.selectedContract.contract[state.standard].address,
    state.standard,
    web3Provider.wallet
  );

  const proxyContract = useContractGenaretor(
    state.selectedContract.contract.proxy.address,
    "Market",
    web3Provider.wallet
  );

  const { uploadIpfsUsingInfura } = useIPFSProvider();
  const { storeNft, updateNftMetaByPostId, uploadToWPMedia } = useNft();
  const { storeTxHashLocally } = useTxHash();
  const { updateErc1155Owners } = useErc1155Owners();
  const { createNewActivity } = useActivity();

  const [mintingStart, setMintingStart] = useState(false);
  const [success, setSuccess] = useState(false);

  const [loadingState, setLoadingState] = useState({
    isMediaState: false,
    isMediaUploaded: false,
    isMintingState: false,
    isMintedOnContract: false,
    isListingState: false,
    isListingComplete: false,
  });

  const calcFee = () => {
    const listingFee = SETTINGS?.listingPrice;
    const listingType = SETTINGS?.listingType;
    const fixedListingPriceForCustomCoin =
      SETTINGS?.fixedListingPriceForCustomCoin;
    const price = parseFloat(state.price);

    //IF CUSTOMCOIN THEN RETURN THE FIXED RATE
    if (state.customCoin.isCustomCoin) {
      return parseEther(fixedListingPriceForCustomCoin).toString();
    }

    //IF listingType IS PERCENTAGE THEN PROCESS
    if (listingType == "1") {
      return parseEther(
        (price * (parseFloat(listingFee) / 100)).toString()
      ).toString();
    }

    //IF listingType IS FIXED THEN PROCESS
    if (listingType == "2") {
      return parseEther(listingFee).toString();
    }

    return "0";
  };

  const submitForm = async () => {
    try {
      showErrorForIncopleteData(state);
      setMintingStart(true);
      setLoadingState({ ...loadingState, isMediaState: true });

      //UPLOAD DATA
      const mediaUrl = await uploadIpfsUsingInfura(state.mediaBinary);
      const mediaThumb = await uploadToWPMedia(state.file);
      //const thumbnailUrl = await uploadIpfsUsingInfura(state.thumbnailBinary);
      const meta = {
        ...state.meta,
        image: mediaUrl,
        attributes: [...state.properties, ...state.labels, ...state.stats],
      };
      const jsonUrl = await uploadIpfsUsingInfura(JSON.stringify(meta));

      console.log(meta);

      dispatch({ type: "SET_MEDIA_URL", payload: mediaUrl });
      //dispatch({ type: "SET_THUMBNAIL_MEDIA_URL", payload: thumbnailUrl });
      dispatch({ type: "SET_JSON_URL", payload: jsonUrl });
      //dispatch({ type: "CHANGE_META", payload: thumbnailUrl, key: "IMAGE" });
      dispatch({
        type: "CHANGE_META",
        payload: meta.attributes,
        key: "ATTRIBUTES",
      });

      setLoadingState({
        ...loadingState,
        isMediaState: true,
        isMediaUploaded: true,
        isMintingState: true,
      });

      //IF ITS A FREE MINTING NFT THEN DONT DO NETWORK TRANSECTION
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      let tx = { hash: "0x000000000000" };
      let tokenId = Date.now();
      if (!state.isFreeMinting) {
        //MINT TOKEN
        if (state.standard === "Erc721") {
          console.log(tokenContract);
          tx = await tokenContract.mint(jsonUrl);
          await tx.wait();
          let recipent = await web3Provider.provider.getTransactionReceipt(
            tx.hash
          );

          tokenId = parseInt(recipent.logs[0].topics[3], 16);
        }

        if (state.standard === "Erc1155") {
          tx = await tokenContract.mint(state.amount, jsonUrl);
          await tx.wait();
          tokenId = (await tokenContract.tokenCounts()).toNumber();
        }
      }

      //SAVE DATA LOCALLY
      const nftData = {
        ...state,
        meta: meta,
        mediaUrl: mediaUrl,
        //mediaThumb: mediaThumb,
        thumbnailMediaUrl: mediaThumb,
        jsonUrl: jsonUrl,
        tokenId: tokenId,
        creator: web3Provider.account[0].toLowerCase(),
        owners: [web3Provider.account[0].toLowerCase()],
        isListed: false,
        contractAddress:
          state.selectedContract.contract[state.standard].address.toLowerCase(),
      };

      debugger;

      //DELETE UNNECESSARY DATA
      delete nftData.mediaBinary;
      delete nftData.thumbnailBinary;
      delete nftData.deployedContracts;

      const postRes = await storeNft(nftData);

      //SAVE OWNERS SEPARATELY IF ITS 1155 STANDARD
      if (state.standard === "Erc1155") {
        await updateErc1155Owners(postRes.id, web3Provider.account[0], {
          amount: state.amount,
          price: state.price,
          isListed: false,
        });
      }

      //SAVE TRANSECTION HASH WITH EVENT NAME
      await storeTxHashLocally(
        {
          eventType: "Mint",
          signer: web3Provider.account[0],
          hash: tx?.hash,
        },
        postRes.id
      );

      //UPDATE LOADING STATE
      setLoadingState({
        ...loadingState,
        isMediaState: true,
        isMediaUploaded: true,
        isMintingState: true,
        isMintedOnContract: true,
        isListingState: true,
      });

      // SAVE THE ACTIVITY
      await createNewActivity({
        post_id: parseInt(postRes.id),
        activity_type: "mint",
        price: parseFloat(state.price),
        addr_from:
          state.selectedContract.contract[state.standard].address.toLowerCase(),
        addr_to: web3Provider.account[0].toLowerCase(),
        chain_id: web3Provider.network.chainId,
        collection_id: state.collection.id,
        category_id: state.category.id,
      });

      //GIVE MARKET APPROVAL TO TRANSFER TOKEN
      const marketHasAccess = await tokenContract.isApprovedForAll(
        nftData.owners[0],
        state.selectedContract.contract.proxy.address
      );

      if (!marketHasAccess) {
        await tokenContract.setApprovalForAll(
          state.selectedContract.contract.proxy.address,
          true
        );
      }

      //LISTING FEE CALCULATE
      let option = { value: calcFee() };

      let mtx = { hash: "0x000000000000" }; // market transection hash

      //PUT THE TOKEN ON MARKET PLACE
      //check if auction is set
      if (state.auction.isAuctionSet) {
        //TODO: FOR AUCTION
      } else {
        //auction not set so put it in normal sale

        let _standard = 0;
        if (state.standard == "Erc721") _standard = 721;
        if (state.standard == "Erc1155") _standard = 1155;

        //IF ITS A FREE MINTING NFT THEN DONT DO NETWORK TRANSECTION
        ////////////////////////////////////////////////////////////
        if (!state.isFreeMinting) {
          // 0.contract_address, 1.creator_address, 2.split_payment_addresses_from_index_2
          // 0.token_id, 1.chain_id, 2.price, 3.royalty_percentage, 4.standard, 5.amount, 6.split_payment_percentages_from_index_6
          // 0.has_split_payment, 1.has_royalty
          mtx = await proxyContract.list_for_sale(
            [
              nftData.contractAddress,
              nftData.creator,
              ...nftData.splitPayments.map((cur) => cur.address),
            ],
            [
              nftData.tokenId,
              web3Provider.network.chainId,
              nftData.priceInWei,
              nftData.royalty,
              _standard,
              nftData.amount,
              ...nftData.splitPayments.map((cur) => cur.percentage * 100),
            ],
            [nftData.hasSplitPayment, nftData.royalty > 0],
            option
          );

          await mtx.wait();
        }
      }

      //UPDATE ISLISTED AFTER LIST FOR 1155
      if (state.standard === "Erc1155") {
        await updateErc1155Owners(postRes.id, web3Provider.account[0], {
          isListed: true,
        });
      }

      //UPDATE NFT ISLISTED PROPERTY
      await updateNftMetaByPostId(postRes.id, {
        newMeta: { isListed: true },
        newDirectMeta: { isListed: true },
      });

      //SAVE TRANSECTION HASH WITH EVENT NAME
      await storeTxHashLocally(
        {
          eventType: "List",
          signer: web3Provider.account[0],
          hash: mtx.hash,
          price: nftData.price,
        },
        postRes.id
      );

      // SAVE THE ACTIVITY
      await createNewActivity({
        post_id: parseInt(postRes.id),
        activity_type: "list",
        price: parseFloat(state.price),
        addr_from: web3Provider.account[0].toLowerCase(),
        addr_to: state.selectedContract.contract.proxy.address.toLowerCase(),
        chain_id: web3Provider.network.chainId,
        collection_id: state.collection.id,
        category_id: state.category.id,
      });

      setLoadingState({
        isMediaState: true,
        isMediaUploaded: true,
        isMintingState: true,
        isMintedOnContract: true,
        isListingState: true,
        isListingComplete: true,
      });

      //close loading and open success popup
      dispatch({ type: "SET_URL", payload: postRes.permalink });
      setSuccess(true);
      setMintingStart(false);
    } catch (err) {
      setLoadingState({ ...loadingState });
      setMintingStart(false);
      console.log(err);
      errorMessage(
        __(
          "Something is wrong! Check you have enouth balance for gas fee or try again.",
          SLUG
        )
      );
    }
  };

  return (
    <div className="mint-btn-con">
      <button onClick={submitForm} className="btn-primary">
        {__("Create NFT", SLUG)}
      </button>
      {mintingStart ? <LoadingPopupPortal state={loadingState} /> : null}
      {success ? <SuccessPopupPortal /> : null}
    </div>
  );
};

export default MintBtn;

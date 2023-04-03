import { SLUG } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
const { __ } = wp.i18n;

export const showErrorForIncopleteData = (state) => {
  //GIVE ERROR IF NAME IS NOT PROVIDE
  if (!state.meta?.name) {
    errorMessage(__("Provide name.", SLUG));
    throw new Error("Provide name.");
  }

  //GIVE ERROR IF NO IMAGE IS PROVIDE IN META
  if (!state.mediaBinary) {
    errorMessage(__("Provide media.", SLUG));
    throw new Error("Provide media.");
  }

  //GIVES ERROR IF AMOUNT IS NOT A NUMBER
  if (state.standard == "Erc1155" && !state.amount) {
    errorMessage(__("Amount need to be at list 1", SLUG));
    throw new Error("Amount need to be at list 1");
  }

  //GIVE ERROR IF NO TOKEN STANDARD IS SELECTED
  if (!state.standard) {
    errorMessage(__("Select a token standard!", SLUG));
    throw new Error("Select a token standard!");
  }

  //GIVE ERROR IF NO BLOCK CHAIN IS SELECTED
  if (!state.selectedContract) {
    errorMessage(__("Select a blockchain network to mint the nft!", SLUG));
    throw new Error("Select a blockchain network to mint the nft!");
  }

  // GIVE ERROR IF AUCTION IS SELECTED AND END TIME IS < START TIME OR <  NOW
  if (state.auction.isAuctionSet) {
    const { startDate, startTime, endDate, endTime } = state.auction;
    if (!startDate || !startTime || !endDate || !endTime) {
      errorMessage(__("Give auction proper data.", SLUG));
      throw new Error("Give auction proper data.");
    }
    const sTime = timeToSecond(
      state.auction.startDate,
      state.auction.startTime
    );
    const eTime = timeToSecond(state.auction.endDate, state.auction.endTime);

    if (sTime >= eTime || Date.now() / 1000 >= eTime) {
      errorMessage(__("Start-time cant be greater then end-time.", SLUG));
      throw new Error("Start-time cant be greater then end-time.");
    }
  }
};

const timeToSecond = (date, time) => {
  return new Date(`${date}T${time}:00`).getTime() / 1000;
};

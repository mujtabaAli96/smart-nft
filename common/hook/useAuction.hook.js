import { BACKEND_AJAX_URL } from "../store";

//addBid fn will add new bid
//signer is the address of the user who sign the transection
//dataToSave is a object that will be saved
const addBid = async ({ postId, signer, benificiary, dataToSave }) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      action: "smartnft_add_auction_bid",
      post_id: postId,
      signer: signer.toLowerCase(),
      benificiary: benificiary.toLowerCase(),
      data_to_save: dataToSave,
    },
  });

  return res.data;
};

const deleteBid = async ({ postId, bidHash, benificiary }) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      action: "smartnft_delete_auction_bid",
      post_id: postId,
      bid_hash: bidHash,
      benificiary,
    },
  });

  return res.data;
};

const getAllBids = async ({ postId }) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: { action: "smartnft_get_auction_bid", post_id: postId },
  });

  return res.data;
};

const useAuction = () => {
  return { addBid, deleteBid, getAllBids };
};

export default useAuction;

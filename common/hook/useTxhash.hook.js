import { BACKEND_AJAX_URL } from "../store";

const storeTxHashLocally = async (txInfo, postId) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        txInfo: {
          ...txInfo,
          postId,
          time: Date.now(),
        },
        action: "smartnft_store_tx_hash",
      },
    });

    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const getTxHashLocally = async (postId) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId: postId,
        action: "smartnft_get_tx_hash",
      },
    });

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};

const useTxHash = () => {
  return {
    storeTxHashLocally,
    getTxHashLocally,
  };
};

export default useTxHash;

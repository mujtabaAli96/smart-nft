import { BACKEND_AJAX_URL } from "../store";

const deleteErc1155Owner = async (postId, ownerAddress) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId,
        ownerAddress,
        action: "smartnft_erc1155_token_delete_owner",
      },
    });

    console.log(res);
    return res.data;
  } catch (err) {
    console.log("deleteErc1155Owner_err---->", err);
  }
};

const updateErc1155Owners = async (postId, ownerAddress, ownerData) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId,
        ownerAddress,
        ownerData,
        action: "smartnft_erc1155_token_update_owners",
      },
    });

    console.log(res);
    return res.data;
  } catch (err) {
    console.log("updateErc1155Owners err ---->", err);
  }
};

const getErc1155Owners = async (postId) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId,
        action: "smartnft_erc1155_token_get_owners",
      },
    });

    console.log(res);
    return res.data;
  } catch (err) {
    console.log("getErc1155Owners err ---->", err);
  }
};

const useErc1155Owners = () => {
  return {
    updateErc1155Owners,
    getErc1155Owners,
    deleteErc1155Owner,
  };
};

export default useErc1155Owners;

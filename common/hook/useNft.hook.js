import { BACKEND_AJAX_URL, NFT_PER_PAGE } from "../store";

const storeNft = async (nft) => {
  try {
    const newNft = { ...nft, file: null };
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: { nft: newNft, action: "store_nft" },
    });

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};

const getNfts = async (pageNo = 1) => {
  const offset = (pageNo - 1) * NFT_PER_PAGE; //offset means how many result to escape

  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      offset: offset,
      limit: NFT_PER_PAGE,
      action: "smartnft_get_nfts",
    },
  });

  return res.data;
};

const getNftByPostId = async (id) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        post_id: id,
        action: "smartnft_get_nft_by_post_id",
      },
    });

    console.log(res);

    return res;
  } catch (err) {
    console.log(err);
  }
};
const updateNftMetaByPostId = async (postId, data) => {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId,
        ...data, //data is the value this going to update
        action: "smartnft_update_nft_meta",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log("smartnft_update_nft_meta--->", err);
  }
};

const deleteLocalNft = async (postId) => {
  if (!postId) throw new Error("No post id is provide");

  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        postId,
        action: "smartnft_delete_nft",
      },
    });

    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

const changeNftVisibility = async (nft_id, visibility) => {
  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      nft_id,
      visibility,
      action: "change_nft_visibility",
    },
  });

  return res;
};

const uploadToWPMedia = async (file) => {
  // Note : Upload only Image files
  let formData = new FormData();
  formData.append("action", "upload_nft_wpmedia");
  formData.append("upload_file", file);

  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    dataType: "json",
    data: formData,
    processData: false,
    contentType: false,
  });
  console.log("Uploaded -------------------", res);
  return res;
};

const useNft = () => {
  return {
    storeNft,
    getNftByPostId,
    updateNftMetaByPostId,
    deleteLocalNft,
    getNfts,
    changeNftVisibility,
    uploadToWPMedia,
  };
};
export default useNft;

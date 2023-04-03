import { BACKEND_AJAX_URL, SLUG } from "../store";
import { errorMessage } from "../component/message/error";
const { __ } = wp.i18n;

const createNewActivity = async (data) => {
  // data example
  // array(
  //     'post_id' 		=> $id, --->NFT id
  //     'activity_type'  => 'mint', // mint, list, buy, transfer
  //     'price' 		    => '', // ethPrice
  //     'addr_from' 	    => $addr_from, // address from the transaction has been happening
  //     'addr_to'		=> $addr_to, //
  //     'chain_id'       => $chain_id,
  //     'collection_id'  => $collection_id,
  //     'category_id'    => $category_id
  // );
  if (!data) {
    errorMessage(__("Activity update failed", SLUG));
    throw new Error("Please provide data");
  }

  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        activityData: { ...data },
        action: "insert_activity",
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

// `startTimeInMS` is from which point of date data will be fetch
// `collId` is from which collection data
const getCollStatsOnTimeRange = async (startTimeInMS, collId) => {
  if (!startTimeInMS || !collId) {
    throw new Error("Please provide valid input.");
  }

  const res = await jQuery.ajax({
    type: "post",
    url: BACKEND_AJAX_URL,
    data: {
      startTimeInMS,
      collId,
      action: "samrtnft_get_coll_stats_on_time_range",
    },
  });

  return res;
};

const useActivity = () => {
  return {
    createNewActivity,
    getCollStatsOnTimeRange,
  };
};

export default useActivity;

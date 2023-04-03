import React, { useEffect } from "react";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
import { Icons } from "../../../../common/component/icons";
const { __ } = wp.i18n;

export const ViewsCountComponent = ({ data }) => {
    
  //guard close for dashborad controll
  //if (SETTINGS.nftpages?.single?.views === "false") return;
  if (data.loading)
    return (
      <span
        className="skeleton-box"
        style={{ width: 50, borderRadius: 10, marginLeft: 20 }}
      ></span>
    );


  const updateViews = async () =>{
    let currentviews = data.nftInfo?.views === '' ? 0 : parseInt(data.nftInfo?.views)
    const newViews = ++currentviews;
    try {
        const res = await jQuery.ajax({
            type: "post",
            url: BACKEND_AJAX_URL,
            data: {
                post_id: data.nftInfo.postId,
                views: newViews,
                action: "smartnft_update_views" 
            },
        });
        console.log(res)
    } catch (err) {
        console.log(err);
    }
  }

  useEffect( () => {
    updateViews()
  }, [])

  return (
    <div className="single-nft__share-section">
      <span>
        { data.nftInfo?.views === "" ? 0 : parseInt(data.nftInfo?.views) }
        {__(" Views", SLUG)}
      </span>
    </div>
  );
};

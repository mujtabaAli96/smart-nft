import React from "react";
import useNftLike from "../../../../common/hook/useLikes.hook";
import { Icons } from "../../../../common/component/icons";
export const LikeComponent = ({ data, tokenId }) => {
  //gurd close for dashborad controll
  //if (SETTINGS.nftpages?.single?.likebtn === "false") return;

  //main component code
  const { likes, setLikes, account, isLoading, removeNftlikes, storeNftlikes } =
    useNftLike(tokenId);

  if (data.loading)
    return (
      <span
        className="skeleton-box"
        style={{ width: 50, borderRadius: 10 }}
      ></span>
    );

  const isLiked = () => {
    return likes?.includes(account?.toLowerCase());
  };

  const processLike = async () => {
    if (isLiked()) {
      //console.log("remove like");
      const res = await removeNftlikes(tokenId, account);

      setLikes(res.data);
      return;
    }

    //console.log("add like");
    const res = await storeNftlikes(tokenId, account);
    setLikes(res.data);
  };

  return (
    <div className="btn-like">
      <span onClick={(e) => processLike()}>
        <span className="like-icon">
          {isLiked() ? Icons.likeFilled : Icons.like}
        </span>
        <span>{likes.length}</span>
      </span>
    </div>
  );
};

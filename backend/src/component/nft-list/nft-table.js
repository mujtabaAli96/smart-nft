import React, { useEffect, useState } from "react";
import useNft from "../../../../common/hook/useNft.hook";
import { Pagination } from "./pagination";
import { SLUG, NFT_PER_PAGE } from "../../../../common/store";
import Switch from "../../../../common/component/switcher";
import { TableLoading } from "../../../../common/component/loading";
import { NFTsNotFound } from "./notfound";
const { __ } = wp.i18n;

const NftList = ({ createnft }) => {
  const [curPage, setCurPage] = useState(1);
  const { getNfts } = useNft();
  const [nfts, setNfts] = useState([]);
  const [totalNfts, setTotalNfts] = useState(null);
  const [isLoading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const res = await getNfts(curPage);
      setNfts(res.nfts);
      setTotalNfts(res.total_post_found);
      setLoading(false);
      console.log(res);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [curPage]);

  return (
    <>
      {isLoading && (
        <TableLoading cols={7} rows={NFT_PER_PAGE} indeximg={true} />
      )}
      {!isLoading && (
        <>
          {nfts.length == 0 && <NFTsNotFound createnft={createnft} />}
          {nfts.length > 0 && (
            <>
              <table className="nft-list__table">
                <thead>
                  <tr>
                    <td>{__("Image", SLUG)}</td>
                    <td>{__("Name", SLUG)}</td>
                    <td>{__("Creator", SLUG)}</td>
                    <td>{__("Owner", SLUG)}</td>
                    <td>{__("Listed", SLUG)}</td>
                    <td className="price">{__("Price", SLUG)}</td>
                    <td className="link">{__("Link", SLUG)}</td>
                    <td className="link"></td>
                  </tr>
                </thead>

                <tbody>
                  {nfts.map((cur, i) => (
                    <TableRow nft={cur} key={i} />
                  ))}
                </tbody>
              </table>
              <Pagination
                totalNfts={totalNfts}
                setCurPage={setCurPage}
                curPage={curPage}
                setLoading={setLoading}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

const TableRow = ({ nft }) => {
  const post_status = nft.post_status == "publish" ? true : false;
  const [status, setStatus] = useState(post_status);
  const { changeNftVisibility } = useNft();

  const changeNFTvisibility = async (post_id, status) => {
    setStatus(status);
    const visibility = status ? "publish" : "private";
    try {
      const res = await changeNftVisibility(post_id, visibility);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const owner = nft.owners?.[0];
  const creator = nft.creator;

  return (
    <tr>
      <td className="b-img">
        {nft.fileType.startsWith("video") && (
          <div className="video-preview">
            <video src={nft.mediaUrl} alt={nft.name} />
            <span className="video-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-play-fill"
                viewBox="0 0 16 16"
              >
                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
              </svg>
            </span>
          </div>
        )}
        {nft.fileType.startsWith("audio") && (
          <div className="audio-preview">
            <span className="form-preview-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-music-note"
                viewBox="0 0 16 16"
              >
                <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
                <path fillRule="evenodd" d="M9 3v10H8V3h1z" />
                <path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5V2.82z" />
              </svg>
            </span>
          </div>
        )}
        {nft.fileType.startsWith("image") && (
          <img src={nft.thumbnailMediaUrl?.attach_url} alt={nft.meta?.name} />
        )}
      </td>
      <td>
        <p>{nft.meta?.name}</p>
      </td>
      <td>
        {creator && (
          <p>
            {creator.slice(0, 8)}...{creator.slice(owner.length - 4)}
          </p>
        )}
      </td>
      <td>
        {owner && (
          <p>
            {owner.slice(0, 8)}...{owner.slice(owner.length - 4)}
          </p>
        )}
      </td>
      <td>
        <p>
          {nft.isListed ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#5cb85c"
                className="bi bi-check-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
              </svg>
            </>
          ) : (
            "Not listed"
          )}
        </p>
      </td>
      <td>
        <p>
          {nft.price} {nft.selectedContract?.network.currencySymbol}
        </p>
      </td>
      <td>
        <a href={nft.permalink} target="_blank">
          {__("view")}
        </a>
      </td>
      <td>
        <p>
          <Switch
            id={nft.post_id}
            isOn={status}
            handleToggle={(e) => changeNFTvisibility(nft.post_id, !status)}
          />
        </p>
      </td>
    </tr>
  );
};

export { NftList };

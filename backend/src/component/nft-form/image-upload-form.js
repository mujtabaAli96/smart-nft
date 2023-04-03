import { parseEther } from "ethers/lib/utils";
import React, { useState, useEffect } from "react";
const { __ } = wp.i18n;
import {
  SLUG,
  NETWORKS,
  ACTIVE_CONTRACT,
  SETTINGS,
  BACKEND_AJAX_URL,
} from "../../../../common/store";
import useWeb3provider from "../../../../common/hook/wallet.hook";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
//import { SmartNFTPopup } from "../../../../common/component/popup";
import { calculateListingPriceInEther } from "../../../../common/utils/utils";
import SplitPaymentComponent from "./split-payments";
import Model3dObjectLoader from "../../../../common/component/models/rederer";
const ImageUploadForm = () => {
  const [metaData, setMetaData] = useState({
    name: null,
    description: null,
    mediaType: null,
    size: null,
    image: null,
    mediaUrl: null,
    unlockableContent: null,
    properties: [],
    collection: "",
    category: "",
    alternatePreview: null,
    royalties: 0,
    hasSplitPayment: false,
    splitPayments: [], // property {address:"0x0xxxx",percentage:0 - 10000} percentage * 100
  });

  const [media, setMedia] = useState(null);
  const [nftPrice, setNftPrice] = useState(0);
  const [royalties, setRoyality] = useState(0);
  const [royalityActive, setRoyalityActive] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState(null);
  const [isFreeMinting, setIsFreeMinting] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState(false);
  const [advancedOptions, setAdvancedOption] = useState(false);
  const [propertiesList, setPropertiesList] = useState([
    { key: "", value: "" },
  ]);

  const [collections, setCollections] = useState([]);
  const [isCollectionFieldOpen, setCollectionFieldOpen] = useState(false);
  const [collectionSugetions, setCollectionsSugetion] = useState([]);
  const [showSuggetion, setShowSuggetion] = useState(false);

  const [categories, setCategories] = useState([]);
  const [isCategoryFieldOpen, setCategoryFieldOpen] = useState(false);
  const [categorySugetions, setCategorySugetion] = useState([]);
  const [showCategorySuggetion, setShowCategorySuggetion] = useState(false);

  // NFT minting states
  const [popupdata, setPopupdata] = useState({
    uploadingmedia: false,
    medialoaded: false,
    uploadingipfs: false,
    ipfsloaded: false,
    mintingtoken: false,
    nftminted: false,
    puttingonsale: false,
    putsale: false,
    finished: false,
    tokenId: "",
    permalink: "",
  });

  const [popup, setPopup] = useState(false);
  const web3Provider = useWeb3provider();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            creator: web3Provider.account[0],
            contract_add: ACTIVE_CONTRACT.address,
            action: "get_user_collections_and_category",
          },
        });

        console.log(res);

        setCollections(res.data.collections);
        setCollectionsSugetion(res.data.collections);
        setCategories(res.data.categories);
        setCategorySugetion(res.data.categories);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [web3Provider.account]);

  const maxuploadsize = parseInt(SETTINGS?.nftImageSize || 12) * 1000000;
  const processFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > maxuploadsize) {
      errorMessage(
        __(
          `Please upload a file less then ${
            parseInt(maxuploadsize) / 1000000
          }mb.`,
          SLUG
        )
      );
      return;
    }
    const reader = new FileReader();
    const reader2 = new FileReader();
    reader.readAsArrayBuffer(file);
    reader2.readAsDataURL(file);

    // Model file type
    // From v1.6.0
    let modelType = null;
    if (file.name.endsWith("gltf")) {
      modelType = "gltf";
    } else if (file.name.endsWith("glb")) {
      modelType = "glb";
    } else if (file.name.endsWith("fbx")) {
      modelType = "fbx";
    } else if (file.name.endsWith("obj")) {
      modelType = "obj";
    }
    console.log(modelType);
    reader.addEventListener("load", () => {
      setMetaData((prev) => ({
        ...prev,
        mediaType: file.type ? file.type : modelType,
        size: file.size,
      }));
      setMedia(reader.result);
    });

    reader2.addEventListener("load", () => {
      setPreviewMediaUrl(reader2.result);
    });
  };

  const processAlternateFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      errorMessage(__("Please upload an image file", SLUG));
      throw new Error("MEDIA TYPE IS NOT SUPPORTED YET!");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      setMetaData((prev) => ({
        ...prev,
        alternatePreview: reader.result,
      }));
    });
  };
  const emptyAlternateMedia = () => {
    setMetaData((prev) => ({
      ...prev,
      alternatePreview: null,
    }));
  };
  const submitForm = async (e) => {
    e.preventDefault();

    //error handleing
    if (!media) {
      errorMessage(__("No media selected", SLUG));
      throw new Error("NO MEDIA SELECTED");
    }

    if (!metaData.name) {
      errorMessage(__("No name is provided", SLUG));
      throw new Error("No name is provided");
    }

    if (!nftPrice || parseFloat(nftPrice) <= 0) {
      errorMessage(__("Price cant be empty or less then 0", SLUG));
      throw new Error("Price cant be empty or less then 0");
    }

    if (SETTINGS.listingType === "2" && isFreeMinting) {
      if (parseFloat(nftPrice) <= parseFloat(SETTINGS.listingPrice)) {
        errorMessage(__("You cant mint a token without listing fees", SLUG));
        throw new Error("You cant mint a token without listing fees");
      }
    }

    if (
      metaData.hasSplitPayment &&
      metaData.splitPayments.reduce(
        (perValue, curEl) => perValue + parseFloat(curEl.percentage),
        0
      ) !== 100
    ) {
      errorMessage(__("Total split payments must be 100%", SLUG));
      throw new Error(__("Total split payments must be 100%", SLUG));
    }

    metaData.splitPayments.forEach((cur) => {
      if (!cur.address) {
        errorMessage(__("Split payment address cant be blank.", SLUG));
        throw new Error(__("Split payment address cant be blank."));
      }
    });
    /*END ERROR HANDELING*/

    try {
      setPopup(true);
      setPopupdata({ ...popupdata, uploadingmedia: true });
      const mediaUrl = await web3Provider.upload(media);
      const meta = {
        ...metaData,
        mediaUrl,
        image: mediaUrl, //this property is set for other nft site to get the image
      };

      const jsonUrl = await web3Provider.upload(JSON.stringify(meta));
      const price = parseEther(nftPrice).toString();
      console.log(price);

      if (isFreeMinting) {
        const nft = {
          ...meta,
          name: meta.name,
          properties: meta.properties,
          jsonUrl,
          price,
          ethPrice: nftPrice,
          creator: web3Provider.account[0],
          owner: web3Provider.account[0],
          tokenId: `0x0${Date.now()}`,
          isListed: true,
          contract: ACTIVE_CONTRACT.address,
        };

        setPopupdata({
          ...popupdata,
          uploadingmedia: false,
          medialoaded: true,
        });

        setPopupdata({ ...popupdata, mintingtoken: true });
        const res = await web3Provider.storeNft(nft);
        setPopupdata({
          ...popupdata,
          mintingtoken: false,
          puttingonsale: true,
          nftminted: true,
        });
        setTimeout(() => {
          setPopupdata({
            ...popupdata,
            puttingonsale: false,
            putsale: false,
            finished: true,
            tokenId: nft.tokenId,
            permalink: res.data.permalink,
          });
          successMessage(__("Free Minting complete.", SLUG));
        }, 5000);
        return;
      }

      setPopupdata({ ...popupdata, uploadingmedia: false, medialoaded: true });
      setPopupdata({ ...popupdata, mintingtoken: true });

      const tx = await web3Provider.contract.mintToken(
        jsonUrl,
        price,
        calculateListingPriceInEther(nftPrice), //price in ether not in wei
        royalties,
        metaData.hasSplitPayment, //has split payment
        metaData.splitPayments.map((cur) => {
          if (!cur.address)
            throw new Error(__("Split payment address cant be blank."));
          return cur.address;
        }), //addresses
        metaData.splitPayments.map((cur) => parseFloat(cur.percentage) * 100), //percentages
        {
          value: calculateListingPriceInEther(nftPrice),
        }
      );

      //wait for confirmation
      await tx.wait();

      //get tokenId
      const totalSupply = await web3Provider.contract.totalSupply();
      const tokenId = totalSupply.toNumber(); // new token increment by one

      //save tx hash in local db
      await web3Provider.storeTxHashLocally(tx.hash, tokenId);

      const mintednft = {
        ...meta,
        name: meta.name,
        properties: meta.properties,
        jsonUrl,
        price,
        ethPrice: nftPrice,
        creator: web3Provider.account[0],
        owner: web3Provider.account[0],
        tokenId: tokenId,
        isListed: true,
        contract: ACTIVE_CONTRACT.address,
        txHash: tx.hash,
      };
      console.log(mintednft);
      const res = await web3Provider.storeNft(mintednft);

      setPopupdata({
        ...popupdata,
        mintingtoken: false,
        puttingonsale: true,
        nftminted: true,
        permalink: res.data.permalink,
      });

      setTimeout(() => {
        setPopupdata({
          ...popupdata,
          puttingonsale: false,
          putsale: false,
          finished: true,
          tokenId: tokenId,
          permalink: res.data.permalink,
        });
        // setPopup(false);
        successMessage(__("Minting completed successfully.", SLUG));
      }, 5000);

      //window.location.reload();
    } catch (err) {
      console.log("ERROR:>>>>>>>>>>>>>", err);
      setPopup(false);

      if (err.code === "INSUFFICIENT_FUNDS") {
        errorMessage(__(`Insufficient Funds to purchase`, SLUG));
      }

      errorMessage(
        __(
          "Something went wrong, cant mint right now! Reload the page or try again."
        ),
        SLUG
      );
    }
  };

  const handlePropertiesChanges = (e, index) => {
    const { name, value } = e.target;
    const properties = [...propertiesList];
    properties[index][name] = value;

    setPropertiesList(properties);

    if (name == "value" && value !== "" && value.length == 1) {
      if (index + 1 == properties.length) {
        setPropertiesList([...propertiesList, { key: "", value: "" }]);
      }
    }

    if (name == "value" && value == "" && value.length < 1) {
      properties.pop();
      setPropertiesList([...properties]);
    }

    setMetaData({ ...metaData, properties: properties });
  };

  const network = NETWORKS.find(
    (network) => network.chainId === parseInt(ACTIVE_CONTRACT.network.chainId)
  );

  const listingFeesCalculate = () => {
    if (SETTINGS.listingPriceActive === "false") return 0;

    if (SETTINGS.listingType === "1") {
      const listingPrice = parseFloat(SETTINGS.listingPrice || 0);
      const fees = nftPrice * (listingPrice / 100);
      return parseFloat(nftPrice) - fees;
    }

    if (
      SETTINGS.listingPriceActive === "true" &&
      SETTINGS.listingType === "2"
    ) {
      if (parseFloat(nftPrice) <= parseFloat(SETTINGS.listingPrice)) {
        errorMessage(
          __("Free minting nft price cant be less then listing price", SLUG)
        );
        return 0;
      }
      return parseFloat(nftPrice) - parseFloat(SETTINGS.listingPrice);
    }
  };

  const listingWithPay = () => {
    if (SETTINGS.listingPriceActive === "false") return 0;

    if (SETTINGS.listingType === "1") {
      const listingPrice = parseFloat(SETTINGS.listingPrice || 0);
      const fees = nftPrice * (listingPrice / 100);
      return fees;
    }

    if (SETTINGS.listingType === "2") {
      return parseFloat(SETTINGS.listingPrice);
    }
  };

  const royalityCalculate = (amount) => {
    const royalityValue = parseFloat(amount);

    if (isNaN(royalityValue)) {
      errorMessage(__("Give a valid royalties percentage.", SLUG));
      return;
    }

    // royality cant be grater then 50%
    if (royalityValue < 0 || royalityValue > 50) {
      errorMessage(__("Give a valid royalties percentage.", SLUG));
      return;
    }

    const royalityWithOnlyTwoFlotPoinNumber = royalityValue.toFixed(2);
    const royalityWithoutFloatPoint = royalityWithOnlyTwoFlotPoinNumber * 100;

    setRoyality(royalityWithoutFloatPoint);
    setMetaData((prev) => ({
      ...prev,
      royalties: parseFloat(royalityWithOnlyTwoFlotPoinNumber),
    }));
  };

  return (
    <div className="form-img-upload">
      <form onSubmit={submitForm} className="form-img-upload__form" action="">
        <p className="form-img-upload__title header-two">
          {__("Upload file", SLUG)}
        </p>
        <div className="form-img-upload__upload-box">
          {previewMediaUrl && (
            <div>
              {metaData.mediaType && metaData.mediaType.startsWith("video") && (
                <video
                  controlsList="nodownload"
                  autoPlay
                  controls
                  className="inbox-media"
                  src={previewMediaUrl}
                  alt="preview"
                />
              )}
              {metaData.mediaType && metaData.mediaType.startsWith("audio") && (
                <audio
                  controlsList="nodownload noplaybackrate"
                  controls
                  className="inbox-media"
                  src={previewMediaUrl}
                  alt="preview"
                />
              )}
              {metaData.mediaType && metaData.mediaType.startsWith("image") && (
                <img
                  className="inbox-media"
                  src={previewMediaUrl}
                  alt="preview"
                />
              )}
              {metaData.mediaType && metaData.mediaType.startsWith("glb") && (
                <Model3dObjectLoader
                  src={previewMediaUrl}
                  type={metaData.mediaType}
                />
              )}
              {metaData.mediaType && metaData.mediaType.startsWith("gltf") && (
                <Model3dObjectLoader
                  src={previewMediaUrl}
                  type={metaData.mediaType}
                />
              )}
              <span
                className="close-media"
                onClick={(e) => setPreviewMediaUrl(null)}
              >
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
            </div>
          )}
          {!previewMediaUrl && (
            <div>
              <p className="pra-one">
                {__(
                  `JPG, PNG, AVIF, GIF, WEBP, GLB, MP4 or MP3. Max ${
                    parseInt(maxuploadsize) / 1000000
                  }mb.`,
                  SLUG
                )}
              </p>
              <label htmlFor="upload-btn">
                {__("Choose file", SLUG)}
                <input
                  onChange={processFile}
                  className="form-img-upload__file-input"
                  type="file"
                  id="upload-btn"
                />
              </label>
            </div>
          )}
        </div>
        {(metaData.mediaType?.startsWith("audio") ||
          metaData.mediaType?.startsWith("glb")) && (
          <>
            <p className="form-img-upload__title header-two">
              {__("Upload alternate preview image", SLUG)}
            </p>
            <div className="form-img-upload__upload-box">
              {metaData.alternatePreview !== null && (
                <div>
                  <img
                    className="inbox-media"
                    src={metaData.alternatePreview}
                    alt="preview"
                  />
                  <span
                    className="close-media"
                    onClick={(e) => emptyAlternateMedia(null)}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </span>
                </div>
              )}
              {metaData.alternatePreview == null && (
                <div>
                  <p className="pra-one">
                    {__("PNG, GIF, WEBP. Max 100mb.", SLUG)}
                  </p>
                  <label htmlFor="upload-btn">
                    {__("Choose file", SLUG)}
                    <input
                      onChange={processAlternateFile}
                      className="form-img-upload__file-input"
                      type="file"
                      id="upload-btn"
                    />
                  </label>
                </div>
              )}
            </div>
          </>
        )}

        <label className="form-img-upload__label" htmlFor="name">
          <p className="form-img-upload__label-text header-two">
            {__("Name", SLUG)}
          </p>
          <input
            placeholder={__("e. g. Redeemable T-Shirt with logo", SLUG)}
            onChange={(e) => {
              setMetaData((prev) => ({ ...prev, name: e.target.value }));
            }}
            className="form-img-upload__input"
            type="text"
            id="name"
          />
        </label>
        <label className="form-img-upload__label" htmlFor="des">
          <p className="form-img-upload__label-text header-two">
            {__("Description ", SLUG)}
            <span className="pra-one">{__("(optional)", SLUG)}</span>
          </p>
          <textarea
            placeholder={__(
              "Provide a detailed description of your item.",
              SLUG
            )}
            onChange={(e) => {
              setMetaData((prev) => ({ ...prev, description: e.target.value }));
            }}
            id="des"
            name="des"
            cols="30"
            rows="5"
          ></textarea>
        </label>
        <label className="form-img-upload__label header-two" htmlFor="price">
          <p className="form-img-upload__label-text header-two">
            {__("Price", SLUG)}
          </p>
          <input
            placeholder={__("Enter price for one piece", SLUG)}
            onChange={(e) => {
              if (e.target.value === "") {
                setNftPrice(0);
                return;
              }
              setNftPrice(e.target.value);
            }}
            className="form-img-upload__input"
            type="text"
            id="price"
            step="any"
          />
          <span className="form-label-right">{network.currencySymbol}</span>
        </label>

        {/*fees calculate */}
        {SETTINGS.listingPriceActive === "true" && (
          <div className="form-img-upload__price-cal">
            <div>
              <span className="pra-one">{__("Listing fee", SLUG)}</span>
              {SETTINGS.listingType === "1" && (
                <span className="pra-one">
                  <b>
                    {nftPrice > 0 && listingWithPay()}
                    {nftPrice > 0 && network.currencySymbol}
                  </b>{" "}
                  {`${SETTINGS.listingPrice} %`}
                </span>
              )}
              {SETTINGS.listingType === "2" && (
                <span className="pra-one">
                  {`${SETTINGS.listingPrice}`} {network.currencySymbol}
                </span>
              )}
            </div>
            <div>
              <span className="pra-one">{__("You will receive", SLUG)}</span>
              <span className="pra-one">
                {!nftPrice && <b>-</b>}
                {nftPrice > 0 && listingFeesCalculate()}{" "}
                {nftPrice > 0 && network.currencySymbol}
              </span>
            </div>
          </div>
        )}

        {/* SplitPayment */}
        <SplitPaymentComponent
          web3Provider={web3Provider}
          metaData={metaData}
          setMetaData={setMetaData}
        />

        {/* Royality */}
        {SETTINGS.royalityActive === "true" && (
          <div className="form-img-upload__minting-option">
            <p className="header-two">{__("Royalties", SLUG)}</p>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (!e.target.checked) {
                    setRoyality(0);
                    setMetaData((prev) => ({ ...prev, royalties: 0 }));
                  }
                  setRoyalityActive(e.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
            <p className="pra-one ">
              {__("Earn a % on secondary sales.", SLUG)}
            </p>
          </div>
        )}

        {royalityActive && (
          <label
            className="form-img-upload__label header-two"
            htmlFor="royalties"
          >
            <input
              placeholder={__("Enter royalties %", SLUG)}
              onChange={(e) => {
                if (e.target.value === "") {
                  royalityCalculate(0);
                  return;
                }

                royalityCalculate(e.target.value);
              }}
              className="form-img-upload__input"
              type="text"
              id="royalties"
            />
            <p className="pra-one " style={{ marginTop: "10px" }}>
              {__("Suggested: 0%, 10%, 20%, 30%. Maximum is 50%", SLUG)}
            </p>
          </label>
        )}

        {/* Free Minting options */}
        {SETTINGS.nftpages?.create?.freeminting === "false" ? null : (
          <div className="form-img-upload__minting-option">
            <p className="header-two">{__("Free minting", SLUG)}</p>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => {
                  setIsFreeMinting(e.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
            <p className="pra-one">
              {__("Buyer will pay gas fees for minting", SLUG)}
            </p>
          </div>
        )}

        {/*================== Collection Sections ================== */}
        <div className="form-img-upload__collection">
          <p className="header-two">{__("Collection", SLUG)}</p>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) => {
                setCollectionFieldOpen(e.target.checked);
                setShowSuggetion(e.target.checked);
                if (!e.target.checked) {
                  setMetaData((prev) => ({ ...prev, collection: "" }));
                  setCollectionsSugetion(collections);
                }
              }}
            />
            <span className="slider round"></span>
          </label>
          <p className="pra-one">
            {__("Put this item into a collection", SLUG)}
          </p>
        </div>

        {isCollectionFieldOpen && (
          <div className="form-img-upload__collection-input-box">
            <input
              type="text"
              placeholder={__("Collection name...", SLUG)}
              value={metaData.collection}
              onChange={(e) => {
                const found = collections.filter((name) =>
                  name.toLowerCase().startsWith(e.target.value.toLowerCase())
                );
                setCollectionsSugetion(found);
                setMetaData((prev) => ({
                  ...prev,
                  collection: e.target.value,
                }));
                setShowSuggetion(true);
              }}
            />
            {collectionSugetions.length == 0 ? null : (
              <div className="form-img-upload__collection-suggesion">
                {collectionSugetions.map((cur) => (
                  <span
                    key={cur}
                    onClick={(e) => {
                      const value = e.target.innerText;
                      setMetaData((prev) => ({
                        ...prev,
                        collection: value,
                      }));
                      setCollectionsSugetion([]);
                      setShowSuggetion(false);
                    }}
                  >
                    {cur}
                  </span>
                ))}
              </div>
            )}

            {collectionSugetions.length == 0 && showSuggetion && (
              <div className="form-img-upload__collection-suggesion">
                <span>{__("No collection found.", SLUG)}</span>
              </div>
            )}
          </div>
        )}

        {/*================== Category Sections ================== */}
        <div className="form-img-upload__collection">
          <p className="header-two">{__("Category", SLUG)}</p>
          <label className="switch">
            <input
              type="checkbox"
              onChange={(e) => {
                setCategoryFieldOpen(e.target.checked);
                setShowCategorySuggetion(e.target.checked);
                if (!e.target.checked) {
                  setMetaData((prev) => ({ ...prev, category: "" }));
                  setCategorySugetion(categories);
                }
              }}
            />
            <span className="slider round"></span>
          </label>
          <p className="pra-one">{__("Put this item into a Category", SLUG)}</p>
        </div>

        {isCategoryFieldOpen && (
          <div className="form-img-upload__collection-input-box">
            <input
              type="text"
              placeholder={__("Category name...", SLUG)}
              value={metaData.category}
              onChange={(e) => {
                const found = categories.filter((name) =>
                  name.toLowerCase().startsWith(e.target.value.toLowerCase())
                );
                setCategorySugetion(found);
                setMetaData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
                setShowCategorySuggetion(true);
              }}
            />
            {categorySugetions.length == 0 ? null : (
              <div className="form-img-upload__collection-suggesion">
                {categorySugetions.map((cur) => (
                  <span
                    key={cur}
                    onClick={(e) => {
                      const value = e.target.innerText;
                      setMetaData((prev) => ({
                        ...prev,
                        category: value,
                      }));
                      setCategorySugetion([]);
                      setShowCategorySuggetion(false);
                    }}
                  >
                    {cur}
                  </span>
                ))}
              </div>
            )}

            {categorySugetions.length == 0 && showCategorySuggetion && (
              <div className="form-img-upload__collection-suggesion">
                <span>{__("No category found.", SLUG)}</span>
              </div>
            )}
          </div>
        )}

        {/*================== Unlockable Content Sections ================== */}
        {SETTINGS.nftpages?.create?.unlockable === "false" ? null : (
          <div className="form-img-upload__minting-option">
            <p className="header-two">{__("Unlockable Content", SLUG)}</p>
            <label className="switch">
              <input
                type="checkbox"
                onChange={(e) => {
                  setUnlockableContent(e.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
            <p className="pra-one">
              {__("Only who owns will be able to see it", SLUG)}
            </p>
          </div>
        )}

        {unlockableContent && (
          <label className="form-img-upload__label" htmlFor="des">
            <textarea
              placeholder={__(
                "Put text or a link in the unlockable content",
                SLUG
              )}
              onChange={(e) => {
                setMetaData((prev) => ({
                  ...prev,
                  unlockableContent: e.target.value,
                }));
              }}
              id="des"
              name="des"
              cols="30"
              rows="5"
            ></textarea>
          </label>
        )}

        {/*================== advancedOptions Content Sections ================== */}

        <div className="form-img-upload__advanced-option">
          {SETTINGS.nftpages?.create?.properties === "false" ? null : (
            <span
              className="toggle-btn"
              onClick={(e) => setAdvancedOption(!advancedOptions)}
            >
              {__("Show Advanced Option", SLUG)}
            </span>
          )}
          {/* Advanced Options */}
          {advancedOptions && (
            <>
              <span>
                <strong className="header-two">{__("Properties", SLUG)}</strong>
                <small>{__(" (Optional)", SLUG)}</small>
              </span>
              <div className="properties-list-container">
                {propertiesList.map((elem, i) => {
                  return (
                    <div className="properties-list-single" key={i}>
                      <input
                        placeholder={__("e.g: Size", SLUG)}
                        name="key"
                        value={elem.key}
                        onChange={(e) => handlePropertiesChanges(e, i)}
                      />
                      <input
                        placeholder={__("e.g: M", SLUG)}
                        name="value"
                        value={elem.value}
                        onChange={(e) => handlePropertiesChanges(e, i)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <button className="form-img-upload__submit">
          {__("Submit", SLUG)}
        </button>
      </form>

      <div className="form-img-upload__preview">
        <p className="form-img-upload__title header-two">
          {__("Preview", SLUG)}
        </p>
        <div className="form-img-upload__preview-section">
          {previewMediaUrl ? (
            <>
              {metaData.mediaType.startsWith("video") && (
                <div className="video-preview">
                  <video
                    className="card__img"
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                    src={previewMediaUrl}
                    alt="preview"
                  />
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
              {metaData.mediaType?.startsWith("audio") && (
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
                  {metaData.alternatePreview !== null && (
                    <img src={metaData.alternatePreview} />
                  )}
                </div>
              )}
              {metaData.mediaType?.startsWith("glb") && (
                <div className="audio-preview">
                  <span className="form-preview-icon">{__("3D", SLUG)}</span>
                  {metaData.alternatePreview !== null && (
                    <img src={metaData.alternatePreview} />
                  )}
                </div>
              )}
              {metaData.mediaType.startsWith("image") && (
                <img src={previewMediaUrl} alt="preview" />
              )}
            </>
          ) : (
            <span className="preview-skeleton"></span>
          )}
          {metaData?.name ? (
            <span className="nft-title">{metaData?.name}</span>
          ) : (
            <span className="title-skeleton"></span>
          )}
          {nftPrice ? (
            <span className="price-title">{__("Price", SLUG)}</span>
          ) : (
            <span className="price-skeleton"></span>
          )}
          {nftPrice ? (
            <span className="price">
              {nftPrice} {network.currencySymbol}
            </span>
          ) : (
            <span className="price-skeleton"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export { ImageUploadForm };

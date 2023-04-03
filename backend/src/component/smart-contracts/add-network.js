import React, { useState } from "react";
import { SLUG, BACKEND_AJAX_URL } from "../../../../common/store";
import { errorMessage } from "../../../../common/component/message/error";
import { successMessage } from "../../../../common/component/message/success";
const { __ } = wp.i18n;
const btnStyle = {
    padding: "5px",
    textAlign: "center",
};

const transferLoadingStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    justifyItems: "center",
    rowGap: "20px",
};
const AddNetworkBtn = () => {
  const [network, setNetwork] = useState({
    name: '',
    nickName: '',
    rpcUrls: [],
    chainId:'',
    blockUrl: '',
    currencySymbol:'',
    scanName: '',
    type: 'custom',
    icon:''
  });
  const processImage = (e) => {
    //sanitize the input
    const file = e.target.files[0];
    if (!file) throw new Error("no file is selected");
    console.log(file);
    if (file.size > 100000) {
      errorMessage(
        __("File is larger then 100kb. Please upload an image less then 100kb.", SLUG)
      );
      return;
    }
    if (!file.type.startsWith("image")) {
      errorMessage(__("Please upload an image file", SLUG));
      return;
    }
    //set the state
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
        console.log(fileReader.result)
        setNetwork({...network, icon: fileReader.result})
    });
  };
  const [isClicked, setIsClicked] = useState(false);
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const saveNetwork = async () => {
    try {
      if (!network.name) {
        errorMessage(__("Network name cant be empty.", SLUG));
        return;
      }
      if (!network.nickName) {
        errorMessage(__("Nickname cant be empty.", SLUG));
        return;
      }
      if (!network.rpcUrls.length) {
        errorMessage(__("RPC url cant be empty.", SLUG));
        return;
      }
      if (!network.chainId) {
        errorMessage(__("Chain id cant be empty.", SLUG));
        return;
      }
      if (!network.blockUrl) {
        errorMessage(__("Block URL cant be empty.", SLUG));
        return;
      }
      if (!network.currencySymbol) {
        errorMessage(__("Currency symbol cant be empty.", SLUG));
        return;
      }
      if (!network.scanName) {
        errorMessage(__("Scan name cant be empty.", SLUG));
        return;
      }
      console.log(network)
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          custom_network: network,
          action: "add_network",
        },
      });
      successMessage(__("Custom network saved", SLUG))
      setOpen(false)
      window.location.reload()
    } catch (err) {
      setOpen(false);
      setLoading(false);
      console.log(err);
      errorMessage(__("Category Creation Fail.", SLUG));
    }
  };

  return (
    <>
        <div className={`smart-nft-popup__container ${
            open ? "open" : ""
            }`}>
            <div className="smart-nft-popup__inner">
            <h2>
                <strong>{__("Add a network", SLUG)}</strong>
            </h2>
            <div className="popup-input-cols-two">
                <div className="popup-input-field">
                    <label className="popup-label">{__("Name", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: Polygon Mainnet")}
                        className="popup-input-text"
                        value={network.nickName}
                        onChange={(e) => {
                            setNetwork({...network, nickName: e.target.value});
                        }}
                    />
                </div>
                <div className="popup-input-field">
                    <label className="popup-label">{__("Network name", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: matic")}
                        className="popup-input-text"
                        value={network.name}
                        onChange={(e) => {
                            setNetwork({...network, name: e.target.value});
                        }}
                    />
                </div>
            </div>
            <div className="popup-input-field">
                <label className="popup-label">{__("RPC URL", SLUG)}</label>
                <input
                    type="text"
                    placeholder={__("e.g: https://polygon-rpc.com")}
                    className="popup-input-text"
                    value={network.rpcUrls[0]}
                    onChange={(e) => {
                        setNetwork({...network, rpcUrls: [e.target.value]});
                    }}
                />
            </div>

            <div className="popup-input-cols-two">
                <div className="popup-input-field">
                    <label className="popup-label">{__("Chain ID", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: 137")}
                        className="popup-input-text"
                        value={network.chainId}
                        onChange={(e) => {
                            setNetwork({...network, chainId: e.target.value});
                        }}
                    />
                </div>
                <div className="popup-input-field" style={{marginLeft: 'auto'}}>
                    <label className="popup-label">{__("Block URL", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: https://polygonscan.com/tx/")}
                        className="popup-input-text"
                        value={network.blockUrl}
                        onChange={(e) => {
                            setNetwork({...network, blockUrl: e.target.value});
                        }}
                    />
                </div>
                <div className="popup-input-field">
                    <label className="popup-label">{__("Currency Symbol", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: MATIC")}
                        className="popup-input-text"
                        value={network.currencySymbol}
                        onChange={(e) => {
                            setNetwork({...network, currencySymbol: e.target.value});
                        }}
                    />
                </div>
                <div className="popup-input-field" style={{marginLeft: 'auto'}}>
                    <label className="popup-label">{__("Scan name", SLUG)}</label>
                    <input
                        type="text"
                        placeholder={__("e.g: polygonscan")}
                        className="popup-input-text"
                        value={network.scanName}
                        onChange={(e) => {
                            setNetwork({...network, scanName: e.target.value});
                        }}
                    />
                </div>
            </div>
            <div className="popup-input-field">
                <label className="popup-label">{__("Logo/icon", SLUG)}</label>
                <label htmlFor="logo-img" className="logo-img">
                    <span className="logo-uploader">
                        <span className="logo-uploader__overlay">+</span>
                        <input
                            type="file"
                            accept="image/*"
                            id="logo-img"
                            onChange={(e) => processImage(e)}
                        />
                        {network.icon && <img src={network.icon} />}
                    </span>
                </label>
            </div>
            <div className="smart-nft-popup__btn-group">
                <button
                    style={btnStyle}
                    className="btn-confirm"
                    onClick={(e) => {
                        // setIsOpenTransferPopup(false);
                        setLoading(true);
                        saveNetwork();
                    }}
                >
                {__("Confirm", SLUG)}
                </button>
                <button
                    style={btnStyle}
                    className="btn-close"
                    onClick={(e) => {
                        setOpen(false);
                        setIsClicked(false);
                    }}
                >
                {__("Cancel", SLUG)}
                </button>
            </div>
            </div>
        </div>

        <button
            style={{margin: 0}}
        className="create-category__btn btn-main-black"
        disabled={isClicked}
        onClick={(e) => {
            setIsClicked(true);
            setOpen(true);
        }}
        >
        {__("Add Network", SLUG)}
        </button>
    </>
  );
};

export default AddNetworkBtn;

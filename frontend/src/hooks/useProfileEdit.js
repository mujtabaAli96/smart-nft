import { useState, useEffect } from "react";
import { errorMessage } from "../../../common/component/message/error";
import { successMessage } from "../../../common/component/message/success";
import { BACKEND_AJAX_URL, SLUG } from "../../../common/store";
const { __ } = wp.i18n;

const useProfileEdit = (accountHash) => {
  console.log(accountHash);
  const [profileImg, setProfileImg] = useState("");
  const [profileMimeType, setProfileMimeType] = useState("");
  const [bannerImg, setBannerImg] = useState("");
  const [bannerMimeType, setBannerMimeType] = useState("");
  const [data, setData] = useState({
    name: "",
    userName: "",
    shortBio: "",
    email: "",
    socialProfiles: [
      {
        name: "website",
        url: "",
      },
    ],
  });

  const saveProfile = async () => {
    if (!accountHash) throw new Error("No account is selected");
    try {
      const res = await jQuery.ajax({
        type: "post",
        url: BACKEND_AJAX_URL,
        data: {
          action: "save_profile",
          profile: {
            ...data,
            profileImg,
            profileMimeType,
            bannerImg,
            bannerMimeType,
          },
          account: accountHash,
        },
      });
      successMessage(__("Profile Saved successfully", SLUG));
      console.log(res);
    } catch (err) {
      errorMessage(
        __("There was an error saving profile. Please try again", SLUG)
      );
      console.error("profileSaveError: ", err);
    }
  };

  useEffect(() => {
    async function feachData() {
      if (!accountHash) return;
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "get_profile",
            account: accountHash,
            all: "",
          },
        });
        if (!res.data) {
          //set state
          setProfileImg("");
          setBannerImg("");
          setData({
            name: "",
            userName: "",
            shortBio: "",
            email: "",
            socialProfiles: [
              {
                name: "",
                url: "",
              },
            ],
          });
          return;
        }

        //set state
        setProfileImg(res.data.profileImg);
        setBannerImg(res.data.bannerImg);
        setData({
          name: res.data.name,
          userName: res.data.userName,
          shortBio: res.data.shortBio,
          email: res.data.email,
          socialProfiles: res.data.socialProfiles
            ? res.data.socialProfiles
            : data.socialProfiles,
        });
      } catch (err) {
        console.error("profileError: ", err);
      }
    }
    feachData();
  }, [accountHash]);

  return {
    bannerImg,
    setBannerImg,
    bannerMimeType,
    setBannerMimeType,
    profileImg,
    setProfileImg,
    profileMimeType,
    setProfileMimeType,
    data,
    setData,
    saveProfile,
  };
};

export { useProfileEdit };

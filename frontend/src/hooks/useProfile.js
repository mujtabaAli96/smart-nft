import { useState, useEffect } from "react";
import { BACKEND_AJAX_URL } from "../../../common/store";

const useProfile = (accountHash) => {
  const [profile, setProfile] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function feachData() {
      if (!accountHash) return;
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "get_profile",
            account: accountHash.toLowerCase(),
          },
        });

        setProfile({ ...res.data, accountHash });
        setLoading(false);
      } catch (err) {
        console.error("profileError: ", err);
      }
    }
    feachData();
  }, [accountHash]);

  return {
    ...profile,
    isLoading,
    accountHash,
  };
};

export default useProfile;

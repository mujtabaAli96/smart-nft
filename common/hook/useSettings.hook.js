import { useEffect, useState } from "react";
import { BACKEND_AJAX_URL } from "../store";

async function saveSettings(settings) {
  try {
    const res = await jQuery.ajax({
      type: "post",
      url: BACKEND_AJAX_URL,
      data: {
        settings,
        action: "smartnft_store_settings",
      },
    });

    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
}

const useSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: {
            action: "smartnft_get_settings",
          },
        });

        setLoading(false);
        setSettings(res.data);
      } catch (err) {
        console.log("settings error:-->", err);
      }
    }
    fetchData();
  }, []);

  return {
    saveSettings,
    loading,
    settings,
  };
};

export default useSettings;

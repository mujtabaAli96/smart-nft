import { useEffect, useState } from "react";
import { BACKEND_AJAX_URL } from "../store";

const useTopCollectorProvider = () => {
  const [loading, setLoading] = useState(true);
  const [topCollector, setTopCollector] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!loading) return;
        const res = await jQuery.ajax({
          type: "post",
          url: BACKEND_AJAX_URL,
          data: { action: "smartnft_get_top_collector" },
        });

        setLoading(false);
        setTopCollector(res.data.sort((a, b) => b.amount - a.amount));
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return {
    loading,
    topCollector,
  };
};

export default useTopCollectorProvider;

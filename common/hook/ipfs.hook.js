import { create } from "ipfs-http-client";
import { IPFSINFO, GATEWAY } from "../store";

const uploadIpfsUsingInfura = async (data) => {
  const client = create({
    host: IPFSINFO.url,
    port: IPFSINFO.port,
    protocol: "https",
    headers: {
      authorization: IPFSINFO.auth,
    },
  });

  try {
    const res = await client.add(data);
    console.log(res);
    return `${GATEWAY}${res.path}`;
  } catch (err) {
    console.log(err);
  }
};

const readIpfsUsingInfura = async (hash) => {
  try {
    const res = await fetch(`https://ola.infura-ipfs.io/ipfs/${hash}`);
    console.log(await res.json());
  } catch (err) {
    console.log(err);
  }
};

const useIPFSProvider = () => {
  return {
    uploadIpfsUsingInfura,
    readIpfsUsingInfura,
  };
};

export default useIPFSProvider;

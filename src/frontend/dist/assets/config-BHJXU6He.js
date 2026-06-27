import { I as createActor } from "./index-C0vAz2PO.js";
async function createActorWithConfig() {
  const actor = createActor("", async () => new Uint8Array(), async () => {
    return {
      _blob: null,
      directURL: "",
      getBytes: async () => new Uint8Array(),
      getDirectURL: () => "",
      withUploadProgress: () => ({ _blob: null, directURL: "", getBytes: async () => new Uint8Array(), getDirectURL: () => "", withUploadProgress: () => ({}) })
    };
  });
  return actor;
}
export {
  createActorWithConfig
};

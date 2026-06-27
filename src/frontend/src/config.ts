import { createActor } from "@/backend";

export async function createActorWithConfig() {
  const actor = createActor("", async () => new Uint8Array(), async () => {
    return {
      _blob: null,
      directURL: "",
      getBytes: async () => new Uint8Array(),
      getDirectURL: () => "",
      withUploadProgress: () => ({ _blob: null, directURL: "", getBytes: async () => new Uint8Array(), getDirectURL: () => "", withUploadProgress: () => ({}) as any }),
    } as any;
  });
  return actor as any;
}

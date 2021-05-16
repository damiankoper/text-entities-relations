import { ref } from "vue";

export function useDownloadLink() {
  const anchorElem = ref<HTMLAnchorElement | null>(null);

  const downloadBlob = (
    data: BlobPart,
    fileName: string,
    isTextFile = false
  ) => {
    if (anchorElem.value === null) throw new Error("Anchor element not found");
    const blob = new Blob([data], {
      type: isTextFile ? "text/plain" : "application/octet-stream"
    });
    const url = URL.createObjectURL(blob);
    anchorElem.value.href = url;
    anchorElem.value.download = fileName;
    anchorElem.value.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return {
    anchorElem,
    downloadBlob
  };
}

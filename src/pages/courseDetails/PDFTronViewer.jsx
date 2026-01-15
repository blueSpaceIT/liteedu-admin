/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import WebViewer from "@pdftron/webviewer";

export default function PDFTronViewer({ fileUrl, setInstance }) {
  const viewerDiv = useRef(null);
  const instanceRef = useRef(null);
  const viewerInitialized = useRef(false);

  useEffect(() => {
    if (viewerInitialized.current || !viewerDiv.current) return;

    viewerInitialized.current = true;

    WebViewer(
      {
        path: "/public/webviewer/public",
        initialDoc: fileUrl || null,
      },
      viewerDiv.current
    ).then((instance) => {
      instanceRef.current = instance; // full WebViewer instance
      if (setInstance) setInstance(instance);

      const { docViewer, annotationManager } = instance;

      docViewer?.on("documentLoaded", () => {
        annotationManager?.addEventListener("annotationChanged", async () => {
          try {
            const doc = docViewer.getDocument();
            const data = await doc.getFileData({});

            const pdfFile = new File([data], "marked_auto.pdf", { type: "application/pdf" });

            const a = document.createElement("a");
            a.href = URL.createObjectURL(pdfFile);
            a.download = pdfFile.name;
            a.click();
            URL.revokeObjectURL(a.href);
          } catch (err) {
            console.error("Auto save failed:", err);
          }
        });
      });
    });
  }, []);

  // Update PDF when fileUrl changes
  useEffect(() => {
    if (!instanceRef.current || !fileUrl) return;

    // Correct way to load a new document
    instanceRef.current.loadDocument(fileUrl).catch((err) => {
      console.error("Failed to load document:", err);
    });
  }, [fileUrl]);

  return (
    <div
      ref={viewerDiv}
      style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
    />
  );
}

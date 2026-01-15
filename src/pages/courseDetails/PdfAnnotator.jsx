/* eslint-disable react/prop-types */
import  { useEffect, useRef } from "react";
import PDFJS from "pdfjs-dist";
import * as PDFJSAnnotate from "pdf-annotate.js";
import "pdf-annotate.js/dist/pdf-annotate.css";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

export default function PdfAnnotator({ fileUrl }) {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!fileUrl) return;

    // Clear old content
    viewerRef.current.innerHTML = "";

    // Render PDF
    const renderPDF = async () => {
      const loadingTask = PDFJS.getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const pageContainer = document.createElement("div");
        pageContainer.className = "pdf-page-container";
        viewerRef.current.appendChild(pageContainer);

        const canvas = document.createElement("canvas");
        pageContainer.appendChild(canvas);

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        // Annotation Layer
        PDFJSAnnotate.renderPage(i, pageContainer, viewport.scale);
      }
    };

    renderPDF();
  }, [fileUrl]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex gap-2 p-2 bg-gray-100 border-b">
        <button
          onClick={() => PDFJSAnnotate.UI.enablePen()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => PDFJSAnnotate.UI.enableRectangle()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          ⬛ Rectangle
        </button>
        <button
          onClick={() => PDFJSAnnotate.UI.enableText()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          🔤 Text
        </button>
        <button
          onClick={() => PDFJSAnnotate.UI.enableArrow()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          ➡️ Arrow
        </button>
        <button
          onClick={() => PDFJSAnnotate.UI.enablePoint()}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          📍 Point
        </button>
      </div>

      {/* PDF Viewer */}
      <div
        ref={viewerRef}
        className="pdf-viewer overflow-auto h-[80vh] p-4 bg-gray-50"
      ></div>
    </div>
  );
}

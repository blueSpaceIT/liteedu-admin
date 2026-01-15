/* eslint-disable react/prop-types */
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useGetAllModuleQuery } from "../../../redux/features/api/module/module";

export default function PrintMcq({ mcqs, courseId, moduleSlug }) {
    const { data: modulesData } = useGetAllModuleQuery({ courseId });

    const downloadPDF = async () => {
        // Get latest moduleTitle dynamically
        const module = modulesData?.data?.find((m) => m.slug === moduleSlug);
        const moduleTitle = module?.moduleTitle || "Module";

        // Safe ID & filename
        const containerId = moduleTitle
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

        const fileName = moduleTitle.replace(/\s+/g, "_").replace(/[^\w_]/g, "");

        // Remove existing container if present
        const existingContainer = document.getElementById(containerId);
        if (existingContainer) document.body.removeChild(existingContainer);

        // Create container
        const container = document.createElement("div");
        container.id = containerId;
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "800px";
        container.style.backgroundColor = "#fff";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.fontSize = "14px";
        container.style.color = "#000";
        container.style.lineHeight = "1.5";
        container.style.boxSizing = "border-box";
        document.body.appendChild(container);

        const questionsPerPage = 8;
        const totalPages = Math.ceil(mcqs.length / questionsPerPage);

        for (let page = 0; page < totalPages; page++) {
            const pageWrapper = document.createElement("div");
            pageWrapper.style.backgroundColor = "#fff";
            pageWrapper.style.minHeight = "297mm";
            pageWrapper.style.boxSizing = "border-box";
            pageWrapper.style.padding = page === 0 ? "10px 20px" : "40px 20px"; // first page top margin decreased

            if (page === 0) {
                // Header
                const header = document.createElement("div");
                header.style.textAlign = "center";
                header.style.marginTop = "20px";
                header.style.marginBottom = "5px";
                header.innerHTML = `<h1 style="font-size: 2rem; font-weight: bold; margin: 0;">MCQ Exam</h1>`;
                pageWrapper.appendChild(header);

                // Module Title
                const moduleDiv = document.createElement("div");
                moduleDiv.style.textAlign = "center";
                moduleDiv.style.fontSize = "1.25rem";
                moduleDiv.style.fontWeight = "500";
                moduleDiv.style.marginBottom = "15px";
                moduleDiv.textContent = moduleTitle;
                pageWrapper.appendChild(moduleDiv);

                // Top-left Medicophile
                const medicophile = document.createElement("div");
                medicophile.style.position = "absolute";
                medicophile.style.top = "20px";
                medicophile.style.left = "20px";
                medicophile.style.fontSize = "1.5rem";
                medicophile.style.fontWeight = "bold";
                medicophile.textContent = "Medicophile";
                pageWrapper.appendChild(medicophile);

                // Time & Marks (column)
                const infoDiv = document.createElement("div");
                infoDiv.style.display = "flex";
                infoDiv.style.flexDirection = "column"; // Full Marks below Time
                infoDiv.style.alignItems = "flex-start";
                infoDiv.style.marginBottom = "20px";

                const timeP = document.createElement("p");
                timeP.textContent = `Time: 5 Minutes`;
                timeP.style.margin = "0 0 6px 0";
                infoDiv.appendChild(timeP);

                const marksP = document.createElement("p");
                marksP.textContent = `Full Marks: ${mcqs?.length || 0}`;
                marksP.style.margin = "0";
                infoDiv.appendChild(marksP);

                pageWrapper.appendChild(infoDiv);
            }

            // Questions Grid
            const grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "repeat(2, 1fr)";
            grid.style.gap = "20px";

            const start = page * questionsPerPage;
            const end = Math.min(start + questionsPerPage, mcqs.length);
            const pageQuestions = mcqs.slice(start, end);

            pageQuestions.forEach((q, index) => {
                const qDiv = document.createElement("div");
                qDiv.style.border = "1px solid #ccc";
                qDiv.style.padding = "15px";
                qDiv.style.borderRadius = "5px";
                qDiv.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                qDiv.style.backgroundColor = "#fff";

                const question = document.createElement("p");
                question.style.fontWeight = "bold";
                question.style.marginBottom = "10px";
                question.textContent = `${start + index + 1}. ${q.question}`;
                qDiv.appendChild(question);

                if (q.questionImg) {
                    const img = document.createElement("img");
                    img.src = q.questionImg;
                    img.style.maxHeight = "120px";
                    img.style.display = "block";
                    img.style.margin = "5px 0";
                    qDiv.appendChild(img);
                }

                q.options?.forEach((opt) => {
                    const optDiv = document.createElement("div");
                    optDiv.style.display = "flex";
                    optDiv.style.alignItems = "center";
                    optDiv.style.gap = "8px";
                    optDiv.style.marginBottom = "8px";

                    const circle = document.createElement("span");
                    circle.style.display = "inline-flex";
                    circle.style.alignItems = "center";
                    circle.style.justifyContent = "center";
                    circle.style.width = "14px";
                    circle.style.height = "14px";
                    circle.style.marginTop = "15px";
                    circle.style.border = "1px solid #777";
                    circle.style.borderRadius = "50%";
                    circle.style.flexShrink = "0";
                    optDiv.appendChild(circle);

                    const optText = document.createElement("span");
                    optText.textContent = opt;
                    optDiv.appendChild(optText);

                    qDiv.appendChild(optDiv);
                });

                grid.appendChild(qDiv);
            });

            pageWrapper.appendChild(grid);
            container.appendChild(pageWrapper);
        }

        const canvas = await html2canvas(container, { scale: 2, backgroundColor: "#fff" });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`${fileName || "mcqs"}.pdf`);
        document.body.removeChild(container);
    };

    return (
        <button
            onClick={downloadPDF}
            className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
        >
            Print MCQ
        </button>
    );
}

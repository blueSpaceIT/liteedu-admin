import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import PDFTronViewer from "./PDFTronViewer";
import { useGetCqAttempQueryQuery } from "../../redux/features/api/cqAttemp/cqAttemp";
import {
  useCreateCqMarkingMutation,
  useUpdateCqMarkingMutation,
  useDeleteCqMarkingMutation,
  useGetCqMarkingsQuery
} from "../../redux/features/api/cqMarking/cqMarking";
import { useUploadPdfMutation } from "../../redux/features/api/upload/uploadApi";
import useFormSubmit from "../../hooks/useFormSubmit";

export default function AttemptDetailsPage() {
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get("attemptId");
  const { handleSubmitForm } = useFormSubmit();
  const navigate = useNavigate();

  // Fetch attempts
  const { data: cqAttempData, isLoading: isFetchingAttempt } = useGetCqAttempQueryQuery({ page: 1, limit: 100 });
  // Fetch markings
  const { data: cqMarkingData, isLoading: isFetchingMarking } = useGetCqMarkingsQuery({ page: 1, limit: 100 });

  const allCqAttemps = useMemo(() => cqAttempData?.data || [], [cqAttempData]);
  const allCqMarkings = useMemo(() => cqMarkingData?.data || [], [cqMarkingData]);

  const selectedAttempt = useMemo(
    () => allCqAttemps.find((item) => item?._id === attemptId),
    [allCqAttemps, attemptId]
  );

  const existingMarking = useMemo(() => {
    return allCqMarkings.find(
      (mark) =>
        mark.studentId?._id === selectedAttempt?.studentId._id &&
        mark.examId?._id === selectedAttempt?.examId._id &&
        mark.questionId?._id === selectedAttempt?.questionId._id
    );
  }, [allCqMarkings, selectedAttempt]);

  const [pdfInstance, setPdfInstance] = useState(null);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Sync PDF, score, comment when marking or attempt data changes
  useEffect(() => {
    if (existingMarking) {
      setPdfUrl(existingMarking.pdf);
      setScore(existingMarking.score ?? 0);
      setComment(existingMarking.comment ?? "");
    } else if (selectedAttempt?.submitedPdf) {
      setPdfUrl(selectedAttempt.submitedPdf);
      setScore(0);
      setComment("");
    } else {
      setPdfUrl(null);
      setScore(0);
      setComment("");
    }
  }, [existingMarking, selectedAttempt]);

  const [createCqMarking, { isLoading: isCreating, isSuccess: createSuccess, isError: createError }] = useCreateCqMarkingMutation();
  const [updateCqMarking, { isLoading: isUpdating, isSuccess: updateSuccess, isError: updateError }] = useUpdateCqMarkingMutation();
  const [deleteCqMarking, { isLoading: isDeleting, isSuccess: deleteSuccess, isError: deleteError }] = useDeleteCqMarkingMutation();
  const [uploadPdf, { isLoading: isUploading }] = useUploadPdfMutation();

  const isSaving = isCreating || isUpdating || isUploading;

  // Show success/error toast
  useEffect(() => {
    if (createSuccess) {
      toast.success("Marked PDF saved successfully!");
      navigate(-1);
    }
    if (updateSuccess) {
      toast.success("Marked PDF updated successfully!");
      navigate(-1);
    }
    if (deleteSuccess) {
      toast.success("Marked PDF deleted successfully!");
    }
    if (createError || updateError || deleteError) {
      toast.error("Operation failed!");
    }
  }, [createSuccess, updateSuccess, deleteSuccess, createError, updateError, deleteError, navigate]);

  if (isFetchingAttempt || isFetchingMarking)
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading attempt...</div>;
  if (!selectedAttempt)
    return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Attempt not found</div>;

  const handleSave = async () => {
    if (!pdfInstance) return alert("PDF is not ready yet!");

    try {
      const doc = pdfInstance.Core.documentViewer.getDocument();
      const data = await doc.getFileData({});
      const pdfFile = new File([data], "marked.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const uploadRes = await uploadPdf(formData).unwrap();
      const secure_url = uploadRes?.data?.secure_url;

      const payload = {
        studentId: selectedAttempt.studentId._id,
        examId: selectedAttempt.examId._id,
        questionId: selectedAttempt.questionId._id,
        pdf: secure_url,
        score,
        comment,
      };

      if (existingMarking) {
        await handleSubmitForm({ apiCall: updateCqMarking, data: { ...payload, _id: existingMarking._id } });
      } else {
        await handleSubmitForm({ apiCall: createCqMarking, data: payload });
      }

      setPdfUrl(secure_url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save marked PDF.");
    }
  };

  const handleDelete = async () => {
    if (!existingMarking) return;
    if (!confirm("Are you sure you want to delete this marking?")) return;

    try {
      await handleSubmitForm({ apiCall: deleteCqMarking, data: { _id: existingMarking._id } });
      setScore(0);
      setComment("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete marking.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h3 className="text-2xl font-semibold mb-6">Attempt Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Student:</label>
          <input
            type="text"
            value={selectedAttempt.studentId?.name || ""}
            disabled
            className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Exam:</label>
          <input
            type="text"
            value={selectedAttempt.examId?.examTitle || ""}
            disabled
            className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium">Question:</label>
        <textarea
          value={selectedAttempt.questionId?.question || ""}
          disabled
          rows={2}
          className="w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium">Score:</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <h4 className="text-lg font-semibold mb-2">PDF:</h4>
      <div className="mb-6 border rounded-md">
        {pdfUrl ? (
          <PDFTronViewer fileUrl={pdfUrl} setInstance={setPdfInstance} />
        ) : (
          <p className="p-4 text-gray-500">No PDF available</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md text-white font-semibold ${
            isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : existingMarking ? "Update Marking" : "Save Marking"}
        </button>

        {existingMarking && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-6 py-2 rounded-md text-white font-semibold ${
              isDeleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete Marking"}
          </button>
        )}
      </div>
    </div>
  );
}

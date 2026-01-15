/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import GenericModal from "./genericModal";
import { toast } from "react-toastify";
import { useCreateManualMcqMutation } from "../../../redux/features/api/examMcq/examMcq";
import useFormSubmit from "../../../hooks/useFormSubmit";
import { useGetAllMcqCategoryQuery } from "../../../redux/features/api/mcqCategory/mcqCategory"; // <-- API hook

export default function AddManualMCQModal({ isOpen, onClose, examId }) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [category, setCategory] = useState(""); // <-- selected category id

    const [createManualMcq, { isLoading }] = useCreateManualMcqMutation();
    const { handleSubmitForm } = useFormSubmit();

    // fetch categories for dropdown
    const { data: catData, isLoading: categoriesLoading, isError: categoriesError } = useGetAllMcqCategoryQuery();
    const categories = useMemo(() => catData?.data || [], [catData]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

   // ... উপরের import ও hook একই থাকবে

const handleSubmit = () => {
  // 1) ensure category selected
  if (!category) {
    toast.warning("Please select a category.");
    return;
  }

  // 2) simple field validation
  if (!question || options.some((opt) => !opt) || !correctAnswer) {
    toast.warning("Please fill all fields correctly.");
    return;
  }

  // 3) build payload - send category as ID (most common)
  const payload = {
    examId,
    category,
    question,
    options,
    correctAnswer,
  };

  // 4) debug log before sending (open Browser DevTools -> Console)
  console.log("Submitting manual MCQ payload:", payload);

  handleSubmitForm({
    apiCall: createManualMcq,
    data: payload,
    onSuccess: () => {
      onClose(true);
    },
    onError: (err) => {
      // optional: log server error for debugging
      console.error("createManualMcq error:", err);
      toast.error("Failed to create question. See console for details.");
    },
  });

  // 5) reset fields
  setQuestion("");
  setOptions(["", "", "", ""]);
  setCorrectAnswer("");
  setCategory("");
};


    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Manual MCQ"
            onSubmit={handleSubmit}
            submitButtonProps={{
                disabled: isLoading,
                children: isLoading ? "Submitting..." : "Submit",
                className:
                    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
            }}
        >
            <div className="flex flex-col gap-6">
                {/* Category select */}
                <label className="flex flex-col gap-2 text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Category</span>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    >
                        <option value="">-- Select Category --</option>
                        {categoriesLoading ? (
                            <option value="">Loading...</option>
                        ) : categoriesError ? (
                            <option value="">Failed to load categories</option>
                        ) : (
                            categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.title}
                                </option>
                            ))
                        )}
                    </select>
                </label>

                {/* Question */}
                <label className="flex flex-col gap-2 text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Question</span>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question here"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    />
                </label>

                {/* Options */}
                <div className="flex flex-col gap-4">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Options</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {options.map((opt, idx) => (
                            <input
                                key={idx}
                                type="text"
                                placeholder={`Option ${idx + 1}`}
                                value={opt}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                            />
                        ))}
                    </div>
                </div>

                {/* Correct Answer */}
                <label className="flex flex-col gap-2 text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Correct Answer</span>
                    <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    >
                        <option value="">Select Correct Answer</option>
                        {options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                                {opt || `Option ${idx + 1}`}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </GenericModal>
    );
}

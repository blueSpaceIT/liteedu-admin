import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetCqsQuery, useUpdateCqMutation } from "../../../redux/features/api/cq/cq";
import useFormSubmit from "../../../hooks/useFormSubmit";

export default function EditCQForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cqId = searchParams.get("_id");
  const examId = searchParams.get("examId");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("Drafted");
  const { data, isLoading } = useGetCqsQuery(cqId);
  const cqs = useMemo(() => (data?.data ? data?.data : []), [data]);
  const cq = cqs?.find((m) => m?._id === cqId);
  const [editCq, { isLoading: cqLoading }] = useUpdateCqMutation();
  const { handleSubmitForm } = useFormSubmit();

  useEffect(() => {
    if (cq) {
      setQuestion(cq?.question || "");
      setStatus(cq?.status || "Drafted");
    }
  }, [cq]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { _id: cqId, examId, question, status };
    await handleSubmitForm({ apiCall: editCq, data: payload });
    toast.success("Creative Question updated successfully!");
    navigate(-1);
  };

  if (isLoading || cqLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-full">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/90 to-primary p-6 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 w-10 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left h-4 w-4"
                >
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
                Edit Creative Question
              </h1>
            </div>
          </div>
        </div>

        <div className="card mt-6 p-6 bg-white dark:bg-gray-900 text-slate-900 dark:text-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="question"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Write question..."
                className="w-full min-h-[100px] p-2 border rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="Published">Published</option>
                <option value="Drafted">Drafted</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background dark:bg-gray-700 hover:bg-accent hover:text-accent-foreground px-4 py-2 h-10 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 h-10 text-sm font-medium"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

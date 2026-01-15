/* eslint-disable react/prop-types */
import { ActionButtons } from "./actionButtons";

export const QuestionRow = ({ question, editLink }) =>{
  return  (
  <tr className="border-b transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
    <td className="p-4 font-medium">
      <a href={editLink} className="hover:underline">
        {question?.question}
      </a>
    </td>
    <td className="p-4">{question.examId?.cqMark}</td>
    <td className="p-4 text-right">
      <ActionButtons editLink={editLink}  question={question}/>
    </td>
  </tr>
);

}
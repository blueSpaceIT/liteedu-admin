/* eslint-disable react/prop-types */
import { useMemo } from "react";
import { useGetAllNoteQuery } from "../../../redux/features/api/note/note";
import NotesCard from "./notesCard";

const Note = ({ moduleId }) => {
    const { data: notesData, isLoading } = useGetAllNoteQuery();

    const notes = useMemo(() => notesData?.data || [], [notesData]);
    const allNotes = useMemo(() => notes.filter((note) => note?.moduleId?._id === moduleId?._id), [notes, moduleId]);

    return (
        <NotesCard
            moduleId={moduleId?._id}
            courseId={moduleId?.courseId?._id}
            notes={allNotes}
            isLoading={isLoading}
        />
    );
};

export default Note;

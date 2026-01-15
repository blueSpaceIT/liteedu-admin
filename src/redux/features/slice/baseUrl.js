import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { userLoggedIn, userLoggedOut } from "../Api/Auth/AuthSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        console.log("getState", getState);
        const token = localStorage.getItem("accessToken");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions);
        if (refreshResult?.data?.accessToken) {
            const newAccessToken = refreshResult.data.accessToken;
            const decoded = jwtDecode(newAccessToken);
            api.dispatch(userLoggedIn({ ...decoded, token: newAccessToken }));
            localStorage.setItem("accessToken", newAccessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(userLoggedOut());
            localStorage.removeItem("accessToken");
        }
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User",
        "Batch",
        "SubCategory",
        "Auth",
        "CourseCategory",
        "ExamMcq",
        "CourseDetails",
        "User",
        "Module",
        "LiveClass",
        "Admin",
        "Student",
        "Teacher",
        "Segment",
        "Subscription",
        "Course",
        "Lesson",
        "Assignment",
        "Submission",
        "Grade",
        "Attendance",
        "Schedule",
        "Notice",
        "Discussion",
        "Category",
        "Exam",
        "Comment",
        "Quiz",
        "Question",
        "Enrollment",
        "ModuleDetails",
        "Lecture",
        "Note",
        "CQ",
        "CQMarking",
        "CQAttemp",
        "Certificate",
    ],
    endpoints: () => ({}),
});

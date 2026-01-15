import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../routes/dashboard/page";
import Purchase from "../pages/purchase/purchase";
import User from "../pages/user/user";
import Students from "../pages/students/students";
import Teachers from "../pages/teachers/teachers";
import Course from "../pages/course/course";
import Mcq from "../pages/mcq/mcq";
import Login from "../pages/auth/login";
import Layout from "./layout";
import CourseCategoryPage from "../pages/courseCategory/courseCategory";
import CourseDetails from "../components/courseDetails/courseDetails";
import EditCourseModule from "../components/courseDetails/module/editCourseModule";
import CreateCourseModule from "../components/courseDetails/module/createCourseModule";
import CreateLiveClass from "../components/courseDetails/liveClass/createLiveClass";
import EditLiveClass from "../components/courseDetails/liveClass/editLiveClass";
import ModuleDetails from "../components/courseDetails/moduleDetails/moduleDetails";
import CreateLectureForm from "../components/courseDetails/lecture/lectureCreateFrom";
import LectureEditFrom from "../components/courseDetails/lecture/lectureEditFrom";
import CreateExam from "../components/courseDetails/exam/createExam";
import EditExam from "../components/courseDetails/exam/updateExam";
import NoteForm from "../components/courseDetails/note/createNote";
import EditNote from "../components/courseDetails/note/editNote";
import ExamMcq from "../components/courseDetails/mcq/mcq";
import AllMcqList from "../components/courseDetails/mcq/allMcqList";
import AddMCQBySerail from "../components/courseDetails/mcq/addMcqBySerail";
import BookCategory from "../pages/book/bookCategory";
import Book from "../pages/book/book";
import Blog from "../pages/blog/blog";
import CQ from "../components/courseDetails/cq/cq";
import CreateCQForm from "../components/courseDetails/cq/cqCreateFrom";
import EditCQForm from "../components/courseDetails/cq/editCqFrom";
import ExamStudentsTable from "../components/courseDetails/cqMarking/cqMarking";
import AttemptDetailsPage from "../pages/courseDetails/AttemptDetailsPage";
import Admins from "../pages/admins/admins";
import BlogCategory from "../pages/blog/blogCategory";
import UpdateCourseDetails from "../components/courseDetails/updateCourseDetails/updateCourseDetails";
import Order from "../pages/order/order";
import McqCategory from "../pages/mcqCategory/mcqCategory";
import NewEnrollment from "../pages/newEntrollment/newEnrollment";
import PrivateRoute from "../pages/auth/PrivateRoute/PrivateRoute";
import Coupons from "../pages/coupons/coupons";
import Notification from "../pages/notification";
import HeadingOffer from "../pages/heading-offer/headingOffer";
import NewBatch from "../pages/new-batch/new-batch";
import CustomSection from "../pages/custom-section/custom-section";
import CreateCourseDetailsModal from "../pages/courseDetails/CreateCourseDetails";
import AddSubcategory from "../pages/SubCategory/AddSubcategory";
import OfflineEnrollmentAdminPage from "../pages/OfflineEnrollmentAdminPage/OfflineEnrollmentAdminPage";
import Banner from "../pages/banner/banner";
import AccountsManage from "../pages/accountsManage";
import Notice from "../pages/notice/Notice";
import Batch from "../pages/OfflineEnrollmentAdminPage/bacth/Bacth";
import ClassManagement from "../pages/OfflineEnrollmentAdminPage/class/Class";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: (
            <PrivateRoute>
                <Layout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "purchase",
                element: <Purchase />,
            },
            {
                path: "new-enrollment",
                element: <NewEnrollment />,
            },
            {
                path: "reports",
                element: <h1 className="title">Reports</h1>,
            },
            {
                path: "users",
                element: <User />,
            },
            {
                path: "students",
                element: <Students />,
            },
            {
                path: "verified-customers",
                element: <Admins />,
            },
            {
                path: "accounts-manage",
                element: <AccountsManage />,
            },
            {
                path: "teacher",
                element: <Teachers />,
            },
            {
                path: "products",
                element: <h1 className="title">Products</h1>,
            },

            {
                path: "book-category",
                element: <BookCategory />,
            },
            {
                path: "book",
                element: <Book />,
            },
            {
                path: "banner",
                element: <Banner />,
            },
            // todo
            {
                path: "blog-category",
                element: <BlogCategory />,
            },
            {
                path: "blog",
                element: <Blog />,
            },
            {
                path: "notification",
                element: <Notification />,
            },
            {
                path: "heading-offer",
                element: <HeadingOffer />,
            },
            {
                path: "notice",
                element: <Notice />,
            },
            {   
                path:"batchs",
                element:<Batch/>

            },
            {   
                path:"classes",
                element:<ClassManagement/>

            },
            //
            {
                path: "settings",
                element: <h1 className="title">Settings</h1>,
            },
            {
                path: "custom-section",
                element: <CustomSection />,
            },

            {
                path: "course-category",
                element: <CourseCategoryPage />,
            },
            {
                path: "course",
                element: <Course />,
            },
            {
                path: "new-batch",
                element: <NewBatch />,
            },
            {
                path: "course/:slug",
                element: <CourseDetails />,
            },
            {
                path: "admin/course/edit-module/:slug",
                element: <EditCourseModule />,
            },
            {
                path: "admin/course/create-module",
                element: <CreateCourseModule />,
            },
            {
                path: "admin/course/create-live-class",
                element: <CreateLiveClass />,
            },
            {
                path: "/admin/course/edit-live-class",
                element: <EditLiveClass />,
            },
            {
                path: "/admin/course/module/:slug",
                element: <ModuleDetails />,
            },
            {
                path: "/admin/course/create-lecture",
                element: <CreateLectureForm />,
            },
            {
                path: "/admin/course/edit-lecture",
                element: <LectureEditFrom />,
            },
            {
                path: "/admin/course/create-exam",
                element: <CreateExam />,
            },
            {
                path: "/admin/course/edit-exam",
                element: <EditExam />,
            },
            {
                path: "/admin/course/create-note",
                element: <NoteForm />,
            },
            {
                path: "/admin/course/edit-note",
                element: <EditNote />,
            },
            {
                path: "/admin/course/exam-mcq/:id",
                element: <ExamMcq />,
            },
            {
                path: "/admin/course/exam/create-mcq/:id",
                element: <AllMcqList />,
            },
            {
                path: "/admin/course/exam/create-mcq-by-serail/:id",
                element: <AddMCQBySerail />,
            },
            {
                path: "/admin/course/exam-cq/:id",
                element: <CQ />,
            },
            {
                path: "/admin/course/course-details/create-course-details/:slug",
                element: <CreateCourseDetailsModal />,
            },
            {
                path: "/admin/course/course-details/:slug",
                element: <UpdateCourseDetails />,
            },
            {
                path: "/admin/course/create-cq",
                element: <CreateCQForm />,
            },
            {
                path: "/admin/course/edit-cq",
                element: <EditCQForm />,
            },
            {
                path: "/admin/course/exam-students",
                element: <ExamStudentsTable />,
            },
            {
                path: "/admin/course/exam/cq-marking",
                element: <AttemptDetailsPage />,
            },
            {
                path: "/mcq-category",
                element: <McqCategory />,
            },
            {
                path: "/mcq-create",
                element: <Mcq />,
            },
            {
                path: "order-mange",
                element: <Order />,
            },
            {
                path: "coupon-manage",
                element: <Coupons />,
            },
            {
                path: "course-sub-category",
                element: <AddSubcategory />,
            },
            {
                path: "offline-student-mangement",
                element: <OfflineEnrollmentAdminPage />,
            },
        ],
    },
]);

export default router;

/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import {
    GraduationCap,
    Users,
    BookOpen,
    ShoppingCart,
    Newspaper,
    Bell,
    Book,
    FolderTree,
    CreditCard,
    GitBranch,
    UserPlus,
    UserCheck,
    CalendarPlus,
    FileText,
    NotebookText,
    Database,
    Globe,
    PiggyBank,
    
} from "lucide-react";

// ---------- Tile Component (Pure Black & White Minimal) ----------
const Tile = ({ to, icon: Icon, label }) => {
    return (
        <Link
            to={to}
            className="
                group flex flex-col items-center justify-center
                rounded-xl border border-gray-300 dark:border-gray-700
                bg-white dark:bg-black
                p-6 text-center shadow-sm 
                transition-all duration-200 
                hover:shadow-lg hover:-translate-y-1
                text-gray-900 dark:text-gray-100
            "
        >
            <div
                className="
                    mb-4 flex   items-center justify-center
                 
                   
                    transition-all duration-200
                    group-hover:scale-105 
                "
            >
                <Icon className="h-8 w-8 text-gray-800 dark:text-gray-200" />
            </div>

            <span className="text-xl font-semibold tracking-wide">
                {label}
            </span>
        </Link>
    );
};

// ---------- Dashboard Page ----------
export default function DashboardPage() {
    const tiles = [
        { label: "Students", to: "/students", icon: GraduationCap },
        { label: "Teachers", to: "/teacher", icon: Users },
        { label: "Admins", to: "/verified-customers", icon: UserCheck },
        { label: "New Enroll", to: "/new-enrollment", icon: CalendarPlus },
        { label: "Offline Enrollment", to: "/offline-student-mangement", icon: UserPlus },
        { label: "Course Category", to: "/course-category", icon: FolderTree },
        { label: "Course Subcategory", to: "/course-sub-category", icon: GitBranch },
        { label: "Courses", to: "/course", icon: BookOpen },
        { label: "Purchase", to: "/purchase", icon: CreditCard },
        { label: "Blog Category", to: "/blog-category", icon: FileText },
        { label: "Blog", to: "/blog", icon: Newspaper },
        { label: "Book Category", to: "/book-category", icon: NotebookText },
        { label: "Books", to: "/book", icon: Book },
        { label: "Orders", to: "/order-mange", icon: ShoppingCart },
        // { label: "MCQ Category", to: "/mcq-category", icon: ListChecks },
        { label: "MCQ Question Bank", to: "/mcq-create", icon: Database },
        { label: "CQ Question Bank", to: "/mcq-create", icon: Database },
        { label: "Fill in the Gaps Question Bank", to: "/mcq-create", icon: Database },
        { label: "Banner", to: "/banner", icon: Globe },
        { label: "Accounts Manage", to: "/accounts-manage", icon: PiggyBank },
        { label: "Notice", to: "/notice", icon: Bell },
        // { label: "Refer & Earn ", to: "/refer", icon: BsCash },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-black p-6 md:p-10">
            <div className="
                grid grid-cols-2 gap-4 
                sm:grid-cols-3 
                md:grid-cols-4 
                lg:grid-cols-5 
                xl:grid-cols-6 
                2xl:grid-cols-7
            ">
                {tiles.map((t) => (
                    <Tile key={t.label} {...t} />
                ))}
            </div>
        </div>
    );
}

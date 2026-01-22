import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/features/api/auth/authApi";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../redux/features/api/auth/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loginHandler, { isLoading }] = useLoginMutation();

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phone || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const response = await loginHandler(formData).unwrap();

            if (response?.data?.accessToken && response?.data?.user) {
                const { accessToken, user } = response.data;

                // Save in Redux
                dispatch(userLoggedIn({ token: accessToken, user }));

                // Save in localStorage
                localStorage.setItem("accessToken", accessToken);

                toast.success(response.message || "Login successful");

                // Redirect to dashboard/home
                navigate("/");
            } else {
                toast.error("Invalid credentials");
            }
        } catch (err) {
            const errorMessage = err?.data?.message || "Something went wrong during login.";
            toast.error(errorMessage);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md rounded bg-white p-6 shadow-md dark:bg-gray-800">
                <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">Login</h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* phone */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Phone *</label>
                        <input
                            type="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your phone"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="submit"
                            className="rounded bg-blue-500 px-4 py-2 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;

import { useState, useMemo } from "react";
import { useGetAllOrderQuery } from "../../redux/features/api/order/orderApi";
import OrderTable from "../../components/order/orderTable";
import Pagination from "../../components/pagination";

const Order = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    // Filters & Search
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [shippingFilter, setShippingFilter] = useState("");

    const { data, isLoading } = useGetAllOrderQuery({ page, limit });
    const orders = data?.data || [];
    const totalPages = data?.totalPages || 1;

    // Filter logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.name.toLowerCase().includes(search.toLowerCase()) ||
                order.phone.includes(search);

            const matchesStatus = statusFilter ? order.status === statusFilter : true;
            const matchesPayment = paymentFilter ? order.paymentStatus === paymentFilter : true;
            const matchesShipping = shippingFilter
                ? order.shippingMethod === shippingFilter
                : true;

            return matchesSearch && matchesStatus && matchesPayment && matchesShipping;
        });
    }, [orders, search, statusFilter, paymentFilter, shippingFilter]);

    const handlePageChange = newPage => setPage(newPage);

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6">Order Management</h1>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />

                <select
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={e => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Courier">Courier</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancel">Cancel</option>
                </select>

                <select
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={paymentFilter}
                    onChange={e => {
                        setPaymentFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Payment</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                </select>

                <select
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    value={shippingFilter}
                    onChange={e => {
                        setShippingFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">All Shipping</option>
                    <option value="Redx">Redx</option>
                    <option value="Pathao">Pathao</option>
                    <option value="Sundarban">Sundarban</option>
                    <option value="SA Paribahan">SA Paribahan</option>
                    <option value="Home Delivery">Home Delivery</option>
                </select>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <OrderTable orderData={filteredOrders} page={page} limit={limit} />
            )}

            {/* Pagination */}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default Order;

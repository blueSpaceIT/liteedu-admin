import { useMemo, useState } from "react";
import { useGetAllNotificationQuery } from "../../redux/features/api/notification/notification";
import DashboardWrapper from "../../routes/DashboardWrapper";
import Pagination from "../../components/pagination";
import Button from "../../UI/button";
import AddNotificationModal from "../../components/notification/addNotification";
import NotificationTable from "../../components/notification/notificationTable";

const Notification = () => {
    const [addNotification, setAddNotification] = useState(false);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const pathname = `limit=${limit}&page=${page}&search=${search}`;

    const { data } = useGetAllNotificationQuery(pathname);

    const notificationData = useMemo(() => (data?.data ? data.data : []), [data]);

    const totalPages = useMemo(() => {
        return notificationData.length < limit ? page : page + 1;
    }, [notificationData.length, limit, page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPage(newPage);
    };

    const handleCreateClick = () => {
        //setEditingCategory(null);
        setAddNotification(true);
    };

    return (
        <DashboardWrapper
            pageTitle="Notification"
            setValue={setSearch}
            actionElement={
                <Button
                    onClick={() => handleCreateClick()}
                    size="md"
                >
                    Add Notification
                </Button>
            }
        >
            <NotificationTable data={notificationData} />

            {notificationData.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            <AddNotificationModal
                isOpen={addNotification}
                onClose={setAddNotification}
            />
        </DashboardWrapper>
    );
};

export default Notification;

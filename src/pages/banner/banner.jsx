import { useMemo, useState } from "react";
import BannerTable from "../../components/banner/bannerTable";
import { useGetAllBannerQuery } from "../../redux/features/api/banner/bannerApi";
import DashboardWrapper from "../../routes/DashboardWrapper";
import Button from "../../UI/button";
import BannerCreateModel from "../../components/banner/bannerCreateModel";
import BannerDeleteModal from "../../components/banner/bannerDeleteModel";
import BannerUpdateModel from "../../components/banner/bannerUpdateModel";

const Banner = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);

    // Fetch banners
    const {
        data: bannerData = { data: [], total: 0 },
        isLoading,
        isError,
    } = useGetAllBannerQuery({
        page: currentPage,
        limit,
    });

    const banners = bannerData.data || [];
    const totalItems = bannerData.total || banners.length;

    const totalPages = useMemo(() => Math.max(Math.ceil(totalItems / limit), 1), [totalItems, limit]);

    const paginatedBanners = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return banners.slice(start, start + limit);
    }, [banners, currentPage, limit]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Banner"
                actionElement={
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        size="md"
                    >
                        Create Banner
                    </Button>
                }
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : isError ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">Failed to load banners.</div>
                ) : banners.length === 0 ? (
                    <div className="flex items-center justify-center py-[20%] text-xl text-gray-500">No Banners Found 😔</div>
                ) : (
                    <>
                        <BannerTable
                            banners={paginatedBanners}
                            onEdit={(banner) => {
                                setSelectedBanner(banner);
                                setIsEditOpen(true);
                            }}
                            onDelete={(banner) => {
                                setSelectedBanner(banner);
                                setIsDeleteOpen(true);
                            }}
                            isLoading={isLoading}
                        />

                        <div className="mt-4 flex items-center justify-end gap-3">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800"
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="rounded bg-gray-100 px-3 py-1 dark:bg-gray-800"
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </DashboardWrapper>
            {/* Modals */}
            <BannerCreateModel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <BannerUpdateModel
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                banner={selectedBanner}
            />

            <BannerDeleteModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                banner={selectedBanner}
            />
        </div>
    );
};

export default Banner;

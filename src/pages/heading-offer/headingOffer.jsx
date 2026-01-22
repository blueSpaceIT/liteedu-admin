import { useMemo, useState, useEffect } from "react";
import { useGetAllHeadingOffersQuery } from "../../redux/features/api/headingOffer/headingOfferApi";
import DashboardWrapper from "../../routes/DashboardWrapper";
import Button from "../../UI/button";
import Pagination from "../../components/pagination";
import HeadingTable from "../../components/Heading/HeadingTable";
import AddHeadingOfferModal from "../../components/Heading/AddHeadingModal";

const HeadingOffer = () => {
    const [addHeading, setAddHeading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;

    const { data, isLoading, refetch } = useGetAllHeadingOffersQuery({ page, limit });

    // Full data from backend
    const allHeadings = useMemo(() => data?.data || [], [data]);

    // Filtered headings based on search
    const headings = useMemo(() => {
        if (!search.trim()) return allHeadings;
        return allHeadings.filter((h) => h.offer.toLowerCase().includes(search.toLowerCase()));
    }, [allHeadings, search]);

    // Calculate total pages
    const totalPages = Math.ceil(headings.length / limit) || 1;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    // Reset page to 1 when search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Headings"
                setValue={setSearch}
                loading={isLoading}
                actionElement={
                    <Button
                        onClick={() => setAddHeading(true)}
                        size="md"
                    >
                        Add Heading
                    </Button>
                }
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : headings.length === 0 ? (
                    <p className="py-6 text-center text-gray-500 dark:text-gray-400">No heading offers found.</p>
                ) : (
                    <>
                        <HeadingTable
                            headings={headings}
                            page={page}
                            limit={limit}
                        />
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}

                {addHeading && (
                    <AddHeadingOfferModal
                        isOpen={addHeading}
                        onClose={() => setAddHeading(false)}
                        onSuccess={refetch}
                    />
                )}
            </DashboardWrapper>
        </div>
    );
};

export default HeadingOffer;

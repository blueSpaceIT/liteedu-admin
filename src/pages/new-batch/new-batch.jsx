import { useMemo, useState, useEffect } from "react";
import DashboardWrapper from "../../routes/DashboardWrapper";
import { useGetAllNewBatchesQuery } from "../../redux/features/api/newBatch/newBatchApi";
import Button from "../../ui/button";
import Pagination from "../../components/pagination";
import BatchTable from "../../components/newBatch/BatchTable";
import AddNewBatch from "../../components/newBatch/AddNewBatch";

const NewBatch = () => {
    const [addBatch, setAddBatch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data, isLoading, error } = useGetAllNewBatchesQuery();

    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue]);

    // Filter batches
    const filteredBatches = useMemo(() => {
        if (!data?.data) return [];
        return data.data.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
    }, [data, searchValue]);

    // Pagination
    const paginatedBatches = useMemo(() => {
        const start = (currentPage - 1) * limit;
        return filteredBatches.slice(start, start + limit);
    }, [filteredBatches, currentPage, limit]);

    const totalPages = Math.ceil(filteredBatches.length / limit);

    return (
        <div className="p-5">
            <DashboardWrapper
                pageTitle="Next Batches"
                setValue={setSearchValue}
                loading={isLoading}
                actionElement={
                    <Button
                        onClick={() => setAddBatch(true)}
                        size="md"
                    >
                        Add Batch
                    </Button>
                }
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20 font-semibold text-red-500">Error loading batches</div>
                ) : filteredBatches.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Data Found 😔</div>
                ) : (
                    <>
                        <BatchTable
                            batches={paginatedBatches}
                            currentPage={currentPage}
                            limit={limit}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}

                {addBatch && (
                    <AddNewBatch
                        isOpen={addBatch}
                        onClose={() => setAddBatch(false)}
                    />
                )}
            </DashboardWrapper>
        </div>
    );
};

export default NewBatch;

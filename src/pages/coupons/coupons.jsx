import { useEffect, useMemo, useState } from 'react';
import DashboardWrapper from '../../routes/DashboardWrapper';
import Button from '../../ui/button';
import AddCouponModal from '../../components/coupons/AddCouponModal';
import CouponsTable from '../../components/coupons/CouponsTable';
import { useGetAllCouponQuery } from '../../redux/features/api/coupons/couponsApi';
import Pagination from '../../components/pagination';

const Coupons = () => {
    const [couponModal, setCouponModal] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    const { data, isLoading: couponLoading } = useGetAllCouponQuery({ search, page, limit });
    const coupons = useMemo(() => data?.data, [data]);

    const totalPages = useMemo(() => {
        return coupons?.length < limit ? page : page + 1;
    }, [coupons?.length, limit, page]);

    const handlePageChange = (newPage) => {
        if (newPage < 1) return;
        setPage(newPage);
    };

    useEffect(() => {
        setPage(1);
    }, [search]);


    return (
        <>
            <DashboardWrapper
                pageTitle="Coupons"
                setValue={setSearch}
                loading={couponLoading}
                actionElement={
                    <Button size="md" onClick={() => setCouponModal(!couponModal)}>
                        Add Coupons
                    </Button>
                }
            />
            {
                couponLoading ? (<div className="flex items-center justify-center py-10">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                </div>) : <CouponsTable coupons={coupons} page={page} limit={limit} />
            }


            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            {
                couponModal && <AddCouponModal close={setCouponModal} />
            }
            
        </>
    );
};

export default Coupons;
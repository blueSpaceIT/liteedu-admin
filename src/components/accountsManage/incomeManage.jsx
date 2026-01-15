import AccountManageCard from "./accountManageCard";
import { DollarSign, ListOrdered } from "lucide-react";
import IncomeOrderTable from "./incomeOrderTable";
import IncomeSaleTable from "./incomeSaleTable";
import { useGetIncomeOrderReportQuery, useGetIncomeReportQuery, useGetIncomeSalesReportQuery } from "../../redux/features/api/accounts/accountsApi";

const IncomeManage = () => {
    const { data } = useGetIncomeReportQuery();
    const { data: incomeOrder, isLoading: isLoadingIncomeOrder } = useGetIncomeOrderReportQuery();

    const { data: incomeSales, isLoading: isLoadingIncomeSales } = useGetIncomeSalesReportQuery();
    const breakdown = data?.breakdown;

    return (
        <section className="p-4">
            <div className="flex flex-wrap gap-4 bg-gray-100 py-2">
                <AccountManageCard
                    amountIcon={<DollarSign />}
                    amount={breakdown?.orderIncome}
                    title="Total Income"
                />

                <AccountManageCard
                    amountIcon={<ListOrdered />}
                    amount={breakdown?.orderCount}
                    title="Order Income"
                    subTitle={`${breakdown?.orderCount} Order`}
                />

                <AccountManageCard
                    amountIcon={<ListOrdered />}
                    amount={breakdown?.salesIncome}
                    title="Sales Income"
                    subTitle={`${breakdown?.salesCount} Sales`}
                />
            </div>

            {/* Order Table */}
            {isLoadingIncomeOrder ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : incomeOrder?.data?.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Order Found 😔</div>
            ) : (
                <IncomeOrderTable orders={incomeOrder?.data} />
            )}

            {isLoadingIncomeSales ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : incomeSales?.data?.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Sales Found 😔</div>
            ) : (
                <IncomeSaleTable sales={incomeSales?.data} />
            )}
        </section>
    );
};

export default IncomeManage;

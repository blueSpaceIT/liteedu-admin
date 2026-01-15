import AccountManageCard from "./accountManageCard";
import { DollarSign } from "lucide-react";
import ExpensManageTable from "./expensManageTable";
import { useGetExpenseReportQuery } from "../../redux/features/api/accounts/accountsApi";

const ExpensManage = () => {
    const { data, isLoading } = useGetExpenseReportQuery();
    const expenses = data?.expenses;
    return (
        <section className="p-4">
            <div className="flex flex-wrap gap-4 bg-gray-100 py-2">
                <AccountManageCard
                    amountIcon={<DollarSign />}
                    amount={data?.totalExpense}
                    title="Total Expense"
                />
                <AccountManageCard
                    amountIcon={<DollarSign />}
                    amount={data?.count}
                    title="Total Expense"
                    subTitle="Expense Records"
                />
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : expenses?.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-lg font-semibold text-gray-500">No Expenses Found 😔</div>
            ) : (
                <ExpensManageTable expenses={data?.expenses} />
            )}
        </section>
    );
};

export default ExpensManage;

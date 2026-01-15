import { useState } from "react";
import AccountCreateExpensModel from "../../components/accountsManage/accountCreateExpensModel";
import ExpensManage from "../../components/accountsManage/expensManage";
import IncomeManage from "../../components/accountsManage/incomeManage";
import IncomeManageHeader from "../../components/accountsManage/incomeManageHeader";

const tabs = [
    { value: "expens", label: "Expens" },
    { value: "income", label: "Income" },
];

const AccountsManage = () => {
    const [selectedTab, setSelectedTab] = useState("expens");
    const [createExpen, setCreateExpen] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
    };

    return (
        <div>
            <IncomeManageHeader
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                tabs={tabs}
                createExpen={createExpen}
                setCreateExpen={setCreateExpen}
                setFromDate={setFromDate}
                fromDate={fromDate}
                setToDate={setToDate}
                toDate={toDate}
                clearFilters={clearFilters}
            />
            {selectedTab === "expens" && <ExpensManage />}
            {selectedTab === "income" && <IncomeManage />}

            <AccountCreateExpensModel
                isOpen={createExpen}
                onClose={() => setCreateExpen(false)}
            />
        </div>
    );
};

export default AccountsManage;

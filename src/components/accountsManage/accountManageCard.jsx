/* eslint-disable react/prop-types */
const AccountManageCard = ({ title, amountIcon, amount, subTitle }) => {
    return (
        <div className="flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="flex items-center justify-start gap-1 text-4xl font-bold text-gray-900">
                        ৳{amount}
                    </p>
                    {subTitle && <p className="text-sm text-gray-500">{subTitle}</p>}
                </div>
                <div className="text-6xl font-light text-gray-300">{amountIcon}</div>
            </div>
        </div>
    );
};
export default AccountManageCard;

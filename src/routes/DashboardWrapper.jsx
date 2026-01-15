import Search from "../package/Search";
/* eslint-disable react/prop-types */
const DashboardWrapper = ({
  children,
  pageTitle,
  setValue,
  loading,
  showSection = true,
  actionElement,
}) => {
  return (
    <main>
      <h1 className="mb-1 text-xl font-bold text-black dark:text-white">
        {pageTitle}
      </h1>
      {showSection && (
        <div className="flex items-center justify-between gap-3 px-2 py-1 rounded shadow-md dark:bg-slate-900">
          <Search setValue={setValue} loading={loading} />
          {actionElement && (
            <>
              {actionElement}
            </>
          )}

        </div>
      )}
      <div className="px-2 mt-4">
        {children}
      </div>
    </main>
  );
};

export default DashboardWrapper;
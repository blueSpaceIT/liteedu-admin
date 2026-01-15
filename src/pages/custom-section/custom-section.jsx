import { useState } from "react";
import Button from "../../ui/button";
import CustomSectionTable from "../../components/customSection/CustomSectionTable";
import { useGetAllCustomSectionsQuery } from "../../redux/features/api/customSection/customSection";
import AddCustomSectionModal from "../../components/customSection/AddCustomSectionModal";

const CustomSection = () => {
    const [addModalOpen, setAddModalOpen] = useState(false);

    const { data, isLoading, refetch } = useGetAllCustomSectionsQuery();
    const allSections = data?.data || [];

    return (
        <div className="p-5">
            <div className="flex items-center justify-between">
                <h1 className="mb-1 text-xl font-bold text-black dark:text-white">Create custom section</h1>
                <div className="mb-4 flex justify-end">
                    <Button
                        onClick={() => setAddModalOpen(true)}
                        size="md"
                    >
                        Add Custom Section
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
                </div>
            ) : (
                <CustomSectionTable
                    sections={allSections}
                    refetch={refetch}
                />
            )}

            {addModalOpen && (
                <AddCustomSectionModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSuccess={() => {
                        refetch(); 
                        setAddModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default CustomSection;

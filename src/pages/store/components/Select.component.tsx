import React, { Dispatch } from "react";
import { useSearchParams } from "react-router-dom";

type group = {
    name: string;
    description: string;
    image: string;
    subgroups: subgroups[]
}

type subgroups = {
    name: string;
}

interface Props {
    hoveredCategory: null | group;
    setHoveredCategory: Dispatch<React.SetStateAction<group | null>>
}

const SelectDropdown = ({ hoveredCategory, setHoveredCategory }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubgroupClick = (subgroup: subgroups) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("subgroup", subgroup.name);
        newParams.set("page", "1"); // Reset page when changing subgroup
        setSearchParams(newParams);
    };

    return (
        <>
            {
                hoveredCategory && (
                    <div
                    onMouseEnter={() => setHoveredCategory(hoveredCategory)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="absolute z-10 shadow-md left-0 right-0 h-fit max-h-[80vh] bg-white"
                    >
                        <div
                        className="w-full h-fit max-w-[1320px] lg:px-10 xl:mx-auto py-4"
                        >
                            <h2 className="text-xl font-bold">{ hoveredCategory.name }</h2>
                            <div className="flex items-start justify-between max-h-[70vh]">
                                <div
                                className="flex flex-col flex-wrap max-h-[70vh] overflow-auto w-fit gap-x-2"
                                >
                                    {
                                        hoveredCategory?.subgroups.map(( subgroup: Record<string, any>, idx: number ) => (
                                            <span
                                            key={`${idx}-${hoveredCategory.name}`}
                                            className="w-fit cursor-pointer hover:text-secondary_3"
                                            onClick={() => handleSubgroupClick(subgroup)}
                                            >
                                                { subgroup.name }
                                            </span>
                                        ))
                                    }
                                </div>
                                <figure
                                className="w-96 hidden xl:block xl:w-80 place-content-end xl:self-start"
                                >
                                    <img
                                    src={ hoveredCategory.image }
                                    alt={ hoveredCategory.name }
                                    className="w-full h-full object-contain"
                                    />
                                    <figcaption
                                    className="font-semibold text-sm mt-1"
                                    >
                                        { hoveredCategory.description }
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
export default SelectDropdown;
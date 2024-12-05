import { faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useQuery } from "@tanstack/react-query";
import { Drawer } from "antd";
// import axios from "axios";
import { useState } from "react";
import SubgroupModal from "./Subgroups.component";
import groupsData from '../../assets/puntokoreano_db.groups_collection.json';

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type group = {
    name: string;
    description: string;
    image: string;
    subgroups: subgroups[]
}

type subgroups = {
    name: string;
}

const GroupsModal = ({ open, setOpen }: Props) => {
    // const { data } = useQuery({
    //     queryKey: ['groups'],
    //     queryFn: () => {
    //         return axios.get(`${import.meta.env.VITE_API_REST_URL}/api/groups`)
    //         .then((resp) => {
    //             return resp.data
    //         });
    //     },
    // });

    const [ hoveredCategory, setHoveredCategory ] = useState<null | group >(null);
    const [ openSubgroup, setOpenSubgroup ] = useState<boolean>(false);

    return (
        <Drawer
        title={
            <div className="flex flex-1 items-center gap-x-3">
                <img src="https://puntokoreano.com/images/logos/logo_1.png" alt="Punto Koreano Logo" width={40} />
                <p className="font-karate text-2xl self-center">Punto Koreano</p>
            </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        width={'100vw'}
        placement="left"
        closable={false}
        extra={<FontAwesomeIcon icon={faXmark} className="text-2xl" onClick={() => setOpen(false)} />}
        >
            {
                groupsData?.map((group: group, idx: number ) => (
                    <div
                    key={`${idx}-${group.name}`}
                    className="flex items-center justify-between py-3"
                    onClick={() => {
                        setHoveredCategory(group);
                        setOpenSubgroup(true);
                    }}
                    >
                        <p className="text-xl">{ group.name }</p>
                        <FontAwesomeIcon icon={faChevronRight} className="text-2xl" />
                    </div>
                ))
            }

            <SubgroupModal hoveredCategory={hoveredCategory} open={openSubgroup} setOpen={setOpenSubgroup}  />
        </Drawer>
    )
};
export default GroupsModal;
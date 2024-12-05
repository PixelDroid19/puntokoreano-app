import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "antd";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hoveredCategory: null | group;
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

const SubgroupModal = ({ open, setOpen, hoveredCategory }: Props) => {
    return (
        <Drawer
        title={
            <div className="flex flex-1 items-center gap-x-3">
                <FontAwesomeIcon icon={faChevronLeft} className="text-2xl" onClick={() => setOpen(false)} />
                <p className="text-xl self-center">{ hoveredCategory?.name }</p>
            </div>
        }
        open={open}
        onClose={() => setOpen(false)}
        width={'100vw'}
        placement="right"
        closable={false}
        extra={<FontAwesomeIcon icon={faXmark} className="text-2xl" onClick={() => setOpen(false)} />}
        >
            {
                hoveredCategory?.subgroups?.map((subgroup, idx ) => (
                    <div
                    key={`${idx}-${subgroup.name}`}
                    className="flex items-center justify-between py-3"
                    >
                        <p className="text-xl">{ subgroup.name }</p>
                    </div>
                ))
            }
        </Drawer>
    )
};
export default SubgroupModal;
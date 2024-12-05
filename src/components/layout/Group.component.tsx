import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    title: string | JSX.Element;
}

const Group = ( { title }: Props ) => {
    return (
        <div>
            <div className="flex items-center gap-2 mt-2 py-2 border-b border-b-[#e5e5e5] mb-5">
                <FontAwesomeIcon icon={faCircle} className="text-[#E2060F] text-sm p-1 border rounded-full border-[#E2060F]" />
                <h2 className="text-xl uppercase lg:text-2xl">{ title }</h2>
            </div>
        </div>
    )
};
export default Group;
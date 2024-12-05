import { useMediaQuery } from "react-responsive";
import GroupComponent from "./components/Groups.component";
import SectionProducts from "./components/SectionProducts.component";

const Store = () => {
    const isDesk = useMediaQuery({ query: "(min-width: 1024px)" });

    return (
        <div>
            {isDesk && <GroupComponent />}
            <SectionProducts />
        </div>
    );
};

export default Store;

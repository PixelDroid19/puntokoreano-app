import HomeCarousel from "./components/HomeCarousel.component";
import Services from "./components/Services.component";
import Sections from "./components/Sections.component";
import Banner from "./components/Banner.component";

export const Home = () => {
  return (
    <div>
      <HomeCarousel />
      <Banner />
      <Services />
      <Sections />
    </div>
  );
};
export default Home;

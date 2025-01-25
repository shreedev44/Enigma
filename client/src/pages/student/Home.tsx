import Breadcrumbs from "@/components/Breadcrumbs";
import { studentRoutes } from "@/constants/routeUrl";

const Home = () => {
  return (
    <div className="pt-24">
      <Breadcrumbs
        components={[
          { component: "Home", path: studentRoutes.HOME }
        ]}
      />
    </div>
  );
};

export default Home;

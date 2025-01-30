import Breadcrumbs from "@/components/Breadcrumbs";
import { recruiterRoutes } from "@/constants/routeUrl";

const Home = () => {
  return (
    <div className="pt-24">
      <Breadcrumbs 
      components={[{component: "Home", path: recruiterRoutes.HOME}]}
      />
    </div>
  )
}

export default Home

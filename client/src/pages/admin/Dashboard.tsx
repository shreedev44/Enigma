import { useSidebarContext } from "@/components/adminComponents/Sidebar";
import { useEffect } from "react";

const Dashboard = () => {
  const { setBreadcrumbs } = useSidebarContext();
  useEffect(() => {
    setBreadcrumbs([{component: "Dashboard"}])
  },[])
  return (
    <div className="">
      
    </div>
  )
}

export default Dashboard

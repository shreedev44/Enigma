import { useSidebarContext } from "@/components/adminComponents/Sidebar";
import { Button } from "@/components/ui/button";
import { adminRoutes } from "@/constants/routeUrl";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Problems = () => {
  const navigate = useNavigate();
  const { setBreadcrumbs } = useSidebarContext();
  useEffect(() => {
    setBreadcrumbs([{ component: "Problems" }]);
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => navigate(`/admin${adminRoutes.ADD_PROBLEM}`)}
          className="font-bold font-mono bg-mildgreen"
          size={"lg"}
        >
          Add Problem
        </Button>
      </div>
    </div>
  );
};

export default Problems;

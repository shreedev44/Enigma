import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbPropType } from "@/types/propsTypes";
import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ components }: BreadcrumbPropType) => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="ml-10">
      <BreadcrumbList>
        {components.map((value, index) => {
          return (
            <>
              <BreadcrumbItem key={index}>
                {index === components.length - 1 ? (
                  <BreadcrumbPage>{value.component}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => navigate(value.path || "")}
                  >
                    {value.component}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index !== components.length - 1 ? (
                <BreadcrumbSeparator></BreadcrumbSeparator>
              ) : (
                <></>
              )}
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;

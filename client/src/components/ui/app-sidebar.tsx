import {
  Code2,
  LayoutDashboardIcon,
  User,
  Users,
  Briefcase,
  ChevronUp,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { adminRoutes } from "@/constants/routeUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Theme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export function AppSidebar(props: {
  theme: Theme;
  handleLogout: () => void;
  toggleTheme: () => void;
  user: string;
}) {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader className="font-mono font-bold text-2xl">
        Enigma
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => navigate(`/admin${adminRoutes.HOME}`)}
                >
                  <span>
                    <LayoutDashboardIcon />
                    <span>{"Dashboard"}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      asChild
                    >
                      <span>
                        <User />
                        <span>{"Users"}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuButton
                        asChild
                        onClick={() => navigate(`/admin${adminRoutes.STUDENTS}`)}
                      >
                        <span>
                          <span>{"Students"}</span>
                        </span>
                      </SidebarMenuButton>
                      <SidebarMenuButton
                        asChild
                        onClick={() => navigate(`/admin${adminRoutes.RECRUITERS}`)}
                      >
                        <span>
                          <span>{"Recruiters"}</span>
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => navigate(`/admin${adminRoutes.HOME}`)}
                >
                  <span>
                    <Code2 />
                    <span>{"Problems"}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => navigate(`/admin${adminRoutes.HOME}`)}
                >
                  <span>
                    <Users />
                    <span>{"Community"}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  onClick={() => navigate(`/admin${adminRoutes.HOME}`)}
                >
                  <span>
                    <Briefcase />
                    <span>{"Job Posts"}</span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              {props.user.length <= 18
                ? props.user
                : props.user.slice(0, 18) + "..."}
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem onClick={() => props.toggleTheme()}>
              <span>{props.theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Notificaion</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={props.handleLogout}>
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

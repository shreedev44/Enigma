import {
  Code2,
  LayoutDashboardIcon,
  User,
  Users,
  Briefcase,
  ChevronUp,
  ChevronRight,
  Minus,
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
import { useLocation } from "react-router-dom";

export function AppSidebar(props: {
  theme: Theme;
  handleLogout: () => void;
  toggleTheme: () => void;
  user: string;
}) {
  const navigate = useNavigate();
  const location = useLocation()
  return (
    <Sidebar>
      <SidebarHeader className="font-mono font-bold text-2xl mt-3">
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
                  className={location.pathname.split('/')[2] === 'dashboard' ? "outline outline-1" : ''}
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
                      className={location.pathname.split('/')[2] === 'users' ? "outline outline-1" : ''}
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
                          {location.pathname.split('/')[3] === 'students' ? (
                            <Minus className="ml-auto"/>
                          ) : (<></>)}
                        </span>
                      </SidebarMenuButton>
                      <SidebarMenuButton
                        asChild
                        onClick={() => navigate(`/admin${adminRoutes.RECRUITERS}`)}
                      >
                        <span>
                          <span>{"Recruiters"}</span>
                          {location.pathname.split('/')[3] === 'recruiters' ? (
                            <Minus className="ml-auto"/>
                          ) : (<></>)}
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
                  className={location.pathname.split('/')[2] === 'problems' ? "outline outline-1" : ''}
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
                  className={location.pathname.split('/')[2] === 'community' ? "outline outline-1" : ''}
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
                  className={location.pathname.split('/')[2] === 'jobposts' ? "outline outline-1" : ''}
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

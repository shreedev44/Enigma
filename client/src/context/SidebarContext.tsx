import { createContext, useContext } from "react";

export const SidebarContext = createContext<{
	setBreadcrumbs: (
		breadcrumbs: { component: string; path?: string | undefined }[]
	) => void;
} | null>(null);

export const useSidebarContext = () => {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error(
			"useSidebarContext must be used within SidebarProvider"
		);
	}
	return context;
};

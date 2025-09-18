import * as React from "react"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { AppSidebar } from "./app-sidebar"


export default function Menu({ children }: { children?: React.ReactNode }) {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<div className="md:hidden fixed top-1 left-4 z-50">
				<SidebarTrigger />
			</div>
			<main className="w-full">
				{children}
			</main>
		</SidebarProvider>
	)
}

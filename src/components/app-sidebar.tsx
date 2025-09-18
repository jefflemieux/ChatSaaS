"use client"

import * as React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Brain, CirclePlus, Ellipsis, MessagesSquare } from "lucide-react"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { getRecentConversationsById } from "./actions/recentConvs"

export const AppSidebar = () => {
	const { open, openMobile } = useSidebar();
	const { user } = useUser();
	const [convs, setConvs] = React.useState<any[]>([]);

	const sidebar_menu_items = [
		{ name: "Nouvelle conversation", href: "/", icon: <CirclePlus /> },
		{ name: "Discussions", href: "/discussions", icon: <MessagesSquare /> },
		{ name: "Base de connaissances", href: "/connaissances", icon: <Brain /> },
	]

	React.useEffect(() => {
		if (user) {
			getRecentConversationsById(user.id).then((data) => {
				setConvs(data);
			});
		}
	}, [user]);

	return (
		<Sidebar collapsible="icon">
			{
				(open || openMobile) &&
				<SidebarHeader>
					<div className="flex gap-2">
						<SidebarTrigger />
						<h2>Chat SaaS</h2>
					</div>

				</SidebarHeader>
			}
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{(!open && !openMobile) &&
								<SidebarMenuItem key="toggle-menu">
									<SidebarMenuButton asChild>
										<SidebarTrigger />
									</SidebarMenuButton>
								</SidebarMenuItem>}
							{sidebar_menu_items.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<a href={item.href}>
											{item.icon}
											<span>{item.name}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupContent>
						{
							(open || openMobile) &&
							<>
								<SidebarMenu>
									<SidebarGroupLabel>Récents</SidebarGroupLabel>
									{convs.map((item) => (
										<SidebarMenuItem key={item.id}>
											<SidebarMenuButton asChild>
												<a href={`/conversation/${item.id}`}>
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
									<SidebarMenuItem key={"toutes-conversations"}>
										<SidebarMenuButton asChild>
											<a href={`/discussions`}>
												<Ellipsis />
												<span>Toutes les conversations</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</>
						}
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarRail />

			</SidebarContent>
			<SidebarFooter >
				<SignedIn>
					<div className="flex gap-5 items-center">
						<div>
							<UserButton />
						</div>
						{
							(open || openMobile) && user &&
							<div className="px-2 py-4">
								<p className="text-sm">Connecté en tant que</p>
								<p className="font-medium text-xs">{user.primaryEmailAddress?.emailAddress}</p>
							</div>
						}
					</div>
				</SignedIn>
			</SidebarFooter>
		</Sidebar>
	)
}
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavGroup[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>MENU</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((group) => (
                    <div key={group.title}>
                        {/* Muestra el título del grupo de navegación */}
                        <h3>{group.title}</h3>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton asChild isActive={item.url === page.url}>
                                    <Link href={item.url} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

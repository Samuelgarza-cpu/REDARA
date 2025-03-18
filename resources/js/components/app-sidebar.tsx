import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavGroup, type NavItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, BookOpenCheck, ClipboardPlus, Folder, SearchCheck } from 'lucide-react';
import AppLogo from './app-logo';

interface PageProps extends InertiaPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            id_rol: number;
        };
    };
}

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const userRole = auth.user.id_rol;

    const mainNavItems: NavGroup[] = [
        {
            title: '',
            items: [
                {
                    title: 'Registrar',
                    url: '/registro',
                    icon: ClipboardPlus,
                },
                {
                    title: 'Mis Registrados',
                    url: '/tabla-registros',
                    icon: BookOpenCheck,
                },
            ],
        },
    ];

    if (userRole === 1) {
        mainNavItems[0].items.push(
            {
                title: 'Asistencia',
                url: '/asistencia',
                icon: SearchCheck,
            },
            {
                title: 'Reportes',
                url: '/usuarios',
                icon: SearchCheck,
            },
        );
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            url: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            url: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

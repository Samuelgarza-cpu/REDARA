import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Register from './auth/register';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registro de Usuario',
        href: '/registro',
    },
];

type Role = {
    id: number;
    role_name: string;
};
interface RolePropos {
    roles: Role[];
}

export default function RegistroUsers({ roles = [] }: RolePropos) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registro de Usuarios" />
            <Register roles={roles} />
        </AppLayout>
    );
}

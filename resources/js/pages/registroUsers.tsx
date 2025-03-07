import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Registro de Usuario',
        href: '/registro',
    },
];

export default function RegistroUsers() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Registro de Usuarios" />
        </AppLayout>
    );
}

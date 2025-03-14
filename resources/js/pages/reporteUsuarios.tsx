import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reportes',
        href: '/usuarios',
    },
];
interface User {
    id: number;
    name: string;
    address: string;
    voter_code: string;
    curp: string;
    registration_year: string;
    date_of_birth: string;
    section: string;
    validity: string;
    role_name: string;
    id_user_register: number | null;
    email: string;
    voto: boolean;
    id_user_register_voto: number;
    children?: User[];
}

const buildHierarchy = (users: User[], parentId: number | null): User[] => {
    return users
        .filter((user) => user.id_user_register === parentId)
        .map((user) => ({
            ...user,
            children: buildHierarchy(users, user.id),
        }));
};

const flattenHierarchy = (users: User[], level = 0): any[] => {
    return users.flatMap((user) => [
        { Nombre: user.name, Direccion: user.address, Cargo: user.role_name, level },
        ...flattenHierarchy(user.children || [], level + 1),
    ]);
};

const exportToExcel = (data: User[], fileName: string) => {
    const flattenedData = flattenHierarchy(data);
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jerarquía');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default function ReporteUsuarios({ users = [] }) {
    const [userTree, setUserTree] = useState<User[]>([]);

    useEffect(() => {
        (async () => {
            const usersAll = users;
            const hierarchy = buildHierarchy(usersAll, 1);
            setUserTree(hierarchy);
        })();
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            <div className="p-4">
                <h2 className="mb-4 text-lg font-bold">Jerarquía de Usuarios</h2>
                <pre className="rounded-md bg-gray-100 p-4">{JSON.stringify(userTree, null, 2)}</pre>
                <button onClick={() => exportToExcel(userTree, 'Jerarquia_Usuarios')} className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white">
                    Exportar a Excel
                </button>
            </div>
        </AppLayout>
    );
}

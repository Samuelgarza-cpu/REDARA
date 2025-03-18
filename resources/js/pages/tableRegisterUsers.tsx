import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tabla de Registros',
        href: '/registro',
    },
];

type Users = {
    name: string;
    email: string;
    photo: string;
};
interface UsersProps {
    registeredUsers: Users[];
    totalRegistrations: number;
}

export default function TableRegisters({ registeredUsers = [], totalRegistrations }: UsersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tabla de Registros" />
            <div className="overflow-x-auto p-4">
                <table className="w-full border-collapse overflow-hidden rounded-lg shadow-md">
                    <caption className="my-4 text-lg font-semibold">Usuarios Registrados</caption>
                    <thead className="bg-gray-100">
                        <tr className="border-b text-left">
                            <th className="w-[100px] px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Correo</th>
                            {/* <th className="px-6 py-3">Img</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {registeredUsers.map((user) => (
                            <tr key={user.email} className="border-b even:bg-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                {/* <td className="px-6 py-4">
                                    {user.photo ? (
                                        <img
                                            src={`/storage/${user.photo}`}
                                            alt="Foto de perfil"
                                            className="h-10 w-10 rounded-full border object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">Sin foto</span>
                                    )}
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-200 font-semibold">
                            <td className="px-6 py-4" colSpan={1}>
                                Total de Registros
                            </td>
                            <td className="px-6 py-4 text-right">{totalRegistrations}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </AppLayout>
    );
}

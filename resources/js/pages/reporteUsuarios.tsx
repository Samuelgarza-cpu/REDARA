import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Reportes', href: '/usuarios' }];

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

const buildHierarchy = (users: User[], parentId: number | null, visited = new Set<number>()): User[] => {
    return users
        .filter((user) => user.id_user_register === parentId)
        .map((user) => {
            if (visited.has(user.id)) return { ...user, children: [] }; // Evita loops
            visited.add(user.id);
            return { ...user, children: buildHierarchy(users, user.id, visited) };
        });
};

// Flatten la jerarquía y agrega la columna "Pertenece a"
const flattenHierarchy = (users: User[], allUsers: User[], level = 0): any[] => {
    return users.flatMap((user) => {
        const parent = allUsers.find((u) => u.id === user.id_user_register); // Buscar al usuario padre
        return [
            {
                Nombre: user.name,
                Direccion: user.address,
                Cargo: user.role_name,
                'Pertenece a': parent ? parent.name : 'N/A', // Si tiene padre, muestra su nombre, si no "N/A"
            },
            ...flattenHierarchy(user.children || [], allUsers),
        ];
    });
};

const exportToExcel = (data: User[], users: User[], fileName: string) => {
    const flattenedData = flattenHierarchy(data, users); // Usamos 'users' para pasar el listado completo de usuarios
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jerarquía');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export default function ReporteUsuarios({ users = [] }) {
    const [userTree, setUserTree] = useState<User[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    // Filtrar usuarios por rol
    const filteredUsers = selectedRole ? users.filter((user: any) => user.role_name === selectedRole) : [];

    const handleSearch = () => {
        if (selectedUserId !== null) {
            // Buscar solo la jerarquía del usuario seleccionado
            const hierarchy = buildHierarchy(users, selectedUserId);
            console.log();

            if (!Array.isArray(hierarchy) || hierarchy.length === 0)
                Swal.fire({
                    title: 'No tiene Registros',
                    icon: 'info',
                });
            setUserTree(hierarchy);
        } else {
            // Si no hay selección, traer toda la jerarquía
            const hierarchy = buildHierarchy(users, 1);
            setUserTree(hierarchy);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            <div className="p-4">
                <h2 className="mb-4 text-lg font-bold">Jerarquía de Usuarios</h2>

                {/* Selector de Rol */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Selecciona un Rol</label>
                    <select
                        value={selectedRole ?? ''}
                        onChange={(e) => {
                            setSelectedRole(e.target.value || null);
                            setSelectedUserId(null); // Resetear usuario seleccionado
                        }}
                        className="w-full rounded-md border p-2"
                    >
                        <option value="">Todos los Roles</option>
                        {[...new Set(users.map((user: User) => user.role_name))].map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Usuario */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">Selecciona un Usuario</label>
                    <select
                        value={selectedUserId ?? ''}
                        onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full rounded-md border p-2"
                        disabled={!selectedRole}
                    >
                        <option value="">Todos los Usuarios</option>
                        {filteredUsers.map((user: User) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón de búsqueda */}
                <button onClick={handleSearch} className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white">
                    {selectedUserId ? 'Buscar Usuario' : 'Mostrar Toda la Jerarquía'}
                </button>

                {/* Mostrar resultado */}
                <pre className="mt-4 rounded-md bg-gray-100 p-4">{JSON.stringify(userTree, null, 2)}</pre>

                {/* Botón para exportar */}
                <button
                    onClick={() => exportToExcel(userTree, users, 'Jerarquia_Usuarios')} // Pasamos 'users' como 'allUsers'
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white"
                    disabled={userTree.length === 0}
                >
                    Exportar a Excel
                </button>
            </div>
        </AppLayout>
    );
}

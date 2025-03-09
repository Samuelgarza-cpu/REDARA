import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';

type RegisterForm = {
    name: string;
    address: string;
    voter_code: string;
    curp: string;
    registration_year: string;
    date_of_birth: string;
    section: string;
    validity: string;
    id_rol: number;
    id_user_register: number;
    email: string;
    password: string;
    password_confirmation: string;
};
type Role = {
    id: number;
    role_name: string;
};

interface RolePropos {
    roles: Role[];
}

export default function Register({ roles = [] }: RolePropos) {
    const { auth } = usePage<SharedData>().props;
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        address: '',
        voter_code: '',
        curp: '',
        registration_year: '',
        date_of_birth: '',
        section: '',
        validity: '',
        id_rol: roles[0]['id'], //este vendra de la tabla usuario-roles-registra
        id_user_register: 1,
        email: '',
        password: '123456789',
        password_confirmation: '123456789',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () =>
                reset(
                    'name',
                    'address',
                    'voter_code',
                    'curp',
                    'registration_year',
                    'date_of_birth',
                    'section',
                    'validity',
                    'id_rol',
                    'id_user_register',
                    'email',
                    'password',
                    'password_confirmation',
                ),
        });
    };

    return (
        <AuthLayout title="Registar Usuario" description="">
            <Head title="Register" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {/* {auth.user.id_rol == 1 ? (
                    <h1>Nivel de usuario a Registrar: TODOS</h1>
                ) : (
                    <h1>Nivel de usuario a Registrar:{roles[0]['role_name']} </h1>
                )} */}
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            // placeholder="Nombre Completo"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Dirección</Label>
                        <Input
                            id="address"
                            type="text"
                            required
                            tabIndex={1}
                            autoComplete="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            // placeholder="Full address"
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Clave de Elector</Label>
                        <Input
                            id="voter_code"
                            type="text"
                            tabIndex={1}
                            autoComplete="voter_code"
                            value={data.voter_code}
                            onChange={(e) => setData('voter_code', e.target.value)}
                            disabled={processing}
                            // placeholder="Full voter_code"
                        />
                        <InputError message={errors.voter_code} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">CURP</Label>
                        <Input
                            id="curp"
                            type="text"
                            tabIndex={1}
                            autoComplete="curp"
                            value={data.curp}
                            onChange={(e) => setData('curp', e.target.value)}
                            disabled={processing}
                            // placeholder="Full curp"
                        />
                        <InputError message={errors.curp} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Año de Registro</Label>
                        <Input
                            id="registration_year"
                            type="text"
                            tabIndex={1}
                            autoComplete="registration_year"
                            value={data.registration_year}
                            onChange={(e) => setData('registration_year', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.registration_year} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Fecha de Registro</Label>
                        <Input
                            id="date_of_birth"
                            type="text"
                            tabIndex={1}
                            autoComplete="date_of_birth"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.date_of_birth} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Sección</Label>
                        <Input
                            id="section"
                            type="text"
                            tabIndex={1}
                            autoComplete="section"
                            value={data.section}
                            onChange={(e) => setData('section', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.section} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Vigencia</Label>
                        <Input
                            id="validity"
                            type="text"
                            tabIndex={1}
                            autoComplete="validity"
                            value={data.validity}
                            onChange={(e) => setData('validity', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.validity} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="id_rol">Rol</Label>
                        <select
                            id="id_rol"
                            name="id_rol"
                            required
                            tabIndex={2}
                            value={data.id_rol}
                            onChange={(e) => setData('id_rol', parseInt(e.target.value))}
                            disabled={processing}
                            className="rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="" disabled>
                                Selecciona un rol
                            </option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.id_rol} className="mt-2" />
                    </div>
                    {auth.user.id_rol == 1 ? (
                        <>
                            {' '}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </>
                    ) : null}

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        GUARDAR
                    </Button>
                </div>

                {/* <div className="text-muted-foreground text-center text-sm">
                    ¿Ya tienes una cuenta?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Accesar
                    </TextLink>
                </div> */}
            </form>
        </AuthLayout>
    );
}

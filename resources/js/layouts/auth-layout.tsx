import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

interface AuthLayout2 {
    children: React.ReactNode;
    title: string;
    description: string;
}

export default function AuthLayout({ children, title, description, ...props }: AuthLayout2) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}

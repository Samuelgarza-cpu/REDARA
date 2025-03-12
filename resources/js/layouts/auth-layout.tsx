import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

interface AuthLayout2 {
    children: React.ReactNode;
    title: string;
    description: string;
    showImage?: boolean;
}

export default function AuthLayout({ children, title, description, showImage, ...props }: AuthLayout2) {
    return (
        <AuthLayoutTemplate title={title} description={description} showImage={showImage} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}

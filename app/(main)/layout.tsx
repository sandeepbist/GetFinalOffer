import { SessionGuard } from "@/components/auth/SessionGuard";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionGuard>
            {children}
        </SessionGuard>
    );
}
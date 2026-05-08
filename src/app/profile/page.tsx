import { redirect } from "next/navigation";
import { authGuard } from "@/src/shared/lib/auth.guard";
import ProfileClient from "./_components/ProfileClient";
export default async function ProfilePage() {
    try {
        await authGuard();
    } catch {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[var(--h-bg)] text-[var(--h-text)]">
            <main className="pb-24 lg:pb-0 lg:pl-24 px-4 sm:px-6 lg:pr-8 py-6 lg:py-10
                             w-full max-w-[1400px] mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-[var(--h-text)]">Mi Perfil</h1>
                    <p className="text-sm text-[var(--h-muted)] font-semibold mt-1">
                        Configura tus datos de salud y contacto
                    </p>
                </div>
                <ProfileClient />
            </main>
        </div>
    );
}

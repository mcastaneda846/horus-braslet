import { redirect } from "next/navigation";
import { authGuard } from "@/src/shared/lib/auth.guard";
import { AuthRepositoryImpl } from "@/src/infrastructure/repositories/auth.repository.impl";
import LocationMap from "./_components/LocationMap";
import ChatButton from "./_components/ChatButton";
import QrPermissionsCard from "./_components/QrPermissionsCard";
import NotificationsCard from "./_components/NotificationsCard";
import DevicesCard from "./_components/DevicesCard";
import ConnectedBadge from "./_components/ConnectedBadge";

function IconPhone() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
        </svg>
    );
}

const EMERGENCY_LINES = [
    { name: "Policía Nacional", number: "123", bg: "bg-[#1C1917]" },
    { name: "Bomberos",         number: "119", bg: "bg-[#EF7926]" },
    { name: "Cruz Roja",        number: "132", bg: "bg-[#E62B34]" },
    { name: "Defensa Civil",    number: "144", bg: "bg-[#8D99AE]" },
    { name: "GAULA",            number: "165", bg: "bg-[#1C1917]" },
];

function EmergencyLines() {
    return (
        <div className="bg-[var(--h-card)] rounded-[24px] p-5 shadow-sm border border-[var(--h-border)]">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                </div>
                <h2 className="text-xs font-extrabold text-[var(--h-text)] uppercase tracking-wide">Líneas de Emergencia</h2>
            </div>
            <div className="space-y-0">
                {EMERGENCY_LINES.map(e => (
                    <div key={e.number} className="flex items-center justify-between py-2.5 border-b border-[var(--h-border)] last:border-0">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 ${e.bg}`}>
                                <IconPhone />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[var(--h-text)]">{e.name}</p>
                                <p className="text-[10px] text-[var(--h-muted)]">{e.number}</p>
                            </div>
                        </div>
                        <a href={`tel:${e.number}`} title={`Llamar al ${e.number}`}
                            className="text-[var(--h-muted)] hover:text-[#E62B34] transition-colors p-1">
                            <IconPhone />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function DashboardPage() {
    let firstName = "Usuario";
    let userId    = "";

    try {
        const session    = await authGuard();
        const repository = new AuthRepositoryImpl();
        const user       = await repository.findById(session.sub);
        if (user) firstName = user.firstName;
        userId = session.sub;
    } catch {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[var(--h-bg)] text-[var(--h-text)]">
            {/* ── Main content — offset for sidebar on desktop, top bar on mobile ── */}
            <main className="pb-24 lg:pb-0 lg:pl-24 px-4 sm:px-6 lg:pr-8 py-6 lg:py-10
                             w-full max-w-[1700px] mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[var(--h-text)] tracking-tight">Dashboard</h1>
                        <p className="text-[var(--h-muted)] text-sm mt-1 font-semibold">
                            Hola, <span className="font-bold text-[var(--h-text)]">{firstName}</span>
                            {" "}· Monitorea tu manilla Horus en tiempo real
                        </p>
                    </div>
                    <ConnectedBadge />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 items-start">
                    <div className="xl:col-span-3 flex flex-col gap-5">
                        <ChatButton userId={userId} />
                        <NotificationsCard />
                        <DevicesCard />
                        <div className="bg-[var(--h-card)] rounded-[28px] p-6 shadow-sm border border-[var(--h-border)] flex flex-col">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#E62B34]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                    </svg>
                                    <h2 className="text-xs font-extrabold text-[var(--h-text)] uppercase tracking-wide">Ubicación en vivo</h2>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-[var(--h-muted)] font-semibold">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                    </svg>
                                    Actualizado recientemente
                                </div>
                            </div>
                            <div className="w-full min-h-[260px] sm:min-h-[300px]">
                                <LocationMap />
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-2 flex flex-col gap-5">
                        <QrPermissionsCard userId={userId} />
                        <EmergencyLines />
                    </div>
                </div>
            </main>
        </div>
    );
}

import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import AuthShapes from "@/src/components/AuthShapes";

export const metadata = {
    title: "Iniciar sesión · Horus",
    description: "Accede a tu cuenta Horus y protege a los que más quieres.",
};

const LIGHT: React.CSSProperties = {
    "--h-bg":     "#F2F1EC",
    "--h-card":   "#FFFFFF",
    "--h-card2":  "#F8F7F4",
    "--h-text":   "#1C1917",
    "--h-muted":  "#8D99AE",
    "--h-border": "#E4E2DC",
    "--h-dark":   "#1A1512",
} as React.CSSProperties;

export default function LoginPage() {
    return (
        <div style={LIGHT} className="relative flex min-h-screen overflow-hidden bg-[var(--h-bg)]">
            <div className="absolute inset-0 z-0 opacity-60">
                <AuthShapes />
            </div>

            <div className="relative z-10 flex w-full flex-col justify-center px-6 py-12
                            sm:px-10
                            lg:w-[480px] lg:min-w-[480px] lg:min-h-screen
                            bg-gradient-to-r from-[#FFF8E7]/95 via-[#FFF8E7]/80 to-transparent">
                <div className="mx-auto w-full max-w-[340px] flex flex-col gap-7">

                    <img src="/logos-horus-3.svg" alt="Horus" className="h-20 w-auto self-start" />

                    <div>
                        <h1 className="text-4xl font-black text-[var(--h-text)] leading-tight tracking-tight">
                            Bienvenido<br />de vuelta
                        </h1>
                        <p className="text-sm text-[var(--h-muted)] font-medium mt-2">
                            Monitorea tu salud con tu manilla Horus.
                        </p>
                    </div>

                    <LoginForm />

                    <p className="text-sm text-[var(--h-muted)] font-medium">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="font-bold text-[var(--h-text)] underline underline-offset-2 hover:text-[#FAD957] transition-colors">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

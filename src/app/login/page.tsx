import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import SplineScene from "./_components/SplineScene";
import EyeOfHorusIcon from "@/src/components/EyeOfHorusIcon";
import VoiceGreeting from "@/src/components/VoiceGreeting";

export const metadata = {
    title: "Iniciar sesión · Horus Braslet",
    description: "Accede a tu cuenta Horus Braslet y protege a los que más quieres.",
};

const panelGradient = {
    background: `
        radial-gradient(ellipse at 50% 38%, rgba(141,153,174,0.18) 0%, transparent 55%),
        radial-gradient(ellipse at 15% 90%, rgba(239,35,60,0.12) 0%, transparent 40%),
        linear-gradient(165deg, #14151f 0%, #2B2D42 55%, #14151f 100%)
    `,
} as React.CSSProperties;

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <VoiceGreeting message="Hola de nuevo. Inicia sesión para continuar." />

            {/* ── Left panel — Robot ─────────────────────────────────────────── */}
            <div
                className="hidden lg:flex flex-1 relative flex-col overflow-hidden"
                style={panelGradient}
            >
                {/* Ojo de Horus decorativo */}
                <div className="absolute top-8 left-8 opacity-8">
                    <EyeOfHorusIcon className="w-20 h-20 opacity-10" />
                </div>

                {/* Robot — centrado */}
                <div className="absolute inset-0 flex items-center justify-center -translate-y-8">
                    <div className="w-105 h-105">
                        <SplineScene />
                    </div>
                </div>

                {/* Texto al fondo */}
                <div className="relative z-10 mt-auto px-12 pb-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Protección Inteligente
                    </h2>
                    <p className="text-[#8D99AE] text-xs leading-relaxed max-w-xs mx-auto">
                        Tu manilla Horus te conecta con quienes más importan.
                        GPS en tiempo real, datos médicos NFC y emergencias al instante.
                    </p>
                </div>
            </div>

            {/* ── Right panel — Formulario ───────────────────────────────────── */}
            <div className="flex flex-1 items-center justify-center bg-white px-8 py-12 lg:px-16">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-10">
                        <EyeOfHorusIcon className="w-10 h-8" />
                        <span className="text-lg font-bold tracking-widest text-gray-900 uppercase">
                            Horus Braslet
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Bienvenido de vuelta
                    </h1>
                    <p className="text-gray-500 text-sm mb-8">
                        Ingresa tus credenciales para acceder
                    </p>

                    <LoginForm />

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿No tienes cuenta?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-[#EF233C] hover:text-[#D90429] transition-colors"
                        >
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

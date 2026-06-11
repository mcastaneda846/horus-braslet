import Link from "next/link";
import LoginForm from "./_components/LoginForm";
import VoiceGreeting from "@/src/components/VoiceGreeting";

export const metadata = {
    title: "Iniciar sesión · Horus",
    description: "Accede a tu cuenta Horus y protege a los que más quieres.",
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex bg-[#F2F1EC] text-[#1C1917] overflow-hidden relative">
            <VoiceGreeting message="Hola de nuevo. Inicia sesión para continuar." />

            {/* ── Columna Izquierda: Contenedor del Formulario ── */}
            <div className="w-full lg:w-[480px] xl:w-[540px] min-h-screen bg-white lg:border-r border-[#E4E2DC] flex flex-col justify-center p-8 sm:p-12 md:p-16 relative z-10 shadow-2xl shrink-0">
                <div className="w-full max-w-md mx-auto flex flex-col gap-6">
                    {/* Logo con escudo check */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#1C1917] rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                        </div>
                        <span className="text-[#1C1917] font-black tracking-widest text-lg uppercase">
                            Horus
                        </span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-black text-[#1C1917] leading-tight">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-sm text-[#8D99AE] font-semibold mt-1">
                            Monitorea tu salud y seguridad con tu manilla Horus.
                        </p>
                    </div>

                    <LoginForm />

                    <p className="text-center text-sm text-[#8D99AE] font-semibold mt-2">
                        ¿No tienes cuenta?{" "}
                        <Link
                            href="/register"
                            className="font-bold text-[#1C1917] hover:underline underline-offset-4"
                        >
                            Regístrate
                        </Link>
                    </p>
                </div>

                {/* Blobs de fondo visibles solo en pantallas móviles (como elementos flotantes sutiles) */}
                <div className="lg:hidden absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-30">
                    <div className="absolute top-10 right-6 w-24 h-24 bg-[#FDF2B2] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] flex items-center justify-center rotate-12 animate-float-slow">
                        <div className="flex gap-1.5 animate-look-around">
                            <div className="w-2 h-3.5 bg-[#1C1917] rounded-full relative">
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                            </div>
                            <div className="w-2 h-3.5 bg-[#1C1917] rounded-full relative">
                                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-12 left-6 w-20 h-20 bg-[#E3F2FD] rounded-[50%_40%_60%_50%_/_50%_60%_40%_55%] flex items-center justify-center -rotate-6 animate-float-medium">
                        <div className="flex gap-1 animate-look-around">
                            <div className="w-1.5 h-3 bg-[#1C1917] rounded-full relative">
                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                            </div>
                            <div className="w-1.5 h-3 bg-[#1C1917] rounded-full relative">
                                <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Columna Derecha: Fondo de bichitos animados flotando en el resto del espacio ── */}
            <div className="hidden lg:block flex-1 bg-[#F2F1EC] relative overflow-hidden h-screen select-none">
                
                {/* Bichito Amarillo Grande */}
                <div className="absolute top-[15%] right-[25%] w-44 h-44 bg-[#FDF2B2] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] flex items-center justify-center rotate-12 shadow-md animate-float-slow">
                    <div className="flex gap-3 animate-look-around">
                        <div className="w-4 h-6.5 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                        <div className="w-4 h-6.5 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Bichito Azul Mediano */}
                <div className="absolute bottom-[25%] right-[42%] w-32 h-32 bg-[#E3F2FD] rounded-[50%_40%_60%_50%_/_50%_60%_40%_55%] flex items-center justify-center -rotate-6 shadow-md animate-float-medium">
                    <div className="flex gap-2.5 animate-look-around">
                        <div className="w-3 h-5.5 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                        <div className="w-3 h-5.5 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Bichito Rosa Estrella */}
                <div className="absolute top-[42%] left-[12%] w-32 h-32 bg-[#FCE7F3] rounded-[40%_55%_45%_60%_/_50%_45%_55%_50%] flex items-center justify-center rotate-12 shadow-md animate-float-fast">
                    <div className="flex gap-3 animate-look-around">
                        <div className="w-3.5 h-6 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full" />
                        </div>
                        <div className="w-3.5 h-6 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Bichito Cruz Verde */}
                <div className="absolute bottom-[15%] right-[15%] w-28 h-28 flex items-center justify-center animate-float-slow">
                    <svg className="w-28 h-28 text-[#96C979] fill-current drop-shadow-md" viewBox="0 0 24 24">
                        <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
                    </svg>
                    <div className="absolute flex gap-1.5 animate-look-around">
                        <div className="w-2.5 h-4 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                        </div>
                        <div className="w-2.5 h-4 bg-[#1C1917] rounded-full relative">
                            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

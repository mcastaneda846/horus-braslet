import Link from "next/link";
import type { Metadata } from "next";
import { NavbarCta } from "../terms/_components/NavbarCta";
import { FooterCta } from "../terms/_components/FooterCta";

export const metadata: Metadata = {
    title: "Política de Privacidad · Horus",
    description: "Política de privacidad y tratamiento de datos personales de Horus Health.",
};

const LIGHT: React.CSSProperties = {
    "--h-bg":     "#F2F1EC",
    "--h-card":   "#FFFFFF",
    "--h-text":   "#1C1917",
    "--h-muted":  "#8D99AE",
    "--h-border": "#E4E2DC",
    "--h-dark":   "#1A1512",
    "--h-gold":   "#FAD957",
} as React.CSSProperties;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section style={{ marginBottom: "40px" }}>
            <h2 style={{
                fontSize: "18px", fontWeight: 800, color: "var(--h-text)",
                marginBottom: "14px", paddingBottom: "10px",
                borderBottom: "1px solid var(--h-border)",
                letterSpacing: "-0.01em",
            }}>
                {title}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {children}
            </div>
        </section>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return (
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#4A4540", fontWeight: 400 }}>
            {children}
        </p>
    );
}

function Li({ children }: { children: React.ReactNode }) {
    return (
        <li style={{ fontSize: "15px", lineHeight: "1.8", color: "#4A4540", paddingLeft: "4px" }}>
            {children}
        </li>
    );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div style={{
            background: "var(--h-card)", border: "1px solid var(--h-border)",
            borderRadius: "12px", padding: "16px 20px",
            display: "flex", gap: "14px", alignItems: "flex-start",
        }}>
            <div style={{
                flexShrink: 0, marginTop: "1px", width: "32px", height: "32px",
                background: "#F2F1EC", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#6B6560",
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--h-text)", marginBottom: "4px" }}>{title}</p>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#4A4540" }}>{description}</p>
            </div>
        </div>
    );
}

export default function PrivacyPage() {
    return (
        <div style={{ ...LIGHT, minHeight: "100vh", background: "var(--h-bg)" }}>

            {/* Floating navbar */}
            <div style={{
                position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)",
                zIndex: 50, width: "calc(100% - 48px)", maxWidth: "760px",
                background: "#1A1512", borderRadius: "100px",
                padding: "8px 8px 8px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos-horus-1.svg" alt="Horus" style={{ height: "28px", width: "auto" }} />
                    <span style={{ color: "white", fontSize: "15px", fontWeight: 700, letterSpacing: "-0.01em" }}>Horus Health</span>
                </Link>
                <NavbarCta />
            </div>

            {/* Content */}
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "96px 24px 80px" }}>

                <div style={{ marginBottom: "48px" }}>
                    <div style={{
                        display: "inline-block", background: "#FAD957", color: "#1A1512",
                        borderRadius: "100px", padding: "4px 14px", fontSize: "12px",
                        fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                        marginBottom: "16px",
                    }}>
                        Documento Legal
                    </div>
                    <h1 style={{
                        fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 900,
                        color: "var(--h-text)", lineHeight: "1.1", letterSpacing: "-0.02em",
                        marginBottom: "16px",
                    }}>
                        Política de Privacidad
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--h-muted)", fontWeight: 500 }}>
                        Última actualización: junio de 2025 · Versión 1.0
                    </p>
                </div>

                <Section title="1. ¿Quién cuida tus datos?">
                    <P>
                        <strong>Horus Health</strong> es el responsable de manejar tu información personal. Esta política
                        te explica, en términos sencillos, qué datos guardamos, por qué los necesitamos, cómo los
                        protegemos y cuáles son tus derechos sobre ellos.
                    </P>
                    <P>
                        Todo lo que hacemos con tu información está enmarcado en la{" "}
                        <strong>Ley 1581 de 2012</strong> de la República de Colombia, conocida como la Ley de Protección
                        de Datos Personales, y su decreto reglamentario, el <strong>Decreto 1377 de 2013</strong>. Estas
                        normas colombianas te dan derechos claros sobre tu información y nos obligan a tratarla con
                        responsabilidad.
                    </P>
                </Section>

                <Section title="2. ¿Qué información guardamos y para qué?">
                    <P>
                        Solo guardamos lo que necesitamos para prestarte el servicio. Aquí te lo explicamos de forma clara:
                    </P>

                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
                        title="Datos de tu cuenta"
                        description="Tu nombre, correo electrónico y contraseña. Los usamos para crear tu cuenta y permitirte iniciar sesión. Tu contraseña nunca se guarda en texto visible — se protege con un proceso de cifrado irreversible."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="10" y2="9"/><line x1="7" y1="13" x2="14" y2="13"/><line x1="7" y1="17" x2="12" y2="17"/></svg>}
                        title="Tu perfil personal"
                        description="Fecha de nacimiento, género y número de identificación. Los usamos para completar tu perfil de emergencia, que es la información que verán los socorristas si escanean tu pulsera o código QR."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                        title="Tu información médica (datos sensibles)"
                        description="Tipo de sangre, alergias, condiciones médicas, medicamentos e historial clínico. Esta es la información más importante de Horus: la que puede salvar tu vida en una emergencia. La guardamos con el mayor nivel de cuidado."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 10a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 7.86 7.86l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>}
                        title="Contactos de emergencia"
                        description="El nombre, relación y número de teléfono de las personas que quieres que contacten si hay una emergencia contigo."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                        title="Conversaciones con el asistente IA"
                        description="Los mensajes que intercambias con el asistente de salud de Horus. Los guardamos temporalmente para que puedas continuar la conversación y para mejorar la calidad del servicio. Se eliminan automáticamente después de 6 meses."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>}
                        title="Datos de compras"
                        description="Si adquieres una pulsera Horus, guardamos la referencia de tu pedido y el estado del pago. Los datos de tu tarjeta nunca pasan por nuestros sistemas — son procesados directamente por MercadoPago."
                    />
                    <InfoCard
                        icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>}
                        title="Registro de accesos a tu perfil"
                        description="Guardamos cuándo y desde dónde escanearon tu código QR o pulsera. Esto es para tu seguridad: puedes saber si alguien accedió a tu perfil de emergencia."
                    />
                </Section>

                <Section title="3. Tu información médica merece un cuidado especial">
                    <P>
                        La ley colombiana clasifica los datos de salud como <strong>datos sensibles</strong>, y eso
                        implica que tienen una protección reforzada. Horus cumple con eso de la siguiente manera:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>Solo tú decides qué se comparte.</strong> Puedes controlar exactamente qué información ve un socorrista cuando escanea tu perfil. Si hay algo que prefieres no compartir, puedes ocultarlo.</Li>
                        <Li><strong>No vendemos ni compartimos tu información de salud.</strong> Tus datos médicos no son un producto. Nunca los vendemos ni los compartimos con empresas de publicidad, aseguradoras u otras plataformas comerciales.</Li>
                        <Li><strong>Solo la usamos para lo que dijimos.</strong> Tu información médica se usa exclusivamente para tu perfil de emergencia y para que el asistente IA pueda orientarte mejor. Nada más.</Li>
                        <Li><strong>Necesitamos tu consentimiento.</strong> Al aceptar esta política, nos das permiso explícito para guardar y usar tu información de salud con los fines descritos. Puedes revocar ese permiso cuando quieras.</Li>
                    </ul>
                </Section>

                <Section title="4. ¿Con quién compartimos tu información?">
                    <P>
                        Horus usa servicios tecnológicos externos para funcionar. Todos ellos tienen acuerdos de
                        confidencialidad con nosotros y cumplen estándares internacionales de seguridad. Aquí te
                        explicamos quiénes son y qué hacen con tu información:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>Nuestros servidores de base de datos:</strong> guardan tu perfil médico y datos de cuenta en servidores seguros ubicados en Estados Unidos, bajo estrictos protocolos internacionales de seguridad.</Li>
                        <Li><strong>Google Firebase:</strong> plataforma de Google que usamos para guardar las conversaciones con el asistente IA y las lecturas del dispositivo wearable.</Li>
                        <Li><strong>Servicio de almacenamiento de imágenes:</strong> guarda tu foto de perfil en servidores seguros con certificación internacional.</Li>
                        <Li><strong>Proveedor de inteligencia artificial:</strong> el servicio que impulsa el asistente de salud de Horus. Tus conversaciones se procesan bajo acuerdos que prohíben usar tu información para entrenar modelos de IA de terceros.</Li>
                        <Li><strong>MercadoPago:</strong> procesa los pagos por la pulsera Horus. Tienen su propia política de privacidad y cumplen con los más altos estándares de seguridad para pagos electrónicos.</Li>
                        <Li><strong>Nuestra infraestructura en la nube:</strong> los servidores donde corre la plataforma Horus. Toda la comunicación entre tu dispositivo y nuestros servidores viaja cifrada.</Li>
                    </ul>
                    <P>
                        Fuera de estos proveedores tecnológicos, <strong>no compartimos tu información con nadie más</strong>,
                        salvo que tú nos lo pidas o que la ley colombiana nos lo exija.
                    </P>
                </Section>

                <Section title="5. Tus derechos sobre tu información">
                    <P>
                        La Ley 1581 de 2012 te da derechos claros sobre tus datos. Horus los respeta al pie de la letra:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>Derecho a saber:</strong> puedes preguntarnos en cualquier momento qué datos tuyos tenemos, para qué los usamos y con quién los hemos compartido.</Li>
                        <Li><strong>Derecho a corregir:</strong> si hay algo incorrecto o desactualizado en tu perfil, puedes cambiarlo desde la aplicación o pedirnoslo directamente.</Li>
                        <Li><strong>Derecho a eliminar:</strong> puedes pedirnos que borremos toda tu información. Lo haremos de forma definitiva e irreversible.</Li>
                        <Li><strong>Derecho a revocar tu consentimiento:</strong> puedes retirar tu autorización en cualquier momento. Eso no afecta lo que ya hicimos con tu información, pero detenemos cualquier uso futuro.</Li>
                        <Li><strong>Derecho a una copia:</strong> puedes solicitar que te enviemos una copia de todos los datos que tenemos sobre ti.</Li>
                    </ul>
                    <P>
                        Para ejercer cualquiera de estos derechos, escríbenos a{" "}
                        <a href="mailto:support@horushealth.co" style={{ color: "var(--h-text)", fontWeight: 700 }}>
                            support@horushealth.co
                        </a>.
                        {" "}Te responderemos en un máximo de 15 días hábiles.
                    </P>
                </Section>

                <Section title="6. ¿Cómo protegemos tu información?">
                    <P>
                        Tomamos la seguridad de tu información muy en serio, especialmente porque guardamos datos de salud.
                        Estas son algunas de las medidas que aplicamos:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li>Tu contraseña se guarda cifrada — ni nosotros mismos podemos verla.</Li>
                        <Li>Toda la comunicación entre tu dispositivo y nuestros servidores viaja encriptada, como cuando usas tu banco en línea.</Li>
                        <Li>Las sesiones tienen tiempo de expiración automático para protegerte si olvidas cerrar sesión.</Li>
                        <Li>Tú controlas qué información ven los socorristas — no todo tu perfil es visible para todos.</Li>
                        <Li>Guardamos un registro de quién accede a tu perfil de emergencia para que puedas detectar accesos no autorizados.</Li>
                        <Li>Nuestros servidores tienen protección contra ataques y acceso restringido.</Li>
                    </ul>
                    <P>
                        Sin embargo, ningún sistema es 100% infalible. Si alguna vez detectamos un problema de seguridad
                        que afecte tus datos, te lo comunicaremos de inmediato.
                    </P>
                </Section>

                <Section title="7. ¿Usamos cookies?">
                    <P>
                        Sí, pero solo las estrictamente necesarias para que puedas iniciar sesión y mantenerte conectado.
                        No usamos cookies para publicidad ni para rastrearte mientras navegas por internet.
                    </P>
                    <P>
                        Las cookies que usamos son del tipo seguro: no se pueden leer desde el navegador directamente y
                        solo viajan a través de conexiones cifradas. Si cierras sesión o borras las cookies, deberás
                        ingresar nuevamente.
                    </P>
                </Section>

                <Section title="8. Menores de edad">
                    <P>
                        Horus está diseñado para mayores de 18 años. Si eres padre, madre o tutor y crees que un menor
                        de edad registró datos en nuestra plataforma sin tu autorización, escríbenos de inmediato y
                        eliminaremos esa información sin demora.
                    </P>
                </Section>

                <Section title="9. Cambios a esta política">
                    <P>
                        Si cambiamos algo importante en esta política, te avisaremos por correo electrónico con al menos
                        15 días de anticipación. Siempre podrás ver la versión más reciente en esta misma página.
                    </P>
                </Section>

                <Section title="10. ¿Tienes preguntas?">
                    <P>
                        Si tienes cualquier pregunta sobre cómo manejamos tu información, o si quieres ejercer tus
                        derechos, contáctanos:
                    </P>
                    <div style={{
                        background: "var(--h-card)", border: "1px solid var(--h-border)",
                        borderRadius: "12px", padding: "20px 24px",
                        display: "flex", flexDirection: "column", gap: "6px",
                    }}>
                        <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--h-text)" }}>Horus Health — Responsable de Protección de Datos</p>
                        <p style={{ fontSize: "14px", color: "#4A4540" }}>Medellín, Colombia</p>
                        <p style={{ fontSize: "14px", color: "#4A4540" }}>
                            Correo:{" "}
                            <a href="mailto:support@horushealth.co" style={{ color: "var(--h-text)", fontWeight: 700 }}>
                                support@horushealth.co
                            </a>
                        </p>
                    </div>
                </Section>

                {/* Footer links */}
                <div style={{
                    marginTop: "48px", paddingTop: "24px",
                    borderTop: "1px solid var(--h-border)",
                    display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center",
                }}>
                    <Link href="/terms" style={{ fontSize: "13px", fontWeight: 700, color: "var(--h-text)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                        Términos y Condiciones
                    </Link>
                    <FooterCta />
                    <span style={{ fontSize: "13px", color: "var(--h-muted)" }}>
                        © {new Date().getFullYear()} Horus Health. Todos los derechos reservados.
                    </span>
                </div>
            </div>
        </div>
    );
}

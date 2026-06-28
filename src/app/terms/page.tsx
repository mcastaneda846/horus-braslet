import Link from "next/link";
import type { Metadata } from "next";
import { NavbarCta } from "./_components/NavbarCta";
import { FooterCta } from "./_components/FooterCta";

export const metadata: Metadata = {
    title: "Términos y Condiciones · Horus",
    description: "Términos y condiciones de uso de la plataforma Horus Health.",
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

function Highlight({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            background: "#FEF9E7", border: "1px solid #FAD957",
            borderRadius: "10px", padding: "16px 20px",
            fontSize: "14px", fontWeight: 600, color: "#7A6400",
            lineHeight: "1.7",
        }}>
            {children}
        </div>
    );
}

function Warning({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: "10px", padding: "16px 20px",
            fontSize: "14px", fontWeight: 600, color: "#991B1B",
            lineHeight: "1.7",
        }}>
            {children}
        </div>
    );
}

function Li({ children }: { children: React.ReactNode }) {
    return (
        <li style={{ fontSize: "15px", lineHeight: "1.8", color: "#4A4540", paddingLeft: "4px" }}>
            {children}
        </li>
    );
}

export default function TermsPage() {
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

                {/* Title block */}
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
                        Términos y Condiciones de Uso
                    </h1>
                    <p style={{ fontSize: "14px", color: "var(--h-muted)", fontWeight: 500 }}>
                        Última actualización: junio de 2025 · Versión 1.0
                    </p>
                </div>

                <Warning>
                    <span style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <svg style={{ flexShrink: 0, marginTop: "1px" }} width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#991B1B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <span>Aviso importante: Horus es una herramienta de apoyo en emergencias. No reemplaza la atención médica profesional. Ante cualquier emergencia, llama de inmediato al 123.</span>
                    </span>
                </Warning>

                <div style={{ height: "40px" }} />

                <Section title="1. ¿Quiénes somos?">
                    <P>
                        <strong>Horus Health</strong> es una plataforma tecnológica que te permite guardar tu información médica
                        de forma segura y tenerla disponible en caso de una emergencia. A través de una pulsera con tecnología
                        NFC o un código QR, los equipos de socorro pueden acceder rápidamente a los datos que tú decidas compartir:
                        tu tipo de sangre, alergias, medicamentos y contactos de emergencia.
                    </P>
                    <P>
                        Al crear una cuenta y usar nuestros servicios, aceptas estos Términos y Condiciones. Si tienes alguna
                        duda sobre su contenido, escríbenos antes de registrarte.
                    </P>
                </Section>

                <Section title="2. ¿Para qué sirve Horus?">
                    <P>
                        Horus está diseñado para ayudarte en situaciones de emergencia y para orientarte cuando lo necesitas.
                        Sus funciones principales son:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>Identificación médica de emergencia:</strong> guardamos tu información de salud más importante y la ponemos a disposición de los socorristas cuando escanean tu pulsera o código QR.</Li>
                        <Li><strong>Guía de primeros auxilios:</strong> te ofrecemos instrucciones claras y paso a paso para responder ante situaciones como un paro cardíaco, una convulsión, una reacción alérgica grave y muchas más.</Li>
                        <Li><strong>Asistente de salud con inteligencia artificial:</strong> puedes conversar con Horus para recibir orientación basada en tu perfil médico. Es una herramienta de apoyo informativo, no un médico.</Li>
                        <Li><strong>Historial y archivos médicos:</strong> puedes guardar tus documentos médicos de forma digital y acceder a ellos cuando los necesites.</Li>
                    </ul>
                    <Highlight>
                        Horus es una herramienta de apoyo, no un servicio médico. La información que te damos es orientativa.
                        Siempre consulta a un médico para decisiones sobre tu salud. En emergencias reales, llama al 123.
                    </Highlight>
                </Section>

                <Section title="3. Base científica de nuestros protocolos de primeros auxilios">
                    <P>
                        Las guías de primeros auxilios que encontrarás en Horus no son inventadas. Están basadas en las
                        recomendaciones de las organizaciones más reconocidas a nivel mundial en el campo de las emergencias
                        médicas:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>American Heart Association (AHA):</strong> la asociación cardiológica más importante del mundo, referencia global en protocolos de reanimación cardiopulmonar (RCP).</Li>
                        <Li><strong>Cruz Roja Internacional y Cruz Roja Colombiana:</strong> referente en primeros auxilios y respuesta humanitaria a emergencias.</Li>
                        <Li><strong>Organización Mundial de la Salud (OMS):</strong> organismo de las Naciones Unidas rector en salud pública a nivel global.</Li>
                        <Li><strong>European Resuscitation Council (ERC):</strong> consejo europeo de reanimación, autor de guías clínicas actualizadas periódicamente.</Li>
                        <Li><strong>Ministerio de Salud y Protección Social de Colombia:</strong> ente rector de la salud en Colombia, emisor de lineamientos oficiales de atención prehospitalaria.</Li>
                    </ul>
                    <P>
                        Nos esforzamos por mantener los protocolos actualizados, pero el conocimiento médico evoluciona
                        constantemente. Si eres profesional de la salud y detectas alguna imprecisión, te agradecemos
                        que nos lo comuniques.
                    </P>
                    <Warning>
                        Nuestras guías de primeros auxilios son una ayuda cuando no hay asistencia profesional disponible.
                        No reemplazan una capacitación certificada en primeros auxilios ni la intervención de paramédicos
                        o personal médico entrenado.
                    </Warning>
                </Section>

                <Section title="4. Lo que Horus no es">
                    <P>
                        Queremos ser muy claros en esto porque tu seguridad depende de entenderlo bien:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Li><strong>Horus no es un servicio de emergencias.</strong> No despachamos ambulancias, no monitoreamos tu estado de salud en tiempo real y no reemplazamos al 123, al 132 (Cruz Roja) ni al 119 (Bomberos).</Li>
                        <Li><strong>Horus no es un médico.</strong> Nuestro asistente de inteligencia artificial te orienta, pero sus respuestas no son un diagnóstico médico ni una prescripción. Ante cualquier síntoma o duda de salud, acude a un profesional.</Li>
                        <Li><strong>Horus no verifica tu información médica.</strong> La precisión de tu perfil depende de los datos que tú mismo ingresas. Es tu responsabilidad mantenerlos actualizados y correctos.</Li>
                        <Li><strong>Horus no garantiza disponibilidad permanente.</strong> Como cualquier plataforma tecnológica, puede presentar fallas técnicas o mantenimientos programados. No dependas de Horus como única fuente de información en una emergencia.</Li>
                    </ul>
                    <P>
                        Por estas razones, en la medida en que lo permiten las leyes colombianas, Horus no se hace responsable
                        por daños o perjuicios que puedan derivarse del uso o la imposibilidad de uso de la plataforma en
                        una situación de emergencia real.
                    </P>
                </Section>

                <Section title="5. Tu cuenta: cómo crearla y cuidarla">
                    <P>
                        Para usar Horus necesitas crear una cuenta personal. Al registrarte, declaras que:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Li>Tienes 18 años o más, o cuentas con autorización de tu representante legal.</Li>
                        <Li>La información que proporcionas es verdadera y es tuya (o tienes autorización para registrarla).</Li>
                        <Li>Mantendrás tu contraseña en privado y no la compartirás con nadie.</Li>
                        <Li>Nos avisarás de inmediato si crees que alguien accedió a tu cuenta sin tu permiso.</Li>
                    </ul>
                    <P>
                        Horus puede suspender o eliminar cuentas que incumplan estos términos, que usen información falsa
                        o que utilicen la plataforma con fines distintos a los declarados.
                    </P>
                </Section>

                <Section title="6. Cosas que no puedes hacer en Horus">
                    <P>
                        Al usar Horus te comprometes a no:
                    </P>
                    <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Li>Registrar información médica falsa o que no te pertenece.</Li>
                        <Li>Usar la plataforma para engañar a otras personas o con fines ilegales.</Li>
                        <Li>Compartir tu cuenta con otras personas.</Li>
                        <Li>Intentar acceder a los sistemas de Horus de manera no autorizada.</Li>
                        <Li>Copiar o distribuir nuestros protocolos de primeros auxilios sin permiso.</Li>
                    </ul>
                </Section>

                <Section title="7. Nuestro contenido es de nuestra propiedad">
                    <P>
                        Todo lo que ves en Horus — el diseño, los textos, los protocolos, el asistente de IA y la tecnología
                        detrás de la plataforma — es propiedad de Horus Health o de nuestros socios tecnológicos. Al usar
                        la plataforma, te damos permiso para usarla de forma personal y no comercial. Ese permiso no te
                        da derecho a copiar, vender ni redistribuir nuestro contenido.
                    </P>
                </Section>

                <Section title="8. Tu privacidad">
                    <P>
                        El manejo de tus datos personales y de salud está explicado en detalle en nuestra{" "}
                        <Link href="/privacy" style={{ color: "var(--h-text)", fontWeight: 700, textUnderlineOffset: "2px" }}>
                            Política de Privacidad
                        </Link>.
                        Al aceptar estos Términos, también aceptas esa política. Tus datos están protegidos por la{" "}
                        <strong>Ley 1581 de 2012</strong> de Colombia (Ley de Protección de Datos Personales) y el{" "}
                        <strong>Decreto 1377 de 2013</strong>. Tienes derecho a acceder, corregir y eliminar tu información
                        en cualquier momento.
                    </P>
                </Section>

                <Section title="9. Cambios en el servicio y en estos Términos">
                    <P>
                        Podemos actualizar o modificar estos Términos cuando sea necesario. Si los cambios son importantes,
                        te avisaremos por correo electrónico con al menos 15 días de anticipación. Si después de ese aviso
                        continúas usando Horus, entendemos que aceptas los nuevos términos.
                    </P>
                    <P>
                        También podemos pausar o discontinuar alguna funcionalidad de la plataforma si hay razones técnicas
                        o legales que lo justifiquen. Haremos nuestro mejor esfuerzo para avisarte con tiempo.
                    </P>
                </Section>

                <Section title="10. Cancelación de tu cuenta">
                    <P>
                        Puedes eliminar tu cuenta cuando quieras escribiéndonos a nuestro correo de soporte. Al hacerlo,
                        todos tus datos serán eliminados de forma permanente e irreversible. Si decides cancelar, te
                        recomendamos exportar o anotar cualquier información médica importante antes de hacerlo.
                    </P>
                </Section>

                <Section title="11. Ley aplicable">
                    <P>
                        Horus opera bajo las leyes de la República de Colombia. Cualquier disputa relacionada con el uso
                        de la plataforma se resolverá ante los tribunales competentes de la ciudad de Medellín, Colombia,
                        de acuerdo con la legislación nacional vigente.
                    </P>
                </Section>

                <Section title="12. ¿Tienes preguntas?">
                    <P>
                        Si tienes dudas sobre estos Términos, sobre cómo manejamos tu información o sobre cualquier aspecto
                        de la plataforma, escríbenos. Estamos para ayudarte.
                    </P>
                    <div style={{
                        background: "var(--h-card)", border: "1px solid var(--h-border)",
                        borderRadius: "12px", padding: "20px 24px",
                        display: "flex", flexDirection: "column", gap: "6px",
                    }}>
                        <p style={{ fontSize: "14px", fontWeight: 800, color: "var(--h-text)" }}>Horus Health</p>
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
                    <Link href="/privacy" style={{ fontSize: "13px", fontWeight: 700, color: "var(--h-text)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                        Política de Privacidad
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

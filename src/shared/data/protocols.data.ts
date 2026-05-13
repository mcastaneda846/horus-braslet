import type { Protocol } from "@/src/domain/first-aid/protocol.entity";

export const PROTOCOLS: Protocol[] = [
    // PARO CARDÍACO / RCP
    {
        id:           "rcp-adulto",
        title:        "RCP en Adulto",
        severity:     "critical",
        category:     "cardiac",
        callEmergency: true,
        estimatedTime: 10,
        keywords:     ["rcp", "paro", "cardiaco", "corazon", "no respira", "sin pulso", "reanimacion", "muerto"],
        symptoms:     ["no respira", "sin pulso", "inconsciente", "no reacciona"],
        priorityKeywords: ["no respira", "sin pulso", "inconsciente"],
        emergencyTriggers: ["no respira", "sin pulso", "no despierta", "no responde"],
        aliases: ["paro cardiaco", "paro al corazon", "cardiac arrest"],
        warnings:     [
            "Llama al 123 ANTES de iniciar RCP",
            "No muevas al paciente si sospechas lesión de cuello",
            "Continúa hasta que llegue ayuda profesional",
        ],
        steps: [
            { id: 1, instruction: "Verifica que la escena sea segura para ti", warning: "No te pongas en peligro" },
            { id: 2, instruction: "Sacude al paciente y grita: ¿Estás bien?", duration: 5 },
            { id: 3, instruction: "Llama al 123 o pide a alguien que llame", warning: "Hazlo AHORA antes de continuar" },
            { id: 4, instruction: "Inclina la cabeza hacia atrás y eleva el mentón para abrir la vía aérea" },
            { id: 5, instruction: "Verifica respiración durante máximo 10 segundos", duration: 10 },
            { id: 6, instruction: "Coloca el talón de tu mano en el centro del pecho (esternón)", warning: "Entrelaza tus manos" },
            { id: 7, instruction: "Realiza 30 compresiones fuertes y rápidas", duration: 18, warning: "Hunde el pecho 5-6 cm a ritmo de 100-120 por minuto" },
            { id: 8, instruction: "Da 2 respiraciones de rescate tapando la nariz", duration: 4 },
            { id: 9, instruction: "Repite ciclos de 30 compresiones + 2 respiraciones", warning: "Continúa hasta que llegue ayuda o el paciente respire" },
        ],
        decisionTree: [
            {
                id:       "respira",
                question: "¿La persona respira normalmente?",
                yes:      "posicion-lateral",
                no:       "tiene-pulso",
            },
            {
                id:       "tiene-pulso",
                question: "¿La persona tiene pulso (revisa el cuello durante 10 segundos)?",
                yes:      [
                    { id: 1, instruction: "Da respiraciones de rescate: 1 cada 5-6 segundos", duration: 6 },
                    { id: 2, instruction: "Verifica el pulso cada 2 minutos", duration: 120 },
                ],
                no: "iniciar-rcp",
            },
            {
                id:       "posicion-lateral",
                question: "¿La persona está inconsciente pero respira?",
                yes: [
                    { id: 1, instruction: "Coloca en posición lateral de seguridad" },
                    { id: 2, instruction: "Monitorea la respiración constantemente", duration: 60 },
                ],
                no: [
                    { id: 1, instruction: "Mantén al paciente cómodo y vigilado" },
                    { id: 2, instruction: "Llama al 123 si empeora" },
                ],
            },
            {
                id:      "iniciar-rcp",
                question: "¿Hay un DEA (desfibrilador) disponible cerca?",
                yes: [
                    { id: 1, instruction: "Trae el DEA y úsalo inmediatamente siguiendo las instrucciones de voz" },
                    { id: 2, instruction: "Continúa RCP entre las descargas" },
                ],
                no: [
                    { id: 1, instruction: "Inicia RCP: 30 compresiones + 2 respiraciones", duration: 18 },
                    { id: 2, instruction: "Continúa hasta que llegue el DEA o ayuda médica" },
                ],
            },
        ],
    },

    // ATRAGANTAMIENTO
    {
        id:           "atragantamiento-adulto",
        title:        "Atragantamiento en Adulto",
        severity:     "critical",
        category:     "respiratory",
        callEmergency: true,
        estimatedTime: 3,
        keywords:     ["atragantado", "asfixia", "ahogo", "no puede respirar", "objeto atorado", "heimlich", "garganta"],
        symptoms:     ["no puede hablar", "se lleva manos a garganta", "cara azul", "no puede toser", "no respira"],
        aliases: ["ahogo", "atragantamiento", "ahogandose"],
        emergencyTriggers: ["no puede hablar", "no respira", "perdida de conciencia"],
        warnings:     [
            "Si puede toser fuerte, NO intervengas — anímalo a toser",
            "Si no puede respirar ni toser, actúa INMEDIATAMENTE",
            "En embarazadas y obesos: compresiones en el pecho, no en el abdomen",
        ],
        steps: [
            { id: 1, instruction: "Pregunta: ¿Te estás atragantando? Si asiente, actúa" },
            { id: 2, instruction: "Inclínalo hacia adelante y da 5 golpes fuertes en la espalda con el talón de la mano", warning: "Entre los omóplatos" },
            { id: 3, instruction: "Si no funciona: párate detrás, rodea su cintura con tus brazos" },
            { id: 4, instruction: "Coloca un puño justo encima del ombligo, cúbrelo con la otra mano" },
            { id: 5, instruction: "Realiza 5 compresiones abdominales hacia adentro y arriba (Maniobra de Heimlich)", duration: 10 },
            { id: 6, instruction: "Alterna 5 golpes en espalda + 5 compresiones hasta que el objeto salga", warning: "Si pierde el conocimiento, inicia RCP" },
        ],
        decisionTree: [
            {
                id:       "puede-toser",
                question: "¿La persona puede toser fuerte o hablar?",
                yes: [
                    { id: 1, instruction: "Anímalo a seguir tosiendo fuertemente" },
                    { id: 2, instruction: "Supervisa hasta que el objeto salga o empeore" },
                ],
                no: "consciente",
            },
            {
                id:       "consciente",
                question: "¿La persona está consciente?",
                yes: [
                    { id: 1, instruction: "Aplica maniobra de Heimlich: 5 golpes en espalda + 5 compresiones abdominales" },
                    { id: 2, instruction: "Repite hasta que el objeto salga o pierda conciencia" },
                ],
                no: [
                    { id: 1, instruction: "Llama al 123 inmediatamente" },
                    { id: 2, instruction: "Inicia RCP — las compresiones pueden expulsar el objeto" },
                ],
            },
        ],
    },

    // QUEMADURAS
    {
        id:           "quemaduras",
        title:        "Quemaduras",
        severity:     "urgent",
        category:     "burns",
        callEmergency: false,
        estimatedTime: 15,
        keywords:     ["quemadura", "quemado", "aceite", "fuego", "calor", "agua caliente", "electricidad", "sol"],
        symptoms:     ["piel roja", "ampollas", "dolor intenso", "piel negra", "piel blanca"],
        aliases: ["me queme", "me quemé", "quemadura por aceite", "aceite caliente"],
        priorityKeywords: ["quemadura","aceite","agua caliente"],
        warnings:     [
            "NUNCA uses hielo — daña más la piel",
            "NUNCA revientes las ampollas",
            "NUNCA apliques pasta de dientes, mantequilla o remedios caseros",
            "Si la quemadura es eléctrica, llama al 123",
        ],
        steps: [
            { id: 1, instruction: "Retira al paciente de la fuente de calor con seguridad" },
            { id: 2, instruction: "Enfría la quemadura con agua fría corriente durante 20 minutos", duration: 1200, warning: "Agua fría, NO helada" },
            { id: 3, instruction: "Retira ropa y joyas cerca de la quemadura SOLO si no están pegadas a la piel" },
            { id: 4, instruction: "Cubre con un apósito limpio o tela que no suelte pelusa" },
            { id: 5, instruction: "Busca atención médica si la quemadura es grande, profunda o en cara/manos/genitales" },
        ],
    },

    // CONVULSIONES
    {
        id:           "convulsiones",
        title:        "Convulsiones / Epilepsia",
        severity:     "urgent",
        category:     "neurological",
        callEmergency: false,
        estimatedTime: 5,
        keywords:     ["convulsion", "epilepsia", "epileptico", "temblores", "sacudidas", "ataque", "caída al suelo"],
        symptoms:     ["sacudidas", "pérdida de conciencia", "espuma en boca", "ojos en blanco", "rigidez"],
        warnings:     [
            "NUNCA metas nada en la boca",
            "NUNCA sujetes al paciente para detener los movimientos",
            "Llama al 123 si dura más de 5 minutos o si es la primera vez",
        ],
        steps: [
            { id: 1, instruction: "Protege la cabeza con algo suave (ropa, mochila)" },
            { id: 2, instruction: "Retira objetos peligrosos alrededor" },
            { id: 3, instruction: "Afloja ropa ajustada en cuello" },
            { id: 4, instruction: "Mide el tiempo de la convulsión", duration: 300, warning: "Si pasa de 5 minutos llama al 123" },
            { id: 5, instruction: "Cuando termine, coloca en posición lateral de seguridad" },
            { id: 6, instruction: "Habla tranquilamente al paciente mientras recupera la conciencia" },
        ],
    },

    // REACCIÓN ALÉRGICA GRAVE
    {
        id:           "anafilaxia",
        title:        "Anafilaxia / Reacción Alérgica Grave",
        severity:     "critical",
        category:     "allergic",
        callEmergency: true,
        estimatedTime: 5,
        keywords:     ["alergia", "anafilaxia", "epinefrina", "adrenalina", "picadura", "abeja", "cacahuate", "mani", "hinchazón"],
        symptoms:     ["dificultad para respirar", "hinchazón cara", "urticaria", "mareo", "vómito", "presión baja"],
        warnings:     [
            "Llama al 123 INMEDIATAMENTE",
            "Si tiene EpiPen, úsalo en el muslo externo",
            "Puede necesitar segunda dosis en 5-15 minutos",
        ],
        steps: [
            { id: 1, instruction: "Llama al 123 INMEDIATAMENTE", warning: "Esta es una emergencia que amenaza la vida" },
            { id: 2, instruction: "Pregunta si tiene epinefrina (EpiPen) — si sí, ayúdalo a usarla en el muslo externo" },
            { id: 3, instruction: "Acuesta al paciente con las piernas elevadas (a menos que tenga dificultad respiratoria)" },
            { id: 4, instruction: "Si tiene dificultad respiratoria, siéntalo en posición cómoda" },
            { id: 5, instruction: "Mantén al paciente abrigado y calmado" },
            { id: 6, instruction: "Si pierde la conciencia y no respira, inicia RCP" },
        ],
    },

    // HERIDA CON SANGRADO
    {
        id:           "sangrado",
        title:        "Hemorragia / Sangrado Grave",
        severity:     "urgent",
        category:     "trauma",
        callEmergency: false,
        estimatedTime: 10,
        keywords:     ["sangrado", "hemorragia", "herida", "corte", "sangre", "herido"],
        symptoms:     ["sangrado abundante", "sangre que no para", "herida profunda"],
        warnings:     [
            "Usa guantes si tienes",
            "NUNCA retires un objeto incrustado en la herida",
            "Si el sangrado no cede en 10 minutos, llama al 123",
        ],
        steps: [
            { id: 1, instruction: "Aplica presión directa con tela limpia o gasa" },
            { id: 2, instruction: "Mantén presión constante durante al menos 10 minutos", duration: 600, warning: "No levantes la tela para revisar" },
            { id: 3, instruction: "Si la tela se empapa, agrega más encima sin quitar la primera" },
            { id: 4, instruction: "Eleva la extremidad herida por encima del nivel del corazón si es posible" },
            { id: 5, instruction: "Si el sangrado no cede, aplica presión en la arteria principal del miembro" },
        ],
    },

    // GOLPE DE CALOR
    {
        id:           "golpe-calor",
        title:        "Golpe de Calor / Insolación",
        severity:     "urgent",
        category:     "trauma",
        callEmergency: true,
        estimatedTime: 15,
        keywords:     ["calor", "insolacion", "golpe de calor", "deshidratacion", "temperatura", "fiebre calor"],
        symptoms:     ["piel caliente y seca", "confusión", "temperatura mayor a 40°C", "sin sudor"],
        warnings:     [
            "El golpe de calor es una emergencia — puede causar daño cerebral",
            "Llama al 123 si hay confusión o pérdida de conciencia",
        ],
        steps: [
            { id: 1, instruction: "Lleva al paciente a un lugar fresco y sombreado" },
            { id: 2, instruction: "Retira ropa excesiva" },
            { id: 3, instruction: "Aplica paños húmedos fríos en cuello, axilas e ingles", duration: 300 },
            { id: 4, instruction: "Si está consciente, dale agua fresca en pequeños sorbos" },
            { id: 5, instruction: "Abanica al paciente para aumentar la evaporación" },
            { id: 6, instruction: "Llama al 123 si la temperatura no baja o hay confusión" },
        ],
    },

    //  FRACTURA
    {
        id:           "fractura",
        title:        "Fractura / Hueso Roto",
        severity:     "urgent",
        category:     "trauma",
        callEmergency: false,
        estimatedTime: 10,
        keywords:     ["fractura", "hueso roto", "caida", "golpe", "brazo roto", "pierna rota", "clavícula"],
        symptoms:     ["dolor intenso", "deformidad", "hinchazón", "incapacidad de mover", "crujido"],
        warnings:     [
            "NUNCA intentes acomodar el hueso",
            "Si hay hueso expuesto, cubre con tela limpia húmeda",
            "Fractura de columna: NO muevas al paciente",
        ],
        steps: [
            { id: 1, instruction: "Inmoviliza la zona afectada en la posición en que está" },
            { id: 2, instruction: "Aplica hielo envuelto en tela para reducir la inflamación", duration: 600, warning: "Nunca hielo directo sobre la piel" },
            { id: 3, instruction: "Improvisa un cabestrillo o férula con lo que tengas" },
            { id: 4, instruction: "Lleva al paciente a urgencias o llama al 123" },
        ],
    },

    // INTOXICACIÓN / ENVENENAMIENTO
    {
        id:           "intoxicacion",
        title:        "Intoxicación / Envenenamiento",
        severity:     "critical",
        category:     "poisoning",
        callEmergency: true,
        estimatedTime: 5,
        keywords:     ["veneno", "intoxicacion", "quimico", "cloro", "medicamento", "sobredosis", "toxico"],
        symptoms:     ["vómito", "mareo", "dolor abdominal", "dificultad respiratoria", "quemaduras en boca"],
        warnings:     [
            "NO provoques el vómito a menos que te lo indique un médico",
            "Lleva el envase del químico o medicamento al hospital",
            "Llama al 123 INMEDIATAMENTE si está inconsciente",
        ],
        steps: [
            { id: 1, instruction: "Asegura la escena y aleja al paciente de la fuente tóxica (gas, químicos)" },
            { id: 2, instruction: "Si el tóxico está en la piel o los ojos, enjuaga con agua corriente durante 15-20 minutos", duration: 900 },
            { id: 3, instruction: "Si ingirió algo tóxico, limpia su boca pero no provoques el vómito" },
            { id: 4, instruction: "Revisa constantemente la respiración y el estado de conciencia" },
            { id: 5, instruction: "Comunícate con emergencias e indica qué, cuánto y cuándo lo tomó" },
        ],
    },

    // CRISIS DE ASMA
    {
        id:           "crisis-asma",
        title:        "Crisis de Asma / Ahogo",
        severity:     "urgent",
        category:     "respiratory",
        callEmergency: false,
        estimatedTime: 10,
        keywords:     ["asma", "inhalador", "salbutamol", "ahogo", "dificultad para respirar", "silbido"],
        symptoms:     ["silbidos al respirar", "pecho apretado", "tos persistente", "falta de aire", "labios azulados"],
        warnings:     [
            "Si no tiene inhalador o no mejora, llama al 123",
            "Mantén la calma para no agravar su ansiedad",
            "No lo acuestes, mantenlo sentado",
        ],
        steps: [
            { id: 1, instruction: "Ayúdalo a sentarse erguido y afloja su ropa" },
            { id: 2, instruction: "Pregúntale si tiene su inhalador de rescate (salbutamol) y ayúdalo a usarlo" },
            { id: 3, instruction: "Adminístrale 1 o 2 puff del inhalador con aerocámara si la tiene" },
            { id: 4, instruction: "Espera 5 minutos y evalúa si respira mejor", duration: 300 },
            { id: 5, instruction: "Si no hay mejoría, repite la dosis y llama al servicio de emergencias" },
        ],
    },

    // HIPOGLUCEMIA / BAJÓN DE AZÚCAR
    {
        id:           "hipoglucemia",
        title:        "Hipoglucemia / Bajón de Azúcar",
        severity:     "urgent",
        category:     "other",
        callEmergency: false,
        estimatedTime: 15,
        keywords:     ["azucar", "diabetes", "diabetico", "desmayo", "sudor frio", "hipoglucemia", "hambre"],
        symptoms:     ["sudor frío", "temblor", "palidez", "debilidad", "visión borrosa", "confusión"],
        warnings:     [
            "NO le des nada por la boca si está inconsciente",
            "Prefiere líquidos azucarados o azúcar diluida en agua",
            "Llama al 123 si no mejora en 15 minutos o pierde la conciencia",
        ],
        steps: [
            { id: 1, instruction: "Si está consciente, dale 15 gramos de carbohidratos (medio vaso de jugo, agua con azúcar o caramelos)" },
            { id: 2, instruction: "Pídele que descanse sentado o acostado" },
            { id: 3, instruction: "Espera 15 minutos para que suba el nivel de azúcar", duration: 900 },
            { id: 4, instruction: "Si se siente mejor, dale una pequeña comida (galletas o pan)" },
            { id: 5, instruction: "Si está inconsciente, colócalo de lado y llama al 123 rápido" },
        ],
    }
];
    # Horus Bracelet

## Description

**Horus Bracelet** is a web application focused on **health and safety**, designed to integrate with an NFC bracelet.

Its goal is to allow anyone, in emergency situations, to access critical user information within seconds, enabling faster and more appropriate care.

## Problem

People who suffer a medical emergency are often unable to communicate their health condition, which delays proper care.

Currently, there are no accessible solutions that combine:

- Immediate identification
- Critical medical information
- Real-time guided assistance
- Risk prevention

## Solution

Horus Bracelet proposes an integrated system that:

- Identifies the user through **NFC** technology
- Displays critical medical information in seconds
- Allows quick access to emergency contacts
- Integrates intelligent assistance to act in critical situations
- Evolves into a preventive health risk system

## How does it work?

1. The user creates an account and registers their medical profile
2. The information is linked to a unique NFC bracelet
3. In case of emergency, the bracelet is scanned
4. An optimized view with key data is displayed
5. (Future) An intelligent assistant guides the response in real time

## Main features

### User management

- Secure registration and authentication
- Complete medical profile (allergies, conditions, medications)
- Emergency contacts

### Medical information

- Medical history
- Digital medical documents
- Quick emergency view

### NFC integration

- Unique identifier per user
- Instant scan and access
- QR code fallback

### AI assistance (in progress)

- First aid instructions
- Responses adapted to the medical profile
- Stress-mode interaction

### Prevention and alerts (future vision)

- Risk detection
- Smart alerts
- Location sharing in emergencies

### Security and privacy

- Access control to information
- User consent
- Data protection and encryption

## Future vision

The project will evolve into a platform that not only reacts to emergencies but also:

- Prevents health risks
- Assists actively in real time
- Improves decision-making in critical situations using AI

## Objective

To create an accessible, fast, and reliable solution that can **save lives** by providing critical information at the right time.

## Project status

In development — early stage (foundations and architecture)

## Current focus

The first iterations of the product are focused on:

- User registration and authentication
- Medical profile setup
- NFC integration
- Accessible emergency page
- Basic AI assistance
- Core security implementation

## Fuentes externas (RAG)

Este proyecto puede ingestar fuentes externas en formato web (HTML) y convertirlas a Markdown antes de indexarlas.

1) Edita `docs/external-sources.json` con tus URLs.
2) Levanta el servidor y ejecuta el script:

```powershell
npm run dev
```

```powershell
node scripts/ingest-urls.mjs
```

Si necesitas apuntar a otro endpoint, usa `INGEST_API_URL`:

```powershell
$env:INGEST_API_URL = "http://localhost:3000/api/ai/ingest"
node scripts/ingest-urls.mjs
```

## Pinecone: ¿borrar todo o reindexar?

- **Cambiaste solo el prompt o lógica:** no reindexes.
- **Cambiaste contenido del manual o fuentes:** reindexa.
- **No quieres duplicados:** borra los vectores del índice o recrea el índice.

Para reset total, borra el índice en Pinecone y créalo de nuevo con el nombre `horus-first-aid`.
Luego reingesta:

```powershell
node scripts/ingest.mjs docs/primeros-auxilios.md
node scripts/ingest-urls.mjs
```



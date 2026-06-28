import { NextResponse } from 'next/server';
import { saveMedicalDocument } from '@/src/application/historyMedical/saveMedicalDocument';
import { correctOcrText, structureMedicalText, normalizeMedicationNames } from '@/src/infrastructure/ai/openai';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/heic',
  // Document types
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/json',
]);
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fileEntry = formData.get('file');
    const userIdRaw = formData.get('userId');

    const userId = typeof userIdRaw === 'string' ? userIdRaw.trim() : String(userIdRaw || '').trim();
    if (!fileEntry) {
      return NextResponse.json({ error: 'file is required (form-data key: file)' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId is required (form-data key: userId)' }, { status: 400 });
    }

    if (typeof fileEntry === 'string' || typeof fileEntry.arrayBuffer !== 'function') {
      return NextResponse.json({ error: 'file must be uploaded as form-data file' }, { status: 400 });
    }

    const file = fileEntry as File;

    // Validate MIME type
    const mimeType = file.type || undefined;
    if (mimeType && !ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo se aceptan PDF e imágenes.' }, { status: 415 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Validate file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx 50MB)' }, { status: 413 });
    }

    const filename = file.name || undefined;

    // 1. Guardar en Firebase y extraer texto OCR.
    const updatedRecord = await saveMedicalDocument(fileBuffer, userId, { filename, mimeType });

    // 2. Extraer texto OCR del documento recién guardado.
    const latestDocument = updatedRecord.documents[updatedRecord.documents.length - 1];
    const firebaseOcrText = latestDocument?.extractedText || '';

    let structuredData = null;
    let normalizedMedications: Record<string, string> = {};

    if (firebaseOcrText && firebaseOcrText.trim() !== '') {
      console.log(`[API Bridge] Texto OCR extraído. Estructurando con IA para revisión del usuario: ${userId}`);
      try {
        // Estructurar con IA pero NO guardar en Postgres — el cliente revisará y confirmará.
        const cleanText = await correctOcrText(firebaseOcrText);
        structuredData = await structureMedicalText(cleanText);

        if (structuredData?.medications && structuredData.medications.length > 0) {
          const rawNames = structuredData.medications
            .map((m: { customMedicationName?: string }) => m.customMedicationName)
            .filter((n): n is string => typeof n === 'string' && n.length > 0);
          if (rawNames.length > 0) {
            normalizedMedications = await normalizeMedicationNames(rawNames);
          }
        }
      } catch (aiError) {
        console.error('[API Bridge] Error al estructurar con IA:', aiError);
      }
    } else {
      console.warn('[API Bridge] El documento se guardó pero no se detectó texto OCR.');
    }

    return NextResponse.json({ publicId: latestDocument?.publicId ?? null, ...updatedRecord, structuredData, normalizedMedications }, { status: 201 });
  } catch (error: Omit<Error, never> | unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}

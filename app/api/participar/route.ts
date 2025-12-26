import { NextResponse } from "next/server";
import { storage } from "@/lib/gcs";
import prisma from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/captcha/verifyTurnstile";

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
if (!BUCKET_NAME) {
  throw new Error("GCS_BUCKET_NAME is not defined");
}
const bucket = storage.bucket(BUCKET_NAME);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nombre,
      apellido,
      email,
      whatsapp,
      captchaToken,
      aceptaTerminos,
      imagen,
    } = body;

    if (
      !nombre ||
      !apellido ||
      !email ||
      !whatsapp ||
      !captchaToken ||
      !aceptaTerminos ||
      !imagen
    ) {
      return NextResponse.json(
        { ok: false, message: "Campos obligatorios faltantes." },
        { status: 400 }
      );
    }

    // --- VALIDACIÓN DE CAPTCHA ---
    const captchaValid = await verifyTurnstileToken(captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { ok: false, message: "Captcha inválido." },
        { status: 401 }
      );
    }

    // --- PROCESAMIENTO DE IMAGEN ---
    const base64Data = imagen.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileExtension = "jpg";
    const fileName = `boletas/${Date.now()}-${nombre
      .toLowerCase()
      .replace(/\s+/g, "_")}.${fileExtension}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: "image/jpeg" },
    });

    const storagePath = fileName;

    const es_ganador = Math.random() > 0.9;
    const premio = es_ganador ? "Premio" : "";

    const participacion = await prisma.participacion.create({
      data: {
        boleta_path: storagePath,
        es_ganador,
        premio,
        usuario: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              nombre,
              apellido,
              email,
              whatsapp,
              rol: "USER",
            },
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      isWinner: participacion.es_ganador,
      premio: participacion.premio,
    });
  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}

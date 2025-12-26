import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage({
  keyFilename: path.join(process.cwd(), "secrets", "google-bucket.json"),
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME;

try {
  console.log("BUCKET_NAME:", BUCKET_NAME);
} catch (error) {
  console.error("BUCKET_NAME_ERROR:", error);
}

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
    try {
      console.log(
        "process.env.TURNSTILE_SECRET_KEY:",
        process.env.TURNSTILE_SECRET_KEY === undefined ? "undefined" : "defined"
      );
    } catch (error) {
      console.error("TURNSTILE_SECRET_KEY:", error);
    }
    // --- VALIDACIÓN DE CAPTCHA ---
    const captchaResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: captchaToken,
        }),
      }
    );

    const captchaData = await captchaResponse.json();
    if (!captchaData.success) {
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

    // console.log("Datos para guardar en DB:", {
    //   nombre,
    //   email,
    //   whatsapp,
    //   boleta_referencia: storagePath,
    // });

    // Lógica de ganador
    const isWinner = Math.random() > 0.9;

    return NextResponse.json({
      ok: true,
      isWinner,
    });
  } catch (error) {
    console.error("API_ERROR:", error);
    return NextResponse.json(
      { ok: false, message: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";
import { toast } from "sonner";
import Image from "next/image";
import ScratchStep from "@/components/ScratchStep";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  apellido: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(8, "El numero debe tener al menos 8 caracteres"),
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos para participar.",
  }),
  captchaToken: z.string().min(1, "Completa el captcha para participar."),
  imagen: z
    .string()
    .min(1, "La foto de tu boleta es obligatoria para participar."),
});

type FormData = z.infer<typeof formSchema>;

export function FormStep({ onBack }: { onBack: () => void }) {
  const [showScratch, setShowScratch] = useState(false);
  const [isWinner, setIsWinner] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aceptaTerminos: false,
      imagen: "",
      captchaToken: "",
    },
  });

  const imagenValue = watch("imagen");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("imagen", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/participar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.ok) {
        toast.error(
          "No se pudo enviar tu participación. Intenta nuevamente mas tarde."
        );
        return;
      }

      setIsWinner(result.isWinner);
      setShowScratch(true);
    } catch (err) {
      console.error(err);
      toast.error(
        "No se pudo enviar tu participación. Intenta nuevamente mas tarde."
      );
    }
  };

  if (showScratch) return <ScratchStep isWinner={isWinner} />;

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-[#52FF00] hover:bg-[#52FF00]/10 hover:text-[#52FF00] cursor-pointer"
        >
          ← Volver
        </Button>

        <div className="bg-black border-2 border-[#52FF00]/30 rounded-3xl shadow-2xl shadow-[#52FF00]/20 p-6 md:p-8">
          <h2 className="text-3xl font-bold text-[#52FF00] mb-2 uppercase">
            Formulario de Participación
          </h2>
          <p className="text-gray-400 mb-6">
            Completa todos los campos para participar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                Foto de la Boleta *
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors bg-[#52FF00]/5 ${
                  errors.imagen
                    ? "border-red-500"
                    : "border-[#52FF00]/30 hover:border-[#52FF00]"
                }`}
              >
                {imagenValue ? (
                  <div className="space-y-3">
                    <Image
                      src={imagenValue}
                      alt="Boleta"
                      width={200}
                      height={200}
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setValue("imagen", "")}
                      className="border-[#52FF00] text-black hover:text-[#52FF00] hover:bg-[#52FF00]/10 cursor-pointer"
                    >
                      Cambiar imagen
                    </Button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-4xl">📸</div>
                        <p className="text-sm font-medium text-white">
                          Toca para tomar foto o subir imagen
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
              {errors.imagen && (
                <p className="text-red-500 text-xs">{errors.imagen.message}</p>
              )}
            </div>

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Nombre *
                </label>
                <input
                  {...register("nombre")}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs">
                    {errors.nombre.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Apellido *
                </label>
                <input
                  {...register("apellido")}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent"
                />
                {errors.apellido && (
                  <p className="text-red-500 text-xs">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                Email *
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                WhatsApp *
              </label>
              <input
                {...register("whatsapp")}
                type="tel"
                placeholder="+56 9 1234 5678"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent"
              />
              {errors.whatsapp && (
                <p className="text-red-500 text-xs">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            <TurnstileCaptcha
              onVerify={(token) =>
                setValue("captchaToken", token || "", { shouldValidate: true })
              }
            />
            {errors.captchaToken && (
              <p className="text-red-500 text-xs">
                {errors.captchaToken.message}
              </p>
            )}

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-3 bg-[#52FF00]/10 border border-[#52FF00]/30 p-4 rounded-lg">
                <input
                  type="checkbox"
                  {...register("aceptaTerminos")}
                  className="mt-1 w-4 h-4 text-[#52FF00] bg-zinc-900 border-[#52FF00]/30 rounded focus:ring-[#52FF00] cursor-pointer"
                  id="terminos"
                />
                <label htmlFor="terminos" className="text-sm text-white">
                  Acepto los términos y condiciones del concurso y autorizo el
                  uso de mis datos personales *
                </label>
              </div>
              {errors.aceptaTerminos && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.aceptaTerminos.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="cursor-pointer w-full h-14 text-3xl font-teko font-black bg-[#52FF00] text-black hover:bg-[#45DD00] uppercase tracking-wide shadow-lg shadow-[#52FF00]/50 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Continuar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

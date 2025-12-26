"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  captchaToken: z.string().min(1, "Completa el captcha para continuar."),
});

type FormData = z.infer<typeof formSchema>;

export default function SigninPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      captchaToken: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // TODO: Implement actual signin logic here using data.email and data.password
      console.log("Signin Data:", data);

      // Simulating a request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Has iniciado sesión correctamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-zinc-900 to-black py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-black border-2 border-[#52FF00]/30 rounded-3xl shadow-2xl shadow-[#52FF00]/20 p-6 md:p-8">
          <h2 className="text-3xl font-bold text-[#52FF00] mb-2 uppercase text-center">
            Iniciar Sesión
          </h2>
          <p className="text-gray-400 mb-6 text-center">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                Correo Electrónico
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                Contraseña
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-[#52FF00]/30 text-white focus:ring-2 focus:ring-[#52FF00] focus:border-transparent outline-none transition-all placeholder:text-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#52FF00] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="w-full">
                <TurnstileCaptcha
                  onVerify={(token) =>
                    setValue("captchaToken", token || "", {
                      shouldValidate: true,
                    })
                  }
                />
                {errors.captchaToken && (
                  <p className="text-red-500 text-xs text-center mt-2">
                    {errors.captchaToken.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="cursor-pointer w-full h-14 text-2xl font-teko font-black bg-[#52FF00] text-black hover:bg-[#45DD00] uppercase tracking-wide shadow-lg shadow-[#52FF00]/50 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

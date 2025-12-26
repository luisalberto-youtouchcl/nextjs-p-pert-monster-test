"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Ticket, Download, Search, Filter } from "lucide-react";

// Mock Data
const participations = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    rut: "12.345.678-9",
    date: "2024-05-20 14:30",
    status: "Ganador",
    prize: "Gorró Monster",
    code: "M-123456",
  },
  {
    id: "2",
    name: "María González",
    email: "maria.gonzalez@example.com",
    rut: "9.876.543-2",
    date: "2024-05-20 15:15",
    status: "Participante",
    prize: "-",
    code: "M-789012",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos.r@example.com",
    rut: "15.678.901-3",
    date: "2024-05-20 16:00",
    status: "Ganador",
    prize: "Polera Monster",
    code: "M-345678",
  },
  {
    id: "4",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    rut: "18.234.567-K",
    date: "2024-05-21 09:45",
    status: "Participante",
    prize: "-",
    code: "M-901234",
  },
  {
    id: "5",
    name: "Pedro Morales",
    email: "pedro.m@example.com",
    rut: "11.222.333-4",
    date: "2024-05-21 11:20",
    status: "Participante",
    prize: "-",
    code: "M-567890",
  },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-teko font-bold uppercase text-[#52FF00]">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              Resumen de participaciones y premios
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-[#52FF00]/30 hover:bg-[#52FF00]/10 text-[#52FF00] hover:text-[#52FF00]"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900/50 border-[#52FF00]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Participaciones
              </CardTitle>
              <Ticket className="h-4 w-4 text-[#52FF00]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">1,248</div>
              <p className="text-xs text-gray-500 mt-1">
                +180 en las últimas 24h
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-[#52FF00]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Ganadores
              </CardTitle>
              <Trophy className="h-4 w-4 text-[#52FF00]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">84</div>
              <p className="text-xs text-gray-500 mt-1">
                6.7% tasa de ganadores
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-[#52FF00]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Usuarios Únicos
              </CardTitle>
              <Users className="h-4 w-4 text-[#52FF00]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">956</div>
              <p className="text-xs text-gray-500 mt-1">
                +12 nuevos usuarios hoy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-white/5">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                placeholder="Buscar por nombre, email o RUT..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#52FF00]"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden bg-zinc-900/20">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#52FF00]/10 text-[#52FF00] uppercase font-teko text-lg tracking-wide">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Usuario</th>
                    <th className="px-6 py-4 font-semibold">RUT</th>
                    <th className="px-6 py-4 font-semibold">Código Boleta</th>
                    <th className="px-6 py-4 font-semibold">Fecha</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold">Premio</th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {participations.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.rut}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">
                        {item.code}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.date}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            item.status === "Ganador"
                              ? "bg-[#52FF00]/10 text-[#52FF00] border-[#52FF00]/20"
                              : "bg-zinc-800 text-gray-400 border-zinc-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.prize}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-500 hover:text-[#52FF00] transition-colors">
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Mock */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-zinc-900/30">
              <div className="text-xs text-gray-500">
                Mostrando <span className="font-medium text-white">1</span> a{" "}
                <span className="font-medium text-white">5</span> de{" "}
                <span className="font-medium text-white">1,248</span> resultados
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="h-8 border-white/10 text-gray-500"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-white/10 text-white hover:border-[#52FF00] hover:text-[#52FF00] bg-transparent"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

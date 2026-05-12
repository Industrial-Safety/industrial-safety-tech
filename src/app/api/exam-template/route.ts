import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function GET() {
    const rows = [
        ["Pregunta", "OpcionA", "OpcionB", "OpcionC", "OpcionD", "Correcta"],
        [
            "¿Qué significa EPP?",
            "Equipo de Protección Personal",
            "Equipo de Prevención Primaria",
            "Equipo de Protección Primaria",
            "Equipo de Prevención Personal",
            "A",
        ],
        [
            "¿Cada cuánto se debe inspeccionar el casco de seguridad?",
            "Cada 6 meses",
            "Cada año",
            "Cada 2 años",
            "Cada 3 meses",
            "B",
        ],
        [
            "¿Cuál es el color estándar de un cono de seguridad vial?",
            "Amarillo",
            "Rojo",
            "Naranja con franja reflectante",
            "Verde",
            "C",
        ],
        [
            "¿Qué se debe hacer antes de operar maquinaria pesada?",
            "Verificar el combustible",
            "Avisar al supervisor",
            "Realizar la inspección pre-operacional",
            "Colocarse el chaleco",
            "C",
        ],
        [
            "¿Qué indica una señal de fondo ROJO en seguridad industrial?",
            "Precaución o advertencia",
            "Prohibición o paro",
            "Información general",
            "Obligación de uso de EPP",
            "B",
        ],
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(rows)

    // Anchos de columna
    worksheet["!cols"] = [
        { wch: 55 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 },
        { wch: 10 },
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Examen")

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="plantilla-examen.xlsx"',
        },
    })
}

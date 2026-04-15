# Design System: Sistema de Gestión de Seguridad Industrial

## 1. Filosofía y Valores de la Interfaz
El diseño debe transmitir:
- **Precisión y Alta Tecnología:** Somos una plataforma moderna impulsada por IA.
- **Claridad Operativa:** La información crítica (alertas, incidentes, falta de stock) debe destacar inmediatamente sin ruido visual.
- **Enfoque "Dark-First":** Priorizar el Modo Oscuro para reducir la fatiga visual de los monitores de cámaras y dashboards gerenciales.

## 2. Tipografía
- **Familia principal:** `Inter` (o sistema sans-serif nativo).
- **Jerarquía:** - Usar fuentes limpias y geométricas.
  - Títulos gruesos (Font-weight: 600 o 700) para métricas y encabezados.
  - Texto de cuerpo altamente legible (Font-weight: 400).

## 3. Paleta de Colores (Tailwind CSS)
El sistema utiliza un fondo oscuro profundo con colores semánticos muy marcados para los estados de seguridad.

- **Fondos (Backgrounds):**
  - App Background: `bg-slate-950` (Casi negro).
  - Card/Surface Background: `bg-slate-900`.
  - Elementos secundarios: `bg-slate-800`.
- **Texto:**
  - Primario: `text-slate-50` (Blanco puro).
  - Secundario (Muteado): `text-slate-400`.
- **Color Primario (Marca y CTAs):** - `amber-500` (#f59e0b) - Amarillo/Naranja industrial (inspirado en cascos y cintas de precaución). Usar para botones primarios e íconos destacados.
- **Colores Semánticos (CRÍTICOS para el software):**
  - **Éxito (EPP Completo / Certificado Válido):** `emerald-500`.
  - **Advertencia (Stock bajo / Incidente menor):** `yellow-500`.
  - **Peligro (Infracción de Cámara / Accidente Grave):** `rose-600`.

## 4. Componentes UI (shadcn/ui & Radix)
- **Bordes:** Muy sutiles. Usar `border-slate-800` para separar tarjetas y secciones. 
- **Sombras (Shadows):** En modo oscuro, evitar sombras pesadas. Usar sutiles brillos internos (inner glows) o bordes de 1px para dar profundidad.
- **Botones:** - Primarios: Fondo `amber-500` con texto negro (`text-slate-950`) para máximo contraste.
  - Secundarios: Fondo transparente con borde `border-slate-700` y texto blanco.
- **Tarjetas (Cards):** Esquinas ligeramente redondeadas (`rounded-lg` o `rounded-xl`). Minimalistas, sin saturación de información.

## 5. Disposición y Layout (Spacing)
- **Whitespace:** Generoso en el Landing Page y Dashboard principal para respirar.
- **Densidad de datos:** En el módulo de "Logística e Inventario", usar tablas densas y compactas para mostrar más filas sin hacer scroll.
- **Formularios:** Inputs de texto con fondos ligeramente más claros que la tarjeta (`bg-slate-800`), con bordes sutiles que se iluminan (`ring-amber-500`) al hacer focus.
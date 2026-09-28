import { notFound } from "next/navigation";

// Cualquier URL desconocida bajo /es o /en usa el 404 con cabecera y pie.
export default function CatchAllPage() {
  notFound();
}

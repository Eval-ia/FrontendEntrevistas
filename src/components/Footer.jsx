import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white py-4 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm">
        <span>© 2025 NombreAplicacion. Todos los derechos reservados.</span>
        <div className="mt-2 sm:mt-0">
          Contacto: soporte@nombreaplicacion.com
        </div>
      </div>
    </footer>
  );
}

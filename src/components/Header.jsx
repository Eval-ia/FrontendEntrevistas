import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide hover:underline">
          NombreAplicacion
        </Link>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#entrevista" className="hover:underline">Entrevista</a>
          <a href="#informe" className="hover:underline">Informe</a>
        </nav>
      </div>
    </header>
  );
}

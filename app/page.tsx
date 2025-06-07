"use client"

import { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
}

export default function Home() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', correo: '' });

  // Cargar clientes al iniciar
  useEffect(() => {
    cargarClientes();
  }, []);

  // Función para cargar clientes
  const cargarClientes = async () => {
    try {
      const response = await fetch('/api/clientes');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  // Función para crear un nuevo cliente
  const crearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });
      const data = await response.json();
      setClientes([...clientes, data]);
      setNuevoCliente({ nombre: '', correo: '' });
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Clientes</h1>
      
      {/* Formulario para nuevo cliente */}
      <form onSubmit={crearCliente} className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Nuevo Cliente</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={nuevoCliente.nombre}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              value={nuevoCliente.correo}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear Cliente
          </button>
        </div>
      </form>

      {/* Lista de clientes */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Lista de Clientes</h2>
        <div className="divide-y">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="p-4">
              <h3 className="font-medium">{cliente.nombre}</h3>
              <p className="text-gray-600">{cliente.correo}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

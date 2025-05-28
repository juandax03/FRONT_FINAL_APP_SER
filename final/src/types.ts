// Tipos genéricos para las entidades
export interface Entity {
  [key: string]: any;
}

// Tipos específicos para cada entidad
export interface Usuario {
  usuarioId?: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
}

export interface Rol {
  rolId?: number;
  nombreRol: string;
}

export interface Ciudad {
  ciudadId?: number;
  nombre: string;
  provinciaEstado: string;
  pais: string;
  codigoPostal: string;
}

export interface Curso {
  cursoId?: number;
  codigoCurso: string;
  nombre: string;
  descripcion: string;
  duracionHoras: number;
  costo: number;
  categoriaId: number;
  modalidadId: number;
  nivelId: number;
}

export interface Modalidad {
  modalidadId?: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Factura {
  facturaId?: number;
  numeroFactura: string;
  fechaEmision: string;
  total: number;
  pagoId: number;
}

export interface Equipo {
  equipoId?: number;
  nombre: string;
  descripcion: string;
  cantidadStock: number;
  categoriaEquipoId: number;
}

export interface Proveedor {
  proveedorId?: number;
  nombre: string;
  contactoTelefono: string;
  contactoEmail: string;
  direccion: string;
}

// Tipo para el modal CRUD
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: string;
  mode: 'create' | 'edit' | 'delete';
  data?: Entity;
  onSubmit: (data: Entity) => void;
}

// Tipo para la tabla dinámica
export interface TableProps {
  entity: string;
  data: Entity[];
  onEdit: (item: Entity) => void;
  onDelete: (item: Entity) => void;
}

// Tipo para la entidad seleccionada
export interface EntityInfo {
  name: string;
  endpoint: string;
}
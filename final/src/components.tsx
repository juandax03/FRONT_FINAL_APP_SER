import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { Entity, EntityInfo, TableProps, ModalProps } from './types';

// Componente de botón reutilizable
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    outline: 'border border-border bg-transparent hover:bg-card',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente de tarjeta para entidades
export const EntityCard = ({ 
  entity, 
  onSelect 
}: { 
  entity: EntityInfo; 
  onSelect: (entity: EntityInfo) => void;
}) => {
  return (
    <motion.div
      className="card cursor-pointer hover:border-primary transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(entity)}
    >
      <h3 className="text-xl font-bold mb-2">{entity.name}</h3>
      <p className="text-gray-400">Gestionar {entity.name.toLowerCase()}</p>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" className="text-primary">
          Ver datos
        </Button>
      </div>
    </motion.div>
  );
};

// Componente de tabla dinámica
export const DynamicTable = ({ entity, data, onEdit, onDelete }: TableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = data.filter(item => 
    Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Obtener las columnas de la primera fila de datos o usar un array vacío
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Buscar ${entity}...`}
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setSearchTerm('')}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column}>{formatColumnName(column)}</th>
              ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.tr 
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {columns.map(column => (
                    <td key={column}>
                      {formatCellValue(item[column])}
                    </td>
                  ))}
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(item)} 
                        className="p-1 text-blue-400 hover:text-blue-300"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => onDelete(item)} 
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  No se encontraron datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente de modal para CRUD
export const CrudModal = ({ isOpen, onClose, entity, mode, data, onSubmit }: ModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: data || {}
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const handleFormSubmit = (formData: Entity) => {
    onSubmit(formData);
    onClose();
  };

  const modalTitle = {
    create: `Crear ${entity}`,
    edit: `Editar ${entity}`,
    delete: `Eliminar ${entity}`
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card max-w-lg w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{modalTitle[mode]}</h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-700"
              >
                <FiX />
              </button>
            </div>

            {mode === 'delete' ? (
              <div>
                <p className="mb-4">¿Estás seguro de que deseas eliminar este {entity.toLowerCase()}?</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose}>Cancelar</Button>
                  <Button variant="danger" onClick={() => handleFormSubmit(data!)}>Eliminar</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                {data && Object.keys(data).map(field => (
                  <div key={field} className="mb-4">
                    <label className="block mb-1">{formatColumnName(field)}</label>
                    <input
                      {...register(field)}
                      className="input"
                      type={getInputType(field, data[field])}
                      disabled={isIdField(field)}
                    />
                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                ))}
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                  <Button type="submit">{mode === 'create' ? 'Crear' : 'Guardar'}</Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Componente de encabezado
export const Header = ({ entity, onAdd }: { entity?: string; onAdd?: () => void }) => {
  return (
    <header className="bg-card p-4 rounded-lg mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        {entity ? `Gestión de ${entity}` : 'Sistema de Gestión Educativa'}
      </h1>
      {entity && onAdd && (
        <Button onClick={onAdd}>
          <FiPlus className="mr-2" /> Nuevo {entity}
        </Button>
      )}
    </header>
  );
};

// Funciones auxiliares
const formatColumnName = (column: string): string => {
  // Convertir camelCase a palabras separadas
  const formatted = column.replace(/([A-Z])/g, ' $1');
  // Capitalizar primera letra
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (value instanceof Date) return value.toLocaleDateString();
  return value.toString();
};

const getInputType = (field: string, value: any): string => {
  if (typeof value === 'number') return 'number';
  if (field.toLowerCase().includes('fecha')) return 'date';
  if (typeof value === 'boolean') return 'checkbox';
  if (field.toLowerCase().includes('email')) return 'email';
  return 'text';
};

const isIdField = (field: string): boolean => {
  return field.toLowerCase().endsWith('id');
};
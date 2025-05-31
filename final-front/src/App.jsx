import { useState, useEffect } from 'react';
import './App.css';

// API Base URL
const API_BASE_URL = 'http://apifinalsw2025.tryasp.net/api';

// Lista de entidades disponibles en el backend
const availableEntities = [
  { name: 'Usuario', endpoint: 'Usuario' },
  { name: 'Rol', endpoint: 'Rol' },
  { name: 'Ciudad', endpoint: 'Ciudad' },
  { name: 'Curso', endpoint: 'Curso' },
  { name: 'Modalidad', endpoint: 'Modalidad' },
  { name: 'Factura', endpoint: 'Factura' },
  { name: 'Equipo', endpoint: 'Equipo' },
  { name: 'Proveedor', endpoint: 'Proveedor' }
];

// Componente para la lista de entidades
function EntityList({ entities, onSelectEntity, selectedEntity }) {
  return (
    <div className="entity-list">
      <h3>Entidades</h3>
      <ul>
        {entities.map((entity) => (
          <li 
            key={entity.endpoint}
            className={selectedEntity?.endpoint === entity.endpoint ? 'selected' : ''}
            onClick={() => onSelectEntity(entity)}
          >
            {entity.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Componente para la tabla de datos
function EntityTable({ data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <div className="no-data">No hay datos disponibles</div>;
  }

  // Obtener las columnas del primer objeto
  const columns = Object.keys(data[0]);

  return (
    <div className="table-container">
      <table className="entity-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column}>{formatColumnName(column)}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map(column => (
                <td key={column}>{formatValue(item[column])}</td>
              ))}
              <td className="actions">
                <button className="btn-edit" onClick={() => onEdit(getItemId(item))}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => onDelete(item)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente para el modal
function Modal({ mode, entity, item, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    if (item) {
      setFormData({...item});
    }
  }, [item]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convertir valores según el tipo
    let processedValue = value;
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value);
    } else if (name.toLowerCase().includes('fecha')) {
      // Si es un campo de fecha, asegurarse de que sea un formato válido
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          processedValue = date.toISOString();
        }
      } catch (error) {
        console.error('Error al procesar fecha:', error);
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Si es modo eliminar, mostrar confirmación
  if (mode === 'delete') {
    return (
      <div className="modal-overlay">
        <div className="modal delete-modal">
          <h3>Confirmar Eliminación</h3>
          <p>¿Estás seguro de que deseas eliminar este registro?</p>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn-confirm" onClick={() => onSave(formData)}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Para crear o editar, mostrar formulario
  const fields = item ? Object.keys(item) : [];
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{mode === 'create' ? 'Crear Nuevo' : 'Editar'} {entity?.name}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map(field => {
            // No mostrar campos de ID en formularios de creación
            if (mode === 'create' && field.toLowerCase().includes('id') && field !== 'rolId' && field !== 'categoriaId' && field !== 'modalidadId' && field !== 'nivelId') {
              return null;
            }
            
            // Determinar el tipo de input según el nombre del campo
            let inputType = 'text';
            if (typeof item[field] === 'number') {
              inputType = 'number';
            } else if (field.toLowerCase().includes('fecha')) {
              inputType = 'datetime-local';
            } else if (typeof item[field] === 'boolean') {
              inputType = 'checkbox';
            }
            
            return (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{formatColumnName(field)}</label>
                {inputType === 'checkbox' ? (
                  <input
                    type="checkbox"
                    id={field}
                    name={field}
                    checked={formData[field] || false}
                    onChange={(e) => setFormData({...formData, [field]: e.target.checked})}
                  />
                ) : (
                  <input
                    type={inputType}
                    id={field}
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    required={!field.toLowerCase().includes('id')}
                  />
                )}
              </div>
            );
          })}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para el cursor personalizado
function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300);
    };
    
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);
  
  return (
    <>
      <div 
        className="cursor" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
      <div 
        className={`cursor-ring ${clicked ? 'expand' : ''}`} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      />
    </>
  );
}

// Funciones auxiliares
function formatColumnName(column) {
  // Convertir camelCase a palabras separadas
  const formatted = column.replace(/([A-Z])/g, ' $1');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    try {
      return new Date(value).toLocaleString();
    } catch (e) {
      return value;
    }
  }
  
  return String(value);
}

function getItemId(item) {
  // Buscar la propiedad que contiene 'id' en su nombre
  const idField = Object.keys(item).find(key => key.toLowerCase().includes('id'));
  return item[idField];
}

// Funciones de API
const getAll = async (entity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${entity}`);
    if (!response.ok) {
      throw new Error(`Error al obtener ${entity}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener ${entity}:`, error);
    throw error;
  }
};

const getById = async (entity, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${entity}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener ${entity} con ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener ${entity} con ID ${id}:`, error);
    throw error;
  }
};

const create = async (entity, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${entity}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Error al crear ${entity}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al crear ${entity}:`, error);
    throw error;
  }
};

const update = async (entity, id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${entity}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar ${entity} con ID ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar ${entity} con ID ${id}:`, error);
    throw error;
  }
};

const remove = async (entity, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${entity}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar ${entity} con ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error al eliminar ${entity} con ID ${id}:`, error);
    throw error;
  }
};

// Componente principal App
function App() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityData, setEntityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState(null);

  // Cargar datos cuando se selecciona una entidad
  useEffect(() => {
    if (selectedEntity) {
      loadEntityData(selectedEntity);
    }
  }, [selectedEntity]);

  // Función para cargar datos de la entidad seleccionada
  const loadEntityData = async (entity) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAll(entity.endpoint);
      setEntityData(data);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
      setEntityData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar datos según término de búsqueda
  const filteredData = entityData.filter(item => {
    if (!searchTerm) return true;
    
    // Buscar en todas las propiedades del objeto
    return Object.values(item).some(value => 
      value !== null && 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Manejar selección de entidad
  const handleEntitySelect = (entity) => {
    setSelectedEntity(entity);
    setSearchTerm('');
  };

  // Abrir modal para crear nuevo item
  const handleCreateNew = () => {
    setModalMode('create');
    setCurrentItem({});
    setModalOpen(true);
  };

  // Abrir modal para editar item
  const handleEdit = async (id) => {
    setIsLoading(true);
    try {
      const item = await getById(selectedEntity.endpoint, id);
      setCurrentItem(item);
      setModalMode('edit');
      setModalOpen(true);
    } catch (err) {
      setError(`Error al cargar item: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir modal para confirmar eliminación
  const handleDelete = (item) => {
    setCurrentItem(item);
    setModalMode('delete');
    setModalOpen(true);
  };

  // Guardar cambios (crear o editar)
  const handleSave = async (formData) => {
    setIsLoading(true);
    try {
      if (modalMode === 'create') {
        await create(selectedEntity.endpoint, formData);
      } else if (modalMode === 'edit') {
        // Obtener el ID del item actual
        const idField = Object.keys(currentItem).find(key => key.toLowerCase().includes('id'));
        const id = currentItem[idField];
        await update(selectedEntity.endpoint, id, formData);
      } else if (modalMode === 'delete') {
        // Obtener el ID del item actual
        const idField = Object.keys(currentItem).find(key => key.toLowerCase().includes('id'));
        const id = currentItem[idField];
        await remove(selectedEntity.endpoint, id);
      }
      
      // Recargar datos
      await loadEntityData(selectedEntity);
      setModalOpen(false);
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Cursor />
      <header>
        <h1>Academia de Sistemas</h1>
        <p>Panel de Administración</p>
      </header>
      
      <main>
        <aside>
          <EntityList 
            entities={availableEntities} 
            onSelectEntity={handleEntitySelect} 
            selectedEntity={selectedEntity}
          />
        </aside>
        
        <section className="content">
          {selectedEntity ? (
            <>
              <div className="entity-header">
                <h2>{selectedEntity.name}</h2>
                <div className="actions">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button className="btn-create" onClick={handleCreateNew}>
                    Crear Nuevo
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="loading">Cargando...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <EntityTable 
                  data={filteredData} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              )}
            </>
          ) : (
            <div className="welcome">
              <h2>Bienvenido al Sistema de Gestión</h2>
              <p>Selecciona una entidad del menú lateral para comenzar.</p>
            </div>
          )}
        </section>
      </main>
      
      {modalOpen && (
        <Modal
          mode={modalMode}
          entity={selectedEntity}
          item={currentItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default App;
import { useState, useEffect, memo } from 'react';
import { formatColumnName } from '../utils/formatters';

// Componente para el modal
const Modal = memo(function Modal({ mode, entity, item, onClose, onSave }) {
  const [formData, setFormData] = useState({});
  
  useEffect(() => {
    console.log("Modal useEffect - mode:", mode, "entity:", entity?.name, "item:", item);
    
    if (item) {
      setFormData({...item});
    } else if (mode === 'create' && entity) {
      // Inicializar con un objeto vacío pero con propiedades básicas según la entidad
      let initialData = {};
      
      // Si tenemos datos de la tabla, usar esos campos como base
      if (entity.tableData && entity.tableData.length > 0) {
        const sampleItem = entity.tableData[0];
        // Crear un objeto con las mismas propiedades pero valores vacíos
        initialData = Object.keys(sampleItem).reduce((acc, key) => {
          // No incluir campos de ID en la creación
          if (key.toLowerCase() === 'id' || 
              key.toLowerCase() === 'rolid' ||
              (key.toLowerCase().endsWith('id') && key.toLowerCase() !== 'rolid' && entity.name !== 'Usuario')) {
            return acc;
          }
          
          // Asignar valor vacío según el tipo
          if (typeof sampleItem[key] === 'number') {
            acc[key] = 0;
          } else if (typeof sampleItem[key] === 'boolean') {
            acc[key] = false;
          } else {
            acc[key] = '';
          }
          return acc;
        }, {});
        
        // Valores por defecto específicos
        if (entity.name === 'Usuario') {
          initialData.rolId = 1;
        } else if (entity.name === 'Curso') {
          initialData.modalidadId = 1;
        }
      } 
      // Si no tenemos datos de la tabla, usar valores predefinidos
      else {
        if (entity.name === 'Usuario') {
          initialData.nombre = '';
          initialData.apellido = '';
          initialData.email = '';
          initialData.rolId = 1;
        } else if (entity.name === 'Rol') {
          initialData.nombreRol = '';
        } else if (entity.name === 'Ciudad') {
          initialData.nombre = '';
        } else if (entity.name === 'Curso') {
          initialData.nombre = '';
          initialData.descripcion = '';
          initialData.costo = 0;
          initialData.duracionHoras = 0;
          initialData.codigoCurso = '';
          initialData.modalidadId = 1;
          initialData.categoriaId = 1;
          initialData.nivelId = 1;
        } else {
          // Para otras entidades, inicializar con campos vacíos básicos
          initialData.nombre = '';
        }
      }
      
      console.log("Inicializando formulario para crear:", initialData);
      setFormData(initialData);
    }
  }, [item, mode, entity]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Convertir valores según el tipo
    let processedValue = value;
    
    if (type === 'checkbox') {
      // Para checkboxes, usar el valor de checked (true/false)
      processedValue = checked;
    } else if (type === 'number') {
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
    } else if (name.toLowerCase() === 'activo') {
      // Asegurarse de que 'activo' sea siempre un booleano
      if (value === 'true' || value === true) {
        processedValue = true;
      } else if (value === 'false' || value === false) {
        processedValue = false;
      } else {
        processedValue = Boolean(value);
      }
    } else if (typeof formData[name] === 'object' && formData[name] !== null) {
      // Intentar parsear JSON para objetos anidados
      try {
        processedValue = JSON.parse(value);
      } catch (error) {
        console.error(`Error al parsear JSON para el campo ${name}:`, error);
        // Si falla el parseo, mantener el valor como string
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Asegurarse de que los campos booleanos sean realmente booleanos
    const finalData = {...formData};
    
    // Verificar si hay un campo 'activo' y asegurarse de que sea booleano
    if ('activo' in finalData) {
      finalData.activo = finalData.activo === true;
      console.log('Campo activo ajustado a:', finalData.activo);
    }
    
    console.log('Enviando datos:', finalData); // Para depuración
    onSave(finalData);
  };
  
  // Si es modo eliminar, mostrar confirmación
  if (mode === 'delete') {
    // Identificar el ID para mostrar en la confirmación
    let idToShow = '';
    if (item) {
      const idField = Object.keys(item).find(key => key.toLowerCase() === 'id');
      const nameField = Object.keys(item).find(key => key.toLowerCase() === 'nombre');
      
      if (idField) {
        idToShow = item[idField];
      } else {
        const entityIdField = Object.keys(item).find(key => 
          key.toLowerCase().endsWith('id') && key.toLowerCase() !== 'rolid');
        if (entityIdField) {
          idToShow = item[entityIdField];
        }
      }
    }
    
    return (
      <div className="modal-overlay">
        <div className="modal delete-modal">
          <h3>Confirmar Eliminación</h3>
          <p>¿Estás seguro de que deseas eliminar este registro{idToShow ? ` (ID: ${idToShow})` : ''}?</p>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn-confirm" onClick={() => onSave(item)}>Eliminar</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Para crear o editar, mostrar formulario
  let fields = [];
  
  if (mode === 'create') {
    // En modo crear, usar las claves del objeto formData inicializado
    fields = Object.keys(formData);
    console.log("Campos para formulario de creación:", fields);
  } else if (item) {
    // En modo editar, usar las claves del item existente
    fields = Object.keys(item);
    console.log("Campos para formulario de edición:", fields);
  }
  
  // Si no hay campos y estamos en modo crear, mostrar campos por defecto según la entidad
  if (fields.length === 0 && mode === 'create' && entity) {
    if (entity.name === 'Usuario') {
      fields = ['nombre', 'apellido', 'email', 'rolId'];
    } else if (entity.name === 'Rol') {
      fields = ['nombreRol']; // Solo nombreRol, no incluir rolId
    } else if (entity.name === 'Ciudad') {
      fields = ['nombre'];
    } else if (entity.name === 'Curso') {
      fields = ['nombre', 'descripcion', 'codigoCurso', 'costo', 'duracionHoras', 'modalidadId', 'categoriaId', 'nivelId'];
    } else {
      fields = ['nombre', 'descripcion'];
    }
    console.log("Usando campos por defecto:", fields);
  }
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{mode === 'create' ? 'Crear Nuevo' : 'Editar'} {entity?.name}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map(field => {
            // No mostrar campos de ID en formularios de creación
            if (mode === 'create' && (
                field.toLowerCase() === 'id' || 
                field.toLowerCase() === 'cursoid' ||
                (entity?.name === 'Rol' && field.toLowerCase() === 'rolid')
            ) && 
                field.toLowerCase() !== 'categoriaid' && 
                field.toLowerCase() !== 'nivelid' && 
                field.toLowerCase() !== 'modalidadid') {
              return null;
            }
            
            // Determinar si el campo debe estar deshabilitado (campos de ID)
            const isIdField = field.toLowerCase() === 'id' || 
                             (field.toLowerCase().endsWith('id') && 
                              field.toLowerCase() !== 'rolid' && 
                              field.toLowerCase() !== 'categoriaid' && 
                              field.toLowerCase() !== 'nivelid' && 
                              field.toLowerCase() !== 'modalidadid');
            
            // Determinar el tipo de input según el nombre del campo
            let inputType = 'text';
            if (field.toLowerCase() === 'id' || 
                (field.toLowerCase().endsWith('id') && 
                 field.toLowerCase() !== 'rolid')) {
              inputType = 'number';
            } else if (field.toLowerCase().includes('fecha')) {
              inputType = 'datetime-local';
            } else if (typeof item?.[field] === 'boolean' || field.toLowerCase() === 'activo') {
              inputType = 'checkbox';
            } else if (field.toLowerCase() === 'apellido' || 
                       field.toLowerCase() === 'nombre' || 
                       field.toLowerCase() === 'nombrerol' ||
                       field.toLowerCase() === 'email' || 
                       field.toLowerCase() === 'descripcion') {
              inputType = 'text';
            }
            
            return (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{formatColumnName(field)}</label>
                {inputType === 'checkbox' ? (
                  <input
                    type="checkbox"
                    id={field}
                    name={field}
                    checked={formData[field] === true}
                    onChange={(e) => {
                      console.log(`Checkbox ${field} cambiado a:`, e.target.checked);
                      // Asegurarse de que el valor sea un booleano verdadero o falso
                      const newValue = e.target.checked === true;
                      console.log(`Valor final para ${field}:`, newValue);
                      setFormData({...formData, [field]: newValue});
                    }}
                    disabled={isIdField}
                    className={isIdField ? 'disabled-input' : ''}
                  />
                ) : (
                  <input
                    type={inputType}
                    id={field}
                    name={field}
                    value={formData[field] !== undefined ? 
                      (typeof formData[field] === 'object' && formData[field] !== null ? 
                        JSON.stringify(formData[field]) : formData[field]) : ''}
                    onChange={handleChange}
                    required={!field.toLowerCase().includes('id')}
                    disabled={isIdField}
                    className={isIdField ? 'disabled-input' : ''}
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
});

export default Modal;
// Funciones auxiliares para formateo de datos

// Formatea nombres de columnas de camelCase a palabras separadas
export function formatColumnName(column) {
  // Convertir camelCase a palabras separadas
  const formatted = column.replace(/([A-Z])/g, ' $1');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Formatea valores para mostrar en la tabla
export function formatValue(value) {
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
  
  // Manejo de objetos anidados
  if (typeof value === 'object' && value !== null) {
    // Para objetos de Modalidad
    if (value.nombre !== undefined) {
      return value.nombre;
    }
    // Para objetos de NivelDificultad
    if (value.nivelDificultadId !== undefined) {
      return `${value.nombre || 'Nivel'} (${value.ordanilidad || 0})`;
    }
    // Para cualquier otro objeto, mostrar una propiedad clave si existe
    const keyProps = ['nombre', 'name', 'title', 'descripcion', 'id'];
    for (const prop of keyProps) {
      if (value[prop] !== undefined) {
        return value[prop];
      }
    }
    return JSON.stringify(value);
  }
  
  return String(value);
}

// Obtiene el ID de un item
export function getItemId(item) {
  // Verificar campos específicos primero para mayor precisión
  if ('cursoId' in item) {
    console.log("ID encontrado (cursoId):", item.cursoId);
    return item.cursoId;
  } else if ('nivelId' in item) {
    return item.nivelId;
  } else if ('nivelDificultadId' in item) {
    return item.nivelDificultadId;
  } else if ('modalidadId' in item) {
    return item.modalidadId;
  } else if ('rolId' in item && !('usuarioId' in item)) {
    return item.rolId;
  } else if ('usuarioId' in item) {
    return item.usuarioId;
  } else if ('ciudadId' in item) {
    return item.ciudadId;
  }
  
  // Buscar un campo que sea exactamente 'id'
  const idField = Object.keys(item).find(key => key.toLowerCase() === 'id');
  if (idField) {
    return item[idField];
  }
  
  // Si no encuentra campos específicos, buscar cualquier campo que termine con 'id'
  const endWithIdField = Object.keys(item).find(key => 
    key.toLowerCase().endsWith('id') && 
    key.toLowerCase() !== 'rolid'
  );
  if (endWithIdField) {
    return item[endWithIdField];
  }
  
  // Si aún no lo encuentra, usar cualquier campo que contenga 'id'
  const containsIdField = Object.keys(item).find(key => key.toLowerCase().includes('id'));
  if (containsIdField) {
    return item[containsIdField];
  }
  
  console.log("No se encontró ID para:", item);
  return null;
}
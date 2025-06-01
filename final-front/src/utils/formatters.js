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
  
  return String(value);
}

// Obtiene el ID de un item
export function getItemId(item) {
  // Primero buscar un campo que sea exactamente 'id'
  let idField = Object.keys(item).find(key => key.toLowerCase() === 'id');
  
  // Si no lo encuentra, buscar un campo que termine con 'id' y no sea 'rolid'
  if (!idField) {
    idField = Object.keys(item).find(key => 
      key.toLowerCase().endsWith('id') && 
      key.toLowerCase() !== 'rolid'
    );
  }
  
  // Si aún no lo encuentra, usar cualquier campo que contenga 'id'
  if (!idField) {
    idField = Object.keys(item).find(key => key.toLowerCase().includes('id'));
  }
  
  console.log("ID encontrado:", idField, item[idField]);
  return item[idField];
}
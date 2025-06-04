import { memo } from 'react';
import { formatColumnName, formatValue, getItemId } from '../utils/formatters';

// Componente para la tabla de datos
const EntityTable = memo(function EntityTable({ data, onEdit, onDelete }) {
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
                <button className="btn-edit" onClick={() => {
                  // Usar directamente el ID específico para cursos
                  const id = item.cursoId || getItemId(item);
                  console.log("ID para editar:", id, item);
                  onEdit(id);
                }}>
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
});

export default EntityTable;
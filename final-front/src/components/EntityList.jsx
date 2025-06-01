import { memo } from 'react';

// Componente para la lista de entidades
const EntityList = memo(function EntityList({ entities, onSelectEntity, selectedEntity }) {
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
});

export default EntityList;
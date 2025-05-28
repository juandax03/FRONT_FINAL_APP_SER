import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { entities, fetchEntityData, fetchEntityById, createEntity, updateEntity, deleteEntity } from './services';
import { Entity, EntityInfo } from './types';
import { EntityCard, DynamicTable, CrudModal, Header, Button } from './components';
import './App.css';

function App() {
  const [selectedEntity, setSelectedEntity] = useState<EntityInfo | null>(null);
  const [entityData, setEntityData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create' as 'create' | 'edit' | 'delete',
    data: undefined as Entity | undefined,
  });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Efecto para el cursor personalizado
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cargar datos cuando se selecciona una entidad
  useEffect(() => {
    if (selectedEntity) {
      loadEntityData();
    }
  }, [selectedEntity]);

  const loadEntityData = async () => {
    if (!selectedEntity) return;
    
    setLoading(true);
    try {
      const data = await fetchEntityData(selectedEntity.endpoint);
      setEntityData(data);
    } catch (error) {
      toast.error(`Error al cargar datos de ${selectedEntity.name}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntity = (entity: EntityInfo) => {
    setSelectedEntity(entity);
  };

  const handleBackToEntities = () => {
    setSelectedEntity(null);
    setEntityData([]);
  };

  const handleAddEntity = () => {
    // Crear un objeto vacío con las propiedades necesarias según la entidad seleccionada
    const emptyEntity = entityData.length > 0 
      ? Object.keys(entityData[0]).reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {} as Entity)
      : {};
    
    setModalState({
      isOpen: true,
      mode: 'create',
      data: emptyEntity,
    });
  };

  const handleEditEntity = (item: Entity) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      data: { ...item },
    });
  };

  const handleDeleteEntity = (item: Entity) => {
    setModalState({
      isOpen: true,
      mode: 'delete',
      data: item,
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (data: Entity) => {
    if (!selectedEntity) return;
    
    const toastId = toast.loading('Procesando...');
    
    try {
      if (modalState.mode === 'create') {
        await createEntity(selectedEntity.endpoint, data);
        toast.success(`${selectedEntity.name} creado exitosamente`);
      } else if (modalState.mode === 'edit') {
        // Obtener el ID según la entidad
        const idField = getIdFieldName(selectedEntity.name);
        const id = data[idField];
        await updateEntity(selectedEntity.endpoint, id, data);
        toast.success(`${selectedEntity.name} actualizado exitosamente`);
      } else if (modalState.mode === 'delete') {
        const idField = getIdFieldName(selectedEntity.name);
        const id = data[idField];
        await deleteEntity(selectedEntity.endpoint, id);
        toast.success(`${selectedEntity.name} eliminado exitosamente`);
      }
      
      // Recargar datos
      loadEntityData();
    } catch (error) {
      toast.error(`Error al procesar ${selectedEntity.name}`);
      console.error(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // Obtener el nombre del campo ID según la entidad
  const getIdFieldName = (entityName: string): string => {
    return `${entityName.charAt(0).toLowerCase() + entityName.slice(1)}Id`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Cursor personalizado */}
      <div 
        className="splash-cursor"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Contenido principal */}
      <div className="container mx-auto">
        {selectedEntity ? (
          <div>
            <div className="mb-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleBackToEntities}
              >
                <FiArrowLeft /> Volver a entidades
              </Button>
            </div>
            
            <Header entity={selectedEntity.name} onAdd={handleAddEntity} />
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse-slow text-primary text-xl">Cargando...</div>
              </div>
            ) : (
              <DynamicTable 
                entity={selectedEntity.name}
                data={entityData}
                onEdit={handleEditEntity}
                onDelete={handleDeleteEntity}
              />
            )}
          </div>
        ) : (
          <div>
            <Header />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {entities.map((entity, index) => (
                <motion.div
                  key={entity.endpoint}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EntityCard 
                    entity={entity} 
                    onSelect={handleSelectEntity} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Modal CRUD */}
      {selectedEntity && (
        <CrudModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          entity={selectedEntity.name}
          mode={modalState.mode}
          data={modalState.data}
          onSubmit={handleSubmit}
        />
      )}
      
      {/* Notificaciones */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
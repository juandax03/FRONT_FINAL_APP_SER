import { useState, useEffect, useMemo } from 'react';
import { signOut, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { availableEntities } from '../constants/entities';
import { useEntityData } from '../hooks/useEntityData';
import EntityList from '../components/EntityList';
import EntityTable from '../components/EntityTable';
import Modal from '../components/Modal';
import Cursor from '../components/Cursor';
import '../App.css';

const Dashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [currentItem, setCurrentItem] = useState(null);
  const [user, setUser] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log('No hay sesión activa, redirigiendo a login');
        window.location.href = '/login';
      }
    };
    
    checkAuth();
  }, []);

  // Función para cerrar sesión
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Usar el hook personalizado para manejar los datos
  const { 
    entityData, 
    isLoading, 
    error, 
    loadEntityData, 
    getItemById, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useEntityData();

  // Cargar datos cuando se selecciona una entidad
  useEffect(() => {
    if (selectedEntity) {
      loadEntityData(selectedEntity);
    }
  }, [selectedEntity, loadEntityData]);

  // Filtrar datos según término de búsqueda
  const filteredData = useMemo(() => {
    return entityData.filter(item => {
      if (!searchTerm) return true;
      
      // Buscar en todas las propiedades del objeto
      return Object.values(item).some(value => 
        value !== null && 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [entityData, searchTerm]);

  // Manejar selección de entidad
  const handleEntitySelect = (entity) => {
    setSelectedEntity(entity);
    setSearchTerm('');
  };

  // Abrir modal para crear nuevo item
  const handleCreateNew = () => {
    setModalMode('create');
    setCurrentItem(null);
    setModalOpen(true);
  };

  // Abrir modal para editar item
  const handleEdit = async (id) => {
    if (!selectedEntity) return;
    
    try {
      const item = await getItemById(selectedEntity.endpoint, id);
      if (item) {
        setCurrentItem(item);
        setModalMode('edit');
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error al cargar item para editar:", err);
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
    if (!selectedEntity) return;
    
    try {
      if (modalMode === 'create') {
        const result = await createItem(selectedEntity.endpoint, formData);
        if (result) {
          setModalOpen(false);
        }
      } else if (modalMode === 'edit') {
        // Obtener el ID del item actual
        let id;
        // Primero buscar un campo que sea exactamente 'id'
        const idField = Object.keys(currentItem).find(key => key.toLowerCase() === 'id');
        if (idField) {
          id = currentItem[idField];
        } 
        // Si no lo encuentra, buscar un campo que contenga el nombre de la entidad + id
        else {
          const entityIdField = Object.keys(currentItem).find(key => 
            key.toLowerCase() === selectedEntity.endpoint.toLowerCase() + 'id' || 
            key.toLowerCase() === 'usuarioid');
          id = entityIdField ? currentItem[entityIdField] : undefined;
        }
        
        if (id) {
          const result = await updateItem(selectedEntity.endpoint, id, formData);
          if (result) {
            setModalOpen(false);
          }
        } else {
          console.error("No se pudo encontrar el ID para actualizar");
        }
      } else if (modalMode === 'delete') {
        // Obtener el ID del item actual
        let id;
        
        // Primero buscar un campo que sea exactamente 'id'
        const idField = Object.keys(currentItem).find(key => key.toLowerCase() === 'id');
        if (idField) {
          id = currentItem[idField];
        } 
        // Si no lo encuentra, buscar campos específicos según la entidad
        else {
          const entityIdField = Object.keys(currentItem).find(key => 
            key.toLowerCase() === selectedEntity.endpoint.toLowerCase() + 'id' || 
            key.toLowerCase() === 'rolid' ||
            key.toLowerCase() === 'usuarioid');
          id = entityIdField ? currentItem[entityIdField] : undefined;
        }
        
        if (id) {
          const result = await deleteItem(selectedEntity.endpoint, id);
          if (result) {
            setModalOpen(false);
          }
        } else {
          console.error("No se pudo encontrar el ID para eliminar");
        }
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  if (!user) {
    return <div className="loading">Verificando autenticación...</div>;
  }

  return (
    <div className="app">
      <Cursor />
      
      <header>
        <div className="header-content">
          <h1>Academia de Sistemas</h1>
          <p>Panel de Administración</p>
        </div>
        <div className="user-info">
          <span>{user.username || 'Usuario'}</span>
          <button className="btn-logout" onClick={handleSignOut}>
            Cerrar Sesión
          </button>
        </div>
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
              <h2>¡Bienvenido, {user.username || 'Usuario'}!</h2>
              <p>Selecciona una entidad del menú lateral para comenzar.</p>
            </div>
          )}
        </section>
      </main>
      
      {modalOpen && (
        <Modal
          mode={modalMode}
          entity={{...selectedEntity, tableData: entityData}}
          item={currentItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
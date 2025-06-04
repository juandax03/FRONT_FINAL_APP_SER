import { useState, useCallback } from 'react';
import * as api from '../services/api';

// Hook personalizado para manejar los datos de entidades
export function useEntityData() {
  const [entityData, setEntityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos de una entidad
  const loadEntityData = useCallback(async (entity) => {
    if (!entity) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAll(entity.endpoint);
      setEntityData(data);
    } catch (err) {
      setError(`Error al cargar datos: ${err.message}`);
      setEntityData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener un item por ID
  const getItemById = useCallback(async (entity, id) => {
    setIsLoading(true);
    try {
      const item = await api.getById(entity, id);
      return item;
    } catch (err) {
      setError(`Error al cargar item: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear un nuevo item
  const createItem = useCallback(async (entity, data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Asegurarse de que los datos no tengan propiedades vacías
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => 
          value !== undefined && value !== null && value !== '' || key === 'activo'
        )
      );
      
      // Asegurarse de que el campo 'activo' sea un booleano
      if ('activo' in cleanData) {
        cleanData.activo = Boolean(cleanData.activo);
      }
      
      // Manejar casos especiales por entidad
      if (entity === 'Usuario') {
        // Asegurarse de que rolId sea un número
        if (cleanData.rolId) {
          cleanData.rolId = Number(cleanData.rolId);
        }
        
        // Validar email
        if (cleanData.email && !cleanData.email.includes('@')) {
          throw new Error('El email debe tener un formato válido');
        }
      } else if (entity === 'Curso') {
        // Convertir campos numéricos
        if (cleanData.modalidadId) {
          cleanData.modalidadId = Number(cleanData.modalidadId);
        }
        if (cleanData.duracionHoras) {
          cleanData.duracionHoras = Number(cleanData.duracionHoras);
        }
        if (cleanData.costo) {
          cleanData.costo = Number(cleanData.costo);
        }
      }
      
      // Convertir objetos anidados de string JSON a objetos reales
      Object.keys(cleanData).forEach(key => {
        if (typeof cleanData[key] === 'string' && 
            (cleanData[key].startsWith('{') || cleanData[key].startsWith('['))) {
          try {
            cleanData[key] = JSON.parse(cleanData[key]);
          } catch (e) {
            console.warn(`No se pudo parsear el campo ${key} como JSON:`, e);
          }
        }
      });
      
      console.log(`Enviando datos para crear ${entity}:`, cleanData);
      await api.create(entity, cleanData);
      await loadEntityData({ endpoint: entity });
      return true;
    } catch (err) {
      const errorMsg = `Error al crear: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntityData]);

  // Actualizar un item
  const updateItem = useCallback(async (entity, id, data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("ID no válido para actualizar");
      }
      
      // Limpiar datos antes de enviar
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => 
          value !== undefined && value !== null || key === 'activo'
        )
      );
      
      // Asegurarse de que el campo 'activo' sea un booleano
      if ('activo' in cleanData) {
        cleanData.activo = Boolean(cleanData.activo);
      }
      
      // Manejar casos especiales por entidad
      if (entity === 'Usuario') {
        // Asegurarse de que rolId sea un número
        if (cleanData.rolId) {
          cleanData.rolId = Number(cleanData.rolId);
        }
        
        // Validar email
        if (cleanData.email && !cleanData.email.includes('@')) {
          throw new Error('El email debe tener un formato válido');
        }
      } else if (entity === 'Curso') {
        // Convertir campos numéricos
        if (cleanData.modalidadId) {
          cleanData.modalidadId = Number(cleanData.modalidadId);
        }
        if (cleanData.duracionHoras) {
          cleanData.duracionHoras = Number(cleanData.duracionHoras);
        }
        if (cleanData.costo) {
          cleanData.costo = Number(cleanData.costo);
        }
      } else if (entity === 'NivelDificultad') {
        // Asegurarse de que ordanilidad sea un número
        if (cleanData.ordanilidad) {
          cleanData.ordanilidad = Number(cleanData.ordanilidad);
        }
      }
      
      // Convertir objetos anidados de string JSON a objetos reales
      Object.keys(cleanData).forEach(key => {
        if (typeof cleanData[key] === 'string' && 
            (cleanData[key].startsWith('{') || cleanData[key].startsWith('['))) {
          try {
            cleanData[key] = JSON.parse(cleanData[key]);
          } catch (e) {
            console.warn(`No se pudo parsear el campo ${key} como JSON:`, e);
          }
        }
      });
      
      console.log(`Actualizando ${entity} con ID ${id}:`, cleanData);
      await api.update(entity, id, cleanData);
      await loadEntityData({ endpoint: entity });
      return true;
    } catch (err) {
      const errorMsg = `Error al actualizar: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntityData]);

  // Eliminar un item
  const deleteItem = useCallback(async (entity, id) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error("ID no válido para eliminar");
      }
      
      console.log(`Eliminando ${entity} con ID ${id}`);
      
      // Manejo especial para Curso debido al error de tracking en el backend
      if (entity === 'Curso') {
        try {
          await api.remove(entity, id);
        } catch (err) {
          // Si falla, intentamos recargar los datos de todas formas
          console.warn("Error al eliminar curso, pero continuamos:", err);
          await loadEntityData({ endpoint: entity });
          return true;
        }
      } else {
        await api.remove(entity, id);
      }
      
      await loadEntityData({ endpoint: entity });
      return true;
    } catch (err) {
      const errorMsg = `Error al eliminar: ${err.message}`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadEntityData]);

  return {
    entityData,
    isLoading,
    error,
    loadEntityData,
    getItemById,
    createItem,
    updateItem,
    deleteItem
  };
}
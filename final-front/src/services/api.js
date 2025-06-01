// API Base URL
const API_BASE_URL = 'http://apifinalsw2025.tryasp.net/api';

// Funciones de API
export const getAll = async (entity) => {
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

export const getById = async (entity, id) => {
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

export const create = async (entity, data) => {
  try {
    console.log(`Creando ${entity} con datos:`, data);
    const response = await fetch(`${API_BASE_URL}/${entity}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error respuesta del servidor:`, errorText);
      throw new Error(`Error al crear ${entity}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al crear ${entity}:`, error);
    throw new Error(`Error al crear ${entity}: ${error.message}`);
  }
};

export const update = async (entity, id, data) => {
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

export const remove = async (entity, id) => {
  try {
    if (!id) {
      throw new Error(`ID no válido para eliminar ${entity}`);
    }
    
    console.log(`Eliminando ${entity} con ID ${id}`);
    const response = await fetch(`${API_BASE_URL}/${entity}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error respuesta del servidor:`, errorText);
      throw new Error(`Error al eliminar ${entity} con ID ${id}`);
    }
    return true;
  } catch (error) {
    console.error(`Error al eliminar ${entity} con ID ${id}:`, error);
    throw new Error(`Error al eliminar ${entity} con ID ${id}: ${error.message}`);
  }
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5171/api';

// Lista de entidades disponibles en el sistema
export const entities = [
  { name: 'Usuario', endpoint: 'Usuario' },
  { name: 'Rol', endpoint: 'Rol' },
  { name: 'Ciudad', endpoint: 'Ciudad' },
  { name: 'Curso', endpoint: 'Curso' },
  { name: 'Modalidad', endpoint: 'Modalidad' },
  { name: 'Factura', endpoint: 'Factura' },
  { name: 'Equipo', endpoint: 'Equipo' },
  { name: 'Proveedor', endpoint: 'Proveedor' }
];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchEntityData = async (entityEndpoint: string) => {
  try {
    const response = await api.get(`/${entityEndpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityEndpoint} data:`, error);
    throw error;
  }
};

export const fetchEntityById = async (entityEndpoint: string, id: number | string) => {
  try {
    const response = await api.get(`/${entityEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${entityEndpoint} with id ${id}:`, error);
    throw error;
  }
};

export const createEntity = async (entityEndpoint: string, data: any) => {
  try {
    const response = await api.post(`/${entityEndpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error creating ${entityEndpoint}:`, error);
    throw error;
  }
};

export const updateEntity = async (entityEndpoint: string, id: number | string, data: any) => {
  try {
    const response = await api.put(`/${entityEndpoint}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating ${entityEndpoint} with id ${id}:`, error);
    throw error;
  }
};

export const deleteEntity = async (entityEndpoint: string, id: number | string) => {
  try {
    const response = await api.delete(`/${entityEndpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${entityEndpoint} with id ${id}:`, error);
    throw error;
  }
};
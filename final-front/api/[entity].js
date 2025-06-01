export default async function handler(req, res) {
  // Obtener la entidad de la URL dinámica
  const { entity } = req.query;
  const { method, body, query } = req;
  
  // Construir la URL base
  let url = `http://apifinalsw2025.tryasp.net/api/${entity}`;
  
  // Si hay un ID en la consulta, añadirlo a la URL
  if (query.id) {
    url += `/${query.id}`;
  }
  
  try {
    // Configurar opciones de fetch según el método HTTP
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Puedes añadir headers adicionales aquí si son necesarios
      }
    };
    
    // Añadir body para métodos POST y PUT
    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(body);
    }
    
    // Realizar la petición a la API externa
    const apiRes = await fetch(url, options);
    
    // Manejar respuesta
    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error(`Error en API externa:`, errorText);
      return res.status(apiRes.status).json({ 
        error: `Error desde la API externa: ${apiRes.statusText}`,
        details: errorText
      });
    }
    
    // Para DELETE, puede que no haya contenido que devolver
    if (method === 'DELETE') {
      return res.status(200).json({ success: true });
    }
    
    // Para otros métodos, devolver los datos
    const data = await apiRes.json();
    return res.status(200).json(data);
    
  } catch (error) {
    console.error(`Error en proxy para ${entity}:`, error);
    return res.status(500).json({ 
      error: 'Error interno en el proxy',
      message: error.message 
    });
  }
}
export default async function handler(req, res) {
  try {
    const apiRes = await fetch('http://apifinalsw2025.tryasp.net/api/Usuario');
    
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'Error desde la API externa' });
    }

    const data = await apiRes.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error en proxy:', error);
    res.status(500).json({ error: 'Error interno en el proxy' });
  }
}
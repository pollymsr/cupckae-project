// api/index.js
export default function handler(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }
  
  response.status(200).json({
    message: 'API funcionando!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
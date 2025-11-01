import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

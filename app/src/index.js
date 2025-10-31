// Punto de entrada principal de la aplicación
import { createApp } from "./app.js";

// Puerto del servidor (usar variable de entorno o 3000 por defecto)
const port = process.env.PORT || 3000;
const app = createApp();

// Iniciar el servidor Express en el puerto especificado
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});




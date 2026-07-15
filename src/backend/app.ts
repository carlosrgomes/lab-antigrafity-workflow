import app from './server.js';

const PORT = process.env.PORT || 3001;

/**
 * Starts the Express server.
 */
function startServer(): void {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`RetroVault API is running on http://localhost:${PORT}`);
  });
}

startServer();

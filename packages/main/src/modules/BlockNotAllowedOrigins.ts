import { session, App } from 'electron';

/**
 * Enforces origin-based restrictions for the application.
 *
 * @param allowedOrigins - A set of allowed origin strings.
 * @returns A module for configuring and enabling origin restrictions.
 */
export function allowInternalOrigins(allowedOrigins: Set<string>) {
  return {
    /**
     * Enables the origin restrictions.
     *
     * @param app - The Electron app instance.
     */
    enable({ app }: { app: App }): void {
      console.log('BlockNotAllowedOrigins: Enabling origin restrictions');

      app.on('ready', () => {
        const filter = { urls: ['*://*/*'] };

        session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
          const origin = new URL(details.url).origin;

          if (!allowedOrigins.has(origin)) {
            console.log(`BlockNotAllowedOrigins: Blocking request from ${origin}`);
            callback({ cancel: true });
          } else {
            callback({ cancel: false });
          }
        });
      });
    },
  };
}

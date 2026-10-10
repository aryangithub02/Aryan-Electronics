import { lazy } from 'react';

/**
 * Enhanced React.lazy with automatic recovery for ChunkLoadErrors
 * (triggers a clean page reload when stale chunk hashes are requested after a new deployment)
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const hasAlreadyReloaded = JSON.parse(
      window.sessionStorage.getItem('chunk_load_reload') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('chunk_load_reload', 'false');
      return component;
    } catch (error) {
      const isChunkError =
        error?.name === 'ChunkLoadError' ||
        /Loading chunk .* failed/i.test(error?.message) ||
        /Unexpected token '<'/i.test(error?.message);

      if (isChunkError && !hasAlreadyReloaded) {
        window.sessionStorage.setItem('chunk_load_reload', 'true');
        window.location.reload();
        return new Promise(() => {}); // prevent further execution while reloading
      }

      window.sessionStorage.setItem('chunk_load_reload', 'false');
      throw error;
    }
  });

export default lazyWithRetry;

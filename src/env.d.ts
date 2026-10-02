type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}

interface Window {
  __yestodayFavoritesWired?: boolean;
  __yestodayPaintFavorites?: (articleId?: string | null) => void;
}

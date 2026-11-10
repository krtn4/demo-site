import { useCallback, useEffect, useState } from 'react';

export type Route = '/open' | '/invitation';
const ROUTES: Route[] = ['/open', '/invitation'];

const normalise = (path: string): Route => {
  const p = path.replace(/\/+$/, '') as Route;
  return ROUTES.includes(p) ? p : '/open';
};

/** Two-screen history routing; unknown paths fall back to the cover. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => normalise(window.location.pathname));

  useEffect(() => {
    if (window.location.pathname !== route) window.history.replaceState(null, '', route);
    const onPop = () => setRoute(normalise(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- normalise the URL once on load

  const navigate = useCallback((to: Route) => {
    window.history.pushState(null, '', to);
    setRoute(to);
  }, []);

  return [route, navigate] as const;
}

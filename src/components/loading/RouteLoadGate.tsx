'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import styles from './RouteLoadGate.module.css';

const TIMEOUT_MS = 10_000;
const FADE_MS = 240;

type RouteLoadContextValue = {
  forceMapLoad: boolean;
  reportMapReady: () => void;
};

const RouteLoadContext = createContext<RouteLoadContextValue | null>(null);

export function useRouteLoadGate() {
  return useContext(RouteLoadContext);
}

function reducedMotionIsActive() {
  return (
    document.documentElement.dataset.motion === 'reduce' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function afterLayoutSettles() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function waitForImage(image: HTMLImageElement) {
  return new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    };

    if (image.complete) {
      if (image.naturalWidth > 0 && image.decode) void image.decode().catch(() => undefined).then(finish);
      else finish();
      return;
    }

    image.addEventListener('load', () => {
      if (image.decode) void image.decode().catch(() => undefined).then(finish);
      else finish();
    }, { once: true });
    image.addEventListener('error', finish, { once: true });
  });
}

function waitForVideo(video: HTMLVideoElement) {
  const poster = video.getAttribute('poster');
  if (poster) {
    const image = new Image();
    image.src = poster;
    return waitForImage(image);
  }

  return new Promise<void>((resolve) => {
    const finish = () => resolve();
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finish();
    else {
      video.addEventListener('loadeddata', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
    }
  });
}

async function waitForCriticalOpeningMedia(root: HTMLElement) {
  await afterLayoutSettles();
  const media = Array.from(
    root.querySelectorAll<HTMLImageElement | HTMLVideoElement>('[data-route-critical-media]'),
  );
  await Promise.all(
    media.map((item) =>
      item instanceof HTMLVideoElement ? waitForVideo(item) : waitForImage(item),
    ),
  );
}

async function waitForHomeIntro(pathname: string) {
  if (pathname !== '/') return;
  await afterLayoutSettles();
  if (!document.documentElement.hasAttribute('data-intro')) return;

  await new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (document.documentElement.hasAttribute('data-intro')) return;
      observer.disconnect();
      resolve();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-intro'],
    });
  });
}

function RouteLoadCycle({ pathname, children }: { pathname: string; children: ReactNode }) {
  const requiresMap = pathname === '/contato';
  const contentRef = useRef<HTMLDivElement>(null);
  const [openingReady, setOpeningReady] = useState(false);
  const [mapReady, setMapReady] = useState(!requiresMap);
  const [timedOut, setTimedOut] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const exitStartedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const reportMapReady = useCallback(() => setMapReady(true), []);
  const contextValue = useMemo(
    () => ({ forceMapLoad: requiresMap && visible, reportMapReady }),
    [reportMapReady, requiresMap, visible],
  );

  useEffect(() => {
    let active = true;
    const fonts = document.fonts?.ready.catch(() => undefined) ?? Promise.resolve();
    const media = contentRef.current
      ? waitForCriticalOpeningMedia(contentRef.current)
      : Promise.resolve();

    void Promise.all([fonts, media, waitForHomeIntro(pathname)]).then(() => {
      if (active) setOpeningReady(true);
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if ((!timedOut && (!openingReady || !mapReady)) || exitStartedRef.current) return;

    exitStartedRef.current = true;
    setExiting(true);
    exitTimerRef.current = window.setTimeout(
      () => setVisible(false),
      reducedMotionIsActive() ? 0 : FADE_MS,
    );
  }, [mapReady, openingReady, timedOut]);

  useEffect(
    () => () => {
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const previous = html.getAttribute('data-route-scroll-locked');
    html.setAttribute('data-route-scroll-locked', '');
    return () => {
      if (previous === null) html.removeAttribute('data-route-scroll-locked');
      else html.setAttribute('data-route-scroll-locked', previous);
    };
  }, [visible]);

  return (
    <RouteLoadContext.Provider value={contextValue}>
      <div
        ref={contentRef}
        data-route-content=""
        data-route-path={pathname}
        data-route-opening-ready={openingReady ? 'true' : 'false'}
        data-route-map-ready={mapReady ? 'true' : 'false'}
        data-route-timeout={timedOut ? 'true' : 'false'}
        aria-busy={visible}
        inert={visible || undefined}
      >
        {children}
      </div>

      {visible && (
        <div
          data-route-loading=""
          data-state={exiting ? 'exiting' : 'loading'}
          className={styles.overlay}
        >
          <div aria-hidden="true" className={styles.brand}>
            <span className={styles.wordmark}>SISTRAN</span>
            <span className={styles.signal} />
          </div>
          <p className="sr-only" role="status" aria-live="polite">
            Carregando…
          </p>
        </div>
      )}
    </RouteLoadContext.Provider>
  );
}

export default function RouteLoadGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <RouteLoadCycle key={pathname} pathname={pathname}>
      {children}
    </RouteLoadCycle>
  );
}

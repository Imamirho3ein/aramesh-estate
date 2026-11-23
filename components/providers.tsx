"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, Heart, Info, Scale, X } from "lucide-react";

type ToastTone = "success" | "info";
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface AppContextValue {
  favorites: string[];
  compare: string[];
  ready: boolean;
  isFavorite: (id: string) => boolean;
  isCompare: (id: string) => boolean;
  toggleFavorite: (id: string, title?: string) => void;
  toggleCompare: (id: string, title?: string) => void;
  setCompareIds: (ids: string[]) => void;
  clearCompare: () => void;
  pushToast: (message: string, tone?: ToastTone) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const FAV_KEY = "aramesh:favorites";
const CMP_KEY = "aramesh:compare";

export function Providers({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const favoritesRef = useRef<string[]>([]);
  const compareRef = useRef<string[]>([]);

  useEffect(() => {
    try {
      const f = localStorage.getItem(FAV_KEY);
      const c = localStorage.getItem(CMP_KEY);
      if (f) {
        const parsed = JSON.parse(f) as string[];
        favoritesRef.current = parsed;
        setFavorites(parsed);
      }
      if (c) {
        const parsed = JSON.parse(c) as string[];
        compareRef.current = parsed;
        setCompare(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CMP_KEY, JSON.stringify(compare));
    } catch {
      /* ignore */
    }
  }, [compare, ready]);

  const pushToast = useCallback((message: string, tone: ToastTone = "success") => {
    counter.current += 1;
    const id = counter.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const toggleFavorite = useCallback(
    (id: string, title?: string) => {
      const exists = favoritesRef.current.includes(id);
      const next = exists
        ? favoritesRef.current.filter((x) => x !== id)
        : [...favoritesRef.current, id];
      favoritesRef.current = next;
      setFavorites(next);
      pushToast(
        exists
          ? `${title ? `«${title}» ` : ""}از علاقه‌مندی‌ها حذف شد`
          : `${title ? `«${title}» ` : ""}به علاقه‌مندی‌ها اضافه شد`,
        exists ? "info" : "success",
      );
    },
    [pushToast],
  );

  const toggleCompare = useCallback(
    (id: string, title?: string) => {
      if (compareRef.current.includes(id)) {
        const next = compareRef.current.filter((x) => x !== id);
        compareRef.current = next;
        setCompare(next);
        pushToast("از لیست مقایسه حذف شد", "info");
        return;
      }
      if (compareRef.current.length >= 3) {
        pushToast("حداکثر ۳ ملک را می‌توانید هم‌زمان مقایسه کنید", "info");
        return;
      }
      const next = [...compareRef.current, id];
      compareRef.current = next;
      setCompare(next);
      pushToast(`${title ? `«${title}» ` : ""}به لیست مقایسه اضافه شد`);
    },
    [pushToast],
  );

  const clearCompare = useCallback(() => {
    compareRef.current = [];
    setCompare([]);
  }, []);
  const setCompareIds = useCallback((ids: string[]) => {
    const next = ids.slice(0, 3);
    compareRef.current = next;
    setCompare(next);
  }, []);

  return (
    <AppContext.Provider
      value={{
        favorites,
        compare,
        ready,
        isFavorite: (id) => favorites.includes(id),
        isCompare: (id) => compare.includes(id),
        toggleFavorite,
        toggleCompare,
        setCompareIds,
        clearCompare,
        pushToast,
      }}
    >
      {children}
      <div className="pointer-events-none fixed bottom-5 left-5 z-[120] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-up pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0c1116] px-4 py-3 text-sm text-white shadow-2xl shadow-black/30"
          >
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full ${
                toast.tone === "success"
                  ? "bg-[#c8f45a] text-[#0a0f0c]"
                  : "bg-white/10 text-white"
              }`}
            >
              {toast.tone === "success" ? <Check size={16} /> : <Info size={16} />}
            </span>
            <span className="flex-1 leading-6">{toast.message}</span>
            <button
              type="button"
              aria-label="بستن"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/40 transition hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside Providers");
  return ctx;
}

export const icons = { Heart, Scale };

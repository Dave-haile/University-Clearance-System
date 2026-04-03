import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  LoaderCircle,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";
type ToastVariant = "default" | "destructive";

interface ToastRecord {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

type ToastInput = Omit<ToastRecord, "id">;

type ToastOptions = {
  description?: React.ReactNode;
  duration?: number;
};

type ToastPayload = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
};

interface ToastContextValue {
  toasts: ToastRecord[];
  addToast: (toast: ToastInput) => string;
  removeToast: (id: string) => void;
  toast: ToastController;
}

const DEFAULT_DURATION = 5000;
const listeners = new Set<(toasts: ToastRecord[]) => void>();
let memoryToasts: ToastRecord[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener(memoryToasts));
};

const generateToastId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

const toText = (value?: React.ReactNode) => {
  if (value == null) return undefined;
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return undefined;
};

const removeToast = (id: string) => {
  memoryToasts = memoryToasts.filter((toast) => toast.id !== id);
  notifyListeners();
};

const addToast = ({
  type,
  title,
  message,
  duration = DEFAULT_DURATION,
}: ToastInput) => {
  const id = generateToastId();

  memoryToasts = [...memoryToasts, { id, type, title, message, duration }];
  notifyListeners();

  if (duration !== Infinity) {
    window.setTimeout(() => removeToast(id), duration);
  }

  return id;
};

const subscribe = (listener: (toasts: ToastRecord[]) => void) => {
  listeners.add(listener);
  listener(memoryToasts);

  return () => {
    listeners.delete(listener);
  };
};

const mapVariantToType = (variant?: ToastVariant): ToastType =>
  variant === "destructive" ? "error" : "info";

const createToastFromPayload = ({
  title,
  description,
  variant,
  duration,
}: ToastPayload) =>
  addToast({
    type: mapVariantToType(variant),
    title: toText(title) ?? (variant === "destructive" ? "Error" : "Notice"),
    message: toText(description),
    duration,
  });

type ToastController = ((payload: ToastPayload) => { id: string }) & {
  success: (message: string, options?: ToastOptions) => { id: string };
  error: (message: string, options?: ToastOptions) => { id: string };
  info: (message: string, options?: ToastOptions) => { id: string };
  warning: (message: string, options?: ToastOptions) => { id: string };
  loading: (message: string, options?: ToastOptions) => { id: string };
  dismiss: (id?: string) => void;
};

const createVariantToast =
  (type: ToastType) => (message: string, options?: ToastOptions) => ({
    id: addToast({
      type,
      title: message,
      message: toText(options?.description),
      duration: options?.duration ?? DEFAULT_DURATION,
    }),
  });

export const toast = Object.assign(
  (payload: ToastPayload) => ({
    id: createToastFromPayload(payload),
  }),
  {
    success: createVariantToast("success"),
    error: createVariantToast("error"),
    info: createVariantToast("info"),
    warning: createVariantToast("warning"),
    loading: createVariantToast("loading"),
    dismiss: (id?: string) => {
      if (id) {
        removeToast(id);
        return;
      }

      memoryToasts = [];
      notifyListeners();
    },
  },
) as ToastController;

export const useToast = (): ToastContextValue => {
  const [toasts, setToasts] = useState<ToastRecord[]>(memoryToasts);

  useEffect(() => subscribe(setToasts), []);

  return {
    toasts,
    addToast,
    removeToast,
    toast,
  };
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toasts } = useToast();

  return (
    <>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            {...toastItem}
            onClose={() => removeToast(toastItem.id)}
          />
        ))}
      </div>
    </>
  );
};

const ToastItem: React.FC<ToastRecord & { onClose: () => void }> = ({
  type,
  title,
  message,
  onClose,
}) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          iconClassName: "text-emerald-500",
          toneClassName:
            "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50",
        };
      case "error":
        return {
          icon: AlertCircle,
          iconClassName: "text-rose-500",
          toneClassName:
            "bg-rose-50 border-rose-100 dark:bg-rose-950/30 dark:border-rose-900/50",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          iconClassName: "text-amber-500",
          toneClassName:
            "bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50",
        };
      case "loading":
        return {
          icon: LoaderCircle,
          iconClassName: "text-sky-500 animate-spin",
          toneClassName:
            "bg-sky-50 border-sky-100 dark:bg-sky-950/30 dark:border-sky-900/50",
        };
      default:
        return {
          icon: Info,
          iconClassName: "text-indigo-500",
          toneClassName:
            "bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/50",
        };
    }
  };

  const { icon: Icon, iconClassName, toneClassName } = getStyles();

  return (
    <div className="pointer-events-auto">
      <div className="flex gap-4 rounded-2xl border bg-white p-4 shadow-2xl shadow-slate-200/50 transition-all duration-300 dark:bg-slate-900 dark:shadow-none">
        <div
          className={`h-fit shrink-0 rounded-xl border p-2 ${toneClassName} ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-black leading-tight text-slate-900 dark:text-slate-50">
            {title}
          </h4>
          {message ? (
            <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
              {message}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-fit rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

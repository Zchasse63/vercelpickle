"use client";

import { lazyImport } from "@/lib/lazy-import";
import { ContactSkeleton } from "./contact-skeleton";

export const LazyContactContent = lazyImport(
  () => import("./contact-content"),
  "ContactContent",
  {
    ssr: false,
    loading: () => <ContactSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load contact page
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the contact page"}
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Retry
        </button>
      </div>
    ),
    onError: (error) => {
      console.error("Error loading contact content:", error);
    }
  }
);

export function preloadContactContent() {
  return import("./contact-content").then(mod => mod.ContactContent);
}

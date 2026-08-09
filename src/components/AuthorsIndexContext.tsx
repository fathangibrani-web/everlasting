"use client";

import { createContext, useContext } from "react";

import type { AuthorIndexEntry } from "@/sanity/lib/types";

const AuthorsIndexContext = createContext<AuthorIndexEntry[]>([]);

export function AuthorsIndexProvider({
  authors,
  children,
}: {
  authors: AuthorIndexEntry[];
  children: React.ReactNode;
}) {
  return (
    <AuthorsIndexContext.Provider value={authors}>
      {children}
    </AuthorsIndexContext.Provider>
  );
}

export function useAuthorsIndex() {
  return useContext(AuthorsIndexContext);
}

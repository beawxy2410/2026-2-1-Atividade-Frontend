"use client";

import type { AuthUser } from "@/lib/types";

const STORAGE_KEY = "pos-auth-user";
const COOKIE_NAME = "pos-auth-token";

export async function login(username: string, password: string): Promise<AuthUser> {
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Usuário ou senha inválidos");
    }
    throw new Error("Não foi possível autenticar. Tente novamente.");
  }

  const user: AuthUser = await response.json();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${user.accessToken}; path=/; max-age=3600; SameSite=Lax`;

  return user;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
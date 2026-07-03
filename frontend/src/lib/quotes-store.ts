"use client";

import type { Quote } from "@/lib/types";

const QUOTES_KEY = "pos-local-quotes";
const AUTHORS_KEY = "pos-known-authors";

interface LocalQuotesState {
  created: Quote[];
  updated: Record<number, Quote>;
  deletedIds: number[];
}

function readState(): LocalQuotesState {
  if (typeof window === "undefined") {
    return { created: [], updated: {}, deletedIds: [] };
  }
  const raw = localStorage.getItem(QUOTES_KEY);
  if (!raw) return { created: [], updated: {}, deletedIds: [] };
  try {
    return JSON.parse(raw) as LocalQuotesState;
  } catch {
    return { created: [], updated: {}, deletedIds: [] };
  }
}

function writeState(state: LocalQuotesState) {
  localStorage.setItem(QUOTES_KEY, JSON.stringify(state));
}

export function mergeWithLocalChanges(apiQuotes: Quote[]): Quote[] {
  const state = readState();
  const merged = apiQuotes
    .filter((q) => !state.deletedIds.includes(q.id))
    .map((q) => state.updated[q.id] ?? q);

  return [...state.created, ...merged];
}

export function addLocalQuote(quote: Omit<Quote, "id">): Quote {
  const state = readState();
  const newQuote: Quote = { ...quote, id: Date.now() };
  state.created.unshift(newQuote);
  writeState(state);
  rememberAuthor(quote.author);
  return newQuote;
}

export function updateLocalQuote(quote: Quote) {
  const state = readState();
  const createdIndex = state.created.findIndex((q) => q.id === quote.id);
  if (createdIndex >= 0) {
    state.created[createdIndex] = quote;
  } else {
    state.updated[quote.id] = quote;
  }
  writeState(state);
  rememberAuthor(quote.author);
}

export function deleteLocalQuote(id: number) {
  const state = readState();
  state.created = state.created.filter((q) => q.id !== id);
  delete state.updated[id];
  if (!state.deletedIds.includes(id)) {
    state.deletedIds.push(id);
  }
  writeState(state);
}

export function rememberAuthor(author: string) {
  const trimmed = author.trim();
  if (!trimmed) return;
  const authors = getKnownAuthors();
  if (!authors.includes(trimmed)) {
    authors.push(trimmed);
    localStorage.setItem(AUTHORS_KEY, JSON.stringify(authors));
  }
}

export function getKnownAuthors(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(AUTHORS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
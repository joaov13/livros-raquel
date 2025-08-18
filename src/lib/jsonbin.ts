import { Book } from "@/types/book";

const JSONBIN_KEY = "$2a$10$sSvX7wa5M7hdDocqPSBj/.JTqwsIVtSF9wzDvW9MpQIE8GjmQfH/W";
const JSONBIN_ID = "68a35e7bae596e708fcd77c6";

const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_ID}`;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Access-Key": JSONBIN_KEY,
};

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${JSONBIN_URL}/latest`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Falha ao buscar livros: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data.record) ? data.record : [];
}

export async function updateBooks(books: Book[]): Promise<{ metadata: any }> {
  const res = await fetch(JSONBIN_URL, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify(books),
  });
  if (!res.ok) throw new Error(`Falha ao atualizar livros: ${res.status}`);
  return res.json();
}

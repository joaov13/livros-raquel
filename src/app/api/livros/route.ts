import { NextResponse } from "next/server";
import { getBooks, updateBooks } from "@/lib/jsonbin";
import { Book } from "@/types/book";

export async function GET() {
  const books: Book[] = await getBooks();
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const newBook: { nome: string; link: string } = await req.json();
  const books: Book[] = await getBooks();

  books.push({
    id: Date.now(),
    nome: newBook.nome,
    link: newBook.link,
    comprado: false,
    compradoPor: "",
  });

  await updateBooks(books);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const { id, comprador }: { id: number; comprador: string } = await req.json();
  let books: Book[] = await getBooks();

  books = books.map((b: Book) =>
    b.id === id ? { ...b, comprado: true, compradoPor: comprador } : b
  );

  await updateBooks(books);
  return NextResponse.json({ ok: true });
}

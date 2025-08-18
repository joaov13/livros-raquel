"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Book } from "@/types/book";
import { getBooks, updateBooks } from "@/lib/jsonbin";

const MySwal = withReactContent(Swal);

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      MySwal.fire("Erro", "Não foi possível carregar os livros.", "error");
    }
  }

  async function handleComprar(book: Book) {
    const { value: nome } = await MySwal.fire({
      title: "Digite seu nome",
      input: "text",
      inputLabel: "Nome",
      inputPlaceholder: "Seu nome",
      showCancelButton: true,
    });

    if (nome) {
      const updatedBooks = books.map((b) =>
        b.id === book.id
          ? { ...b, comprado: true, compradoPor: nome }
          : b
      );
      try {
        await updateBooks(updatedBooks);
        setBooks(updatedBooks);
        MySwal.fire("Sucesso", "Livro marcado como comprado!", "success");
      } catch (err) {
        console.error(err);
        MySwal.fire("Erro", "Não foi possível atualizar o livro.", "error");
      }
    }
  }

  return (
    <div className="container">
      <div className="info-box">
        <p>
          Aqui você vê todos os livros cadastrados. Clique em <strong>Comprar</strong> ao lado de um livro e informe seu nome para marcar que você comprou.  
          Clique em <strong>Ver livro</strong> para abrir o link do livro em nova aba.
        </p>
      </div>

      <h1>Lista de Livros</h1>
      <ul className="livros-lista">
        {books.map((book) => (
          <li key={book.id}>
            <a href={book.link} target="_blank" rel="noreferrer">
              {book.nome}
            </a>
            <div className="buttons">
              {book.comprado ? (
                <span>Comprado por {book.compradoPor}</span>
              ) : (
                <>
                  <button onClick={() => handleComprar(book)}>Comprar</button>
                  <a href={book.link} target="_blank" rel="noreferrer">
                    <button>Ver livro</button>
                  </a>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

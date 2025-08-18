"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { getBooks, updateBooks } from "@/lib/jsonbin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function LivrosPage() {
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
      title: `Comprar ${book.nome}`,
      input: "text",
      inputLabel: "Digite seu nome",
      showCancelButton: true,
    });

    if (nome) {
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, comprado: true, compradoPor: nome } : b
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
      {/* Título grande */}
      <h1 className="titulo-principal">Livros para a Raquel</h1>

      {/* Descrição acima do tutorial */}
      <div className="descricao-principal">
        <p>
          Aqui tu pode ver os livros que a Raquel amaria receber de aniverário,
          que é dia 15/09. Use a lista para ver onde comprar o livro e também
          ver se alguém já comprou.
        </p>
      </div>

      {/* Tutorial */}
      <div className="info-box">
        <p>
          Clique no link do livro para ir para a página de compra. Clique em{" "}
          <strong>Comprar</strong> para marcar que você comprou o livro.
        </p>
      </div>

      {/* Lista de livros */}
      <ul className="livros-lista">
        {books.map((book) => (
          <li key={book.id}>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              {book.nome}
            </a>
            <div className="buttons">
              <button onClick={() => handleComprar(book)}>Comprar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
      // ordena não comprados primeiro
      data.sort((a, b) => Number(a.comprado) - Number(b.comprado));
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
      <h1 className="titulo-principal">Livros para a Raquel</h1>

      <div className="descricao-principal">
        <p>
          Aqui tu pode ver os livros que a Raquel amaria receber de aniverário,
          que é dia 15/09. Use a lista para ver onde comprar o livro e também
          ver se alguém já comprou.
        </p>
      </div>

      <div className="info-box">
        <p>
          Clique no botão <strong>Ver Livro</strong> para acessar o link de compra.
          Clique em <strong>Comprar</strong> para marcar que você comprou o livro.
        </p>
      </div>

      <ul className="livros-lista">
        {books.map((book) => (
          <li key={book.id}>
            <span className="titulo-livro">{book.nome}</span>
            {book.compradoPor && (
              <span className="comprado-por">Comprado por: {book.compradoPor}</span>
            )}
            <div className="buttons">
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button>Ver Livro</button>
              </a>
              <button onClick={() => handleComprar(book)}>Comprar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

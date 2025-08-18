"use client";
import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "sweetalert2/src/sweetalert2.scss";

const MySwal = withReactContent(Swal);

export default function LivrosPage() {
  const [books, setBooks] = useState<Book[]>([]);

  const fetchLivros = async () => {
    try {
      const res = await fetch("/api/livros");
      if (!res.ok) throw new Error(`Erro ao buscar livros: ${res.status}`);
      const data: Book[] = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleComprar = async (book: Book) => {
    const { value: comprador } = await MySwal.fire({
      title: `Quem vai comprar "${book.nome}"?`,
      input: "text",
      inputPlaceholder: "Digite seu nome",
      showCancelButton: true,
    });

    if (!comprador) return;

    try {
      await fetch("/api/livros", {
        method: "PUT",
        body: JSON.stringify({ id: book.id, comprador }),
      });

      setBooks(prev =>
        prev.map(b =>
          b.id === book.id ? { ...b, comprado: true, compradoPor: comprador } : b
        )
      );
      MySwal.fire("Sucesso!", `"${book.nome}" foi marcado como comprado.`, "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("Erro", "Não foi possível atualizar o livro.", "error");
    }
  };

  return (
<div className="container">
  <div className="info-box">
    <p>
      Aqui você vê todos os livros cadastrados. Clique no botão <strong>Comprar</strong> ao lado de um livro e informe seu nome para marcar que você comprou.
    </p>
  </div>

  <h1>Lista de Livros</h1>
  <ul className="livros-lista">
    {books.map(book => (
      <li key={book.id}>
        <a href={book.link} target="_blank" rel="noreferrer">
          {book.nome}
        </a>
        {book.comprado ? (
          <span>Comprado por {book.compradoPor}</span>
        ) : (
          <button onClick={() => handleComprar(book)}>Comprar</button>
        )}
      </li>
    ))}
  </ul>
</div>


  );
}

"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { getBooks, updateBooks, deleteBook } from "@/lib/jsonbin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CadastrarLivroPage() {
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [showDeleteList, setShowDeleteList] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newBook: Book = {
      id: Date.now(),
      nome,
      link,
      comprado: false,
      compradoPor: "",
    };
    const updatedBooks = [...books, newBook];
    try {
      await updateBooks(updatedBooks);
      setBooks(updatedBooks);
      setNome("");
      setLink("");
      MySwal.fire("Sucesso", "Livro adicionado!", "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("Erro", "Não foi possível adicionar o livro.", "error");
    }
  }

  async function handleDelete(book: Book) {
    const confirm = await MySwal.fire({
      title: `Deletar ${book.nome}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBook(book.id);
        setBooks((prev) => prev.filter((b) => b.id !== book.id));
        MySwal.fire("Deletado!", "O livro foi removido.", "success");
      } catch (err) {
        console.error(err);
        MySwal.fire("Erro", "Não foi possível deletar o livro.", "error");
      }
    }
  }

  return (
    <div className="container">
      <div className="info-box">
        <p>
          Aqui você pode cadastrar novos livros. Preencha o nome e o link e clique em <strong>Adicionar</strong>.  
          Use o botão <strong>Deletar livros</strong> para gerenciar e remover livros.
        </p>
      </div>

      <h1>Cadastrar Livro</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do livro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Link do livro"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <p style={{ marginBottom: "0.5rem", fontStyle: "italic", color: "#666" }}>
          Clique abaixo para mostrar a lista de livros e deletar os que desejar.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteList((prev) => !prev)}
        >
          {showDeleteList ? "Fechar lista de deleção" : "Deletar livros"}
        </button>
      </div>


      {showDeleteList && (
        <ul className="livros-lista">
          {books.map((book) => (
            <li key={book.id}>
              <span>{book.nome}</span>
              <div className="buttons">
                <button className="delete" onClick={() => handleDelete(book)}>
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

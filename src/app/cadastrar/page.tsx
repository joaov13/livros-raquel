"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { getBooks, updateBooks, deleteBook } from "@/lib/jsonbin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/navigation";

const MySwal = withReactContent(Swal);

export default function CadastrarLivroPage() {
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [showEditList, setShowEditList] = useState(false);
  const router = useRouter();

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
    const updatedBooks = [newBook, ...books];
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

  async function handleEditarTitulo(book: Book) {
    const { value: novoNome } = await MySwal.fire({
      title: `Editar título de ${book.nome}`,
      input: "text",
      inputValue: book.nome,
      showCancelButton: true,
    });

    if (novoNome) {
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, nome: novoNome } : b
      );
      await updateBooks(updatedBooks);
      setBooks(updatedBooks);
    }
  }

  async function handleEditarComprador(book: Book) {
    const { value: novoComprador } = await MySwal.fire({
      title: `Editar comprador de ${book.nome}`,
      input: "text",
      inputValue: book.compradoPor,
      showCancelButton: true,
    });

    if (novoComprador !== undefined) {
      const updatedBooks = books.map((b) =>
        b.id === book.id ? { ...b, compradoPor: novoComprador } : b
      );
      await updateBooks(updatedBooks);
      setBooks(updatedBooks);
    }
  }

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={() => router.push("/")}>
          Ir para página principal
        </button>
      </div>

      <div className="info-box">
        <p>
          Aqui você pode cadastrar novos livros. Preencha o nome e o link e
          clique em <strong>Adicionar</strong>. Use o botão{" "}
          <strong>Editar livros</strong> para gerenciar e modificar livros.
        </p>
      </div>
      <h1 className="titulo-cadastro" style={{ textAlign: "center" }}>
        Cadastrar Livro
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Nome do livro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: "300px", maxWidth: "100%" }}
        />
        <input
          type="text"
          placeholder="Link do livro"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          style={{ width: "300px", maxWidth: "100%" }}
        />
        <button type="submit" style={{ maxWidth: "150px" }}>Adicionar</button>
      </form>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <p style={{ marginBottom: "0.5rem", fontStyle: "italic", color: "#666" }}>
          Clique abaixo para mostrar a lista de livros e editar ou deletar.
        </p>
        <button type="button" onClick={() => setShowEditList((prev) => !prev)}>
          {showEditList ? "Fechar lista de edição" : "Editar livros"}
        </button>
      </div>

      {showEditList && (
        <ul className="livros-lista">
          {books.map((book) => (
            <li key={book.id}>
              <span className="titulo-livro">{book.nome}</span>
              {book.compradoPor && (
                <span className="comprado-por">Comprado por: {book.compradoPor}</span>
              )}
              <div className="buttons">
                <button
                  className="editar-titulo"
                  onClick={() => handleEditarTitulo(book)}
                >
                  Editar Título
                </button>
                <button
                  className="editar-comprador"
                  onClick={() => handleEditarComprador(book)}
                >
                  Editar Comprador
                </button>
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

"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { getBooks, updateBooks, deleteBook } from "@/lib/jsonbin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";

const MySwal = withReactContent(Swal);

export default function CadastrarLivroPage() {
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [imagem, setImagem] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [showEditList, setShowEditList] = useState(false);

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
      imagem,
      comprado: false,
      compradoPor: "",
    };
    const updatedBooks = [...books, newBook];
    try {
      await updateBooks(updatedBooks);
      setBooks(updatedBooks);
      setNome("");
      setLink("");
      setImagem("");
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

  async function handleEditTitle(book: Book) {
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

  async function handleEditComprador(book: Book) {
    const { value: comprador } = await MySwal.fire({
      title: `Editar comprador de ${book.nome}`,
      input: "text",
      inputValue: book.compradoPor,
      showCancelButton: true,
    });

    const updatedBooks = books.map((b) =>
      b.id === book.id
        ? { ...b, comprado: comprador ? true : false, compradoPor: comprador || "" }
        : b
    );
    await updateBooks(updatedBooks);
    setBooks(updatedBooks);
  }

  async function handleEditImagem(book: Book) {
    const { value: novaImagem } = await MySwal.fire({
      title: `Editar imagem de ${book.nome}`,
      input: "text",
      inputValue: book.imagem,
      showCancelButton: true,
    });

    const updatedBooks = books.map((b) =>
      b.id === book.id ? { ...b, imagem: novaImagem } : b
    );
    await updateBooks(updatedBooks);
    setBooks(updatedBooks);
  }

  function handleImagemClick(imagem?: string) {
    const imgSrc = imagem && imagem.trim() !== "" ? imagem : "/sem_imagem.jpg";
    MySwal.fire({
      imageUrl: imgSrc,
      imageAlt: "Imagem do livro",
      showConfirmButton: false,
      showCloseButton: true,
    });
  }

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <Link href="/">
          <button>Ir para página principal</button>
        </Link>
      </div>

      <div className="info-box">
        <p>
          Aqui você pode cadastrar novos livros, adicionar links de compra e imagens.
          Use os botões de edição para alterar título, comprador ou imagem, e deletar para remover.
        </p>
      </div>

      <h1 className="titulo-cadastro">Cadastrar Livro</h1>

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
        <input
          type="text"
          placeholder="Link da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={() => setShowEditList((prev) => !prev)}>
          {showEditList ? "Fechar lista de edição" : "Editar livros"}
        </button>
      </div>

      {showEditList && (
        <ul className="livros-lista">
          {books.map((book) => (
            <li key={book.id}>
              <img
                src={book.imagem && book.imagem.trim() !== "" ? book.imagem : "/sem_imagem.jpg"}
                alt={book.nome}
                className={book.comprado ? "imagem-cinza" : ""}
                onClick={() => handleImagemClick(book.imagem)}
              />
              <div className="book-info">
                <span className="titulo-livro">{book.nome}</span>
                {book.comprado && (
                  <span className="comprado-por">Comprado por: {book.compradoPor}</span>
                )}
                <div className="buttons">
                  <button onClick={() => handleEditTitle(book)}>Editar Título</button>
                  <button onClick={() => handleEditComprador(book)}>Editar Comprador</button>
                  <button onClick={() => handleEditImagem(book)}>Alterar Imagem</button>
                  <button className="delete" onClick={() => handleDelete(book)}>
                    Deletar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

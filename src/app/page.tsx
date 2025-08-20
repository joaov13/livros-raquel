"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types/book";
import { getBooks, updateBooks } from "@/lib/jsonbin";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function LivrosPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showEndereco, setShowEndereco] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const data = await getBooks();
      data.sort((a, b) => Number(a.comprado) - Number(b.comprado)); // não comprados primeiro
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
      <h1 className="titulo-principal">Livros para a Raquel</h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button onClick={() => setShowTutorial((prev) => !prev)}>Como usar?</button>
        <button onClick={() => setShowEndereco((prev) => !prev)} style={{ marginLeft: "1rem" }}>
          Ver endereço
        </button>
      </div>

      {showTutorial && (
        <div className="info-box" style={{ textAlign: "center" }}>
          <p>
            Aqui você pode ver os livros que eu, Raquel, amaria receber de aniversário, que é dia  <strong>15/09</strong>.
            Clique na  <strong>imagem</strong> para visualizar, no botão <strong>Comprar</strong> para marcar que você comprou,
            e no botão <strong>Ver livro</strong> para acessar a página de compra.
            <br />
            <li> Lembrando que esse site não tem vínculo com os sites de compra e serve apenas como uma lista</li>
            <li> Use a funcionalidade de <strong>comprar</strong> apenas se você realmente comprou o livro</li>
            <li> Com dúvidas? Mande um whats para mim em:  
              <a 
                href="https://wa.me/5551997698730" 
                target="_blank" 
                rel="noopener noreferrer"
              >+55 51 99769-8730</a>
            </li>
            
          </p>
        </div>
      )}

      {showEndereco && (
        <div className="info-box" style={{ textAlign: "center" }}>
          <p>Avenida Fausto Borba Prates, 3789, Centro, Cidreira - RS, 95595000</p>
          <iframe
            title="Mapa do endereço"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.2782655130836!2d-50.183333!3d-30.169167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9508a123456789ab%3A0xc0ffee1234567890!2sAvenida%20Fausto%20Borba%20Prates%2C%203789%2C%20Cidreira%20-%20RS!5e0!3m2!1spt-BR!2sbr!4v1692500000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="300"
            style={{ border: 0, marginTop: "0.5rem" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}

      <ul className="livros-lista">
        {books.map((book) => (
          <li key={book.id}>
            <img
              src={book.imagem && book.imagem.trim() !== "" ? book.imagem : "/sem_imagem.jpg"}
              alt={book.nome}
              className={book.comprado ? "imagem-cinza" : ""}
              onClick={() => handleImagemClick(book.imagem)}
            />
            <span className="titulo-livro">{book.nome}</span>
            {book.comprado && (
              <span className="comprado-por">Comprado por: {book.compradoPor}</span>
            )}
            <div className="buttons">
              {!book.comprado && (
                <button onClick={() => handleComprar(book)}>Comprar</button>
              )}
              <button
                className="btn-ver-livro"
                onClick={() => window.open(book.link, "_blank")}
              >
                Ver livro
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

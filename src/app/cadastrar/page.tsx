"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastrarPage() {
  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/livros", {
      method: "POST",
      body: JSON.stringify({ nome, link }),
    });
    setNome("");
    setLink("");
    router.push("/"); // volta para a lista
  };

  return (
<div className="container">
  <div className="info-box">
    <p>
      Aqui você pode cadastrar um novo livro. Preencha o nome e o link do livro e clique em <strong>Adicionar</strong>. Ele aparecerá na lista principal.
    </p>
  </div>

  <h1>Cadastrar Livro</h1>
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Nome do livro"
      value={nome}
      onChange={e => setNome(e.target.value)}
      required
    />
    <input
      type="text"
      placeholder="Link do livro"
      value={link}
      onChange={e => setLink(e.target.value)}
      required
    />
    <button type="submit">Adicionar</button>
  </form>
</div>


  );
}

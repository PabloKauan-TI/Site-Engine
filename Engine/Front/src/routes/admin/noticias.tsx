import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  AlertCircle,
  X,
  Newspaper,
  Calendar,
  Tag,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminNews, createNews, updateNews, deleteNews } from "@/lib/admin-api";
import type { ApiNews } from "@/lib/engine-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/noticias")({
  head: () => ({
    meta: [
      { title: "Gerenciar Notícias — Admin | EngineLab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminNoticias,
});

interface NewsFormData {
  titulo: string;
  tipo: string;
  subtitulo: string;
  data: string;
  corpo: string;
}

const emptyForm: NewsFormData = {
  titulo: "",
  tipo: "Notícia",
  subtitulo: "",
  data: new Date().toISOString().split("T")[0],
  corpo: "",
};

function AdminNoticias() {
  const [news, setNews] = useState<ApiNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<ApiNews | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    setLoading(true);
    try {
      const data = await getAdminNews();
      setNews(data);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao carregar notícias",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingNews(null);
    setFormData(emptyForm);
    setStatusMessage(null);
    setModalOpen(true);
  }

  function handleOpenEdit(n: ApiNews) {
    setEditingNews(n);
    setFormData({
      titulo: n.titulo,
      tipo: n.tipo || "Notícia",
      subtitulo: n.subtitulo || "",
      data: n.data ? n.data.split("T")[0] : new Date().toISOString().split("T")[0],
      corpo: n.corpo || "",
    });
    setStatusMessage(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload: Partial<ApiNews> = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        subtitulo: formData.subtitulo,
        data: formData.data,
        corpo: formData.corpo,
      };

      if (editingNews) {
        const updated = await updateNews(editingNews.id, payload);
        setNews((prev) => prev.map((n) => (n.id === editingNews.id ? updated : n)));
        setStatusMessage({ type: "success", text: "Notícia atualizada com sucesso!" });
      } else {
        const created = await createNews(payload);
        setNews((prev) => [created, ...prev]);
        setStatusMessage({ type: "success", text: "Notícia criada com sucesso!" });
      }

      setModalOpen(false);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar notícia",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Tem certeza de que deseja remover a notícia "${title}"?`)) {
      return;
    }

    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((n) => n.id !== id));
      setStatusMessage({ type: "success", text: `Notícia "${title}" removida com sucesso!` });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao remover notícia",
      });
    }
  }

  const filteredNews = news.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.titulo.toLowerCase().includes(q) ||
      (n.tipo && n.tipo.toLowerCase().includes(q)) ||
      (n.subtitulo && n.subtitulo.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="Gerenciamento de Notícias"
      description="Publique comunicados, prêmios, eventos e novidades acadêmicas do laboratório."
      action={
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus size={16} /> Nova Notícia
        </Button>
      }
    >
      <div className="space-y-6">
        {statusMessage && (
          <div
            className={`flex items-center justify-between rounded-2xl border p-4 text-sm ${
              statusMessage.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs font-semibold hover:opacity-70">
              Fechar
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="Buscar notícias por título, tipo ou conteúdo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Total: <strong>{filteredNews.length}</strong>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Título</th>
                  <th className="px-6 py-4">Categoria / Tag</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                      Carregando notícias...
                    </td>
                  </tr>
                ) : filteredNews.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredNews.map((n) => (
                    <tr key={n.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{n.titulo}</div>
                        {n.subtitulo && (
                          <div className="line-clamp-1 max-w-lg text-xs text-muted-foreground">
                            {n.subtitulo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          {n.tipo || "Geral"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {n.data ? new Date(n.data).toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(n)}
                            className="h-8 gap-1.5 px-3 text-xs"
                          >
                            <Edit2 size={13} /> Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(n.id, n.titulo)}
                            className="h-8 gap-1.5 px-3 text-xs"
                          >
                            <Trash2 size={13} /> Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Criar / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingNews ? `Editar Notícia: ${editingNews.titulo}` : "Publicar Nova Notícia"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Informe o título, categoria, data e corpo completo da matéria.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="titulo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Título da Notícia *
                </label>
                <Input
                  id="titulo"
                  required
                  placeholder="Ex: EngineLab recebe prêmio de melhor artigo no IEEE..."
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tipo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Categoria / Tipo
                  </label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Notícia">Notícia</option>
                    <option value="Prêmio">Prêmio</option>
                    <option value="Evento">Evento</option>
                    <option value="Parceria">Parceria</option>
                    <option value="Publicação">Publicação</option>
                    <option value="Atualização">Atualização</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="data" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Data de Publicação
                  </label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subtitulo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Subtítulo / Resumo Breve
                </label>
                <Input
                  id="subtitulo"
                  placeholder="Ex: Reconhecimento inédito sobre agendamento em aprendizado federado..."
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="corpo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Corpo da Notícia (Parágrafos)
                </label>
                <textarea
                  id="corpo"
                  rows={5}
                  placeholder="Escreva os detalhes da matéria. Separe parágrafos com linhas em branco..."
                  value={formData.corpo}
                  onChange={(e) => setFormData({ ...formData, corpo: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : editingNews ? "Salvar Alterações" : "Publicar Notícia"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

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
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminPublications, createPublication, updatePublication, deletePublication, getAdminMembers } from "@/lib/admin-api";
import type { ApiPublication, ApiMember } from "@/lib/engine-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/publicacoes")({
  head: () => ({
    meta: [
      { title: "Gerenciar Publicações — Admin | EngineLab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPublicacoes,
});

interface PublicationFormData {
  titulo: string;
  tipo: string;
  autores: string;
  onde_publicado: string;
  ano: number | "";
  doi: string;
  resumo: string;
  palavras_chave: string;
  member_ids: number[];
}

const emptyForm: PublicationFormData = {
  titulo: "",
  tipo: "Journal",
  autores: "",
  onde_publicado: "",
  ano: new Date().getFullYear(),
  doi: "",
  resumo: "",
  palavras_chave: "",
  member_ids: [],
};

function AdminPublicacoes() {
  const [publications, setPublications] = useState<ApiPublication[]>([]);
  const [allMembers, setAllMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<ApiPublication | null>(null);
  const [formData, setFormData] = useState<PublicationFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadPublications();
  }, []);

  async function loadPublications() {
    setLoading(true);
    try {
      const [data, membersData] = await Promise.all([
        getAdminPublications(),
        getAdminMembers()
      ]);
      setPublications(data);
      setAllMembers(membersData);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao carregar publicações",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingPub(null);
    setFormData(emptyForm);
    setStatusMessage(null);
    setMemberSearch("");
    setModalOpen(true);
  }

  function handleOpenEdit(p: ApiPublication) {
    setEditingPub(p);
    setFormData({
      titulo: p.titulo,
      tipo: p.tipo || "Journal",
      autores: p.autores || "",
      onde_publicado: p.onde_publicado || "",
      ano: p.ano || new Date().getFullYear(),
      doi: p.doi || "",
      resumo: p.resumo || "",
      palavras_chave: p.palavras_chave || "",
      member_ids: p.members?.map((m) => m.id) || [],
    });
    setStatusMessage(null);
    setMemberSearch("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload: Partial<ApiPublication> = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        autores: formData.autores,
        onde_publicado: formData.onde_publicado,
        ano: formData.ano ? Number(formData.ano) : undefined,
        doi: formData.doi,
        resumo: formData.resumo,
        palavras_chave: formData.palavras_chave,
        member_ids: formData.member_ids,
      };

      if (editingPub) {
        const updated = await updatePublication(editingPub.id, payload);
        setPublications((prev) => prev.map((p) => (p.id === editingPub.id ? updated : p)));
        setStatusMessage({ type: "success", text: "Publicação atualizada com sucesso!" });
      } else {
        const created = await createPublication(payload);
        setPublications((prev) => [created, ...prev]);
        setStatusMessage({ type: "success", text: "Publicação criada com sucesso!" });
      }

      setModalOpen(false);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar publicação",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Tem certeza de que deseja remover a publicação "${title}"?`)) {
      return;
    }

    try {
      await deletePublication(id);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      setStatusMessage({ type: "success", text: `Publicação "${title}" removida com sucesso!` });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao remover publicação",
      });
    }
  }

  const filteredPubs = publications.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.titulo.toLowerCase().includes(q) ||
      (p.autores && p.autores.toLowerCase().includes(q)) ||
      (p.onde_publicado && p.onde_publicado.toLowerCase().includes(q)) ||
      (p.tipo && p.tipo.toLowerCase().includes(q)) ||
      String(p.ano).includes(q)
    );
  });

  return (
    <AdminLayout
      title="Gerenciamento de Publicações"
      description="Cadastre e gerencie artigos científicos, periódicos e anais de conferências do laboratório."
      action={
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus size={16} /> Nova Publicação
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
              placeholder="Buscar publicações por título, autor, veículo ou ano..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Total: <strong>{filteredPubs.length}</strong>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Artigo / Publicação</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Veículo (Venue)</th>
                  <th className="px-6 py-4">Ano</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Carregando publicações...
                    </td>
                  </tr>
                ) : filteredPubs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhuma publicação encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredPubs.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{p.titulo}</div>
                        {p.autores && <div className="text-xs text-muted-foreground">{p.autores}</div>}
                        {p.doi && (
                          <a
                            href={`https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            DOI: {p.doi} <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {p.tipo || "Journal"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {p.onde_publicado || "—"}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {p.ano || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(p)}
                            className="h-8 gap-1.5 px-3 text-xs"
                          >
                            <Edit2 size={13} /> Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(p.id, p.titulo)}
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
                  {editingPub ? `Editar Publicação: ${editingPub.titulo}` : "Nova Publicação Científica"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Informe o título, autores, veículo de publicação, ano e DOI.
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
                  Título da Publicação *
                </label>
                <Input
                  id="titulo"
                  required
                  placeholder="Ex: Energy-aware task scheduling for federated learning..."
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="tipo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Tipo de Publicação
                  </label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Journal">Journal (Periódico)</option>
                    <option value="Conference">Conference (Conferência)</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Book Chapter">Capítulo de Livro</option>
                    <option value="Preprint">Preprint</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="ano" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Ano de Publicação
                  </label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value ? Number(e.target.value) : "" })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="autores" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Autores
                </label>
                <Input
                  id="autores"
                  placeholder="Ex: Silva, A.; Costa, R.; Menezes, J."
                  value={formData.autores}
                  onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="onde_publicado" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Veículo / Revista / Conferência (Onde Publicado)
                </label>
                <Input
                  id="onde_publicado"
                  placeholder="Ex: IEEE Internet of Things Journal, ACM TCPS, CVPR Workshops"
                  value={formData.onde_publicado}
                  onChange={(e) => setFormData({ ...formData, onde_publicado: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="doi" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  DOI (Identificador Digital)
                </label>
                <Input
                  id="doi"
                  placeholder="Ex: 10.1109/JIOT.2025.0000001"
                  value={formData.doi}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="palavras_chave" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Palavras-Chave (Separadas por vírgula)
                </label>
                <Input
                  id="palavras_chave"
                  placeholder="Ex: IoT, Federated Learning, Edge Computing"
                  value={formData.palavras_chave}
                  onChange={(e) => setFormData({ ...formData, palavras_chave: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label htmlFor="resumo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Resumo (Abstract)
                </label>
                <textarea
                  id="resumo"
                  rows={4}
                  value={formData.resumo}
                  onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Members Selection (Many-to-Many) */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Membros da Publicação
                  </label>
                  <div className="relative w-1/2 max-w-[200px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <Input
                      type="text"
                      placeholder="Buscar membro..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                </div>
                <div className="grid max-h-48 gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
                  {allMembers
                    .filter((m) => m.nome.toLowerCase().includes(memberSearch.toLowerCase()))
                    .map((m) => {
                      const isSelected = formData.member_ids.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-colors ${
                            isSelected
                              ? "border-primary/50 bg-primary/5 shadow-sm"
                              : "border-transparent hover:bg-secondary/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, member_ids: [...formData.member_ids, m.id] });
                              } else {
                                setFormData({ ...formData, member_ids: formData.member_ids.filter((id) => id !== m.id) });
                              }
                            }}
                          />
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div className="flex items-center gap-2">
                            {m.url_foto ? (
                              <img src={m.url_foto} alt={m.nome} className="h-6 w-6 rounded-full object-cover" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-secondary" />
                            )}
                            <span className="text-sm font-medium">{m.nome}</span>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : editingPub ? "Salvar Alterações" : "Criar Publicação"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

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
  FolderKanban,
  Calendar,
  Layers,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminProjects, createProject, updateProject, deleteProject, getAdminMembers } from "@/lib/admin-api";
import type { ApiProject, ApiMember } from "@/lib/engine-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/projetos")({
  head: () => ({
    meta: [
      { title: "Gerenciar Projetos — Admin | EngineLab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProjetos,
});

interface ProjectFormData {
  titulo: string;
  areas: string;
  subtitulo: string;
  descricao: string;
  objetivos: string;
  tecnologias: string;
  ano_inicio: number | "";
  ano_fim: number | "";
  financiamento: string;
  member_ids: number[];
}

const emptyForm: ProjectFormData = {
  titulo: "",
  areas: "",
  subtitulo: "",
  descricao: "",
  objetivos: "",
  tecnologias: "",
  ano_inicio: new Date().getFullYear(),
  ano_fim: new Date().getFullYear() + 2,
  financiamento: "",
  member_ids: [],
};

function AdminProjetos() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [allMembers, setAllMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ApiProject | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const [data, membersData] = await Promise.all([
        getAdminProjects(),
        getAdminMembers()
      ]);
      setProjects(data);
      setAllMembers(membersData);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao carregar projetos",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingProject(null);
    setFormData(emptyForm);
    setStatusMessage(null);
    setMemberSearch("");
    setModalOpen(true);
  }

  function handleOpenEdit(p: ApiProject) {
    setEditingProject(p);
    setFormData({
      titulo: p.titulo,
      areas: Array.isArray(p.areas) ? p.areas.join(", ") : (p.areas || ""),
      subtitulo: p.subtitulo || "",
      descricao: p.descricao || "",
      objetivos: p.objetivos || "",
      tecnologias: p.tecnologias || "",
      ano_inicio: p.ano_inicio || "",
      ano_fim: p.ano_fim || "",
      financiamento: p.financiamento || "",
      member_ids: p.members?.map(m => m.id) || [],
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
      const areasList = formData.areas
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload: Partial<ApiProject> = {
        titulo: formData.titulo,
        areas: areasList,
        subtitulo: formData.subtitulo,
        descricao: formData.descricao,
        objetivos: formData.objetivos,
        tecnologias: formData.tecnologias,
        ano_inicio: formData.ano_inicio ? Number(formData.ano_inicio) : undefined,
        ano_fim: formData.ano_fim ? Number(formData.ano_fim) : undefined,
        financiamento: formData.financiamento,
        member_ids: formData.member_ids,
      };

      if (editingProject) {
        const updated = await updateProject(editingProject.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        setStatusMessage({ type: "success", text: "Projeto atualizado com sucesso!" });
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        setStatusMessage({ type: "success", text: "Projeto criado com sucesso!" });
      }

      setModalOpen(false);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar projeto",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Tem certeza de que deseja remover o projeto "${title}"?`)) {
      return;
    }

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setStatusMessage({ type: "success", text: `Projeto "${title}" removido com sucesso!` });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao remover projeto",
      });
    }
  }

  const currentYear = new Date().getFullYear();

  const filteredProjects = projects.filter((p) => {
    const q = search.toLowerCase();
    const areasStr = Array.isArray(p.areas) ? p.areas.join(" ") : "";
    return (
      p.titulo.toLowerCase().includes(q) ||
      (p.subtitulo && p.subtitulo.toLowerCase().includes(q)) ||
      areasStr.toLowerCase().includes(q) ||
      (p.tecnologias && p.tecnologias.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="Gerenciamento de Projetos"
      description="Cadastre e edite projetos de pesquisa & desenvolvimento em andamento e concluídos."
      action={
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus size={16} /> Novo Projeto
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
              placeholder="Buscar projetos por título, área ou tecnologias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Total: <strong>{filteredProjects.length}</strong>
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Projeto</th>
                  <th className="px-6 py-4">Área(s)</th>
                  <th className="px-6 py-4">Período / Status</th>
                  <th className="px-6 py-4">Financiamento</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Carregando projetos...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p) => {
                    const isOngoing = !p.ano_fim || p.ano_fim >= currentYear;
                    return (
                      <tr key={p.id} className="transition-colors hover:bg-secondary/20">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{p.titulo}</div>
                          {p.subtitulo && (
                            <div className="line-clamp-1 max-w-md text-xs text-muted-foreground">
                              {p.subtitulo}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(p.areas) && p.areas.length > 0 ? (
                              p.areas.map((a) => (
                                <span
                                  key={a}
                                  className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                                >
                                  {a}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                isOngoing
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isOngoing ? "Em andamento" : "Concluído"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {p.ano_fim ? `${p.ano_inicio}–${p.ano_fim}` : p.ano_inicio}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {p.financiamento || "—"}
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
                    );
                  })
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
                  {editingProject ? `Editar Projeto: ${editingProject.titulo}` : "Cadastrar Novo Projeto"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Insira as informações gerais, objetivos e tecnologias do projeto.
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
                  Título do Projeto *
                </label>
                <Input
                  id="titulo"
                  required
                  placeholder="Ex: SmartAgro Sensing"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="areas" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Áreas (separadas por vírgula)
                  </label>
                  <Input
                    id="areas"
                    placeholder="Ex: IoT, Redes de Sensores, IA"
                    value={formData.areas}
                    onChange={(e) => setFormData({ ...formData, areas: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="financiamento" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Financiamento / Parceria
                  </label>
                  <Input
                    id="financiamento"
                    placeholder="Ex: CNPq + Cooperativa, FINEP"
                    value={formData.financiamento}
                    onChange={(e) => setFormData({ ...formData, financiamento: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subtitulo" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Resumo Curto / Subtítulo
                </label>
                <Input
                  id="subtitulo"
                  placeholder="Ex: Rede de sensores LoRaWAN para monitoramento de solo e irrigação..."
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ano_inicio" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Ano Início
                  </label>
                  <Input
                    id="ano_inicio"
                    type="number"
                    value={formData.ano_inicio}
                    onChange={(e) => setFormData({ ...formData, ano_inicio: e.target.value ? Number(e.target.value) : "" })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="ano_fim" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Ano Fim (Deixe vazio ou futuro para 'Em andamento')
                  </label>
                  <Input
                    id="ano_fim"
                    type="number"
                    value={formData.ano_fim}
                    onChange={(e) => setFormData({ ...formData, ano_fim: e.target.value ? Number(e.target.value) : "" })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="descricao" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Descrição Completa
                </label>
                <textarea
                  id="descricao"
                  rows={3}
                  placeholder="Detalhamento da metodologia e escopo do projeto..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="objetivos" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Objetivos (um por linha ou separados por ponto e vírgula)
                </label>
                <textarea
                  id="objetivos"
                  rows={2}
                  placeholder="Ex: Reduzir consumo de água em 30%;&#10;Monitorar umidade do solo;"
                  value={formData.objetivos}
                  onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="tecnologias" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Tecnologias Utilizadas
                </label>
                <Input
                  id="tecnologias"
                  placeholder="Ex: LoRaWAN, ESP32, TimescaleDB, Grafana, MQTT"
                  value={formData.tecnologias}
                  onChange={(e) => setFormData({ ...formData, tecnologias: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              {/* Members Selection */}
              <div>
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Membros do Projeto
                  </label>
                  <div className="relative w-full sm:w-64">
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
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 max-h-60 overflow-y-auto rounded-xl border border-border bg-secondary/20 p-4">
                  {allMembers.length > 0 ? (
                    allMembers
                      .filter(m => m.nome.toLowerCase().includes(memberSearch.toLowerCase()) || (m.funcao && m.funcao.toLowerCase().includes(memberSearch.toLowerCase())))
                      .map((member) => (
                      <label
                        key={member.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                          formData.member_ids.includes(member.id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={formData.member_ids.includes(member.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData((prev) => ({
                              ...prev,
                              member_ids: isChecked
                                ? [...prev.member_ids, member.id]
                                : prev.member_ids.filter((id) => id !== member.id),
                            }));
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none text-foreground">{member.nome}</span>
                          <span className="mt-1 text-xs text-muted-foreground">{member.funcao || "Membro"}</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-sm text-muted-foreground py-4">
                      Nenhum membro cadastrado.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : editingProject ? "Salvar Alterações" : "Criar Projeto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

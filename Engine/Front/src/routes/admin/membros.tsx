import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Search,
  Check,
  AlertCircle,
  X,
  Mail,
  FileUp,
  DownloadCloud,
  FileText,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminMembers, createMember, updateMember, deleteMember, importMembersCsv } from "@/lib/admin-api";
import type { CsvImportResult } from "@/lib/admin-api";
import type { ApiMember } from "@/lib/engine-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/membros")({
  head: () => ({
    meta: [
      { title: "Gerenciar Membros — Admin | EngineLab" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMembros,
});

interface MemberFormData {
  nome: string;
  email: string;
  funcao: string;
  formacao: string;
  biografia: string;
  linkedin: string;
  lattes: string;
  url_foto?: string;
  fotoFile?: File | null;
}

const emptyForm: MemberFormData = {
  nome: "",
  email: "",
  funcao: "",
  formacao: "",
  biografia: "",
  linkedin: "",
  lattes: "",
  url_foto: "",
  fotoFile: null,
};

function AdminMembros() {
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ApiMember | null>(null);
  const [formData, setFormData] = useState<MemberFormData>(emptyForm);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState<CsvImportResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const data = await getAdminMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao carregar membros",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingMember(null);
    setFormData(emptyForm);
    setPhotoPreview(null);
    setStatusMessage(null);
    setModalOpen(true);
  }

  function handleOpenEdit(m: ApiMember) {
    setEditingMember(m);
    setFormData({
      nome: m.nome,
      email: m.email,
      funcao: m.funcao || "",
      formacao: m.formacao || "",
      biografia: m.biografia || "",
      linkedin: m.linkedin || "",
      lattes: m.lattes || "",
      url_foto: m.url_foto || "",
      fotoFile: null,
    });
    setPhotoPreview(m.url_foto || null);
    setStatusMessage(null);
    setModalOpen(true);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fotoFile: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    setFormData((prev) => ({ ...prev, fotoFile: null, url_foto: "" }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const payload = new FormData();
      payload.append("nome", formData.nome);
      payload.append("email", formData.email);
      payload.append("funcao", formData.funcao);
      payload.append("formacao", formData.formacao);
      payload.append("biografia", formData.biografia);
      payload.append("linkedin", formData.linkedin);
      payload.append("lattes", formData.lattes);

      if (formData.fotoFile) {
        payload.append("foto", formData.fotoFile);
      } else if (formData.url_foto !== undefined) {
        payload.append("url_foto", formData.url_foto);
      }

      if (editingMember) {
        const updated = await updateMember(editingMember.id, payload);
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? updated : m)));
        setStatusMessage({ type: "success", text: "Membro atualizado com sucesso!" });
      } else {
        const created = await createMember(payload);
        setMembers((prev) => [created, ...prev]);
        setStatusMessage({ type: "success", text: "Membro criado com sucesso!" });
      }

      setModalOpen(false);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar membro",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Tem certeza de que deseja remover o membro "${name}"?`)) {
      return;
    }

    try {
      await deleteMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setStatusMessage({ type: "success", text: `Membro "${name}" removido com sucesso!` });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao remover membro",
      });
    }
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvImporting(true);
    setCsvResult(null);
    try {
      const result = await importMembersCsv(file);
      setCsvResult(result);
      // Reload member list to reflect imported data
      await loadMembers();
    } catch (err) {
      setCsvResult({
        message: err instanceof Error ? err.message : "Erro ao importar CSV",
        criados: 0,
        ignorados: 0,
        erros: [err instanceof Error ? err.message : "Erro desconhecido"],
        membros: [],
      });
    } finally {
      setCsvImporting(false);
      // Reset file input so the same file can be re-selected
      if (csvInputRef.current) csvInputRef.current.value = "";
    }
  }

  function downloadTemplate() {
    const header = "nome,email,funcao,formacao,biografia,linkedin,lattes,url_foto";
    const example = "Maria Silva,maria@example.com,Pesquisadora,Inteligência Artificial,Pesquisadora do EngineLab,mariasilvai,1234567890123456,";
    const content = `${header}\n${example}`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "membros_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.nome.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.funcao && m.funcao.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="Gerenciamento de Membros"
      description="Cadastre, atualize e remova pesquisadores, coordenadores e estudantes do laboratório."
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { setCsvResult(null); setCsvModalOpen(true); }} className="gap-2">
            <FileUp size={16} /> Importar CSV
          </Button>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus size={16} /> Novo Membro
          </Button>
        </div>
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
            <button
              onClick={() => setStatusMessage(null)}
              className="text-xs font-semibold hover:opacity-70"
            >
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
              placeholder="Buscar membros por nome, cargo ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Total: <strong>{filteredMembers.length}</strong>
          </div>
        </div>

        {/* Table / List View */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Membro</th>
                  <th className="px-6 py-4">Função / Cargo</th>
                  <th className="px-6 py-4">Formação</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                      Carregando membros...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum membro encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="transition-colors hover:bg-secondary/20">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {m.url_foto ? (
                            <img
                              src={m.url_foto}
                              alt={m.nome}
                              className="h-11 w-11 shrink-0 rounded-full border border-border object-cover ring-2 ring-primary/10"
                            />
                          ) : (
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary ring-2 ring-primary/10">
                              {m.nome.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-foreground">{m.nome}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail size={12} /> {m.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                          {m.funcao || "Membro"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {m.formacao || "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(m)}
                            className="h-8 gap-1.5 px-3 text-xs"
                          >
                            <Edit2 size={13} /> Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(m.id, m.nome)}
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editingMember ? `Editar Membro: ${editingMember.nome}` : "Cadastrar Novo Membro"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Preencha os dados abaixo e envie a foto do pesquisador para o storage.
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
              {/* Photo Upload with Live Preview */}
              <div className="rounded-2xl border border-dashed border-border bg-secondary/20 p-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Foto do Membro (Salva no Storage do Laravel)
                </label>
                <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
                  <div className="relative">
                    {photoPreview ? (
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary ring-4 ring-primary/10">
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute right-0 top-0 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
                          title="Remover foto"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-border bg-background text-muted-foreground">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="foto-upload"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-2"
                    >
                      <Upload size={14} /> Selecionar Imagem
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Suporta JPG, PNG ou WEBP até 5MB. A imagem será salva no storage público.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="nome" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Nome Completo *
                  </label>
                  <Input
                    id="nome"
                    required
                    placeholder="Ex: Dra. Maria Santos"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="maria@enginelab.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="funcao" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Função / Cargo
                  </label>
                  <Input
                    id="funcao"
                    placeholder="Ex: Pesquisadora, Doutoranda, Coordenador"
                    value={formData.funcao}
                    onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="formacao" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Área / Formação
                  </label>
                  <Input
                    id="formacao"
                    placeholder="Ex: Inteligência Artificial, IoT"
                    value={formData.formacao}
                    onChange={(e) => setFormData({ ...formData, formacao: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="biografia" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                  Biografia Resumida
                </label>
                <textarea
                  id="biografia"
                  rows={3}
                  placeholder="Trajetória acadêmica e tópicos de pesquisa..."
                  value={formData.biografia}
                  onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="linkedin" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    LinkedIn (URL ou usuário)
                  </label>
                  <Input
                    id="linkedin"
                    placeholder="mariasantos-ai"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <label htmlFor="lattes" className="block text-xs font-semibold uppercase tracking-wider text-foreground">
                    Currículo Lattes (ID ou link)
                  </label>
                  <Input
                    id="lattes"
                    placeholder="1234567890123456"
                    value={formData.lattes}
                    onChange={(e) => setFormData({ ...formData, lattes: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Salvando..." : editingMember ? "Salvar Alterações" : "Criar Membro"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Importar Membros via CSV</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Envie um arquivo CSV com os membros para cadastro em massa.
                </p>
              </div>
              <button
                onClick={() => { setCsvModalOpen(false); setCsvResult(null); }}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Template download */}
              <div className="flex items-start justify-between rounded-2xl border border-dashed border-border bg-secondary/20 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Colunas aceitas pelo CSV:</p>
                  <code className="mt-1 block text-xs text-muted-foreground">
                    nome, email, funcao, formacao, biografia, linkedin, lattes, url_foto
                  </code>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Apenas <strong>nome</strong> e <strong>email</strong> são obrigatórios. Membros com e-mail já existente são ignorados.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={downloadTemplate} className="ml-4 shrink-0 gap-1.5">
                  <DownloadCloud size={14} /> Template
                </Button>
              </div>

              {/* File input */}
              {!csvResult && (
                <div>
                  <input
                    ref={csvInputRef}
                    type="file"
                    id="csv-upload"
                    accept=".csv,text/csv"
                    onChange={handleCsvImport}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => csvInputRef.current?.click()}
                    disabled={csvImporting}
                    className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 py-10 text-primary transition-colors hover:border-primary hover:bg-primary/10 disabled:opacity-50"
                  >
                    {csvImporting ? (
                      <>
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-sm font-medium">Importando membros...</span>
                      </>
                    ) : (
                      <>
                        <FileUp size={32} className="opacity-70" />
                        <span className="text-sm font-medium">Clique para selecionar o arquivo CSV</span>
                        <span className="text-xs text-muted-foreground">Máximo 2MB · UTF-8</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Result panel */}
              {csvResult && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center">
                      <p className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {csvResult.criados}
                      </p>
                      <p className="text-xs text-muted-foreground">Criados</p>
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center">
                      <p className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {csvResult.ignorados}
                      </p>
                      <p className="text-xs text-muted-foreground">Ignorados</p>
                    </div>
                    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-center">
                      <p className="font-display text-2xl font-bold text-destructive">
                        {csvResult.erros.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Erros</p>
                    </div>
                  </div>

                  {csvResult.erros.length > 0 && (
                    <div className="max-h-32 overflow-y-auto rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                      <p className="mb-1 text-xs font-semibold text-destructive">Erros encontrados:</p>
                      {csvResult.erros.map((e, i) => (
                        <p key={i} className="text-xs text-muted-foreground">• {e}</p>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => { setCsvResult(null); }}
                    >
                      Importar outro arquivo
                    </Button>
                    <Button
                      type="button"
                      className="flex-1"
                      onClick={() => { setCsvModalOpen(false); setCsvResult(null); }}
                    >
                      Concluir
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

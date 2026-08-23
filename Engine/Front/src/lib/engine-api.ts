import { apiRequest, getApiBaseUrl } from "./api-client";

export type ApiMember = {
  id: number;
  nome: string;
  email: string;
  biografia: string | null;
  funcao: string | null;
  formacao: string | null;
  areas: string[] | null;
  linkedin: string | null;
  lattes: string | null;
  orcid: string | null;
  github: string | null;
  url_foto: string | null;
};

export type Member = {
  id: number;
  slug: string;
  name: string;
  initials: string;
  email: string;
  bio: string;
  role: string;
  area: string;
  education: string[];
  interests: string[];
  linkedin?: string | null;
  lattes?: string | null;
  orcid?: string | null;
  github?: string | null;
  photoUrl?: string | null;
};

export type ApiNews = {
  id: number;
  titulo: string;
  tipo: string;
  subtitulo: string;
  data: string;
  corpo: string;
  image_url?: string;
};

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  date: string;
  isoDate: string;
  body: string[];
  imageUrl?: string;
};

export type ApiProject = {
  id: number;
  titulo: string;
  areas: string[];
  subtitulo: string;
  descricao: string;
  objetivos: string;
  tecnologias: string;
  ano_inicio: number;
  ano_fim: number;
  financiamento?: string;
  member_ids?: number[];
  members?: ApiMember[];
};

export type Project = {
  id: number;
  slug: string;
  title: string;
  area: string;
  summary: string;
  description: string;
  objectives: string[];
  technologies: string[];
  year: string;
  status: string;
  funding?: string;
  team: string[];
};

export type ApiPublication = {
  id: number;
  titulo: string;
  tipo: string;
  autores: string;
  onde_publicado: string;
  ano: number;
  doi?: string;
  resumo?: string;
  palavras_chave?: string;
  member_ids?: number[];
  members?: ApiMember[];
};

export type Publication = {
  id: number;
  slug: string;
  title: string;
  type: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  abstract: string;
  keywords: string[];
  team: string[];
};

export { getApiBaseUrl };

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function buildInitials(name: string) {
  const parts = name
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function splitList(value?: string) {
  return value
    ? value
        .split(/[;,\n]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function projectStatus(beginYear: number, endYear: number) {
  const currentYear = new Date().getFullYear();
  if (!endYear || endYear >= currentYear) {
    return "Em andamento";
  }
  return "Concluído";
}

export function normalizeMember(member: ApiMember): Member {
  return {
    id: member.id,
    slug: toSlug(member.nome),
    name: member.nome,
    initials: buildInitials(member.nome),
    email: member.email,
    bio: member.biografia ?? "",
    role: member.funcao ?? "Membro",
    area: member.formacao ?? "",
    education: member.formacao ? [member.formacao] : [],
    interests: member.areas || [],
    linkedin: member.linkedin,
    lattes: member.lattes,
    orcid: member.orcid,
    github: member.github,
    photoUrl: getDirectImageUrl(member.url_foto),
  };
}

export function getDirectImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  
  if (url.startsWith("/storage")) {
    const baseUrl = getApiBaseUrl().replace("/api", "");
    return `${baseUrl}${url}`;
  }

  const driveFileRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
  const matchFile = url.match(driveFileRegex);
  if (matchFile && matchFile[1]) {
    return `https://drive.google.com/uc?export=view&id=${matchFile[1]}`;
  }

  const driveIdRegex = /drive\.google\.com\/open\?id=([^&]+)/;
  const matchId = url.match(driveIdRegex);
  if (matchId && matchId[1]) {
    return `https://drive.google.com/uc?export=view&id=${matchId[1]}`;
  }

  return url;
}

export function normalizeNews(item: ApiNews): NewsItem {
  let formattedDate = item.data;
  if (item.data) {
    try {
      const d = new Date(item.data);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
      }
    } catch (e) {}
  }

  return {
    id: item.id,
    slug: toSlug(item.titulo),
    title: item.titulo,
    tag: item.tipo,
    excerpt: item.subtitulo,
    date: formattedDate,
    isoDate: item.data || "",
    imageUrl: getDirectImageUrl(item.image_url),
    body: (item.corpo || "")
      .split(/\r?\n\r?\n+/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export function normalizeProject(project: ApiProject): Project {
  const area = project.areas?.[0] ?? project.areas?.join(", ") ?? "";
  const slug = toSlug(project.titulo);
  
  const team: string[] = project.members
    ? project.members.map((m) => toSlug(m.nome))
    : [];
  
  return {
    id: project.id,
    slug,
    title: project.titulo,
    area,
    summary: project.subtitulo,
    description: project.descricao,
    objectives: splitList(project.objetivos),
    technologies: splitList(project.tecnologias),
    year: project.ano_fim ? `${project.ano_inicio}–${project.ano_fim}` : String(project.ano_inicio),
    status: projectStatus(project.ano_inicio, project.ano_fim),
    funding: project.financiamento,
    team: team,
  };
}

export function normalizePublication(publication: ApiPublication): Publication {
  return {
    id: publication.id,
    slug: toSlug(publication.titulo),
    title: publication.titulo,
    type: publication.tipo,
    authors: publication.autores,
    venue: publication.onde_publicado,
    year: publication.ano,
    doi: publication.doi || "",
    abstract: publication.resumo || "",
    keywords: publication.palavras_chave ? publication.palavras_chave.split(",").map(k => k.trim()) : [],
    team: publication.members ? publication.members.map(m => toSlug(m.nome)) : [],
  };
}

export async function fetchMembers(): Promise<Member[]> {
  const apiData = await apiRequest<ApiMember[]>("/members");
  return apiData.map(normalizeMember);
}

export async function fetchMemberBySlug(slug: string): Promise<Member | undefined> {
  const members = await fetchMembers();
  return members.find((member) => member.slug === slug);
}

export async function fetchNews(): Promise<NewsItem[]> {
  const apiData = await apiRequest<ApiNews[]>("/news");
  return apiData.map(normalizeNews);
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | undefined> {
  const news = await fetchNews();
  return news.find((item) => item.slug === slug);
}

export async function fetchProjects(): Promise<Project[]> {
  const apiData = await apiRequest<ApiProject[]>("/projects");
  return apiData.map(normalizeProject);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await fetchProjects();
  return projects.find((project) => project.slug === slug);
}

export async function fetchPublications(): Promise<Publication[]> {
  const apiData = await apiRequest<ApiPublication[]>("/publications");
  return apiData.map(normalizePublication);
}

export async function fetchPublicationBySlug(slug: string): Promise<Publication | undefined> {
  const publications = await fetchPublications();
  return publications.find((publication) => publication.slug === slug);
}

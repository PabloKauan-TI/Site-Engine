import { Cpu, Brain, Code, Wifi, Database, Bot, Cog, Network, Shield } from "lucide-react";

export const researchLines = [
  {
    slug: "iot",
    icon: Wifi,
    title: "Internet das Coisas",
    short: "Sistemas embarcados, redes de sensores e edge computing.",
    description:
      "Investigamos arquiteturas de IoT de ponta a ponta — de firmware em microcontroladores até plataformas em nuvem — com foco em confiabilidade, baixa latência e eficiência energética.",
    topics: ["Redes de sensores", "Edge computing", "Protocolos LPWAN", "Firmware seguro"],
  },
  {
    slug: "ia",
    icon: Brain,
    title: "Inteligência Artificial",
    short: "Aprendizado de máquina aplicado a problemas de engenharia.",
    description:
      "Desenvolvemos modelos de IA para visão computacional, séries temporais e processamento de linguagem, com ênfase em aplicações industriais e científicas.",
    topics: ["Deep learning", "Visão computacional", "Séries temporais", "MLOps"],
  },
  {
    slug: "software",
    icon: Code,
    title: "Engenharia de Software",
    short: "Métodos, ferramentas e arquiteturas para software confiável.",
    description:
      "Pesquisamos técnicas modernas de desenvolvimento — DevOps, arquiteturas distribuídas e qualidade — para construir sistemas escaláveis e sustentáveis.",
    topics: ["Arquitetura distribuída", "DevOps", "Qualidade de software", "Sistemas críticos"],
  },
  {
    slug: "sistemas-inteligentes",
    icon: Bot,
    title: "Sistemas Inteligentes",
    short: "Integração de IoT e IA em soluções autônomas.",
    description:
      "Convergimos dispositivos conectados, algoritmos inteligentes e software robusto em sistemas que percebem, decidem e agem no mundo físico.",
    topics: ["Automação", "Agentes autônomos", "Digital twins", "Cyber-physical"],
  },
  {
    slug: "dados",
    icon: Database,
    title: "Engenharia de Dados",
    short: "Pipelines, streaming e análise de dados em larga escala.",
    description:
      "Estudamos arquiteturas de dados para ingestão, transformação e análise em tempo real, integrando com modelos analíticos e preditivos.",
    topics: ["Data pipelines", "Streaming", "Analytics", "Observabilidade"],
  },
  {
    slug: "seguranca",
    icon: Shield,
    title: "Segurança Cibernética",
    short: "Proteção de sistemas embarcados e infraestrutura.",
    description:
      "Investigamos vulnerabilidades, criptografia leve e detecção de intrusão em dispositivos IoT e sistemas distribuídos.",
    topics: ["Criptografia leve", "IDS", "Zero trust", "Análise de vulnerabilidades"],
  },
];

export type Project = {
  slug: string;
  title: string;
  status: string;
  year: string;
  area: string;
  summary: string;
  description: string;
  objectives: string[];
  technologies: string[];
  team: string[];
  funding?: string;
};

export const projects: Project[] = [
  {
    slug: "smartagro-sensing",
    title: "SmartAgro Sensing",
    status: "Em andamento",
    year: "2025",
    area: "IoT",
    summary:
      "Rede de sensores LoRaWAN para monitoramento de solo, clima e irrigação em plantações de café.",
    description:
      "O projeto SmartAgro Sensing desenvolve uma rede de sensores de baixo custo e baixo consumo energético para monitoramento em tempo real de variáveis agronômicas. A solução combina dispositivos LoRaWAN em campo, um gateway local e uma plataforma em nuvem para análise histórica e alertas automatizados de irrigação.",
    objectives: [
      "Reduzir consumo de água em até 30% através de irrigação inteligente",
      "Monitorar umidade do solo, temperatura, precipitação e radiação solar",
      "Fornecer alertas em tempo real para produtores",
    ],
    technologies: ["LoRaWAN", "ESP32", "TimescaleDB", "Grafana", "MQTT"],
    team: ["ana-silva", "marina-rocha", "diego-ferreira"],
    funding: "CNPq + Cooperativa Regional de Café",
  },
  {
    slug: "visionqc",
    title: "VisionQC",
    status: "Em andamento",
    year: "2025",
    area: "IA",
    summary:
      "Sistema de inspeção visual automatizada por deep learning para linhas de produção industriais.",
    description:
      "VisionQC utiliza redes neurais convolucionais e detecção de anomalias para automatizar controle de qualidade em linhas industriais. O sistema roda parcialmente na borda, com inferência otimizada para latência de milissegundos, e envia agregados para a nuvem para análise histórica.",
    objectives: [
      "Detectar defeitos visuais com precisão superior a 98%",
      "Latência de inferência abaixo de 50 ms na borda",
      "Reduzir taxa de retrabalho em pelo menos 40%",
    ],
    technologies: ["PyTorch", "ONNX Runtime", "NVIDIA Jetson", "OpenCV", "Kafka"],
    team: ["rafael-costa", "joana-menezes", "bruna-lima"],
    funding: "FINEP",
  },
  {
    slug: "medflow",
    title: "MedFlow",
    status: "Concluído",
    year: "2024",
    area: "Software",
    summary:
      "Plataforma de gestão de fluxos hospitalares baseada em microsserviços e eventos.",
    description:
      "MedFlow é uma plataforma para gestão de fluxos assistenciais em hospitais, construída sobre arquitetura orientada a eventos. O sistema integra prontuário, agendamento e leitos, oferecendo visão em tempo real da operação hospitalar.",
    objectives: [
      "Reduzir tempo médio de espera em pronto-socorro",
      "Integrar sistemas legados via eventos",
      "Fornecer dashboards operacionais em tempo real",
    ],
    technologies: ["Kubernetes", "Kafka", "PostgreSQL", "TypeScript", "React"],
    team: ["paulo-duarte", "ana-silva"],
    funding: "Parceria hospitalar",
  },
  {
    slug: "edgetwin",
    title: "EdgeTwin",
    status: "Em andamento",
    year: "2025",
    area: "Sistemas",
    summary:
      "Digital twins executando na borda para manutenção preditiva de motores elétricos.",
    description:
      "O EdgeTwin cria representações digitais em tempo real de motores elétricos industriais, executando modelos preditivos diretamente em dispositivos de borda. A abordagem reduz dependência de conectividade e permite tomada de decisão local.",
    objectives: [
      "Prever falhas de motores com antecedência mínima de 72h",
      "Executar digital twins em hardware embarcado",
      "Integrar com sistemas de manutenção existentes",
    ],
    technologies: ["Rust", "TensorFlow Lite", "OPC UA", "MQTT", "InfluxDB"],
    team: ["felipe-almeida", "rafael-costa"],
    funding: "Indústria automotiva parceira",
  },
  {
    slug: "securemesh",
    title: "SecureMesh",
    status: "Em andamento",
    year: "2025",
    area: "Segurança",
    summary:
      "Protocolo de comunicação segura para redes mesh de dispositivos IoT de baixo consumo.",
    description:
      "SecureMesh é um protocolo de comunicação com criptografia leve e autenticação mútua projetado para redes mesh de dispositivos IoT restritos. O trabalho inclui análise formal de segurança e implementação de referência em código aberto.",
    objectives: [
      "Prover confidencialidade e integridade em redes mesh",
      "Consumo energético compatível com dispositivos alimentados por bateria",
      "Publicar implementação de referência em código aberto",
    ],
    technologies: ["Rust", "no_std", "ChaCha20-Poly1305", "Ed25519", "6LoWPAN"],
    team: ["marina-rocha", "paulo-duarte"],
  },
  {
    slug: "timecast",
    title: "TimeCast",
    status: "Concluído",
    year: "2024",
    area: "IA",
    summary:
      "Framework de previsão de séries temporais aplicado a consumo energético urbano.",
    description:
      "TimeCast é um framework de previsão de séries temporais que combina modelos estatísticos clássicos e redes neurais recorrentes, aplicado à previsão de consumo energético em ambientes urbanos. Os resultados foram publicados e o framework foi disponibilizado como biblioteca aberta.",
    objectives: [
      "Alcançar erro percentual médio inferior a 5% em previsões horárias",
      "Suportar múltiplas granularidades temporais",
      "Publicar biblioteca em código aberto",
    ],
    technologies: ["Python", "PyTorch", "Prophet", "Pandas", "Airflow"],
    team: ["rafael-costa", "bruna-lima"],
  },
];

export type Publication = {
  slug: string;
  year: number;
  authors: string;
  title: string;
  venue: string;
  type: string;
  abstract: string;
  keywords: string[];
  doi?: string;
};

export const publications: Publication[] = [
  {
    slug: "energy-aware-federated-2025",
    year: 2025,
    authors: "Silva, A.; Costa, R.; Menezes, J.",
    title:
      "Energy-aware task scheduling for federated learning on IoT edge devices",
    venue: "IEEE Internet of Things Journal",
    type: "Journal",
    abstract:
      "This paper proposes an energy-aware scheduling strategy for federated learning tasks running on heterogeneous IoT edge devices. The approach balances model convergence, energy budget and communication overhead, achieving significant reductions in total energy consumption without compromising model accuracy.",
    keywords: ["Federated learning", "Edge computing", "Energy efficiency", "IoT"],
    doi: "10.1109/JIOT.2025.0000001",
  },
  {
    slug: "lightweight-anomaly-detection-2025",
    year: 2025,
    authors: "Rocha, M.; Silva, A.",
    title:
      "A lightweight anomaly detection framework for industrial sensor networks",
    venue: "ACM Transactions on Cyber-Physical Systems",
    type: "Journal",
    abstract:
      "We propose a lightweight anomaly detection framework tailored to industrial sensor networks, combining online statistical models with compact neural architectures. Experimental results on real industrial datasets demonstrate high detection accuracy with minimal resource overhead.",
    keywords: ["Anomaly detection", "Industrial IoT", "Cyber-physical systems"],
    doi: "10.1145/tcps.2025.0000002",
  },
  {
    slug: "vision-pipelines-edge-2024",
    year: 2024,
    authors: "Menezes, J.; Costa, R.",
    title: "Real-time computer vision pipelines for quality control at the edge",
    venue: "CVPR Workshops",
    type: "Conference",
    abstract:
      "This work presents an end-to-end computer vision pipeline for real-time quality control on production lines, optimized for edge deployment. The paper discusses model compression techniques and runtime scheduling for consistent sub-50ms latency.",
    keywords: ["Computer vision", "Edge AI", "Quality control"],
  },
  {
    slug: "microservices-resilience-2024",
    year: 2024,
    authors: "Silva, A.; Duarte, P.",
    title:
      "Microservices resilience patterns: an empirical study on healthcare systems",
    venue: "ICSE",
    type: "Conference",
    abstract:
      "An empirical study on the adoption of resilience patterns in microservice-based healthcare systems. We analyze failure modes, mitigation strategies and their operational impact across multiple production deployments.",
    keywords: ["Microservices", "Resilience", "Software architecture"],
  },
  {
    slug: "digital-twins-motors-2024",
    year: 2024,
    authors: "Costa, R.; Almeida, F.",
    title: "Digital twins for predictive maintenance of electric motors",
    venue: "Sensors (MDPI)",
    type: "Journal",
    abstract:
      "This paper introduces a digital twin architecture for predictive maintenance of electric motors, combining physics-based models with machine learning. The proposed system runs partially on edge devices and predicts failures with a lead time of up to 96 hours.",
    keywords: ["Digital twins", "Predictive maintenance", "Industry 4.0"],
    doi: "10.3390/s2024000003",
  },
  {
    slug: "secure-firmware-update-2023",
    year: 2023,
    authors: "Duarte, P.; Rocha, M.",
    title: "Secure firmware update for constrained IoT devices",
    venue: "IEEE Security & Privacy",
    type: "Journal",
    abstract:
      "We describe a secure firmware update mechanism for constrained IoT devices, combining lightweight cryptographic primitives, delta updates and rollback protection. The proposal is validated on real hardware and analyzed against common attack vectors.",
    keywords: ["Firmware update", "IoT security", "Embedded systems"],
    doi: "10.1109/MSP.2023.0000004",
  },
];

export type NewsItem = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  body: string[];
};

export const news: NewsItem[] = [
  {
    slug: "premio-ieee-iot-2026",
    date: "12 de julho de 2026",
    tag: "Prêmio",
    title: "EngineLab recebe prêmio de melhor artigo no IEEE IoT Journal",
    excerpt:
      "Nosso trabalho sobre agendamento eficiente em aprendizado federado foi reconhecido como destaque de 2025.",
    body: [
      "O EngineLab teve seu artigo 'Energy-aware task scheduling for federated learning on IoT edge devices' reconhecido como um dos destaques do IEEE Internet of Things Journal em 2025.",
      "O trabalho, liderado pela Dra. Ana Silva em colaboração com o Dr. Rafael Costa e a Dra. Joana Menezes, propõe uma abordagem inédita para balancear consumo energético e desempenho de modelos em dispositivos de borda.",
      "A premiação será entregue durante a próxima edição do IEEE World Forum on Internet of Things.",
    ],
  },
  {
    slug: "parceria-automotiva-2026",
    date: "28 de junho de 2026",
    tag: "Parceria",
    title: "Nova parceria com indústria automotiva para pesquisa em digital twins",
    excerpt:
      "Iniciamos uma cooperação de três anos para pesquisa aplicada em manutenção preditiva de linhas de produção.",
    body: [
      "O EngineLab firmou uma cooperação técnica de três anos com uma das maiores montadoras do país para desenvolver digital twins de linhas de produção.",
      "O projeto EdgeTwin será o principal beneficiário da parceria, com aporte financeiro e acesso a dados reais de operação industrial.",
      "A cooperação prevê ainda a formação de mestres e doutores em conjunto entre universidade e indústria.",
    ],
  },
  {
    slug: "workshop-edge-ai-2026",
    date: "05 de junho de 2026",
    tag: "Evento",
    title: "EngineLab sedia workshop internacional de Edge AI",
    excerpt:
      "Pesquisadores de oito países se reuniram para discutir tendências em inteligência artificial na borda.",
    body: [
      "Nos dias 3 e 4 de junho, o EngineLab recebeu o Workshop Internacional de Edge AI, com participação de pesquisadores de oito países.",
      "O evento contou com palestras, painéis e sessões de posters, além de demonstrações práticas de projetos em andamento no laboratório.",
      "Os anais do workshop serão publicados em edição especial de periódico internacional.",
    ],
  },
  {
    slug: "securemesh-opensource-2026",
    date: "20 de maio de 2026",
    tag: "Publicação",
    title: "Framework SecureMesh publicado como código aberto",
    excerpt:
      "O protocolo de comunicação segura para IoT está agora disponível para a comunidade acadêmica.",
    body: [
      "A implementação de referência do protocolo SecureMesh foi liberada como código aberto sob licença Apache 2.0.",
      "O repositório inclui exemplos completos para plataformas embarcadas populares, além de suítes de teste e análise de segurança.",
      "A equipe convida a comunidade acadêmica a colaborar com auditorias, extensões e novas provas de conceito.",
    ],
  },
];

export type Member = {
  slug: string;
  name: string;
  role: string;
  area: string;
  initials: string;
  bio: string;
  interests: string[];
  email: string;
  education: string[];
};

export const members: Member[] = [
  {
    slug: "ana-silva",
    name: "Dra. Ana Silva",
    role: "Coordenadora do laboratório",
    area: "IoT & Sistemas Embarcados",
    initials: "AS",
    bio: "Coordenadora do EngineLab, atua há mais de 15 anos em pesquisa aplicada em Internet das Coisas, sistemas embarcados e edge computing.",
    interests: ["IoT", "Edge computing", "Sistemas embarcados", "Redes de sensores"],
    email: "ana.silva@enginelab.org",
    education: [
      "Doutorado em Engenharia de Computação",
      "Mestrado em Sistemas Embarcados",
      "Graduação em Engenharia Elétrica",
    ],
  },
  {
    slug: "rafael-costa",
    name: "Dr. Rafael Costa",
    role: "Pesquisador sênior",
    area: "Inteligência Artificial",
    initials: "RC",
    bio: "Pesquisador sênior com atuação em aprendizado de máquina, séries temporais e IA aplicada à indústria.",
    interests: ["Deep learning", "Séries temporais", "MLOps", "IA industrial"],
    email: "rafael.costa@enginelab.org",
    education: ["Doutorado em Ciência da Computação", "Mestrado em Estatística"],
  },
  {
    slug: "joana-menezes",
    name: "Dra. Joana Menezes",
    role: "Pesquisadora",
    area: "Visão Computacional",
    initials: "JM",
    bio: "Pesquisadora em visão computacional, com foco em modelos eficientes para inspeção industrial e ambientes com recursos restritos.",
    interests: ["Visão computacional", "Deep learning", "Edge AI"],
    email: "joana.menezes@enginelab.org",
    education: ["Doutorado em Engenharia da Computação"],
  },
  {
    slug: "paulo-duarte",
    name: "Dr. Paulo Duarte",
    role: "Pesquisador",
    area: "Engenharia de Software",
    initials: "PD",
    bio: "Pesquisa arquiteturas de software resilientes, DevOps e sistemas orientados a eventos aplicados a domínios críticos.",
    interests: ["Arquitetura", "DevOps", "Sistemas distribuídos"],
    email: "paulo.duarte@enginelab.org",
    education: ["Doutorado em Engenharia de Software"],
  },
  {
    slug: "marina-rocha",
    name: "Msc. Marina Rocha",
    role: "Doutoranda",
    area: "Segurança em IoT",
    initials: "MR",
    bio: "Doutoranda pesquisando protocolos de comunicação seguros para redes mesh de dispositivos IoT restritos.",
    interests: ["Segurança IoT", "Criptografia leve", "Redes mesh"],
    email: "marina.rocha@enginelab.org",
    education: ["Mestrado em Segurança da Informação", "Graduação em Ciência da Computação"],
  },
  {
    slug: "felipe-almeida",
    name: "Msc. Felipe Almeida",
    role: "Doutorando",
    area: "Digital Twins",
    initials: "FA",
    bio: "Doutorando com foco em digital twins executados na borda para manutenção preditiva industrial.",
    interests: ["Digital twins", "Manutenção preditiva", "Sistemas ciber-físicos"],
    email: "felipe.almeida@enginelab.org",
    education: ["Mestrado em Engenharia Mecatrônica"],
  },
  {
    slug: "bruna-lima",
    name: "Bruna Lima",
    role: "Mestranda",
    area: "MLOps",
    initials: "BL",
    bio: "Mestranda pesquisando práticas de MLOps para operação confiável de modelos de aprendizado de máquina em produção.",
    interests: ["MLOps", "Observabilidade", "Machine learning"],
    email: "bruna.lima@enginelab.org",
    education: ["Graduação em Ciência da Computação"],
  },
  {
    slug: "diego-ferreira",
    name: "Diego Ferreira",
    role: "Iniciação científica",
    area: "Firmware",
    initials: "DF",
    bio: "Aluno de iniciação científica atuando em firmware de dispositivos LoRaWAN para aplicações agrícolas.",
    interests: ["Firmware", "LoRaWAN", "Microcontroladores"],
    email: "diego.ferreira@enginelab.org",
    education: ["Graduando em Engenharia de Computação"],
  },
];

export const stats = [
  { value: "6", label: "Linhas de pesquisa" },
  { value: "10", label: "Projetos ativos" },
  { value: "20+", label: "Publicações" },

];

export { Cpu, Brain, Code, Wifi, Database, Bot, Cog, Network };

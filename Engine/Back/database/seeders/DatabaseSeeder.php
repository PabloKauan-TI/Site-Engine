<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\News;
use App\Models\Project;
use App\Models\Publication;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Ensure Admin User
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrador',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]
        );

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]
        );

        // 2. Seed Members
        $members = [
            [
                'nome' => 'Dra. Ana Silva',
                'funcao' => 'Coordenadora do laboratório',
                'email' => 'ana.silva@enginelab.org',
                'formacao' => 'IoT & Sistemas Embarcados',
                'biografia' => 'Coordenadora do EngineLab, atua há mais de 15 anos em pesquisa aplicada em Internet das Coisas, sistemas embarcados e edge computing.',
                'areas' => ['IoT', 'Edge computing', 'Sistemas embarcados'],
                'linkedin' => 'anasilva-iot',
                'lattes' => '1234567890123456',
            ],
            [
                'nome' => 'Dr. Rafael Costa',
                'funcao' => 'Pesquisador sênior',
                'email' => 'rafael.costa@enginelab.org',
                'formacao' => 'Inteligência Artificial',
                'biografia' => 'Pesquisador sênior com atuação em aprendizado de máquina, séries temporais e IA aplicada à indústria.',
                'areas' => ['Deep learning', 'Séries temporais', 'MLOps'],
                'linkedin' => 'rafaelcosta-ai',
                'lattes' => '2345678901234567',
            ],
            [
                'nome' => 'Dra. Joana Menezes',
                'funcao' => 'Pesquisadora',
                'email' => 'joana.menezes@enginelab.org',
                'formacao' => 'Visão Computacional',
                'biografia' => 'Pesquisadora em visão computacional, com foco em modelos eficientes para inspeção industrial e ambientes com recursos restritos.',
                'areas' => ['Visão computacional', 'Deep learning', 'Edge AI'],
                'linkedin' => 'joanamenezes-cv',
                'lattes' => '3456789012345678',
            ],
            [
                'nome' => 'Dr. Paulo Duarte',
                'funcao' => 'Pesquisador',
                'email' => 'paulo.duarte@enginelab.org',
                'formacao' => 'Engenharia de Software',
                'biografia' => 'Pesquisa arquiteturas de software resilientes, DevOps e sistemas orientados a eventos aplicados a domínios críticos.',
                'areas' => ['Arquitetura', 'DevOps', 'Sistemas distribuídos'],
                'linkedin' => 'pauloduarte-se',
                'lattes' => '4567890123456789',
            ],
            [
                'nome' => 'Msc. Marina Rocha',
                'funcao' => 'Doutoranda',
                'email' => 'marina.rocha@enginelab.org',
                'formacao' => 'Segurança em IoT',
                'biografia' => 'Doutoranda pesquisando protocolos de comunicação seguros para redes mesh de dispositivos IoT restritos.',
                'areas' => ['Segurança IoT', 'Criptografia leve', 'Redes mesh'],
                'linkedin' => 'marinarocha-sec',
                'lattes' => '5678901234567890',
            ],
            [
                'nome' => 'Msc. Felipe Almeida',
                'funcao' => 'Doutorando',
                'email' => 'felipe.almeida@enginelab.org',
                'formacao' => 'Digital Twins',
                'biografia' => 'Doutorando com foco em digital twins executados na borda para manutenção preditiva industrial.',
                'areas' => ['Digital twins', 'Manutenção preditiva', 'Sistemas ciber-físicos'],
                'linkedin' => 'felipealmeida-dt',
                'lattes' => '6789012345678901',
            ],
        ];

        foreach ($members as $m) {
            Member::updateOrCreate(['email' => $m['email']], $m);
        }

        // 3. Seed Projects
        $projects = [
            [
                'titulo' => 'SmartAgro Sensing',
                'areas' => ['IoT'],
                'subtitulo' => 'Rede de sensores LoRaWAN para monitoramento de solo, clima e irrigação em plantações de café.',
                'descricao' => 'O projeto SmartAgro Sensing desenvolve uma rede de sensores de baixo custo e baixo consumo energético para monitoramento em tempo real de variáveis agronômicas. A solução combina dispositivos LoRaWAN em campo, um gateway local e uma plataforma em nuvem para análise histórica e alertas automatizados de irrigação.',
                'objetivos' => "Reduzir consumo de água em até 30% através de irrigação inteligente;\nMonitorar umidade do solo, temperatura, precipitação e radiação solar;\nFornecer alertas em tempo real para produtores",
                'tecnologias' => 'LoRaWAN, ESP32, TimescaleDB, Grafana, MQTT',
                'ano_inicio' => 2024,
                'ano_fim' => 2026,
                'financiamento' => 'CNPq + Cooperativa Regional de Café',
            ],
            [
                'titulo' => 'VisionQC',
                'areas' => ['IA'],
                'subtitulo' => 'Sistema de inspeção visual automatizada por deep learning para linhas de produção industriais.',
                'descricao' => 'VisionQC utiliza redes neurais convolucionais e detecção de anomalias para automatizar controle de qualidade em linhas industriais. O sistema roda parcialmente na borda, com inferência otimizada para latência de milissegundos, e envia agregados para a nuvem para análise histórica.',
                'objetivos' => "Detectar defeitos visuais com precisão superior a 98%;\nLatência de inferência abaixo de 50 ms na borda;\nReduzir taxa de retrabalho em pelo menos 40%",
                'tecnologias' => 'PyTorch, ONNX Runtime, NVIDIA Jetson, OpenCV, Kafka',
                'ano_inicio' => 2024,
                'ano_fim' => 2026,
                'financiamento' => 'FINEP',
            ],
            [
                'titulo' => 'MedFlow',
                'areas' => ['Software'],
                'subtitulo' => 'Plataforma de gestão de fluxos hospitalares baseada em microsserviços e eventos.',
                'descricao' => 'MedFlow é uma plataforma para gestão de fluxos assistenciais em hospitais, construída sobre arquitetura orientada a eventos. O sistema integra prontuário, agendamento e leitos, oferecendo visão em tempo real da operação hospitalar.',
                'objetivos' => "Reduzir tempo médio de espera em pronto-socorro;\nIntegrar sistemas legados via eventos;\nFornecer dashboards operacionais em tempo real",
                'tecnologias' => 'Kubernetes, Kafka, PostgreSQL, TypeScript, React',
                'ano_inicio' => 2023,
                'ano_fim' => 2024,
                'financiamento' => 'Parceria hospitalar',
            ],
            [
                'titulo' => 'EdgeTwin',
                'areas' => ['Sistemas'],
                'subtitulo' => 'Digital twins executando na borda para manutenção preditiva de motores elétricos.',
                'descricao' => 'O EdgeTwin cria representações digitais em tempo real de motores elétricos industriais, executando modelos preditivos diretamente em dispositivos de borda. A abordagem reduz dependência de conectividade e permite tomada de decisão local.',
                'objetivos' => "Prever falhas de motores com antecedência mínima de 72h;\nExecutar digital twins em hardware embarcado;\nIntegrar com sistemas de manutenção existentes",
                'tecnologias' => 'Rust, TensorFlow Lite, OPC UA, MQTT, InfluxDB',
                'ano_inicio' => 2025,
                'ano_fim' => 2026,
                'financiamento' => 'Indústria automotiva parceira',
            ],
            [
                'titulo' => 'SecureMesh',
                'areas' => ['Segurança'],
                'subtitulo' => 'Protocolo de comunicação segura para redes mesh de dispositivos IoT de baixo consumo.',
                'descricao' => 'SecureMesh é um protocolo de comunicação com criptografia leve e autenticação mútua projetado para redes mesh de dispositivos IoT restritos. O trabalho inclui análise formal de segurança e implementação de referência em código aberto.',
                'objetivos' => "Prover confidencialidade e integridade em redes mesh;\nConsumo energético compatível com dispositivos alimentados por bateria;\nPublicar implementação de referência em código aberto",
                'tecnologias' => 'Rust, no_std, ChaCha20-Poly1305, Ed25519, 6LoWPAN',
                'ano_inicio' => 2025,
                'ano_fim' => 2026,
                'financiamento' => 'CNPq',
            ],
        ];

        foreach ($projects as $p) {
            Project::updateOrCreate(['titulo' => $p['titulo']], $p);
        }

        // 4. Seed News
        $news = [
            [
                'titulo' => 'EngineLab recebe prêmio de melhor artigo no IEEE IoT Journal',
                'tipo' => 'Prêmio',
                'subtitulo' => 'Nosso trabalho sobre agendamento eficiente em aprendizado federado foi reconhecido como destaque de 2025.',
                'data' => '2026-07-12',
                'corpo' => "O EngineLab teve seu artigo 'Energy-aware task scheduling for federated learning on IoT edge devices' reconhecido como um dos destaques do IEEE Internet of Things Journal em 2025.\n\nO trabalho, liderado pela Dra. Ana Silva em colaboração com o Dr. Rafael Costa e a Dra. Joana Menezes, propõe uma abordagem inédita para balancear consumo energético e desempenho de modelos em dispositivos de borda.\n\nA premiação será entregue durante a próxima edição do IEEE World Forum on Internet of Things.",
            ],
            [
                'titulo' => 'Nova parceria com indústria automotiva para pesquisa em digital twins',
                'tipo' => 'Parceria',
                'subtitulo' => 'Iniciamos uma cooperação de três anos para pesquisa aplicada em manutenção preditiva de linhas de produção.',
                'data' => '2026-06-28',
                'corpo' => "O EngineLab firmou uma cooperação técnica de três anos com uma das maiores montadoras do país para desenvolver digital twins de linhas de produção.\n\nO projeto EdgeTwin será o principal beneficiário da parceria, com aporte financeiro e acesso a dados reais de operação industrial.\n\nA cooperação prevê ainda a formação de mestres e doutores em conjunto entre universidade e indústria.",
            ],
            [
                'titulo' => 'EngineLab sedia workshop internacional de Edge AI',
                'tipo' => 'Evento',
                'subtitulo' => 'Pesquisadores de oito países se reuniram para discutir tendências em inteligência artificial na borda.',
                'data' => '2026-06-05',
                'corpo' => "Nos dias 3 e 4 de junho, o EngineLab recebeu o Workshop Internacional de Edge AI, com participação de pesquisadores de oito países.\n\nO evento contou com palestras, painéis e sessões de posters, além de demonstrações práticas de projetos em andamento no laboratório.\n\nOs anais do workshop serão publicados em edição especial de periódico internacional.",
            ],
            [
                'titulo' => 'Framework SecureMesh publicado como código aberto',
                'tipo' => 'Publicação',
                'subtitulo' => 'O protocolo de comunicação segura para IoT está agora disponível para a comunidade acadêmica.',
                'data' => '2026-05-20',
                'corpo' => "A implementação de referência do protocolo SecureMesh foi liberada como código aberto sob licença Apache 2.0.\n\nO repositório inclui exemplos completos para plataformas embarcadas populares, além de suítes de teste e análise de segurança.\n\nA equipe convida a comunidade acadêmica a colaborar com auditorias, extensões e novas provas de conceito.",
            ],
        ];

        foreach ($news as $n) {
            News::updateOrCreate(['titulo' => $n['titulo']], $n);
        }

        // 5. Seed Publications
        $publications = [
            [
                'titulo' => 'Energy-aware task scheduling for federated learning on IoT edge devices',
                'tipo' => 'Journal',
                'autores' => 'Silva, A.; Costa, R.; Menezes, J.',
                'onde_publicado' => 'IEEE Internet of Things Journal',
                'ano' => 2025,
                'doi' => '10.1109/JIOT.2025.0000001',
            ],
            [
                'titulo' => 'A lightweight anomaly detection framework for industrial sensor networks',
                'tipo' => 'Journal',
                'autores' => 'Rocha, M.; Silva, A.',
                'onde_publicado' => 'ACM Transactions on Cyber-Physical Systems',
                'ano' => 2025,
                'doi' => '10.1145/tcps.2025.0000002',
            ],
            [
                'titulo' => 'Real-time computer vision pipelines for quality control at the edge',
                'tipo' => 'Conference',
                'autores' => 'Menezes, J.; Costa, R.',
                'onde_publicado' => 'CVPR Workshops',
                'ano' => 2024,
                'doi' => '10.1109/CVPRW.2024.00003',
            ],
            [
                'titulo' => 'Microservices resilience patterns: an empirical study on healthcare systems',
                'tipo' => 'Conference',
                'autores' => 'Silva, A.; Duarte, P.',
                'onde_publicado' => 'ICSE',
                'ano' => 2024,
                'doi' => '10.1145/icse.2024.00004',
            ],
            [
                'titulo' => 'Digital twins for predictive maintenance of electric motors',
                'tipo' => 'Journal',
                'autores' => 'Costa, R.; Almeida, F.',
                'onde_publicado' => 'Sensors (MDPI)',
                'ano' => 2024,
                'doi' => '10.3390/s2024000003',
            ],
            [
                'titulo' => 'Secure firmware update for constrained IoT devices',
                'tipo' => 'Journal',
                'autores' => 'Duarte, P.; Rocha, M.',
                'onde_publicado' => 'IEEE Security & Privacy',
                'ano' => 2023,
                'doi' => '10.1109/MSP.2023.0000004',
            ],
        ];

        foreach ($publications as $pub) {
            Publication::updateOrCreate(['titulo' => $pub['titulo']], $pub);
        }
    }
}

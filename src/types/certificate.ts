export interface CurriculumAxis {
  id: string;
  axisTitleLine1: string;
  axisTitleLine2: string;
  axisSubtitle: string;
  descriptionLine1: string;
  descriptionLine2: string;
  hours: string;
}

export interface CertificateData {
  certNumber: string;
  bookNumber: string;
  leafNumber: string;
  code: string;
  controlKey: string;
  sha256: string;
  baseUrl: string;
  headerProgramLine1: string;
  headerProgramLine2: string;
  mainTitle: string;
  introLine1: string;
  introLine2: string;
  holderName: string;
  holderQualification: string;
  activityTitle: string;
  activityModality: string;
  periodText: string;
  workloadHours: string;
  workloadExtended: string;
  finalGrade: string;
  bodyPara1Line1: string;
  bodyPara1Line2: string;
  bodyPara1Line3: string;
  bodyPara2Line1: string;
  bodyPara2Line2: string;
  bodyPara2Line3: string;
  bodyPara2Line4: string;
  locationAndDate: string;
   leftSignerName: string;
  leftSignerRole: string;
  leftSignerEntity: string;
  rightSignerName: string;
  rightSignerRole: string;
  rightSignerEntity: string;
  backHeaderTitle: string;
  backHeaderSubtitle: string;
  editalFramingLine1: string;
  editalFramingLine2: string;
  editalFramingLine3: string;
  editalPeriodAndTotal: string;
  matrixSectionTitle: string;
  axes: CurriculumAxis[];
  averbacaoLine1: string;
  averbacaoLine2: string;
}

export const DEFAULT_CERTIFICATE_09: CertificateData = {
  certNumber: '09',
  bookNumber: '01/2025',
  leafNumber: '42',
  code: 'EMS-EST-2025-0909',
  controlKey: '0909-7027-9457-9E4B',
  sha256: '9f4c2e81b7d03a65e1928c40d6b51a29e8f17a63b4c52d90f1837e2a5b6c0909',
  baseUrl: 'https://estagio-ensino-curadoria-9.vercel.app',
  headerProgramLine1: 'PROGRAMA INTERINSTITUCIONAL DE EXTENSÃO, COMUNICAÇÃO CIENTÍFICA',
  headerProgramLine2: 'E EDUCAÇÃO EM SAÚDE',
  mainTitle: 'CERTIFICADO DE ESTÁGIO EM INSTITUIÇÃO DE ENSINO',
  introLine1:
    'A Editora Mente e Saúde (CNPJ: 51.372.335/0001-71), em parceria institucional com o Centro Profissionalizante Maria Dalva de Araújo (CNPJ:',
  introLine2:
    '51.269.112/0001-83), certifica para os devidos fins de comprovação curricular, acadêmica e de títulos (Lei nº 9.394/96) que',
  holderName: 'LUCAS GONÇALVES SILVEIRA',
  holderQualification: 'Médico  |  CPF: 702.794.941-57  |  Centro Universitário Alfredo Nasser (UNIFAN)',
  activityTitle:
    'Estágio Extracurricular Remoto em Instituição de Ensino: Curadoria de Material Didático, Revisão Técnica e Tutoria em Saúde',
  activityModality: 'Estágio em Instituição de Ensino',
  periodText: '14 de abril a 20 de junho de 2025',
  workloadHours: '45',
  workloadExtended: '45 (quarenta e cinco) horas',
  finalGrade: '9,9 (APROVADO)',
  bodyPara1Line1:
    'concluiu com APROVAÇÃO e aproveitamento integral a Atividade Extracurricular intitulada "Estágio Extracurricular Remoto em Instituição de Ensino:',
  bodyPara1Line2:
    'Curadoria de Material Didático, Revisão Técnica e Tutoria em Saúde", desenvolvida na modalidade de Estágio em Instituição de Ensino, realizada no',
  bodyPara1Line3:
    'período de 14 de abril a 20 de junho de 2025, contabilizando carga horária total de 45 (quarenta e cinco) horas.',
  bodyPara2Line1:
    'No âmbito deste estágio docente e editorial em ambiente virtual de aprendizagem, o profissional atuou de forma prática na curadoria científica e revisão',
  bodyPara2Line2:
    'técnica de apostilas didáticas do Centro Profissionalizante, estruturação e validação de bancos de questões comentadas baseadas em diretrizes clínicas',
  bodyPara2Line3:
    'do SUS, mediação pedagógica com suporte assíncrono a estudantes da área da saúde e auditoria de qualidade de materiais instrucionais digitais,',
  bodyPara2Line4:
    'cumprindo integralmente o plano de atividades supervisionado e obtendo conceito final 9,9 (APROVADO).',
  locationAndDate: 'Goiânia - GO, 27 de junho de 2025.',
  leftSignerName: 'BÁRBARA LIMA DOS SANTOS',
  leftSignerRole: 'Editora-Chefe e Coordenadora de Extensão Editorial',
  leftSignerEntity: 'Editora Mente e Saúde (CNPJ: 51.372.335/0001-71)',
  rightSignerName: 'JAMES ARAÚJO DE SANTANA',
  rightSignerRole: 'Coordenador de Extensão e Projetos Educativos',
  rightSignerEntity: 'Centro Profissionalizante Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)',
  backHeaderTitle: 'MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO DE ATIVIDADE EXTRACURRICULAR',
  backHeaderSubtitle: 'Verso Oficial do Certificado Nº 09 · Fé Pública Interinstitucional e Validação Curricular',
  editalFramingLine1: 'Item 09 - Atividades Extracurriculares: Cursos de extensão, estágios em',
  editalFramingLine2: 'instituições de ensino, cursos de língua e de computação, aprovação em',
  editalFramingLine3: 'concursos, congressos médicos (Pelo menos 30 horas por certificado)',
  editalPeriodAndTotal: 'Período: 14 de abril a 20 de junho de 2025 | Total: 45h (APROVADO - Nota 9,9)',
  matrixSectionTitle: '3. MATRIZ PROGRAMÁTICA E METODOLOGIA PEDAGÓGICA (45 HORAS)',
  axes: [
    {
      id: 'eixo-1',
      axisTitleLine1: 'Eixo I — Curadoria Científica e Revisão Técnica de',
      axisTitleLine2: 'Apostilas e Cadernos Didáticos em Saúde',
      axisSubtitle: 'Editoração Pedagógica, Terminologia Médica e Diretrizes Clínicas',
      descriptionLine1:
        'Revisão técnica remota de apostilas educativas do Centro Profissionalizante e da Editora Mente e Saúde, adequação de',
      descriptionLine2:
        'terminologia biomédica (DeCS/MeSH), atualização de fluxogramas assistenciais e checagem de referências segundo normas ICMJE.',
      hours: '12h 00min',
    },
    {
      id: 'eixo-2',
      axisTitleLine1: 'Eixo II — Elaboração e Validação de Bancos de Questões',
      axisTitleLine2: 'Comentadas para Formação em Saúde',
      axisSubtitle: 'Avaliação Formativa, Casos Clínicos Simulados e Gabaritos Fundamentados',
      descriptionLine1:
        'Estruturação de questões objetivas baseadas em vinhetas clínicas reais, redação de gabaritos comentados alternativa por',
      descriptionLine2:
        'alternativa e alinhamento pedagógico aos protocolos da Atenção Primária à Saúde (APS) e propedêutica médica.',
      hours: '12h 00min',
    },
    {
      id: 'eixo-3',
      axisTitleLine1: 'Eixo III — Tutoria Acadêmica Remota e Mediação',
      axisTitleLine2: 'Pedagógica em Ambiente Virtual (AVA)',
      axisSubtitle: 'Suporte Discente Assíncrono, Fóruns Clínicos e Orientação de Estudo',
      descriptionLine1:
        'Atendimento pedagógico remoto a alunos em plataformas digitais, resolução estruturada de dúvidas teóricas e práticas,',
      descriptionLine2:
        'moderação de fóruns temáticos interdisciplinares e acompanhamento de trilhas formativas com feedback individualizado.',
      hours: '11h 00min',
    },
    {
      id: 'eixo-4',
      axisTitleLine1: 'Eixo IV — Auditoria de Qualidade Instrucional, Design',
      axisTitleLine2: 'Educacional e Relatório Final de Estágio',
      axisSubtitle: 'Acessibilidade Didática, Padronização Editorial e Avaliação Supervisionada',
      descriptionLine1:
        'Auditoria de clareza visual e pedagógica de objetos de aprendizagem, validação de guias de estudo dirigido e aprovação no',
      descriptionLine2:
        'relatório técnico final de estágio em instituição de ensino com aproveitamento integral e nota final 9,9.',
      hours: '10h 00min',
    },
  ],
  averbacaoLine1:
    'Certificado registrado sob o nº 09 no Livro de Extensão e Cursos nº 01/2025, Folha 42, expedido pela Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) e Centro Profissionalizante Maria',
  averbacaoLine2: 'Dalva de Araújo (CNPJ: 51.269.112/0001-83).',
};

export interface DidacticCurationSample {
  id: string;
  moduleCode: string;
  title: string;
  category: string;
  originalDraft: string;
  curatedVersion: string;
  technicalNotes: string[];
  referencesUsed: string;
}

export const CURATION_SAMPLES: DidacticCurationSample[] = [
  {
    id: 'cur-01',
    moduleCode: 'CAD-APS-2025-M03',
    title: 'Apostila de Propedêutica Oftalmológica e Triagem Visual na Atenção Primária',
    category: 'Curadoria e Revisão Técnica de Apostila',
    originalDraft:
      'Quando o paciente chega na unidade queixando de olho vermelho e dor, o profissional pode indicar colírio anestésico ou corticoide tópico para aliviar rápido antes de encaminhar ao oftalmologista, além de medir a visão de perto e de longe.',
    curatedVersion:
      'Diante de síndrome do olho vermelho associada a sinais de alarme (dor ocular moderada a intensa, fotofobia, redução da acuidade visual na tabela de Snellen, hiperemia ciliar ou alteração pupilar), é estritamente contraindicada a prescrição empírica de colírios anestésicos ou corticosteroides tópicos na APS pelo risco de mascaramento diagnóstico, toxicidade epitelial corneana e agravamento de ceratites infecciosas (ex.: herpética) ou glaucoma agudo. Deve-se realizar anamnese dirigida, ectoscopia, teste de acuidade visual e encaminhamento oftalmológico de urgência.',
    technicalNotes: [
      'Correção de conduta iatrogênica: remoção imediata da menção a colírio anestésico/corticoide empírico.',
      'Inclusão de red flags semiológicas (dor ocular, fotofobia, baixa visual, hiperemia pericerática).',
      'Padronização terminológica segundo os Cadernos de Atenção Básica (Ministério da Saúde / CBO).',
    ],
    referencesUsed: 'Ministério da Saúde (CAB nº 37 — Saúde Ocular); Conselho Brasileiro de Oftalmologia (Diretrizes de Urgências Oculares, 2024).',
  },
  {
    id: 'cur-02',
    moduleCode: 'CAD-CLIN-2025-M07',
    title: 'Guia de Estudo Dirigido: Manejo da Hipertensão Arterial e Risco Cardiovascular',
    category: 'Atualização de Fluxograma e Protocolo Clínico',
    originalDraft:
      'A aferição da pressão arterial no consultório acima de 140/90 já confirma hipertensão na primeira visita em qualquer paciente, devendo sempre iniciar dois remédios juntos imediatamente.',
    curatedVersion:
      'O diagnóstico de Hipertensão Arterial Sistêmica (HAS) em consultório (PA ≥ 140/90 mmHg) requer confirmação por aferições repetidas em visitas distintas ou validação externa (MAPA/MRPA), exceto na presença de Emergência Hipertensiva, lesão de órgão-alvo (LOA) evidente ou PA ≥ 180/110 mmHg com alto risco cardiovascular. A terapia farmacológica combinada inicial é prioritária no Estágio 2 ou alto risco, enquanto monoterapia pode ser considerada no Estágio 1 de baixo risco.',
    technicalNotes: [
      'Distinção clara entre critérios de confirmação diagnóstica longitudinal vs. diagnóstico em visita única.',
      'Integração dos parâmetros de MAPA (24h) e MRPA na árvore de decisão didática do aluno.',
      'Estratificação terapêutica conforme estágio pressórico e risco global.',
    ],
    referencesUsed: 'Diretrizes Brasileiras de Hipertensão Arterial (SBC/SBH/SBN); Protocolo Clínico da APS.',
  },
  {
    id: 'cur-03',
    moduleCode: 'CAD-MET-2025-M11',
    title: 'Manual de Leitura Crítica de Artigos Biomédicos e Bioestatística Aplicada',
    category: 'Didatização Visual e Glossário Epidemiológico',
    originalDraft:
      'O valor de p menor que 0,05 prova que o tratamento funciona muito bem na prática clínica, não precisando olhar o intervalo de confiança.',
    curatedVersion:
      'A significância estatística (p < 0,05) indica apenas a probabilidade de um achado igual ou mais extremo ocorrer sob a hipótese nula, não mensurando a magnitude nem a relevância clínica do efeito. Para tomada de decisão baseada em evidências, o aluno deve avaliar conjuntamente o tamanho do efeito (RR, OR, RRR, NNT) e a precisão da estimativa por meio do Intervalo de Confiança de 95% (IC 95%).',
    technicalNotes: [
      'Desconstrução do equívoco clássico entre significância estatística (valor-p) e relevância clínica (NNT/IC 95%).',
      'Inserção de quadro prático de cálculo de Risco Relativo (RR) e Número Necessário para Tratar (NNT).',
    ],
    referencesUsed: 'Guyatt G et al. Users’ Guides to the Medical Literature (JAMA Evidence); diretrizes CONSORT.',
  },
];

export interface CommentedQuestionSample {
  id: string;
  code: string;
  topic: string;
  difficulty: string;
  stem: string;
  options: {
    letter: string;
    text: string;
    isCorrect: boolean;
    commentary: string;
  }[];
}

export const QUESTION_SAMPLES: CommentedQuestionSample[] = [
  {
    id: 'q-01',
    code: 'BQ-EMS-2025-041',
    topic: 'Saúde Ocular na Atenção Primária e Triagem Pediátrica',
    difficulty: 'Nível Intermediário · Raciocínio Clínico',
    stem: 'Durante consulta de puericultura na Unidade Básica de Saúde (UBS), um lactente de 6 semanas de vida é submetido ao Teste do Reflexo Vermelho (Teste do Olhinho) com oftalmoscópio direto a 30 cm em ambiente em penumbra. O examinador observa reflexo vermelho vivo e simétrico no olho direito, porém nota reflexo esbranquiçado (leucocoria) persistente no olho esquerdo. Assinale a conduta médica correta segundo as diretrizes do Ministério da Saúde e da Sociedade Brasileira de Oftalmologia Pediátrica:',
    options: [
      {
        letter: 'A',
        text: 'Repetir o exame com 6 meses de idade na própria UBS, pois a assimetria do reflexo pupilar é fisiológica no primeiro trimestre.',
        isCorrect: false,
        commentary: 'Incorreta. A leucocoria ou ausência/assimetria do reflexo vermelho nunca deve ser considerada fisiológica nem aguardar reavaliação tardia, devido ao risco de retinoblastoma, catarata congênita ou persistência da vasculatura fetal.',
      },
      {
        letter: 'B',
        text: 'Prescrever colírio midriático domiciliar por 7 dias e solicitar ultrassonografia ocular ambulatorial eletiva.',
        isCorrect: false,
        commentary: 'Incorreta. A dilatação pupilar para fundoscopia diagnóstica deve ser realizada pelo especialista e não se deve postergar o encaminhamento direto ao serviço de referência oftalmológica.',
      },
      {
        letter: 'C',
        text: 'Classificar o teste como alterado/suspeito, orientar a família com acolhimento e realizar encaminhamento prioritário de urgência para avaliação oftalmológica especializada.',
        isCorrect: true,
        commentary: 'Correta! A presença de leucocoria, ponto escuro ou assimetria no Teste do Reflexo Vermelho configura achado alterado que exige referência imediata ao oftalmologista para diagnóstico precoce (ex.: catarata congênita dentro da janela crítica visual ou retinoblastoma).',
      },
      {
        letter: 'D',
        text: 'Solicitar tomografia computadorizada de órbitas na atenção primária antes de encaminhar ao oftalmologista.',
        isCorrect: false,
        commentary: 'Incorreta. Além de atrasar o fluxo assistencial, evita-se radiação ionizante desnecessária em lactentes (especialmente se houver predisposição genética ao retinoblastoma), cabendo ao centro oftalmológico o exame sob midríase e ultrassonografia ocular.',
      },
    ],
  },
  {
    id: 'q-02',
    code: 'BQ-EMS-2025-088',
    topic: 'Metodologia Científica e Leitura Crítica (Medicina Baseada em Evidências)',
    difficulty: 'Nível Avançado · Epidemiologia Clínica',
    stem: 'Um ensaio clínico randomizado duplo-cego avaliou um novo fármaco neuroprotetor versus placebo na prevenção de progressão de neuropatia óptica em 1.200 pacientes acompanhados por 24 meses. A incidência do desfecho primário foi de 10% no grupo intervenção e 15% no grupo controle (Risco Relativo = 0,67; IC 95%: 0,51–0,88; p = 0,004). Com base nesses dados, qual é a Redução Absoluta do Risco (RAR) e o Número Necessário para Tratar (NNT) em 2 anos?',
    options: [
      {
        letter: 'A',
        text: 'RAR = 33% e NNT = 3 pacientes.',
        isCorrect: false,
        commentary: 'Incorreta. O valor de 33% corresponde à Redução Relativa do Risco (RRR = 1 - RR = 1 - 0,67 = 0,33), e não à Redução Absoluta do Risco.',
      },
      {
        letter: 'B',
        text: 'RAR = 5% e NNT = 20 pacientes.',
        isCorrect: true,
        commentary: 'Correta! A Redução Absoluta do Risco (RAR) é a diferença aritmética entre o risco no grupo controle (15%) e no grupo experimental (10%), resultando em RAR = 5% (0,05). O NNT é o inverso da RAR (1 / 0,05 = 20 pacientes tratados por 2 anos para evitar 1 desfecho adicional).',
      },
      {
        letter: 'C',
        text: 'RAR = 12% e NNT = 8 pacientes.',
        isCorrect: false,
        commentary: 'Incorreta. Não corresponde à diferença de incidências cumulativas entre os grupos controle (0,15) e intervenção (0,10).',
      },
      {
        letter: 'D',
        text: 'RAR = 5% e NNT = 50 pacientes.',
        isCorrect: false,
        commentary: 'Incorreta. Embora a RAR esteja correta (5% = 0,05), a divisão 1 / 0,05 resulta em NNT = 20, e não 50.',
      },
    ],
  },
];

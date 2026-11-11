import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';
import {
  CURATION_SAMPLES,
  QUESTION_SAMPLES,
  CertificateData,
} from '../types/certificate';

interface InternshipExplorerProps {
  certificateData: CertificateData;
}

export const InternshipExplorer: React.FC<InternshipExplorerProps> = ({
  certificateData,
}) => {
  const [activeTab, setActiveTab] = useState<'curadoria' | 'questoes' | 'tutoria'>('curadoria');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(CURATION_SAMPLES[0].id);
  const [comparisonMode, setComparisonMode] = useState<'split' | 'curated' | 'original'>('split');

  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(QUESTION_SAMPLES[0].id);
  const [selectedOptionLetter, setSelectedOptionLetter] = useState<string>('C');

  const activeSample =
    CURATION_SAMPLES.find((s) => s.id === selectedSampleId) || CURATION_SAMPLES[0];
  const activeQuestion =
    QUESTION_SAMPLES.find((q) => q.id === selectedQuestionId) || QUESTION_SAMPLES[0];

  const handleQuestionSwitch = (qId: string) => {
    setSelectedQuestionId(qId);
    const q = QUESTION_SAMPLES.find((item) => item.id === qId);
    const correctOpt = q?.options.find((o) => o.isCorrect);
    setSelectedOptionLetter(correctOpt ? correctOpt.letter : 'A');
  };

  return (
    <section id="o-estagio" className="py-16 border-t border-[#E7E2DA]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Editorial Chapter Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#14532D] font-semibold mb-3">
            <span>01. Arquitetura Pedagógica e Escopo Prático</span>
            <span aria-hidden="true">·</span>
            <span>Item 09 do Edital (Estágio em Instituição de Ensino)</span>
            <span aria-hidden="true">·</span>
            <span>45 Horas Supervisionadas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight leading-tight">
            Estágio Extracurricular Remoto em Instituição de Ensino: Curadoria de Material Didático, Revisão Técnica e Tutoria em Saúde
          </h2>
          <p className="text-base text-[#44403C] mt-4 leading-relaxed">
            Desenvolvido em regime de cooperação técnica interinstitucional entre o{' '}
            <strong className="text-[#1C1917]">
              Centro Profissionalizante Maria Dalva de Araújo
            </strong>{' '}
            e a <strong className="text-[#1C1917]">Editora Mente e Saúde</strong>, o programa
            integra a prática médico-acadêmica à produção educacional em saúde. Durante as 45 horas
            de atuação remota (abril a junho de 2025), o médico titular executou a revisão científica
            de apostilas profissionalizantes, a construção de bancos de itens comentados e o suporte
            pedagógico direto a discentes em Ambiente Virtual de Aprendizagem (AVA).
          </p>
        </div>

        {/* Quantitative Metrics Strip (Full-Width 4-Column Hairline Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-[#E7E2DA] rounded-xl overflow-hidden mb-12 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E2DA]">
          <div className="p-6">
            <div className="text-xs uppercase tracking-wider text-[#78716C] font-medium">
              Carga Horária Auditada
            </div>
            <div className="text-3xl font-editorial font-bold text-[#14532D] mt-1 font-mono-tabular">
              45h 00min
            </div>
            <div className="text-xs text-[#57534E] mt-1">
              14/04/2025 a 20/06/2025 · Supervisão Docente e Editorial
            </div>
          </div>

          <div className="p-6">
            <div className="text-xs uppercase tracking-wider text-[#78716C] font-medium">
              Cadernos e Apostilas Revisados
            </div>
            <div className="text-3xl font-editorial font-bold text-[#1E3A8A] mt-1 font-mono-tabular">
              12 Módulos
            </div>
            <div className="text-xs text-[#57534E] mt-1">
              Adequação terminológica DeCS/MeSH e protocolos do SUS
            </div>
          </div>

          <div className="p-6">
            <div className="text-xs uppercase tracking-wider text-[#78716C] font-medium">
              Banco de Questões Comentadas
            </div>
            <div className="text-3xl font-editorial font-bold text-[#B45309] mt-1 font-mono-tabular">
              60 Itens
            </div>
            <div className="text-xs text-[#57534E] mt-1">
              Vinhetas clínicas com justificativa alternativa por alternativa
            </div>
          </div>

          <div className="p-6">
            <div className="text-xs uppercase tracking-wider text-[#78716C] font-medium">
              Avaliação Final de Desempenho
            </div>
            <div className="text-3xl font-editorial font-bold text-[#1C1917] mt-1 font-mono-tabular">
              Nota 9,9
            </div>
            <div className="text-xs text-[#57534E] mt-1">
              Conceito Aprovado com Excelência · 100% de Frequência
            </div>
          </div>
        </div>

        {/* Interactive Pedagogical Sandbox Navigation */}
        <div className="bg-white border border-[#E7E2DA] rounded-xl overflow-hidden shadow-xs">
          <div className="border-b border-[#E7E2DA] px-6 py-4 bg-[#F7F4EE] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#1C1917]">
                Demonstrador Interativo de Entregáveis Práticos do Estágio
              </h3>
              <p className="text-xs text-[#57534E]">
                Explore amostras reais do trabalho de curadoria editorial, questões comentadas e
                mediação pedagógica realizado pelo titular
              </p>
            </div>

            {/* Interactive Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('curadoria')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'curadoria'
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                1. Curadoria e Revisão de Apostilas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('questoes')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'questoes'
                    ? 'bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                2. Banco de Questões Comentadas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tutoria')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'tutoria'
                    ? 'bg-[#B45309] text-white shadow-xs'
                    : 'text-[#44403C] hover:text-[#1C1917]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                3. Tutoria em Saúde e Matriz 45h
              </button>
            </div>
          </div>

          {/* TAB 1: CURADORIA DE MATERIAL DIDÁTICO E REVISÃO TÉCNICA */}
          {activeTab === 'curadoria' && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E7E2DA]">
                <div className="flex flex-wrap items-center gap-2">
                  {CURATION_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => setSelectedSampleId(sample.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                        selectedSampleId === sample.id
                          ? 'bg-[#F0FDF4] border-[#14532D] text-[#14532D]'
                          : 'bg-white border-[#D6CEBE] text-[#57534E] hover:bg-[#FBF9F5]'
                      }`}
                    >
                      {sample.moduleCode} · {sample.category}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-[#F7F4EE] p-1 rounded-lg border border-[#E7E2DA] shrink-0">
                  <button
                    type="button"
                    onClick={() => setComparisonMode('split')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer whitespace-nowrap ${
                      comparisonMode === 'split'
                        ? 'bg-white text-[#1C1917] shadow-2xs'
                        : 'text-[#57534E]'
                    }`}
                  >
                    Comparação Lado a Lado
                  </button>
                  <button
                    type="button"
                    onClick={() => setComparisonMode('curated')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer whitespace-nowrap ${
                      comparisonMode === 'curated'
                        ? 'bg-white text-[#1C1917] shadow-2xs'
                        : 'text-[#57534E]'
                    }`}
                  >
                    Apenas Texto Revisado
                  </button>
                  <button
                    type="button"
                    onClick={() => setComparisonMode('original')}
                    className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer whitespace-nowrap ${
                      comparisonMode === 'original'
                        ? 'bg-white text-[#1C1917] shadow-2xs'
                        : 'text-[#57534E]'
                    }`}
                  >
                    Minuta Preliminar
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-mono-tabular text-[#78716C] mb-1">
                  Módulo Auditado: {activeSample.moduleCode} · Revisor Técnico: Dr. Lucas Gonçalves
                  Silveira (CRM/CPF 702.794.941-57)
                </div>
                <h4 className="text-xl font-editorial font-bold text-[#1C1917]">
                  {activeSample.title}
                </h4>
              </div>

              <div
                className={`grid gap-6 mb-8 ${
                  comparisonMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {(comparisonMode === 'split' || comparisonMode === 'original') && (
                  <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#9A3412] uppercase tracking-wider mb-3 pb-2 border-b border-[#E7E2DA]">
                      <span>Minuta Preliminar (Antes da Revisão Técnica)</span>
                      <span className="font-mono-tabular">Rascunho Bruto</span>
                    </div>
                    <p className="text-sm text-[#57534E] leading-relaxed italic">
                      “{activeSample.originalDraft}”
                    </p>
                  </div>
                )}

                {(comparisonMode === 'split' || comparisonMode === 'curated') && (
                  <div className="bg-[#F0FDF4]/60 border border-[#14532D]/30 rounded-xl p-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#14532D] uppercase tracking-wider mb-3 pb-2 border-b border-[#14532D]/20">
                      <span className="flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4" />
                        Texto Oficial Homologado após Curadoria Científica
                      </span>
                      <span className="font-mono-tabular">Padrão Editorial EMS</span>
                    </div>
                    <p className="text-sm text-[#1C1917] leading-relaxed font-medium">
                      “{activeSample.curatedVersion}”
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-[#F7F4EE] border border-[#E7E2DA] rounded-xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-[#1C1917] mb-3 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#14532D]" />
                    Intervenções Pedagógicas e Correções Técnicas Executadas no Estágio
                  </h5>
                  <ul className="space-y-2">
                    {activeSample.technicalNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#44403C]">
                        <CheckCircle2 className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t lg:border-t-0 lg:border-l border-[#E7E2DA] pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-bold text-[#1E3A8A] mb-2">
                      Referencial Normativo Utilizado
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {activeSample.referencesUsed}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E7E2DA] text-[11px] font-mono-tabular text-[#78716C]">
                    Status: Homologado pelo Conselho Editorial (Livro 01/2025)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BANCO DE QUESTÕES COMENTADAS EM SAÚDE */}
          {activeTab === 'questoes' && (
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E7E2DA]">
                <div className="flex flex-wrap items-center gap-2">
                  {QUESTION_SAMPLES.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleQuestionSwitch(q.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                        selectedQuestionId === q.id
                          ? 'bg-[#EFF6FF] border-[#1E3A8A] text-[#1E3A8A]'
                          : 'bg-white border-[#D6CEBE] text-[#57534E] hover:bg-[#FBF9F5]'
                      }`}
                    >
                      Item {q.code} · {q.topic}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-[#57534E]">
                  Clique em qualquer alternativa abaixo para inspecionar o gabarito comentado pelo
                  estagiário
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs text-[#1E3A8A] font-semibold mb-2">
                  <span className="font-mono-tabular">{activeQuestion.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeQuestion.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeQuestion.difficulty}</span>
                </div>
                <p className="text-sm sm:text-base text-[#1C1917] leading-relaxed font-medium bg-[#FBF9F5] p-5 rounded-xl border border-[#E7E2DA]">
                  {activeQuestion.stem}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 space-y-3">
                  {activeQuestion.options.map((opt) => {
                    const isSelected = selectedOptionLetter === opt.letter;
                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        onClick={() => setSelectedOptionLetter(opt.letter)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-[#F0FDF4] border-[#14532D] shadow-xs'
                              : 'bg-[#FEF2F2] border-[#DC2626] shadow-xs'
                            : 'bg-white border-[#E7E2DA] hover:bg-[#FBF9F5]'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-mono-tabular text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-[#14532D] text-white'
                                : 'bg-[#DC2626] text-white'
                              : 'bg-[#F5F2EB] text-[#44403C]'
                          }`}
                        >
                          {opt.letter}
                        </span>
                        <div className="flex-1">
                          <div className="text-xs sm:text-sm text-[#1C1917] leading-relaxed">
                            {opt.text}
                          </div>
                          <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider">
                            {opt.isCorrect ? (
                              <span className="text-[#14532D]">
                                ✓ Gabarito Oficial (Alternativa Correta)
                              </span>
                            ) : (
                              <span className="text-[#78716C]">
                                Distrator Analisado · Clique para ver comentário
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Commentary Panel */}
                <div className="lg:col-span-5 bg-[#F7F4EE] border border-[#E7E2DA] rounded-xl p-6">
                  {(() => {
                    const currentOpt =
                      activeQuestion.options.find((o) => o.letter === selectedOptionLetter) ||
                      activeQuestion.options[0];
                    return (
                      <>
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E2DA]">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                            Justificativa Pedagógica · Alternativa {currentOpt.letter}
                          </span>
                          <span
                            className={`text-xs font-bold uppercase ${
                              currentOpt.isCorrect ? 'text-[#14532D]' : 'text-[#DC2626]'
                            }`}
                          >
                            {currentOpt.isCorrect ? 'Alternativa Correta' : 'Alternativa Incorreta'}
                          </span>
                        </div>
                        <p className="text-sm text-[#292524] leading-relaxed">
                          {currentOpt.commentary}
                        </p>
                        <div className="mt-6 pt-4 border-t border-[#E7E2DA] text-xs text-[#57534E] space-y-1">
                          <div>
                            <strong className="text-[#1C1917]">Autoria do Comentário:</strong>{' '}
                            Lucas Gonçalves Silveira (Médico Estagiário em Docência e Curadoria)
                          </div>
                          <div>
                            <strong className="text-[#1C1917]">Finalidade Pedagógica:</strong>{' '}
                            Fixação diagnóstica e prevenção de erros de conduta na Atenção Primária.
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TUTORIA EM SAÚDE E MATRIZ DE 45 HORAS */}
          {activeTab === 'tutoria' && (
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h4 className="text-lg font-editorial font-bold text-[#1C1917]">
                  Detalhamento Analítico dos 4 Eixos Curriculares ({certificateData.workloadHours}{' '}
                  Horas)
                </h4>
                <p className="text-xs text-[#57534E] mt-1">
                  Estrutura idêntica à averbada no Verso Oficial (Lauda 2 — Memorial Descritivo) do
                  Certificado Nº {certificateData.certNumber}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {certificateData.axes.map((axis, idx) => (
                  <div
                    key={axis.id}
                    className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#14532D] font-bold mb-2">
                        <span>Módulo Estruturante 0{idx + 1}</span>
                        <span className="font-mono-tabular bg-white px-2.5 py-1 rounded border border-[#E7E2DA] text-[#1C1917]">
                          {axis.hours}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#1E3A8A]">
                        {axis.axisTitleLine1} {axis.axisTitleLine2}
                      </h5>
                      <div className="text-xs text-[#78716C] font-medium mt-0.5 mb-3">
                        {axis.axisSubtitle}
                      </div>
                      <p className="text-xs text-[#44403C] leading-relaxed">
                        {axis.descriptionLine1} {axis.descriptionLine2}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#F0FDF4] border border-[#14532D]/25 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-[#14532D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#14532D] uppercase tracking-wider">
                      Conformidade Integral com o Item 09 do Edital de Análise Curricular
                    </div>
                    <p className="text-xs text-[#292524] mt-1">
                      Modalidade: Estágio em Instituição de Ensino · Carga horária superior ao
                      mínimo exigido de 30 horas (45 horas cumpridas) · Co-emissão institucional com
                      CNPJ e chave pública verificável.
                    </p>
                  </div>
                </div>
                <a
                  href="#certificado-oficial"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#14532D] text-white hover:bg-[#0F3D23] transition-colors whitespace-nowrap shrink-0"
                >
                  Ver no Certificado PDF <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

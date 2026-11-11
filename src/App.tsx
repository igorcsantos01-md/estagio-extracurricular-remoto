/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Download,
  ShieldCheck,
  FileText,
  BookOpen,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  CertificateData,
  DEFAULT_CERTIFICATE_09,
} from './types/certificate';
import {
  CertificateViewer,
  CertificateFrontSheet,
  CertificateBackSheet,
} from './components/CertificateViewer';
import { InternshipExplorer } from './components/InternshipExplorer';
import { ValidatorSection } from './components/ValidatorSection';
import {
  downloadCertificatePdf,
  generateQrCodeDataUrl,
} from './utils/pdfGenerator';

const STORAGE_KEY = 'ems_cpmda_cert_09_v1';

export default function App() {
  const [certificateData, setCertificateData] = useState<CertificateData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CERTIFICATE_09, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_CERTIFICATE_09;
  });

  const [printQrUrl, setPrintQrUrl] = useState<string>('');
  const [isDownloadingHero, setIsDownloadingHero] = useState<boolean>(false);

  const cleanBase = certificateData.baseUrl.replace(/\/+$/, '');
  const verificationUrl = `${cleanBase}/?codigo=${encodeURIComponent(
    certificateData.code
  )}#validador`;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certificateData));
    } catch {
      // Ignore storage quota errors
    }
  }, [certificateData]);

  useEffect(() => {
    generateQrCodeDataUrl(verificationUrl).then(setPrintQrUrl);
  }, [verificationUrl]);

  const handleResetCertificate = () => {
    setCertificateData(DEFAULT_CERTIFICATE_09);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleHeroDownload = async () => {
    setIsDownloadingHero(true);
    try {
      await downloadCertificatePdf(certificateData);
    } finally {
      setIsDownloadingHero(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* =====================================================================
          TOP BAR CONTRACT (3 ZONES: BRAND — 4 NAV LINKS — 1 PRIMARY CTA)
      ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-xs border-b border-[#E7E2DA] no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            className="text-base sm:text-lg font-editorial font-bold tracking-tight text-[#14532D] whitespace-nowrap shrink-0"
          >
            Editora Mente e Saúde · CPMDA
          </a>

          {/* Zone 2: 4 concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#44403C]">
            <a
              href="#certificado-oficial"
              className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0"
            >
              Certificado PDF
            </a>
            <a
              href="#o-estagio"
              className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0"
            >
              O Estágio (45h)
            </a>
            <a
              href="#validador"
              className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0"
            >
              Validador Oficial
            </a>
            <a
              href="#instituicoes"
              className="hover:text-[#14532D] transition-colors whitespace-nowrap shrink-0"
            >
              Instituições Emissoras
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleHeroDownload}
              disabled={isDownloadingHero}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#14532D] rounded-lg hover:bg-[#0F3D23] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            >
              {isDownloadingHero ? 'Gerando PDF...' : 'Baixar Certificado PDF'}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN WEB INTERFACE
      ===================================================================== */}
      <main className="flex-1 no-print">
        {/* Institutional Hero & Operational Utility Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-[#F7F4EE] to-[#FBF9F5]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Left Column: Editorial Presentation */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#14532D] font-semibold uppercase tracking-widest mb-4">
                    <span>Programa Interinstitucional de Extensão e Educação em Saúde</span>
                    <span aria-hidden="true">·</span>
                    <span>Certificado Nº {certificateData.certNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{certificateData.code}</span>
                  </div>

                  <h1
                    className="text-3xl sm:text-4xl lg:text-[42px] font-editorial font-bold text-[#1C1917] tracking-tight leading-[1.15]"
                    style={{ textWrap: 'balance' }}
                  >
                    Estágio Extracurricular Remoto em Instituição de Ensino: Curadoria de Material Didático, Revisão Técnica e Tutoria em Saúde
                  </h1>

                  <p className="text-base text-[#44403C] mt-5 leading-relaxed max-w-2xl">
                    Plataforma pública de transparência curricular, repositório demonstrativo de
                    atividades práticas e verificação criptográfica de fé pública referente ao
                    estágio docente e editorial cumprido no período de{' '}
                    <strong className="text-[#1C1917]">{certificateData.periodText}</strong> com
                    carga horária integral de{' '}
                    <strong className="text-[#14532D]">{certificateData.workloadExtended}</strong>.
                  </p>
                </div>

                {/* Primary & Secondary CTAs */}
                <div className="mt-8 pt-6 border-t border-[#E7E2DA] flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={handleHeroDownload}
                    disabled={isDownloadingHero}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-[#14532D] text-white hover:bg-[#0F3D23] transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloadingHero
                      ? 'Gerando PDF Vetorial de 2 Laudas...'
                      : 'Baixar Certificado Oficial (PDF 2 Laudas)'}
                  </button>

                  <a
                    href="#certificado-oficial"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-xs sm:text-sm font-semibold bg-white text-[#1C1917] border border-[#D6CEBE] hover:bg-[#F5F2EB] transition-colors whitespace-nowrap shrink-0"
                  >
                    <FileText className="w-4 h-4 text-[#B45309]" />
                    Abrir Visualizador / Editor PDF
                  </a>

                  <a
                    href="#validador"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:underline whitespace-nowrap shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Validar Autenticidade
                  </a>
                </div>
              </div>

              {/* Right Column: Official Holder & Co-Issuers Dossier Card */}
              <div className="lg:col-span-5 bg-white border border-[#E7E2DA] rounded-xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
                <div>
                  {/* Co-Issuers Header with Official Logos */}
                  <div className="flex items-center justify-between gap-4 pb-5 mb-5 border-b border-[#E7E2DA]">
                    <div className="flex items-center gap-3">
                      <img
                        src="/assets/cert/logo_ems.png"
                        alt="Brasão Editora Mente e Saúde"
                        className="w-12 h-12 object-contain shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#14532D] leading-tight">
                          EDITORA MENTE E SAÚDE
                        </div>
                        <div className="text-[11px] font-mono-tabular text-[#57534E]">
                          CNPJ: 51.372.335/0001-71
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-bold text-[#1E3A8A] leading-tight">
                          CENTRO PROFISSIONALIZANTE
                        </div>
                        <div className="text-[11px] font-mono-tabular text-[#57534E]">
                          CNPJ: 51.269.112/0001-83
                        </div>
                      </div>
                      <img
                        src="/assets/cert/logo_cpmda.png"
                        alt="Logo Centro Profissionalizante Maria Dalva de Araújo"
                        className="w-12 h-12 object-contain shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Holder Identification */}
                  <div className="bg-[#F0FDF4]/80 border border-[#14532D]/25 rounded-lg p-4 mb-5">
                    <div className="text-[11px] uppercase tracking-wider text-[#14532D] font-bold">
                      Profissional Titular Certificado
                    </div>
                    <div className="text-lg sm:text-xl font-editorial font-bold text-[#1E3A8A] mt-0.5">
                      {certificateData.holderName}
                    </div>
                    <div className="text-xs font-medium text-[#292524] mt-1">
                      {certificateData.holderQualification}
                    </div>
                  </div>

                  {/* Key Registry Metadata Definition List */}
                  <dl className="divide-y divide-[#E7E2DA] text-xs">
                    <div className="py-2.5 flex items-center justify-between gap-4">
                      <dt className="text-[#78716C]">Enquadramento Edital</dt>
                      <dd className="font-semibold text-[#1C1917] text-right">
                        Item 09 · Estágio em Instituição de Ensino
                      </dd>
                    </div>
                    <div className="py-2.5 flex items-center justify-between gap-4">
                      <dt className="text-[#78716C]">Carga Horária e Situação</dt>
                      <dd className="font-semibold text-[#14532D] text-right font-mono-tabular">
                        45 Horas · {certificateData.finalGrade}
                      </dd>
                    </div>
                    <div className="py-2.5 flex items-center justify-between gap-4">
                      <dt className="text-[#78716C]">Registro de Averbação</dt>
                      <dd className="font-mono-tabular text-[#1C1917] text-right">
                        Cert. Nº {certificateData.certNumber} · Livro {certificateData.bookNumber} ·
                        Folha {certificateData.leafNumber}
                      </dd>
                    </div>
                    <div className="py-2.5 flex items-center justify-between gap-4">
                      <dt className="text-[#78716C]">Código / Chave Pública</dt>
                      <dd className="font-mono-tabular font-bold text-[#B45309] text-right">
                        {certificateData.code}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E7E2DA] flex items-center justify-between text-xs text-[#57534E]">
                  <span className="flex items-center gap-1.5 text-[#14532D] font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Documento Oficial de 2 Laudas
                  </span>
                  <span className="font-mono-tabular">{certificateData.locationAndDate}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 1: EMBEDDED PDF VIEWER & LIVE CERTIFICATE EDITOR (2 LAUDAS)
        =================================================================== */}
        <CertificateViewer
          data={certificateData}
          onChange={setCertificateData}
          onReset={handleResetCertificate}
        />

        {/* ===================================================================
            SECTION 2: INTERACTIVE EXPLANATION & DELIVERABLES OF THE INTERNSHIP
        =================================================================== */}
        <InternshipExplorer certificateData={certificateData} />

        {/* ===================================================================
            SECTION 3: CRYPTOGRAPHIC VALIDATOR (#validador)
        =================================================================== */}
        <ValidatorSection certificateData={certificateData} />

        {/* ===================================================================
            SECTION 4: CO-ISSUING INSTITUTIONS & SIGNATORIES (#instituicoes)
        =================================================================== */}
        <section id="instituicoes" className="py-16 border-t border-[#E7E2DA] bg-white">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-10">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#14532D] font-semibold mb-2">
                <span>03. Governança Acadêmica e Signatários</span>
                <span aria-hidden="true">·</span>
                <span>Cooperação Técnica Interinstitucional</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917]">
                Entidades Certificadoras e Responsáveis Técnicos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Entity 1: Editora Mente e Saúde */}
              <div className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src="/assets/cert/logo_ems.png"
                      alt="Logo Editora Mente e Saúde"
                      className="w-16 h-16 object-contain shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#14532D]">Editora Mente e Saúde</h3>
                      <div className="text-xs font-mono-tabular text-[#44403C]">
                        CNPJ: 51.372.335/0001-71 · Conselho Editorial e Extensão Científica
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                    Responsável pela supervisão editorial científica, padronização segundo as
                    diretrizes do International Committee of Medical Journal Editors (ICMJE /
                    Vancouver), revisão de literatura biomédica e chancela dos materiais didáticos e
                    guias clínicos produzidos durante o estágio.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E7E2DA] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#14532D]">
                      {certificateData.leftSignerName}
                    </div>
                    <div className="text-[11px] text-[#57534E]">
                      {certificateData.leftSignerRole}
                    </div>
                  </div>
                  <img
                    src="/assets/cert/sig_barbara.png"
                    alt="Assinatura Bárbara Lima dos Santos"
                    className="h-10 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Entity 2: Centro Profissionalizante Maria Dalva de Araújo */}
              <div className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <img
                      src="/assets/cert/logo_cpmda.png"
                      alt="Logo Centro Profissionalizante Maria Dalva de Araújo"
                      className="w-16 h-16 object-contain shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#1E3A8A]">
                        Centro Profissionalizante Maria Dalva de Araújo
                      </h3>
                      <div className="text-xs font-mono-tabular text-[#44403C]">
                        CNPJ: 51.269.112/0001-83 · Coordenação de Extensão e Projetos Educativos
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44403C] leading-relaxed">
                    Instituição de ensino responsável pelo Ambiente Virtual de Aprendizagem (AVA),
                    coordenação pedagógica das turmas de formação em saúde, acompanhamento da
                    tutoria remota, avaliação de aproveitamento prático e registro oficial no Livro
                    de Estágios e Extensão.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E7E2DA] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-[#1E3A8A]">
                      {certificateData.rightSignerName}
                    </div>
                    <div className="text-[11px] text-[#57534E]">
                      {certificateData.rightSignerRole}
                    </div>
                  </div>
                  <img
                    src="/assets/cert/sig_james.png"
                    alt="Assinatura James Araújo de Santana"
                    className="h-10 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          QUIET INSTITUTIONAL FOOTER
      ===================================================================== */}
      <footer className="bg-[#1C1917] text-stone-400 py-10 border-t border-stone-800 no-print">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
          <div className="space-y-1">
            <div className="text-stone-200 font-semibold">
              Programa Interinstitucional de Extensão, Comunicação Científica e Educação em Saúde
            </div>
            <div>
              Editora Mente e Saúde (CNPJ: 51.372.335/0001-71) & Centro Profissionalizante Maria
              Dalva de Araújo (CNPJ: 51.269.112/0001-83)
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-stone-300">
            <a href="#certificado-oficial" className="hover:text-white transition-colors">
              Certificado Nº {certificateData.certNumber}
            </a>
            <span aria-hidden="true">·</span>
            <a href="#validador" className="hover:text-white transition-colors">
              Validador ({certificateData.code})
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleHeroDownload}
              className="text-[#FBBF24] hover:underline font-medium cursor-pointer"
            >
              Baixar PDF Oficial
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          PRINT-ONLY 2-PAGE A4 LANDSCAPE CONTAINER (@media print)
      ===================================================================== */}
      <div className="print-only-container hidden">
        <CertificateFrontSheet
          data={certificateData}
          qrCodeUrl={printQrUrl}
          verificationUrl={verificationUrl}
        />
        <CertificateBackSheet
          data={certificateData}
          qrCodeUrl={printQrUrl}
          verificationUrl={verificationUrl}
        />
      </div>
    </div>
  );
}

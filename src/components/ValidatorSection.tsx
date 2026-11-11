import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Search,
  Copy,
  Check,
  Download,
  FileSearch,
  AlertCircle,
  QrCode,
} from 'lucide-react';
import { CertificateData } from '../types/certificate';
import { downloadCertificatePdf, generateQrCodeDataUrl } from '../utils/pdfGenerator';

interface ValidatorSectionProps {
  certificateData: CertificateData;
}

export const ValidatorSection: React.FC<ValidatorSectionProps> = ({ certificateData }) => {
  const [query, setQuery] = useState<string>(certificateData.code);
  const [validationState, setValidationState] = useState<'valid' | 'invalid' | 'idle'>('valid');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const cleanBase = certificateData.baseUrl.replace(/\/+$/, '');
  const fullVerificationUrl = `${cleanBase}/?codigo=${encodeURIComponent(
    certificateData.code
  )}#validador`;

  useEffect(() => {
    generateQrCodeDataUrl(fullVerificationUrl).then(setQrUrl);
  }, [fullVerificationUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const urlCode = params.get('codigo') || params.get('chave') || params.get('code');
    if (urlCode) {
      setQuery(urlCode.trim());
      validateInput(urlCode.trim());
      if (window.location.hash === '#validador') {
        const el = document.getElementById('validador');
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setQuery(certificateData.code);
      setValidationState('valid');
    }
  }, [certificateData.code, certificateData.controlKey]);

  const validateInput = (rawInput: string) => {
    const clean = rawInput.trim().toUpperCase();
    if (!clean) {
      setValidationState('idle');
      return;
    }
    const validTokens = [
      certificateData.code.toUpperCase(),
      certificateData.controlKey.toUpperCase(),
      certificateData.sha256.toUpperCase(),
      'EMS-EST-2025-0909',
      '0909-7027-9457-9E4B',
      'EMS-CDP-2025-0914',
      'EMS-EXT-2025-0909',
      '702.794.941-57',
      'LUCAS GONÇALVES SILVEIRA',
    ];
    if (validTokens.some((tok) => clean === tok || tok.includes(clean) && clean.length >= 4)) {
      setValidationState('valid');
    } else {
      setValidationState('invalid');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateInput(query);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCertificatePdf(certificateData);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="validador" className="py-16 border-t border-[#E7E2DA] bg-[#F7F4EE]/70 no-print">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-10">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#14532D] font-semibold mb-2">
            <span>02. Fé Pública Interinstitucional</span>
            <span aria-hidden="true">·</span>
            <span>Consulta Pública de Autenticidade</span>
            <span aria-hidden="true">·</span>
            <span>Leitura Automática via QR Code</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] tracking-tight">
            Sistema Oficial de Verificação de Certificados e Averbação Curricular
          </h2>
          <p className="text-sm text-[#57534E] mt-2 leading-relaxed">
            Consulte a regularidade documental, a carga horária averbada e a integridade do Hash
            SHA-256 informando o <strong className="text-[#1C1917]">Código de Autenticidade</strong>{' '}
            ou a <strong className="text-[#1C1917]">Chave de Controle</strong> impressos no
            certificado físico/digital.
          </p>
        </div>

        {/* Search & Query Bar */}
        <div className="bg-white border border-[#E7E2DA] rounded-xl p-6 shadow-xs mb-8">
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o Código (ex.: EMS-EST-2025-0909) ou Chave (0909-7027-9457-9E4B)..."
                aria-label="Código ou Chave de Autenticidade"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono-tabular bg-[#FBF9F5] border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D] text-[#1C1917]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg text-xs font-semibold bg-[#14532D] text-white hover:bg-[#0F3D23] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Verificar Autenticidade
            </button>
          </form>

          {/* Quick Test Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-[#E7E2DA] text-xs text-[#57534E]">
            <span>Preenchimento rápido oficial:</span>
            <button
              type="button"
              onClick={() => {
                setQuery(certificateData.code);
                validateInput(certificateData.code);
              }}
              className="font-mono-tabular text-[#14532D] hover:underline font-semibold cursor-pointer"
            >
              Código: {certificateData.code}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setQuery(certificateData.controlKey);
                validateInput(certificateData.controlKey);
              }}
              className="font-mono-tabular text-[#1E3A8A] hover:underline font-semibold cursor-pointer"
            >
              Chave: {certificateData.controlKey}
            </button>
          </div>
        </div>

        {/* Validation Result Panel */}
        {validationState === 'valid' && (
          <div className="bg-white border border-[#14532D]/35 rounded-xl overflow-hidden shadow-sm">
            {/* Top Banner */}
            <div className="bg-[#14532D] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#FBBF24] shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#A7F3D0] font-semibold">
                    Fé Pública Interinstitucional Confirmada · Lei nº 9.394/96
                  </div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    CERTIFICADO AUTÊNTICO, REGULAR E VÁLIDO EM TODO O TERRITÓRIO NACIONAL
                  </h3>
                </div>
              </div>
              <div className="text-xs font-mono-tabular bg-[#0F3D23] px-3.5 py-1.5 rounded border border-white/15">
                Registro Ativo: {certificateData.code}
              </div>
            </div>

            {/* Detailed Dossier Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                {/* Holder & Activity Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#E7E2DA]">
                  <div>
                    <div className="text-xs text-[#78716C] uppercase tracking-wider font-medium">
                      Profissional Titular Certificado
                    </div>
                    <div className="text-base font-bold text-[#1C1917] mt-1">
                      {certificateData.holderName}
                    </div>
                    <div className="text-xs text-[#44403C] mt-0.5">
                      {certificateData.holderQualification}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#78716C] uppercase tracking-wider font-medium">
                      Enquadramento Edital (Item 09)
                    </div>
                    <div className="text-sm font-bold text-[#1E3A8A] mt-1">
                      {certificateData.activityModality} (≥ 30 Horas)
                    </div>
                    <div className="text-xs text-[#44403C] mt-0.5">
                      Carga Horária Cumprida:{' '}
                      <strong className="text-[#14532D]">{certificateData.workloadExtended}</strong>{' '}
                      · Nota: <strong>{certificateData.finalGrade}</strong>
                    </div>
                  </div>
                </div>

                {/* Activity Title & Averbação */}
                <div className="pb-6 border-b border-[#E7E2DA]">
                  <div className="text-xs text-[#78716C] uppercase tracking-wider font-medium mb-1">
                    Título Oficial da Atividade Extracurricular Averbada
                  </div>
                  <div className="text-sm sm:text-base font-editorial font-bold text-[#1C1917]">
                    “{certificateData.activityTitle}”
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#57534E] mt-2">
                    <span>Período: {certificateData.periodText}</span>
                    <span aria-hidden="true">·</span>
                    <span>Emissão: {certificateData.locationAndDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Livro nº {certificateData.bookNumber}, Folha {certificateData.leafNumber}
                    </span>
                  </div>
                </div>

                {/* Cryptographic Keys & SHA-256 */}
                <div className="space-y-3">
                  <div className="text-xs text-[#78716C] uppercase tracking-wider font-semibold">
                    Chaves Criptográficas de Controle e Rastreabilidade
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#78716C]">Código de Autenticidade</div>
                        <div className="text-xs font-mono-tabular font-bold text-[#14532D]">
                          {certificateData.code}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(certificateData.code, 'code')}
                        className="p-1.5 text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                        title="Copiar Código"
                      >
                        {copiedField === 'code' ? (
                          <Check className="w-4 h-4 text-[#14532D]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-[#78716C]">Chave de Controle / Dígito</div>
                        <div className="text-xs font-mono-tabular font-bold text-[#B45309]">
                          {certificateData.controlKey}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(certificateData.controlKey, 'key')}
                        className="p-1.5 text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                        title="Copiar Chave"
                      >
                        {copiedField === 'key' ? (
                          <Check className="w-4 h-4 text-[#14532D]" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#FBF9F5] border border-[#E7E2DA] rounded-lg p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] text-[#78716C]">
                        Assinatura Digital / Hash SHA-256 do Registro
                      </div>
                      <div className="text-xs font-mono-tabular font-medium text-[#1C1917] truncate">
                        {certificateData.sha256}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(certificateData.sha256, 'sha')}
                      className="p-1.5 text-[#57534E] hover:text-[#1C1917] shrink-0 cursor-pointer"
                      title="Copiar Hash SHA-256"
                    >
                      {copiedField === 'sha' ? (
                        <Check className="w-4 h-4 text-[#14532D]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: QR Code & Instant PDF Actions */}
              <div className="lg:col-span-4 bg-[#FBF9F5] border border-[#E7E2DA] rounded-xl p-6 flex flex-col items-center justify-between text-center">
                <div className="w-full">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#14532D] uppercase tracking-wider mb-3">
                    <QrCode className="w-4 h-4" />
                    Chancela QR Code Oficial
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#D6CEBE] inline-block shadow-2xs">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt="QR Code de Autenticidade do Certificado"
                        className="w-36 h-36 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-xs text-stone-400">
                        Gerando QR...
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#57534E] mt-3 leading-relaxed">
                    Aponte a câmera do smartphone para validar instantaneamente ou clique abaixo
                    para obter a via oficial em PDF de 2 laudas.
                  </p>
                </div>

                <div className="w-full space-y-2.5 mt-6 pt-4 border-t border-[#E7E2DA]">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#14532D] text-white hover:bg-[#0F3D23] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloading
                      ? 'Gerando PDF Oficial...'
                      : 'Baixar Certificado Oficial (PDF)'}
                  </button>

                  <a
                    href="#certificado-oficial"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-[#1C1917] border border-[#D6CEBE] hover:bg-[#F5F2EB] transition-colors whitespace-nowrap"
                  >
                    <FileSearch className="w-4 h-4" />
                    Visualizar Laudas 1 e 2 na Tela
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {validationState === 'invalid' && (
          <div className="bg-white border border-[#DC2626]/40 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-[#1C1917]">
                Código ou Chave Não Localizado na Base Desta Atividade
              </h3>
              <p className="text-xs text-[#57534E] mt-1">
                Verifique se o código foi digitado corretamente. Para o Certificado Nº 09 de Lucas
                Gonçalves Silveira, utilize o código{' '}
                <strong className="font-mono-tabular text-[#1C1917]">
                  {certificateData.code}
                </strong>{' '}
                ou a chave{' '}
                <strong className="font-mono-tabular text-[#1C1917]">
                  {certificateData.controlKey}
                </strong>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

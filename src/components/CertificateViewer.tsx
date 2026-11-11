import React, { useEffect, useState } from 'react';
import {
  Download,
  Printer,
  Edit3,
  Check,
  RotateCcw,
  FileText,
  ZoomIn,
  ZoomOut,
  Globe,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { CertificateData, DEFAULT_CERTIFICATE_09 } from '../types/certificate';
import {
  createCertificatePdfBlobUrl,
  downloadCertificatePdf,
  generateQrCodeDataUrl,
} from '../utils/pdfGenerator';

interface CertificateViewerProps {
  data: CertificateData;
  onChange: (updated: CertificateData) => void;
  onReset: () => void;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  data,
  onChange,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'page1' | 'page2' | 'native-pdf'>('both');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const cleanBase = data.baseUrl.replace(/\/+$/, '');
  const verificationUrl = `${cleanBase}/?codigo=${encodeURIComponent(data.code)}#validador`;

  useEffect(() => {
    let active = true;
    generateQrCodeDataUrl(verificationUrl).then((url) => {
      if (active) setQrCodeUrl(url);
    });
    return () => {
      active = false;
    };
  }, [verificationUrl]);

  useEffect(() => {
    if (viewMode !== 'native-pdf') return;
    let active = true;
    let currentUrl = '';
    setIsGeneratingPdf(true);
    createCertificatePdfBlobUrl(data)
      .then((url) => {
        if (active) {
          currentUrl = url;
          setPdfBlobUrl(url);
          setIsGeneratingPdf(false);
        }
      })
      .catch(() => {
        if (active) setIsGeneratingPdf(false);
      });

    return () => {
      active = false;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [data, viewMode]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadCertificatePdf(data);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleFieldChange = <K extends keyof CertificateData>(key: K, value: CertificateData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleAxisChange = (
    index: number,
    field: keyof CertificateData['axes'][number],
    value: string
  ) => {
    const updatedAxes = data.axes.map((ax, i) => (i === index ? { ...ax, [field]: value } : ax));
    onChange({
      ...data,
      axes: updatedAxes,
    });
  };

  const useCurrentSiteUrl = () => {
    if (typeof window !== 'undefined') {
      handleFieldChange('baseUrl', window.location.origin);
    }
  };

  return (
    <section id="certificado-oficial" className="py-16 border-t border-[#E7E2DA]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 no-print">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#14532D] font-semibold mb-2">
              <span>Documento Oficial de 2 Laudas</span>
              <span aria-hidden="true">·</span>
              <span>Padrão A4 Paisagem (297mm × 210mm)</span>
              <span aria-hidden="true">·</span>
              <span>Texto Vetorial Acessível e Editável</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] tracking-tight">
              Certificado Nº {data.certNumber} — Visualizador e Editor PDF Integrado
            </h2>
            <p className="text-sm text-[#57534E] mt-1.5 max-w-2xl">
              Exibição fiel em duas laudas (Frente e Memorial Descritivo no Verso) com as logomarcas,
              rubricas caligráficas, Selo Oficial de Fé Pública e QR Code dinâmico. Ative o{' '}
              <strong className="text-[#1C1917]">Modo Edição</strong> para personalizar qualquer texto ou
              domínio antes de baixar o PDF vetorial.
            </p>
          </div>

          {/* Primary Download & Print Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                isEditing
                  ? 'bg-[#B45309] text-white border-[#B45309] shadow-sm'
                  : 'bg-white text-[#1C1917] border-[#D6CEBE] hover:bg-[#F5F2EB]'
              }`}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              {isEditing ? 'Concluir Edição' : 'Modo Edição (Editar PDF)'}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white text-[#1E3A8A] border border-[#1E3A8A]/30 hover:bg-[#1E3A8A]/5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              Imprimir 2 Laudas
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#14532D] text-white hover:bg-[#0F3D23] transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPdf
                ? 'Gerando PDF Vetorial...'
                : downloadSuccess
                ? 'PDF Baixado com Sucesso!'
                : 'Baixar Certificado PDF (2 Laudas)'}
            </button>
          </div>
        </div>

        {/* Interactive Editor Panel (Collapsible) */}
        {isEditing && (
          <div className="mb-8 bg-white border border-[#D97706]/40 rounded-xl p-6 shadow-sm no-print">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E7E2DA]">
              <div>
                <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#B45309]" />
                  Painel de Edição em Tempo Real do Certificado (Sincronizado com o PDF)
                </h3>
                <p className="text-xs text-[#57534E] mt-0.5">
                  Todas as alterações feitas abaixo (ou clicando diretamente nos textos da folha) são
                  aplicadas imediatamente ao arquivo PDF baixado e ao QR Code.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={useCurrentSiteUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F0FDF4] text-[#14532D] border border-[#14532D]/20 hover:bg-[#DCFCE7] cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Usar URL Atual no QR Code
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleFieldChange('baseUrl', DEFAULT_CERTIFICATE_09.baseUrl)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#EFF6FF] text-[#1E3A8A] border border-[#1E3A8A]/20 hover:bg-[#DBEAFE] cursor-pointer whitespace-nowrap"
                >
                  URL Vercel Padrão
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Padrão Nº 09
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Nome do Profissional Titular
                </label>
                <input
                  type="text"
                  value={data.holderName}
                  onChange={(e) => handleFieldChange('holderName', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Qualificação, CPF e Instituição (UNIFAN)
                </label>
                <input
                  type="text"
                  value={data.holderQualification}
                  onChange={(e) => handleFieldChange('holderQualification', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Título Principal do Certificado (Lauda 1)
                </label>
                <input
                  type="text"
                  value={data.mainTitle}
                  onChange={(e) => handleFieldChange('mainTitle', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Código de Autenticidade
                </label>
                <input
                  type="text"
                  value={data.code}
                  onChange={(e) => handleFieldChange('code', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-tabular border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Chave de Controle
                </label>
                <input
                  type="text"
                  value={data.controlKey}
                  onChange={(e) => handleFieldChange('controlKey', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-tabular border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Local e Data de Emissão
                </label>
                <input
                  type="text"
                  value={data.locationAndDate}
                  onChange={(e) => handleFieldChange('locationAndDate', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Domínio Base p/ QR Code e Verificação
                </label>
                <input
                  type="text"
                  value={data.baseUrl}
                  onChange={(e) => handleFieldChange('baseUrl', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono-tabular border border-[#D6CEBE] rounded-lg focus:outline-none focus:border-[#14532D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#44403C]">
                  1º Parágrafo do Corpo (3 linhas perfeitamente alinhadas no PDF)
                </label>
                <input
                  type="text"
                  value={data.bodyPara1Line1}
                  onChange={(e) => handleFieldChange('bodyPara1Line1', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
                <input
                  type="text"
                  value={data.bodyPara1Line2}
                  onChange={(e) => handleFieldChange('bodyPara1Line2', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
                <input
                  type="text"
                  value={data.bodyPara1Line3}
                  onChange={(e) => handleFieldChange('bodyPara1Line3', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#44403C]">
                  2º Parágrafo Metodológico (4 linhas perfeitamente alinhadas no PDF)
                </label>
                <input
                  type="text"
                  value={data.bodyPara2Line1}
                  onChange={(e) => handleFieldChange('bodyPara2Line1', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
                <input
                  type="text"
                  value={data.bodyPara2Line2}
                  onChange={(e) => handleFieldChange('bodyPara2Line2', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
                <input
                  type="text"
                  value={data.bodyPara2Line3}
                  onChange={(e) => handleFieldChange('bodyPara2Line3', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
                <input
                  type="text"
                  value={data.bodyPara2Line4}
                  onChange={(e) => handleFieldChange('bodyPara2Line4', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#D6CEBE] rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* PDF Reader Style Toolbar */}
        <div className="bg-[#1C1917] text-white rounded-t-xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D97706]" />
            <span className="text-xs font-mono-tabular font-medium text-stone-200 truncate max-w-[260px] sm:max-w-md">
              Certificado_Extensao_{data.certNumber}_{data.code}_LUCAS_GONCALVES_SILVEIRA.pdf
            </span>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              · 2 Laudas (Frente e Verso) · A4 Paisagem
            </span>
          </div>

          {/* View Mode Segmented Switch */}
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'both'
                  ? 'bg-[#14532D] text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Ambas as Laudas (1 e 2)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('page1')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'page1'
                  ? 'bg-[#14532D] text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Lauda 1 (Frente)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('page2')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'page2'
                  ? 'bg-[#14532D] text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Lauda 2 (Memorial 45h)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('native-pdf')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                viewMode === 'native-pdf'
                  ? 'bg-[#D97706] text-white'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Leitor PDF Embutido
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.1).toFixed(2)))}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
              title="Reduzir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono-tabular text-stone-300 min-w-[44px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.15, +(z + 0.1).toFixed(2)))}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Certificate Viewer Stage */}
        <div className="bg-[#292524] rounded-b-xl p-4 sm:p-8 overflow-x-auto border border-t-0 border-[#1C1917] shadow-inner no-print">
          {viewMode === 'native-pdf' ? (
            <div className="w-full h-[760px] bg-stone-900 rounded-lg overflow-hidden flex flex-col">
              {isGeneratingPdf || !pdfBlobUrl ? (
                <div className="flex-1 flex items-center justify-center text-stone-300 text-sm">
                  Renderizando documento PDF vetorial de 2 laudas...
                </div>
              ) : (
                <>
                  <div className="bg-stone-800 px-4 py-2 flex items-center justify-between text-xs text-stone-300 border-b border-stone-700">
                    <span className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#D97706]" />
                      Visualização direta do arquivo PDF gerado em memória (100% vetorial e selecionável)
                    </span>
                    <a
                      href={pdfBlobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#FBBF24] hover:underline font-medium"
                    >
                      Abrir PDF em Nova Guia <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <iframe
                    src={pdfBlobUrl}
                    title="Visualizador PDF Oficial"
                    className="w-full flex-1 border-0 bg-white"
                  />
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10 min-w-[920px]">
              {/* =========================================================
                  LAUDA 1 (FRENTE DO CERTIFICADO) - EXACT SVG/DOM REPLICA
              ========================================================= */}
              {(viewMode === 'both' || viewMode === 'page1') && (
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    marginBottom: zoom < 1 ? `${(zoom - 1) * 750}px` : '0px',
                  }}
                  className="transition-transform duration-150"
                >
                  <CertificateFrontSheet
                    data={data}
                    qrCodeUrl={qrCodeUrl}
                    verificationUrl={verificationUrl}
                    isEditing={isEditing}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              )}

              {/* =========================================================
                  LAUDA 2 (VERSO / MEMORIAL DESCRITIVO) - EXACT REPLICA
              ========================================================= */}
              {(viewMode === 'both' || viewMode === 'page2') && (
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    marginBottom: zoom < 1 ? `${(zoom - 1) * 750}px` : '0px',
                  }}
                  className="transition-transform duration-150"
                >
                  <CertificateBackSheet
                    data={data}
                    qrCodeUrl={qrCodeUrl}
                    verificationUrl={verificationUrl}
                    isEditing={isEditing}
                    onFieldChange={handleFieldChange}
                    onAxisChange={handleAxisChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ============================================================================
   EXACT PROPORTIONAL A4 LANDSCAPE SHEETS (297mm x 210mm) FOR SCREEN & PRINT
   Uses an SVG coordinate system of 297 x 210 (1 unit = 1mm) so that every
   border, logo, signature, and line matches the jsPDF output 1:1!
============================================================================ */

interface SheetProps {
  data: CertificateData;
  qrCodeUrl: string;
  verificationUrl: string;
  isEditing?: boolean;
  onFieldChange?: <K extends keyof CertificateData>(key: K, value: CertificateData[K]) => void;
  onAxisChange?: (
    index: number,
    field: keyof CertificateData['axes'][number],
    value: string
  ) => void;
}

export const CertificateFrontSheet: React.FC<SheetProps> = ({
  data,
  qrCodeUrl,
  verificationUrl,
}) => {
  const cleanBase = data.baseUrl.replace(/\/+$/, '');
  const displayShortUrl = `${cleanBase}/`.slice(0, 44);

  return (
    <div
      className="cert-a4-sheet relative bg-[#FFFDFA] shadow-2xl select-text overflow-hidden"
      style={{ width: '1122px', height: '794px' }}
    >
      <svg
        viewBox="0 0 297 210"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect x="0" y="0" width="297" height="210" fill="#FFFDFA" />

        {/* Triple Institutional Borders */}
        <rect
          x="5"
          y="5"
          width="287"
          height="200"
          fill="none"
          stroke="#064E3B"
          strokeWidth="0.8"
        />
        <rect
          x="6.8"
          y="6.8"
          width="283.4"
          height="196.4"
          fill="none"
          stroke="#D97706"
          strokeWidth="0.35"
        />
        <rect
          x="8.2"
          y="8.2"
          width="280.6"
          height="193.6"
          fill="none"
          stroke="#0A1D56"
          strokeWidth="0.5"
        />

        {/* Top Left Logo & Header */}
        <image href="/assets/cert/logo_ems.png" x="14" y="12" width="20" height="20" />
        <text
          x="37"
          y="18"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.0"
        >
          EDITORA MENTE E SAÚDE
        </text>
        <text
          x="37"
          y="22.5"
          fill="#0F172A"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.65"
        >
          CNPJ: 51.372.335/0001-71
        </text>
        <text
          x="37"
          y="26.5"
          fill="#0D9488"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.47"
        >
          Conselho Editorial e Extensão Científica
        </text>

        {/* Top Center Header */}
        <text
          x="148.5"
          y="17"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.0"
        >
          {data.headerProgramLine1}
        </text>
        <text
          x="148.5"
          y="21.2"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.0"
        >
          {data.headerProgramLine2}
        </text>
        <text
          x="148.5"
          y="26.2"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.65"
        >
          {`Certificado Nº ${data.certNumber} · Livro de Extensão nº ${data.bookNumber} · Cód. ${data.code}`}
        </text>

        {/* Top Right Logo & Header */}
        <image href="/assets/cert/logo_cpmda.png" x="263" y="12" width="20" height="20" />
        <text
          x="259"
          y="17.5"
          textAnchor="end"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.0"
        >
          CENTRO PROFISSIONALIZANTE
        </text>
        <text
          x="259"
          y="21.8"
          textAnchor="end"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.0"
        >
          MARIA DALVA DE ARAÚJO
        </text>
        <text
          x="259"
          y="26.2"
          textAnchor="end"
          fill="#0F172A"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.65"
        >
          CNPJ: 51.269.112/0001-83
        </text>

        {/* Header Divider */}
        <line x1="14" y1="35" x2="283" y2="35" stroke="#064E3B" strokeWidth="0.25" />

        {/* Main Title */}
        <text
          x="148.5"
          y="47"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontWeight="bold"
          fontSize={data.mainTitle.length > 42 ? '7.4' : '8.2'}
        >
          {data.mainTitle}
        </text>
        <line x1="95" y1="50" x2="202" y2="50" stroke="#D97706" strokeWidth="0.5" />

        {/* Intro Text */}
        <text
          x="148.5"
          y="58.2"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.55"
        >
          {data.introLine1}
        </text>
        <text
          x="148.5"
          y="62.6"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.55"
        >
          {data.introLine2}
        </text>

        {/* Holder Highlight Box */}
        <rect
          x="24"
          y="67"
          width="249"
          height="21"
          fill="#EDFCF5"
          stroke="#D97706"
          strokeWidth="0.3"
        />
        <text
          x="148.5"
          y="76.8"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontWeight="bold"
          fontSize="7.9"
        >
          {data.holderName}
        </text>
        <text
          x="148.5"
          y="84"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="3.52"
        >
          {data.holderQualification}
        </text>

        {/* Body Paragraph 1 */}
        <text
          x="24.5"
          y="96.2"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara1Line1}
        </text>
        <text
          x="24.5"
          y="100.26"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara1Line2}
        </text>
        <text
          x="24.5"
          y="104.32"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara1Line3}
        </text>

        {/* Body Paragraph 2 */}
        <text
          x="24.5"
          y="113.5"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara2Line1}
        </text>
        <text
          x="24.5"
          y="117.56"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara2Line2}
        </text>
        <text
          x="24.5"
          y="121.62"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara2Line3}
        </text>
        <text
          x="24.5"
          y="125.68"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.48"
        >
          {data.bodyPara2Line4}
        </text>

        {/* City & Date */}
        <text
          x="148.5"
          y="137"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontStyle="italic"
          fontSize="4.58"
        >
          {data.locationAndDate}
        </text>

        {/* Left Signature (Bárbara Lima dos Santos) */}
        <image href="/assets/cert/sig_barbara.png" x="22" y="149" width="64" height="18" />
        <line x1="15" y1="168.5" x2="93" y2="168.5" stroke="#0F172A" strokeWidth="0.35" />
        <text
          x="54"
          y="173"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.75"
        >
          {data.leftSignerName}
        </text>
        <text
          x="54"
          y="176.8"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.4"
        >
          {data.leftSignerRole}
        </text>
        <text
          x="54"
          y="180.5"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.22"
        >
          {data.leftSignerEntity}
        </text>

        {/* Official Gold Seal */}
        <circle
          cx="109"
          cy="165"
          r="11.5"
          fill="#FFF2C7"
          stroke="#D97706"
          strokeWidth="0.6"
        />
        <text
          x="109"
          y="161.2"
          textAnchor="middle"
          fill="#78350F"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontWeight="bold"
          fontSize="2.29"
        >
          SELO OFICIAL
        </text>
        <text
          x="109"
          y="165.2"
          textAnchor="middle"
          fill="#78350F"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontWeight="bold"
          fontSize="2.82"
        >
          FÉ PÚBLICA
        </text>
        <text
          x="109"
          y="169.5"
          textAnchor="middle"
          fill="#78350F"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="1.9"
        >
          {data.code}
        </text>

        {/* QR Code Box */}
        <rect
          x="123.5"
          y="151.5"
          width="25"
          height="25"
          fill="#FFFFFF"
          stroke="#064E3B"
          strokeWidth="0.25"
        />
        {qrCodeUrl && (
          <a href={verificationUrl}>
            <image href={qrCodeUrl} x="124.5" y="152.5" width="23" height="23" />
          </a>
        )}

        {/* Manual Authentication Box */}
        <rect
          x="150.5"
          y="151.5"
          width="50.5"
          height="25"
          fill="#FFFFFF"
          stroke="#064E3B"
          strokeWidth="0.25"
        />
        <text
          x="152.5"
          y="155.5"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.12"
        >
          AUTENTICAÇÃO PÚBLICA MANUAL
        </text>
        <text
          x="152.5"
          y="159.8"
          fill="#0F172A"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.18"
        >
          {`Cód.: ${data.code}`}
        </text>
        <text
          x="152.5"
          y="163.8"
          fill="#92400E"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.18"
        >
          {`Chave: ${data.controlKey}`}
        </text>
        <text
          x="152.5"
          y="167.8"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="1.94"
        >
          Endereço p/ Verificação Online:
        </text>
        <a href={verificationUrl}>
          <text
            x="152.5"
            y="171.5"
            fill="#0F172A"
            fontFamily="Courier New, Courier, monospace"
            fontSize="1.66"
          >
            {displayShortUrl}
          </text>
        </a>

        {/* Right Signature (James Araújo de Santana) */}
        <image href="/assets/cert/sig_james.png" x="210" y="149" width="64" height="18" />
        <line x1="203" y1="168.5" x2="282" y2="168.5" stroke="#0F172A" strokeWidth="0.35" />
        <text
          x="242.5"
          y="173"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.75"
        >
          {data.rightSignerName}
        </text>
        <text
          x="242.5"
          y="176.8"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.4"
        >
          {data.rightSignerRole}
        </text>
        <text
          x="242.5"
          y="180.5"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.12"
        >
          {data.rightSignerEntity}
        </text>

        {/* Bottom Verification Line */}
        <a href={verificationUrl}>
          <text
            x="148.5"
            y="191.5"
            textAnchor="middle"
            fill="#064E3B"
            fontFamily="Courier New, Courier, monospace"
            fontWeight="bold"
            fontSize="2.18"
          >
            {`Verifique via QR Code ou acesse ${cleanBase}/ informando o Código ${data.code} ou Chave ${data.controlKey}`}
          </text>
        </a>
      </svg>
    </div>
  );
};

export const CertificateBackSheet: React.FC<SheetProps> = ({
  data,
  qrCodeUrl,
  verificationUrl,
}) => {
  return (
    <div
      className="cert-a4-sheet relative bg-[#FFFDFA] shadow-2xl select-text overflow-hidden"
      style={{ width: '1122px', height: '794px' }}
    >
      <svg
        viewBox="0 0 297 210"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect x="0" y="0" width="297" height="210" fill="#FFFDFA" />

        {/* Triple Institutional Borders */}
        <rect
          x="5"
          y="5"
          width="287"
          height="200"
          fill="none"
          stroke="#064E3B"
          strokeWidth="0.8"
        />
        <rect
          x="6.8"
          y="6.8"
          width="283.4"
          height="196.4"
          fill="none"
          stroke="#D97706"
          strokeWidth="0.35"
        />
        <rect
          x="8.2"
          y="8.2"
          width="280.6"
          height="193.6"
          fill="none"
          stroke="#0A1D56"
          strokeWidth="0.5"
        />

        {/* Dual Logos Top Left */}
        <image href="/assets/cert/logo_ems.png" x="14" y="12" width="13" height="13" />
        <image href="/assets/cert/logo_cpmda.png" x="29" y="12" width="13" height="13" />

        {/* Header Titles */}
        <text
          x="46"
          y="17.5"
          fill="#064E3B"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontWeight="bold"
          fontSize="4.76"
        >
          {data.backHeaderTitle}
        </text>
        <text
          x="46"
          y="22.5"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="3.0"
        >
          {data.backHeaderSubtitle}
        </text>

        <line x1="14" y1="28" x2="283" y2="28" stroke="#064E3B" strokeWidth="0.5" />

        {/* Box 1: Dados de Identificação do Profissional */}
        <rect
          x="14"
          y="31"
          width="155"
          height="31"
          fill="#FFFFFF"
          stroke="#064E3B"
          strokeWidth="0.25"
        />
        <text
          x="18"
          y="36.2"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.89"
        >
          1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL
        </text>
        <text
          x="18"
          y="42.2"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.92"
        >
          {`Titular Certificado: ${data.holderName}`}
        </text>
        <text
          x="18"
          y="47.4"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.92"
        >
          CPF Registrado: 702.794.941-57
        </text>
        <text
          x="18"
          y="52.6"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.92"
        >
          Qualificação Profissional: Médico
        </text>
        <text
          x="18"
          y="57.8"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.92"
        >
          Instituição de Origem: Centro Universitário Alfredo Nasser (UNIFAN)
        </text>

        {/* Box 2: Enquadramento Curricular e Pontuação */}
        <rect
          x="173"
          y="31"
          width="110"
          height="31"
          fill="#F0F5FF"
          stroke="#0A1D56"
          strokeWidth="0.25"
        />
        <text
          x="177"
          y="36.2"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.89"
        >
          2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO
        </text>
        <text
          x="177"
          y="42.2"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.75"
        >
          {data.editalFramingLine1}
        </text>
        <text
          x="177"
          y="45.4"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.75"
        >
          {data.editalFramingLine2}
        </text>
        <text
          x="177"
          y="48.6"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.75"
        >
          {data.editalFramingLine3}
        </text>
        <text
          x="177"
          y="58.0"
          fill="#064E3B"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.45"
        >
          {data.editalPeriodAndTotal}
        </text>

        {/* Box 3: Matriz Programática (45 Horas) */}
        <rect
          x="14"
          y="65"
          width="269"
          height="7.5"
          fill="#EDFCF5"
          stroke="#064E3B"
          strokeWidth="0.25"
        />
        <text
          x="18"
          y="70.2"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.89"
        >
          {data.matrixSectionTitle}
        </text>

        {data.axes.map((axis, idx) => {
          const rowY = 72.5 + idx * 14;
          return (
            <g key={axis.id}>
              <rect
                x="14"
                y={rowY}
                width="269"
                height="14"
                fill="#FFFFFF"
                stroke="#CCD6E0"
                strokeWidth="0.25"
              />
              <line
                x1="93"
                y1={rowY}
                x2="93"
                y2={rowY + 14}
                stroke="#E3E8F0"
                strokeWidth="0.25"
              />
              <line
                x1="258"
                y1={rowY}
                x2="258"
                y2={rowY + 14}
                stroke="#E3E8F0"
                strokeWidth="0.25"
              />
              <text
                x="17"
                y={rowY + 4.3}
                fill="#0A1D56"
                fontFamily="Helvetica, Arial, sans-serif"
                fontWeight="bold"
                fontSize="2.57"
              >
                {axis.axisTitleLine1}
              </text>
              <text
                x="17"
                y={rowY + 7.3}
                fill="#0A1D56"
                fontFamily="Helvetica, Arial, sans-serif"
                fontWeight="bold"
                fontSize="2.57"
              >
                {axis.axisTitleLine2}
              </text>
              <text
                x="17"
                y={rowY + 11.2}
                fill="#475569"
                fontFamily="Helvetica, Arial, sans-serif"
                fontSize="2.25"
              >
                {axis.axisSubtitle}
              </text>

              <text
                x="96"
                y={rowY + 4.8}
                fill="#0F172A"
                fontFamily="Helvetica, Arial, sans-serif"
                fontSize="2.6"
              >
                {axis.descriptionLine1}
              </text>
              <text
                x="96"
                y={rowY + 8.2}
                fill="#0F172A"
                fontFamily="Helvetica, Arial, sans-serif"
                fontSize="2.6"
              >
                {axis.descriptionLine2}
              </text>

              <text
                x="263.5"
                y={rowY + 8.2}
                fill="#064E3B"
                fontFamily="Courier New, Courier, monospace"
                fontWeight="bold"
                fontSize="2.82"
              >
                {axis.hours}
              </text>
            </g>
          );
        })}

        {/* Box 4: Registro Oficial de Fé Pública */}
        <rect
          x="14"
          y="131.5"
          width="269"
          height="31"
          fill="#FFFAEB"
          stroke="#D97706"
          strokeWidth="0.35"
        />
        <text
          x="18"
          y="136.8"
          fill="#92400E"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.89"
        >
          4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE
        </text>
        <text
          x="18"
          y="142.0"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.75"
        >
          {data.averbacaoLine1}
        </text>
        <text
          x="18"
          y="145.2"
          fill="#0F172A"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="2.75"
        >
          {data.averbacaoLine2}
        </text>
        <text
          x="18"
          y="149.8"
          fill="#064E3B"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.68"
        >
          {`CÓDIGO DE AUTENTICIDADE: ${data.code}   |   CHAVE DE CONTROLE / DÍGITO: ${data.controlKey}`}
        </text>
        <a href={verificationUrl}>
          <text
            x="18"
            y="154.8"
            fill="#0A1D56"
            fontFamily="Courier New, Courier, monospace"
            fontWeight="bold"
            fontSize="2.47"
          >
            {`ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): ${verificationUrl}`}
          </text>
        </a>
        <text
          x="18"
          y="159.8"
          fill="#0F172A"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.47"
        >
          {`HASH SHA-256: ${data.sha256}`}
        </text>

        {/* QR Code Box (Lauda 2) */}
        <rect
          x="253.5"
          y="134"
          width="26"
          height="26"
          fill="#FFFFFF"
          stroke="#064E3B"
          strokeWidth="0.25"
        />
        {qrCodeUrl && (
          <a href={verificationUrl}>
            <image href={qrCodeUrl} x="254.5" y="135" width="24" height="24" />
          </a>
        )}

        {/* Back Footer Signatures & Legal Seal */}
        <image href="/assets/cert/sig_barbara.png" x="26" y="164" width="54" height="15" />
        <line x1="18" y1="180" x2="92" y2="180" stroke="#0F172A" strokeWidth="0.35" />
        <text
          x="55"
          y="184.2"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.68"
        >
          {data.leftSignerName}
        </text>
        <text
          x="55"
          y="188.0"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.18"
        >
          {data.leftSignerEntity}
        </text>

        {/* Center Footer */}
        <text
          x="148.5"
          y="179.5"
          textAnchor="middle"
          fill="#0F172A"
          fontFamily="Times New Roman, Times, Georgia, serif"
          fontStyle="italic"
          fontSize="3.7"
        >
          {data.locationAndDate}
        </text>
        <text
          x="148.5"
          y="184.2"
          textAnchor="middle"
          fill="#475569"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.4"
        >
          Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional
        </text>
        <text
          x="148.5"
          y="188.0"
          textAnchor="middle"
          fill="#064E3B"
          fontFamily="Courier New, Courier, monospace"
          fontSize="2.18"
        >
          {`Registro: ${data.code} · Chave: ${data.controlKey}`}
        </text>

        {/* Right Signature */}
        <image href="/assets/cert/sig_james.png" x="215" y="164" width="54" height="15" />
        <line x1="204" y1="180" x2="279" y2="180" stroke="#0F172A" strokeWidth="0.35" />
        <text
          x="241.5"
          y="184.2"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Helvetica, Arial, sans-serif"
          fontWeight="bold"
          fontSize="2.68"
        >
          {data.rightSignerName}
        </text>
        <text
          x="241.5"
          y="188.0"
          textAnchor="middle"
          fill="#0A1D56"
          fontFamily="Courier New, Courier, monospace"
          fontWeight="bold"
          fontSize="2.18"
        >
          Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)
        </text>
      </svg>
    </div>
  );
};

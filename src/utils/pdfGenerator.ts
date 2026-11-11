import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { CertificateData } from '../types/certificate';

interface LoadedAssets {
  logoEms: string;
  logoCpmda: string;
  sigBarbara: string;
  sigJames: string;
}

let cachedAssets: LoadedAssets | null = null;

async function fileToDataUrl(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function loadCertificateAssets(): Promise<LoadedAssets> {
  if (cachedAssets) return cachedAssets;
  const [logoEms, logoCpmda, sigBarbara, sigJames] = await Promise.all([
    fileToDataUrl('/assets/cert/logo_ems.png'),
    fileToDataUrl('/assets/cert/logo_cpmda.png'),
    fileToDataUrl('/assets/cert/sig_barbara.png'),
    fileToDataUrl('/assets/cert/sig_james.png'),
  ]);
  cachedAssets = { logoEms, logoCpmda, sigBarbara, sigJames };
  return cachedAssets;
}

export async function generateQrCodeDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 480,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });
}

function drawCertificateBordersAndBackground(doc: jsPDF) {
  // Paper background (warm archival off-white rgb(255, 253, 250))
  doc.setFillColor(255, 253, 250);
  doc.rect(0, 0, 297, 210, 'F');

  // Outer Green Border
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.8);
  doc.rect(5, 5, 287, 200, 'S');

  // Middle Gold Border
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.35);
  doc.rect(6.8, 6.8, 283.4, 196.4, 'S');

  // Inner Navy Border
  doc.setDrawColor(10, 29, 86);
  doc.setLineWidth(0.5);
  doc.rect(8.2, 8.2, 280.6, 193.6, 'S');
}

export interface PdfGenerationOptions {
  includeEditableFormFields?: boolean;
}

export async function buildCertificatePdfDocument(
  data: CertificateData,
  options: PdfGenerationOptions = {}
): Promise<jsPDF> {
  const assets = await loadCertificateAssets();
  const cleanBase = data.baseUrl.replace(/\/+$/, '');
  const verificationUrl = `${cleanBase}/?codigo=${encodeURIComponent(data.code)}#validador`;
  const qrDataUrl = await generateQrCodeDataUrl(verificationUrl);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  doc.setProperties({
    title: `Certificado Oficial Nº ${data.certNumber} - ${data.code} - ${data.holderName}`,
    subject: data.activityTitle,
    author: 'Editora Mente e Saúde & Centro Profissionalizante Maria Dalva de Araújo',
    keywords: `Certificado, Item 09, ${data.code}, ${data.controlKey}, ${data.holderName}, Estágio em Instituição de Ensino`,
    creator: 'Sistema Oficial de Certificação Interinstitucional — EMS & CPMDA',
  });

  // =========================================================================
  // LAUDA 1 — FRENTE DO CERTIFICADO
  // =========================================================================
  drawCertificateBordersAndBackground(doc);

  // Left Logo & Header
  doc.addImage(assets.logoEms, 'PNG', 14, 12, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text('EDITORA MENTE E SAÚDE', 37, 18);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.372.335/0001-71', 37, 22.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(13, 148, 136);
  doc.text('Conselho Editorial e Extensão Científica', 37, 26.5);

  // Center Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 78, 59);
  doc.text(data.headerProgramLine1, 148.5, 17, { align: 'center' });
  doc.text(data.headerProgramLine2, 148.5, 21.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(10, 29, 86);
  doc.text(
    `Certificado Nº ${data.certNumber} · Livro de Extensão nº ${data.bookNumber} · Cód. ${data.code}`,
    148.5,
    26.2,
    { align: 'center' }
  );

  // Right Logo & Header
  doc.addImage(assets.logoCpmda, 'PNG', 263, 12, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 29, 86);
  doc.text('CENTRO PROFISSIONALIZANTE', 259, 17.5, { align: 'right' });
  doc.text('MARIA DALVA DE ARAÚJO', 259, 21.8, { align: 'right' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CNPJ: 51.269.112/0001-83', 259, 26.2, { align: 'right' });

  // Header horizontal divider
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.line(14, 35, 283, 35);

  // Main Certificate Title
  doc.setFont('times', 'bold');
  const titleFontSize = data.mainTitle.length > 42 ? 21 : 23.5;
  doc.setFontSize(titleFontSize);
  doc.setTextColor(6, 78, 59);
  doc.text(data.mainTitle, 148.5, 47, { align: 'center' });

  // Gold Underline under Main Title
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.5);
  doc.line(95, 50, 202, 50);

  // Opening Institutional Statement
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.2);
  doc.setTextColor(15, 23, 42);
  doc.text(data.introLine1, 148.5, 58.2, { align: 'center' });
  doc.text(data.introLine2, 148.5, 62.6, { align: 'center' });

  // Holder Highlight Box
  doc.setFillColor(237, 252, 245);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(24, 67, 249, 21, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(22.5);
  doc.setTextColor(10, 29, 86);
  doc.text(data.holderName, 148.5, 76.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(data.holderQualification, 148.5, 84, { align: 'center' });

  // Body Paragraph 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(data.bodyPara1Line1, 24.5, 96.2);
  doc.text(data.bodyPara1Line2, 24.5, 100.26);
  doc.text(data.bodyPara1Line3, 24.5, 104.32);

  // Body Paragraph 2
  doc.text(data.bodyPara2Line1, 24.5, 113.5);
  doc.text(data.bodyPara2Line2, 24.5, 117.56);
  doc.text(data.bodyPara2Line3, 24.5, 121.62);
  doc.text(data.bodyPara2Line4, 24.5, 125.68);

  // Location & Date
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(data.locationAndDate, 148.5, 137, { align: 'center' });

  // Left Signature (Bárbara Lima dos Santos)
  doc.addImage(assets.sigBarbara, 'PNG', 22, 149, 64, 18);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(15, 168.5, 93, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(6, 78, 59);
  doc.text(data.leftSignerName, 54, 173, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.leftSignerRole, 54, 176.8, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.3);
  doc.setTextColor(6, 78, 59);
  doc.text(data.leftSignerEntity, 54, 180.5, { align: 'center' });

  // Official Gold Seal (Selo Oficial Fé Pública)
  doc.setFillColor(255, 242, 199);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.6);
  doc.circle(109, 165, 11.5, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 53, 15);
  doc.text('SELO OFICIAL', 109, 161.2, { align: 'center' });

  doc.setFontSize(8);
  doc.text('FÉ PÚBLICA', 109, 165.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(5.4);
  doc.text(data.code, 109, 169.5, { align: 'center' });

  // QR Code Box (Lauda 1)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(123.5, 151.5, 25, 25, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 124.5, 152.5, 23, 23);
  doc.link(123.5, 151.5, 25, 25, { url: verificationUrl });

  // Manual Public Authentication Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(150.5, 151.5, 50.5, 25, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(6, 78, 59);
  doc.text('AUTENTICAÇÃO PÚBLICA MANUAL', 152.5, 155.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(15, 23, 42);
  doc.text(`Cód.: ${data.code}`, 152.5, 159.8);

  doc.setTextColor(146, 64, 14);
  doc.text(`Chave: ${data.controlKey}`, 152.5, 163.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(10, 29, 86);
  doc.text('Endereço p/ Verificação Online:', 152.5, 167.8);

  doc.setFont('courier', 'normal');
  doc.setFontSize(4.7);
  doc.setTextColor(15, 23, 42);
  const displayShortUrl = `${cleanBase}/`.slice(0, 44);
  doc.text(displayShortUrl, 152.5, 171.5);
  doc.link(150.5, 151.5, 50.5, 25, { url: verificationUrl });

  // Right Signature (James Araújo de Santana)
  doc.addImage(assets.sigJames, 'PNG', 210, 149, 64, 18);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(203, 168.5, 282, 168.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(10, 29, 86);
  doc.text(data.rightSignerName, 242.5, 173, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.rightSignerRole, 242.5, 176.8, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(10, 29, 86);
  doc.text(data.rightSignerEntity, 242.5, 180.5, { align: 'center' });

  // Bottom Security Line
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `Verifique via QR Code ou acesse ${cleanBase}/ informando o Código ${data.code} ou Chave ${data.controlKey}`,
    148.5,
    191.5,
    { align: 'center' }
  );
  doc.link(35, 188, 227, 5, { url: verificationUrl });

  // =========================================================================
  // LAUDA 2 — VERSO OFICIAL (MEMORIAL DESCRITIVO E REGISTRO ACADÊMICO)
  // =========================================================================
  doc.addPage('a4', 'landscape');
  drawCertificateBordersAndBackground(doc);

  // Top Left Dual Logos
  doc.addImage(assets.logoEms, 'PNG', 14, 12, 13, 13);
  doc.addImage(assets.logoCpmda, 'PNG', 29, 12, 13, 13);

  // Back Header Titles
  doc.setFont('times', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(6, 78, 59);
  doc.text(data.backHeaderTitle, 46, 17.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.backHeaderSubtitle, 46, 22.5);

  // Header Horizontal Line
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.5);
  doc.line(14, 28, 283, 28);

  // Box 1: Dados de Identificação do Profissional
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(14, 31, 155, 31, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text('1. DADOS DE IDENTIFICAÇÃO DO PROFISSIONAL', 18, 36.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.3);
  doc.setTextColor(15, 23, 42);
  doc.text(`Titular Certificado: ${data.holderName}`, 18, 42.2);
  doc.text('CPF Registrado: 702.794.941-57', 18, 47.4);
  doc.text('Qualificação Profissional: Médico', 18, 52.6);
  doc.text('Instituição de Origem: Centro Universitário Alfredo Nasser (UNIFAN)', 18, 57.8);

  // Box 2: Enquadramento Curricular e Pontuação
  doc.setFillColor(240, 245, 255);
  doc.setDrawColor(10, 29, 86);
  doc.setLineWidth(0.25);
  doc.rect(173, 31, 110, 31, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(10, 29, 86);
  doc.text('2. ENQUADRAMENTO CURRICULAR E PONTUAÇÃO', 177, 36.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.editalFramingLine1, 177, 42.2);
  doc.text(data.editalFramingLine2, 177, 45.4);
  doc.text(data.editalFramingLine3, 177, 48.6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.1);
  doc.setTextColor(6, 78, 59);
  doc.text(data.editalPeriodAndTotal, 177, 58.0);

  // Box 3: Matriz Programática e Metodologia Pedagógica
  doc.setFillColor(237, 252, 245);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(14, 65, 269, 7.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(6, 78, 59);
  doc.text(data.matrixSectionTitle, 18, 70.2);

  data.axes.forEach((axis, idx) => {
    const rowY = 72.5 + idx * 14;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(204, 214, 224);
    doc.setLineWidth(0.25);
    doc.rect(14, rowY, 269, 14, 'FD');

    // Vertical column dividers
    doc.setDrawColor(227, 232, 240);
    doc.line(93, rowY, 93, rowY + 14);
    doc.line(258, rowY, 258, rowY + 14);

    // Axis Title & Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.3);
    doc.setTextColor(10, 29, 86);
    doc.text(axis.axisTitleLine1, 17, rowY + 4.3);
    doc.text(axis.axisTitleLine2, 17, rowY + 7.3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(71, 85, 105);
    doc.text(axis.axisSubtitle, 17, rowY + 11.2);

    // Analytical Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(15, 23, 42);
    doc.text(axis.descriptionLine1, 96, rowY + 4.8);
    doc.text(axis.descriptionLine2, 96, rowY + 8.2);

    // Hours
    doc.setFont('courier', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(6, 78, 59);
    doc.text(axis.hours, 263.5, rowY + 8.2);
  });

  // Box 4: Registro Oficial de Fé Pública
  doc.setFillColor(255, 250, 235);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.35);
  doc.rect(14, 131.5, 269, 31, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(146, 64, 14);
  doc.text('4. REGISTRO OFICIAL DE FÉ PÚBLICA, ENDEREÇO WEB E CHAVES DE VERIFICAÇÃO DE AUTENTICIDADE', 18, 136.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(15, 23, 42);
  doc.text(data.averbacaoLine1, 18, 142.0);
  doc.text(data.averbacaoLine2, 18, 145.2);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `CÓDIGO DE AUTENTICIDADE: ${data.code}   |   CHAVE DE CONTROLE / DÍGITO: ${data.controlKey}`,
    18,
    149.8
  );

  doc.setFontSize(7);
  doc.setTextColor(10, 29, 86);
  doc.text(`ENDEREÇO PARA VERIFICAÇÃO MANUAL (SEM QR CODE): ${verificationUrl}`, 18, 154.8);
  doc.link(18, 151.5, 230, 4.5, { url: verificationUrl });

  doc.setTextColor(15, 23, 42);
  doc.text(`HASH SHA-256: ${data.sha256}`, 18, 159.8);

  // QR Code Box (Lauda 2)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.25);
  doc.rect(253.5, 134, 26, 26, 'FD');
  doc.addImage(qrDataUrl, 'PNG', 254.5, 135, 24, 24);
  doc.link(253.5, 134, 26, 26, { url: verificationUrl });

  // Back Footer Signatures & Legal Seal
  doc.addImage(assets.sigBarbara, 'PNG', 26, 164, 54, 15);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(18, 180, 92, 180);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(6, 78, 59);
  doc.text(data.leftSignerName, 55, 184.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.text(data.leftSignerEntity, 55, 188.0, { align: 'center' });

  // Center Footer
  doc.setFont('times', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.locationAndDate, 148.5, 179.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text('Documento Oficial de 2 Laudas (Frente e Verso) · Válido em Todo o Território Nacional', 148.5, 184.2, {
    align: 'center',
  });

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 78, 59);
  doc.text(`Registro: ${data.code} · Chave: ${data.controlKey}`, 148.5, 188.0, { align: 'center' });

  // Right Signature
  doc.addImage(assets.sigJames, 'PNG', 215, 164, 54, 15);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.35);
  doc.line(204, 180, 279, 180);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.6);
  doc.setTextColor(10, 29, 86);
  doc.text(data.rightSignerName, 241.5, 184.2, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(6.2);
  doc.text('Centro Maria Dalva de Araújo (CNPJ: 51.269.112/0001-83)', 241.5, 188.0, { align: 'center' });

  return doc;
}

export async function downloadCertificatePdf(data: CertificateData): Promise<void> {
  const doc = await buildCertificatePdfDocument(data);
  const safeName = data.holderName.replace(/\s+/g, '_').toUpperCase();
  const filename = `Certificado_Extensao_${data.certNumber}_${data.code}_${safeName}.pdf`;
  doc.save(filename);
}

export async function createCertificatePdfBlobUrl(data: CertificateData): Promise<string> {
  const doc = await buildCertificatePdfDocument(data);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}

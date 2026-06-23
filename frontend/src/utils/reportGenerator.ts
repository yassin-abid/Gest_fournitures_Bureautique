import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ReportConfig {
  title: string;
  filename: string;
  columns: string[];
  data: any[][];
}

/**
 * Generate PDF Report
 */
export const generatePDF = (config: ReportConfig): string => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(config.title, 14, 22);
  
  // Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 30);

  // Table
  autoTable(doc, {
    startY: 36,
    head: [config.columns],
    body: config.data,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${config.filename}.pdf`);
  return 'pdf';
};

/**
 * Generate Excel Report
 */
export const generateExcel = (config: ReportConfig): string => {
  const worksheetData = [config.columns, ...config.data];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapport');
  XLSX.writeFile(workbook, `${config.filename}.xlsx`);
  
  return 'excel';
};

/**
 * Generate CSV Report
 */
export const generateCSV = (config: ReportConfig): string => {
  const escapeCsv = (str: string | number) => {
    if (str === null || str === undefined) return '';
    const text = String(str);
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const rows = [config.columns, ...config.data];
  const csvContent = rows.map(row => row.map(escapeCsv).join(',')).join('\n');
  
  const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${config.filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return 'csv';
};

/**
 * Main export function wrapper
 */
export const exportReport = (format: 'pdf' | 'excel' | 'csv', config: ReportConfig) => {
  switch (format) {
    case 'pdf':
      return generatePDF(config);
    case 'excel':
      return generateExcel(config);
    case 'csv':
      return generateCSV(config);
    default:
      throw new Error('Format non supporté');
  }
};

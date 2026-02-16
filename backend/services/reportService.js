import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const streamPdf = (res, title, rows) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
  doc.pipe(res);
  doc.fontSize(18).text(title);
  doc.moveDown();
  rows.forEach((row) => doc.fontSize(11).text(JSON.stringify(row)));
  doc.end();
};

export const streamExcel = async (res, title, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte');
  if (rows[0]) {
    sheet.columns = Object.keys(rows[0]).map((key) => ({ header: key, key }));
  }
  rows.forEach((row) => sheet.addRow(row));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${title}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
};

import jsPDF from 'jspdf';

export const generateReceipt = (payment, user) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  // Header
  doc.setFillColor(31, 41, 55);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('GLOBALBANK', 105, 25, { align: 'center' });
  
  // Receipt Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text('PAYMENT RECEIPT', 105, 55, { align: 'center' });
  
  // Receipt Info
  doc.setFontSize(10);
  doc.text(`Receipt ID: ${payment.id}`, 20, 75);
  doc.text(`Date: ${date} at ${time}`, 20, 85);
  doc.text(`Status: ${payment.status?.toUpperCase() || 'PENDING'}`, 20, 95);
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 105, 190, 105);
  
  // Payment Details
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('PAYMENT DETAILS', 20, 120);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  doc.text(`Amount: ${payment.amount} ${payment.currency}`, 20, 135);
  doc.text(`Provider: ${payment.provider}`, 20, 145);
  doc.text(`Reference: ${payment.reference || 'International payment'}`, 20, 155);
  
  // Beneficiary Details
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('BENEFICIARY DETAILS', 20, 175);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  
  doc.text(`Name: ${payment.beneficiaryName}`, 20, 190);
  doc.text(`Account: ${payment.beneficiaryAccount}`, 20, 200);
  doc.text(`SWIFT Code: ${payment.swiftCode}`, 20, 210);
  
  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 230, 190, 230);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a system-generated receipt. For inquiries, contact support@globalbank.com', 105, 250, { align: 'center' });
  
  // Save PDF
  doc.save(`receipt_${payment.id}.pdf`);
};
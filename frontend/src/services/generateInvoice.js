import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // Header Background
  doc.setFillColor(230, 57, 70);
  doc.rect(0, 0, 210, 40, 'F');

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('VEHICLEPARTS', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Vehicle Parts & Service Center', 14, 28);
  doc.text('Kathmandu, Nepal', 14, 34);

  // Invoice Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE #${order.id}`, 140, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 28);
  doc.text(`Type: ${order.isCreditSale ? 'Credit Sale' : 'Cash Sale'}`, 140, 34);

  // Customer Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 55);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${order.customer?.fullName || 'N/A'}`, 14, 63);
  doc.text(`Email: ${order.customer?.email || 'N/A'}`, 14, 69);
  doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, 14, 75);
  doc.text(`Vehicle: ${order.customer?.vehicleModel || 'N/A'}`, 14, 81);

  // Divider Line
  doc.setDrawColor(230, 57, 70);
  doc.setLineWidth(0.5);
  doc.line(14, 88, 196, 88);

  // Items Table
  const tableData = order.orderItems?.map(item => [
    item.product?.name || 'N/A',
    item.quantity,
    `Rs. ${item.unitPrice}`,
    `Rs. ${item.totalPrice}`,
  ]) || [];

  autoTable(doc, {
    startY: 93,
    head: [['Product', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    headStyles: {
      fillColor: [230, 57, 70],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      fontSize: 10,
    },
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Subtotal:`, 130, finalY);
  doc.text(`Rs. ${order.totalAmount}`, 175, finalY, { align: 'right' });

  if (order.discountAmount > 0) {
    doc.setTextColor(34, 197, 94);
    doc.text(`Loyalty Discount (10%):`, 130, finalY + 7);
    doc.text(`- Rs. ${order.discountAmount}`, 175, finalY + 7, { align: 'right' });
  }

  // Total Box
  doc.setFillColor(230, 57, 70);
  doc.rect(120, finalY + 12, 76, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 124, finalY + 20);
  doc.text(`Rs. ${order.finalAmount}`, 175, finalY + 20, { align: 'right' });

  // Payment Status
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const payStatus = order.isCreditSale
    ? (order.isCreditPaid ? 'PAID' : 'UNPAID')
    : 'PAID';
  const statusColor = payStatus === 'PAID' ? [34, 197, 94] : [230, 57, 70];
  doc.setTextColor(...statusColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Status: ${payStatus}`, 14, finalY + 20);

  // Footer
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing VehicleParts!', 14, 280);
  doc.text('For queries contact: info@vehicleparts.com', 14, 285);

  // Save PDF
  doc.save(`Invoice_Order_${order.id}.pdf`);
};
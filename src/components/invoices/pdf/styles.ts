export const pdfStyles = `
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #334155;
    line-height: 1.5;
    padding: 40px;
    max-width: 1000px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
    padding-bottom: 30px;
    border-bottom: 1px solid #e2e8f0;
  }
  .logo {
    height: 120px;  /* Increased from 40px to 120px (3x) */
    margin-bottom: 20px;
  }
  .company-info {
    margin-bottom: 20px;
  }
  .company-info p {
    margin: 0;
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
    text-align: left;
  }
  .invoice-info {
    text-align: right;
    font-size: 14px;
  }
  .invoice-info p {
    margin: 4px 0;
    color: #334155;
  }
  .invoice-title {
    font-size: 42px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 40px;
    letter-spacing: -1px;
  }
  .client-info {
    margin-bottom: 40px;
    font-size: 14px;
  }
  .client-info h3 {
    color: #64748b;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 12px 0;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 40px 0;
    font-size: 14px;
  }
  th {
    text-align: left;
    padding: 12px 0;
    border-bottom: 2px solid #e2e8f0;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  td {
    padding: 16px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .amount-cell {
    text-align: right;
    font-family: 'SF Mono', 'Monaco', monospace;
  }
  .totals {
    margin-left: auto;
    width: 300px;
    font-size: 14px;
  }
  .totals table {
    margin: 0;
  }
  .totals table td {
    padding: 8px 0;
  }
  .totals table tr:last-child td {
    border-top: 2px solid #e2e8f0;
    border-bottom: none;
    padding-top: 16px;
    font-weight: 600;
    color: #0f172a;
  }
  .notes {
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
    font-size: 14px;
    color: #64748b;
  }
  .notes h3, .payment-terms h3 {
    color: #0f172a;
    font-size: 14px;
    margin: 0 0 8px 0;
  }
  @media print {
    body { padding: 20px; }
    .invoice-title { margin-bottom: 30px; }
  }
`;
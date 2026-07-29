type DocumentTemplateInput = {
  type: 'quotation' | 'itinerary' | 'invoice' | 'voucher';
  title: string;
  fileName: string;
  organizationId?: string;
  branchId?: string;
  sections: Array<{
    heading: string;
    rows: Array<Record<string, unknown>>;
  }>;
  totals?: Record<string, unknown>;
};

export function buildDocumentTemplate(input: DocumentTemplateInput) {
  const generatedAt = new Date().toISOString();
  const html = [
    '<!doctype html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(input.title)}</title>`,
    '<style>',
    'body{font-family:Arial,sans-serif;color:#17201b;margin:32px;line-height:1.45}',
    'header{border-bottom:2px solid #1f8a70;margin-bottom:24px;padding-bottom:16px}',
    'h1{font-size:24px;margin:0 0 8px} h2{font-size:16px;margin:24px 0 8px}',
    'table{border-collapse:collapse;width:100%;margin-top:8px}',
    'th,td{border:1px solid #d8e2dc;padding:8px;text-align:left;font-size:12px}',
    'th{background:#eef7f3}.totals{margin-top:24px;max-width:360px;margin-left:auto}',
    '</style>',
    '</head>',
    '<body>',
    `<header><h1>${escapeHtml(input.title)}</h1><div>Generated ${generatedAt}</div></header>`,
    ...input.sections.map(renderSection),
    input.totals ? renderTotals(input.totals) : '',
    '</body>',
    '</html>',
  ].join('');

  return {
    type: input.type,
    fileName: input.fileName,
    mimeType: 'text/html',
    renderStatus: 'template_ready',
    storageKey: [
      input.organizationId ?? 'organization',
      input.branchId ?? 'branch',
      'generated-documents',
      input.fileName,
    ].join('/'),
    html,
    generatedAt,
  };
}

function renderSection(section: DocumentTemplateInput['sections'][number]) {
  const keys = Array.from(
    section.rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>()),
  );

  if (keys.length === 0)
    return `<section><h2>${escapeHtml(section.heading)}</h2></section>`;

  return [
    `<section><h2>${escapeHtml(section.heading)}</h2><table><thead><tr>`,
    ...keys.map((key) => `<th>${escapeHtml(labelize(key))}</th>`),
    '</tr></thead><tbody>',
    ...section.rows.map(
      (row) =>
        `<tr>${keys.map((key) => `<td>${escapeHtml(formatValue(row[key]))}</td>`).join('')}</tr>`,
    ),
    '</tbody></table></section>',
  ].join('');
}

function renderTotals(totals: Record<string, unknown>) {
  return renderSection({
    heading: 'Totals',
    rows: Object.entries(totals).map(([label, value]) => ({ label, value })),
  }).replace('<section>', '<section class="totals">');
}

function labelize(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

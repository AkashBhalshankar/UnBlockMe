/**
 * Headless 1080x1920 9:16 Archival Keepsake Canvas Renderer
 * Generates high-resolution downloadable PNG truce receipts for mobile camera roll and Instagram Stories.
 */

export function renderKeepsakeToCanvas(canvas, data) {
  const W = 1080;
  const H = 1920;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const recipient = data.recipient || 'Alex';
  const sender = data.sender || 'Jordan';
  const remedy = data.tokens?.remedy || 'dinner at your favorite spot, my bill, no excuses';
  const tokenRef = data.tokenRef || 'UBM-7K9X2P1';
  const dateStr = new Date(data.timestamp || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Layer 1: Textured Parchment Base (#F9F6F0)
  ctx.fillStyle = '#F9F6F0';
  ctx.fillRect(0, 0, W, H);

  // Procedural Paper Grain & Stippling
  ctx.fillStyle = 'rgba(148, 69, 44, 0.025)';
  for (let i = 0; i < 5000; i++) {
    const rx = Math.random() * W;
    const ry = Math.random() * H;
    const rw = Math.random() * 2.5 + 1;
    ctx.fillRect(rx, ry, rw, rw);
  }

  // Faint organic warm gradient tint
  const gradient = ctx.createRadialGradient(W / 2, 400, 100, W / 2, 960, 900);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(217, 195, 165, 0.15)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Layer 2: Perforated Ticket Dashed Borders (Inset 44px)
  ctx.save();
  ctx.strokeStyle = '#D9C3A5';
  ctx.lineWidth = 4;
  ctx.setLineDash([20, 14]);
  ctx.strokeRect(44, 44, W - 88, H - 88);
  ctx.restore();

  // Corner punch-notch accents
  ctx.save();
  ctx.fillStyle = '#F9F6F0';
  ctx.strokeStyle = '#D9C3A5';
  ctx.lineWidth = 3;
  const corners = [
    [44, 44],
    [W - 44, 44],
    [44, H - 44],
    [W - 44, H - 44]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  // Layer 3: Option 16 Brush-Ink Padlock Logo Motif
  ctx.save();
  const logoX = W / 2;
  const logoY = 180;

  // Open shackle arch
  ctx.strokeStyle = '#94452c';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Open arch pivot
  ctx.arc(logoX - 18, logoY - 32, 28, Math.PI * 1.1, Math.PI * 1.95, false);
  ctx.stroke();

  // Outer circular body
  ctx.fillStyle = '#f0eee8';
  ctx.beginPath();
  ctx.arc(logoX, logoY, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(logoX, logoY, 36, 0, Math.PI * 2);
  ctx.fill();

  // Keyhole
  ctx.fillStyle = '#556348';
  ctx.beginPath();
  ctx.arc(logoX, logoY - 4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(logoX - 4, logoY - 2, 8, 16);
  ctx.restore();

  // Layer 4: Header Typography
  ctx.save();
  ctx.fillStyle = '#88726c';
  ctx.font = '600 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('UNBLOCKME • RECONCILIATION FOLIO', W / 2, 290);

  ctx.fillStyle = '#1c1c18';
  ctx.font = '500 56px "Newsreader", Georgia, serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('Official Digital Truce Receipt', W / 2, 365);

  // Terracotta Dividing Line
  ctx.strokeStyle = '#94452c';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, 400);
  ctx.lineTo(W / 2 + 160, 400);
  ctx.stroke();
  ctx.restore();

  // Layer 5: Metadata Ledger Card Box
  ctx.save();
  const boxX = 100;
  const boxY = 460;
  const boxW = W - 200;
  const boxH = 260;

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(36, 32, 30, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 16);
  ctx.fill();

  // Border highlight
  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#E8E2D5';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Ledger fields
  ctx.font = '600 19px "JetBrains Mono", monospace';
  ctx.textAlign = 'left';

  ctx.fillStyle = '#88726c';
  ctx.fillText('PARTIES INVOLVED:', boxX + 44, boxY + 68);
  ctx.fillText('TOKEN REFERENCE:', boxX + 44, boxY + 128);
  ctx.fillText('MUTUAL STATUS:', boxX + 44, boxY + 188);
  ctx.fillText('RATIFIED DATE:', boxX + 44, boxY + 248);

  ctx.fillStyle = '#1c1c18';
  ctx.font = '600 24px "Work Sans", sans-serif';
  ctx.fillText(`${sender}  ➔  ${recipient}`, boxX + 340, boxY + 68);

  ctx.fillStyle = '#94452c';
  ctx.font = '600 23px "JetBrains Mono", monospace';
  ctx.fillText(tokenRef, boxX + 340, boxY + 128);

  ctx.fillStyle = '#556348';
  ctx.font = '600 23px "Work Sans", sans-serif';
  ctx.fillText('Mutual Consensus Sealed', boxX + 340, boxY + 188);

  ctx.fillStyle = '#55433e';
  ctx.font = '500 22px "Work Sans", sans-serif';
  ctx.fillText(dateStr, boxX + 340, boxY + 248);
  ctx.restore();

  // Layer 6: Apology Body & Truce Terms
  ctx.save();
  ctx.fillStyle = '#1c1c18';
  ctx.font = 'italic 400 38px "Newsreader", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('“I let pride get ahead of what actually matters between us.', W / 2, 800);
  ctx.fillText('I am deeply sorry for how I shut down. The air is cleared.”', W / 2, 860);

  // Covenant Box
  const covY = 940;
  const covH = 340;
  ctx.fillStyle = '#EBE8E2';
  ctx.beginPath();
  ctx.roundRect(110, covY, W - 220, covH, 16);
  ctx.fill();

  ctx.fillStyle = '#88726c';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('MUTUALLY RATIFIED CONCORDAT & TERMS:', W / 2, covY + 54);

  ctx.fillStyle = '#94452c';
  ctx.font = '600 34px "Newsreader", Georgia, serif';
  ctx.fillText(`“${remedy}”`, W / 2, covY + 120);

  ctx.fillStyle = '#31312d';
  ctx.font = '400 24px "Work Sans", sans-serif';
  ctx.fillText('• Mutual unblocking on all direct platforms and message channels.', W / 2, covY + 180);
  ctx.fillText('• Unconditional pardon for prior misunderstandings.', W / 2, covY + 224);
  ctx.fillText('• Zero lingering awkwardness • Free to reconnect with ease.', W / 2, covY + 268);
  ctx.fillText('Archived via Verified Zero-Server Client Payload', W / 2, covY + 310);
  ctx.restore();

  // Layer 7: Rotated Terracotta Wax Seal Badge (#94452c)
  ctx.save();
  ctx.translate(W / 2, 1440);
  ctx.rotate((-10 * Math.PI) / 180);

  ctx.fillStyle = '#94452c';
  ctx.shadowColor = 'rgba(148, 69, 44, 0.4)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 14;
  ctx.beginPath();
  ctx.arc(0, 0, 115, 0, Math.PI * 2);
  ctx.fill();

  // Inner decorative ring
  ctx.strokeStyle = '#ffdbd0';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.arc(0, 0, 98, 0, Math.PI * 2);
  ctx.stroke();

  // Stamped Text
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 17px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TRUCE DECLARED', 0, -26);
  ctx.font = '700 15px "JetBrains Mono", monospace';
  ctx.fillText('STATUS: UNBLOCKED', 0, 8);
  ctx.fillText('& SETTLED', 0, 34);

  // Small star icons
  ctx.font = '16px serif';
  ctx.fillText('✦', 0, -52);
  ctx.fillText('✦', 0, 60);
  ctx.restore();

  // Layer 8: Authentic Barcode & Verification Hash
  ctx.save();
  ctx.fillStyle = '#1c1c18';
  const startX = 260;
  const barY = 1650;
  const barH = 75;
  const pattern = [3, 1, 4, 2, 5, 2, 1, 3, 6, 2, 1, 4, 3, 1, 5, 2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 2, 4, 1, 3, 2];
  let currX = startX;
  for (let i = 0; i < pattern.length; i++) {
    ctx.fillRect(currX, barY, pattern[i] * 3, barH);
    currX += pattern[i] * 3 + 7;
  }

  ctx.font = '500 20px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#88726c';
  ctx.fillText(`HASH: 9B4F-${tokenRef}-D72A-MUTUAL-CONSENSUS`, W / 2, 1780);

  ctx.font = '400 16px "Work Sans", sans-serif';
  ctx.fillStyle = '#88726c';
  ctx.fillText('Zero-Server Client-Side Cryptographic Peace Archival Folio', W / 2, 1830);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export function downloadKeepsakeReceipt(data) {
  const offscreen = document.createElement('canvas');
  const dataUrl = renderKeepsakeToCanvas(offscreen, data);
  const a = document.createElement('a');
  a.download = `unblockme-keepsake-${data.tokenRef || 'UBM'}.png`;
  a.href = dataUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

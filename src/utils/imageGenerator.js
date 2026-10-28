import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

/**
 * Generates a downloadable HD Motivational Poster image (1080x1350) using HTML5 Canvas
 */
export async function generateMotivationalPoster(quoteObj, categoryName = 'Impulso') {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');

  // 1. Background Fallback Gradient
  const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Try loading background photo with CORS
  try {
    const img = await loadImage(quoteObj.image);
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  } catch {
    // Keep gradient if offline or CORS restricted
  }

  // 3. Dark cinematic overlay for readability
  const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
  overlay.addColorStop(0, 'rgba(9, 13, 22, 0.55)');
  overlay.addColorStop(0.5, 'rgba(9, 13, 22, 0.72)');
  overlay.addColorStop(1, 'rgba(9, 13, 22, 0.92)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 4. Decorative border frame
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);

  // 5. Category pill text
  ctx.fillStyle = '#fbbf24';
  ctx.font = '600 28px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(categoryName.toUpperCase(), canvas.width / 2, 190);

  // 6. Quote text wrapping
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 600 54px Georgia, serif';
  const lines = wrapText(ctx, `“${quoteObj.quote}”`, canvas.width - 240);
  let startY = 480 - (lines.length * 36);
  lines.forEach((line, idx) => {
    ctx.fillText(line, canvas.width / 2, startY + idx * 76);
  });

  // 7. Author
  const authorY = startY + lines.length * 76 + 60;
  ctx.fillStyle = '#fcd34d';
  ctx.font = '600 32px Inter, sans-serif';
  ctx.fillText(`— ${quoteObj.author}`, canvas.width / 2, authorY);

  // 8. Reflection box at bottom
  const reflY = 1060;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '400 28px Inter, sans-serif';
  const reflLines = wrapText(ctx, `💡 ${quoteObj.reflection}`, canvas.width - 260);
  reflLines.forEach((line, idx) => {
    ctx.fillText(line, canvas.width / 2, reflY + idx * 44);
  });

  // 9. Branding footer
  ctx.fillStyle = 'rgba(251, 191, 36, 0.7)';
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillText('IMPULSO • MOTIVACIÓN DIARIA', canvas.width / 2, 1245);

  return canvas.toDataURL('image/png');
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Shares a quote via Capacitor Share, Web Share API, or WhatsApp link
 */
export async function shareQuote(quoteObj, platform = 'native') {
  const shareText = `✨ *“${quoteObj.quote}”*\n— _${quoteObj.author}_\n\n💡 * Acción de hoy:* ${quoteObj.reflection}\n\n📲 Vía *Impulso Motivación*`;

  if (platform === 'whatsapp') {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return true;
  }

  try {
    if (Capacitor.isNativePlatform()) {
      await Share.share({
        title: 'Frase Motivadora — Impulso',
        text: shareText,
        dialogTitle: 'Compartir motivación'
      });
      return true;
    } else if (navigator.share) {
      await navigator.share({
        title: 'Frase Motivadora — Impulso',
        text: shareText
      });
      return true;
    }
  } catch {
    // Fallback to clipboard copy
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareText);
    return 'copied';
  }
  return false;
}


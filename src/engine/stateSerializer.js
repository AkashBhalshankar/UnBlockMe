import LZString from 'lz-string';

/**
 * State Serializer using LZ-String for Zero-Server URL Hash Persistence.
 * Encodes all letter parameters, tokens, and signatories into the URL hash fragment (#p=...).
 */

export function serializeState(data) {
  try {
    const compactObj = {
      r: data.recipient || 'Friend',
      s: data.sender || 'Anonymous',
      cat: data.relationship || 'situationship',
      g: Number(data.gravity) || 3,
      rit: data.ritual || 'shackle',
      t1: data.tokens?.trigger || '',
      t2: data.tokens?.fault || '',
      t3: data.tokens?.remedy || '',
      ts: data.timestamp || Date.now(),
      ct: data.counterTerms || ''
    };
    const jsonStr = JSON.stringify(compactObj);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Serialization failed:', err);
    return '';
  }
}

export function deserializeHash(hashStr) {
  if (!hashStr) return null;
  try {
    let clean = hashStr.startsWith('#') ? hashStr.slice(1) : hashStr;
    if (clean.startsWith('p=')) {
      clean = clean.slice(2);
    } else if (clean.includes('p=')) {
      const match = clean.match(/p=([^&]+)/);
      if (match) clean = match[1];
    }

    if (!clean) return null;

    let decompressed = LZString.decompressFromEncodedURIComponent(clean);
    if (!decompressed) {
      // Try fallback base64 decompression
      decompressed = LZString.decompressFromBase64(clean);
    }
    if (!decompressed) {
      // Try direct JSON decode
      try {
        decompressed = decodeURIComponent(clean);
      } catch {
        // Ignore
      }
    }

    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    return {
      recipient: parsed.r || 'Friend',
      sender: parsed.s || 'Someone Special',
      relationship: parsed.cat || 'situationship',
      gravity: Number(parsed.g) || 3,
      ritual: parsed.rit || 'shackle',
      tokens: {
        trigger: parsed.t1 || '',
        fault: parsed.t2 || '',
        remedy: parsed.t3 || ''
      },
      timestamp: parsed.ts || Date.now(),
      counterTerms: parsed.ct || ''
    };
  } catch (err) {
    console.warn('De-serialization error:', err);
    return null;
  }
}

export function generateShareableUrl(data) {
  const compressed = serializeState(data);
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#p=${compressed}`;
}

export function getHashStats(data) {
  try {
    const rawJson = JSON.stringify(data);
    const compressed = serializeState(data);
    const rawLen = rawJson.length;
    const compLen = compressed.length;
    const reduction = rawLen > 0 ? Math.max(0, Math.round(((rawLen - compLen) / rawLen) * 100)) : 0;
    return {
      rawLength: rawLen,
      compressedLength: compLen,
      reductionPercent: reduction,
      fullUrlLength: `${window.location.origin}${window.location.pathname}#p=${compressed}`.length,
      compressed
    };
  } catch {
    return {
      rawLength: 0,
      compressedLength: 0,
      reductionPercent: 0,
      fullUrlLength: 0,
      compressed: ''
    };
  }
}

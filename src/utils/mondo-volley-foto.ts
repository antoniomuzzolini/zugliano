import type { ImageMetadata } from 'astro';

const moduli = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/mondo-volley/*/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,avif}',
  { eager: true }
);

export interface EdizioneFoto {
  anno: string;
  foto: ImageMetadata[];
}

/** Foto raggruppate per edizione (cartella anno), dalla più recente. */
export function getFotoPerEdizione(): EdizioneFoto[] {
  const perAnno = new Map<string, ImageMetadata[]>();

  for (const [percorso, modulo] of Object.entries(moduli)) {
    const anno = percorso.match(/mondo-volley\/(\d{4})\//)?.[1];
    if (!anno) continue;
    if (!perAnno.has(anno)) perAnno.set(anno, []);
    perAnno.get(anno)!.push(modulo.default);
  }

  return [...perAnno.entries()]
    .map(([anno, foto]) => ({
      anno,
      foto: foto.sort((a, b) => a.src.localeCompare(b.src)),
    }))
    .sort((a, b) => b.anno.localeCompare(a.anno));
}

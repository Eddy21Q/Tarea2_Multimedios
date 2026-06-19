const seedAlbumes = [
  {
    slug: 'thriller',
    titulo: 'Thriller',
    artista: 'Michael Jackson',
    anio: 1982
  }
];

let albumes = structuredClone(seedAlbumes);

export function resetAlbumes() {
  albumes = structuredClone(seedAlbumes);
}

export function getAlbumSlugs() {
  return albumes.map((album) => album.slug);
}

export function getAlbumBySlug(slug) {
  return albumes.find((album) => album.slug === slug);
}

export function searchAlbumes(text) {
  const term = text.toLowerCase();

  return albumes.filter((album) =>
    [album.slug, album.titulo, album.artista, String(album.anio)].some((value) =>
      value.toLowerCase().includes(term)
    )
  );
}

export function createAlbum(album) {
  albumes.push(album);
  return album;
}

export function updateAlbum(slug, album) {
  const index = albumes.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return null;
  }

  albumes[index] = { ...album, slug };
  return albumes[index];
}

export function deleteAlbum(slug) {
  const index = albumes.findIndex((album) => album.slug === slug);

  if (index === -1) {
    return false;
  }

  albumes.splice(index, 1);
  return true;
}

// Helper para criar slugs sem dependência externa
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços viram hífens
    .replace(/-+/g, '-') // Múltiplos hífens viram um
    .replace(/^-|-$/g, ''); // Remove hífens das pontas
};

// Gera slug único verificando no banco
export const generateUniqueSlug = async (
  title: string,
  checkSlugExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (await checkSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
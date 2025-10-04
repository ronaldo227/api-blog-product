/**
 * Cria um slug URL-friendly a partir de um texto
 * 
 * Implementação customizada que substitui a dependência `transliteration`.
 * Remove acentos, caracteres especiais e espaços, convertendo tudo em lowercase
 * com hífens como separadores.
 * 
 * @param text - Texto a ser convertido em slug
 * @returns String formatada como slug (ex: "título exemplo" → "titulo-exemplo")
 * 
 * @example
 * ```typescript
 * createSlug("Meu Título com Acentos!") // "meu-titulo-com-acentos"
 * createSlug("  Espaços   múltiplos  ") // "espacos-multiplos"
 * ```
 */
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

/**
 * Gera um slug único verificando duplicatas no banco de dados
 * 
 * Utiliza a função `createSlug` para gerar o slug base e adiciona um sufixo
 * numérico incremental caso já exista um slug igual no banco.
 * 
 * @param title - Título a ser convertido em slug
 * @param checkSlugExists - Função que verifica se o slug já existe no banco
 * @returns Promise<string> - Slug único garantido
 * 
 * @example
 * ```typescript
 * // Se "meu-post" já existe, retorna "meu-post-1", "meu-post-2", etc.
 * const slug = await generateUniqueSlug("Meu Post", async (slug) => {
 *   return await prisma.post.findUnique({ where: { slug } }) !== null;
 * });
 * ```
 */
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
export const buildQueryFeatures = ({ query, defaultSort = '-createdAt', searchableFields = [] }) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  // Excluir parámetros de paginación y búsqueda
  const excludedFields = ['page', 'limit', 'sort', 'search', 'fields'];
  const filters = {};
  
  // Agregar solo campos válidos que no estén en la lista de excluidos
  Object.keys(query).forEach(key => {
    if (!excludedFields.includes(key) && query[key]) {
      filters[key] = query[key];
    }
  });

  if (query.search && searchableFields.length > 0) {
    filters.$or = searchableFields.map((field) => ({ [field]: { $regex: query.search, $options: 'i' } }));
  }

  const sort = (query.sort || defaultSort).split(',').join(' ');

  return { page, limit, skip, filters, sort };
};

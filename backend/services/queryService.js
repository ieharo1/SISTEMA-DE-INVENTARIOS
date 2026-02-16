export const buildQueryFeatures = ({ query, defaultSort = '-createdAt', searchableFields = [] }) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;

  const filters = { ...query };
  ['page', 'limit', 'sort', 'search', 'fields'].forEach((field) => delete filters[field]);

  if (query.search && searchableFields.length > 0) {
    filters.$or = searchableFields.map((field) => ({ [field]: { $regex: query.search, $options: 'i' } }));
  }

  const sort = (query.sort || defaultSort).split(',').join(' ');

  return { page, limit, skip, filters, sort };
};

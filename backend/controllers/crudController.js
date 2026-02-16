import { catchAsync } from '../utils/catchAsync.js';
import { buildQueryFeatures } from '../services/queryService.js';
import { AppError } from '../utils/AppError.js';

export const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(doc);
  });

export const getAll = (Model, populate = '', searchableFields = []) =>
  catchAsync(async (req, res) => {
    const { filters, sort, skip, limit, page } = buildQueryFeatures({ query: req.query, searchableFields });
    const [data, total] = await Promise.all([
      Model.find(filters).populate(populate).sort(sort).skip(skip).limit(limit),
      Model.countDocuments(filters)
    ]);
    res.json({ total, page, pages: Math.ceil(total / limit), data });
  });

export const getOne = (Model, populate = '') =>
  catchAsync(async (req, res) => {
    const doc = await Model.findById(req.params.id).populate(populate);
    if (!doc) throw new AppError('No encontrado', 404);
    res.json(doc);
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) throw new AppError('No encontrado', 404);
    res.json(doc);
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new AppError('No encontrado', 404);
    res.status(204).send();
  });

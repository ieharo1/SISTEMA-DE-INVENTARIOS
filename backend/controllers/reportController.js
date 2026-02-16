import { Product } from '../models/Product.js';
import { InventoryMovement } from '../models/InventoryMovement.js';
import { catchAsync } from '../utils/catchAsync.js';
import { streamExcel, streamPdf } from '../services/reportService.js';

const getLowStock = async () => Product.find({ $expr: { $lte: ['$stockActual', '$stockMinimo'] } }).lean();

export const lowStockReport = catchAsync(async (req, res) => {
  const data = await getLowStock();
  if (req.query.format === 'pdf') return streamPdf(res, 'reporte-bajo-stock', data);
  if (req.query.format === 'excel') return streamExcel(res, 'reporte-bajo-stock', data);
  res.json(data);
});

export const analyticsReport = catchAsync(async (_req, res) => {
  const [masVendidos, porUsuario, mensual] = await Promise.all([
    InventoryMovement.aggregate([
      { $match: { tipo: 'salida' } },
      { $group: { _id: '$producto', total: { $sum: '$cantidad' } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]),
    InventoryMovement.aggregate([{ $group: { _id: '$usuario', totalMovimientos: { $sum: 1 } } }]),
    InventoryMovement.aggregate([
      {
        $group: {
          _id: { year: { $year: '$fecha' }, month: { $month: '$fecha' } },
          total: { $sum: '$cantidad' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ]);

  res.json({ masVendidos, movimientosPorUsuario: porUsuario, reporteMensual: mensual });
});

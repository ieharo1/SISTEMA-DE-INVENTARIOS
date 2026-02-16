import { Product } from '../models/Product.js';
import { InventoryMovement } from '../models/InventoryMovement.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboard = catchAsync(async (_req, res) => {
  const [totalProductos, lowStock, latestMovements, valor] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ $expr: { $lte: ['$stockActual', '$stockMinimo'] } }),
    InventoryMovement.find().sort('-fecha').limit(6).populate('producto usuario', 'nombre email'),
    Product.aggregate([
      { $project: { total: { $multiply: ['$stockActual', '$precioCompra'] } } },
      { $group: { _id: null, valorTotal: { $sum: '$total' } } }
    ])
  ]);

  const entradasVsSalidas = await InventoryMovement.aggregate([
    {
      $group: {
        _id: '$tipo',
        cantidad: { $sum: '$cantidad' }
      }
    }
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const movimientosMes = await InventoryMovement.countDocuments({ fecha: { $gte: monthStart } });

  res.json({
    totalProductos,
    productosBajoStock: lowStock,
    valorTotalInventario: valor[0]?.valorTotal || 0,
    movimientosMes,
    entradasVsSalidas,
    latestMovements
  });
});

import { Product } from '../models/Product.js';
import { InventoryMovement } from '../models/InventoryMovement.js';
import { Category } from '../models/Category.js';
import { catchAsync } from '../utils/catchAsync.js';
import { streamExcel, streamPdf } from '../services/reportService.js';

const getLowStock = async () => Product.find({ $expr: { $lte: ['$stockActual', '$stockMinimo'] } }).lean();

export const lowStockReport = catchAsync(async (req, res) => {
  const data = await getLowStock();
  if (req.query.format === 'pdf') return streamPdf(res, 'reporte-bajo-stock', data);
  if (req.query.format === 'excel') return streamExcel(res, 'reporte-bajo-stock', data);
  res.json({ productos: data, resumen: { bajoStock: data.length } });
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

export const inventoryReport = catchAsync(async (req, res) => {
  const productos = await Product.find()
    .populate('categoria', 'nombre')
    .populate('proveedor', 'nombre')
    .lean();

  const totalProductos = productos.length;
  const bajoStock = productos.filter(p => p.stockActual <= p.stockMinimo).length;
  const valorTotal = productos.reduce((acc, p) => acc + (p.stockActual * p.precioVenta), 0);

  res.json({
    productos,
    resumen: { totalProductos, bajoStock, valorTotal }
  });
});

export const movementsReport = catchAsync(async (req, res) => {
  const { rango } = req.query;
  let startDate = new Date();
  
  if (rango === 'semana') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (rango === 'mes') {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (rango === 'trimestre') {
    startDate.setMonth(startDate.getMonth() - 3);
  } else if (rango === 'año') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const movimientos = await InventoryMovement.find({ fecha: { $gte: startDate } })
    .populate('producto', 'nombre')
    .populate('usuario', 'nombre')
    .lean();

  const entradas = movimientos.filter(m => m.tipo === 'entrada').length;
  const salidas = movimientos.filter(m => m.tipo === 'salida').length;

  res.json({
    movimientos,
    resumen: { totalMovimientos: movimientos.length, entradas, salidas }
  });
});

export const valorReport = catchAsync(async (req, res) => {
  const categorias = await Category.find().lean();
  
  const valorPorCategoria = await Promise.all(
    categorias.map(async (cat) => {
      const productos = await Product.find({ categoria: cat._id }).lean();
      const valor = productos.reduce((acc, p) => acc + (p.stockActual * p.precioVenta), 0);
      return { nombre: cat.nombre, valor };
    })
  );

  const valorTotal = valorPorCategoria.reduce((acc, c) => acc + c.valor, 0);

  res.json({
    categorias: valorPorCategoria,
    resumen: { valorTotal }
  });
});

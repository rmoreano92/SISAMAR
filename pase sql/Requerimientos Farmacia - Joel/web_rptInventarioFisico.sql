
ALTER PROCEDURE [dbo].[web_rptInventarioFisico] 
(
@IdAlmacen int = 0,
@IdAnaquel int = 0
)
as
begin
	
	DECLARE @nombreAlmacen varchar(100)
	
	SELECT @nombreAlmacen = descripcion FROM farmAlmacen WHERE IdAlmacen = @IdAlmacen
	
	SELECT 
	pro.codigo,
	pro.nombre,
	case when sum(fs.cantidad) = 0 then 'NO' else 'SI' end petitorio,
	case when pro.TipoProducto = 0 then 'MEDICAMENTOS'
	else 'INSUMO' 
	end tipoProducto,
	isnull(an.descripcion,'No Registra') anaquel,
	-- STOCK TOTAL
	SUM(
			CASE 
					WHEN dm.MovTipo = 'E' THEN dm.cantidad
					WHEN dm.MovTipo = 'S' THEN -dm.cantidad
					ELSE 0
			END
	) stockTotal,
	dm.Lote,
	dm.FechaVencimiento,
	fs.precio,
	@nombreAlmacen as almacen
	FROM farmSaldo fs
	INNER JOIN farmAlmacen fa ON fs.idAlmacen = fa.idAlmacen 
	INNER JOIN FactCatalogoBienesInsumos pro ON fs.idProducto = pro.IdProducto
	INNER JOIN farmMovimientoDetalle dm on dm.idProducto = pro.IdProducto
	LEFT JOIN Anaqueles an ON fs.IdAnaquel = an.IdAnaquel
	WHERE 
		(fs.IdAlmacen = @IdAlmacen or @IdAlmacen = 0) and
		(fs.IdAnaquel = @IdAnaquel or @IdAnaquel = 0)  
	GROUP BY 
		fs.idProducto,fs.idAlmacen,fs.idAnaquel,fs.precio,dm.Lote,dm.FechaVencimiento,an.descripcion,
		pro.Codigo,	pro.nombre, pro.Denominacion, pro.Concentracion, pro.FormaFarmaceutica,
		pro.Presentacion, pro.TipoProducto	
	ORDER BY pro.codigo

END
Go

ALTER PROCEDURE [dbo].[web_rptProductosMedicos] 
(
@IdAlmacen int = 0,
@IdAnaquel int = 0,
@IdTipoReporte int = 1
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
	sum(fs.cantidad) stock,
	fs.precio,
	@nombreAlmacen as almacen
	FROM farmSaldo fs
	INNER JOIN farmAlmacen fa ON fs.idAlmacen = fa.idAlmacen 
	INNER JOIN FactCatalogoBienesInsumos pro ON fs.idProducto = pro.IdProducto
	LEFT JOIN Anaqueles an ON fs.IdAnaquel = an.IdAnaquel
	WHERE 
		(fs.IdAlmacen = @IdAlmacen or @IdAlmacen = 0) and
		(fs.IdAnaquel = @IdAnaquel or @IdAnaquel = 0)  
	GROUP BY 
		fs.idProducto,fs.idAlmacen,fs.idAnaquel,fs.precio,an.descripcion,
		pro.Codigo,	pro.nombre, pro.Denominacion, pro.Concentracion, pro.FormaFarmaceutica,
		pro.Presentacion, pro.TipoProducto	
	HAVING 
       (@IdTipoReporte = 1)
    OR (@IdTipoReporte = 2 AND SUM(fs.cantidad) > 0)
    OR (@IdTipoReporte = 3 AND SUM(fs.cantidad) = 0)
	ORDER BY pro.codigo

END
Go










INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,12539,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,4527,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,2823,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,2789,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,2963,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,5328,1,0,0)
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,709,1,201,'47.50')
INSERT INTO [dbo].[farmSaldo]
	([idAlmacen],[idProducto],[IdTipoSalidaBienInsumo],[cantidad],[Precio])VALUES (441,5522,1,501,'4.50')


	-- Stored Procedure
ALTER PROCEDURE [dbo].[web_farmAntimicrobianosSaldoTotalesSoloMayoresAcero]
(@Filtro Varchar (50), @Order Varchar (50))

AS
DECLARE @SQL AS VARCHAR(1000)

	SET  @SQL = 'SELECT DISTINCT 
				 dbo.FactCatalogoBienesInsumos.IdProducto, 
				 dbo.FactCatalogoBienesInsumos.Codigo, 
				 dbo.FactCatalogoBienesInsumos.Nombre
				 FROM dbo.farmSaldo 
				 LEFT OUTER JOIN dbo.farmAlmacen ON dbo.farmSaldo.idAlmacen = dbo.farmAlmacen.idAlmacen 
				 LEFT OUTER JOIN dbo.FactCatalogoBienesInsumos ON dbo.farmSaldo.idProducto = dbo.FactCatalogoBienesInsumos.IdProducto
				 WHERE (dbo.farmSaldo.cantidad >= 0) AND (dbo.farmSaldo.idTipoSalidaBienInsumo IN (1,2)) AND 
				 (dbo.FactCatalogoBienesInsumos.IdProducto IN (747, 710, 2013, 12539,4527, 822, 871, 882, 2776, 750, 2823, 13309, 2925, 5522, 6249, 924, 709, 721, 2789, 2963, 5328, 5748)) AND
				 (dbo.farmAlmacen.idTipoLocales = ''F'')  '  + @Filtro +  ' ' + @Order

EXECUTE (@SQL)

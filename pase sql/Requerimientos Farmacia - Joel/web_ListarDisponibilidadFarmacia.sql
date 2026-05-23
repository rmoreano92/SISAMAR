
ALTER PROCEDURE [dbo].[web_ListarDisponibilidadFarmacia]
(
@IdAlmacen int = 0
) AS
BEGIN
SELECT
	TOP 12 Periodo
INTO #Periodos
FROM
	ConsumoICIMensualSisGalenPlus 
GROUP BY Periodo
ORDER BY Periodo DESC

SELECT
	Periodo,
	ROW_NUMBER() OVER(ORDER BY Periodo ASC) Fila
INTO #Temp
FROM
	#Periodos
ORDER BY Periodo ASC

SELECT 
	[Periodo]
    ,[Codigo_SISMED]
    ,SUM([Total]) Total
	,(SELECT Fila FROM #Temp WHERE Periodo = ICI.Periodo) Fila
INTO #Ultimos12Meses
FROM 
	[SIGH].[dbo].[ConsumoICIMensualSisGalenPlus] ICI
WHERE
	Periodo IN (SELECT Periodo FROM #Temp)
GROUP BY
	[Periodo]
    ,[Codigo_SISMED]


SELECT
  farmSaldo.idProducto,farmSaldo.idAlmacen,
	farmSaldo.idAnaquel, Anaqueles.descripcion anaquel,
	FactCatalogoBienesInsumos.Codigo,
	replace(FactCatalogoBienesInsumos.Denominacion,'õ', '') Descripcion,
	FactCatalogoBienesInsumos.Concentracion Concentracion,
	FactCatalogoBienesInsumos.FormaFarmaceutica Presentacion,
	FactCatalogoBienesInsumos.Presentacion FormaFarmaceutica,
	CASE FactCatalogoBienesInsumos.TipoProducto WHEN 0 THEN 'M' ELSE 'I' END Tipo,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 1), 0) mes1,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 2), 0) mes2,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 3), 0) mes3,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 4), 0) mes4,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 5), 0) mes5,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 6), 0) mes6,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 7), 0) mes7,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 8), 0) mes8,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 9), 0) mes9,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 10), 0) mes10,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 11), 0) mes11,
	ISNULL((SELECT TOP 1 ISNULL(Total, 0) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 12), 0) mes12,
	
	ISNULL((SELECT SUM(Total) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo), 0)/
	CASE WHEN ISNULL((SELECT COUNT(*) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo), 1) = 0 THEN 1 
	ELSE ISNULL((SELECT COUNT(*) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo), 1) END CPMA,
	
	SUM(farmSaldo.cantidad) AS Stock,

	(ISNULL((SELECT TOP 1 IIF(Total IS NULL OR Total = 0 , 0, 1) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 9), 0) +
	ISNULL((SELECT TOP 1 IIF(Total IS NULL OR Total = 0 , 0, 1) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 10), 0) +
	ISNULL((SELECT TOP 1 IIF(Total IS NULL OR Total = 0 , 0, 1) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 11), 0) +
	ISNULL((SELECT TOP 1 IIF(Total IS NULL OR Total = 0 , 0, 1) FROM #Ultimos12Meses WHERE Codigo_SISMED = FactCatalogoBienesInsumos.Codigo AND Fila = 12), 0)) Rotacion

	INTO #Disponibilidad
	FROM
		farmSaldo 
		LEFT OUTER JOIN farmAlmacen ON farmSaldo.idAlmacen = farmAlmacen.idAlmacen 
		LEFT OUTER JOIN FactCatalogoBienesInsumos ON farmSaldo.idProducto = FactCatalogoBienesInsumos.IdProducto
		LEFT OUTER JOIN Anaqueles ON farmSaldo.IdAnaquel = Anaqueles.IdAnaquel
	Where 
		(Not (farmAlmacen.CodigoSismed Is Null)) and 
		(farmSaldo.idAlmacen = @IdAlmacen or @IdAlmacen = 0)
	GROUP BY 
		farmSaldo.idProducto,farmSaldo.idAlmacen,farmSaldo.idAnaquel,Anaqueles.descripcion ,FactCatalogoBienesInsumos.Codigo,
		FactCatalogoBienesInsumos.Denominacion, FactCatalogoBienesInsumos.Concentracion, FactCatalogoBienesInsumos.FormaFarmaceutica,
		FactCatalogoBienesInsumos.Presentacion, FactCatalogoBienesInsumos.TipoProducto
	ORDER BY dbo.FactCatalogoBienesInsumos.Denominacion


	SELECT
		idProducto, Codigo, Descripcion, Concentracion, Presentacion, 
		FormaFarmaceutica, Tipo, anaquel,idAlmacen,idAnaquel,
		--mes1, mes2, mes3, mes4, mes5, mes6, mes7, mes8, mes9, mes10, mes11, mes12,
		CPMA, Stock, Rotacion, IIF(Rotacion <> 0, CAST(Stock/CPMA AS VARCHAR), 'No Rota') MesesAbastecidos,
		CASE
			WHEN Rotacion = 0 THEN 'No Rota' 
			WHEN IIF(Rotacion <> 0, Stock/CPMA, 0) = 0 THEN 'DESABASTECIDO'
			WHEN IIF(Rotacion <> 0, Stock/CPMA, 0) <= 2 THEN 'SUB STOCK'
			WHEN IIF(Rotacion <> 0, Stock/CPMA, 0) <= 6 THEN 'NORMO STOCK'
			ELSE 'SOBRE STOCK' 
		END Estado
		
	FROM #Disponibilidad
	ORDER BY Descripcion
	DROP TABLE #Periodos
	DROP TABLE #Temp
	DROP TABLE #Ultimos12Meses
	DROP TABLE #Disponibilidad
END
GO




--insert into RolesItems(IdListItem,IdRol,Agregar,Modificar,Eliminar,Consultar) values(1406,349,1,1,1,1);




























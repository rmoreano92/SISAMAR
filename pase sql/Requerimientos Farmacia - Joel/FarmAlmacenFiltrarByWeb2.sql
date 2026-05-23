--SELECT  * from farmAlmacen where idIpress = 1
ALTER PROCEDURE [dbo].[FarmAlmacenFiltrarByWeb2]
@lcFiltro varchar(1000) = '',
@IdIpress int = 0,
@IdTipoLocales varchar(10) = 'F'
AS
SELECT * from farmAlmacen 
where  
	CHARINDEX(',' + idTipoLocales + ',', ',' + @IdTipoLocales + ',') > 0
	and idTipoSuministro='01' 
	and idEstado=1 
	and ((
		idTipoLocales = 'F'
		AND (idIpress = @IdIpress OR @IdIpress = 0)
	)
	OR(idTipoLocales <> 'F')) 
	order by descripcion
GO




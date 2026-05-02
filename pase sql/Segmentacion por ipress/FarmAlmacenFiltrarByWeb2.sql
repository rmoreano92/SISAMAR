--SELECT  * from farmAlmacen where idIpress = 1
ALTER PROCEDURE [dbo].[FarmAlmacenFiltrarByWeb2]
@lcFiltro varchar(1000),
@IdIpress int = 0
AS
SELECT  * from farmAlmacen where idTipoLocales='F' and idTipoSuministro='01' and idEstado=1 and (idIpress=@IdIpress or @IdIpress=0) order by descripcion
GO

ALTER   PROCEDURE  [dbo].[DevuelveServiciosDelHospitalFiltro]
(
@lcFiltro varchar(1000)
)
AS
	DECLARE @SQL AS VARCHAR(2000)

   SET  @SQL =  'SELECT     
				 dbo.Servicios.IdServicio, 
				 LTRIM(dbo.Servicios.Nombre) + ''  ('' + LTRIM(dbo.Especialidades.Nombre) + '')  ('' + LTRIM(dbo.TiposServicio.Descripcion) + '')'' AS DservicioHosp,
				 LTRIM(RTRIM(dbo.Servicios.Nombre)) AS Dservicio,
				 LTRIM(dbo.Servicios.Nombre) AS Servicio,
				 dbo.Servicios.IdEspecialidad
				 FROM dbo.Servicios 
				 LEFT OUTER JOIN dbo.TiposServicio ON dbo.Servicios.IdTipoServicio = dbo.TiposServicio.IdTipoServicio 
				 LEFT OUTER JOIN dbo.Especialidades ON dbo.Servicios.IdEspecialidad = dbo.Especialidades.IdEspecialidad
				 WHERE dbo.Servicios.idEstado=1 and   dbo.Servicios.IdTipoServicio in ' + @lcFiltro

EXECUTE (@SQL)



























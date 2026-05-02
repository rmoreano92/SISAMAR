/*
EXEC dbo.web_AtencionesCEFiltrarPorPaciente 
    @NroHistoriaClinica = '',
    @apellidoPaterno = '',
    @apellidoMaterno = 'ju',
    @primerNombre = '',
    @dni = '',
    @idCuentaAtencion = 0,
    @lcFechaTriaje = '';
*/
ALTER PROCEDURE [dbo].[web_AtencionesCEFiltrarPorPaciente]
(
	@NroHistoriaClinica varchar(20) = NULL,  -- CAMBIADO DE INT A VARCHAR
	@apellidoPaterno varchar(40),
	@apellidoMaterno varchar(40),
	@primerNombre varchar(40),
	@dni varchar(12),
	@idCuentaAtencion int,
	@lcFechaTriaje varchar(10),
	@IdIpress int = 0
)
AS
SELECT     
	SIGH_EXTERNA..atencionesCE.idAtencion,
	sigh.dbo.Atenciones.IdCuentaAtencion,
	sigh.dbo.Pacientes.NroHistoriaClinica,
	sigh.dbo.Pacientes.ApellidoPaterno, 
	sigh.dbo.Pacientes.ApellidoMaterno,
	sigh.dbo.Pacientes.PrimerNombre,
	CONVERT(VARCHAR, SIGH_EXTERNA..atencionesCE.TriajeFecha, 103) AS TriajeFecha,
	sigh.dbo.Servicios.Nombre AS Consultorio, 
	CONVERT(VARCHAR, sigh.dbo.Atenciones.FechaIngreso, 103) AS FechaCita
FROM 	sigh.dbo.Atenciones 
	LEFT OUTER JOIN sigh.dbo.Servicios ON sigh.dbo.Atenciones.IdServicioIngreso = sigh.dbo.Servicios.IdServicio 
	LEFT OUTER JOIN sigh.dbo.Especialidades ON sigh.dbo.Servicios.IdEspecialidad = sigh.dbo.Especialidades.IdEspecialidad 
	LEFT OUTER JOIN sigh.dbo.DepartamentosHospital ON sigh.dbo.DepartamentosHospital.IdDepartamento = sigh.dbo.Especialidades.IdDepartamento 
	LEFT OUTER JOIN sigh.dbo.Pacientes ON sigh.dbo.Atenciones.IdPaciente = sigh.dbo.Pacientes.IdPaciente 
	RIGHT OUTER JOIN SIGH_EXTERNA..atencionesCE ON SIGH_EXTERNA..atencionesCE.IdAtencion = sigh.dbo.Atenciones.IdAtencion
WHERE    
	(Pacientes.NroHistoriaClinica = @NroHistoriaClinica OR @NroHistoriaClinica IS NULL) AND
	(Pacientes.ApellidoPaterno = @apellidoPaterno OR @apellidoPaterno = '') AND
	(Pacientes.ApellidoMaterno = @apellidoMaterno OR @apellidoMaterno = '') AND
	(Pacientes.NroDocumento = @dni OR @dni = '') AND
	(Atenciones.IdCuentaAtencion = @idCuentaAtencion OR @idCuentaAtencion = 0) AND
	(DepartamentosHospital.idIpress = @IdIpress OR @IdIpress = 0) AND
	(CAST(SIGH_EXTERNA..atencionesCE.TriajeFecha AS DATE) = CAST(@lcFechaTriaje AS DATE) OR @lcFechaTriaje = '')
ORDER BY  
	SIGH_EXTERNA..atencionesCE.TriajeFecha DESC
GO





ALTER PROCEDURE [dbo].[usp_AdmisionCEFiltrarPorPaciente]
(
	@NroHistoriaClinica varchar(20) = NULL,  -- CAMBIADO DE INT A VARCHAR
	@apellidoPaterno varchar(40),
	@apellidoMaterno varchar(40),
	@primerNombre varchar(40),
	@dni varchar(12),
	@idCuentaAtencion int,
	@fechaAtencion varchar(10),
	@IdIpress int = 0
)
AS
SELECT
	sigh.dbo.Atenciones.idAtencion,
	sigh.dbo.Atenciones.IdCuentaAtencion,
	sigh.dbo.Pacientes.NroHistoriaClinica,
	sigh.dbo.Pacientes.ApellidoPaterno, 
	sigh.dbo.Pacientes.ApellidoMaterno,
	sigh.dbo.Pacientes.PrimerNombre,
	'' AS TriajeFecha,
	sigh.dbo.Servicios.Nombre AS Consultorio, 
	CONVERT(VARCHAR, sigh.dbo.Atenciones.FechaIngreso, 103) AS FechaCita,
	sigh.dbo.Citas.IdCita,
	Turno = (FLOOR(DATEDIFF(MINUTE, PM.HoraInicio, sigh.dbo.Citas.HoraInicio) / PM.TiempoPromedioAtencion) + 1),
	sigh.dbo.Citas.HoraInicio,
	sigh.dbo.EstadosColaCitas.IdEstadoColaCita,
	sigh.dbo.EstadosColaCitas.Descripcion as EstadoColaCita,
	TiposFinanciamiento.generaPago GeneraPago,
	isnull(Servicios.CostoCeroCE,0) as CostoCeroCE,
	TiposEstadosCita.Descripcion as estadoCita,
	TiposEstadosCita.IdEstadoCita,
	FuentesFinanciamiento.Descripcion as planA
FROM
	sigh.dbo.Atenciones 
	LEFT JOIN sigh.dbo.Servicios ON sigh.dbo.Atenciones.IdServicioIngreso = sigh.dbo.Servicios.IdServicio 
	LEFT JOIN sigh.dbo.Pacientes ON sigh.dbo.Atenciones.IdPaciente = sigh.dbo.Pacientes.IdPaciente 
	LEFT JOIN SIGH_EXTERNA..atencionesCE ON SIGH_EXTERNA..atencionesCE.IdAtencion = sigh.dbo.Atenciones.IdAtencion
	LEFT JOIN sigh.dbo.Citas ON sigh.dbo.Atenciones.IdAtencion = sigh.dbo.Citas.IdAtencion
	LEFT JOIN sigh.dbo.EstadosColaCitas ON sigh.dbo.EstadosColaCitas.IdEstadoColaCita = sigh.dbo.Citas.IdEstadoColaCita
	LEFT JOIN ProgramacionMedica PM ON sigh.dbo.Citas.IdProgramacion = PM.IdProgramacion
	
	LEFT JOIN Especialidades ES ON sigh.dbo.Servicios.IdEspecialidad = es.IdEspecialidad  
	LEFT JOIN DepartamentosHospital DH ON ES.IdDepartamento = DH.IdDepartamento
	
	OUTER APPLY dbo.fn_SelectBuscarFuentePorDNI(sigh.dbo.Pacientes.NroDocumento) tf
	LEFT JOIN TiposFinanciamiento ON TiposFinanciamiento.IdTipoFinanciamiento = tf.idTipoFinanciamiento 
	LEFT JOIN TiposEstadosCita on TiposEstadosCita.IdEstadoCita=sigh.dbo.Citas.IdEstadoCita
	LEFT JOIN FuentesFinanciamiento on FuentesFinanciamiento.IdFuenteFinanciamiento = Atenciones.idFuenteFinanciamiento
/*WHERE    
	(Pacientes.NroHistoriaClinica = @NroHistoriaClinica OR @NroHistoriaClinica IS NULL) AND
	(Pacientes.ApellidoPaterno = @apellidoPaterno OR @apellidoPaterno = '') AND
	(Pacientes.ApellidoMaterno = @apellidoMaterno OR @apellidoMaterno = '') AND
	(Pacientes.NroDocumento = @dni OR @dni = '') AND
	(Atenciones.IdCuentaAtencion = @idCuentaAtencion OR @idCuentaAtencion = 0) AND
	sigh.dbo.Citas.Fecha = CONVERT(DATE,'07/03/2026',103) and --@fechaAtencion AND joel
	sigh.dbo.Citas.idEstadoCita <> 3*/
WHERE    
	(Pacientes.NroHistoriaClinica = @NroHistoriaClinica OR @NroHistoriaClinica IS NULL) AND
	(Pacientes.ApellidoPaterno = @apellidoPaterno OR @apellidoPaterno = '') AND
	(Pacientes.ApellidoMaterno = @apellidoMaterno OR @apellidoMaterno = '') AND
	(Pacientes.NroDocumento = @dni OR @dni = '') AND
	(Atenciones.IdCuentaAtencion = @idCuentaAtencion OR @idCuentaAtencion = 0) AND
	(DH.idIpress = @IdIpress OR @IdIpress = 0) AND
	--sigh.dbo.Citas.Fecha > getdate() AND
	(
		@dni <> '' 
		OR sigh.dbo.Citas.Fecha = CONVERT(DATE,@fechaAtencion,103)
	)
	AND sigh.dbo.Citas.idEstadoCita <> 3 AND EstadosColaCitas.IdEstadoColaCita IN (1,2)
ORDER BY  
	sigh.dbo.Citas.Fecha DESC
GO
















	
	
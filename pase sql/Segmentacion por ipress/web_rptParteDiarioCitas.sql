--web_rptParteDiarioCitas 1, 1, 0,0,0,0, '2026-04-01','2026-04-29'
--GO

ALTER PROCEDURE [dbo].[web_rptParteDiarioCitas] 
(
@idTipoServicio int,
@idDepartamento int,
@idEspecialidad int,
@idServicio int,
@idDestino int,
@idMedico int,
@FechaInicio date,
@FechaFin date
)
as
begin

	SELECT
			CONVERT(VARCHAR(10),C.Fecha,103) AS 'FECHA CITA', C.HoraInicio AS 'HORA CITA',S.Nombre AS 'CONSULTORIO',
			concat(E.ApellidoPaterno collate database_default,' ',E.ApellidoMaterno collate database_default,' ',e.Nombres collate database_default)as 'MEDICO',
			concat(isnull(p.ApellidoPaterno,' '),' ',isnull(p.ApellidoMaterno  ,' '),' ', isnull(p.PrimerNombre,' '),' ', isnull(p.SegundoNombre,'')) as 'PACIENTE',
			P.NroHistoriaClinica AS 'HISTORIA CLINICA',FF.Descripcion AS 'FINANCIAMIENTO',ISNULL(P.Telefono,'') AS 'NRO.TELEFONO',
			cl.descripcion AS 'PARENTESCO',git.descripcion AS 'GRADO INSTRUCCIÓN DEL TITULAR',tec.Descripcion as 'ESTADO CITA',
			concat(Ec.ApellidoPaterno collate database_default,' ',Ec.ApellidoMaterno collate database_default,' ',ec.Nombres collate database_default) as 'USUARIO REGISTRA',
			CONVERT(VARCHAR(10), c.FechaSolicitud, 103) AS 'FECHA REGISTRA',
			concat(UEC.ApellidoPaterno collate database_default,' ',UEC.ApellidoMaterno collate database_default,' ',UEC.Nombres collate database_default) as 'USUARIO ELIMINA CITA',
			CONVERT(VARCHAR(10), c.FechaHoraElimina, 103) AS 'FECHA ELIMINA',
			concat(uad.ApellidoPaterno collate database_default,' ',uad.ApellidoMaterno collate database_default,' ',uad.Nombres collate database_default) as 'USUARIO ADMISION',
			CONVERT(VARCHAR(10), c.FechaHoraAdmision, 103) AS 'FECHA ADMISION',
			tda.Descripcion as 'DESTINO',
			ISNULL(DATEDIFF(DAY,C.FECHA,ADA.ProximaCita),0) AS 'PROXIMA CITA (Dias)', ISNULL(CONVERT(VARCHAR(10),ADA.ProximaCita,103),'') AS 'FEC.PROXIMA CITA',ISNULL(TC.Descripcion,'') AS 'TIPO DE CITA',
			ISNULL(RC.Farmacia,'NO') AS Farmacia,
			ISNULL(RC.PatologiaClinica,'NO') AS PatologiaClinica,
			ISNULL(RC.AnatomiaPatologica,'NO') AS AnatomiaPatologica,
			ISNULL(RC.BancoSangre,'NO') AS BancoSangre,
			ISNULL(RC.EcoGeneral,'NO') AS EcoGeneral,
			ISNULL(RC.EcoObsetrica,'NO') AS EcoObsetrica,
			isnull(EntrevistaPacienteCE.EdadGestacional,(select top 1 EvaluacionEmergencia.EdadGestacional  from EvaluacionEmergencia where EvaluacionEmergencia.IdAtencion=A.IdAtencion)) as EdadGestacionalSemanas	
		from Atenciones A
		inner join Citas C on C.IdAtencion=A.IdAtencion
		inner join ProgramacionMedica  PM on PM.IdProgramacion=C.IdProgramacion
		inner join Turnos T on T.IdTurno=PM.IdTurno
		INNER JOIN Pacientes P ON P.IdPaciente=c.IdPaciente
		INNER JOIN Servicios S ON S.IdServicio=C.IdServicio
		INNER JOIN FuentesFinanciamiento FF ON A.idFuenteFinanciamiento=FF.IdFuenteFinanciamiento
		left join TiposDestinoAtencion tda on tda.IdDestinoAtencion=a.IdDestinoAtencion
		inner join TiposEstadosCita tec on tec.IdEstadoCita=c.IdEstadoCita
		INNER JOIN Medicos M ON M.IdMedico=C.IdMedico
		INNER JOIN Empleados E ON e.IdEmpleado=m.IdEmpleado
		LEFT JOIN AtencionesDatosAdicionales ADA ON ADA.idAtencion=A.IdAtencion
		LEFT JOIN TiposConsulta TC ON TC.idTipoConsulta=ADA.idTipoConsultaProxCita 
		left join EntrevistaPacienteCE on EntrevistaPacienteCE.IdCuentaAtencion=A.IdCuentaAtencion and EntrevistaPacienteCE.IdClasificacionPaciente=1
		left join Empleados ec on ec.IdEmpleado = c.IdEmpleado
		
		LEFT JOIN Pacientes pt on p.FichaFamiliar = pt.FichaFamiliar and pt.CondLaboral = 0 
		LEFT JOIN TiposCondicionLaboral cl on cl.IdCondicion = p.CondLaboral 
		LEFT JOIN TiposGradoInstruccion git on git.IdGradoInstruccion = pt.IdGradoInstruccion 
		
		LEFT JOIN Empleados UEC ON UEC.IdEmpleado=c.IdUsuarioElimina
		LEFT JOIN Empleados uad ON uad.IdEmpleado=c.IdUsuarioAdmision
		
		LEFT JOIN (
			SELECT 
					IdCuentaAtencion,
					MAX(CASE WHEN IdPuntoCarga = 5 THEN 'SI' ELSE 'NO' END) AS Farmacia,
					MAX(CASE WHEN IdPuntoCarga = 2 THEN 'SI' ELSE 'NO' END) AS PatologiaClinica,
					MAX(CASE WHEN IdPuntoCarga = 3 THEN 'SI' ELSE 'NO' END) AS AnatomiaPatologica,
					MAX(CASE WHEN IdPuntoCarga = 11 THEN 'SI' ELSE 'NO' END) AS BancoSangre,
					MAX(CASE WHEN IdPuntoCarga = 20 THEN 'SI' ELSE 'NO' END) AS EcoGeneral,
					MAX(CASE WHEN IdPuntoCarga = 23 THEN 'SI' ELSE 'NO' END) AS EcoObsetrica
			FROM RecetaCabecera
			GROUP BY IdCuentaAtencion
		) RC ON RC.IdCuentaAtencion = A.IdCuentaAtencion
		
	 WHERE 
		(S.IdTipoServicio=@idTipoServicio OR @idTipoServicio=-1 or @idTipoServicio=0) 
		AND (IdDepartamento=@idDepartamento OR @IdDepartamento=-1 OR @IdDepartamento=0) 
		AND (S.IdEspecialidad=@idEspecialidad OR @idEspecialidad=-1 OR @idEspecialidad=0)
		AND (S.IdServicio =@idServicio OR @idServicio=-1 OR @idServicio=0) 
		AND (c.IdMedico=@idMedico or @idMedico=-1 or @idMedico=0)
		AND C.Fecha >= @FechaInicio AND C.Fecha < DATEADD(DAY,1,@FechaFin)
		AND (tc.idTipoConsulta=@idDestino or @idDestino=-1 OR @idDestino=0)  
		order by c.Fecha,c.HoraInicio
		OPTION (RECOMPILE)
END
GO





CREATE INDEX IX_Citas_Busqueda
ON Citas
(
    Fecha,
    IdMedico,
    IdServicio,
    IdEstadoCita
)
INCLUDE
(
    IdAtencion,
    IdPaciente,
    HoraInicio,
    FechaSolicitud,
    FechaHoraElimina,
    FechaHoraAdmision,
    IdEmpleado,
    IdUsuarioElimina,
    IdUsuarioAdmision,
    IdProgramacion
)
GO

CREATE INDEX IX_RecetaCabecera_Cuenta_Punto
ON RecetaCabecera(IdCuentaAtencion, IdPuntoCarga)
GO


CREATE INDEX IX_Atenciones_Principal
ON Atenciones(IdAtencion)
INCLUDE(IdCuentaAtencion, IdFuenteFinanciamiento, IdDestinoAtencion)
GO


CREATE INDEX IX_Servicios_Filtros
ON Servicios
(
    IdServicio,
    IdTipoServicio,
    IdEspecialidad
)
GO

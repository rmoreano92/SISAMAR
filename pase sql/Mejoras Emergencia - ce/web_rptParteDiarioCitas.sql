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

	SELECT top 10
			CONVERT(VARCHAR(10),C.Fecha,103) AS 'FECHA CITA', C.HoraInicio AS 'HORA CITA',S.Nombre AS 'CONSULTORIO',
			concat(E.ApellidoPaterno collate database_default,' ',E.ApellidoMaterno collate database_default,' ',e.Nombres collate database_default)as 'MEDICO',
			concat(isnull(p.ApellidoPaterno,' '),' ',isnull(p.ApellidoMaterno  ,' '),' ', isnull(p.PrimerNombre,' '),' ', isnull(p.SegundoNombre,'')) as 'PACIENTE',
			P.NroHistoriaClinica AS 'HISTORIA CLINICA',FF.Descripcion AS 'FINANCIAMIENTO',ISNULL(P.Telefono,'') AS 'NRO.TELEFONO',
			cl.descripcion AS 'PARENTESCO',git.descripcion AS 'GRADO INSTRUCCIÓN DEL TITULAR',tec.Descripcion as 'ESTADO CITA',
			concat(Ec.ApellidoPaterno collate database_default,' ',Ec.ApellidoMaterno collate database_default,' ',ec.Nombres collate database_default) as 'USUARIO REGISTRA',
			CONVERT(VARCHAR(10), c.FechaSolicitud, 103) AS 'FECHA REGISTRA',
			concat(UEC.ApellidoPaterno collate database_default,' ',UEC.ApellidoMaterno collate database_default,' ',UEC.Nombres collate database_default) as 'USUARIO ELIMINA CITA',
			CONVERT(VARCHAR(10), ce.FechaHora, 103) AS 'FECHA ELIMINA',
			concat(uad.ApellidoPaterno collate database_default,' ',uad.ApellidoMaterno collate database_default,' ',uad.Nombres collate database_default) as 'USUARIO ADMISION',
			CONVERT(VARCHAR(10), c.FechaHoraAdmision, 103) AS 'FECHA ADMISION',
			tda.Descripcion as 'DESTINO',
			ISNULL(DATEDIFF(DAY,C.FECHA,ADA.ProximaCita),0) AS 'PROXIMA CITA (Dias)', ISNULL(CONVERT(VARCHAR(10),ADA.ProximaCita,103),'') AS 'FEC.PROXIMA CITA',ISNULL(TC.Descripcion,'') AS 'TIPO DE CITA',
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=5) as Farmacia,
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=2) as PatologiaClinica,
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=3) as AnatomiaPatologica,
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=11) as BancoSangre,
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=20) as EcoGeneral,
			(select iif(count(*)>0,'SI','NO') from RecetaCabecera where idCuentaAtencion=A.IdCuentaAtencion and IdPuntoCarga=23) as EcoObsetrica,
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
		LEFT JOIN Auditoria ce on ce.tabla = 'citas' and ce.accion = 'E' and ce.idRegistro = c.IdCita
		LEFT JOIN Empleados UEC ON UEC.IdEmpleado=ce.IdEmpleado
		LEFT JOIN Empleados uad ON uad.IdEmpleado=c.IdUsuarioAdmision
	 WHERE (S.IdTipoServicio=@idTipoServicio OR @idTipoServicio=-1 or @idTipoServicio=0) AND (IdDepartamento=@idDepartamento OR @IdDepartamento=-1 OR @IdDepartamento=0) AND
			 (S.IdEspecialidad=@idEspecialidad OR @idEspecialidad=-1 OR @idEspecialidad=0) AND (S.IdServicio =@idServicio OR @idServicio=-1 OR @idServicio=0) AND 
			 (c.IdMedico=@idMedico or @idMedico=-1 or @idMedico=0) and CAST(C.Fecha AS DATE) between  @FechaInicio and @FechaFin  and
			 (tc.idTipoConsulta=@idDestino or @idDestino=-1 OR @idDestino=0)  
			 order by c.Fecha,c.HoraInicio
END
GO










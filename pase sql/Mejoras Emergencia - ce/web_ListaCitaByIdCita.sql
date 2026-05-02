ALTER procedure [dbo].[web_ListaCitaByIdCita]
/*
---------------------------------------------------------------
SP      : web_ListaCitaByIdCita
Modulo  : CE > Admisión > Mostrar Ticket
---------------------------------------------------------------
| Usuario | Fecha       | Cambio
---------------------------------------------------------------
| MGAMERO | 06/03/2026  | Seleccionar UsuarioRegistro para mostrarlo en el Ticket
---------------------------------------------------------------
*/
@idCita int
as
SELECT
	C.idCita,
	C.IdProgramacion,																					--KHOYOSI
	IdTipoConsulta = (CASE C.IdProducto WHEN 4584 THEN 1 WHEN 53013 THEN 2 ELSE -1 END),				--KHOYOSI
	Turno = (FLOOR(DATEDIFF(MINUTE, PM.HoraInicio, C.HoraInicio) / PM.TiempoPromedioAtencion) + 1),		--KHOYOSI
	Convert(varchar, C.fecha, 103) fecha,
	C.horaInicio,
	C.horaFin,
	C.idCita,
	isNull(P.ApellidoPaterno, '') + ' ' + isNull(P.ApellidoMaterno, '') + ' ' + isNull(P.PrimerNombre, '') + ' ' + isNull(P.SegundoNombre, '') + ' ' + isNull(P.TercerNombre, '') pacienteNombre,
	Convert(varchar, C.FechaSolicitud, 103) fechaSolicitud,
	T.Descripcion desTurno,
	Serv.Nombre desServicio,
	isNull(Emp.ApellidoPaterno, '') + ' ' + isNull(Emp.ApellidoMaterno, '') + ' ' + isNull(Emp.Nombres, '') medico,
	P.NroHistoriaClinica nroHistoria,

	FF.IdFuenteFinanciamiento,
	ISNULL(FF.Descripcion, '') desFuenteFinanciamiento,
	ISNULL(FSP.idOrdenPago, 0) idOrdenPago,
	A.idCuentaAtencion,
	ISNULL(C.TipoCita, '') TipoCita,
	TE.Descripcion TipoProfesional,
	Convert(varchar, C.FechaSolicitud, 103) FechaSolicitud,
	C.HoraSolicitud,

	FOS.IdEstadoFacturacion,

	A.Edad,
	TEdad.Descripcion TipoEdad, 
	Esp.Nombre Especialidad,

	'(' + EOrigen.Codigo + ') ' + EOrigen.Nombre EstablecimientoReferencia, ADA.NroReferenciaOrigen NroReferencia,
		ISNULL(GRA.Descripcion, '') GradoInstruccion,
	
	CASE
	  WHEN NULLIF(LTRIM(RTRIM(ISNULL(p.FichaFamiliar,''))), '') IS NULL
		THEN p2.FichaFamiliar
	  ELSE p.FichaFamiliar
	END AS CIP,

	--ISNULL(PARP.VPARENSTESCO_DESCRIPCION, '') AS ParentescoPacienteDesc,
	/*CASE 
  WHEN NULLIF(LTRIM(RTRIM(ISNULL(TiposCondicionLaboral.Descripcion, ''))), '') IS NOT NULL
    THEN TiposCondicionLaboral.Descripcion
  ELSE
    CASE ISNULL(p.ParentescoPaciente, p2.InfIdParentescoTitular)
      WHEN 0  THEN 'TITULAR'
      WHEN 1  THEN 'CONYUGE'
      WHEN 2  THEN 'HIJO(A)'
      WHEN 3  THEN 'MADRE'
      WHEN 4  THEN 'PADRES'
      WHEN 5  THEN 'SUEGROS'
      WHEN 6  THEN 'HIJASTRO(A)'
      WHEN 7  THEN 'VIUDO(A)'
      WHEN 8  THEN 'TODOS'
      WHEN 9  THEN 'CONVIVIENTE'
      WHEN 10 THEN 'EX CONYUGE'
      ELSE ''
    END
	END AS ParentescoPacienteDesc,*/
	
	CASE
	  WHEN NULLIF(LTRIM(RTRIM(ISNULL(cl1.IdCondicion,''))), '') IS NULL
		THEN cl2.Descripcion
	  ELSE cl1.Descripcion
	END AS ParentescoPacienteDesc,
	
	p2.NroDocumento,
	IdUsuarioRegistro = UsuReg.IdEmpleado,
	UsuarioRegistro = isNull(UsuReg.ApellidoPaterno, '') + ' ' + isNull(UsuReg.ApellidoMaterno, '') + ' ' + isNull(UsuReg.Nombres, '')
	
FROM
	 Citas C
	INNER JOIN  Pacientes P ON C.IdPaciente = P.IdPaciente
	LEFT JOIN Pacientes2207 p2 on p.IdPaciente = p2.IdPaciente
	INNER JOIN  ProgramacionMedica PM ON C.IdProgramacion = PM.IdProgramacion
	INNER JOIN  Turnos T ON PM.IdTurno = T.IdTurno
	INNER JOIN  Servicios Serv  ON PM.IdServicio = Serv.IdServicio
	INNER JOIN  Especialidades Esp ON Serv.IdEspecialidad = Esp.IdEspecialidad
	INNER JOIN  Medicos Med ON PM.IdMedico = Med.IdMedico
	LEFT JOIN TiposGradoInstruccion GRA ON GRA.IdGradoInstruccion = P.IdGradoInstruccion  
	LEFT JOIN  Empleados Emp ON Med.IdEmpleado = Emp.IdEmpleado
	INNER JOIN  Atenciones A ON C.IdAtencion = A.IdAtencion

	INNER JOIN  AtencionesDatosAdicionales ADA ON A.IdAtencion = ADA.idAtencion
	LEFT JOIN  Establecimientos EOrigen ON ADA.IdEstablecimientoOrigen = EOrigen.IdEstablecimiento
	INNER JOIN  TiposEdad TEdad ON A.IdTipoEdad = TEdad.IdTipoEdad
	INNER JOIN  FuentesFinanciamiento FF ON A.idFuenteFinanciamiento = FF.IdFuenteFinanciamiento
	LEFT JOIN FactOrdenServicio FOS ON A.IdCuentaAtencion = FOS.IdCuentaAtencion
	LEFT JOIN  FactOrdenServicioPagos FSP ON FOS.IdOrden = FSP.idOrden
	LEFT JOIN  TiposEmpleado TE ON Emp.IdTipoEmpleado = TE.IdTipoEmpleado
	LEFT JOIN TiposCondicionLaboral cl1 ON P.CondLaboral = cl1.IdCondicion
	LEFT JOIN TiposCondicionLaboral cl2 ON P2.CondLaboral = cl2.IdCondicion
	LEFT JOIN Empleados UsuReg ON UsuReg.IdEmpleado = C.IdEmpleado
WHERE
	IdCita = @idCita
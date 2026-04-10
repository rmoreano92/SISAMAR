/*
modificacion : se agrego para el documento de paciente cronico
Autor:rmoreano
modificacion : se agrego para el documento de papeleta de hospitalizacion
Autor: jvicente
*/

ALTER PROCEDURE [dbo].[web_FirmaDigitalSeleccionarDatosParaFirmaDigital] 
@idCuenta int,
@idRegistro int,
@idItem int,
@tipo varchar(15),
@idNumero int
as
begin

DECLARE @code VARCHAR(256) = NULL

SET @code = (SELECT TOP 1 code FROM FirmasDigitales WHERE idCuentaAtencion = @idCuenta AND idRegistro = @idRegistro AND tipo = @tipo AND  idItem = @idItem)
SET @code = ISNULL(@code, '0')

IF @tipo = 'CE-A'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END

IF @tipo = 'CE-APC' --RMOREANO
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END


IF @tipo = 'RF'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	ref.IdReferencia AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM EmisionReferencia ref
	LEFt JOIN Atenciones a ON a.IdCuentaAtencion = ref.IdCuentaAtencion
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	WHERE a.IdCuentaAtencion = @idCuenta AND ref.Estado = 1
END

IF @tipo = 'CRF'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	cref.IdContraReferencia AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM EmisionContraReferencia cref
	LEFT JOIN Atenciones a ON a.IdCuentaAtencion = cref.IdCuentaAtencion
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	WHERE a.IdCuentaAtencion = @idCuenta AND cref.Estado = 1
END

IF @tipo = 'FUA'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	fua.idCuentaAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,

	Servicio = ISNULL(serv.Nombre, ''),
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN SIGH_EXTERNA..SisFuaAtencion fua ON fua.idCuentaAtencion = a.IdCuentaAtencion
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END

IF @tipo = 'REC'
BEGIN
	SELECT TOP 1
	@code AS code,
	rec.idCuentaAtencion AS idCuentaAtencion,
	rec.idReceta AS idRegistro,
	serv.IdTipoServicio AS idTipoServicio,
	rec.idServicioReceta AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), rec.FechaReceta, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM RecetaCabecera rec	
	LEFT JOIN Medicos med ON med.IdMedico = rec.idMedicoReceta
	LEFT JOIN Servicios serv ON serv.IdServicio = rec.idServicioReceta
	WHERE rec.idReceta = @idRegistro AND rec.idCuentaAtencion = @idCuenta
END

IF @tipo = 'TCK-CS'
BEGIN
	SELECT TOP 1
	@code AS code,
	fact.idCuentaAtencion AS idCuentaAtencion,
	fact.IdOrden AS idRegistro,
	serv.IdTipoServicio AS idTipoServicio,
	fact.IdServicioPaciente AS idServicio,
	0 AS idEvaluacion,
	emp.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), fact.FechaCreacion, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM FactOrdenServicio fact	
	LEFT JOIN Empleados emp ON emp.IdEmpleado = fact.IdUsuario
	LEFT JOIN Servicios serv ON serv.IdServicio = fact.IdServicioPaciente
	WHERE fact.IdOrden = @idRegistro AND fact.idCuentaAtencion = @idCuenta
END

IF @tipo = 'CE-PD'
BEGIN
	SELECT TOP 1
	@code AS code,
	0 AS idCuentaAtencion,
	prog.IdProgramacion AS idRegistro,
	serv.IdTipoServicio AS idTipoServicio,
	prog.IdServicio AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), prog.Fecha, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM ProgramacionMedica prog
	LEFT JOIN Medicos med ON med.IdMedico = prog.IdMedico
	LEFT JOIN Servicios serv ON serv.IdServicio = prog.IdServicio
	WHERE prog.IdProgramacion = @idRegistro	
END

IF @tipo = 'E-EVA'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	evadet.IdEvaluacionDetalle AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(evadet.idServicio, 0) AS idServicio,
	evadet.IdNumero AS idEvaluacion,
	evadet.IdUsuario AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM EvaluacionEmergenciaDetalle evadet
	LEFT JOIN EvaluacionEmergencia eva ON eva.IdAtencion = evadet.IdAtencion
	LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion	
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Empleados emp ON emp.IdEmpleado = evadet.IdUsuario
	LEFT JOIN Servicios serv ON serv.IdServicio = evadet.idServicio
	WHERE a.IdCuentaAtencion = @idCuenta AND evadet.IdEvaluacionDetalle = @idRegistro
END

IF @tipo = 'E-PH'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END


IF @tipo = 'E-PHF'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END


IF @tipo = 'E-PEM'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	a.IdServicioIngreso AS idServicio,
	0 AS idEvaluacion,
	med.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso
	WHERE a.IdCuentaAtencion = @idCuenta
END

IF @tipo = 'H-EVA'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	evadet.IdEvaluacionDetalle AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(evadet.idServicio, 0) AS idServicio,
	evadet.IdNumero AS idEvaluacion,
	evadet.IdUsuario AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM EvaluacionHospitalizacionDetalle evadet
	LEFT JOIN EvaluacionHospitalizacion eva ON eva.IdAtencion = evadet.IdAtencion
	LEFT JOIN EvaluacionNeonatal evaneo ON evaneo.IdAtencion = evadet.IdAtencion
	LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion	OR evaneo.IdAtencion = a.IdAtencion
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Empleados emp ON emp.IdEmpleado = evadet.IdUsuario
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = evadet.idServicio
	WHERE a.IdCuentaAtencion = @idCuenta AND evadet.IdEvaluacionDetalle = @idRegistro
END

IF @tipo = 'H-EPIC'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	a.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioEgreso, 0) AS idServicio,
	0 AS idEvaluacion,
	emp.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM Atenciones a
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoEgreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = med.IdEmpleado
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioEgreso
	WHERE a.IdCuentaAtencion = @idCuenta --AND evadet.IdEvaluacionDetalle = @idRegistro
END

IF @tipo = 'CN'
BEGIN
	SELECT TOP 1
	@code AS code,
	0 AS idCuentaAtencion,
	const.idConstancia AS idRegistro,
	0 AS idTipoServicio,
	0 AS idServicio,
	0 AS idEvaluacion,
	--const.idUsuarioReg AS idEmpleado,
	idEmpleado = ISNULL((SELECT TOP 1 UsuariosRoles.IdEmpleado FROM UsuariosRoles INNER JOIN RolesPermisos ON RolesPermisos.IdRol = UsuariosRoles.IdRol WHERE RolesPermisos.IdPermiso = 800 ORDER BY UsuariosRoles.IdUsuarioRol ASC), 0),
	CONVERT(VARCHAR(10), const.FechaReg, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM ConstanciasRn const	
	WHERE const.idConstancia = @idRegistro
END

IF @tipo = 'HOSPNI'
BEGIN
	SELECT 
		TOP 1
		ISNULL(FirmasDigitales.code, 0) AS code,
		a.IdCuentaAtencion AS idCuentaAtencion,
		eva.IdAtencion AS idRegistro,
		a.IdTipoServicio AS idTipoServicio,
		eva.idServicio AS idServicio,
		eva.IdNumero AS idEvaluacion,
		eva.IdUsuario AS idEmpleado,
		CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
		Servicio = '',
		Paciente = '',
		Cama = '',
		Cuenta = '',
		Historia = '',
		Edad = '',
		Movimiento = '',
		@tipo AS tipo	,
		Firmador1 = '',
		TipoFirmador1 = '',
		Firmador2 = '',
		TipoFirmador2 = ''
	FROM 
		EvaluacionEmergencia eva
		LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion
		left join FirmasDigitales ON a.IdCuentaAtencion = FirmasDigitales.idCuentaAtencion and a.IdAtencion = FirmasDigitales.idRegistro and FirmasDigitales.idEvaluacion = @idNumero and FirmasDigitales.tipo = 'HOSPNI'
	WHERE a.IdCuentaAtencion = @idCuenta AND eva.IdAtencion = @idRegistro and eva.idNumero = @idNumero
END

IF @tipo = 'MED-REPRO'
BEGIN
	SELECT TOP 1
	ISNULL(FirmasDigitales.code, 0) AS code,
	ISNULL(FactOrdenServicio.IdCuentaAtencion, 0) AS idCuentaAtencion,
	FactOrdenServicio.IdOrden AS idRegistro,
	ISNULL(Atenciones.IdTipoServicio, 0) AS idTipoServicio,
	ISNULL(Atenciones.IdServicioEgreso, 0) AS idServicio,
	0 AS idEvaluacion,
	idEmpleado = MedicinaReproductiva.IdProfesionalBiologo,
	fecha = CONVERT(VARCHAR(10), MedicinaReproductiva.FechaRegistra, 103),-- + ' '  + convert(VARCHAR(8), MedicinaReproductiva.FechaRegistra, 14),	
	Paciente = UPPER(ISNULL(Pacientes.ApellidoPaterno, '') + ' ' + ISNULL(Pacientes.ApellidoMaterno, '') + ' ' + ISNULL(Pacientes.PrimerNombre, '') + ' ' + ISNULL(Pacientes.SegundoNombre, '') + ' ' + ISNULL(Pacientes.TercerNombre, '')),
	Servicio = ISNULL(serv.Nombre, ''),	
	Cama = (SELECT TOP 1 Camas.Codigo FROM AtencionesEstanciaHospitalaria INNER JOIN Camas ON Camas.IdCama = AtencionesEstanciaHospitalaria.IdCama WHERE IdAtencion = Atenciones.IdAtencion AND IdServicio = FactOrdenServicio.IdServicioPaciente ORDER BY Secuencia DESC),
	Cuenta = Atenciones.IdCuentaAtencion,
	Historia = Pacientes.NroHistoriaClinica,
	Edad = DATEDIFF(YEAR, Pacientes.FechaNacimiento, Atenciones.FechaIngreso),
	Movimiento = 0,
	@tipo AS tipo,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
		FactOrdenServicio
		LEFT JOIN FacturacionServicioDespacho ON FacturacionServicioDespacho.IdOrden = FactOrdenServicio.IdOrden AND FacturacionServicioDespacho.IdProducto = @idItem		
		LEFT JOIN Servicios serv ON serv.IdServicio = FactOrdenServicio.IdServicioPaciente
		LEFT JOIN Atenciones ON Atenciones.IdCuentaAtencion = FactOrdenServicio.IdCuentaAtencion
		LEFT JOIN Pacientes ON Pacientes.IdPaciente = Atenciones.IdPaciente
		LEFT JOIN MedicinaReproductiva ON MedicinaReproductiva.IdOrden = FactOrdenServicio.IdOrden AND MedicinaReproductiva.IdAtencion = Atenciones.IdAtencion AND MedicinaReproductiva.IdProducto = FacturacionServicioDespacho.IdProducto
		LEFT JOIN FirmasDigitales ON FirmasDigitales.idCuentaAtencion = Atenciones.IdCuentaAtencion AND FirmasDigitales.idRegistro = FactOrdenServicio.IdOrden AND FirmasDigitales.idItem = FacturacionServicioDespacho.IdProducto AND FirmasDigitales.tipo = 'MED-REPRO'
	WHERE
		FactOrdenServicio.IdOrden = @idRegistro --AND LabMovimientoCPT.idProductoCPT = @idItem	
END

IF @tipo = 'LAB-RES'
BEGIN
	SELECT TOP 1
	ISNULL(FirmasDigitales.code, 0) AS code,
	ISNULL(FactOrdenServicio.IdCuentaAtencion, 0) AS idCuentaAtencion,
	LabMovimientoLaboratorio.IdMovimiento AS idRegistro,
	ISNULL(Atenciones.IdTipoServicio, 0) AS idTipoServicio,
	ISNULL(Atenciones.IdServicioEgreso, 0) AS idServicio,
	0 AS idEvaluacion,
	idEmpleado = (SELECT TOP 1 realizaAnalisis FROM LabResultadoPorItems WHERE LabResultadoPorItems.idOrden = LabMovimientoLaboratorio.IdOrden AND LabResultadoPorItems.idProductoCpt = LabMovimientoCPT.idProductoCPT),
	fecha = (SELECT TOP 1 CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14) FROM LabResultadoPorItems WHERE LabResultadoPorItems.idOrden = LabMovimientoLaboratorio.IdOrden AND LabResultadoPorItems.idProductoCpt = LabMovimientoCPT.idProductoCPT),	
	Paciente = ISNULL(LabMovimientoLaboratorio.Paciente, ''),
	Servicio = ISNULL(serv.Nombre, ''),	
	Cama = (SELECT TOP 1 Camas.Codigo FROM AtencionesEstanciaHospitalaria INNER JOIN Camas ON Camas.IdCama = AtencionesEstanciaHospitalaria.IdCama WHERE IdAtencion = Atenciones.IdAtencion AND IdServicio = FactOrdenServicio.IdServicioPaciente ORDER BY Secuencia DESC),
	Cuenta = Atenciones.IdCuentaAtencion,
	Historia = Pacientes.NroHistoriaClinica,
	Edad = DATEDIFF(YEAR, LabMovimientoLaboratorio.FechaNacimiento, Atenciones.FechaIngreso),
	Movimiento = LabMovimientoLaboratorio.IdMovimiento,
	@tipo AS tipo,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
		LabMovimientoLaboratorio
		LEFT JOIN LabMovimientoCPT ON LabMovimientoCPT.IdMovimiento = LabMovimientoLaboratorio.IdMovimiento AND LabMovimientoCPT.idProductoCPT = @idItem
		LEFT JOIN FactOrdenServicio ON FactOrdenServicio.IdOrden = LabMovimientoLaboratorio.IdOrden
		LEFT JOIN Servicios serv ON serv.IdServicio = FactOrdenServicio.IdServicioPaciente
		LEFT JOIN Atenciones ON Atenciones.IdCuentaAtencion = FactOrdenServicio.IdCuentaAtencion
		LEFT JOIN Pacientes ON Pacientes.IdPaciente = Atenciones.IdPaciente
		LEFT JOIN FirmasDigitales on FirmasDigitales.idRegistro = LabMovimientoLaboratorio.IdMovimiento  AND FirmasDigitales.idItem = LabMovimientoCPT.idProductoCPT AND FirmasDigitales.tipo = 'LAB-RES'		
	WHERE
		LabMovimientoLaboratorio.IdMovimiento = @idRegistro --AND LabMovimientoCPT.idProductoCPT = @idItem	
END

IF @tipo = 'LAB-RES-GRUPO'
BEGIN
	SELECT TOP 1
	ISNULL(FirmasDigitales.code, 0) AS code,
	ISNULL(FactOrdenServicio.IdCuentaAtencion, 0) AS idCuentaAtencion,
	LabMovimientoLaboratorio.IdMovimiento AS idRegistro,
	ISNULL(Atenciones.IdTipoServicio, 0) AS idTipoServicio,
	ISNULL(Atenciones.IdServicioEgreso, 0) AS idServicio,
	0 AS idEvaluacion,
	--idEmpleado = (SELECT TOP 1 realizaAnalisis FROM LabResultadoPorItems WHERE LabResultadoPorItems.idOrden = LabMovimientoLaboratorio.IdOrden AND LabResultadoPorItems.idProductoCpt = LabMovimientoCPT.idProductoCPT),
	idEmpleado = 0,
	--fecha = (SELECT TOP 1 CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14) FROM LabResultadoPorItems WHERE LabResultadoPorItems.idOrden = LabMovimientoLaboratorio.IdOrden AND LabResultadoPorItems.idProductoCpt = LabMovimientoCPT.idProductoCPT),	
	fecha = '',
	Paciente = ISNULL(LabMovimientoLaboratorio.Paciente, ''),
	Servicio = ISNULL(serv.Nombre, ''),	
	Cama = (SELECT TOP 1 Camas.Codigo FROM AtencionesEstanciaHospitalaria INNER JOIN Camas ON Camas.IdCama = AtencionesEstanciaHospitalaria.IdCama WHERE IdAtencion = Atenciones.IdAtencion AND IdServicio = FactOrdenServicio.IdServicioPaciente ORDER BY Secuencia DESC),
	Cuenta = Atenciones.IdCuentaAtencion,
	Historia = Pacientes.NroHistoriaClinica,
	Edad = DATEDIFF(YEAR, LabMovimientoLaboratorio.FechaNacimiento, Atenciones.FechaIngreso),
	Movimiento = LabMovimientoLaboratorio.IdMovimiento,
	@tipo AS tipo,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
		LabMovimientoLaboratorio
		--LEFT JOIN LabMovimientoCPT ON LabMovimientoCPT.IdMovimiento = LabMovimientoLaboratorio.IdMovimiento AND LabMovimientoCPT.idProductoCPT = @idItem
		LEFT JOIN FactOrdenServicio ON FactOrdenServicio.IdOrden = LabMovimientoLaboratorio.IdOrden
		LEFT JOIN Servicios serv ON serv.IdServicio = FactOrdenServicio.IdServicioPaciente
		LEFT JOIN Atenciones ON Atenciones.IdCuentaAtencion = FactOrdenServicio.IdCuentaAtencion
		LEFT JOIN Pacientes ON Pacientes.IdPaciente = Atenciones.IdPaciente
		LEFT JOIN FirmasDigitales on FirmasDigitales.idRegistro = LabMovimientoLaboratorio.IdMovimiento AND FirmasDigitales.idItem = @idItem AND FirmasDigitales.tipo = 'LAB-RES-GRUPO'		
	WHERE
		LabMovimientoLaboratorio.IdMovimiento = @idRegistro --AND LabMovimientoCPT.idProductoCPT = @idItem	
END

IF @tipo = 'IMG-RES'
BEGIN
	SELECT TOP 1
	ISNULL(FirmasDigitales.code, 0) AS code,
	ISNULL(FactOrdenServicio.IdCuentaAtencion, 0) AS idCuentaAtencion,
	ImagMovimientoImagenes.IdMovimiento AS idRegistro,
	ISNULL(Atenciones.IdTipoServicio, 0) AS idTipoServicio,
	ISNULL(Atenciones.IdServicioEgreso, 0) AS idServicio,
	0 AS idEvaluacion,
	idEmpleado = (SELECT TOP 1 IdRealizaAnalisis FROM ImgResultadoCabecera WHERE ImgResultadoCabecera.idOrden = ImagMovimientoImagenes.IdOrden AND ImgResultadoCabecera.IdProducto = ImagMovimientoCPT.idProductoCPT),
	fecha = (SELECT TOP 1 CONVERT(VARCHAR(10), ImgResultadoCabecera.FechaResultado, 103) + ' '  + convert(VARCHAR(8), ImgResultadoCabecera.FechaResultado, 14) FROM ImgResultadoCabecera WHERE ImgResultadoCabecera.idOrden = ImagMovimientoImagenes.IdOrden AND ImgResultadoCabecera.IdProducto = ImagMovimientoCPT.idProductoCPT),	
	Paciente = ISNULL(ImagMovimientoImagenes.Paciente, ''),
	Servicio = ISNULL(serv.Nombre, ''),	
	Cama = (SELECT TOP 1 Camas.Codigo FROM AtencionesEstanciaHospitalaria INNER JOIN Camas ON Camas.IdCama = AtencionesEstanciaHospitalaria.IdCama WHERE IdAtencion = Atenciones.IdAtencion AND IdServicio = FactOrdenServicio.IdServicioPaciente ORDER BY Secuencia DESC),
	Cuenta = Atenciones.IdCuentaAtencion,
	Historia = Pacientes.NroHistoriaClinica,
	Edad = DATEDIFF(YEAR, ImagMovimientoImagenes.FechaNacimiento, Atenciones.FechaIngreso),
	Movimiento = ImagMovimientoImagenes.IdMovimiento,
	@tipo AS tipo,
	Firmador1 = (CASE 
					WHEN ImgResultadoCabecera.IdProducto IN (2374, 50164) THEN 'Obstetra responsable de realizar el procedimiento'
					WHEN emp1.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp1.ApellidoPaterno, '') + ' ' + ISNULL(emp1.ApellidoMaterno, '') + ' ' + ISNULL(emp1.Nombres, '')) 
					ELSE '' 
				 END),
	TipoFirmador1 = (CASE 
						WHEN ImgResultadoCabecera.IdProducto IN (2374, 50164) THEN ''
						WHEN temp1.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp1.Descripcion, '') 
						ELSE '' 
					 END) ,
	Firmador2 = (CASE 
					WHEN ImgResultadoCabecera.IdProducto IN (2374, 50164) THEN 'Médico responsable de realizar el informe'
					WHEN emp2.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp2.ApellidoPaterno, '') + ' ' + ISNULL(emp2.ApellidoMaterno, '') + ' ' + ISNULL(emp2.Nombres, '')) 
					ELSE '' 
				 END),
	TipoFirmador2 = (CASE 
						WHEN ImgResultadoCabecera.IdProducto IN (2374, 50164) THEN ''
						WHEN temp2.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp2.Descripcion, '') 
						ELSE '' 
					 END)
	FROM
		ImagMovimientoImagenes
		LEFT JOIN ImagMovimientoCPT ON ImagMovimientoCPT.IdMovimiento = ImagMovimientoImagenes.IdMovimiento AND ImagMovimientoCPT.idProductoCPT = @idItem
		LEFT JOIN FactOrdenServicio ON FactOrdenServicio.IdOrden = ImagMovimientoImagenes.IdOrden
		LEFT JOIN Servicios serv ON serv.IdServicio = FactOrdenServicio.IdServicioPaciente
		LEFT JOIN Atenciones ON Atenciones.IdCuentaAtencion = FactOrdenServicio.IdCuentaAtencion
		LEFT JOIN Pacientes ON Pacientes.IdPaciente = Atenciones.IdPaciente
		LEFT JOIN ImgResultadoCabecera ON ImgResultadoCabecera.IdOrden = ImagMovimientoImagenes.IdOrden AND ImgResultadoCabecera.IdProducto = ImagMovimientoCPT.idProductoCPT
		LEFT JOIN Empleados emp1 ON emp1.IdEmpleado = ImgResultadoCabecera.IdRealizaAnalisis
		LEFT JOIN TiposEmpleado temp1 ON temp1.IdTipoEmpleado = emp1.IdTipoEmpleado
		LEFT JOIN Empleados emp2 ON emp2.IdEmpleado = ImgResultadoCabecera.IdRealizaInforme
		LEFT JOIN TiposEmpleado temp2 ON temp2.IdTipoEmpleado = emp2.IdTipoEmpleado
		LEFT JOIN FirmasDigitales on FirmasDigitales.idRegistro = ImagMovimientoImagenes.IdMovimiento  AND FirmasDigitales.idItem = ImagMovimientoCPT.idProductoCPT AND FirmasDigitales.tipo = 'IMG-RES'		
	WHERE
		ImagMovimientoImagenes.IdMovimiento = @idRegistro --AND LabMovimientoCPT.idProductoCPT = @idItem	
END

--IF @tipo = 'LAB-PC' -- mejorar
--BEGIN
--	SELECT  
--	ISNULL(FirmasDigitales.code, 0) AS code,
--	ISNULL(LabMovimientoLaboratorio.IdCuentaAtencion, 0) AS idCuentaAtencion,
--	LabMovimientoLaboratorio.IdMovimiento AS idRegistro,
--	0 AS idTipoServicio,
--	0 AS idServicio,
--	0 AS idEvaluacion,
--	ISNULL(Empleados.IdEmpleado, 0) AS idEmpleado,
--	CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14) AS fecha,
--	@tipo AS tipo	
	
--	FROM 
--		LabResultadoPorItems 
--		inner join LabItemsCpt on LabItemsCpt.ordenXresultado=LabResultadoPorItems.ordenXresultado and LabItemsCpt.idProductoCpt=LabResultadoPorItems.idProductoCpt
--		inner join LabItemsGrupos on LabItemsGrupos.idItemGrupo=LabItemsCpt.idItemGrupo
--		inner join LabItems on LabItems.idItem=LabItemsCpt.idItem
--		inner join FactCatalogoServicios on FactCatalogoServicios.IdProducto=LabItemsCpt.idProductoCpt
--		left join Empleados on Empleados.IdEmpleado= LabResultadoPorItems.realizaAnalisis
--		left join TiposEmpleado on TiposEmpleado.IdTipoEmpleado=Empleados.IdTipoEmpleado
--		inner join LabMovimientoLaboratorio  on LabMovimientoLaboratorio.IdOrden=LabResultadoPorItems.idOrden
--		inner join LabMovimiento L on L.IdMovimiento=LabMovimientoLaboratorio.IdMovimiento
--		inner join Empleados usuarioRec on usuarioRec.IdEmpleado= L.IdUsuario
--		left join FirmasDigitales on LabMovimientoLaboratorio.IdMovimiento = FirmasDigitales.idRegistro and FactCatalogoServicios.IdProducto = FirmasDigitales.idItem and FirmasDigitales.tipo = 'LAB-PC'


--	WHERE
--		LabMovimientoLaboratorio.IdMovimiento = @idRegistro and IdProducto = @idItem
--		--and 
--		--(
--		--	iif(isnull(isnull(LabResultadoPorItems.ValorTexto,LabResultadoPorItems.valorCombo),LabResultadoPorItems.ValorNumero)='0.00','',isnull(isnull(LabResultadoPorItems.ValorTexto,LabResultadoPorItems.valorCombo),LabResultadoPorItems.ValorNumero)) <> '' and 

--		--	iif(isnull(isnull(LabResultadoPorItems.ValorTexto,LabResultadoPorItems.valorCombo),LabResultadoPorItems.ValorNumero)='0.00','',isnull(isnull(LabResultadoPorItems.ValorTexto,LabResultadoPorItems.valorCombo),LabResultadoPorItems.ValorNumero)) <> '0.00'
--		--)

--	GROUP BY
--		LabMovimientoLaboratorio.IdCuentaAtencion,
--		LabMovimientoLaboratorio.IdOrden,
--		LabMovimientoLaboratorio.IdMovimiento,
--		FactCatalogoServicios.IdProducto,
--		FactCatalogoServicios.Codigo,
--		FactCatalogoServicios.Nombre,
--		convert(varchar,L.Fecha,103)+' ' + CONVERT(varchar,L.Fecha,8),
--		CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14),
--		CONVERT(VARCHAR(MAX), FirmasDigitales.rutaArchivo),
--		Empleados.IdEmpleado,
--		FirmasDigitales.code
--END


IF @tipo = 'LAB-PCT' -- mejorar
BEGIN
	SELECT  TOP 1
		ISNULL(FirmasDigitales.code, 0) AS code,
		ISNULL(LabMovimientoLaboratorio.IdCuentaAtencion, 0) AS idCuentaAtencion,
		LabMovimientoLaboratorio.IdMovimiento AS idRegistro,
		0 AS idTipoServicio,
		0 AS idServicio,
		0 AS idEvaluacion,
		Empleados.IdEmpleado AS idEmpleado,
		CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14) AS fecha,
		Servicio = '',
		Paciente = '',
		Cama = '',
		Cuenta = '',
		Historia = '',
		@tipo AS tipo	,
		Firmador1 = '',
		TipoFirmador1 = '',
		Firmador2 = '',
		TipoFirmador2 = ''
	FROM 
		LabResultadoPorItems 
		
		left join Empleados on Empleados.IdEmpleado= LabResultadoPorItems.realizaAnalisis
		left join TiposEmpleado on TiposEmpleado.IdTipoEmpleado=Empleados.IdTipoEmpleado
		inner join LabMovimientoLaboratorio  on LabMovimientoLaboratorio.IdOrden=LabResultadoPorItems.idOrden
		inner join LabMovimiento L on L.IdMovimiento=LabMovimientoLaboratorio.IdMovimiento
		inner join Empleados usuarioRec on usuarioRec.IdEmpleado= L.IdUsuario
		left join FirmasDigitales on LabMovimientoLaboratorio.IdMovimiento = FirmasDigitales.idRegistro and FirmasDigitales.tipo = 'LAB-PCT' and FirmasDigitales.idItem = 0


	WHERE
		LabMovimientoLaboratorio.IdMovimiento = @idRegistro

	GROUP BY
		LabMovimientoLaboratorio.IdCuentaAtencion,
		LabMovimientoLaboratorio.IdOrden,
		LabMovimientoLaboratorio.IdMovimiento,
		convert(varchar,L.Fecha,103)+' ' + CONVERT(varchar,L.Fecha,8),
		CONVERT(VARCHAR(10), LabResultadoPorItems.Fecha, 103) + ' '  + convert(VARCHAR(8), LabResultadoPorItems.Fecha, 14),
		CONVERT(VARCHAR(MAX), FirmasDigitales.rutaArchivo),
		Empleados.IdEmpleado,
		FirmasDigitales.code
END
--SELECT * FROM FirmasDigitales
--SELECT * FROM RecetaCabecera WHERe idReceta = 175021

IF @tipo = 'CONS-SER'
BEGIN
	SELECT 
		TOP 1
		ISNULL(FirmasDigitales.code, 0) AS code,
		a.IdCuentaAtencion AS idCuentaAtencion,
		a.IdAtencion AS idRegistro,
		a.IdTipoServicio AS idTipoServicio,
		a.IdServicioIngreso AS idServicio,
		0 AS idEvaluacion,
		0 AS idEmpleado,
		CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
		Servicio = '',
		Paciente = '',
		Cama = '',
		Cuenta = '',
		Historia = '',
		@tipo AS tipo	,
		Firmador1 = '',
		TipoFirmador1 = '',
		Firmador2 = '',
		TipoFirmador2 = ''
	FROM 
		Atenciones a
		left join FirmasDigitales ON a.IdCuentaAtencion = FirmasDigitales.idCuentaAtencion and a.IdAtencion = FirmasDigitales.idRegistro and FirmasDigitales.tipo = 'CONS-SER'
	WHERE a.IdCuentaAtencion = @idCuenta 
END


IF @tipo = 'UCI-EVA'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	evaUCI.IdAtencionDetalleUCI AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	evaUCI.NroEvaluacion AS idEvaluacion,
	evaUCI.idEmpleado AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = isnull(Camas.Codigo, ''),
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Edad = (CONVERT(VARCHAR, a.Edad) + ' ' + TiposEdad.Descripcion),
	Movimiento = '',
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM AtencionesEvaluacionDetalleUCI evaUCI
	LEFT JOIN AtencionesEvaluacionUCI eva ON eva.IdAtencion = evaUCI.IdAtencion
	LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion	
	LEFT JOIN TiposEdad ON a.IdTipoEdad = TiposEdad.IdTipoEdad
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Camas ON Camas.IdCama = IIF(a.IdServicioEgreso IS NULL, a.idcamaIngreso, a.idCamaEgreso)
	--LEFT JOIN Empleados emp ON emp.IdEmpleado = eva.IdUsuario  -- revisar luego tiene que jalar de la evaluacion
	LEFT JOIN Servicios serv ON serv.IdServicio = IIF(A.IdServicioEgreso IS NOT NULL OR A.IdServicioEgreso != '', A.IdServicioEgreso, a.IdServicioIngreso) -- revisar luego tiene que jalar de la evaluacion
	WHERE a.IdCuentaAtencion = @idCuenta AND evaUCI.IdAtencionDetalleUCI = @idRegistro
END



IF @tipo = 'NA-UCI'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	evaUCI.IdComentarioApreciacion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	0 AS idEvaluacion,
	evaUCI.Medico AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = '',
	Edad = '',
	Movimiento = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM ComentarioApreciacionUCI evaUCI
	LEFT JOIN AtencionesEvaluacionUCI eva ON eva.IdAtencion = evaUCI.IdAtencion
	LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion	
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	--LEFT JOIN Empleados emp ON emp.IdEmpleado = eva.IdUsuario  -- revisar luego tiene que jalar de la evaluacion
	LEFT JOIN Servicios serv ON serv.IdServicio = a.IdServicioIngreso -- revisar luego tiene que jalar de la evaluacion
	WHERE a.IdCuentaAtencion = @idCuenta AND evaUCI.IdComentarioApreciacion = @idRegistro
END


IF @tipo = 'INTER-HO'
BEGIN
	SELECT TOP 1
	ISNULL(FirmasDigitales.code, 0) AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	rc.idReceta AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	0 AS idEvaluacion,
	0 AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(S.Nombre, ''),
	Cama = '',
	Edad = '',
	Movimiento = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM 
		Atenciones A
		LEFT JOIN AtencionesDatosAdicionales ADA on ADA.idAtencion = A.IdAtencion
		LEFT JOIN Pacientes P ON A.IdPaciente = P.IdPaciente
		LEFT JOIN Servicios S ON A.IdServicioEgreso = S.IdServicio
		LEFT JOIN dbo.FuentesFinanciamiento FF ON A.idFuenteFinanciamiento = FF.IdFuenteFinanciamiento 
		LEFT JOIN RecetaCabecera RC ON A.IdCuentaAtencion = RC.idCuentaAtencion
		LEFT JOIN RecetaDetalle RD ON RC.idReceta = RD.idReceta
		LEFT JOIN AtencionDetalleInterconsulta ADI ON A.IdCuentaAtencion = ADI.idCuentaAtencion and ADI.idReceta = RD.idReceta and ADI.idProducto = RD.idItem and adi.idProducto = @idItem
		LEFT JOIN RecetaDetalleInterconsulta RDI ON ADI.idReceta = RDI.idReceta and ADI.idProducto = RDI.idItem 
		LEFT JOIN FactCatalogoServicios FCS ON RD.idItem = FCS.IdProducto

		LEFT JOIN FirmasDigitales ON A.IdCuentaAtencion = FirmasDigitales.idCuentaAtencion AND RC.idReceta = FirmasDigitales.idRegistro AND ADI.idProducto = FirmasDigitales.idItem AND FirmasDigitales.tipo = 'INTER-HO'

	LEFT JOIN Establecimientos ON ADI.IdEstablecimientoReferencia = Establecimientos.IdEstablecimiento
	WHERE a.IdCuentaAtencion = @idCuenta AND rc.idReceta = @idRegistro and rd.idItem = @idItem
	--and A.idTipoServicio =3 
		and RC.IdPuntoCarga = 12
END


IF @tipo = 'GUARDIA'
BEGIN
	SELECT TOP 1
	@code AS code,
	0 AS idCuentaAtencion,
	oc.IdOcurrenciaMedica AS idRegistro,
	0 AS idTipoServicio,
	0 AS idServicio,
	0 AS idEvaluacion,
	oc.IdUsuarioRegistra AS idEmpleado,
	--idEmpleado = ISNULL((SELECT TOP 1 UsuariosRoles.IdEmpleado FROM UsuariosRoles INNER JOIN RolesPermisos ON RolesPermisos.IdRol = UsuariosRoles.IdRol WHERE RolesPermisos.IdPermiso = 800 ORDER BY UsuariosRoles.IdUsuarioRol ASC), 0),
	CONVERT(VARCHAR(10), oc.FechaRegistra, 103) AS fecha,
	Servicio = '',
	Paciente = '',
	Cama = '',
	Cuenta = '',
	Historia = '',
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM OcurrenciasMedicas oc	
	WHERE oc.IdOcurrenciaMedica = @idRegistro
END

IF @tipo = 'IA-UCI'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	eva.IdAtencion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	0 AS idEvaluacion,
	(select top 1 MedicoComentarioEvaluacion from AtencionesEvaluacionDetalleUCI where IdAtencionUCI = eva.IdAtencionUCI order by NroEvaluacion desc) AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serv.Nombre, ''),
	Cama = isnull(Camas.Codigo, ''),
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Edad = (CONVERT(VARCHAR, a.Edad) + ' ' + TiposEdad.Descripcion),
	Movimiento = '',
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM AtencionesEvaluacionUCI eva
	LEFT JOIN Atenciones a ON eva.IdAtencion = a.IdAtencion	
	LEFT JOIN TiposEdad ON a.IdTipoEdad = TiposEdad.IdTipoEdad
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	LEFT JOIN Camas ON Camas.IdCama = IIF(a.IdServicioEgreso IS NULL, a.idcamaIngreso, a.idCamaEgreso)
	--LEFT JOIN Empleados emp ON emp.IdEmpleado = eva.IdUsuario  -- revisar luego tiene que jalar de la evaluacion
	LEFT JOIN Servicios serv ON serv.IdServicio = IIF(A.IdServicioEgreso IS NOT NULL OR A.IdServicioEgreso != '', A.IdServicioEgreso, a.IdServicioIngreso) -- revisar luego tiene que jalar de la evaluacion
	WHERE a.IdCuentaAtencion = @idCuenta AND eva.IdAtencion = @idRegistro
END

IF @tipo = 'I-PROC'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	InformeProcedimientos.IdOrden AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	0 AS idEvaluacion,
	InformeProcedimientos.IdUsuario AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(Servicios.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Edad = (CONVERT(VARCHAR, a.Edad) + ' ' + TiposEdad.Descripcion),
	Movimiento = '',
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
	InformeProcedimientos
	INNER JOIN Atenciones A ON InformeProcedimientos.IdAtencion = A.IdAtencion
	INNER JOIN Pacientes P ON A.IdPaciente = P.IdPaciente
	INNER JOIN Servicios ON A.IdServicioIngreso = Servicios.IdServicio
	INNER JOIN TiposEdad ON A.IdTipoEdad = TiposEdad.IdTipoEdad
	INNER JOIN TiposSexo ON P.IdTipoSexo = TiposSexo.IdTipoSexo

	LEFT JOIN TiposIntervencionCQx ON InformeProcedimientos.TipoIntervencion = TiposIntervencionCQx.IdTipoIntervencion
	LEFT JOIN TiposGasasCQx ON InformeProcedimientos.Gasas = TiposGasasCQx.IdTipoGasas
	LEFT JOIN TiposApositosCQx ON InformeProcedimientos.Apositos = TiposApositosCQx.IdTipoAposito

	LEFT JOIN AnestesiaCQx Anestesia1 ON InformeProcedimientos.PrimeraAnestesia = Anestesia1.IdAnestesia
	LEFT JOIN TiposAnestesiaCQx TiposAnestesia1 ON InformeProcedimientos.TipoPrimeraAnestesia = TiposAnestesia1.IdTipoAnestesia

	LEFT JOIN AnestesiaCQx Anestesia2 ON InformeProcedimientos.SegundaAnestesia = Anestesia2.IdAnestesia
	LEFT JOIN TiposAnestesiaCQx TiposAnestesia2 ON InformeProcedimientos.TipoSegundaAnestesia = TiposAnestesia2.IdTipoAnestesia

	LEFT JOIN AnatomiaPatologicaCQx ON InformeProcedimientos.AnatomiaPatologica = AnatomiaPatologicaCQx.IdAnatomiaPatologica

	LEFT JOIN TiposDestinoAtencion ON InformeProcedimientos.Destino = TiposDestinoAtencion.IdDestinoAtencion


	WHERE A.IdCuentaAtencion = @idCuenta AND IdOrden = @idRegistro AND InformeProcedimientos.IdProducto = @idItem
END

IF @tipo = 'I-CQX'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	ReporteOperatorioCQx.IdReporteOperatorio AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	0 AS idEvaluacion,
	ReporteOperatorioCQx.IdUsuario AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(Servicios.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Edad = (CONVERT(VARCHAR, a.Edad) + ' ' + TiposEdad.Descripcion),
	Movimiento = '',
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
	ReporteOperatorioCQx
	INNER JOIN Atenciones A ON ReporteOperatorioCQx.IdCuentaAtencion = A.IdCuentaAtencion
	INNER JOIN Pacientes P ON A.IdPaciente = P.IdPaciente
	INNER JOIN Servicios ON A.IdServicioIngreso = Servicios.IdServicio
	INNER JOIN TiposEdad ON A.IdTipoEdad = TiposEdad.IdTipoEdad
	INNER JOIN TiposSexo ON P.IdTipoSexo = TiposSexo.IdTipoSexo

	--LEFT JOIN TiposIntervencionCQx ON InformeProcedimientos.TipoIntervencion = TiposIntervencionCQx.IdTipoIntervencion
	--LEFT JOIN TiposGasasCQx ON InformeProcedimientos.Gasas = TiposGasasCQx.IdTipoGasas
	--LEFT JOIN TiposApositosCQx ON InformeProcedimientos.Apositos = TiposApositosCQx.IdTipoAposito

	--LEFT JOIN AnestesiaCQx Anestesia1 ON InformeProcedimientos.PrimeraAnestesia = Anestesia1.IdAnestesia
	--LEFT JOIN TiposAnestesiaCQx TiposAnestesia1 ON InformeProcedimientos.TipoPrimeraAnestesia = TiposAnestesia1.IdTipoAnestesia

	--LEFT JOIN AnestesiaCQx Anestesia2 ON InformeProcedimientos.SegundaAnestesia = Anestesia2.IdAnestesia
	--LEFT JOIN TiposAnestesiaCQx TiposAnestesia2 ON InformeProcedimientos.TipoSegundaAnestesia = TiposAnestesia2.IdTipoAnestesia

	--LEFT JOIN AnatomiaPatologicaCQx ON InformeProcedimientos.AnatomiaPatologica = AnatomiaPatologicaCQx.IdAnatomiaPatologica

	--LEFT JOIN TiposDestinoAtencion ON InformeProcedimientos.Destino = TiposDestinoAtencion.IdDestinoAtencion


	WHERE A.IdCuentaAtencion = @idCuenta AND ReporteOperatorioCQx.IdReporteOperatorio = @idRegistro --AND InformeProcedimientos.IdProducto = @idItem
END

IF @tipo = 'NE-NEO'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	NotaEnfermeriaNeoEvaluacion.NroEvaluacion AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioIngreso, 0) AS idServicio, -- revisar luego tiene que jalar de la evaluacion
	NotaEnfermeriaNeoEvaluacion.NroEvaluacion AS idEvaluacion,
	NotaEnfermeriaNeoEvaluacion.IdEnfermeraAtiende AS idEmpleado, -- revisar luego tiene que jalar de la evaluacion
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	@tipo AS tipo,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(Servicios.Nombre, ''),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Edad = (CONVERT(VARCHAR, a.Edad) + ' ' + TiposEdad.Descripcion),
	Movimiento = '',
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Firmador1 = '',
	TipoFirmador1 = '',
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM
		NotaEnfermeriaNeo
		INNER JOIN NotaEnfermeriaNeoEvaluacion ON NotaEnfermeriaNeo.IdAtencion = NotaEnfermeriaNeoEvaluacion.IdAtencion
		LEFT JOIN Atenciones A ON NotaEnfermeriaNeo.IdAtencion = A.IdAtencion
		LEFT JOIN Pacientes P ON A.IdPaciente = P.IdPaciente

		LEFT JOIN Servicios ON A.IdServicioIngreso = Servicios.IdServicio
		LEFT JOIN TiposEdad ON A.IdTipoEdad = TiposEdad.IdTipoEdad
		LEFT JOIN TiposSexo ON P.IdTipoSexo = TiposSexo.IdTipoSexo

	WHERE A.IdCuentaAtencion = @idCuenta AND NotaEnfermeriaNeoEvaluacion.NroEvaluacion = @idNumero
END


IF @tipo = 'INF-RS'
BEGIN
	SELECT TOP 1
	@code AS code,
	a.IdCuentaAtencion AS idCuentaAtencion,
	e.invnum AS idRegistro,
	a.IdTipoServicio AS idTipoServicio,
	ISNULL(a.IdServicioEgreso, a.IdServicioIngreso) AS idServicio,
	0 AS idEvaluacion,
	emp.IdEmpleado AS idEmpleado,
	CONVERT(VARCHAR(10), a.FechaIngreso, 103) AS fecha,
	Paciente = ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, ''),
	Servicio = ISNULL(serve.Nombre, servi.Nombre),
	Cama = '',
	Cuenta = ISNULL(a.IdCuentaAtencion, ''),
	Historia = ISNULL(p.NroHistoriaClinica, ''),
	Edad = '',
	Movimiento = '',
	@tipo AS tipo	,
	Firmador1 = (CASE WHEN emp.IdEmpleado IS NOT NULL THEN UPPER(ISNULL(emp.ApellidoPaterno, '') + ' ' + ISNULL(emp.ApellidoMaterno, '') + ' ' + ISNULL(emp.Nombres, '')) ELSE '' END),
	TipoFirmador1 = (CASE WHEN temp.IdTipoEmpleado IS NOT NULL THEN ISNULL(temp.Descripcion, '') ELSE '' END) ,
	Firmador2 = '',
	TipoFirmador2 = ''
	FROM rs_evaluacion e
	LEFT JOIN Atenciones a ON a.IdCuentaAtencion = e.idCuentaAtencion
	LEFT JOIN Pacientes p ON p.IdPaciente = a.IdPaciente
	--LEFT JOIN Medicos med ON med.IdMedico = a.IdMedicoIngreso
	LEFT JOIN Empleados emp ON emp.IdEmpleado = e.usecod
	LEFT JOIN TiposEmpleado temp ON temp.IdTipoEmpleado = emp.IdTipoEmpleado
	LEFT JOIN Servicios servi ON servi.IdServicio = a.IdServicioIngreso
	LEFT JOIN Servicios serve ON serve.IdServicio = a.IdServicioEgreso
	WHERE e.invnum = @idRegistro
END

end 
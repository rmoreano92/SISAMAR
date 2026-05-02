ALTER PROCEDURE [dbo].[web_FirmaDigitalModificar] 
@accion char,
@code varchar(256),
@idCuentaAtencion int,
@idRegistro int,
@idTipoServicio int,
@idServicio int,
@idEvaluacion int,
@idEmpleado int,
@fecha varchar(10),
@tipo varchar(15),
@nombre varchar(256),
@ruta text,
@idUsuario int,
@idItem int = NULL
as
begin

if @accion = 'I'
	begin	
		--delete FirmasDigitales where idCuentaAtencion=@idCuentaAtencion and tipo=@tipo and idRegistro=@idRegistro
		insert into FirmasDigitales
		values(@code,@idCuentaAtencion,@idRegistro,@idTipoServicio,@idServicio,@idEvaluacion,@idEmpleado,@fecha,@tipo,@nombre,@ruta,0,0,@idUsuario,GETDATE(),NULL,NULL, @idItem,1)				
	end
else
	begin
		update FirmasDigitales
		set 
		idCuentaAtencion = @idCuentaAtencion,
		idRegistro = @idRegistro,
		idTipoServicio = @idTipoServicio,
		idServicio = @idServicio,
		idEvaluacion = @idEvaluacion,
		idEmpleado = @idEmpleado,
		fecha = @fecha,
		tipo = @tipo,
		nombreArchivo = @nombre,
		rutaArchivo = @ruta,
		statusFirma = 0,
		processFirma = 0,
		idUsuarioModifica = @idUsuario,
		fechaModifica = GETDATE(),
		idEstado = 1,
		idItem = @idItem
		where code=@code --AND idCuentaAtencion=@idCuentaAtencion and tipo=@tipo and idRegistro=@idRegistro
	end
end 

DECLARE @Autorizados TABLE(id INT IDENTITY, IdEmpleado INT)
DECLARE @i INT
DECLARE @idAutorizado INT

/*======================REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR=========================*/
DECLARE @idFirmaDigital INT = (SELECT TOP 1 id FROM FirmasDigitales WHERE code = @code)
DELETE FirmaDigitalAutorizados WHERE IdFirmaDigital = @idFirmaDigital
IF @idFirmaDigital > 0 AND @idEmpleado > 0
BEGIN
	INSERT INTO FirmaDigitalAutorizados VALUES(@idFirmaDigital, 1, @idEmpleado, 0, 0)
END
/*========================================================================================*/

/*==========PARTE DIARIO CE - REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR===================*/	
If @tipo in ('CE-PD')
BEGIN
	INSERT INTO FirmaDigitalAutorizados VALUES(@idFirmaDigital, 1, @idUsuario, 0, 0)
END
/*========================================================================================*/

/*=========CONSTANCIAS NACIMIENTO - REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR==============*/	
SET @i = 1
IF @tipo IN ('CN')
BEGIN
	INSERT INTO @Autorizados
	SELECT Empleados.IdEmpleado FROM Empleados INNER JOIN UsuariosRoles ON UsuariosRoles.IdEmpleado = Empleados.IdEmpleado INNER JOIN  RolesPermisos ON RolesPermisos.IdRol = UsuariosRoles.IdRol WHERE RolesPermisos.IdPermiso = 800

	WHILE @i <= (SELECT COUNT(*) FROM @Autorizados)
	BEGIN
		SET @idAutorizado = (SELECT TOP 1 IdEmpleado FROM @Autorizados WHERE id = @i)
		INSERT INTO FirmaDigitalAutorizados VALUES(@idFirmaDigital, 2, @idAutorizado, 0, 0)
		SET @i = @i + 1 
	END
END
/*========================================================================================*/

/*=========OCURRENCIAS MEDICAS - REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR==============*/	
SET @i = 1
IF @tipo IN ('GUARDIA')
BEGIN
	DECLARE @IdOcurrencia INT = (SELECT TOP 1 idRegistro FROM FirmasDigitales WHERE id = @idFirmaDigital)

	--INSERT INTO @Autorizados
	--SELECT TOP 1 IdUsuarioRegistra FROM OcurrenciasMedicas WHERE IdOcurrenciaMedica = @IdOcurrencia
		
	INSERT INTO @Autorizados
	SELECT Empleados.IdEmpleado FROM OcurrenciasMedicas INNER JOIN Empleados ON Empleados.DNI = OcurrenciasMedicas.NroDocJefeGuardia WHERE OcurrenciasMedicas.IdOcurrenciaMedica = @IdOcurrencia

	INSERT INTO @Autorizados
	SELECT Empleados.IdEmpleado FROM OcurrenciasMedicas INNER JOIN Empleados ON Empleados.DNI = OcurrenciasMedicas.NroDocJefeGuardiaEntrante WHERE OcurrenciasMedicas.IdOcurrenciaMedica = @IdOcurrencia

	WHILE @i <= (SELECT COUNT(*) FROM @Autorizados)
	BEGIN
		SET @idAutorizado = (SELECT TOP 1 IdEmpleado FROM @Autorizados WHERE id = @i)
		INSERT INTO FirmaDigitalAutorizados VALUES(@idFirmaDigital, @i, @idAutorizado, 0, 0)
		SET @i = @i + 1 
	END
END
/*========================================================================================*/

/*================PARA EL CASO DE GENERACION AUTOMATICA DE PDF=========================*/
--IF(@tipo = 'LAB-RES' AND @idItem = 0)
--BEGIN
--	UPDATE LabMovimientoLaboratorio SET tienePdf = 1 WHERE IdMovimiento = @idRegistro
--END
--DECLARE @idEmpleado2 INT = 0
IF(@tipo = 'LAB-RES' AND @idItem > 0)
BEGIN		
	UPDATE LabMovimientoCPT SET tienePdf = 1 WHERE IdMovimiento = @idRegistro AND idProductoCPT = @idItem

	/*======================REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR=========================*/
	DECLARE @IdcargoValida INT = (SELECT DISTINCT TOP 1 idCargoValida FROM LabItemsCpt INNER JOIN labGrupos ON labGrupos.idGrupo = LabItemsCpt.idGrupo WHERE idProductoCpt = @idItem)
	--SET @idEmpleado2 = (SELECT TOP 1 validaAnalisis FROM LabResultadoPorItems INNER JOIN LabMovimientoLaboratorio ON LabMovimientoLaboratorio.IdOrden = LabResultadoPorItems.idOrden WHERE LabMovimientoLaboratorio.IdMovimiento = @idRegistro)
	INSERT INTO FirmaDigitalAutorizados 
	SELECT DISTINCT @idFirmaDigital AS IdFirmaDigital, 3 AS OrdenFirma, idEmpleado AS IdEmpleado, 0 AS StatusFirma, 0 AS StatusFirmaOrden FROM EmpleadosCargos WHERE idCargo = @IdcargoValida	
	/*========================================================================================*/
END

IF(@tipo = 'LAB-RES-GRUPO' AND @idItem > 0)
BEGIN		
	--UPDATE LabMovimientoCPT SET tienePdf = 1 WHERE IdMovimiento = @idRegistro AND idProductoCPT = @idItem

	/*======================REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR=========================*/
	
	--SET @idEmpleado2 = (SELECT TOP 1 validaAnalisis FROM LabResultadoPorItems INNER JOIN LabMovimientoLaboratorio ON LabMovimientoLaboratorio.IdOrden = LabResultadoPorItems.idOrden WHERE LabMovimientoLaboratorio.IdMovimiento = @idRegistro)
	INSERT INTO FirmaDigitalAutorizados
	SELECT DISTINCT @idFirmaDigital AS IdFirmaDigital, 1 AS OrdenFirma, LabResultadoPorItems.realizaAnalisis AS IdEmpleado, 0 AS StatusFirma, 0 AS StatusFirmaOrden
	FROM LabMovimientoLaboratorio
	INNER JOIN LabResultadoPorItems ON LabResultadoPorItems.idOrden = LabMovimientoLaboratorio.IdOrden
	INNER JOIN LabItemsCpt ON LabItemsCpt.idProductoCpt = LabResultadoPorItems.idProductoCPT AND LabItemsCpt.ordenXresultado = LabResultadoPorItems.ordenXresultado
	WHERE LabMovimientoLaboratorio.IdMovimiento = @idRegistro AND LabItemsCpt.idGrupo = @idItem

	DECLARE @IdcargoValidaGrupo INT = (SELECT DISTINCT TOP 1 idCargoValida FROM labGrupos WHERE labGrupos.idGrupo = @idItem)
	INSERT INTO FirmaDigitalAutorizados 
	SELECT DISTINCT @idFirmaDigital AS IdFirmaDigital, 3 AS OrdenFirma, idEmpleado AS IdEmpleado, 0 AS StatusFirma, 0 AS StatusFirmaOrden FROM EmpleadosCargos WHERE idCargo = @IdcargoValidaGrupo	
	/*========================================================================================*/
END

IF(@tipo = 'IMG-RES' AND @idItem > 0)
BEGIN	
	UPDATE ImagMovimientoCPT SET tienePdf = 1 WHERE IdMovimiento = @idRegistro AND idProductoCPT = @idItem

	/*======================REGISTRO DE USUARIOS AUTORIZADOS A FIRMAR=========================*/
	--SET @idEmpleado2 = (SELECT TOP 1 validaAnalisis FROM ImgResultadoPorItems INNER JOIN LabMovimientoLaboratorio ON LabMovimientoLaboratorio.IdOrden = ImgResultadoPorItems.idOrden WHERE LabMovimientoLaboratorio.IdMovimiento = @idRegistro)
	--INSERT INTO FirmaDigitalAutorizados VALUES(@idFirmaDigital, 2, @idEmpleado2, 0)
	/*========================================================================================*/
END
/*======================================================================================*/
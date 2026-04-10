
--SELECT * FROM FactOrdenServicio WHERE IdCuentaAtencion = 208259
--SELECT * FROM FacturacionServicioDespacho WHERE idOrden = 469730
--SELECT * FROM FactOrdenServicioPagos WHERE idOrden = 469730

--SELECT * FROM FacturacionServicioPagos WHERE idOrdenPago = 99348
--SELECT * FROM FacturacionServicioFinanciamientos WHERE idOrden = 99348

--------
--SELECT * FROM FactOrdenServicio WHERE IdCuentaAtencion = 194797
--SELECT * FROM FacturacionServicioDespacho WHERE idOrden = 469732
--SELECT * FROM FactOrdenServicioPagos WHERE idOrden = 469732

--SELECT * FROM FacturacionServicioPagos WHERE idOrdenPago = 99348
--SELECT * FROM FacturacionServicioFinanciamientos WHERE idOrden = 469732
/*===================================================================================*/

--web_AltaMedicaModificarV1
select top 10 * from pacientes 
select * from Servicios where nombre like '%emergencia%';
select * from FactCatalogoServiciosHosp;
select * from TiposServicio
select IdEstado,* from servicios where nombre like '%emergencia%'
update servicios set IdEstado = 1 where IdServicio in(1840,1850)


ALTER TABLE Atenciones
ADD UrlPapeletaHospitalizacion VARCHAR(500) NULL



--web_FirmaDigitalModificar
select top 10 * from FirmasDigitales

web_FirmaDigitalSeleccionarDatosParaFirmaDigital 69349,70892, 0 , 'E-PH', 0
web_FirmaDigitalSeleccionarDatosParaFirmaDigital 69349,70892, 0 , 'E-EVA', 0
web_FirmaDigitalSeleccionarDatosParaFirmaDigital 69349,70892, 0 , 'H-EVA', 0
web_FirmaDigitalSeleccionarDatosParaFirmaDigital 69349,70892, 0 , 'INTER-HO', 0
--E-PH
SELECT top 10 * from FirmasDigitales where tipo = 'E-PH'



--RMOREANO 31032026 SE AGREGO EL CAMPO DE OBSERVACION DE ALTA MEDICA
ALTER PROCEDURE [dbo].[web_AltaMedicaModificarV1]
(
@IdPaciente int ,
@IdAtencion int ,
@IdCuentaAtencion int,
@IdCamaEgreso int = NULL,
@IdServicioEgreso int ,
@IdTipoAlta int ,
@IdCondicionAlta int ,
@IdDestinoAtencion int ,
@HoraEgreso char(5) ,
@FechaEgreso datetime ,
@IdMedicoEgreso int ,
@HuboInfeccionIntraHospitalaria int = NULL,
@IdTipoReferenciaDestino int = NULL,
@IdEstablecimientoDestino int = NULL,
@NroReferenciaDestino VARCHAR(20) = NULL,
@TieneNecropsia bit = NULL,
--@IdEstadoFacturacion int,
@CargarProcedimiento int = NULL,

@OpcionIntervenciónQuirurgica INT = NULL,
@IntervencionQuirurgica NVARCHAR(500) = NULL,
@FechaIntervencionQuirurgica DATETIME = NULL,
@HoraIntervencionQuirurgica NVARCHAR(5) = NULL,
@IdMedicoIntervencionQuirurgica INT = NULL,

@IdGrupoGo INT = NULL,

@IdUsuarioAuditoria int,
@ObservacionAltaMedica VARCHAR(2000)=NULL
)
AS 

/*==========ACTUALIZAR ESTADO ATENCION======================*/
UPDATE Atenciones
SET 
--IdPaciente = @IdPaciente,
IdCamaEgreso = @IdCamaEgreso,
IdServicioEgreso = @IdServicioEgreso,
IdTipoAlta = @IdTipoAlta,
IdCondicionAlta = @IdCondicionAlta,
IdDestinoAtencion = @IdDestinoAtencion,
HoraEgreso = @HoraEgreso,
FechaEgreso = @FechaEgreso,
IdMedicoEgreso = @IdMedicoEgreso
WHERE IdAtencion = @IdAtencion AND IdPaciente = @IdPaciente

UPDATE AtencionesDatosAdicionales
SET 
HuboInfeccionIntraHospitalaria = @HuboInfeccionIntraHospitalaria,
IdTipoReferenciaDestino = @IdTipoReferenciaDestino,
IdEstablecimientoDestino = @IdEstablecimientoDestino,
NroReferenciaDestino = @NroReferenciaDestino,
TieneNecropsia = @TieneNecropsia,

OpcionIntervenciónQuirurgica = @OpcionIntervenciónQuirurgica,
IntervencionQuirurgica = @IntervencionQuirurgica,
FechaIntervencionQuirurgica = @FechaIntervencionQuirurgica,
HoraIntervencionQuirurgica = @HoraIntervencionQuirurgica,
IdMedicoIntervencionQuirurgica = @IdMedicoIntervencionQuirurgica,
IdGrupoGo = @IdGrupoGo,
ObservacionAltaMedica=@ObservacionAltaMedica --RMOREANO 31032026 
WHERE idAtencion = @IdAtencion



/*==============================================================*/

/*==========ACTUALIZAR ESTADO FACTURACION======================*/
DECLARE @idTipoServicio INT = (SELECT TOP 1 IdTipoServicio FROM Atenciones WHERE IdCuentaAtencion = @IdCuentaAtencion)
IF @idTipoServicio <> 3
BEGIN
	DECLARE @IdEstadoFacturacion INT = 0
	SET @IdEstadoFacturacion = (SELECT TOP 1 CONVERT(INT, ValorTexto) FROM Parametros WHERe IdParametro = 382)
	IF @IdEstadoFacturacion = 1
		BEGIN
			SET @IdEstadoFacturacion = 1
		END
	ELSE
		BEGIN
			SET @IdEstadoFacturacion = 10
		END

	UPDATE FacturacionCuentasAtencion 
	SET 
	IdEstado = @IdEstadoFacturacion
	WHERe IdCuentaAtencion = @IdCuentaAtencion
END
/*==============================================================*/

/*==============ACTUALIZAR CAMAS ID PACIENTE=====================*/
exec CamasLimpiaIdPaciente @IdPaciente

IF @IdCamaEgreso <> 0 
BEGIN
	exec CamasActualizaIdPaciente @IdPaciente, @IdCamaEgreso
END
/*================================================================*/

/*=============ACTUALIZAR ESTANCIA HOSPITALARIA====================*/
DECLARE @idServEstanciaTemp INT = 0
DECLARE @idEstanciaHospTemp INT = 0
DECLARE @horaEstanciaMax CHAR(5) = ''
--DECLARE @diasEstanciaTemp INT = 0

SELECT TOP 1 @idServEstanciaTemp = IdServicio, @idEstanciaHospTemp = IdEstanciaHospitalaria FROM AtencionesEstanciaHospitalaria WHERE IdAtencion = @IdAtencion ORDER BY Secuencia DESC
SET @horaEstanciaMax = (SELECT TOP 1 ValorTexto FROM Parametros WHERe IdParametro = 201)

IF @IdServicioEgreso = @idServEstanciaTemp
BEGIN
	UPDATE AtencionesEstanciaHospitalaria 
	SET 
	FechaDesocupacion = @FechaEgreso,
	HoraDesocupacion = @HoraEgreso,
	IdCama = @IdCamaEgreso,
	LlegoAlServicio = 1
	WHERE IdEstanciaHospitalaria = @idEstanciaHospTemp

	UPDATE AtencionesEstanciaHospitalaria 
	SET
	DiasEstancia = (CASE WHEN DATEDIFF(day, FechaOcupacion, FechaDesocupacion) = 0 THEN 1 
						 WHEN HoraDesocupacion > @horaEstanciaMax THEN DATEDIFF(day, FechaOcupacion, FechaDesocupacion) + 1 
						 ELSE DATEDIFF(day, FechaOcupacion, FechaDesocupacion) END)
	WHERE IdAtencion = @IdAtencion
END
/*=================================================================*/

/*=============ACTUALIZAR CAMAS Y CAMAS MOVIMIENTOS====================*/
DECLARE @idCama INT = 0
DECLARE @idServUbiActual INT= 0
IF @IdCamaEgreso > 0
BEGIN
	SELECT @idCama = IdCama, @idServUbiActual = IdServicioUbicacionActual FROM Camas WHERe IdCama = @IdCamaEgreso
	IF @idServUbiActual <> @IdServicioEgreso
	BEGIN
		SET @idServUbiActual = @IdServicioEgreso
		UPDATE Camas SET IdServicioUbicacionActual = @idServUbiActual WHERE IdCama = @idCama
		exec CamasMovimientosAgregar 0, @IdCamaEgreso, @IdServicioEgreso, GETDATE, NULL, @IdUsuarioAuditoria
	END
END

/*======================================================================*/


/*=============CARGAR PROCEDIMIENTO ALTA MEDICA - ESTANCIA MEDICA====================*/
IF @CargarProcedimiento = 1
BEGIN
	DECLARE @index INT  = 0
	DECLARE @cantidadProductos INT = 0
	DECLARE @IdProductoEstancia INT = (SELECT TOP 1 IdProducto FROM FactCatalogoServicios WHERE Codigo = '99231')		--99231 ==> Codigo - Atencion Hospitalizacion de Paciente
	DECLARE @ProductosAlta TABLE(Id INT IDENTITY(1,1), IdOrden INT, IdOrdenPago INT, IdProducto INT, IdCuentaAtencion INT)


	INSERT INTO @ProductosAlta
	SELECT 
	FacturacionServicioDespacho.IdOrden,
	FactOrdenServicioPagos.idOrdenPago,
	FacturacionServicioDespacho.IdProducto,
	FactOrdenServicio.IdCuentaAtencion
	FROM FactOrdenServicio 
	INNER JOIN FacturacionServicioDespacho ON FacturacionServicioDespacho.idOrden = FactOrdenServicio.IdOrden
	LEFT JOIN FactOrdenServicioPagos ON FactOrdenServicioPagos.idOrden = FactOrdenServicio.IdOrden
	WHERE FactOrdenServicio.IdCuentaAtencion = @IdCuentaAtencion AND FacturacionServicioDespacho.IdProducto = @IdProductoEstancia AND FactOrdenServicioPagos.idComprobantePago IS NULL


	SET @index = 1
	SET @cantidadProductos = (SELECT COUNT(*) FROM @ProductosAlta)
	DECLARE @IdProductoAlta INT = 0
	DECLARE @IdOrdenAlta INT = 0
	DECLARE @IdOrdenPagoAlta INT = 0
	WHILE @index <= @cantidadProductos
	BEGIN
		SELECT @IdProductoAlta = IdProducto, @IdOrdenAlta = IdOrden, @IdOrdenPagoAlta = IdOrdenPago FROM @ProductosAlta WHERE Id = @index
		DELETE FacturacionServicioFinanciamientos WHERE idOrden = @IdOrdenAlta AND idProducto = @IdProductoAlta	
		DELETE FacturacionServicioPagos WHERE idOrdenPago = @IdOrdenPagoAlta AND idProducto = @IdProductoAlta
		DELETE FacturacionServicioDespacho WHERE idOrden = @IdOrdenAlta AND IdProducto = @IdProductoAlta
		DELETE FactOrdenServicioPagos WHERE idOrdenPago = @IdOrdenPagoAlta AND idOrden = @IdOrdenAlta
		DELETE FactOrdenServicio WHERE idOrden = @IdOrdenAlta
		SET @index = @index + 1
	END

	DECLARE @IdOrden INT = 0
	DECLARE @IdOrdenPago INT = 0
	DECLARE @Cantidad INT = 0
	DECLARE @idTipoFinanciamiento INT = 0
	DECLARE @idFuenteFinanciamiento INT = 0
	SELECT TOP 1 @idTipoFinanciamiento = IdFormaPago, @idFuenteFinanciamiento = idFuenteFinanciamiento, @Cantidad = (DATEDIFF(DAY, FechaIngreso, FechaEgreso) + 1) FROM Atenciones WHERE IdAtencion = @IdAtencion
	DECLARE @PrecioUnitario DECIMAL = (SELECT TOP 1 PrecioUnitario FROM FactCatalogoServiciosHosp WHERE IdTipoFinanciamiento = @idTipoFinanciamiento AND IdProducto = @IdProductoEstancia)

	IF @idTipoServicio = 3
	BEGIN
				
		INSERT INTO FactOrdenServicio
			(
				IdPuntoCarga,IdPaciente,IdCuentaAtencion,IdServicioPaciente,idTipoFinanciamiento,idFuenteFinanciamiento,FechaCreacion,
				IdUsuario,FechaDespacho,IdUsuarioDespacho,IdEstadoFacturacion,FechaHoraRealizaCpt,idAtencionInterconsulta,SeCargaEnInterconsulta
			)
		VALUES
			(1, @IdPaciente, @IdCuentaAtencion, @IdServicioEgreso, @idTipoFinanciamiento, @idFuenteFinanciamiento, GETDATE(), @IdUsuarioAuditoria, GETDATE(), @IdUsuarioAuditoria, 1, GETDATE(), NULL, NULL)
		SET @IdOrden = @@IDENTITY

			
		INSERT INTO FacturacionServicioDespacho(idOrden,IdProducto,Cantidad,Precio,Total,labConfHIS,GrupoHIS,SubGrupoHIS,Descripcion,dx,condicionIngreso)
		VALUES(@IdOrden, @IdProductoEstancia, @Cantidad, @PrecioUnitario, @PrecioUnitario*@Cantidad, '',0,0,NULL,NULL, NULL)
	
		
		IF @idTipoFinanciamiento = 1
		BEGIN
			INSERT INTO FactOrdenServicioPagos(idComprobantePago,idOrden,ImporteExonerado,FechaCreacion,IdUsuario,IdEstadoFacturacion,idUsuarioExonera)
			VALUES(NULL, @IdOrden, 0.00, GETDATE(), @IdUsuarioAuditoria, 1, 0)
			SET @IdOrdenPago = @@IDENTITY

			INSERT INTO FacturacionServicioPagos(idOrdenPago,idProducto,Cantidad,Precio,Total)
			VALUES(@IdOrdenPago, @IdProductoEstancia, @Cantidad, @PrecioUnitario, @PrecioUnitario*@Cantidad)
			
		END

		IF @idTipoFinanciamiento = 2
		BEGIN	
			INSERT INTO FacturacionServicioFinanciamientos(
				idOrden,idProducto,IdTipoFinanciamiento,idFuenteFinanciamiento,CantidadFinanciada,
				PrecioFinanciado,TotalFinanciado,FechaAutoriza,IdUsuarioAutoriza,idEstadoFacturacion
			)
			VALUES(@IdOrden, @IdProductoEstancia, @idTipoFinanciamiento, @idFuenteFinanciamiento, @Cantidad, @PrecioUnitario, @PrecioUnitario*@Cantidad, GETDATE(), @IdUsuarioAuditoria, 1)
		END
	END
END


DECLARE @idListBar INT = 0
DECLARE @historia INT = (SELECT TOP 1 NroHistoriaClinica FROM Pacientes WHERE IdPaciente = @IdPaciente)
DECLARE @idTipoServ INT = (SELECT TOP 1 IdTipoServicio FROM Atenciones WHERe IdAtencion = @IdAtencion)
DECLARE @observacion VARCHAR(250) = ''
IF (@idTipoServ = 2 OR @idTipoServ = 4)
BEGIN
	SET @idListBar = 202
END
ELSE IF (@idTipoServ = 3)
BEGIN
	SET @idListBar = 302
END

SET @observacion = 'HC: ' + CONVERT(VARCHAR(10), @historia) + ' - Paciente con Alta Médica'

exec AuditoriaAgregarV @IdUsuarioAuditoria,'M',@IdAtencion,'Atenciones',@idListBar,'web', @observacion



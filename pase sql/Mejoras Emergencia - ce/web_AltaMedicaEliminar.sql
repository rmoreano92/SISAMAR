/*alter table FirmasDigitales add idEstado int default 1
go

update FirmasDigitales set idEstado = 1
go
*/

ALTER   PROCEDURE [dbo].[web_AltaMedicaEliminar]
(
@IdAtencion int ,
@Motivo Varchar(200),
@IdUsuarioAuditoria int
)
AS 
/*==========ACTUALIZAR ESTADO ATENCION======================*/
UPDATE Atenciones
SET 
IdCamaEgreso = NULL,
IdTipoAlta = NULL,
IdCondicionAlta = NULL,
IdDestinoAtencion = NULL,
HoraEgreso = NULL,
FechaEgreso = NULL,
IdMedicoEgreso = NULL
WHERE IdAtencion = @IdAtencion

UPDATE AtencionesDatosAdicionales
SET 
HuboInfeccionIntraHospitalaria = NULL,
IdTipoReferenciaDestino = NULL,
IdEstablecimientoDestino = NULL,
NroReferenciaDestino = NULL,
TieneNecropsia = NULL
WHERE idAtencion = @IdAtencion
/*==============================================================*/

DECLARE @idCuentaAtencion INT = 0
SELECT top 1 @idCuentaAtencion =  idCuentaAtencion from atenciones where idCuentaAtencion = @IdAtencion

UPDATE FirmasDigitales set idEstado = 0 where idCuentaAtencion = @idCuentaAtencion and tipo in('E-PH','E-PHF','E-PEM')

/*=============ACTUALIZAR ESTANCIA HOSPITALARIA====================*/
DECLARE @idEstanciaHospTemp INT = 0
DECLARE @idCamaTemp INT = 0
DECLARE @IdPaciente INT = (SELECT TOP 1 IdPaciente FROM Atenciones WHERe IdAtencion = @IdAtencion)

SELECT TOP 1 @idEstanciaHospTemp = IdEstanciaHospitalaria, @idCamaTemp = IdCama FROM AtencionesEstanciaHospitalaria WHERE IdAtencion = @IdAtencion ORDER BY Secuencia DESC

UPDATE AtencionesEstanciaHospitalaria 
SET
FechaDesocupacion = NULL,
HoraDesocupacion = NULL,
DiasEstancia = NULL
WHERE IdEstanciaHospitalaria = @idEstanciaHospTemp

/*=====================CAMAS=======================================*/
UPDATE Camas
SET 
IdEstadoCama = 3,
IdPaciente = @IdPaciente
WHERE IdCama = @idCamaTemp

/*=============AUDITORIA====================*/
DECLARE @idListBar INT = 0
DECLARE @idTipoServ INT = (SELECT TOP 1 IdTipoServicio FROM Atenciones WHERe IdAtencion = @IdAtencion)
DECLARE @historia INT = (SELECT TOP 1 NroHistoriaClinica FROM Pacientes WHERE IdPaciente = @IdPaciente)
DECLARE @observacion VARCHAR(250) = ''
IF (@idTipoServ = 2 OR @idTipoServ = 4)
BEGIN
	SET @idListBar = 202
END
ELSE IF (@idTipoServ = 3)
BEGIN
	SET @idListBar = 302
END

SET @observacion = 'HC: ' + CONVERT(VARCHAR(10), @historia) + ' - Paciente sin Alta Médica' + @Motivo

exec AuditoriaAgregarV @IdUsuarioAuditoria,'E',@IdAtencion,'Atenciones',@idListBar,'web', @observacion









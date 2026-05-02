--ALTER TABLE atenciones ADD IdUsuarioAdmision int;
--ALTER TABLE atenciones ADD FechaHoraAdmision datetime;
--GO


ALTER PROCEDURE [dbo].[Web_AtencionesEmergenciaAgregar]
(@IdTipoAgenteAGAN int,
@IdGrupoOcupacionalALAB int,
@IdPosicionLesionadoALAB int,
@IdUbicacionLesionado int,
@IdTipoTransporte int,
@IdTipoVehiculo int,
@IdClaseAccidente int,
@IdRelacionAgresorVictima int,
@IdSeguridad int,
@IdTipoEvento int,
@IdLugarEvento int,
@IdCausaExternaMorbilidad int,
@IdAtencion int,
@IdAtencionEmergencia int output,
@IdUsuarioAuditoria int)
 as 
 
IF NOT EXISTS (SELECT * FROM AtencionesEmergencia WHERE IdAtencion = @IdAtencion)
BEGIN
	insert into AtencionesEmergencia (
	IdTipoAgenteAGAN,IdGrupoOcupacionalALAB,IdPosicionLesionadoALAB,IdUbicacionLesionado,IdTipoTransporte,IdTipoVehiculo,IdClaseAccidente,IdRelacionAgresorVictima,IdSeguridad,IdTipoEvento,IdLugarEvento,IdCausaExternaMorbilidad,IdAtencion) values (
	@IdTipoAgenteAGAN,@IdGrupoOcupacionalALAB,@IdPosicionLesionadoALAB,@IdUbicacionLesionado,@IdTipoTransporte,@IdTipoVehiculo,@IdClaseAccidente,@IdRelacionAgresorVictima,@IdSeguridad,@IdTipoEvento,@IdLugarEvento,@IdCausaExternaMorbilidad,@IdAtencion)
	set @IdAtencionEmergencia = @@Identity
	
	update Atenciones set IdUsuarioAdmision = @IdUsuarioAuditoria, FechaHoraAdmision = GETDATE() WHERE idatencion = @IdAtencion
	
END
ELSE
BEGIN
	UPDATE AtencionesEmergencia
	SET 
		IdTipoAgenteAGAN = @IdTipoAgenteAGAN,
		IdGrupoOcupacionalALAB = @IdGrupoOcupacionalALAB,
		IdPosicionLesionadoALAB = @IdPosicionLesionadoALAB,
		IdUbicacionLesionado = @IdUbicacionLesionado,
		IdTipoTransporte = @IdTipoTransporte,
		IdTipoVehiculo = @IdTipoVehiculo,
		IdClaseAccidente = @IdClaseAccidente,
		IdRelacionAgresorVictima = @IdRelacionAgresorVictima,
		IdSeguridad = @IdSeguridad,
		IdTipoEvento = @IdTipoEvento,
		IdLugarEvento = @IdLugarEvento,
		IdCausaExternaMorbilidad = @IdCausaExternaMorbilidad
	WHERE IdAtencion = @IdAtencion;
	
END

exec AuditoriaAgregar @IdUsuarioAuditoria ,'A',@IdAtencionEmergencia,'AtencionesEmergencia'

GO



update atenciones 
set atenciones.IdUsuarioAdmision = a.IdEmpleado,
	atenciones.FechaHoraAdmision = a.fechahora
From Auditoria a
inner join AtencionesEmergencia ae on ae.IdAtencionEmergencia = a.IdRegistro
where a.tabla = 'AtencionesEmergencia' and ae.idatencion = atenciones.idatencion and a.accion = 'A'
GO



















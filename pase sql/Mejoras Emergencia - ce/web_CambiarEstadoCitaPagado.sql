ALTER TABLE citas ADD IdUsuarioAdmision int;
ALTER TABLE citas ADD FechaHoraAdmision datetime;




CREATE PROCEDURE [dbo].[web_update_CambiarEstadoColaCita]
(          
@idCita int NULL,
@idAtencion int,
@idEstadoColaCita int,
@justificacion varchar(500),
@IdUsuarioAuditoria int
)          

as          
-- SELECT IdEstadoCita, idEstadoColaCita, * from sigh.dbo.Citas where sigh.dbo.Citas.IdAtencion = 14548 ORDER BY IdCita desc
-- select * from EstadosColaCitas -- select * from TiposEstadosCita  -- SELECT TOP 50 * FROM Citas         
	declare @IdCitax as int
	declare @xEstado as int    
	declare @FechaActual as datetime  

	SET @xEstado=@idEstadoColaCita
	SET @FechaActual =GETDATE()
		
	IF @idCita IS NULL
	BEGIN 
		declare @idEstadoCitax as int
		SELECT TOP 1 @IdCitax =  IdCita, @idEstadoCitax = IdEstadoCita from sigh.dbo.Citas where sigh.dbo.Citas.IdAtencion = @idAtencion ORDER BY IdCita desc
		
		IF @xEstado = 2 BEGIN 
		 update Citas set IdEstadoCita=4, idEstadoColaCita=@xEstado,IdUsuarioAdmision=@IdUsuarioAuditoria,FechaHoraAdmision = GETDATE()
		 where IdCita=@IdCitax and idEstadoColaCita < @idEstadoColaCita      --Como viene en estado 2 y se entiende que el estado es 1 debe pasar.
		END
		ELSE BEGIN
			update Citas set IdEstadoCita=4, idEstadoColaCita=@xEstado where IdCita=@IdCitax and idEstadoColaCita < @idEstadoColaCita      --Como viene en estado 2 y se entiende que el estado es 1 debe pasar.
		END
				
	END
	ELSE
	BEGIN
		SET @IdCitax = @idCita;
		
		IF @xEstado = 2 BEGIN 
		 update Citas set IdEstadoCita=4, idEstadoColaCita=@xEstado, IdUsuarioAdmision=@IdUsuarioAuditoria,FechaHoraAdmision = GETDATE()
		 where IdCita=@IdCitax and idEstadoColaCita < @idEstadoColaCita --si tiene idCita ya directo
		END
		ELSE BEGIN
			update Citas set IdEstadoCita=4, idEstadoColaCita=@xEstado where IdCita=@IdCitax and idEstadoColaCita < @idEstadoColaCita      --si tiene idCita ya directo
		END
		
	END
  
 IF NOT EXISTS (select idEstadoColaCitas from TrazaColaCitas where idcita=@IdCitax and idEstadoColaCitas=6)    
 BEGIN    
   exec citasagregartrazacita_21072020 @IdCitax,@idAtencion,@xEstado,@FechaActual,1,@justificacion,@IdUsuarioAuditoria        
 END




select * from EstadosColaCitas













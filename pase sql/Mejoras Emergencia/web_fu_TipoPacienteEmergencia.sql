CREATE FUNCTION [dbo].[web_fu_TipoPacienteEmergencia] 
(@idPaciente int,@IdEspecialidad int)
RETURNS varchar(500)
AS
BEGIN
	declare @fechaAux date
	declare @meses int
	declare @tipo varchar(50)
	--declare @idEspecialidad int
	set @meses=(select top 1  ValorInt from Parametros where IdParametro=395) 

	set @fechaAux= DATEadd(MONTH,@meses,GETDATE())
	
	if (select count(*) from Atenciones a inner join Servicios s on a.idServicioIngreso = s.idServicio where s.idEspecialidad = @IdEspecialidad and a.idPaciente = @idPaciente)>=1
	begin
		if (select count(*) from Atenciones a inner join Servicios s on a.idServicioIngreso = s.idServicio where s.idEspecialidad = @IdEspecialidad and a.idPaciente = @idPaciente and a.fechaIngreso>=@fechaAux)>0
		begin	
			set @tipo= 'CONTINUADOR'
		end
		else
		begin
			if (select count(*) from Atenciones a inner join Servicios s on a.idServicioIngreso = s.idServicio where s.idEspecialidad = @IdEspecialidad and a.idPaciente = @idPaciente and a.fechaIngreso<=@fechaAux)>0
				set @tipo ='REINGRESANTE'
			end
		end
	else
	begin
		set @tipo= 'NUEVO'
	end
		
	return @tipo
END
GO


CREATE procedure [dbo].[web_TipoPacienteEnEspecialidadEmergencia]
@idPaciente int,
@idEspecialidad int
as
select dbo.web_fu_TipoPacienteEmergencia(@idPaciente,@idEspecialidad) as TipoPaciente






















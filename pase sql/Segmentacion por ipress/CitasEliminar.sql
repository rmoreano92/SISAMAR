ALTER TABLE citas ADD IdUsuarioElimina int;
ALTER TABLE citas ADD FechaHoraElimina datetime;
GO



ALTER procedure [dbo].[CitasEliminar]    
(@IdCita int ,    
@IdUsuarioAuditoria int)    
as   
update citas set idestadocita=3,
  IdUsuarioElimina = @IdUsuarioAuditoria,
  FechaHoraElimina = GETDATE()
where IdCita = @IdCita

exec AuditoriaAgregar @IdUsuarioAuditoria ,'E',@IdCita,'Citas'
GO



update citas
set IdUsuarioElimina = a.IdEmpleado, FechaHoraElimina = a.FechaHora
from auditoria a
where a.accion = 'E' and citas.IdCita = a.IdRegistro and a.tabla = 'Citas'






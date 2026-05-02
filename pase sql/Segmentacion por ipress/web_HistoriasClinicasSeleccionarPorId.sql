
DROP PROCEDURE IF EXISTS [dbo].[web_HistoriasClinicasSeleccionarPorId]
GO 


CREATE procedure [dbo].[web_HistoriasClinicasSeleccionarPorId]    
(@NroHistoriaClinica varchar(50) )
as 
	select hc.* from HistoriasClinicas hc
	left join pacientes p on p.IdPaciente = hc.IdPaciente
	where 
		(hc.NroHistoriaClinica = @NroHistoriaClinica or p.NroDocumento = @NroHistoriaClinica)
GO

ALTER PROCEDURE [dbo].[web_InsertUpdate_Triaje]
@idAtencion int=0,
@NroHistoriaClinica int=0,
@CitaIdServicio int=0,
@CitaFecha datetime,
@TriajePresion varchar(10) = '',
@TriajeTalla varchar(10) = '',
@TriajeTemperatura varchar(10) = '',
@TriajePeso varchar(10) = '',
@TriajeFrecRespiratoria int=0,
@TriajeFrecCardiaca int=0,
@TriajePerimCefalico int=0,
@TriajeSaturacionOxigeno varchar(10) = '',
@TriajePerimAbdominal varchar(10) = '',
@triajepulso int = 0

as
begin
	if((select count(*) from SIGH_EXTERNA..atencionesCE where idAtencion=@idAtencion )=0)
	begin
		insert into SIGH_EXTERNA..atencionesCE(
			idAtencion,
			NroHistoriaClinica,
			CitaFecha,
			CitaIdServicio,
			TriajePresion,
			TriajeTalla,
			TriajeTemperatura,
			TriajePeso,
			TriajeFecha,
			TriajeFrecRespiratoria,
			TriajeFrecCardiaca,
		  TriajePerimCefalico,
			TriajeSaturacionOxigeno,
			TriajePerimAbdominal,
			TriajePulso
		)values
		(
			@idAtencion,
			@NroHistoriaClinica,
			@CitaFecha,
			@CitaIdServicio,
			@TriajePresion,
			@TriajeTalla,
			@TriajeTemperatura,
			@TriajePeso,
			getdate(),
			@TriajeFrecRespiratoria,
			@TriajeFrecCardiaca,
			@TriajePerimCefalico,
			@TriajeSaturacionOxigeno,
			@TriajePerimAbdominal,
			@TriajePulso
		)
	end
	else
	begin
		update SIGH_EXTERNA..atencionesCE set
		NroHistoriaClinica=@NroHistoriaClinica,
		CitaFecha=@CitaFecha,
		CitaIdServicio=@CitaIdServicio,
		TriajePresion=@TriajePresion,
		TriajeTalla=@TriajeTalla,
		TriajeTemperatura=@TriajeTemperatura,
		TriajePeso=@TriajePeso,
		TriajeFecha=GETDATE(),
		TriajeFrecRespiratoria=@TriajeFrecRespiratoria,
		TriajeFrecCardiaca=@TriajeFrecCardiaca,
		TriajePerimCefalico=@TriajePerimCefalico,
		TriajeSaturacionOxigeno = @TriajeSaturacionOxigeno,
		TriajePerimAbdominal = @TriajePerimAbdominal,
		TriajePulso= @TriajePulso
		where idAtencion=@idAtencion

	end

end


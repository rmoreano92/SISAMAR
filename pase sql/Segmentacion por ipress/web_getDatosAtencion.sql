ALTER PROCEDURE [dbo].[web_getDatosAtencion]
(
@idcuentaAtencion int ,
@idAtencion int 
)
AS 

Select top 1
	a.IdCuentaAtencion , a.IdAtencion,
	ISNULL(p.ApellidoPaterno, '') + ' ' + ISNULL(p.ApellidoMaterno, '') + ' ' + ISNULL(p.PrimerNombre, '') + ' ' + ISNULL(p.SegundoNombre, '') + ' ' + ISNULL(p.TercerNombre, '') Paciente,
	par.descripcion Parentesco, p.FichaFamiliar,p.NroDocumento,
	ISNULL(pt.ApellidoPaterno, '') + ' ' + ISNULL(pt.ApellidoMaterno, '') + ' ' + ISNULL(pt.PrimerNombre, '') + ' ' + ISNULL(pt.SegundoNombre, '') + ' ' + ISNULL(pt.TercerNombre, '') Titular,
	git.descripcion AS GradoTitular, gi.descripcion AS Grado,
	d.descripcion diagnostico, dep.descripcion dependencia,adi.ObservacionAltaMedica
from Atenciones a 
inner join pacientes p on p.IdPaciente = a.IdPaciente
left join AtencionesDiagnosticos atd on a.idAtencion = atd.idAtencion and IdSubClasificacionDX = 301
left join Diagnosticos d on atd.IdDiagnostico = d.IdDiagnostico
left join TiposCondicionLaboral par on par.idCondicion = p.condLaboral

left join AtencionesDatosAdicionales adi on a.idAtencion = adi.idAtencion
left join Servicios s on a.IdServicioIngreso = s.IdServicio
left join Especialidades e on s.IdEspecialidad = e.IdEspecialidad
left join TiposProcedencia dep on p.IdProcedencia = dep.IdProcedencia

LEFT JOIN Pacientes pt on p.FichaFamiliar = pt.FichaFamiliar and pt.CondLaboral = 0
LEFT JOIN TiposGradoInstruccion git on git.IdGradoInstruccion = pt.IdGradoInstruccion
LEFT JOIN TiposGradoInstruccion gi on gi.IdGradoInstruccion = p.IdGradoInstruccion 
Where a.IdCuentaAtencion = @idcuentaAtencion and a.IdAtencion = @idAtencion
GO











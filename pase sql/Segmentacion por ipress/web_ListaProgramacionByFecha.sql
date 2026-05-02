ALTER procedure [dbo].[web_ListaProgramacionByFecha]
@fecha as varchar(10),
@IdIpress int = 0
as 

IF ISDATE(@fecha) = 1
BEGIN
	select ProgramacionMedica.IdProgramacion,Servicios.IdServicio as valor,
	NombreServicio = Servicios.Nombre + ' (' + ISNULL(Turnos.CodMinsa COLLATE SQL_Latin1_General_CP1_CI_AS, '') + ')',
	(Empleados.ApellidoPaterno + ' '+ Empleados.ApellidoMaterno +' '+Empleados.Nombres) as Medico,
	Turnos.Descripcion as turno,
	CodigoTurno = ISNULL(Turnos.CodMinsa, ''),
	'' AS code,
	'' AS statusFirma, 
	Empleados.IdEmpleado,
	ProgramacionMedica.IdMedico,
	Servicios.IdEspecialidad,
	Servicios.activaProcedimiento
	from ProgramacionMedica
	inner join DepartamentosHospital on DepartamentosHospital.IdDepartamento=ProgramacionMedica.IdDepartamento
	inner join Servicios on Servicios.IdServicio=ProgramacionMedica.IdServicio
	inner join Turnos on Turnos.IdTurno=ProgramacionMedica.IdTurno
	inner join Medicos on Medicos.IdMedico=ProgramacionMedica.IdMedico
	inner join Empleados on Empleados.IdEmpleado=Medicos.IdEmpleado
	--left join Firmas on Firmas.idRegistro=ProgramacionMedica.IdProgramacion and Firmas.tipo='P'
	where cast(Fecha as date) = cast(@fecha as date) and Servicios.idEstado = 1 and ( DepartamentosHospital.idIpress = @IdIpress OR @IdIpress = 0 )
	order by nombreServicio,2 asc
END
GO


select top 100 * from Pacientes

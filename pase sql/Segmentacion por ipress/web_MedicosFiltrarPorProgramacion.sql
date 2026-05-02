
ALTER PROCEDURE [dbo].[web_MedicosFiltrarPorProgramacion]
(
@lcFiltro varchar(max),
@idIpress int = 0
)
AS
DECLARE @SQL AS VARCHAR(max)
DECLARE @idIpressStr as varchar(10);

SET @idIpressStr = CAST(@idIpress AS VARCHAR(10));

IF @lcFiltro <> ''
   SET @SQL = 'SELECT DISTINCT 
        dbo.Medicos.IdMedico,
        dbo.Empleados.ApellidoPaterno + '' '' + dbo.Empleados.ApellidoMaterno + '' '' + 
        LEFT(dbo.Empleados.Nombres,7) + '' ('' + dbo.ProgramacionMedica.HoraInicio + ''-'' +
        dbo.ProgramacionMedica.HoraFin + '') ('' + dbo.Servicios.Nombre + '')'' AS Nombre,

        dbo.Servicios.Nombre + '' - ('' + Turnos.CodMinsa COLLATE Modern_Spanish_CI_AS + '')'' AS Dservicio,

        dbo.ProgramacionMedica.HoraInicio,
        dbo.ProgramacionMedica.TiempoPromedioAtencion,
        dbo.ProgramacionMedica.HoraFin,
        dbo.ProgramacionMedica.IdServicio,
        dbo.ProgramacionMedica.IdTipoServicio,
        dbo.ProgramacionMedica.idProgramacion,
        dbo.ProgramacionMedica.idturno,

        Servicios.MinimaEdad EdadMinimaDias,
        ROUND(CAST(ISNULL(Servicios.MinimaEdad, 0) AS float)/30, 0) EdadMinimaMeses,
        ROUND(CAST(ISNULL(Servicios.MinimaEdad, 0) AS float)/30/12, 0) EdadMinimaAnios,

        Servicios.maximaEdad EdadDias,
        ROUND(CAST(ISNULL(Servicios.maximaEdad, 0) AS float)/30, 0) EdadMeses,
        ROUND(CAST(ISNULL(Servicios.maximaEdad, 0) AS float)/30/12, 0) EdadAnios,

        dbo.Servicios.Nombre,
        dbo.Servicios.IdEspecialidad

    FROM dbo.Medicos
    LEFT JOIN dbo.MedicosEspecialidad ON dbo.Medicos.IdMedico = dbo.MedicosEspecialidad.IdMedico
    LEFT JOIN dbo.Especialidades ON dbo.MedicosEspecialidad.IdEspecialidad = dbo.Especialidades.IdEspecialidad
    LEFT JOIN dbo.Empleados ON dbo.Medicos.IdEmpleado = dbo.Empleados.IdEmpleado
    INNER JOIN dbo.ProgramacionMedica ON dbo.Medicos.IdMedico = dbo.ProgramacionMedica.IdMedico and isnull(dbo.ProgramacionMedica.idEstado, 1) > 0
    LEFT JOIN dbo.Servicios ON dbo.ProgramacionMedica.IdServicio = dbo.Servicios.IdServicio
		INNER JOIN dbo.DepartamentosHospital ON dbo.ProgramacionMedica.IdDepartamento = dbo.DepartamentosHospital.IdDepartamento AND ( dbo.DepartamentosHospital.idIpress = '+@idIpressStr+' OR '+@idIpressStr + ' = 0 )
    LEFT JOIN Turnos ON ProgramacionMedica.IdTurno = Turnos.IdTurno
    ' + @lcFiltro
ELSE                
   SET @SQL = 'SELECT DISTINCT 
        dbo.Medicos.IdMedico,
        dbo.Empleados.ApellidoPaterno + '' '' + dbo.Empleados.ApellidoMaterno + '' '' + 
        LEFT(dbo.Empleados.Nombres,7) + '' ('' + dbo.ProgramacionMedica.HoraInicio + ''-'' +
        dbo.ProgramacionMedica.HoraFin + '') ('' + dbo.Servicios.Nombre + '')'' AS Nombre,

        dbo.Servicios.Nombre AS Dservicio,
        dbo.ProgramacionMedica.HoraInicio,
        dbo.ProgramacionMedica.TiempoPromedioAtencion,
        dbo.ProgramacionMedica.HoraFin,
        dbo.ProgramacionMedica.IdServicio,
        dbo.ProgramacionMedica.IdTipoServicio,
        dbo.ProgramacionMedica.idProgramacion,
        dbo.ProgramacionMedica.idturno,

        Servicios.MinimaEdad EdadMinimaDias,
        ROUND(CAST(ISNULL(Servicios.MinimaEdad, 0) AS float)/30, 0) EdadMinimaMeses,
        ROUND(CAST(ISNULL(Servicios.MinimaEdad, 0) AS float)/30/12, 0) EdadMinimaAnios,

        Servicios.maximaEdad EdadDias,
        ROUND(CAST(ISNULL(Servicios.maximaEdad, 0) AS float)/30, 0) EdadMeses,
        ROUND(CAST(ISNULL(Servicios.maximaEdad, 0) AS float)/30/12, 0) EdadAnios,

        dbo.Servicios.Nombre + '' - '' + Turnos.Codigo AS Nombre,
        dbo.Servicios.IdEspecialidad

    FROM dbo.Medicos
    LEFT JOIN dbo.MedicosEspecialidad ON dbo.Medicos.IdMedico = dbo.MedicosEspecialidad.IdMedico
    LEFT JOIN dbo.Especialidades ON dbo.MedicosEspecialidad.IdEspecialidad = dbo.Especialidades.IdEspecialidad
    LEFT JOIN dbo.Empleados ON dbo.Medicos.IdEmpleado = dbo.Empleados.IdEmpleado
    INNER JOIN dbo.ProgramacionMedica ON dbo.Medicos.IdMedico = dbo.ProgramacionMedica.IdMedico and isnull(dbo.ProgramacionMedica.idEstado, 1) > 0
    LEFT JOIN dbo.Servicios ON dbo.ProgramacionMedica.IdServicio = dbo.Servicios.IdServicio
    LEFT JOIN Turnos ON ProgramacionMedica.IdTurno = Turnos.IdTurno '

EXEC (@SQL)

GO



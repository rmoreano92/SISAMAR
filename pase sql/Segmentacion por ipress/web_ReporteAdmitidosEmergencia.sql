ALTER PROCEDURE [dbo].[web_ReporteAdmitidosEmergencia]
    @FechaInicio VARCHAR(10), -- dd/MM/yyyy
    @FechaFin VARCHAR(10),    -- dd/MM/yyyy
    @HoraInicio VARCHAR(5),   -- HH:mm
    @HoraFin VARCHAR(5)       -- HH:mm
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FechaInicioDate DATE = TRY_CONVERT(DATE, @FechaInicio, 103);
    DECLARE @FechaFinDate DATE = TRY_CONVERT(DATE, @FechaFin, 103);

    IF (@FechaInicioDate IS NULL OR @FechaFinDate IS NULL)
    BEGIN
        RAISERROR('Formato de fecha inválido. Use dd/MM/yyyy.', 16, 1);
        RETURN;
    END;

    DECLARE @HoraInicioTime TIME = TRY_CONVERT(TIME, @HoraInicio);
    DECLARE @HoraFinTime TIME = TRY_CONVERT(TIME, @HoraFin);

    IF (@HoraInicioTime IS NULL OR @HoraFinTime IS NULL)
    BEGIN
        RAISERROR('Formato de hora inválido. Use HH:mm.', 16, 1);
        RETURN;
    END;

    DECLARE @FechaHoraInicio DATETIME = DATEADD(MINUTE, DATEDIFF(MINUTE, 0, @HoraInicioTime), CAST(@FechaInicioDate AS DATETIME));
    DECLARE @FechaHoraFin DATETIME = DATEADD(SECOND, 59, DATEADD(MINUTE, DATEDIFF(MINUTE, 0, @HoraFinTime), CAST(@FechaFinDate AS DATETIME)));

    SELECT
        Numero = ROW_NUMBER() OVER (ORDER BY d.fecha ASC),
        Dni = ISNULL(d.nroDocumento, ''),
        Cip = ISNULL(p.CipPaciente, ''),
        Paciente = ISNULL(d.nombresCompletos, ''),
        Edad = CASE
            WHEN p.FechaNacimiento IS NULL THEN ''
            ELSE CAST(
                DATEDIFF(YEAR, p.FechaNacimiento, d.fecha)
                - CASE WHEN DATEADD(YEAR, DATEDIFF(YEAR, p.FechaNacimiento, d.fecha), p.FechaNacimiento) > d.fecha THEN 1 ELSE 0 END
                AS VARCHAR(4)
            )
        END,
        Telefono = ISNULL(NULLIF(p.Celular, ''), ISNULL(p.Telefono, '')),
        Servicio = ISNULL(s.Nombre, ''),
        Fecha = CONVERT(VARCHAR(10), a.FechaIngreso, 103),
        Hora = ISNULL(a.HoraIngreso, ''),
        Usuario = LTRIM(RTRIM(ISNULL(e.ApellidoPaterno, '') + ' ' + ISNULL(e.ApellidoMaterno, '') + ' ' + ISNULL(e.Nombres, ''))),
        FechaInicioCabecera = CONVERT(VARCHAR(10), @FechaInicioDate, 103),
        FechaFinCabecera = CONVERT(VARCHAR(10), @FechaFinDate, 103)
    FROM Derivacion d
        INNER JOIN AtencionesEmergencia ae ON ae.IdAtencion = d.idAtencion
        INNER JOIN Atenciones a ON a.IdAtencion = d.idAtencion
        LEFT JOIN Servicios s ON s.IdServicio = d.IdServicio
        LEFT JOIN Empleados e ON e.IdEmpleado = a.IdUsuarioAdmision
        LEFT JOIN Pacientes p ON p.nroDocumento = d.nroDocumento
    WHERE
        d.IdEstado = 1
        AND DATEADD(MINUTE, DATEDIFF(MINUTE, 0, TRY_CONVERT(TIME, a.HoraIngreso)), CAST(CONVERT(DATE, a.FechaIngreso) AS DATETIME)) >= @FechaHoraInicio
        AND DATEADD(MINUTE, DATEDIFF(MINUTE, 0, TRY_CONVERT(TIME, a.HoraIngreso)), CAST(CONVERT(DATE, a.FechaIngreso) AS DATETIME)) <= @FechaHoraFin
    ORDER BY d.fecha ASC;
END;



















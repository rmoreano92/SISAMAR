--web_ReporteTriadosEmergencia '01/04/2026','28/04/2026','00:00','00:00'
--web_ReporteTriadosEmergencia_bk '01/04/2026','28/04/2026','00:00','00:00'


ALTER PROCEDURE [dbo].[web_ReporteTriadosEmergencia]
    @FechaInicio VARCHAR(10),
    @FechaFin VARCHAR(10),
    @HoraInicio VARCHAR(5),
    @HoraFin VARCHAR(5)
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

    DECLARE @FechaHoraInicio DATETIME =
        DATEADD(MINUTE, DATEDIFF(MINUTE, 0, @HoraInicioTime), CAST(@FechaInicioDate AS DATETIME));

    DECLARE @FechaHoraFin DATETIME =
        DATEADD(SECOND, 59,
            DATEADD(MINUTE, DATEDIFF(MINUTE, 0, @HoraFinTime), CAST(@FechaFinDate AS DATETIME)));

    SELECT
        Numero = ROW_NUMBER() OVER (ORDER BY d.fecha ASC),

        Dni = ISNULL(d.nroDocumento, ''),

        Cip = ISNULL(p.CipPaciente, ''),

        Paciente = ISNULL(d.nombresCompletos, ''),

        Edad = CASE
            WHEN p.FechaNacimiento IS NULL THEN ''
            ELSE CAST(
                DATEDIFF(YEAR, p.FechaNacimiento, d.fecha)
                - CASE
                    WHEN DATEADD(YEAR,
                        DATEDIFF(YEAR, p.FechaNacimiento, d.fecha),
                        p.FechaNacimiento) > d.fecha
                    THEN 1
                    ELSE 0
                  END
                AS VARCHAR(4)
            )
        END,

        Telefono = ISNULL(NULLIF(p.Celular, ''), ISNULL(p.Telefono, '')),

        Servicio = ISNULL(s.Nombre, ''),

        Fecha = CONVERT(VARCHAR(10), d.fecha, 103),

        Hora = CONVERT(VARCHAR(5), d.fecha, 108),

        Usuario = LTRIM(RTRIM(
            ISNULL(e.ApellidoPaterno, '') + ' ' +
            ISNULL(e.ApellidoMaterno, '') + ' ' +
            ISNULL(e.Nombres, '')
        )),

        FechaInicioCabecera = CONVERT(VARCHAR(10), @FechaInicioDate, 103),

        FechaFinCabecera = CONVERT(VARCHAR(10), @FechaFinDate, 103),

        Prioridad = g.Descripcion,

        Tiempo = CASE
            WHEN EE.FechaRegistro IS NULL
                 OR a.FechaEgreso IS NULL
                 OR a.HoraEgreso IS NULL
            THEN ''
            ELSE
                CONCAT(
                    DATEDIFF(
                        MINUTE,
                        EE.FechaRegistro,
                        DATEADD(
                            SECOND,
                            DATEDIFF(SECOND, '00:00:00', a.HoraEgreso),
                            CAST(a.FechaEgreso AS DATETIME)
                        )
                    ) / 60,

                    ' horas con ',

                    DATEDIFF(
                        MINUTE,
                        EE.FechaRegistro,
                        DATEADD(
                            SECOND,
                            DATEDIFF(SECOND, '00:00:00', a.HoraEgreso),
                            CAST(a.FechaEgreso AS DATETIME)
                        )
                    ) % 60,

                    ' minutos'
                )
        END

    FROM Derivacion d

        LEFT JOIN Servicios s
            ON s.IdServicio = d.IdServicio

        LEFT JOIN Empleados e
            ON e.IdEmpleado = d.idUsuario

        LEFT JOIN Pacientes p
            ON p.nroDocumento = d.nroDocumento

        LEFT JOIN TiposGravedadAtencion g
            ON g.IdTipoGravedad = d.idGravedad

        LEFT JOIN Atenciones a
            ON a.IdAtencion = d.IdAtencion

        OUTER APPLY
        (
            SELECT TOP 1 FechaRegistro
            FROM EvaluacionEmergencia ee
            WHERE ee.IdAtencion = d.IdAtencion
            ORDER BY FechaRegistro ASC
        ) EE

    WHERE
        d.IdEstado = 1
        AND d.fecha >= @FechaHoraInicio
        AND d.fecha <= @FechaHoraFin

    ORDER BY d.fecha ASC;
END
GO








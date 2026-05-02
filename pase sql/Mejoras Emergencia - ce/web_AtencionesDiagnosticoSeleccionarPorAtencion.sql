ALTER PROCEDURE [dbo].[web_AtencionesDiagnosticosSeleccionarPorAtencion] 
(
    @IdAtencion int,
    @TipoDiagnostico int
)
AS
BEGIN

    -- Caso especial: TipoDiagnostico = 3
    IF (@TipoDiagnostico = 3)
    BEGIN
        -- Verificamos si existe diagnóstico tipo 3
        IF EXISTS (
            SELECT 1
            FROM AtencionesDiagnosticos
            WHERE IdAtencion = @IdAtencion
            AND IdClasificacionDx = @TipoDiagnostico
            AND NroEvaluacion IS NULL
        )
        BEGIN
            -- Consulta normal
            SELECT 
                ad.IdDiagnostico as iddiagnostico, 
                '' as codigoCIEsinPto,
                d.CodigoCIE2004 as codigoCIE10 ,
                d.Descripcion as descripcion,
                1 as esActivo,
                d.FechaInicioVigencia as fechaInicioVigencia,
                CASE WHEN ad.IdClasificacionDx IN (6) THEN 0 
                     ELSE ISNULL(ad.IdSubClasificacionDx, 201) END as IdTipoDiagnostico,
                CASE WHEN ad.IdClasificacionDx IN (6) THEN '' 
                     ELSE convert(varchar(5), ISNULL(scd.Codigo, 'P')) + '  =  ' + ISNULL(scd.Descripcion, 'Presuntivo') END as tipoDiagnostico,
                ad.grupoHIS, ad.subgrupoHIS, ad.NroEvaluacion,
                ISNULL(d.Intrahospitalario, 0) AS Intrahospitalario,
                ad.labConfHIS lab, ad.idTipoDiagnosticoCQx
            FROM AtencionesDiagnosticos ad
            LEFT JOIN SubClasificacionDiagnosticos scd
                ON ad.IdSubClasificacionDx = scd.IdSubClasificacionDx
            LEFT JOIN Diagnosticos d
                ON ad.IdDiagnostico = d.IdDiagnostico
            WHERE ad.IdAtencion = @IdAtencion
            AND ad.IdClasificacionDx = @TipoDiagnostico
            AND ad.NroEvaluacion IS NULL
            ORDER BY ad.IdAtencionDiagnostico ASC
        END
        ELSE
        BEGIN
            -- Consulta alternativa (TOP 1 tipo 8 definitivo)
            SELECT TOP 1
                ad.IdDiagnostico as iddiagnostico, 
                '' as codigoCIEsinPto,
                d.CodigoCIE2004 as codigoCIE10 ,
                d.Descripcion as descripcion,
                1 as esActivo,
                d.FechaInicioVigencia as fechaInicioVigencia,
                301 IdTipoDiagnostico,
								'PR  =  Principal' tipoDiagnostico,
                ad.grupoHIS, ad.subgrupoHIS, ad.NroEvaluacion,
                ISNULL(d.Intrahospitalario, 0) AS Intrahospitalario,
                ad.labConfHIS lab, ad.idTipoDiagnosticoCQx
            FROM AtencionesDiagnosticos ad
            LEFT JOIN SubClasificacionDiagnosticos scd
                ON ad.IdSubClasificacionDx = scd.IdSubClasificacionDx
            LEFT JOIN Diagnosticos d
                ON ad.IdDiagnostico = d.IdDiagnostico
            WHERE ad.IdAtencion = @IdAtencion
            AND ad.IdClasificacionDx = 8
            AND ad.IdSubClasificacionDx = 502
            ORDER BY ad.IdAtencionDiagnostico DESC
        END

        RETURN;
    END

    -- 🔵 Caso normal (cualquier otro tipo)
    SELECT 
        ad.IdDiagnostico as iddiagnostico, 
        '' as codigoCIEsinPto,
        d.CodigoCIE2004 as codigoCIE10 ,
        d.Descripcion as descripcion,
        1 as esActivo,
        d.FechaInicioVigencia as fechaInicioVigencia,
        CASE WHEN ad.IdClasificacionDx IN (6) THEN 0 
             ELSE ISNULL(ad.IdSubClasificacionDx, 201) END as IdTipoDiagnostico,
        CASE WHEN ad.IdClasificacionDx IN (6) THEN '' 
             ELSE convert(varchar(5), ISNULL(scd.Codigo, 'P')) + '  =  ' + ISNULL(scd.Descripcion, 'Presuntivo') END as tipoDiagnostico,
        ad.grupoHIS, ad.subgrupoHIS, ad.NroEvaluacion,
        ISNULL(d.Intrahospitalario, 0) AS Intrahospitalario,
        ad.labConfHIS lab, ad.idTipoDiagnosticoCQx
    FROM AtencionesDiagnosticos ad
    LEFT JOIN SubClasificacionDiagnosticos scd
        ON ad.IdSubClasificacionDx = scd.IdSubClasificacionDx
    LEFT JOIN Diagnosticos d
        ON ad.IdDiagnostico = d.IdDiagnostico
    WHERE ad.IdAtencion = @IdAtencion
    AND ad.IdClasificacionDx = @TipoDiagnostico
    AND ad.NroEvaluacion IS NULL
    ORDER BY ad.IdAtencionDiagnostico ASC

END





















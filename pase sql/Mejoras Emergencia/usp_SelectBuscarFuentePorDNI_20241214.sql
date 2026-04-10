--[dbo].[usp_SelectBuscarFuentePorDNI_20241214] '25748449'
ALTER PROCEDURE [dbo].[usp_SelectBuscarFuentePorDNI_20241214]
(
    @NroDocumento varchar(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TieneSegundaCapa bit = 0,
			@TieneOncoNaval   bit = 0,
			@Producto bit=0;
    SELECT
        @TieneSegundaCapa = MAX(CASE WHEN IDPLAN = 15 THEN 1 ELSE 0 END),
		@TieneOncoNaval   = MAX(CASE WHEN IDPLAN = 17 THEN 1 ELSE 0 END)
    FROM PacienteNuevo
    WHERE PRODUCTO != 1
      AND NRODOCUMENTO = @NroDocumento;

	SELECT
        @Producto = PRODUCTO
    FROM PacienteNuevo
    WHERE PRODUCTO = 1
      AND NRODOCUMENTO = @NroDocumento;

    DECLARE @TieneAmbas bit = CASE WHEN @TieneSegundaCapa = 1 AND @TieneOncoNaval = 1 THEN 1 ELSE 0 END;
	DECLARE @TieneSoloSC bit = CASE WHEN @TieneSegundaCapa = 1 AND @TieneOncoNaval = 0 and @Producto=1 THEN 1 ELSE 0 END;
	DECLARE @TieneSoloON bit = CASE WHEN @TieneSegundaCapa = 0 AND @TieneOncoNaval = 1 and @Producto=1 THEN 1 ELSE 0 END;

    ;WITH PlanesContado AS (
        SELECT *
        FROM (VALUES
			(1, 1),
            (2, 19),
			(3, 3),
            (4, 20),
			(5, 5),
            /*(5, 20)*/   -- Validación pendiente para BASICO 05
            (6, 21),
            (7, 7),
            (8, 23),
			(9, 24),
			(10, 25),
			(11, 26),
			(12, 12),
			(13, 13),
			(14, 14),
			(15, 15),
			(18, 18),
			(28, 28),
			(29, 29),
			(30, 30)

            --(9, 24), (10, 25), , (12, 27) -- Pendiente definición
        ) AS m(IdPlanCredito, IdPlanContado)
    )
    SELECT TOP (1)
        P.NRODOCUMENTO,
        P.APELLIDO_PATERNO,
        P.APELLIDO_MATERNO,
        P.PRIMER_NOMBRE,
        P.SEGUNDO_NOMBRE,
        P.TERCER_NOMBRE,
        P.FECHA_CREACION,
        P.FECHA_NACIMIENTO,
        P.GENERO,
        P.UBIGEO,
        P.CIP,
        P.DIRECCION,
        P.ETNIA,
        P.FECHA_ACTUALIZACION,
        fft.idFuenteFinanciamiento,
        CASE
            WHEN @TieneAmbas = 1 THEN fft.idTipoFinanciamiento                          -- Crédito
			WHEN @TieneSoloSC = 1 THEN pc.IdPlanContado                          -- Contado
			WHEN @TieneSoloON = 1 THEN pc.IdPlanContado                            -- Contado
			WHEN @TieneSoloSC = 0 THEN pc.IdPlanContado									-- Contado
			WHEN @TieneSoloON = 0 THEN pc.IdPlanContado									-- Contado
            WHEN pc.IdPlanContado IS NOT NULL THEN pc.IdPlanContado                      -- Contado
            ELSE fft.idTipoFinanciamiento                                                -- Plan sin cambio
        END AS idTipoFinanciamiento,
        INI_VIG = CONVERT(varchar(10), INI_VIG, 103),
        FIN_VIG = CONVERT(varchar(10), FIN_VIG, 103),
        POLIZA,
				p.PARENTESCO_NAVAL id_parentesco
    FROM PacienteNuevo p
    INNER JOIN FuentesFinanciamientoTarifas fft ON p.IDPLAN = fft.idplanFosmar
    LEFT JOIN PlanesContado pc ON p.IDPLAN = pc.IdPlanCredito
    WHERE p.NroDocumento = @NroDocumento
      AND p.PRODUCTO = 1
    ORDER BY INI_VIG DESC;
END;




DROP PROCEDURE IF EXISTS web_ParametrosSeleccionarPorId;
GO 

CREATE PROCEDURE [dbo].[web_ParametrosSeleccionarPorId]
(
	@IdParametro int,
	@IdIpress int = 0
)
as 
begin

	IF @IdIpress = 0
	BEGIN  
		SELECT * FROM Parametros
		WHERE IdParametro = @IdParametro
	END;
	ELSE
	BEGIN
		SELECT *,
		'data:image/png;base64,' +
    CAST('' AS XML).value(
        'xs:base64Binary(sql:column("ValorBinary"))',
        'VARCHAR(MAX)'
    ) AS Base64,
    CAST('' AS XML).value(
        'xs:base64Binary(sql:column("ValorBinary"))',
        'VARCHAR(MAX)'
    ) AS Base64v2
		FROM ParametrosIpress
		WHERE IdParametro = @IdParametro and IdIpress = @IdIpress
	END;
	
END;
GO


web_ParametrosSeleccionarPorId 1071 , 1
GO





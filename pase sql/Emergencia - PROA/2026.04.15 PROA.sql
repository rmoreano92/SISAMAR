-- Crear tabla RecetaFarmaciaAntimicrobianoPROA
CREATE TABLE RecetaFarmaciaAntimicrobianoPROA
(
    IdRecetaFarmaciaAntimicrobianoPROA INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    IdReceta INT NOT NULL,
    TipoRegistro CHAR(1) NOT NULL, -- S = Síndrome, C = Cultivo
    Item TINYINT NOT NULL,         -- 1..9 para síndrome, 1..8 para cultivo
    FechaCultivo DATE NULL,
    DescripcionOtro NVARCHAR(250) NULL,
    Estado BIT NOT NULL CONSTRAINT DF_RecetaFarmaciaAntimicrobianoPROA_Estado DEFAULT(1),
    FechaRegistro DATETIME NOT NULL CONSTRAINT DF_RecetaFarmaciaAntimicrobianoPROA_FechaRegistro DEFAULT(GETDATE())
);
GO

-- StoreProcedure para guardar

CREATE OR ALTER PROCEDURE usp_RecetaFarmaciaAntimicrobianoPROAGuardar
    @IdReceta INT,
    @XmlPROA XML
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM RecetaFarmaciaAntimicrobianoPROA
    WHERE IdReceta = @IdReceta;

    INSERT INTO RecetaFarmaciaAntimicrobianoPROA
    (
        IdReceta,
        TipoRegistro,
        Item,
        FechaCultivo,
        DescripcionOtro,
        Estado,
        FechaRegistro
    )
    SELECT
        @IdReceta,
        T.X.value('(TipoRegistro/text())[1]', 'CHAR(1)'),
        T.X.value('(Item/text())[1]', 'TINYINT'),
        CASE 
            WHEN T.X.value('(FechaCultivo/text())[1]', 'VARCHAR(10)') = '' THEN NULL
            ELSE CONVERT(DATE, T.X.value('(FechaCultivo/text())[1]', 'VARCHAR(10)'), 23)
        END,
        NULLIF(T.X.value('(DescripcionOtro/text())[1]', 'NVARCHAR(250)'), ''),
        1,
        GETDATE()
    FROM @XmlPROA.nodes('/root/item') AS T(X);
END
GO

-- Sctore Procedure para Mostrar

CREATE OR ALTER PROCEDURE usp_RecetaFarmaciaAntimicrobianoPROAListar
    @IdReceta INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        IdRecetaFarmaciaAntimicrobianoPROA,
        IdReceta,
        TipoRegistro,
        Item,
        FechaCultivo,
        DescripcionOtro,
        Estado,
        FechaRegistro
    FROM RecetaFarmaciaAntimicrobianoPROA
    WHERE IdReceta = @IdReceta
      AND Estado = 1
    ORDER BY
        CASE WHEN TipoRegistro = 'S' THEN 1 ELSE 2 END,
        Item;
END
GO



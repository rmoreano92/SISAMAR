-- Agrega campos faltantes en la tabla Triaje, guiándonos de la tabla Derivacion
IF COL_LENGTH('Triaje', 'TriajePerimCefalico') IS NULL
    ALTER TABLE Triaje ADD TriajePerimCefalico money NULL;
IF COL_LENGTH('Triaje', 'TriajePulso') IS NULL
    ALTER TABLE Triaje ADD TriajePulso int NULL;
IF COL_LENGTH('Triaje', 'TriajeDolor') IS NULL
    ALTER TABLE Triaje ADD TriajeDolor varchar(300) NULL;
IF COL_LENGTH('Triaje', 'TriajeLlenadoCapilar') IS NULL
    ALTER TABLE Triaje ADD TriajeLlenadoCapilar varchar(300) NULL;
IF COL_LENGTH('Triaje', 'Glasgow') IS NULL
    ALTER TABLE Triaje ADD Glasgow varchar(300) NULL;
IF COL_LENGTH('Triaje', 'BiermanPierson') IS NULL
    ALTER TABLE Triaje ADD BiermanPierson varchar(300) NULL;
IF COL_LENGTH('Triaje', 'TriajePerimAbdominal') IS NULL
    ALTER TABLE Triaje ADD TriajePerimAbdominal varchar(30) NULL;


-- MODIFICAR ESTOS STORED PROCEDURE 

--          web_TriajePorDerivacionGuardar
--          web_InsertUpdate_TriajeEmgHosp


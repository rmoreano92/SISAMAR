CREATE TABLE Anaqueles
(
IdAnaquel INT IDENTITY(1,1) PRIMARY KEY,
Descripcion VARCHAR(200)
)
GO 

INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 1');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 2');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 3');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 4');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 5');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 6');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 7');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 8');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 9');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 10');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 11');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 12');
INSERT INTO Anaqueles(Descripcion) VALUES('Anaquel 13');

ALTER TABLE farmSaldo ADD IdAnaquel INT
GO

CREATE PROCEDURE [dbo].[web_ListarAnaqueles]
AS 
 SELECT IdAnaquel, Descripcion from Anaqueles
GO 
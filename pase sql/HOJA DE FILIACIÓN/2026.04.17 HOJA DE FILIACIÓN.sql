
--| Stored Procedure :
--|============================================

ALTER PROCEDURE [dbo].[Web_PacientesSeleccionarPorId]
	@IdPaciente int
AS
	select 
		TOP 1 
		
		
		ISNULL(DP.IdDistrito, 0) idDistritoProcedencia, ISNULL(PP.IdProvincia, 0) idProvinciaProcedencia, ISNULL(DepP.IdDepartamento, 0) idDepartamentoProcedencia
		,ISNULL(DN.IdDistrito, 0) idDistritoNacimiento, ISNULL(PN.IdProvincia, 0) idProvinciaNacimiento, ISNULL(DepN.IdDepartamento, 0) idDepartamentoNacimiento
		,ISNULL(DD.IdDistrito, 0) idDistritoDomicilio, ISNULL(PD.IdProvincia, 0) idProvinciaDomicilio, ISNULL(DepPD.IdDepartamento, 0) idDepartamentoDomicilio
		,P.[IdPaciente]
          ,P.[ApellidoPaterno]
          ,P.[ApellidoMaterno]
          ,P.[PrimerNombre]
          ,P.[SegundoNombre]
          ,P.[TercerNombre]
          ,P.[FechaNacimiento]
          ,P.[NroDocumento]
          ,P.[Telefono]
          ,P.[DireccionDomicilio]
          ,P.[Autogenerado]
          ,P.[IdTipoSexo]
          ,P.[IdProcedencia]
          ,pro.Descripcion as Procedencia
          ,P.[IdGradoInstruccion]
          ,P.[IdEstadoCivil]
          ,P.[IdDocIdentidad]
          ,P.[IdTipoOcupacion]
          ,P.[IdCentroPobladoNacimiento]
          ,P.[IdCentroPobladoDomicilio]
          ,P.[NombrePadre]
          ,P.[NombreMadre]
          ,P.[NroHistoriaClinica]
          ,P.[IdTipoNumeracion]
          ,P.[IdCentroPobladoProcedencia]
          ,P.[Observacion]
          ,P.[IdPaisDomicilio]
          ,P.[IdPaisProcedencia]
          ,P.[IdPaisNacimiento]
          ,P.[IdDistritoProcedencia]
          ,P.[IdDistritoDomicilio]
          ,P.[IdDistritoNacimiento]
          ,P.[FichaFamiliar]
          ,P.[IdEtnia]
          ,P.[GrupoSanguineo]
          ,P.[FactorRh]
          ,P.[UsoWebReniec]
          ,P.[IdIdioma]
          ,P.[Email]
          ,P.[madreDocumento]
          ,P.[madreApellidoPaterno]
          ,P.[madreApellidoMaterno]
          ,P.[madrePrimerNombre]
          ,P.[madreSegundoNombre]
          ,P.[NroOrdenHijo]
          ,P.[madreTipoDocumento]
          ,P.[Sector]
          ,P.[Sectorista]
          ,P.[Telefono2]
          ,P.[Telefono3]
          ,P.[Telefono4]
          ,P.[IdPaisDomicilioTutor]
          ,P.[IdCentroPobladoDomicilioTutor]
          ,P.[IdDistritoDomicilioTutor]
          ,P.[DireccionDomicilioTutor]
          ,P.[tieneHCDigital]
          ,P.[InfTipoDocumento]
          ,P.[InfNroDocumento]
          ,P.[InfApePaterno]
          ,P.[InfApeMaterno]
          ,P.[InfPNombre]
          ,P.[InfSNombre]
          ,P.[InfTelefono]
          ,P.[InfIdParentesco]
          ,P.[InfDistrito]
          ,P.[InfPoblado]
          ,P.[InfPais]
          ,P.[InfDireccion]
          ,P.[TipoDocumentoMadre]
          ,P.[NroDocumentoMadre]
          ,P.[NombresMadre]
          ,P.[TipoDocumentoPadre]
          ,P.[NroDocumentoPadre]
          ,P.[NombresPadre]
          ,P.[FechaCreacion]
          ,P.[CondLaboral]
          ,P.[IdDiscapacidad]
          ,P.[InfIdParentescoTitular]
          ,P.[IdTipoPaciente]
          ,P.[IdEstado]
          ,P.[idUnidadPago]
          ,P.[CodigoCajaPension]
          ,P.[Montepio]
          ,P.[Celular]
          ,P.[IndDonante]
          ,P.[EstadoMigracion]
          ,P.[idReligion]
          ,P.[Acompaniante]
          ,P.[IdReferencia]
          ,P.[IdEmpleado]
          ,P.[IdDepartamentoDomicilio]
          ,P.[IdDepartamentoProcedencia]
          ,P.[IdDepartamentoNacimiento]
          ,P.[CipPaciente]
          ,P.[TelefonoMadre]
          ,P.[cboParentescoMadre]
          ,P.[TipoMPadres]
          ,P.[NroDocMPadres]
          ,P.[NombresMPadres]
          ,P.[TipoPPadres]
          ,P.[NroDocPPadres]
          ,P.[NombresPPadres]
          ,P.[ParentescoPaciente]
          ,Parent.Descripcion as Parentesco
          ,P.[cboDiscapacidadPaciente]
          ,P.[DependenciaPaciente]
          ,P.[UnidadPagoPaciente]
          ,P.[GradoPaciente]
          ,P.[SituacionPaciente]
          ,P.[FactorRHPaciente]
          ,P.[GrupoSanguineoPaciente]
          ,P.[CodigoCajaPensionPaciente]
          ,P.[Telefono2Paciente]
          ,P.[Telefono3Paciente]
          ,P.[IdPaisMadre]
          ,P.[idDepartamentoMadre]
          ,P.[idProvinciaMadre]
          ,P.[idDistritoMadre]
          ,P.[idCentroPobladoMadre]
          ,P.[DireccionMadre]
          ,P.[HoraNacimiento]
          ,P.[prevCondLaboral]
		,TiposNumeracionHistoria.Descripcion TiposNumeracionHistoria
		,TiposEstadoCivil.Descripcion EstadoCivilDes
		,TiposSexo.Descripcion Sexo
		,TiposOcupacion.descripcion Ocupacion
		,TiposGradoInstruccion.Descripcion GradoInstruccion
		,HIS_tabetnia.desetni Etnia
		,TiposIdiomas.Lengua Idioma
		,Religion.Descripcion Religion
		,P.madreDocumento
		,RTRIM(LTRIM(ISNULL(P.madreApellidoPaterno, '') + ' ' + ISNULL(P.madreApellidoMaterno, ''))) apellidosMadre
		,RTRIM(LTRIM(ISNULL(P.madrePrimerNombre, '') + ' ' + ISNULL(P.madreSegundoNombre, ''))) nombresMadre
		,RTRIM(LTRIM(ISNULL(P.ApellidoPaterno + ' ', '') + ISNULL(P.ApellidoMaterno, ''))) + ' ' + RTRIM(LTRIM(ISNULL(P.PrimerNombre, '') + ' ' + ISNULL(P.SegundoNombre, ''))) nombres
		,RTRIM(LTRIM(ISNULL(P.PrimerNombre, '') + ' ' + ISNULL(P.SegundoNombre, '') + ' ' + ISNULL(P.TercerNombre, ''))) nombresPaciente
		--,CONVERT(CHAR(8), p.FechaNacimiento, 108) HoraNacimiento
		,'' HoraNacimiento
		,fecNacimiento = CONVERT(VARCHAR(10), P.FechaNacimiento, 103) -- + ' ' +  CONVERT(VARCHAR(5), P.FechaNacimiento, 108) , 
		,CONVERT(VARCHAR, P.FechaNacimiento, 101) fecNacimientoT2, TiposDocIdentidad.Descripcion TipoDocumento
		
		,DepPD.Nombre nombreDepartamentoDomicilio
		,PD.Nombre nombreProvinciaDomicilio
		,DD.Nombre nombreDistritoDomicilio
		,CPD.Nombre nombreCentroPobladoDomicilio
		,PaisD.Nombre nombrePaisDomicilio
		,DepP.Nombre nombreDepartamentoProcedencia
		,PP.Nombre nombreProvinciaProcedencia
		,DP.Nombre nombreDistritoProcedencia
		,CPP.Nombre nombreCentroPobladoProcedencia
		,PaisP.Nombre nombrePaisProcedencia
		,DepN.Nombre nombreDepartamentoNacimiento
		,PN.Nombre nombreProvinciaNacimiento
		,DN.Nombre nombreDistritoNacimiento
		,CPN.Nombre nombreCentroPobladoNacimiento
		,PaisN.Nombre nombrePaisNacimiento
		,UsuarioCrea = (SELECT TOP 1 ISNULL(Empleados.Usuario, '') FROM Auditoria LEFT JOIN Empleados ON Empleados.IdEmpleado = Auditoria.IdEmpleado WHERE IdRegistro = P.NroHistoriaClinica AND Accion = 'A' AND RTRIM(LTRIM(Tabla)) = 'HistoriasClinicas' ORDER BY FechaHora DESC)
		,UsuarioCreaNombres = (SELECT TOP 1 ISNULL(Empleados.Nombres, '') + ' ' + ISNULL(Empleados.ApellidoPaterno, '') + ' ' + ISNULL(Empleados.ApellidoMaterno, '') FROM Auditoria LEFT JOIN Empleados ON Empleados.IdEmpleado = Auditoria.IdEmpleado WHERE IdRegistro = P.NroHistoriaClinica AND Accion = 'A' AND RTRIM(LTRIM(Tabla)) = 'HistoriasClinicas' ORDER BY FechaHora DESC)
		,UsuarioModifica = (SELECT TOP 1 ISNULL(Empleados.Usuario, '') FROM Auditoria LEFT JOIN Empleados ON Empleados.IdEmpleado = Auditoria.IdEmpleado WHERE IdRegistro = P.IdPaciente AND Accion = 'M' AND RTRIM(LTRIM(Tabla)) = 'Pacientes' ORDER BY FechaHora DESC),		
		p.TelefonoMadre,
		p.cboParentescoMadre,
		p.TipoMPadres,
		p.NroDocMPadres,
		p.NombresMPadres,
		p.TipoPPadres,
		p.NroDocPPadres,
		p.NombresPPadres,
		
		p.cboDiscapacidadPaciente,
		p.DependenciaPaciente,
		p.UnidadPagoPaciente,
		p.GradoPaciente,
		p.SituacionPaciente,
		p.FactorRHPaciente,
		p.GrupoSanguineoPaciente,
		p.CodigoCajaPensionPaciente,
		p.Telefono2Paciente,
		p.Telefono3Paciente,
		p.IdPaisMadre,
		p.idDepartamentoMadre,
		p.idProvinciaMadre,
		p.idDistritoMadre,
		p.idCentroPobladoMadre,
		p.DireccionMadre,
		isnull(isnull(isnull(p.ParentescoPaciente, p2.InfIdParentescoTitular),p2.CondLaboral),p.CondLaboral) ParentescoPaciente,
		isnull(p.CipPaciente,p.fichaFamiliar) as CipPaciente,

        (
            SELECT TOP 1
                LTRIM(RTRIM(
                    ISNULL(t.ApellidoPaterno, '') + ' ' +
                    ISNULL(t.ApellidoMaterno, '') + ' ' +
                    ISNULL(t.PrimerNombre, '') + ' ' +
                    ISNULL(t.SegundoNombre, '')
                ))
                + ' | Grado: ' + ISNULL(tgi.Descripcion, ' - ')
                /*+ ' | CIP/Ficha: ' + 
                    ISNULL(NULLIF(LTRIM(RTRIM(t.CipPaciente)), ''), ISNULL(t.FichaFamiliar, ''))*/
                /*+ ' | Dependencia: ' + ISNULL(tp.Descripcion, '')*/
                + ' | Teléfono: ' + ISNULL(t.Celular, ISNULL(t.Telefono, ' - '))
                + ' | Historia: ' + ISNULL(CONVERT(VARCHAR(20), t.NroHistoriaClinica), ' - ')
            FROM Pacientes t
                LEFT JOIN Pacientes2207 t2 ON t2.IdPaciente = t.IdPaciente
                LEFT JOIN TiposGradoInstruccion tgi ON tgi.IdGradoInstruccion = t.IdGradoInstruccion
                LEFT JOIN TiposProcedencia tp ON tp.IdProcedencia = t.IdProcedencia
                LEFT JOIN UnidadPago up ON up.IdUnidadPago = t.IdUnidadPago
            WHERE ISNULL(ISNULL(ISNULL(t.ParentescoPaciente, t2.InfIdParentescoTitular), t2.CondLaboral), t.CondLaboral) = 0
              AND t.FichaFamiliar = p.FichaFamiliar
        ) AS Titular


	from 
		Pacientes P
		LEFT JOIN Pacientes2207 p2 ON p2.idpaciente = p.idpaciente
		LEFT JOIN TiposEstadoCivil ON P.IdEstadoCivil = TiposEstadoCivil.IdEstadoCivil
		LEFT JOIN TiposSexo ON P.IdTipoSexo = TiposSexo.IdTipoSexo
		LEFT JOIN TiposOcupacion ON P.IdTipoOcupacion = TiposOcupacion.IdTipoOcupacion
		LEFT JOIN TiposDocIdentidad ON P.IdDocIdentidad = TiposDocIdentidad.IdDocIdentidad
		LEFT JOIN TiposGradoInstruccion ON P.IdGradoInstruccion = TiposGradoInstruccion.IdGradoInstruccion
		LEFT JOIN HIS_tabetnia ON P.IdEtnia = HIS_tabetnia.codetni
		LEFT JOIN TiposIdiomas ON P.IdIdioma = TiposIdiomas.IdIdioma
		LEFT JOIN Religion ON P.IdReligion = Religion.IdReligion
		LEFT JOIN TiposNumeracionHistoria ON P.IdTipoNumeracion = TiposNumeracionHistoria.IdTipoNumeracion

		LEFT JOIN Paises PaisP ON P.IdPaisProcedencia = PaisP.IdPais 
		LEFT JOIN Distritos DP ON P.IdDistritoProcedencia = DP.IdDistrito
		LEFT JOIN Provincias PP ON DP.IdProvincia = PP.IdProvincia
		LEFT JOIN Departamentos DepP ON PP.IdDepartamento = DepP.IdDepartamento
		LEFT JOIN CentrosPoblados CPP ON P.IdCentroPobladoDomicilio = CPP.IdCentroPoblado

		LEFT JOIN Paises PaisN ON P.IdPaisNacimiento = PaisN.IdPais 
		LEFT JOIN Distritos DN ON P.IdDistritoNacimiento = DN.IdDistrito
		LEFT JOIN Provincias PN ON DN.IdProvincia = PN.IdProvincia
		LEFT JOIN Departamentos DepN ON PN.IdDepartamento = DepN.IdDepartamento
		LEFT JOIN CentrosPoblados CPN ON P.IdCentroPobladoDomicilio = CPN.IdCentroPoblado

		LEFT JOIN Paises PaisD ON P.IdPaisDomicilio = PaisD.IdPais
		LEFT JOIN Distritos DD ON P.IdDistritoDomicilio = DD.IdDistrito
		LEFT JOIN Provincias PD ON DD.IdProvincia = PD.IdProvincia
		LEFT JOIN Departamentos DepPD ON PD.IdDepartamento = DepPD.IdDepartamento
		LEFT JOIN CentrosPoblados CPD ON P.IdCentroPobladoDomicilio = CPD.IdCentroPoblado
        LEFT JOIN TiposProcedencia pro ON pro.IdProcedencia = p.IdProcedencia
        LEFT JOIN TiposCondicionLaboral Parent ON Parent.IdCondicion = P.ParentescoPaciente
	where p.IdPaciente = @IdPaciente


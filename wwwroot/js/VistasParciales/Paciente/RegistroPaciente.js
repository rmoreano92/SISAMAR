let RegistroPaciente = {
    IdPaciente: 0,
    TiposNumeracionHistoriaSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Paciente/TiposNumeracionHistoriaSeleccionarTodos?area=Comun');

        $('#cboTipoHistoriaPaciente').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoHistoriaPaciente').append(`<option value="${obj.idTipoNumeracion}">${obj.descripcionLarga}</option>`)
        })

        $('#cboTipoHistoriaPaciente').val(1)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TipoPacienteEnEspecialidad: function (idPaciente, idEspecialidad) {
        var formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idEspecialidad', idEspecialidad);

        return HttpClient.Post('/Utilitario/TipoPacienteEnEspecialidad', formData).then(res => {
            return res.dataSet.table[0]
        })
    },
    //BuscarFuentePorDNI: function (idPaciente, idEspecialidad) {
    //    var formData = new FormData();
    //    formData.append('idPaciente', idPaciente);
    //    formData.append('idEspecialidad', idEspecialidad);

    //    return HttpClient.Post('/Paciente/BuscarFuentePorDNI?comun=ConsultaExterna', formData).then(res => {
    //        return res.dataSet.table[0]
    //    })
    //},
    //==============KHOYOSI 20032026===============================================================================
    BuscarFuentePorDNI: function (nroDocumento) {
        var formData = new FormData();
        formData.append('nroDocumento', nroDocumento);

        return HttpClient.Post('/Paciente/BuscarFuentePorDNI?comun=ConsultaExterna', formData).then(res => {
            return res.lsPacientes.table.length > 0 ? res.lsPacientes.table[0] : null
        })
    },
    //==============================================================================================================
    ListaTiposDocumentos: () => {

        fetch('/Utilitario/ListaTiposDocumentos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboTipoDocPaciente').empty();
                $('#cboTipoDocMadre').empty();
                $(response.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocPaciente').append(`<option descripcion="${obj.descripcion}" value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                    $('#cboTipoDocMadre').append(`<option descripcion="${obj.descripcion}" value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposEtnia: () => {

        fetch('/Utilitario/TiposEtnia?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboEtniaPaciente').empty();
                $('#cboEtniaPaciente').append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsEtnia.table).each(function (i, obj) {
                    $('#cboEtniaPaciente').append(`<option value="${obj.codetni}">${obj.desetni}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposIdiomasSeleccionarTodos: () => {

        fetch('/Utilitario/TiposIdiomasSeleccionarTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboIdiomaMaternoPaciente').empty();
                $('#cboIdiomaMaternoPaciente').append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsIdiomas.table).each(function (i, obj) {
                    $('#cboIdiomaMaternoPaciente').append(`<option value="${obj.idIdioma}">${obj.lengua}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    ListaTiposEstadoCivilTodos: () => {

        fetch('/Utilitario/ListaTiposEstadoCivilTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboEstadoCivilPaciente').empty();
                $(response.lsEstadoCivil.table).each(function (i, obj) {
                    $('#cboEstadoCivilPaciente').append(`<option value="${obj.idEstadoCivil}">${obj.dCorto}</option>`)
                })
                $(`#cboOcupacionPaciente option[value='9']`).attr("selected", true);
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposGradoInstruccionTodos: () => {

        fetch('/Utilitario/TiposGradoInstruccionTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboGradoInstruccionPaciente').empty();
                $('#cboGradoInstruccionPaciente').append(`<option value="0">Seleccionar</option>`)
                $(response.lsGradosIns.table).each(function (i, obj) {
                    $('#cboGradoInstruccionPaciente').append(`<option value="${obj.idGradoInstruccion}">${obj.dCorto}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    //MGAMERO
    ListaParentesco2: async () => {
        console.log('Ejecutando ListaParentesco2');
        try {

            const res = await fetch('/Utilitario/ListarTiposParentesco?area=Comun', {
                method: 'POST'
            });

            if (!res.ok) throw new Error('Error en la respuesta del servidor');

            const response = await res.json();

            console.log('Parentesco response:', response);

            if (!response.session) {
                alert("Sesión expirada");
                location.reload();
                return;
            }

            const $combo = $('#cboParentescoPaciente');
            $combo.empty();
            $combo.append('<option value="">Seleccione una opción</option>');


            const data = response.respuesta?.table || [];

            data.forEach(obj => {
                $combo.append(
                    `<option value="${obj.idCondicion}">
                    ${obj.descripcion}
                 </option>`
                );
            });

            $combo.trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error);
        }
    },
    TiposEdadSeleccionarTodos: () => {

        fetch('/Utilitario/TiposEdadSeleccionarTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboTipoEdadPaciente').empty();
                $('#cboTipoEdadPaciente').append(`<option value="0">--Seleccionar--</option>`)
                $(response.data.table).each(function (i, obj) {
                    $('#cboTipoEdadPaciente').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposReligion: () => {

        fetch('/Utilitario/TiposReligion?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboReligionPaciente').empty();
                $('#cboReligionPaciente').append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsReligion.table).each(function (i, obj) {
                    $('#cboReligionPaciente').append(`<option value="${obj.idReligion}">${obj.descripcion}</option>`)
                })
                $('#cboReligionPaciente').val(4)
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposProcedenciaTodos: () => {

        fetch('/Utilitario/TiposProcedenciaTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboProcedenciaPaciente').empty()
                $(response.lsTProcedencias.table).each(function (i, obj) {
                    $('#cboProcedenciaPaciente').append(`<option value="${obj.idProcedencia}">${obj.dCorto}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated")
            })
    },
    TiposOcupacionTodos: () => {

        fetch('/Utilitario/TiposOcupacionTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboOcupacionPaciente').empty();
                $(response.lsOcupacion.table).each(function (i, obj) {
                    $('#cboOcupacionPaciente').append(`<option value="${obj.idTipoOcupacion}">${obj.dCorto}</option>`)
                })
                $(`#cboOcupacionPaciente`).val(142);
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },

    ListaParentesco2: async () => {
        console.log('Ejecutando ListaParentesco2');
        try {

            const res = await fetch('/Utilitario/ListarTiposParentesco?area=Comun', {
                method: 'POST'
            });

            if (!res.ok) throw new Error('Error en la respuesta del servidor');

            const response = await res.json();

            console.log('Parentesco response:', response);

            if (!response.session) {
                alert("Sesión expirada");
                location.reload();
                return;
            }

            const $combo = $('#cboParentescoPaciente');
            $combo.empty();
            $combo.append('<option value="">Seleccione una opción</option>');

            // 👇 AQUÍ ESTÁ EL CAMBIO REAL
            const data = response.respuesta?.table || [];

            data.forEach(obj => {
                $combo.append(
                    `<option value="${obj.idCondicion}">
                    ${obj.descripcion}
                 </option>`
                );
            });

            $combo.trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error);
        }
    },

    ListaPaises: async function () {
        try {

            let res = await HttpClient.Get('/Utilitario/ListaPaises?area=Comun')

            $('#cboPaisNacimiento').empty()
            $('#cboPaisProcedencia').empty()
            $('#cboPaisDomicilio').empty()

            $(res.data.table).each(function (i, obj) {
                $('#cboPaisNacimiento').append(`<option value="${obj.idPais}">${obj.nombre}</option>`)
                $('#cboPaisProcedencia').append(`<option value="${obj.idPais}">${obj.nombre}</option>`)
                $('#cboPaisDomicilio').append(`<option value="${obj.idPais}">${obj.nombre}</option>`)
            })

            $(`#cboPaisNacimiento`).val(166)
            $(`#cboPaisProcedencia`).val(166)
            $(`#cboPaisDomicilio`).val(166)

            $(`#cboPaisNacimiento`).trigger('change')
            $(`#cboPaisProcedencia`).trigger('change')
            $(`#cboPaisDomicilio`).trigger('change')

            $('.chzn-select').chosen().trigger("chosen:updated")
        }
        catch (error) {
            console.error('Error:', error)
            return null
        }
    },
    ListaDepartamentosSeleccionarPorIdPais: async function (idPais, cboDepartamento) {

        try {
            let formData = new FormData()

            formData.append('IdPais', idPais)

            let res = await HttpClient.Post('/Utilitario/ListaDepartamentosSeleccionarPorIdPais?area=Comun', formData)

            $('#' + cboDepartamento).empty();

            $(res.lsDeparta.table).each(function (i, obj) {
                $('#' + cboDepartamento).append(`<option value="${obj.idDepartamento}">${obj.nombre}</option>`)
            })
            $('#cboDepartamentoDomicilio').val(0)
            $('#cboDepartamentoProcedencia').val(0)
            $('#cboDepartamentoNacimiento').val(0)
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            console.error('Error:', error)
        }
    },
    ListaProvinciasByDepartamentos: async function (idDepartamento, cboProvincia) {

        try {
            let formData = new FormData();
            formData.append("idDepartamento", idDepartamento)

            let res = await HttpClient.Post('/Utilitario/ListaProvinciasByDepartamentos?area=Comun', formData)

            $('#' + cboProvincia).empty();

            $(res.lsProvincias.table).each(function (i, obj) {
                $('#' + cboProvincia).append(`<option value="${obj.idProvincia}">${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error)
        }


    },
    ListaDistritosByProvincia: async function (idDProvincia, cboDistrito) {

        try {
            let formData = new FormData();
            formData.append("idDProvincia", idDProvincia)

            let res = await HttpClient.Post('/Utilitario/ListaDistritosByProvincia?area=Comun', formData)

            $('#' + cboDistrito).empty();

            $(res.lsDistrito.table).each(function (i, obj) {
                $('#' + cboDistrito).append(`<option value="${obj.idDistrito}">${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error)
        }
    },
    ListaCentroPobladoByDistrito: async function (idDistrito, cboCentroPoblado) {
        try {
            let formData = new FormData();
            formData.append("idDistrito", idDistrito)

            let res = await HttpClient.Post('/Utilitario/ListaCentroPobladoByDistrito?area=Comun', formData)

            $('#' + cboCentroPoblado).empty();

            $(res.lsCentroPoblado.table).each(function (i, obj) {
                $('#' + cboCentroPoblado).append(`<option value="${obj.idCentroPoblado}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            console.error('Error:', error)
        }
    },
    HistoriasClinicasSeleccionarPorId: async function (nroHistoriaClinica) {
        let formData = new FormData();
        formData.append("nroHistoriaClinica", nroHistoriaClinica)
        return HttpClient.Post('/Paciente/HistoriasClinicasSeleccionarPorId', formData).then(res => {
            return res.dataSet.table[0]
        })
    },
    ObtenerDepartamentoProvinciaByDistrito: function (idDistrito) {
        let formData = new FormData();
        formData.append("idDistrito", idDistrito)

        return HttpClient.Post('/Utilitario/web_selectIdDepartamentoIdProvinciaByIdDistritoV2', formData).then(res => {
            return res.dataSet.table[0]
        })
    },
    TipoPacienteEnEspecialidad: function (idPaciente, idEspecialidad) {
        var formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idEspecialidad', idEspecialidad);

        return HttpClient.Post('/Utilitario/TipoPacienteEnEspecialidad', formData).then(res => {
            return res.dataSet.table[0]
        })
    },

    CompletarDatosPaciente: async function (data, tipoAccion) { // tipo accion sirve para identificar si se llama el metodo desde buscar datos paciente si es un buscara si es reingresante, nuevo continuador

        let historia = await this.HistoriasClinicasSeleccionarPorId(data.nroHistoriaClinica)
        let edad = getEdad(FormatearFecha(data.fechaNacimiento))[0]
        let tipoEdad = getEdad(FormatearFecha(data.fechaNacimiento))[1]

        await RegistroPaciente.ListaProvinciasByDepartamentos(data.idDepartamentoDomicilio, 'cboProvinciaDomicilio')
        await RegistroPaciente.ListaDistritosByProvincia(data.idProvinciaDomicilio, 'cboDistritoDomicilio')
        await RegistroPaciente.ListaCentroPobladoByDistrito(data.idDistritoDomicilio, 'cboCentroPobladoDomicilio')

        await RegistroPaciente.ListaProvinciasByDepartamentos(data.idDepartamentoProcedencia, 'cboProvinciaProcedencia')
        await RegistroPaciente.ListaDistritosByProvincia(data.idProvinciaProcedencia, 'cboDistritoProcedencia')
        await RegistroPaciente.ListaCentroPobladoByDistrito(data.idDistritoProcedencia, 'cboCentroPobladoProcedencia')

        await RegistroPaciente.ListaProvinciasByDepartamentos(data.idDepartamentoNacimiento, 'cboProvinciaNacimiento')
        await RegistroPaciente.ListaDistritosByProvincia(data.idProvinciaNacimiento, 'cboDistritoNacimiento')
        await RegistroPaciente.ListaCentroPobladoByDistrito(data.idDistritoNacimiento, 'cboCentroPobladoNacimiento')

        RegistroPaciente.IdPaciente = data.idPaciente

        $(`#txtUsuarioCrea`).val(data.usuarioCrea)
        $(`#txtUsuarioModifica`).val(data.usuarioModifica)
        $(`#cboTipoDocPaciente`).val(data.idDocIdentidad)
        $('#txtDniPaciente').val(data.nroDocumento)
        $('#txtNroHistoriaPaciente').val(data.nroHistoriaClinica)
        $('#txtFechaCreacionPaciente').val(historia.fechaCreacion.substr(8, 2) + '/' + historia.fechaCreacion.substr(5, 2) + '/' + historia.fechaCreacion.substr(0, 4))

        $('#txtApellidoPaternoPaciente').val(data.apellidoPaterno)
        $('#txtApellidoMaternoPaciente').val(data.apellidoMaterno)
        $('#txtPrimerNombrePaciente').val(data.primerNombre)
        $('#txtSegundoNombrePaciente').val(data.segundoNombre)
        $('#txtTercerNombrePaciente').val(data.tercerNombre)
        $('#txtIdPaciente').val(data.idPaciente)
        $("#txtPacienteFechaNacimiento").datepicker("setDate", FormatearFecha(data.fechaNacimiento));
        $('#txtEdadPaciente').val(edad)
        $(`#cboTipoEdadPaciente`).val(tipoEdad)
        $('#txtEsNroHijoPaciente').val(data.nroOrdenHijo)
        $(`#cboSexoPaciente`).val(data.idTipoSexo)
        $(`#cboEstadoCivilPaciente`).val(data.idEstadoCivil)
        $(`#cboEtniaPaciente`).val(data.idEtnia)
        $(`#cboIdiomaMaternoPaciente`).val(data.idIdioma)
        $(`#cboGradoInstruccionPaciente`).val(data.idGradoInstruccion)
        $(`#cboOcupacionPaciente`).val(data.idTipoOcupacion)
        $(`#cboProcedenciaPaciente`).val(data.idProcedencia)
        $(`#cboReligionPaciente`).val(data.idReligion)
        $('#txtTelefonoPaciente').val(data.telefono)
        $('#txtEmailPaciente').val(data.email)
        $('#txtNombrePadrePaciente').val(data.nombrePadre)
        $('#txtObservacionPaciente').val(data.observacion)

        $(`#cboTipoDocMadre`).val(data.madreTipoDocumento)
        $('#txtNroDocMadre').val(data.madreDocumento)
        $('#txtApellidoPaternoMadre').val(data.madreApellidoPaterno)
        $('#txtApellidoMaternoMadre').val(data.madreApellidoMaterno)
        $('#txtPrimerNombreMadre').val(data.madrePrimerNombre)
        $('#txtSegundoNombreMadre').val(data.madreSegundoNombre)


        $('#cboPaisDomicilio').val(data.idPaisDomicilio)
        $('#cboPaisProcedencia').val(data.idPaisProcedencia)
        $('#cboPaisNacimiento').val(data.idPaisNacimiento)

        $('.chzn-select').chosen().trigger("chosen:updated")

        //$('#cboPaisDomicilio').trigger('change')
        //$('#cboPaisProcedencia').trigger('change')
        //$('#cboPaisNacimiento').trigger('change')


        //setTimeout(function () {
        $('#cboDepartamentoDomicilio').val(data.idDepartamentoDomicilio)
        $('#cboDepartamentoProcedencia').val(data.idDepartamentoProcedencia)
        $('#cboDepartamentoNacimiento').val(data.idDepartamentoNacimiento)

        $('#cboProvinciaDomicilio').val(data.idProvinciaDomicilio)
        $('#cboDistritoDomicilio').val(data.idDistritoDomicilio)
        $('#cboCentroPobladoDomicilio').val(data.idCentroPobladoDomicilio)

        $('#cboProvinciaProcedencia').val(data.idProvinciaProcedencia)
        $('#cboDistritoProcedencia').val(data.idDistritoProcedencia)
        $('#cboCentroPobladoProcedencia').val(data.idCentroPobladoProcedencia)

        $('#cboProvinciaNacimiento').val(data.idProvinciaNacimiento)
        $('#cboDistritoNacimiento').val(data.idDistritoNacimiento)
        $('#cboCentroPobladoNacimiento').val(data.idCentroPobladoNacimiento)

        //$('.chzn-select').chosen().trigger("chosen:updated")
        //}, 500)


        $('#txtDireccionDomicilio').val(data.direccionDomicilio)
        $('#txtCipPaciente').val(data.cipPaciente1)

        $('#txtPacienteFechaNacimiento').trigger('input')




        let tipoSexo = data.idTipoSexo == 1 ? 'M' : 'F'

        if (!isEmpty(data.fechaNacimiento)) {
            edad = getEdad(data.fechaNacimiento.substr(5, 2) + '/' + data.fechaNacimiento.substr(8, 2) + '/' + data.fechaNacimiento.substr(0, 4))[0]
            tipoEdad = getEdad(data.fechaNacimiento.substr(5, 2) + '/' + data.fechaNacimiento.substr(8, 2) + '/' + data.fechaNacimiento.substr(0, 4))[1]
        }

        console.log(historia);
        $(`#txtUsuarioCrea`).val(data.usuarioCrea)
        $(`#txtUsuarioModifica`).val(data.usuarioModifica)
        $(`#cboTipoDocPaciente`).val(data.idDocIdentidad)
        $('#txtDniPaciente').val(data.nroDocumento)
        $('#txtNroHistoriaPaciente').val(data.nroHistoriaClinica)
        $('#txtFechaCreacionPaciente').val(historia.fechaCreacion.substr(8, 2) + '/' + historia.fechaCreacion.substr(5, 2) + '/' + historia.fechaCreacion.substr(0, 4))


        //HIJOS
        $('#txtPaciente2').val(data.apellidoPaterno + " " + data.apellidoMaterno + ", " + data.primerNombre + " " + data.segundoNombre + " " + data.tercerNombre)

        //var descripcionSexo = $('#cboSexoPaciente option').eq(data.idTipoSexo).text();
        $('#txtSexo').val($('#cboSexoPaciente option').eq(data.idTipoSexo).text())
        //var descripcionTipoDocumento = $('#cboTipoDocPaciente').find('option:selected').text();
        $('#txtDocumento').val($('#cboTipoDocPaciente option').eq(data.idDocIdentidad).text())

        $('#txtNroDocumento').val(data.nroDocumento)
        $('#txtNroHistoria').val(data.nroHistoriaClinica)


        var nombrePais = $('#cboPaisProcedencia').find('option:selected').text();

        $('#txtPais').val(nombrePais)

        $('#txtApellidoPaternoPaciente').val(data.apellidoPaterno)
        $('#txtApellidoMaternoPaciente').val(data.apellidoMaterno)
        $('#txtPrimerNombrePaciente').val(data.primerNombre)
        $('#txtSegundoNombrePaciente').val(data.segundoNombre)
        $('#txtTercerNombrePaciente').val(data.tercerNombre)
        $('#txtIdPaciente').val(data.idPaciente)

        if (!isEmpty(data.fechaNacimiento)) {
            $("#txtPacienteFechaNacimiento").datepicker("setDate", FormatearFecha(data.fechaNacimiento.substr(5, 2) + '/' + data.fechaNacimiento.substr(8, 2) + '/' + data.fechaNacimiento.substr(0, 4)));
        }

        $('#txtEdadPaciente').val(edad)
        $(`#cboTipoEdadPaciente`).val(tipoEdad)
        $('#txtEsNroHijoPaciente').val(data.nroOrdenHijo)
        $(`#cboSexoPaciente`).val(data.idTipoSexo)
        $(`#cboEstadoCivilPaciente`).val(data.idEstadoCivil)
        $(`#cboEtniaPaciente`).val(data.idEtnia)
        $(`#cboIdiomaMaternoPaciente`).val(data.idIdioma)
        $(`#cboGradoInstruccionPaciente`).val(data.idGradoInstruccion)
        $(`#cboOcupacionPaciente`).val(data.idTipoOcupacion)
        $(`#cboProcedenciaPaciente`).val(data.idProcedencia)
        $(`#cboReligionPaciente`).val(data.idReligion)
        $('#txtTelefonoPaciente').val(data.telefono)
        $('#txtEmailPaciente').val(data.email)
        $('#txtNombrePadrePaciente').val(data.nombrePadre)
        $('#txtObservacionPaciente').val(data.observacion)

        $(`#cboTipoDocMadre`).val(data.madreTipoDocumento)
        $('#txtNroDocMadre').val(data.madreDocumento)
        $('#txtApellidoPaternoMadre').val(data.madreApellidoPaterno)
        $('#txtApellidoMaternoMadre').val(data.madreApellidoMaterno)
        $('#txtPrimerNombreMadre').val(data.madrePrimerNombre)
        $('#txtSegundoNombreMadre').val(data.madreSegundoNombre)


        $('#cboPaisDomicilio').val(data.idPaisDomicilio)
        $('#cboPaisProcedencia').val(data.idPaisProcedencia)
        $('#cboPaisNacimiento').val(data.idPaisNacimiento)

        $('#cboDepartamentoDomicilio').val(data.idDepartamentoDomicilio)
        $('#cboDepartamentoProcedencia').val(data.idDepartamentoProcedencia)
        $('#cboDepartamentoNacimiento').val(data.idDepartamentoNacimiento)

        $('#cboProvinciaDomicilio').val(data.idProvinciaDomicilio)
        $('#cboDistritoDomicilio').val(data.idDistritoDomicilio)
        $('#cboCentroPobladoDomicilio').val(data.idCentroPobladoDomicilio)

        $('#cboProvinciaProcedencia').val(data.idProvinciaProcedencia)
        $('#cboDistritoProcedencia').val(data.idDistritoProcedencia)
        $('#cboCentroPobladoProcedencia').val(data.idCentroPobladoProcedencia)

        $('#cboProvinciaNacimiento').val(data.idProvinciaNacimiento)
        $('#cboDistritoNacimiento').val(data.idDistritoNacimiento)
        $('#cboCentroPobladoNacimiento').val(data.idCentroPobladoNacimiento)

        $('#txtDireccionDomicilio').val(data.direccionDomicilio)
        $('#txtCipPaciente').val(data.cipPaciente1)

        $('#txtTelefonoMadre').val(data.telefonoMadre1)
        $('#cboParentescoMadre').val(data.cboParentescoMadre1)

        console.log(data.parentescoPaciente1);
        $('#cboParentescoPaciente').val(data.parentescoPaciente1)
        $('#cboDiscapacidadPaciente').val(data.cboDiscapacidadPaciente1)
        $('#cboDependenciaPaciente').val(data.dependenciaPaciente1)
        $('#cboUnidadPagoPaciente').val(data.unidadPagoPaciente1)
        $('#cboGradoPaciente').val(data.gradoPaciente1)
        $('#cboSituacionPaciente').val(data.situacionPaciente1)
        $('#cboFactorRHPaciente').val(data.factorRHPaciente1)
        $('#cboGrupoSanguineoPaciente').val(data.grupoSanguineoPaciente1)
        $('#txtCodigoCajaPensionPaciente').val(data.codigoCajaPensionPaciente1)
        $('#txtTelefono2Paciente').val(data.telefono2Paciente1)
        $('#txtTelefono3Paciente').val(data.telefono3Paciente1)

        $('#cboTipoMPadres').val(data.tipoPPadres1)
        $('#txtNroDocMPadres').val(data.nroDocPPadres1)
        $('#txtNombresMPadres').val(data.nombresPPadres1)
        $('#cboTipoPPadres').val(data.tipoMPadres1)
        $('#txtNroDocPPadres').val(data.nroDocMPadres1)
        $('#txtNombresPPadres').val(data.nombresMPadres1)

        $('#cboPaisMadre').val(data.idPaisMadre1)
        $('#cboDepartamentoMadre').val(data.idDepartamentoMadre1)
        $('#cboProvinciaMadre').val(data.idProvinciaMadre1)
        $('#cboDistritoMadre').val(data.idDistritoMadre1)
        $('#cboCentroPobladoMadre').val(data.idCentroPobladoMadre1)
        $('#txtDireccionMadre').val(data.direccionMadre1);


        

        $('.chzn-select').chosen().trigger("chosen:updated")

        

        //$('#txtPacienteFechaNacimiento').trigger('input')


        if (tipoAccion == 1) { // 1 = buscar

            let tipoPaciente = await RegistroAdmision.TipoPacienteEnEspecialidad(data.idPaciente,
                $('#cboEspecialidadCita').val() || $("#cboServicioEmergenciaBuscar option:checked")?.data("idespecialidad"))
            //let planPaciente = await RegistroAdmision.BuscarFuentePorDNI(data.BuscarFuentePorDNI, $('#cboEspecialidadCita').val())
            let planPaciente = await RegistroAdmision.BuscarFuentePorDNI(data.nroDocumento)
            
            //console.log('planPaciente', planPaciente);

            $('#txtCipPaciente').val(planPaciente?.cip || data?.cipPaciente1);
            $('#cboParentescoPaciente').val(planPaciente?.id_parentesco || data.parentescoPaciente1) // JVQ


            if(planPaciente?.idFuenteFinanciamiento && planPaciente?.idTipoFinanciamiento){
                //AQUI SELECCIONA LA FUENTE DE FINANCIAMIENTO - EMERGENCIA
                $("#cboFuenteFinanciamientoAdmision").val(planPaciente.idFuenteFinanciamiento).chosen().trigger("chosen:updated").change();
                setTimeout(()=> $("#cboProductoPlanAdmision").val(planPaciente.idTipoFinanciamiento).chosen().trigger("chosen:updated").change(),500)
            }
            $("#hdIdFuenteFinanciamiento").val(planPaciente?.idFuenteFinanciamiento || '')
            $("#hdProductoPlan").val(planPaciente?.idTipoFinanciamiento || '')

            if (tipoPaciente.tipoPaciente == 'NUEVO') {
                $('#hdtipoCondicionPaciente').val(1)
            }
            if (tipoPaciente.tipoPaciente == 'REINGRESANTE') {
                $('#hdtipoCondicionPaciente').val(2)
            }
            if (tipoPaciente.tipoPaciente == 'CONTINUADOR') {
                $('#hdtipoCondicionPaciente').val(3)
            }
            $('#tipoPaciente').html("Paciente: " + tipoPaciente.tipoPaciente)
        }

        $('.chzn-select').chosen().trigger("chosen:updated")
    },

    CrearModificarHistoria: () => {

        var formData = new FormData();
        formData.append("IdPaciente", $("#txtIdPaciente").val());
        formData.append("ApellidoPaterno", $("#txtApellidoPaternoPaciente").val());
        formData.append("ApellidoMaterno", $("#txtApellidoMaternoPaciente").val());
        formData.append("PrimerNombre", $("#txtPrimerNombrePaciente").val());
        formData.append("SegundoNombre", $("#txtSegundoNombrePaciente").val());
        formData.append("TercerNombre", $("#txtTercerNombrePaciente").val());
        formData.append("FechaNacimiento", $("#txtPacienteFechaNacimiento").val());
        formData.append("NroDocumento", $("#txtDniPaciente").val());
        formData.append("Telefono", $("#txtTelefonoPaciente").val());
        formData.append("DireccionDomicilio", $("#txtDireccionDomicilio").val());

        formData.append("CipPaciente", $("#txtCipPaciente").val());

        formData.append("IdTipoSexo", $("#cboSexoPaciente").val());
        formData.append("IdProcedencia", $("#cboProcedenciaPaciente").val());
        formData.append("IdGradoInstruccion", $("#cboGradoInstruccionPaciente").val());
        formData.append("IdEstadoCivil", $("#cboEstadoCivilPaciente").val());
        formData.append("IdDocIdentidad", $("#cboTipoDocPaciente").val());
        formData.append("IdTipoOcupacion", $("#cboOcupacionPaciente").val());
        formData.append("IdCentroPobladoNacimiento", $("#cboCentroPobladoNacimiento").val());
        formData.append("IdCentroPobladoDomicilio", $("#cboCentroPobladoDomicilio").val());
        formData.append("NombrePadre", $("#txtNombrePadrePaciente").val());
        formData.append("NombreMadre", $("#txtPrimerNombreMadre").val());
        formData.append("NroHistoriaClinica", $("#txtNroHistoriaPaciente").val());
        formData.append("IdTipoNumeracion", $("#cboTipoHistoriaPaciente").val());
        formData.append("IdCentroPobladoProcedencia", $("#cboCentroPobladoProcedencia").val());
        formData.append("Observacion", $("#txtObservacionPaciente").val());
        formData.append("IdPaisDomicilio", $("#cboPaisDomicilio").val());
        formData.append("IdPaisProcedencia", $("#cboPaisProcedencia").val());
        formData.append("IdPaisNacimiento", $("#cboPaisNacimiento").val());
        formData.append("IdDistritoProcedencia", $("#cboDistritoProcedencia").val());
        formData.append("IdDistritoDomicilio", $("#cboDistritoDomicilio").val());
        formData.append("IdDistritoNacimiento", $("#cboDistritoNacimiento").val());

        formData.append("IdDepartamentoDomicilio", $("#cboDepartamentoDomicilio").val());
        formData.append("IdDepartamentoProcedencia", $("#cboDepartamentoProcedencia").val());
        formData.append("IdDepartamentoNacimiento", $("#cboDepartamentoNacimiento").val());

        formData.append("IdEtnia", $("#cboEtniaPaciente").val());
        formData.append("IdIdioma", $("#cboIdiomaMaternoPaciente").val());
        formData.append("Email", $("#txtEmailPaciente").val());
        formData.append("madreDocumento", $("#txtNroDocMadre").val());
        formData.append("madreApellidoPaterno", $("#txtApellidoPaternoMadre").val());
        formData.append("madreApellidoMaterno", $("#txtApellidoMaternoMadre").val());
        formData.append("madrePrimerNombre", $("#txtPrimerNombreMadre").val());
        formData.append("madreSegundoNombre", $("#txtSegundoNombreMadre").val());
        formData.append("NroOrdenHijo", $("#txtEsNroHijoPaciente").val());
        formData.append("madreTipoDocumento", $("#cboTipoDocMadre").val());

        formData.append("TelefonoMadre", $("#txtTelefonoMadre").val());
        formData.append("cboParentescoMadre", $("#cboParentescoMadre").val());

        formData.append("TipoMPadres", $("#cboTipoMPadres").val());
        formData.append("NroDocMPadres", $("#txtNroDocMPadres").val());
        formData.append("NombresMPadres", $("#txtNombresMPadres").val());

        formData.append("TipoPPadres", $("#cboTipoPPadres").val());
        formData.append("NroDocPPadres", $("#txtNroDocPPadres").val());
        formData.append("NombresPPadres", $("#txtNombresPPadres").val());


        formData.append("ParentescoPaciente", $("#cboParentescoPaciente").val());
        formData.append("cboDiscapacidadPaciente", $("#cboDiscapacidadPaciente").val());
        formData.append("DependenciaPaciente", '0');
        formData.append("UnidadPagoPaciente", $("#cboUnidadPagoPaciente").val());
        formData.append("GradoPaciente", '0');


        formData.append("SituacionPaciente", '0');
        formData.append("FactorRHPaciente", $("#cboFactorRHPaciente").val());
        formData.append("GrupoSanguineoPaciente", $("#cboGrupoSanguineoPaciente").val());
        formData.append("CodigoCajaPensionPaciente", $("#txtCodigoCajaPensionPaciente").val());
        formData.append("Telefono2Paciente", $("#txtTelefono2Paciente").val());
        formData.append("Telefono3Paciente", $("#txtTelefono3Paciente").val());

        formData.append("IdPaisMadre", $("#cboPaisMadre").val());
        formData.append("idDepartamentoMadre", $("#cboDepartamentoMadre").val());
        formData.append("idProvinciaMadre", $("#cboProvinciaMadre").val());
        formData.append("idDistritoMadre", $("#cboDistritoMadre").val());
        formData.append("idCentroPobladoMadre", $("#cboCentroPobladoMadre").val());
        formData.append("DireccionMadre", $("#txtDireccionMadre").val());

        formData.append("Religion", $("#cboReligionPaciente").val());
        // 🔥 Enviar lista REAL con IdContacto
        formData.append("Contactos", JSON.stringify(listaContactos));


        return HttpClient.Post('/Paciente/CrearModificarHistoriaV2?area=Comun', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    async GenerarBrazalete(idPaciente) {
        var midata = new FormData();
        let datos;
        midata.append('IdPaciente', idPaciente);
        try {
            Cargando(1)
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/GenerarBrazalete?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                alerta2("success", "", "El brazalete se ha generado correctamente.")
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async GenerarBrazaletePaciente(idPaciente) {
        Cargando(1);

        var formData = new FormData();
        formData.append('idPaciente', idPaciente);

        var url = "/Paciente/GenerarBrazaletePaciente?area=ConsultaExterna";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("POST", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);

                    newIframe.src = url;

                    //var a = document.createElement("a");
                    //document.body.appendChild(a);
                    //a.href = url;
                    ////a.download = this.response.name || "CE-" + $.now()
                    //a.download = "Brazalete-" + idPaciente + "-" + $.now()
                    //a.click();              

                    Cargando(0);

                    //AbrirVisorDocumentoPersonalizado(url, "Brazalete");
                }
            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
                // Code here for the server answer when not successful
            }
        }
        request.send(formData);
        //Cargando(0);        
    },

    ValidarCampos: function () {
        $('.alert-danger').hide();

        if ($('#txtDniPaciente').val() == '' && $('#cboTipoDocPaciente>option:selected').val() != 0) {
            alerta(2, 'Ingrese el Nro: Docuemtno')
            $('#txtDniPaciente').focus()
            return false
        }

        if ($('#txtDniPaciente').val().length != 8 && $('#cboTipoDocPaciente>option:selected').val() == 1) {
            alerta(2, 'El DNI debe tener 8 digitos')
            $('#txtDniPaciente').focus()
            return false
        }

        if ($('#txtApellidoPaternoPaciente').val() == '') {
            alerta(2, 'Ingrese el Apellido Paterno')
            $('#txtApellidoPaternoPaciente').focus()
            return false
        }

        if ($('#txtApellidoMaternoPaciente').val() == '') {
            alerta(2, 'Ingrese el Apellido Materno')
            $('#txtApellidoMaternoPaciente').focus()
            return false
        }

        if ($('#txtPrimerNombrePaciente').val() == '') {
            alerta(2, 'Ingrese el Primer Nombre')
            $('#txtPrimerNombrePaciente').focus()
            return false
        }

        if ($('#cboSexoPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione el Sexo')
            $('#cboSexoPaciente').focus().select()
            return false
        }

        if ($('#cboEtniaPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Etnia')
            $('#cboEtniaPaciente').focus().select()
            return false
        }

        if ($('#cboIdiomaMaternoPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Idioma Materno')
            $('#cboIdiomaMaternoPaciente').focus().select()
            return false
        }

        if ($('#txtPacienteFechaNacimiento').val() == '') {
            alerta(2, 'Ingrese Fecha de Nacimiento')
            $('#txtPacienteFechaNacimiento').focus()
            return false
        }

        if ($('#txtTelefonoPaciente').val() == '') {
            alerta(2, 'El número de telefono es obligatorio')
            $('#txtTelefonoPaciente').focus()
            return false
        }

        if ($('#txtDireccionDomicilio').val() == '') {
            alerta(2, 'La direccion es obligatoria')
            $('#txtDireccionDomicilio').focus()
            return false
        }
        //if ($('#cboReligionPaciente>option:selected').val() == 0) {
        //    alerta(2, 'Seleccione Religion')
        //    $('#cboReligionPaciente').focus().select()
        //    return false
        //}

        //if ($('#cboGradoInstruccionPaciente>option:selected').val() == 0) {
        //    alerta(2, 'Seleccione Grado de Instruccion')
        //    $('#cboGradoInstruccionPaciente').focus().select()
        //    return false
        //}

        if ($('#cboOcupacionPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Ocupacion')
            $('#cboOcupacionPaciente').focus().select()
            return false
        }

        if ($('#txtEdadPaciente').val() == '') {
            alerta(2, 'Ingrese Edad')
            $('#txtEdadPaciente').focus()
            return false
        }

        if ($('#cboTipoEdadPaciente').val() == 0) {
            alerta(2, 'Seleccione Tipo Edad')
            error = true
            return false
        }

        if (($('#cboTipoEdadPaciente>option:selected').val() != 1 || ($('#cboTipoEdadPaciente>option:selected').val() == 1 && $('#txtEdadPaciente').val() < 18)) && $('#txtEsNroHijoPaciente').val() == '') {
            alert('El paciente es menor de edad tiene que ingresar N° hijo')
            $('#txtEsNroHijoPaciente').focus()
            error = true
            return false
        }

        if (($('#cboTipoEdadPaciente>option:selected').val() != 1 || ($('#cboTipoEdadPaciente>option:selected').val() == 1 && $('#txtEdadPaciente').val() < 18)) && $('#txtNroDocMadre').val() == '') {
            alerta(2, 'El paciente es menor de edad, Ingrese N° Documetno de la Madre o Tutor')
            $('#txtNroDocMadre').focus()
            error = true
            return false
        }

        //if ($('#cboProvinciaDomicilio>option:selected').val() == 0) {
        //    alert("Ingrese provincia domicilio")
        //    $('#cboProvinciaDomicilio').focus().select()
        //    error = true
        //    return false
        //}

        //if ($('#cboDistritoDomicilio').val() == 0) {
        //    alert("Ingrese distrito domicilio")
        //    $('#cboDistritoDomicilio').focus()
        //    error = true
        //    return false
        //}


        return true
    },

    Events: function () {
        //////////////////////// INPUT:TEXT
        $('#txtPacienteFechaNacimiento').on('input', function () {

            let edad = ''
            let tipoEdad = 0

            if (esFormatoFecha($("#txtPacienteFechaNacimiento").val())) {
                edad = getEdad(ConvertirFormatoFecha($("#txtPacienteFechaNacimiento").val()))[0]
                tipoEdad = getEdad(ConvertirFormatoFecha($("#txtPacienteFechaNacimiento").val()))[1]
            }

            $("#txtEdadPaciente").val(edad)
            $("#cboTipoEdadPaciente").val(tipoEdad)

            $("#txtEdadAdmision").val(edad)
            $("#cboTipoEdadAdmision").val(tipoEdad)

            $('.chzn-select').chosen().trigger("chosen:updated");
        });


        //////////////////////////////// DATOS DOMICILIO ////////////////////////////////
        $('#cboPaisDomicilio').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisDomicilio').val(), 'cboDepartamentoDomicilio')
        })
        $('#cboDepartamentoDomicilio').on('change', async function () {
            await RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoDomicilio').val(), 'cboProvinciaDomicilio')
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaDomicilio').val(), 'cboDistritoDomicilio')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoDomicilio').val(), 'cboCentroPobladoDomicilio')
        })
        $('#cboProvinciaDomicilio').on('change', async function () {
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaDomicilio').val(), 'cboDistritoDomicilio')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoDomicilio').val(), 'cboCentroPobladoDomicilio')
        })
        $('#cboDistritoDomicilio').on('change', async function () {
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoDomicilio').val(), 'cboCentroPobladoDomicilio')
        })

        //////////////////////////////// DATOS PROCEDENCIA ////////////////////////////////
        $('#cboPaisProcedencia').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisProcedencia').val(), 'cboDepartamentoProcedencia')
        })
        $('#cboDepartamentoProcedencia').on('change', async function () {
            await RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoProcedencia').val(), 'cboProvinciaProcedencia')
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoProcedencia').val(), 'cboCentroPobladoProcedencia')
        })
        $('#cboProvinciaProcedencia').on('change', async function () {
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoProcedencia').val(), 'cboCentroPobladoProcedencia')
        })
        $('#cboDistritoProcedencia').on('change', async function () {
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoProcedencia').val(), 'cboCentroPobladoProcedencia')
        })

        //////////////////////////////// DATOS NACIMIENTO ////////////////////////////////
        $('#cboPaisNacimiento').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisNacimiento').val(), 'cboDepartamentoNacimiento')
        })
        $('#cboDepartamentoNacimiento').on('change', async function () {
            await RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoNacimiento').val(), 'cboProvinciaNacimiento')
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoNacimiento').val(), 'cboCentroPobladoNacimiento')
        })
        $('#cboProvinciaNacimiento').on('change', async function () {
            await RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoNacimiento').val(), 'cboCentroPobladoNacimiento')
        })
        $('#cboDistritoNacimiento').on('change', async function () {
            await RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoNacimiento').val(), 'cboCentroPobladoNacimiento')
        })
    }

}


let listaContactos = [];

// AGREGAR CONTACTO
$("#btnAgregarContacto").click(function (e) {

    e.preventDefault();

    let apellidoP = $("#txtApellidoPaternoContactoMadre").val().trim();
    let apellidoM = $("#txtApellidoMaternoContactoMadre").val().trim();
    let nombres = $("#txtPrimerNombreContactoMadre").val().trim();
    let telefono = $("#txtTelefonoContactoMadre").val().trim();
    let parentescoFlag = $("#chkParentescoContacto").is(":checked") ? 1 : 0;

    if (apellidoP === "" || apellidoM === "" || nombres === "" || telefono === "") {
        alert("Debe completar Apellidos, Nombre y Teléfono");
        return;
    }

    let contacto = {
        IdContacto: 0,
        EsParentesco: parentescoFlag,
        ApellidoPaterno: apellidoP,
        ApellidoMaterno: apellidoM,
        Nombres: nombres,
        Telefono: telefono
    };

    listaContactos.push(contacto);

    renderTabla();
    limpiarCampos();
});


// CARGAR CONTACTOS DESDE BD
function cargarContactos(idPaciente) {

    $.ajax({
        url: '/Paciente/ObtenerContactos',
        type: 'POST',
        data: { idPaciente: idPaciente },
        success: function (response) {

            if (response.estado) {
                llenarTablaContactos(response.data);
            } else {
                alert(response.msg);
            }
        },
        error: function () {
            alert("Error al cargar contactos");
        }
    });
}


// LLENAR TABLA
function llenarTablaContactos(data) {

    console.log("DATA QUE LLEGA:");
    console.log(data);

    listaContactos = [];

    data.forEach(item => {

        console.log("ID QUE VIENE:", item.IdContacto, item.idContacto);

        listaContactos.push({
            IdContacto: item.idContacto,   // 🔥 CORRECTO
            EsParentesco: item.EsParentesco ?? item.esParentesco,
            ApellidoPaterno: item.ApellidoPaterno ?? item.apellidoPaterno,
            ApellidoMaterno: item.ApellidoMaterno ?? item.apellidoMaterno,
            Nombres: item.Nombres ?? item.nombres,
            Telefono: item.Telefono ?? item.telefono
        });

    });

    console.log("LISTA FINAL:", listaContactos);

    renderTabla();
}

// RENDER TABLA
function renderTabla() {

    let tbody = $("#DataTableDatosContactoMujer tbody");
    tbody.empty();

    listaContactos.forEach((item, index) => {

        let texto = item.EsParentesco == 1 ? "SI" : "NO";

        tbody.append(`
            <tr>
                <td style="text-align:center;">${texto}</td>
                <td>${item.ApellidoPaterno}</td>
                <td>${item.ApellidoMaterno}</td>
                <td>${item.Nombres}</td>
                <td>${item.Telefono}</td>
                <td>
                    <button type="button"
                        class="btn btn-danger btn-sm"
                        onclick="eliminarContacto(${index})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}


// ELIMINAR CONTACTO
function eliminarContacto(index) {

    let contacto = listaContactos[index];

    if (contacto.IdContacto > 0) {

        if (!confirm("¿Desea eliminar este contacto?")) return;

        $.ajax({
            url: '/Paciente/EliminarContacto',
            type: 'POST',
            data: { idContacto: contacto.IdContacto },
            success: function (res) {

                if (res.estado) {
                    listaContactos.splice(index, 1);
                    renderTabla();
                } else {
                    alert(res.msg);
                }
            }
        });

    } else {

        listaContactos.splice(index, 1);
        renderTabla();
    }
}


let REGISTROPACIENTE = function () {
    let fechaActual
    let dia, mes, anio


    let CargaInicial = function () {
        //limpiar();
        var fecha = new Date()
        dia = fecha.getDate()
        mes = parseInt(fecha.getMonth()) + 1
        var mesSincero = mes
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        //fechaP = dia + "/" + mes + "/" + yyy
        anio = yyy
        //fechaActual = dia + "/" + mes + "/" + yyy

        $('#txtFechaCreacionPaciente').val(dia + "/" + mes + "/" + yyy)

        //RegistroPaciente.ListaDepartamentos()
    }

    let plugins = function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaCreacionPaciente, #txtPacienteFechaNacimiento').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });
        $("#txtFechaCreacionPaciente").datepicker("disable")
    }

    PacientesSeleccionarPorId = function (idPaciente) {
        let formData = new FormData();
        formData.append("idPaciente", idPaciente)
        return HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        cargarContactos(idPaciente);
                        return res.data.table[0]

                    } else {
                        alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    }

    PacientesDatosAdicionalesPersonalesAgregar = function (idPaciente, fNacimientoCalculada) {
        //alert(1)
        var midata = new FormData();
        midata.append("idPaciente", idPaciente);
        midata.append("fNacimientoCalculada", fNacimientoCalculada);

        fetch('/Paciente/PacientesDatosAdicionalesPersonalesAgregar?area=Comun', {
            method: 'POST',
            body: midata
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                console.log('PacientesDatosAdicionalesPersonalesAgregar', response)

            })
    }

    ObtenerDepartamentoProvinciaByDistrito = function (idDistrito) {
        let formData = new FormData();
        formData.append("idDistrito", idDistrito)

        return HttpClient.Post('/Utilitario/web_selectIdDepartamentoIdProvinciaByIdDistrito', formData).then(res => {
            return res.dataSet.table[0]
        })
    }

    HistoriasClinicasSeleccionarPorId = async function (nroHistoriaClinica) {
        let formData = new FormData();
        formData.append("nroHistoriaClinica", nroHistoriaClinica)
        return HttpClient.Post('/Paciente/HistoriasClinicasSeleccionarPorId', formData).then(res => {
            return res.dataSet.table[0]
        })
    }

    crearModificarPacienteSunasa = function () {
        //alert(1)
        var midata = new FormData();
        midata.append("idSunasaPacienteHistorico", $("#").val()); // FALTA - BUSCAR DONDE SACAR
        midata.append("idPaciente", $("#txtIdPaciente").val());
        midata.append("CodigoIAFA", $("#txtCodigoIAFASunasa").val());
        midata.append("idPaisTitular", $("#cboPaisTitularSunasa").val());
        midata.append("idTipoDocumentoTitular", $("#cboTipoDocTitularSunasa").val());
        midata.append("NroDocumentoTitular", $("#txtNroDocTitularSunasa").val());
        midata.append("ApellidoCasada", $("#txtApellidoCasadaSunasa").val());
        midata.append("ValidacionRegIdentidad", $("#cboValidacionIdentSunasa").val());
        midata.append("NroCarnetIdentidad", $("#txtNroCarnetSunasa").val());
        midata.append("EstadoDelSeguro", $("#cboEstadoSeguroSunasa").val());
        //midata.append("IdAfiliacion", $("#cboSexoPaciente").val());
        midata.append("ProductoYplan", $("#txtIdProductoPlanSunasa").val() + $("#txtDescProductoPlanSunasa").val());
        midata.append("FechaInicioAfiliacion", $("#txtFechaIniAfiliacionSunasa").val());
        midata.append("FechaFinalAfiliacion", $("#txtFechaFinAfiliacionSunasa").val());
        midata.append("idRegimen", $("#cboRegimenSunasa").val());
        midata.append("CodigoEstablecimientoIAFA", $("#txtCodigoEstabIAFASunasa").val());
        midata.append("CodigoEstablecimientoRENAES", $("#txtCodigoEstabRENAESSunasa").val());
        midata.append("idParentesco", $("#cboParentescoSunasa").val());
        midata.append("RUCempleador", $("#txtRUCEmpleadorSunasa").val());
        midata.append("AnteriorIdTipoDocumentoAsegurado", $("#cboTipoDocAntSunasa").val());
        midata.append("AnteriorNroDocumentoAsegurado", $("#txtNroDocAntSunasa").val());
        //midata.append("DNIusarioOperacion", $("#cboTipoHistoriaPaciente").val());
        midata.append("idOperacion", $("#cboTipoOperacionSepelioSunasa").val());
        midata.append("FechaEnvio", $("#txtFechaEnvioSunasa").val());
        midata.append("SisSepelioParienteEncargado", $("#txtApellidoNombresSepelioSunasa").val());
        midata.append("SisSepelioDni", $("#txtDniUsuarioSepelioSunasa").val());
        midata.append("SisSepelioFnacimiento", $("#txtFechaNacimientoSepelioSunasa").val());
        midata.append("SisSepelioSexo", $("#cboSexoSepelioSunasa").val());
        midata.append("SisNroAfiliacion", $("#cboDistritoDomicilio").val());
        midata.append("YaNoTieneSeguro", 1);

        return fetch('/Paciente/web_crearModificarPacienteSunasa?area=Comun', {
            method: 'POST',
            body: midata
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.estado) {
                    console.log('sill')
                    return response
                } else {
                    return null
                }

            })
    }

    let ValidarCampos = function () {
        $('.alert-danger').hide();

        if ($('#txtDniPaciente').val() == '' && $('#cboTipoDocPaciente>option:selected').val() != 0) {
            alerta(2, 'Ingrese el Nro: Docuemtno')
            $('#txtDniPaciente').focus()
            return false
        }

        if ($('#txtDniPaciente').val().length != 8 && $('#cboTipoDocPaciente>option:selected').val() == 1) {
            alerta(2, 'El DNI debe tener 8 digitos')
            $('#txtDniPaciente').focus()
            return false
        }

        if ($('#txtApellidoPaternoPaciente').val() == '') {
            alerta(2, 'Ingrese el Apellido Paterno')
            $('#txtApellidoPaternoPaciente').focus()
            return false
        }

        if ($('#txtApellidoMaternoPaciente').val() == '') {
            alerta(2, 'Ingrese el Apellido Materno')
            $('#txtApellidoMaternoPaciente').focus()
            return false
        }

        if ($('#txtPrimerNombrePaciente').val() == '') {
            alerta(2, 'Ingrese el Primer Nombre')
            $('#txtPrimerNombrePaciente').focus()
            return false
        }

        if ($('#cboSexoPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione el Sexo')
            $('#cboSexoPaciente').focus().select()
            return false
        }

        if ($('#cboEtniaPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Etnia')
            $('#cboEtniaPaciente').focus().select()
            return false
        }

        if ($('#cboIdiomaMaternoPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Idioma Materno')
            $('#cboIdiomaMaternoPaciente').focus().select()
            return false
        }

        if ($('#txtPacienteFechaNacimiento').val() == '') {
            alerta(2, 'Ingrese Fecha de Nacimiento')
            $('#txtPacienteFechaNacimiento').focus()
            return false
        }

        if ($('#txtTelefonoPaciente').val() == '') {
            alerta(2, 'El número de telefono es obligatorio')
            $('#txtTelefonoPaciente').focus()
            return false
        }

        if ($('#txtDireccionDomicilio').val() == '') {
            alerta(2, 'La direccion es obligatoria')
            $('#txtDireccionDomicilio').focus()
            return false
        }
        //if ($('#cboReligionPaciente>option:selected').val() == 0) {
        //    alerta(2, 'Seleccione Religion')
        //    $('#cboReligionPaciente').focus().select()
        //    return false
        //}

        //if ($('#cboGradoInstruccionPaciente>option:selected').val() == 0) {
        //    alerta(2, 'Seleccione Grado de Instruccion')
        //    $('#cboGradoInstruccionPaciente').focus().select()
        //    return false
        //}

        if ($('#cboOcupacionPaciente>option:selected').val() == 0) {
            alerta(2, 'Seleccione Ocupacion')
            $('#cboOcupacionPaciente').focus().select()
            return false
        }

        if ($('#txtEdadPaciente').val() == '') {
            alerta(2, 'Ingrese Edad')
            $('#txtEdadPaciente').focus()
            return false
        }

        if ($('#cboTipoEdadPaciente').val() == 0) {
            alerta(2, 'Seleccione Tipo Edad')
            error = true
            return false
        }

        if (($('#cboTipoEdadPaciente>option:selected').val() != 1 || ($('#cboTipoEdadPaciente>option:selected').val() == 1 && $('#txtEdadPaciente').val() < 18)) && $('#txtEsNroHijoPaciente').val() == '') {
            alert('El paciente es menor de edad tiene que ingresar N° hijo')
            $('#txtEsNroHijoPaciente').focus()
            error = true
            return false
        }

        if (($('#cboTipoEdadPaciente>option:selected').val() != 1 || ($('#cboTipoEdadPaciente>option:selected').val() == 1 && $('#txtEdadPaciente').val() < 18)) && $('#txtNroDocMadre').val() == '') {
            alerta(2, 'El paciente es menor de edad, Ingrese N° Documetno de la Madre o Tutor')
            $('#txtNroDocMadre').focus()
            error = true
            return false
        }

        //if ($('#cboProvinciaDomicilio>option:selected').val() == 0) {
        //    alert("Ingrese provincia domicilio")
        //    $('#cboProvinciaDomicilio').focus().select()
        //    error = true
        //    return false
        //}

        //if ($('#cboDistritoDomicilio').val() == 0) {
        //    alert("Ingrese distrito domicilio")
        //    $('#cboDistritoDomicilio').focus()
        //    error = true
        //    return false
        //}


        return true
    }

    let eventos = function () {

        $('#cboPaisDomicilio').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisDomicilio').val(), 'cboDepartamentoDomicilio')
        })
        $('#cboPaisProcedencia').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisProcedencia').val(), 'cboDepartamentoProcedencia')
        })
        $('#cboPaisNacimiento').on('change', async function () {
            await RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisNacimiento').val(), 'cboDepartamentoNacimiento')
        })

        $('#cboDepartamentoProcedencia').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoProcedencia').val(), 'cboProvinciaProcedencia')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
        })
        $('#cboDepartamentoNacimiento').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoNacimiento').val(), 'cboProvinciaNacimiento')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
        })

        $('#cboDepartamentoDomicilio').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoDomicilio').val(), 'cboProvinciaDomicilio')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaDomicilio').val(), 'cboDistritoDomicilio')
        })
        $('#cboDepartamentoProcedencia').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoProcedencia').val(), 'cboProvinciaProcedencia')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
        })
        $('#cboDepartamentoNacimiento').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoNacimiento').val(), 'cboProvinciaNacimiento')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
        })

        $('#cboProvinciaDomicilio').on('change', function () {
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaDomicilio').val(), 'cboDistritoDomicilio')
        })
        $('#cboProvinciaProcedencia').on('change', function () {
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
        })
        $('#cboProvinciaNacimiento').on('change', function () {
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
        })


        $('#cboDistritoDomicilio').on('change', function () {
            RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoDomicilio').val(), 'cboCentroPobladoDomicilio')
        })
        $('#cboDistritoProcedencia').on('change', function () {
            RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoProcedencia').val(), 'cboCentroPobladoProcedencia')
        })
        $('#cboDistritoNacimiento').on('change', function () {
            RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoNacimiento').val(), 'cboCentroPobladoNacimiento')
        })

        $('#cboPaisDomicilio').on('change', function () {
            $('#txtPaisSunasa').val($('#cboPaisDomicilio>option:selected').text())
        })

        $('#cboTipoDocPaciente').on('change', function () {
            $('#txtDniPaciente').val('')

            $('#txtDniPaciente').removeClass('solo-numero')
            if (this.value == 0) {
                $('#txtDniPaciente').addClass('solo-numero')
                $('#txtDniPaciente').attr('maxlength', '12')
            }
            if (this.value == 1) {
                $('#txtDniPaciente').addClass('solo-numero')
                $('#txtDniPaciente').attr('maxlength', '8')
            }
            if (this.value == 2 || this.value == 3) {
                $('#txtDniPaciente').attr('maxlength', '12')
            }
            if (this.value == 4 || this.value == 5 || this.value == 6 || this.value == 7 || this.value == 8 || this.value == 9 || this.value == 10 || this.value == 11) {
                $('#txtDniPaciente').addClass('solo-numero')
                $('#txtDniPaciente').attr('maxlength', '12')
            }


            $('.solo-numero').keyup(function () {
                this.value = (this.value + '').replace(/[^0-9]/g, '');
            });
            $('.solo-numero').keydown(function () {
                this.value = (this.value + '').replace(/[^0-9]/g, '');
            });

        })

        $('#cboSexoPaciente').on('change', function () {
            $('#txtSexoSunasa').val($('#cboSexoPaciente>option:selected').text())
        })

        $('#txtApellidoPaternoPaciente').on('input', function () {
            $('#txtPacienteSunasa').val('')
            $('#txtPacienteSunasa').val($('#txtApellidoPaternoPaciente').val() + ' ' + $('#txtApellidoMaternoPaciente').val() + ' ' +
                $('#txtPrimerNombrePaciente').val() + ' ' + $('#txtSegundoNombrePaciente').val() + ' ' + $('#txtTercerNombrePaciente').val())
        })

        $('#txtApellidoMaternoPaciente').on('input', function () {
            $('#txtPacienteSunasa').val('')
            $('#txtPacienteSunasa').val($('#txtApellidoPaternoPaciente').val() + ' ' + $('#txtApellidoMaternoPaciente').val() + ' ' +
                $('#txtPrimerNombrePaciente').val() + ' ' + $('#txtSegundoNombrePaciente').val() + ' ' + $('#txtTercerNombrePaciente').val())
        })

        $('#txtPrimerNombrePaciente').on('input', function () {
            $('#txtPacienteSunasa').val('')
            $('#txtPacienteSunasa').val($('#txtApellidoPaternoPaciente').val() + ' ' + $('#txtApellidoMaternoPaciente').val() + ' ' +
                $('#txtPrimerNombrePaciente').val() + ' ' + $('#txtSegundoNombrePaciente').val() + ' ' + $('#txtTercerNombrePaciente').val())
        })

        $('#txtSegundoNombrePaciente').on('input', function () {
            $('#txtPacienteSunasa').val('')
            $('#txtPacienteSunasa').val($('#txtApellidoPaternoPaciente').val() + ' ' + $('#txtApellidoMaternoPaciente').val() + ' ' +
                $('#txtPrimerNombrePaciente').val() + ' ' + $('#txtSegundoNombrePaciente').val() + ' ' + $('#txtTercerNombrePaciente').val())
        })

        $('#txtTercerNombrePaciente').on('input', function () {
            $('#txtPacienteSunasa').val('')
            $('#txtPacienteSunasa').val($('#txtApellidoPaternoPaciente').val() + ' ' + $('#txtApellidoMaternoPaciente').val() + ' ' +
                $('#txtPrimerNombrePaciente').val() + ' ' + $('#txtSegundoNombrePaciente').val() + ' ' + $('#txtTercerNombrePaciente').val())
        })

        $('#txtPacienteFechaNacimiento').on('change', function () {
            let edad, tipo
            if (this.value.length == 10) {
                [edad, tipo] = getEdad(this.value.substr(3, 2) + '/' + this.value.substr(0, 2) + '/' + this.value.substr(6, 4))
                $('#txtEdadPaciente').val(edad)
                $(`#cboTipoEdadPaciente`).val(tipo)
                $('.chzn-select').chosen().trigger("chosen:updated");

                //$('#txtFechaNacimientoSunasa').val($('#txtPacienteFechaNacimiento').val())
            }
        })

        $('#btnguardar').on('click', function () {
            if (!ValidarCampos()) {
                return false
            }
        })

        $('#ImprimeFormatoFiliacionArchivoClinico').on('click', function () {
            let idPaciente = $('#txtIdPaciente').val()

            var url = "/Paciente/ImprimeHojaFiliacion?area=ConsultaExterna&idPaciente=" + idPaciente
            $('#ifrmHojaFiliacion').attr('src', url)

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalHojaFiliacion").modal('show')
        });

        $('#ImprimeBrazalete').on('click', async function () {
            let idPaciente = $('#txtIdPaciente').val()
            await RegistroPaciente.GenerarBrazalete(idPaciente);
        });

        $('#GenerarBrazalete').on('click', async function () {
            let idPaciente = $('#txtIdPaciente').val()
            await RegistroPaciente.GenerarBrazaletePaciente(idPaciente);
        });

        $('#btnCerrarModalHojaFiliacion').on('click', function () {
            $("#modalHojaFiliacion").modal('hide')

        })
    }

    return {
        init: function () {
            CargaInicial()
            plugins()
            eventos()

        },
        ValidarCampos,


        crearModificarPacienteSunasa,

        PacientesSeleccionarPorId,
        ObtenerDepartamentoProvinciaByDistrito,
        HistoriasClinicasSeleccionarPorId



        //obtenerProgramacionMedicaPorIdProgramacionIdMedico
    }
}()

function showInputError(msg, div, type) {

    if (type == 1) {
        $('#' + div).show()
    }

    if (type == 0) {
        $('#' + div).hide()
        msg = ''
    }

    $('#' + div).html(`${msg}`)

}

function getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()

    let anios = edad
    let meses = diferenciaMeses < 0 ? -diferenciaMeses : diferenciaMeses
    let dias

    if (anios != 0) {
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--
            anios = edad
        }
        return [anios, 1]
    } else if (meses != 0) {
        return [meses, 2]
    } else {
        dias = hoy.getDate() - fechaNacimiento.getDate()
        return [dias, 3]
    }
}

function cargarContactos(idPaciente) {

    $.ajax({
        url: '/Paciente/ObtenerContactos',
        type: 'POST',
        data: { idPaciente: idPaciente },
        success: function (response) {

            if (response.estado) {
                llenarTablaContactos(response.data);
            }
        },
        error: function (error) {
            console.error(error);
        }
    });
}


$(document).ready(() => {
    RegistroPaciente.TiposNumeracionHistoriaSeleccionarTodos()
    RegistroPaciente.ListaTiposDocumentos()
    RegistroPaciente.TiposEtnia()
    RegistroPaciente.TiposIdiomasSeleccionarTodos()
    RegistroPaciente.ListaTiposEstadoCivilTodos()
    RegistroPaciente.TiposGradoInstruccionTodos()
    RegistroPaciente.ListaParentesco2()
    RegistroPaciente.TiposEdadSeleccionarTodos()
    RegistroPaciente.TiposReligion()
    RegistroPaciente.TiposProcedenciaTodos()
    RegistroPaciente.TiposOcupacionTodos()
    RegistroPaciente.ListaParentesco2() //MGAMERO

    RegistroPaciente.ListaPaises()
    //RegistroPaciente.ListaDepartamentos()
    RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoDomicilio').val(), 'cboProvinciaDomicilio')
    RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoProcedencia').val(), 'cboProvinciaProcedencia')
    RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoNacimiento').val(), 'cboProvinciaNacimiento')

    RegistroPaciente.Events()


})

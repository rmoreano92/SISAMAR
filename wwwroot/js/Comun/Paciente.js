

var Paciente = {
    Plugins: () => {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraNacimientoPaciente").mask("Hn:Nn");
    },

    InitDatablePaciente: () => {

        var parms = {
            "order": [[7, "desc"]],
            destroy: true,
            responsive: true,
            bFilter: false,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [

                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblPacientes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Pacientes = $("#tblPacientes").dataTable(parms);


    },

    PacientesFiltraPorNroDocumentoYtipo: () => {

        let formData = new FormData()

        formData.append("nroDocumento", $('#txtDniPaciente').val())
        formData.append("idDocIdentidad", $('#cboTipoDocPaciente').val())
        return fetch('/Citas/PacientesFiltraPorNroDocumentoYtipo?area=ConsultaExterna', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.dataSet.table.length > 0) {

                    console.log(response.dataSet.table)
                    swal({
                        title: 'alerta',
                        html: `El N° documento "${$('#txtDniPaciente').val()}". <br> Ya existe para el paciente "${response.dataSet.table[0].apellidoPaterno} ${response.dataSet.table[0].apellidoMaterno} ${response.dataSet.table[0].primerNombre}"`,
                        type: 'warning',
                    })
                        .then(() => {
                            $('#txtDniPaciente').focus()
                        })

                    //alerta(2, `El N° DOCUMENTO ya existe para el Paciente: ${response.dataSet.table[0].apellidoPaterno} ${response.dataSet.table[0].apellidoMaterno} ${response.dataSet.table[0].primerNombre}`)
                    //
                    return true
                } else {
                    return false
                }
                Cargando(0)
            })
    },
    ListaPacientes: async () => {
        var resp = false;
        let datos
        var data = new FormData();

        data.append("ApellidoPaterno", $("#txtApPaternoBusq").val());
        data.append("ApellidoMaterno", $("#txtApMaternoBusq").val());
        data.append("Nombres", $("#txtNombresBusq").val());
        data.append("NroDocumento", $("#txtNroDniBusq").val());
        data.append("NroHistoriaClinica", $("#txtNroHistoriaBusq").val());

        Cargando(1)
        oTable_Pacientes.fnClearTable();
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Paciente/ListaPacientes?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.session) {
                if (datos.lsPacientes.table.length > 0) {
                    oTable_Pacientes.fnAddData(datos.lsPacientes.table);
                }
            }
            else {
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta2('danger', '', error);
            return false;
        }

        return true;
    },

    Events: () => {
        $('#tblPacientes tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_Pacientes.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });
        $('#txtDniPaciente').on('focusout', function () {
            PacientesFiltraPorNroDocumentoYtipo()
        })

        $('#btnBuscar').on('click', async function () {

            if ($('#txtNroDniBusq').val() == '' && $('#txtNroHistoriaBusq').val() == '' && $('#txtApPaternoBusq').val() == '' && $('#txtApMaternoBusq').val() == '' && $('#txtNombresBusq').val() == '') {
                alerta(2, 'Debe ingresar al menos un criterio de busqueda.')
                return false;
            }
            await Paciente.ListaPacientes();
        })
        $('#btnAgregar').on('click', function () {
            Paciente.LimpiarCampos()
            $('#btnRegistrarPaciente').show()
            $('#modalPaciente').modal('show');
            limpiarTablaCompleta();


        })
        $('#btnModificar').on('click', async function () {
            Paciente.LimpiarCampos()
            let objPaciente = oTable_Pacientes.api(true).row('.selected').data()
            Cargando(1)
            paciente = await REGISTROPACIENTE.PacientesSeleccionarPorId(objPaciente.idPaciente)
            await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
            $('#btnRegistrarPaciente').show()
            $('#modalPaciente').modal('show')
            Cargando(0)
        });

        $('#btnCerraPaciente').on('click', function () {
            $('#modalPaciente').modal('hide');
        })

        $('#btnRegistrarPaciente').on('click', async function () {
            if (!REGISTROPACIENTE.ValidarCampos()) {
                return false
            }
            Cargando(1)

            let res = await RegistroPaciente.CrearModificarHistoria();

            console.log('res', res)

            paciente = await REGISTROPACIENTE.PacientesSeleccionarPorId(res)

            console.log('paciente', paciente)

            console.log(paciente)
            alerta(1, 'Operacion exitosa')
            swal({
                title: 'Operacion exitosa',
                text: 'Paciente creado \n ' +
                    'N° de historia: ' + paciente.nroHistoriaClinica + "\n " +
                    'Nombres y Apellidos: ' + paciente.primerNombre + ' ' + paciente.apellidoPaterno + ' ' + paciente.apellidoMaterno + "\n ",
                type: 'info',
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#EF6F6C',
                confirmButtonText: 'Aceptar'
            })

            $('#modalPaciente').modal('hide');
            Cargando(0)
        })

        $('#btnConsultar').on('click', async function () {
            $('#btnRegistrarPaciente').hide()
            Paciente.LimpiarCampos()
            let objPaciente = oTable_Pacientes.api(true).row('.selected').data()

            if (isEmpty(objPaciente)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            paciente = await REGISTROPACIENTE.PacientesSeleccionarPorId(objPaciente.idPaciente)
            await RegistroPaciente.CompletarDatosPaciente(paciente, 0)

            $('#modalPaciente').modal('show')
        });

        $('#btnLimpiarCS').on('click', function () {
            Cargando(1)
            $('#txtNroDniBusq').val('')
            $('#txtNroHistoriaBusq').val('')
            $('#txtApPaternoBusq').val('')
            $('#txtApMaternoBusq').val('')
            $('#txtNombresBusq').val('')
            oTable_Pacientes.fnClearTable();
            Cargando(0)
        });



        $('#cboPaisDomicilio').on('change', function () {
            RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisDomicilio').val(), 'cboDepartamentoDomicilio')
        })
        $('#cboPaisProcedencia').on('change', function () {
            RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisProcedencia').val(), 'cboDepartamentoProcedencia')
        })
        $('#cboPaisNacimiento').on('change', function () {
            RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisNacimiento').val(), 'cboDepartamentoNacimiento')
        })
        $('#cboPaisMadre').on('change', function () {
            RegistroPaciente.ListaDepartamentosSeleccionarPorIdPais($('#cboPaisMadre').val(), 'cboDepartamentoMadre')
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

        $('#cboDepartamentoMadre').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoMadre').val(), 'cboProvinciaMadre')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaMadre').val(), 'cboDistritoMadre')
        })


        $('#cboDepartamentoProcedencia').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoProcedencia').val(), 'cboProvinciaProcedencia')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaProcedencia').val(), 'cboDistritoProcedencia')
        })
        $('#cboDepartamentoNacimiento').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cboDepartamentoNacimiento').val(), 'cboProvinciaNacimiento')
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaNacimiento').val(), 'cboDistritoNacimiento')
        })

        $('#cboProvinciaMadre').on('change', function () {
            RegistroPaciente.ListaDistritosByProvincia($('#cboProvinciaMadre').val(), 'cboDistritoMadre')
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

        $('#cboDistritoMadre').on('change', function () {
            RegistroPaciente.ListaCentroPobladoByDistrito($('#cboDistritoMadre').val(), 'cboCentroPobladoMadre')
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

    },

    LimpiarCampos: () => {

        $('#txtApellidoPaternoPaciente').val('')
        $('#txtApellidoMaternoPaciente').val('')
        $('#txtPrimerNombrePaciente').val('')
        $('#txtSegundoNombrePaciente').val('')
        $('#txtTercerNombrePaciente').val('')
        $('#txtIdPaciente').val('')

        $('#txtPacienteFechaNacimiento').val('')
        $('#txtHoraNacimientoPaciente').val('00:00')
        $('#txtEdadPaciente').val('')
        $(`#cboTipoEdadPaciente`).val(0)
        $('#txtEsNroHijoPaciente').val('')
        $(`#cboSexoPaciente`).val(0)
        $(`#cboEstadoCivilPaciente`).val(2)
        $(`#cboEtniaPaciente`).val(0)

        $(`#cboIdiomaMaternoPaciente`).val(0)
        $(`#cboGradoInstruccionPaciente`).val(0)
        $(`#cboOcupacionPaciente`).val(142)
        $(`#cboProcedenciaPaciente`).val(4)
        $(`#cboReligionPaciente`).val(4)

        $('#txtTelefonoPaciente').val('')
        $('#txtEmailPaciente').val('')
        $('#txtNombrePadrePaciente').val('')
        $('#txtObservacionPaciente').val('')


        $(`#cboTipoDocMadre`).val(0)
        $(`#cboParentescoMadre`).val(0)
        $('#txtNroDocMadre').val('')
        $('#txtApellidoPaternoMadre').val('')
        $('#txtApellidoMaternoMadre').val('')
        $('#txtPrimerNombreMadre').val('')
        $('#txtSegundoNombreMadre').val('')


        $(`#cboDepartamentoDomicilio`).val(15)
        $('#cboProvinciaDomicilio').empty();
        $('#cboDistritoDomicilio').empty();
        $(`#cboDepartamentoDomicilio`).trigger('change')
        $(`#cboProvinciaDomicilio`).trigger('change')
        $(`#cboDistritoDomicilio`).trigger('change')
        $(`#cboPaisDomicilio`).val(166)
        $('#txtDireccionDomicilio').val('')

        $(`#cboDepartamentoProcedencia`).val(0)
        $('#cboProvinciaProcedencia').empty();
        $('#cboDistritoProcedencia').empty();
        $(`#cboDepartamentoProcedencia`).trigger('change')
        $(`#cboProvinciaProcedencia`).trigger('change')
        $(`#cboDistritoProcedencia`).trigger('change')
        $(`#cboPaisProcedencia`).val(166)

        $(`#cboDepartamentoNacimiento`).val(0)
        $('#cboProvinciaNacimiento').empty();
        $('#cboDistritoNacimiento').empty();
        $(`#cboDepartamentoNacimiento`).trigger('change')
        $(`#cboProvinciaNacimiento`).trigger('change')
        $(`#cboDistritoNacimiento`).trigger('change')
        $(`#cboPaisNacimiento`).val(166)

        $(`#cboTipoMPadres`).val(0)
        $(`#cboTipoPPadres`).val(0)

        $('#txtNombresMPadres').val('')
        $('#txtNombresMPadres').val('')

        $('#txtNroDocPPadres').val('')
        $('#txtNombresPPadres').val('')

        ////
        $(`#cboDepartamentoMadre`).val('')
        $('#cboProvinciaMadre').empty()
        $('#cboCentroPobladoMadre').empty()
        $(`#cboPaisMadre`).trigger('change')
        $(`#cboPaisMadre`).trigger('change')
        $(`#cboDepartamentoMadreo`).trigger('change')
        $(`#cboProvinciaMadre`).trigger('change')
        $(`#cboDistritoMadreo`).trigger('change')
        $('#cboPaisMadre').val('')
        $('#cboCentroPobladoMadre').val('')
        $('#txtDireccionMadre').val('')

        $('#txtTelefonoMadre').val('')
        $('#txtDniPaciente').val('')
        $('#txtCipPaciente').val('')
        $('#txtTelefonoMadre').val('')
        $('#cboParentescoMadre').val('')
        $('#cboParentescoPaciente').val('')
        $('#cboDiscapacidadPaciente').val(0)
        $('#cboDependenciaPaciente').val(0)
        $('#cboUnidadPagoPaciente').val(0)
        $('#cboGradoPaciente').val(0)
        $('#cboSituacionPaciente').val(0)
        $('#cboFactorRHPaciente').val(0)
        $('#cboGrupoSanguineoPaciente').val(0)
        $('#txtCodigoCajaPensionPaciente').val('')
        $('#txtTelefono2Paciente').val('')
        $('#txtTelefono3Paciente').val('')

        $('#cboTipoMPadres').val('')
        $('#txtNroDocMPadres').val('')
        $('#txtNombresMPadres').val('')
        $('#cboTipoPPadres').val('')
        $('#txtNroDocPPadres').val('')
        $('#txtNombresPPadres').val('')

      


    },

    Init: () => {

        Paciente.Plugins()

        Paciente.InitDatablePaciente()

        Paciente.Events()

    }

}

function limpiarTablaCompleta() {

    listaContactos = []; // limpia memoria

    $("#DataTableDatosContactoMujer tbody").empty(); // limpia tabla

    $("#ContactosJson").val(""); // limpia JSON
}

$(document).ready(() => {
    Paciente.Init()

})

function soloNumeros(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 9);
}

function soloNumeros2(input) {
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
}


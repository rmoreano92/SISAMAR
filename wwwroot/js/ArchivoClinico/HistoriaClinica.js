let HistoriaClinica = {

    async Iniciar() {
        HistoriaClinica.DataTableBusqueda();
        //Archivero.DataTableServiciosAutorizados();
        await HistoriaClinica.Plugins();
        HistoriaClinica.Events();

        HistoriaClinica.TiposHistoriaClinicaSeleccionarTodos();
        HistoriaClinica.EstadosHistoriaClinicaSeleccionarTodos();
        HistoriaClinica.TiposNumeracionHistoriaSeleccionarTodos();
    },

    async Plugins() {
        //let FechaHora = await Utilitario.FechaHoraServidor();        
        //let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        //$("#txtFechaIngresoIniBusq, #txtFechaIngresoFinBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    ///////////////////////DATATABLE//////////////////////////////////////////////////////////////////////////////
    DataTableBusqueda() {
        var parms = {
            "paging": false,
            //"bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "nroHistoriaClinica",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoPaterno",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombres",
                    width: "45%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCreacion",
                    width: "15%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_Historias = $("#tblHistorias").dataTable(parms);
    },

    TiposNumeracionHistoriaSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/Paciente/TiposNumeracionHistoriaSeleccionarTodos?area=Comun');

        $('#cboTipoHistoriaAnteriorPaciente').empty();
        $('#cboTipoHistoriaActualPaciente').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoHistoriaAnteriorPaciente').append(`<option value="${obj.idTipoNumeracion}">${obj.descripcionLarga}</option>`)
            $('#cboTipoHistoriaActualPaciente').append(`<option value="${obj.idTipoNumeracion}">${obj.descripcionLarga}</option>`)
        })

        $('#cboTipoHistoriaAnteriorPaciente').val(0)
        $('#cboTipoHistoriaActualPaciente').val(0)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    TiposHistoriaClinicaSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/HistoriaClinica/TiposHistoriaClinicaSeleccionarTodos?area=Comun');

        $('#cboTipoHistoria').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboTipoHistoria').append(`<option value="${obj.idTipoHistoria}">${obj.descripcionLarga}</option>`)
        })

        $('#cboTipoHistoria').val(0)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    EstadosHistoriaClinicaSeleccionarTodos: async function () {

        const res = await HttpClient.Get('/HistoriaClinica/EstadosHistoriaClinicaSeleccionarTodos?area=Comun');

        $('#cboEstadoHistoria').empty();

        if (isEmpty(res.data)) {
            alerta(2, 'Error al listar el tipo de servicio')
            return
        }
        $(res.data.table).each(function (i, obj) {
            $('#cboEstadoHistoria').append(`<option value="${obj.idEstadoHistoria}">${obj.descripcionLarga}</option>`)
        })

        $('#cboEstadoHistoria').val(0)

        $('.chzn-select').chosen().trigger("chosen:updated")
    },
    HistoriasClinicasSegunFiltro: async function () {

        let formData = new FormData()

        formData.append("NroHistoriaClinica", $('#txtNroHistoriaHcBusq').val());
        formData.append("ApellidoPaterno", $('#txtApPaternoHcBusq').val());
        formData.append("ApellidoMaterno", $('#txtApMaternoHcBusq').val());
        formData.append("Nombres", $('#txtNombresHcBusq').val());
        
        let response = await HttpClient.Post(`/HistoriaClinica/HistoriasClinicasSegunFiltro`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            alerta(2, 'No existen datos para mostrar.')
            return false
        }

        return data
    },
    CrearNroHistoriaV2: async function () {

        let formData = new FormData()

        formData.append("IdTipoNumeracion", $('#cboTipoHistoriaActualPaciente').val());
        
        let response = await HttpClient.Post(`/HistoriaClinica/CrearNroHistoriaV2`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data

        if (data <= 0) {
            alerta(2, 'Error al generar numero de historia.')
            return false
        }

        return data
    },
    HistoriasClinicasModificar: async function (NroHistoria) {

        let formData = new FormData()

        formData.append("IdTipoNumeracionAnterior", $('#cboTipoHistoriaAnteriorPaciente').val());
        formData.append("NroHistoriaClinicaAnterior", $('#txtNroHistoriaAnteriorPaciente').val());
        formData.append("IdTipoNumeracion", $('#cboTipoHistoriaActualPaciente').val());
        //formData.append("NroHistoriaClinica", $('#txtNroHistoriaActualPaciente').val());
        formData.append("NroHistoriaClinica", NroHistoria);
        formData.append("FechaCreacion", $('#txtFechaCreacion').val());
        formData.append("FechaPasoAPasivo", $('#txtFechaPasivo').val());
        formData.append("IdTipoHistoria", $('#cboTipoHistoria').val());
        formData.append("IdEstadoHistoria", $('#cboEstadoHistoria').val());
        formData.append("IdPaciente", $('#hdIdPaciente').val());
        
        let response = await HttpClient.Post(`/HistoriaClinica/HistoriasClinicasModificar`, formData)

        if (isEmpty(response)) {
            return false
        }

        let data = response.data

        if (data <= 0) {
            alerta(2, 'Error al generar numero de historia.')
            return false
        }

        return data
    },
    BuscarPacienteEnEstablecimiento: async function () {

        let pacientes = await CitasAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()

        if (pacientes.data.table.length > 0) {
            oTable_pacientesBusqueda.fnClearTable()
            oTable_pacientesBusqueda.fnAddData(pacientes.data.table)
            $('#modalPacientesBusqueda').modal('show')
        }
    },


    Events: async function () {
        /////////////////////////////BUTTONS///////////////////////////////////
        $('#btnBuscar').on('click', async function () {

            if ($('#txtNroHistoriaHcBusq').val() == '' && $('#txtApPaternoHcBusq').val() == '' && $('#txtApMaternoHcBusq').val() == '' && $('#txtNombresHcBusq').val() == '') {
                alerta2('info', 'Atención', 'por favor ingrese algunos de los filtros (Ap. Paterno, Ap. Materno, Nombres, N° Historia)')
                return false
            }

            Cargando(1)

            let historias = await HistoriaClinica.HistoriasClinicasSegunFiltro()

            oTable_Historias.fnClearTable()
            if (!isEmpty(historias) && historias.length > 0) {
                oTable_Historias.fnAddData(historias)
            }

            Cargando(0)
        })
        $('#btnLimpiar').on('click', async function () {

            $('#txtNroHistoriaHcBusq').val('')
            $('#txtApPaternoHcBusq').val('')
            $('#txtApMaternoHcBusq').val('')
            $('#txtNombresHcBusq').val('')
        })
        $('#btnAgregar').on('click', async function () {

            //let row = oTable_Historias.api(true).row('.selected').data()

            //if (isEmpty(row)) {
            //    alerta2('info', 'Atención', 'Seleccione un registro')
            //    return false
            //}

            Cargando(1)

            $('#modalRegistroHistoria').modal('show')

            Cargando(0)
        })
        $('#btnModificar').on('click', async function () {

            let row = oTable_Historias.api(true).row('.selected').data()

            if (isEmpty(row)) {
                alerta2('info', 'Atención', 'Seleccione un registro')
                return false
            }

            Cargando(1)

            $('#hdIdPaciente').val(row.idPaciente)
            $('#txtDatosPaciente').val(row.paciente)
            $('#cboTipoHistoriaAnteriorPaciente').val(row.idTipoNumeracionAnterior)
            $('#txtNroHistoriaAnteriorPaciente').val(row.nroHistoriaClinicaAnterior)
            $('#cboTipoHistoriaActualPaciente').val(row.idTipoNumeracion)
            $('#txtNroHistoriaActualPaciente').val(row.nroHistoriaClinica)
            $('#txtFechaCreacion').datepicker("setDate", row.fechaCreacion);
            $('#txtFechaPasivo').datepicker("setDate", row.fechaPasoPasivo);
            $('#cboEstadoHistoria').val(row.idEstadoHistoria)
            $('#cboTipoHistoria').val(row.idTipoHistoria)

            $('.chosen-select').chosen().trigger("chosen:updated")
            $('.chzn-select').chosen().trigger("chosen:updated");

            $('#modalRegistroHistoria').modal('show')

            Cargando(0)
        })
        $('#btnGuardar').on('click', async function () {

            if (isEmpty($('#cboTipoHistoriaActualPaciente').val())) {
                alerta(2, 'Seleccione el Tipo de Historia Actual')
                return
            }

            let continuar = await alertaAsync('question', '', 'Se actualizara la Historia Clínica <br> ¿Desea continuar con el registro?')

            if (continuar) {
                Cargando(1)

                let NroHistoria = $('#txtNroHistoriaActualPaciente').val()

                if ($('#cboTipoHistoriaActualPaciente').val() == '1') {
                    let historia = await HistoriaClinica.CrearNroHistoriaV2()
                    NroHistoria = historia
                }
                let historiaMod = await HistoriaClinica.HistoriasClinicasModificar(NroHistoria)

                $('#hdIdPaciente').val('')
                $('#txtDatosPaciente').val('')
                $('#cboTipoHistoriaAnteriorPaciente').val(0)
                $('#txtNroHistoriaAnteriorPaciente').val('')
                $('#cboTipoHistoriaActualPaciente').val(0)
                $('#txtNroHistoriaActualPaciente').val('')
                $('#txtFechaCreacion').val('')
                $('#txtFechaPasivo').val('')
                $('#cboEstadoHistoria').val(0)
                $('#cboTipoHistoria').val(0)

                $('.chosen-select').chosen().trigger("chosen:updated")
                $('.chzn-select').chosen().trigger("chosen:updated");
                //console.log(historiaMod)

                alerta2('success', 'Correcto', 'La historia se acutalizo correctamente')
                $('#modalRegistroHistoria').modal('hide')
            }
            

            Cargando(0)
        })
        $('#btnCancelar').on('click', async function () {

            Cargando(1)

            $('#hdIdPaciente').val('')
            $('#txtDatosPaciente').val('')
            $('#cboTipoHistoriaAnteriorPaciente').val(0)
            $('#txtNroHistoriaAnteriorPaciente').val('')
            $('#cboTipoHistoriaActualPaciente').val(0)
            $('#txtNroHistoriaActualPaciente').val('')
            $('#txtFechaCreacion').val('')
            $('#txtFechaPasivo').val('')
            $('#cboEstadoHistoria').val(0)
            $('#cboTipoHistoria').val(0)

            $('.chosen-select').chosen().trigger("chosen:updated")
            $('.chzn-select').chosen().trigger("chosen:updated");

            $('#btnBuscar').click()
            $('#modalRegistroHistoria').modal('hide')

            Cargando(0)
        })



        /////////////////////////////TABLES///////////////////////////////////
        $('#tblHistorias').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected')
            } else {
                oTable_Historias.$('tr.selected').removeClass('selected')
                $(this).addClass('selected')
            }
        })
    }
}


$(document).ready(function () {
    HistoriaClinica.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});
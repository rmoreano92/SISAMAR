// JDELGADO003-C
var HistorialEvaluacionesHosp = {
    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();
    },

    initDatablesCuenta() {
        var parms = {
            scrollY: '550px',
            order: [[0, "desc"]],
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    visible: false,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html("<b>Cuenta: " + rowData.idCuentaAtencion + "</b><br> Fecha Ing.: " + rowData.fechaRegistro2 + "<br> Servicio: " + rowData.servicio + "<br><b> Medico: " + rowData.medico + "</b>" + "<br><b> Tipo Ser.: " + rowData.tipoServicio + "</b>")

                        if (rowData.estadoCuenta == 0) {
                            $(td).parent().css('color', 'red');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }
            ]

        }

        var tableWrapper = $('#tblHistorialEvaluaciones'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_cuentasEval = $("#tblHistorialEvaluaciones").dataTable(parms);
    },

    initDatablesDiagnosticos() {
        var parms = {
            "scrollY": "145px",
            order: [[0, "desc"]],
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoDiagnostico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblDiagHistorial'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_diagnosticosHistorial = $("#tblDiagHistorial").dataTable(parms);
    },
    llendaDatos(nroHistoria, valor) {
        formData = new FormData()
        formData.append('nroHistoria', nroHistoria);

        oTable_cuentasEval.fnClearTable()

        fetch('/Atencion/web_listarEvalEmergenciaByNroHistoria?area=ConsultaExterna', {
            method: 'POST',
            body: formData

        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(res => {
                $('#txtNroHistoriaEval').val(res.dataSet.table[0].nroHistoriaClinica)
                $('#txtNombresEval').val(`${res.dataSet.table[0].primerNombre} ${res.dataSet.table[0].segundoNombre} ${res.dataSet.table[0].apellidoPaterno} ${res.dataSet.table[0].apellidoMaterno}`)
                oTable_cuentasEval.fnAddData(res.dataSet.table)
            })

        //$('#txtNombres').val("")
        //$('#txtNombres').attr('disabled', true)
        //$('#txtNroHistoria').val(historia)

        //oTable_cuentasEval.fnClearTable();

        //OrdenesYResultados.limpiarCatalogo();
        //OrdenesYResultados.limpiarREsultadosGenerales();

        //var midata = new FormData();
        //midata.append('nroHistoria', historia);

        //$.ajax({
        //    type: "post",
        //    url: "/Paciente/PacientesSeleccionarPorNroHistoriaClinica?area=ConsultaExterna",
        //    data: midata,
        //    dataType: "json",
        //    processData: false,
        //    contentType: false,
        //    async: false,
        //    success: function (datos) {

        //        idPaciente = datos.table[0]["idPaciente"];
        //        $('#txtNombres').val(datos.table[0]["apellidoPaterno"] + ' ' + datos.table[0]["apellidoMaterno"] + ' ' + datos.table[0]["primerNombre"] + ' ' + datos.table[0]["segundoNombre"]);
        //        var midata2 = new FormData();
        //        midata2.append('idPaciente', idPaciente);

        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 21);
        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 2);
        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 23);
        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 20);
        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 3);
        //        OrdenesYResultados.listaRecetasByIdRecetaByPuntoCargaGeneral(datos.table[0]["nroHistoriaClinica"], 11);

                
        //    },
        //    error: function (msg) {
        //        setTimeout(function () {
        //            //                    Cargando(0);
        //            alerta("ERROR", "Error listar paciente!", "2");
        //        }, 900)
        //    }
        //});
    },
    listaDiagosticos() {
        oTable_diagnosticosHistorial.fnClearTable()
        var objrow = oTable_cuentasEval.api(true).row('.selected').data();
        var midata = new FormData();
        midata.append('idAtencion', objrow.idAtencion);
        midata.append('idNumero', objrow.idNumero);
        midata.append('idServicio', objrow.idServicio);

        $.ajax({

            method: "POST",
            url: "/Hospitalizacion/web_AtencionesDiagnosticosSeleccionarPorAtencionPorNumeroEvaluacionNotaIngreso?area=Hospitalizacion",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                diagnosticos = "";
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {
                        oTable_diagnosticosHistorial.fnAddData(datos.table)
                    }
                }
                else {
                    Cargando(0)
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },
    llenaOtrosDatos() {
        var objrow = oTable_cuentasEval.api(true).row('.selected').data();
        $('#txtMotivoConsultaSeg').val(objrow.citaMotivo)
        $('#txtExamenClinicoSeg').val(objrow.citaExamenClinico)
        $('#txtPlandeTrabajo').val(objrow.planTrabajo)
       
        $('#txtTratamiento2').val(objrow.tratamiento)
        //$('#txtAntecedenRelacionadosSeg').val(objrow.citaAntecedente)
    },
    limpiaDatos() {
        oTable_cuentasEval.fnClearTable();
        oTable_diagnosticosSegui.fnClearTable();
        $('#txtMotivoConsultaSeg').val("");
        $('#txtExamenClinicoSeg').val("");
        $('#txtPlandeTrabajo').val("");
        $('#txtTratamiento2').val("");
        //$('#txtAntecedenRelacionadosSeg').val("");
    },
    eventos() {

        $('#tblHistorialEvaluaciones tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');

            }
            else {
                oTable_cuentasEval.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                $('.nav-tabs a[href="#diagnosticoCons"]').tab('show');
                var objrow = oTable_cuentasEval.api(true).row('.selected').data();
                $('#lblDatosAtencion').html("<b>Cuenta: " + objrow.idCuentaAtencion + " - Fecha Ing.: " + objrow.fechaIngreso2 + " - Servicio: " + objrow.servicio + " - Tipo Servicio: " + objrow.tipoServicio + "</b>")

                HistorialEvaluacionesHosp.listaDiagosticos();
                let examen = `GENERAL Y SENSORIO: ${objrow.lEstadoGeneral == 1 ? 'Normal' : 'Anormal'} -> ${objrow.dEstadoGeneral} ${objrow.dEdemas}` +
                `\nCARDIOVASCULAR: ${ objrow.lAparatoCV == 1 ? 'Normal' : 'Anormal'} -> ${ objrow.dAparatoCV } ${ objrow.dReflejos }` +
                `\nABDOMEN: ${ objrow.lAbdomen == 1 ? 'Normal' : 'NO' } -> ${ objrow.dAbdomen }` +
                `\nRESPIRATORIO: ${ objrow.lAparatoR == 1 ? 'Normal' : 'Anormal' } -> ${ objrow.dAparatoR }` +
                `\nURINARIO: ${ objrow.lAparatoU == 1 ? 'Normal' : 'Anormal' } -> ${ objrow.dAparatoU }` +
                `\nEXTREMIDADES: ${objrow.lExtremidades == 1 ? 'Normal' : 'Anormal'} -> ${objrow.dExtremidades}`
                
                $('#txtMotivoConsultaEval').val(objrow.enfermedadA)
                $('#txtExamenClinicoEval').val(examen)
                $('#txtPlandeTrabajoEval').val(objrow.plandeTrabajo)
                $('#txtTratamientoEval').val(objrow.tratamiento)
                //SeguimientoPaciente.llenaOtrosDatos();
                //OrdenesYResultados.limpiarCatalogo();
                //OrdenesYResultados.listaCabeceraRecetasByIdCuenta(objrow.idCuentaAtencion, 0)

            }


        });

        $('#txtNroHistoria').on("keyup", function (event) {
            if (event.keyCode === 13) {

                SeguimientoPaciente.llendaDatos($('#txtNroHistoria').val(), 1)
            }
        });

    },

};

$(document).ready(function () {

    HistorialEvaluacionesHosp.plugins();
    HistorialEvaluacionesHosp.eventos();
    HistorialEvaluacionesHosp.initDatablesCuenta();
    HistorialEvaluacionesHosp.initDatablesDiagnosticos();

});



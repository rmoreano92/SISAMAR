
var SeguimientoPacienteCPN = {
    Plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();
    },

    ListaControlesByidCabecera(idCabecera) {
        Cargando(1)
        oTable_controlesCPN.fnClearTable();

        var midata = new FormData();
        midata.append('idCabecera', idCabecera);

        $.ajax({
            method: "POST",
            url: "/Atencion/ListaControlesByidCabecera?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                Cargando(0)
                if (datos.table.length !== 0) {
                    if (!isEmpty(datos.table)) {
                        oTable_controlesCPN.fnAddData(datos.table)
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


    llendaDatos(historia) {
        $('#txtNroHistoriaCPN').attr('disabled', true)
        $('#txtNombresCPN').val("")
        $('#txtNombresCPN').attr('disabled', true)
        $('#txtNroHistoriaCPN').val(historia)

        oTable_ciclosEmbarazo.fnClearTable()

        let formData = new FormData();
        formData.append('nroHistoria', historia);

        HttpClient.Post('/Paciente/PacientesSeleccionarPorNroHistoriaClinica?area=ConsultaExterna', formData).then(res => {
            idPaciente = res.lsPacientes.table[0]["idPaciente"];
            $('#txtNombresCPN').val(res.lsPacientes.table[0]["apellidoPaterno"] + ' ' + res.lsPacientes.table[0]["apellidoMaterno"] + ' ' + res.lsPacientes.table[0]["primerNombre"] + ' ' + res.lsPacientes.table[0]["segundoNombre"])
        }).then(res => {
            formData.append('idPaciente', idPaciente);

            HttpClient.Post('/Atencion/ListarCabecerasCiclosCerrados?area=ConsultaExterna', formData).then(res => {

                if (res.dataSet.table.length > 0) {
                    oTable_ciclosEmbarazo.fnClearTable()
                    oTable_ciclosEmbarazo.fnAddData(res.dataSet.table)
                }
                
            })

        })
    },

    llenaOtrosDatos() {
        var objrow = oTable_cuentas.api(true).row('.selected').data();
        $('#txtMotivoConsultaSeg').val(objrow.citaMotivo)
        $('#txtExamenClinicoSeg').val(objrow.citaExamenClinico)
        $('#txtPlandeTrabajo').val(objrow.planTrabajo)
       
        $('#txtTratamiento2').val(objrow.tratamiento)
    },
    limpiaDatos() {
        oTable_ciclosEmbarazo.fnClearTable()
        oTable_controlesCPN.fnClearTable()
    },


    InitDatablesControles() {

        $('#tblListaControlCPN').DataTable().clear().destroy()

        let parms = {
            "scrollY": "300px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            "autoWidth": false,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '20%',
                    targets: 0,
                    data: "idControl",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 1,
                    data: "fecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "consultorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 3,
                    data: "medico",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 4,
                    data: "cuenta",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]

        }

        var tableWrapper = $('#tblListaControlCPN'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_controlesCPN = $("#tblListaControlCPN").dataTable(parms);
        $('#tblListaControl_length').css('display', 'none')

    },
    InitDatablesCiclosEmbarazo() {
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
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        console.log("data", rowData)
                        $(td).attr('align', 'left')
                        $(td).html(`<b>Usuario inicia: </b> ${rowData.usuarioInicia}
                                    <br> Fecha Inicio: ${rowData.fechaInicio}
                                    <br> Fecha Fin: ${rowData.fechaFin}`)

                        if (rowData.estadoCuenta == 0) {
                            $(td).parent().css('color', 'red');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCiclosEmbarazo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ciclosEmbarazo = $("#tblCiclosEmbarazo").dataTable(parms);
    },

    eventos() {

        $('#tblCiclosEmbarazo tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');

            } else {
                oTable_cuentas.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            let rowCiclos = oTable_ciclosEmbarazo.api(true).row('.selected').data()

            oTable_controlesCPN.fnClearTable()
            if (!isEmpty(rowCiclos)) {
                SeguimientoPacienteCPN.ListaControlesByidCabecera(rowCiclos.idProcabecera)
            }
            
            
        });


        ///////////////////////////KHOYOSI/////////////////////////////////////
        //$("#btnCerrarSeguimiento").on('click', function () {
        //    $('#hdIdCuentaAtencion').val(IdCuentaAtencionTemp);
        //    SeguimientoPaciente.limpiaDatos();
        //    $("#modalSeguimiento").modal('hide');
        //});

        //$('#btnVerInformeAtencion').on('click', async function () {
        //    var row = oTable_cuentas.api(true).row('.selected').data();
        //    tipoFormato = 0;

        //    if (typeof row === 'undefined') {
        //        alerta(2, "Seleccione un registro");
        //    } else {
        //        if (row.idTipoServicio == 1) {
        //            if (row.fechaEgreso != '' && row.fechaEgreso != null) {
        //                const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI
        //                if (typeof firma === 'undefined') {
        //                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
        //                    if (typeof row.usaModuloMaterno === 'undefined') {
        //                        alerta(2, "Seleccione Fila");
        //                    } else {
        //                        if (row.usaModuloMaterno) {
        //                            tipoFormato = 1;
        //                        }
        //                        else if (row.usaModuloNinoSano) {
        //                            tipoFormato = 2;
        //                        }
        //                        else {
        //                            tipoFormato = 0;
        //                        }
        //                        //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
        //                    }
        //                    const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idProCabecera, tipoFormato);
        //                    if (pdf) {
        //                        alerta('1', 'Se generó el documento correctamente.')
        //                        $("#btnBuscarAtenciones").click();
        //                    } else {
        //                        alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
        //                    }
        //                } else {
        //                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
        //                    AbrirVisorDocumento(firma.rutaArchivo, 0);
        //                }
        //            } else {
        //                alerta(2, "El paciente no ha sido atendido.");
        //            }                    
        //        } else {
        //            alerta(2, "No existe un formato para generar este informe de atención.");
        //        }
                                               
        //    }            
        //});

        //$('#btnVerRecetasMedicas').on('click', async function () {
        //    var row = oTable_cuentas.api(true).row('.selected').data();
            
        //    if (typeof row === 'undefined') {
        //        alerta(2, "Seleccione un registro");
        //    } else {
        //        VisorReceta.AbrirVisorRecetas(OrdenesRecetasMedicasSeguimiento);
        //    }
        //    //console.log(OrdenesRecetas);            
        //});
        ///////////////////////////////////////////////////////////////////////
    },

};

$(document).ready(function () {

    SeguimientoPacienteCPN.Plugins();
    SeguimientoPacienteCPN.eventos();

    SeguimientoPacienteCPN.InitDatablesCiclosEmbarazo()
    SeguimientoPacienteCPN.InitDatablesControles()

});



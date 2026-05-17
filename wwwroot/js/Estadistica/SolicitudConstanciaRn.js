var ObjtableSolicitudesRn;
var ObjtablePacientesRn;
var ObjtablePacientesLibroNac;
var FechaDia;
var idAccion;
//var bActivarAccion;
//var bAprobar;
var SolicitudConstanciaRn = {
    idSolicitud: 0,
    idConstancia: 0,
    idRegistroRN: 0,
    anio: 0,
    base: 0,
    tipoRolPermiso: false,
    tipoPermiso: '',
    tipoBusqueda: '',

    async InicializarComponentesSolicitudConstanciaRn() {
        

        $('#modalSolicitudConstanciaRn').modal({ backdrop: 'static', keyboard: false });
        $('#modalSolicitudConstanciaRn').modal('hide');
        $('#modalBuscarPaciente').modal({
            backdrop: 'static', keyboard: false
            
        });
        $('#modalBuscarPaciente').modal('hide');

        $('#modalAprobarSolicitud').modal({
            backdrop: 'static', keyboard: false, width:"30%",

        });
        $('#modalAprobarSolicitud').modal('hide');

        //bActivarAccion = $("#HabImpresion").val();
        //bAprobar = $("#HabAprobar").val();
        SolicitudConstanciaRn.tipoRolPermiso = await Utilitario.ValidarPermiso(800);
        SolicitudConstanciaRn.tipoPermiso = $("#tipoPermiso").val();

        $('#txtFechaFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaNacFiltro').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtFechaFiltro, #txtFechaNacFiltro").mask("Dd/Mm/abcd"); 

        var f = new Date();
        var dia = f.getDate();
        var mes = (f.getMonth() + 1);
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        FechaDia = dia + "/" + mes + "/" + f.getFullYear();
        //$('#txtFechaFiltro').val(FechaDia);
        $("#txtFechaFiltro").datepicker("setDate", FechaDia);
        $('#rdbTardioNO').prop('checked', true);
        $('#rdbLacthoraNO').prop('checked', true);

        //console.log(bActivarAccion);

        SolicitudConstanciaRn.DataTableSolicitudesRn();

        $(".chzn-select").chosen({ placeholder_text_single: 'Seleccione una opción' });
        Cargando(0);
    },

    ListarSolicitudes() {
        var Recurso
        Recurso = $("#lstRnConstancias").data('source');
        Cargando(1);
        var midata = new FormData();
        midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
        midata.append('idConstancia', $("#txtNroConstanciaFiltro").val());
        midata.append('NroDocumento', $("#txtNroDocumentoFiltro").val());        
        midata.append('idEstadoSolicitud', $("#cboEstadoSolicitud").val());
        midata.append('FechaAtencion', $("#txtFechaFiltro").val());
               
        //var dat 
        $.ajax({
            method: "POST",
            url: "/SolicitudConstanciasRN/BuscarSolicitudesRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {   
                    ObjtableSolicitudesRn.fnClearTable();
                    if (!isEmpty(datos.lstConstancias.table)) {
                        if (datos.lstConstancias.table.length > 0) {
                            ObjtableSolicitudesRn.fnAddData(datos.lstConstancias.table);

                            if (SolicitudConstanciaRn.tipoPermiso == '1' && $("#cboEstadoSolicitud").val() == 2) {
                                $("#btnFirmaLote").show();
                            }
                        }
                        else {
                            $("#btnFirmaLote").hide();
                        }
                    }
                    Cargando(0);
                } else {
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    DataTableSolicitudesRn() {
        ObjtableSolicitudesRn = $("#lstRnConstancias").dataTable({
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true, 
            columns: [
                {
                    "data": "idSolicitud", className: 'ContCenter',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoSolicitud == 0) {
                            $(td).parent().css('color', '#EF6F6C');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                { "data": "idConstancia", className: 'ContCenter' },
                { "data": "nroHistoria", className: 'ContCenter' },
                { "data": "paciente", width: "15%" },
                { "data": "madre", width: "15%" },
                { "data": "documento", className: 'ContCenter' },
                { "data": "idEstadoSolicitud", className: 'ContCenter', "visible": false },
                { "data": "estado", className: 'ContCenter' },
                { "data": "fechaNacimiento", className: 'ContCenter' },
                { "data": "fechaRegistro", className: 'ContCenter' },
                { "data": "fechaImpresion", className: 'ContCenter' },
                { "data": "estadoFirma", className: 'ContCenter' },
                {
                    "data": "accion",
                    //"visible": bActivarAccion,
                    "visible": (SolicitudConstanciaRn.tipoPermiso == '1' ? true : false),
                    "width": "120px",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if ((rowData.idEstadoSolicitud == 2 || rowData.idEstadoSolicitud == 4) && rowData.code != "") {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";


                            //btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-warning glow_button mm-1" title="Imprimir Constancia" data-toggle="tooltip" id="ImprimeConstanciaSF" onclick="SolicitudConstanciaRn.ImprimirConstanciaSF(' + rowData.idConstancia + ');"><i class="fa fa-eye"></i> </button>';
                            btnImprimeSinF = '<button class="btn btn-sm btn-warning glow_button mm-1 ImprimeConstanciaSF" title="Imprimir Constancia" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';

                            //if (rowData.statusFirma == 0) {
                            //    btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-danger mm-1" title="Firmar Constancia" data-toggle="tooltip" id="FirmarConstancia"> <i class="fa fa-file-signature"></i></a>';
                            //}
                            //if (rowData.statusFirma == 1) {
                            //    btnImprime = ' <button class="ImprimeInforme btn btn-success glow_button mm-1" title="Imprimir Constancia Firmada" data-toggle="tooltip" id="ImprimeConstanciaCF"><i class="fa fa-print"></i> </button>';

                            //    //btnRuta = "";
                            //}

                            if (rowData.idEstadoSolicitud == 2) {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeConstanciaCF" title="Imprime Constancia Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarConstanciaSF" title="Firmar Constancia" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            } else if (rowData.idEstadoSolicitud == 4) {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeConstanciaCF" title="Imprime Constancia Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },
                {
                    "data": "accion",
                    //"visible": bActivarAccion,
                    "visible": (SolicitudConstanciaRn.tipoPermiso == '0' ? true : false),
                    "width": "120px",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (rowData.idEstadoSolicitud == 2 && rowData.code != "") {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            //btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-warning glow_button mm-1" title="Imprimir Constancia" data-toggle="tooltip" id="ImprimeConstanciaSF" onclick="SolicitudConstanciaRn.ImprimirConstanciaSF(' + rowData.idConstancia + ');"><i class="fa fa-eye"></i> </button>';
                            btnImprimeSinF = '<button class="btn btn-sm btn-teal glow_button mm-1 ImprimeConstancia" title="Imprimir Constancia" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }
                    }
                },

                { "data": "bd", "visible": false }
            ]
        });
    },

    DataTableRegistrosRn() {
        ObjtablePacientesRn = $("#lstPacientesRn").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '300px',
            scrollCollapse: true,
            bLengthChange: false,
            // dom: 'Bflr<"table-responsive"t>ip',
            buttons: [],
            columns: [
                /*{ "data": "idPaciente", className: 'ContCenter', "visible": false },*/
                { "data": "nroDocumento", target: 0, className: 'ContCenter', "orderable": false, width: '10%' },
                { "data": "nroHistoriaClinica", target: 1, className: 'ContCenter', "orderable": false, width: '10%' },
                { "data": "paciente", target: 2, width: '30%' },
                { "data": "madre", target: 3, "orderable": false, width: '30%' },
                //{ "data": "fechaNacimiento", className: 'ContCenter', "orderable": false },
                { "data": "fecNac", target: 4, className: 'ContCenter', "orderable": false, width: '10%' },
                //{ "data": "edad", className: 'ContCenter', "orderable": false },
                { "data": "sexo", target: 5, className: 'ContCenter', "orderable": false, width: '10%' },

                //{ "data": "bd", "visible": false }
            ]
        });
    },

    DataTableLibroNacimientos() {
        ObjtablePacientesLibroNac = $("#lstPacientesLibroNac").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '300px',
            scrollCollapse: true,
            bLengthChange: false,
            // dom: 'Bflr<"table-responsive"t>ip',
            buttons: [],
            columns: [
                { "data": "nroLibro", target: 0, className: 'ContCenter', width: '5%' },
                { "data": "nroFolio", target: 0, className: 'ContCenter', width: '5%' },
                { "data": "nroAnio", target: 0, className: 'ContCenter', width: '5%' },
                { "data": "nroMes", target: 0, className: 'ContCenter', width: '5%' },
                { "data": "nroDocumento", target: 0, className: 'ContCenter', "orderable": false, width: '10%' },
                { "data": "nroHistoriaClinica", target: 0, className: 'ContCenter', "orderable": false, width: '10%' },
                { "data": "paciente", target: 0, width: '20%' },
                { "data": "madre", target: 0, "orderable": false, width: '20%' },
                //{ "data": "fechaNacimiento", className: 'ContCenter', "orderable": false },
                { "data": "fecNac", target: 0, className: 'ContCenter', "orderable": false, width: '10%' },
                //{ "data": "edad", className: 'ContCenter', "orderable": false },
                { "data": "sexo", target: 0, className: 'ContCenter', "orderable": false, width: '10%' },

                //{ "data": "bd", "visible": false }
            ]
        });
    },

    Eventos() {
        $('#modalBuscarPaciente').on('shown.bs.modal', function (e) {
            SolicitudConstanciaRn.DataTableRegistrosRn();
            SolicitudConstanciaRn.DataTableLibroNacimientos();
            //console.log("ABRIOOOOOO");
        });

        $("a[href='#busquedaPacientes-tab']").on('shown.bs.tab', function (e) {
            SolicitudConstanciaRn.DataTableRegistrosRn();
        });

        $("a[href='#busquedaLibroNac-tab']").on('shown.bs.tab', function (e) {
            SolicitudConstanciaRn.DataTableLibroNacimientos();
        });

        $('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporte');
            objFra.contentWindow.focus();
            objFra.contentWindow.print();
            SolicitudConstanciaRn.ListarSolicitudes();
            Cargando(0);
        }); 

        $('#lstPacientesRn tbody').on('click', 'tr', function () {
            ObjtablePacientesLibroNac.$('tr.selected').removeClass('selected');
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtablePacientesRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#lstPacientesLibroNac tbody').on('click', 'tr', function () {
            ObjtablePacientesRn.$('tr.selected').removeClass('selected');
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtablePacientesLibroNac.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


        $('#lstRnConstancias tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                ObjtableSolicitudesRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


        $("#txtNroCorrelativo").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                if ($("#txtNroCorrelativo").val() == "" || $("#txtNroDocumento").val() =="") {
                    alerta(2, "Debe ingresar el correlativo correcto.");
                } else {
                    SolicitudConstanciaRn.ValidaComprobante();
                }
            }
        });


        //$("#txtApNomFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.BuscarPacienteRn();
        //    }
        //});
        //$("#txtFechaNacFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.BuscarPacienteRn();
        //    }
        //});
        //$("#txtNroHistoriaNacFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.BuscarPacienteRn();
        //    }
        //});

        $('.searchPaciente').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                SolicitudConstanciaRn.ListarPacientesRegistroRN();
            }
        });

        $('.searchLibroNac').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                SolicitudConstanciaRn.ListarPacientesLibroNacimiento();
            }
        });

        //$("#txtNroConstanciaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.ListarSolicitudes();
        //    }
        //});

        //$("#txtNroCorrelativoFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.ListarSolicitudes();
        //    }
        //});

        //$("#txtNroHistoriaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.ListarSolicitudes();
        //    }
        //});

        //$("#txtFechaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        SolicitudConstanciaRn.ListarSolicitudes();
        //    }
        //});

        $('.searchSolicitud').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                SolicitudConstanciaRn.ListarSolicitudes();
            }
        });

        /*
        $("#ImprimeConstanciaSF").click(function (e) {
            console.log("ENTROOOOO")
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            // = 0;
            if (typeof row.usaModuloMaterno === 'undefined') {
                alerta(2, "Seleccione Fila");
            } else {
                SolicitudConstanciaRn.ImprimirConstanciaSF(row.idContancia);
            }
            
        });
        */

        //$("#CerrarVisorDocumento").click(function (e) {
        //    swal({
        //        title: 'Mensaje',
        //        text: 'La Constancia Nacimiento solo estara <strong style="font-weight: 900;text-decoration: underline;">imprimir una sola vez</strong>. <br> ¿Esta seguro de continuar?',
        //        type: 'warning',
        //        showCancelButton: true,
        //        confirmButtonColor: '#4fb7fe',
        //        cancelButtonColor: '#6c6c6c',
        //        confirmButtonText: 'Aceptar',
        //        cancelButtonText: 'Cancelar',
        //    }).then(function () {
        //    }, function (dimiss) {
        //    });
        //});

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstancia', async function () {
            var objrow = ObjtableSolicitudesRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableSolicitudesRn.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI            
            if (isEmpty(firma)) {
                alerta2('info', '', 'El documento no esta generado.');                
            } else {
                //console.log(row);
                if (firma.statusFirma == 0) {
                    swal({
                        title: 'Mensaje',
                        text: 'La Constancia Nacimiento aún <strong style="font-weight: 900;text-decoration: underline;">no esta firmada digitalmente</strong>. <br> ¿Esta seguro de continuar?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#6c6c6c',
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                    }).then(async function () {
                        await SolicitudConstanciaRn.ImprimirConstanciaSF(row.idConstancia, firma);              
                    }, function (dimiss) {                        
                    });
                } else if (firma.statusFirma == 1) {
                    await SolicitudConstanciaRn.ImprimirConstanciaSF(row.idConstancia, firma);              
                }                
            }
            Cargando(0);
            ////console.log("ENTROOOOO")
            //var objrow = ObjtableSolicitudesRn.api(true).row($(this).parents("tr")[0]).index();
            //var row = ObjtableSolicitudesRn.fnGetData(objrow);
            //// = 0;
            //if (isEmpty(row.idContancia)) {
            //    alerta(2, "Seleccione Fila");
            //} else {
            //    SolicitudConstanciaRn.ImprimirConstanciaSF(row.idContancia);
            //}
            
        });

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstanciaSF', async function () {
            var objrow = ObjtableSolicitudesRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableSolicitudesRn.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta2('info', '', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarConstanciaNacimiento(row.idConstancia);

                if (pdf) {
                    alerta2('success', '', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta2('info', '', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);

        });

        $('#lstRnConstancias tbody').on('click', '.FirmarConstanciaSF', async function () {
            var objrow = ObjtableSolicitudesRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableSolicitudesRn.fnGetData(objrow);
            var tipo = '';
            var code = '';

            Cargando(1);   
            SolicitudConstanciaRn.tipoRolPermiso = await Utilitario.ValidarPermiso(800);
            if (!SolicitudConstanciaRn.tipoRolPermiso) {
                Cargando(0);
                alerta2('info', '', 'Usted no tiene permiso para firmar este documento.');
                return false;
            } else {                
                Utilitario.TipoArchivoFirmar = 'CN';
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                //await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                
            }
            Cargando(0);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            //if (firma) {
            //    Utilitario.TipoArchivoFirmar = 'CN';
            //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
            //}
            
        });

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstanciaCF', async function () {
            var objrow = ObjtableSolicitudesRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableSolicitudesRn.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnFirmaLote').on('click', async function () {
            let listConstancias = ObjtableSolicitudesRn.api(true).data();
            let numConstancia = [];

            
            $(listConstancias).each(async (i, obj) => {
                numConstancia.push(obj.idConstancia);
            })
            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'CN';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos('', numConstancia, "'CN'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'CN'", numConstancia);
            }
            Cargando(0)

            //Cargando(1)
            //Utilitario.TipoArchivoFirmar = 'CN';
            //if (permisoFirmaDigital == 1) {
            //    const paquete = await Utilitario.CrearPaqueteArchivosConRegistros(numConstancia, 0, 0, Utilitario.TipoArchivoFirmar);
            //    if (!isEmpty(paquete)) {
            //        await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
            //    }
            //} else if (permisoFirmaDigital == 2) {
            //    const paquete = await Utilitario.CrearPaqueteArchivos7zip(numConstancia, 0, 0, Utilitario.TipoArchivoFirmar);
            //    if (!isEmpty(paquete)) {
            //        await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
            //    }
            //}   
            
            //Cargando(0)
        });

    },

    ObtenerSolicitudConstanciaRn(idCuentaAtencion) {
        Cargando(1);
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        $.ajax({
            method: "POST",
            url: "/ConstanciaRn/ObtenerConstanciaRn?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {

                        $("#hdnIdConstanciaRn").val(datos.table[0].idConstanciaRn);
                        $("#hdnIdCuentaAtencion").val(datos.table[0].idCuentaAtencion);
                        $("#txtPeso").val(datos.table[0].peso);
                        $("#txtTalla").val(datos.table[0].talla);
                        $("#txtPerToracico").val(datos.table[0].perimetroToracico);
                        $("#txtPerCefalico").val(datos.table[0].perimetroCefalico);
                        $("#txtObservacion").val(datos.table[0].observaciones);
                        $("#cboProfResponsable").val(datos.table[0].idMedico);
                        $("#cboTipoParto").val(datos.table[0].idTipoParto);
                        $("#cboCondicion").val(datos.table[0].idCondicion);
                        $("#cboRiesgo").val(datos.table[0].idRiesgo);
                        $("#txtNroGemelar").val(datos.table[0].nroGemelar);
                        $("#cboContactoPiel").val(datos.table[0].pielaPïel);
                        $("#txtEdadGestacional").val(datos.table[0].edadGes);
                        $("#txtGestas").val(datos.table[0].gesta);
                        $("#txtParidad").val(datos.table[0].paridad);
                        $("#txtMinuto").val(datos.table[0].alMinuto);
                        $("#txt5Minuto").val(datos.table[0].alos5Minutos);

                        $("#cboProfResponsable").trigger("chosen:updated");
                        $("#cboTipoParto").trigger("chosen:updated");
                        $("#cboCondicion").trigger("chosen:updated");
                        $("#cboRiesgo").trigger("chosen:updated");
                        $("#cboContactoPiel").trigger("chosen:updated");
                        if (datos.PosicionParto == "H") {
                            $('#rdbTipoPartoH').prop('checked', true);
                        } else {
                            $('#rdbTipoPartoV').prop('checked', true);
                        }
                        //midata.append("", posicion);
                        $("#chkConAcompaniante").prop('checked', datos.table[0].conAcompaniante);
                        $("#chkConAnalgesia").prop('checked', datos.table[0].conAnaglgesia);


                        $("#rdbLacthoraSi").prop('checked', datos.table[0].lactancia1raHora);
                        $("#rdbTardioSi").prop('checked', datos.table[0].clampadoTardio);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ValidarCampos() {
        if (this.tipoBusqueda == 'paciente') {
            //if ($("#hdnNroHistoria").val() == 0) { alerta(2, "Debe buscar el paciente."); $("#hdnNroHistoria").focus(); return false; }
        }
        if ($("#cboSolicitante").val() == "" || $("#cboTipoDoc").val() == null) { alerta2('info', '', "Debe seleccionar el tipo de solicitante."); $("#cboSolicitante").focus(); return false; }
        if ($("#cboTipoDoc").val() == "" || $("#cboTipoDoc").val() == null) { alerta2('info', '', "Debe seleccionar el tipo de documento del solicitante."); $("#cboTipoDoc").focus(); return false; }
        if ($("#txtDocumentoSol").val() == "") { alerta(2, "Debe ingresar el documento del solicitante."); $("#txtDocumentoSol").focus(); return false; }

        if ($("#cboTipoDoc").val() == 1 && $("#txtDocumentoSol").val().length != 8) { alerta2('info', '', "La cantidad de digitos para el DNI son 8."); $("#txtDocumentoSol").focus(); return false; }
        if ($("#cboTipoDoc").val() == 11 && $("#txtDocumentoSol").val().length != 11) { alerta2('info', '', "La cantidad de digitos para el RUC son 11."); $("#txtDocumentoSol").focus(); return false; }

        if ($("#txtNroTramite").val() == "") { alerta2('info', '', "Debe ingresar el número de tramite."); $("#txtNroTramite").focus(); return false; }
        
        
        return true;
    },

    BuscarPaciente() {
        SolicitudConstanciaRn.LimpiarFiltrosBusquedaPaciente();
        $('#modalBuscarPaciente').modal('show');
        $('#BusquedaPacienteTab a[href="#busquedaPacientes-tab"]').tab('show')
    },

    cerrarModal() {
        $('#modalSolicitudConstanciaRn').modal('hide');
     
    },

    cerrarModalBuscarPaciente() {

        $("#hdnAnio").val(0);
        $("#hdnIdPaciente").val(0);
        $("#hdnNroHistoria").val(0);
        $("#hdnBd").val(0);
        $('#modalBuscarPaciente').modal('hide');
    
    },


    BuscarPacienteRn() {
        //if ($("#txtAnioNacFiltro").val() == 0) { alerta(2, "Debe ingresar el año."); $("#btnBuscarPaciente").focus(); return false; }
        if ($("#txtApNomFiltro").val() == '' && $("#txtFechaNacFiltro").val() == '' && $("#txtNroHistoriaNacFiltro").val() == '') { alerta(2, "Debe ingresar al menos un parametro de busqueda aparte del año."); $("#txtApNomFiltro").focus(); return false; }

        var Recurso
       Recurso = $("#lstPacientesRn").data('source');
        Cargando(1);
        var midata = new FormData();
        /*
       midata.append('Anio', $("#txtAnioNacFiltro").val());
       midata.append('Apellidos', $("#txtApNomFiltro").val());
       midata.append('FecNac', $("#txtFechaNacFiltro").val());
       midata.append('NroHistoria', $("#txtNroHistoriaNacFiltro").val());*/

        midata.append('Apellidos', $("#txtApNomFiltro").val());
        midata.append('FechaAtencion', $("#txtFechaNacFiltro").val());
        midata.append('NroCuenta', 0);
        midata.append('NroHistoria', $("#txtNroHistoriaNacFiltro").val());
        midata.append('NroDocumento', '0');
        midata.append('idGrupo', 0);
        $.ajax({
            method: "POST",
            url: Recurso,
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                console.log(datos)
                Cargando(0)
                ObjtablePacientesRn.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.table);
                    }

                }
            
            /*ObjtablePacientesRn.fnClearTable();
            if(!isEmpty(datos.table)) {
            if (datos.table.length > 0) {
                ObjtablePacientesRn.fnAddData(datos.table);
            }

                        ObjtablePacientesRn.fnClearTable();
                if (!isEmpty(datos.lstPacientes.table)) {
                    if (datos.lstPacientes.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.lstPacientes.table);
                    }
                }

                if (!isEmpty(datos.lstPacientesAnt.table)) {
                    if (datos.lstPacientesAnt.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.lstPacientesAnt.table);
                    }
                }*/
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListarPacientesRegistroRN() {
        var Recurso
        //Recurso = $("#lstRnHospitalizados").data('source');
        Cargando(1);
        var midata = new FormData();
        //midata.append('NroCuenta', $("#txtNroCuentaFiltro").val());
        //midata.append('NroDocumento', $("#txtDniFiltro").val());
        //midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
        //midata.append('idTipoServicio', $("#txtApPaternoFiltro").val());
        //midata.append('FechaAtencion', $("#txtFechaFiltro").val());
        //midata.append('idGrupo', $("#idGrupo").val());
        //var dat 
        ///midata.append('FechaAtencion', $("#txtFechaNacFiltro").val());
        midata.append('FechaFiltro', isNull($("#txtFechaNacFiltro").val(), '1/1/0001'));
        midata.append('TipoFecha', 1);
        midata.append('NroCuenta', isNull($("#txtNroCuentaNacFiltro").val(), 0));
        midata.append('NroHistoria', isNull($("#txtNroHistoriaNacFiltro").val(), 0));
        midata.append('AnioNac', $("#txtAnioNacFiltro").val());
        midata.append('NroDocumento', $("#txtDniNacFiltro").val());
        midata.append('ApPaterno', $("#txtApPaternoNacFiltro").val());
        midata.append('ApMaterno', $("#txtApMaternoNacFiltro").val());
        midata.append('NroDocumentoMadre', $("#txtDniMadreNacFiltro").val());
        midata.append('idGrupo', 0);

        ObjtablePacientesRn.fnClearTable();
        ObjtablePacientesLibroNac.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/RecienNacido/ListarPacientesRegistroRecienNacido?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtablePacientesRn.fnAddData(datos.table);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    ListarPacientesLibroNacimiento() {
        //var Recurso
        //Recurso = $("#lstRnHospitalizados").data('source');
        Cargando(1);
        var midata = new FormData();

        midata.append('NroLibro', $("#txtLibroFiltro").val());
        midata.append('NroFolio', $("#txtFolioFiltro").val());
        midata.append('NroAnio', $("#txtAnioFiltro").val());
        midata.append('NroMes', $("#txtMesFiltro").val());
        midata.append('NroHistoriaMadre', '');
        midata.append('ApPaternoMadre', $("#txtApPaternoMadreFiltro").val());
        midata.append('FechaNacimiento', $("#txtFechaFiltro").val());

        ObjtablePacientesRn.fnClearTable();
        ObjtablePacientesLibroNac.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/LibroNacimiento/ListarPacientesRegistroLibroNacimiento?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)                
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtablePacientesLibroNac.fnAddData(datos.table);
                    }
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    async SeleccionarSolicitud(idSolicitud) {
        resp = null;
        var midata = new FormData();
        midata.append('idSolicitud', idSolicitud);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/SolicitudConstanciasRN/SeleccionarSolicitudRn?area=Estadistica",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (!isEmpty(datos.lstConstancias.table)) {
                    resp = datos.lstConstancias.table[0];
                }
            } else {
                location.reload();
            }
        } catch (error) {
            alerta2('danger', '', error);
        }

        return resp;
    },

   AceptarPaciente() {
       var objrow = ObjtablePacientesRn.api(true).row('.selected').data();
       var objrow2 = ObjtablePacientesLibroNac.api(true).row('.selected').data();

       if (isEmpty(objrow) && isEmpty(objrow2)) {
           alerta2('info', '', "Debe seleccionar el paciente.");
           return false;
       } else {           
           if (!isEmpty(objrow)) {
               this.idRegistroRN = objrow.idRegistroRN;
               this.CargarDatosRecienNacido(objrow);
               this.tipoBusqueda = 'paciente';
           } 

           if (!isEmpty(objrow2)) {
               this.idRegistroRN = objrow2.idRegistroRN;
               this.CargarDatosLibroNacimiento(objrow2);
               this.tipoBusqueda = 'libronac';
           }
       }
    },

    CargarDatosRecienNacido(objrow) {
        if (objrow.bActivo == 0) {
            alerta2('info', '', "No hay datos para mostrar. Por favor actualizar el Registro de Nacimiento del Paciente.");
            return false;
        }
        //console.log(objrow);        
        SolicitudConstanciaRn.anio = objrow.fecNac.substring(6, 10);
        SolicitudConstanciaRn.idRegistroRN = objrow.idRecienNacido;
        if (objrow.tabla == 'SISGALEN') {
            SolicitudConstanciaRn.base = 1;
        } else if (objrow.tabla == 'CEOB_REGCNV') {
            SolicitudConstanciaRn.base = 2;
        } else if (objrow.tabla == 'S_NEONATO') {
            SolicitudConstanciaRn.base = 3;
        } else if (objrow.tabla == 'LIBRO_NAC') {
            SolicitudConstanciaRn.base = 4;
        }


        $("#txtNroAsiento").val(objrow.nroAsiento);
        $("#txtNroFolio").val(objrow.nroFolio);

        $("#txtNroHistoria").val(objrow.historiaMadre);
        $("#txtNombre").val(objrow.nombresMadre);
        $("#txtApPaterno").val(objrow.apPaternoMadre);
        $("#txtApMaterno").val(objrow.apMaternoMadre);

        //$("#cboTipoDocumento").val(objrow.idDocIdentidadMadre);
        //$("#cboTipoDocumento").trigger("chosen:updated");
        $("#txtTipoDocumento").val(objrow.tipoDocIdentidadMadre);
        $("#txtNroIdentidad").val(objrow.docMadre);
        $("#txtDireccion").val(objrow.direccionDomicilioMadre);
        $("#txtEdad").val(objrow.edadMadre != '' ? (objrow.edadMadre + ' años') : '');
        $("#txtNacionalidad").val(objrow.nacionalidadMadre);
        $("#txtResidencia").val(objrow.departamentoMadre + ' / ' + objrow.provinciaMadre + ' / ' + objrow.distritoMadre);

        $("#txtNombrePadre").val(objrow.nombresPadre);
        $("#txtApPaternoPadre").val(objrow.apPaternoPadre);
        $("#txtApMaternoPadre").val(objrow.apMaternoPadre);

        $("#txtCnv").val(objrow.nroDocumento);
        $("#txtFechaNac").val(objrow.fecNac);
        $("#txtHoraNac").val(objrow.horaNac);
        $("#txtSexoPac").val(objrow.sexo);
        $("#txtPesoPac").val(objrow.peso);
        $("#txtTallaPac").val(objrow.talla);
        //$("#txtNroHijo").val(objrow.nroOrdenHijo);   
        $("#txtEdadGestacional").val(objrow.edadGestacional != '' ? (objrow.edadGestacional + ' semanas') : '');
        $("#txtTipoParto").val(objrow.tipoParto);
        $("#txtProducto").val(objrow.producto);
        $("#txtCondicion").val(objrow.condicion);

        //$("#txtTipoParto").val(objPaciente.idTipoParto);
        //$("#cboTipoParto").val(objrow.idTipoParto);
        //$("#cboTipoParto").trigger("chosen:updated");


        $('#modalBuscarPaciente').modal('hide');
    },

    CargarDatosPaciente(objrow) {
        if (objrow.bActivo == 0) {
            alerta(2, "No hay datos para mostrar. Por favor actualizar el Registro de Nacimiento del Paciente.");
            return false;
        }

        //if (isEmpty(objrow.historiaMadre)) { alerta(2, "Asegurese de actualizar el número de historia de la madre en su historia."); return false; }
        //if (isEmpty(objrow.apPaternoMadre)) { alerta(2, "Asegurese de actualizar el apellido paterno de la madre en su historia."); return false; }
        //if (isEmpty(objrow.apMaternoMadre)) { alerta(2, "Asegurese de actualizar el apellido materno de la madre en su historia."); return false; }
        //if (isEmpty(objrow.nombresMadre)) { alerta(2, "Asegurese de actualizar los nombres de la madre en su historia."); return false; }
        //if (isEmpty(objrow.idDocIdentidadMadre)) { alerta(2, "Asegurese de actualizar el tipo de documento de la madre en su historia."); return false; }
        //if (isEmpty(objrow.docMadre)) { alerta(2, "Asegurese de actualizar número de documento de la madre en su historia."); return false; }
        //if (isEmpty(objrow.edadMadre)) { alerta(2, "Asegurese de actualizar  de la madre en su historia."); return false; }
        //if (isEmpty(objrow.departamentoMadre)) { alerta(2, "Asegurese de actualizar el departamento de la madre en su historia."); return false; }
        //if (isEmpty(objrow.provinciaMadre)) { alerta(2, "Asegurese de actualizar la provincia de la madre en su historia."); return false; }
        //if (isEmpty(objrow.distritoMadre)) { alerta(2, "Asegurese de actualizar el distrito de la madre en su historia."); return false; }
        //if (isEmpty(objrow.direccionDomicilioMadre)) { alerta(2, "Asegurese de actualizar la direción de la madre en su historia."); return false; }
        //if (isEmpty(objrow.fecNac)) { alerta(2, "Asegurese de actualizar la fecha de nacimiento del paciente."); return false; }
        //if (isEmpty(objrow.horaNac)) { alerta(2, "Asegurese de actualizar la hora de nacimiento del paciente."); return false; }
        //if (isEmpty(objrow.sexo)) { alerta(2, "Asegurese de actualizar el sexo del paciente."); return false; }
        //if (isEmpty(objrow.nroOrdenHijo)) { alerta(2, "Asegurese de actualizar el orden de hijo del paciente."); return false; }
               
        //if (objrow.idDocIdentidad != 1 && objrow.idDocIdentidad != 7) {
        //    alerta(2, "Por favor actualice el Tipo de Documento y Nro de Documento del paciente. Solo se aceptan DNI o CIU.");
        //    return false;
        //}


        //var anio = new Date(objrow.fecNac).getFullYear();
        var anio = objrow.fecNac.substring(6, 10);
        $("#hdnAnio").val(anio);
        $("#hdnIdPaciente").val(objrow.idPaciente);
        $("#hdnNroHistoria").val(objrow.nroHistoriaClinica);
        if (objrow.tabla == 'SISGALEN') {
            $("#hdnBd").val('1');
        } else if (objrow.tabla == 'CEOB_REGCNV') {
            $("#hdnBd").val('2');
        } else if (objrow.tabla == 'S_NEONATO') {
            $("#hdnBd").val('3');
        } else if (objrow.tabla == 'LIBRO_NAC') {
            $("#hdnBd").val('4');
        }

        var midata = new FormData();
        /*midata.append('Anio', $("#hdnAnio").val());
        midata.append('IdPaciente', $("#hdnIdPaciente").val());
        midata.append('NroHistoria', $("#hdnNroHistoria").val());
        midata.append('bd', $("#hdnBd").val());*/

        midata.append('idCuentaAtencion', objrow.nroCuenta);
        midata.append('idRegistroRn', objrow.idRegistroRN);
        midata.append('tabla', objrow.tabla);

        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/RecienNacido/SeleccionarRegistroRN?area=Hospitalizacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        var objPaciente = datos.table[0];
                        //if (objPaciente.idTipoParto == '' || objPaciente.idTipoParto == null) {
                        if (isEmpty(objPaciente.idTipoParto)) {
                            alerta(2, "Por favor actualice el tipo de parto en el Registro de Nacimiento del paciente.");
                            Cargando(0)
                            return false;
                        }

                        $("#txtNroHistoria").val(objrow.historiaMadre);
                        $("#txtNombre").val(objrow.nombresMadre);
                        $("#txtApPaterno").val(objrow.apPaternoMadre);
                        $("#txtApMaterno").val(objrow.apMaternoMadre);
                        //$("#txtDocIdentidad").val(objrow.idDocIdentidadMadre);
                        $("#cboTipoDocumento").val(objrow.idDocIdentidadMadre);
                        $("#cboTipoDocumento").trigger("chosen:updated");
                        $("#txtNroIdentidad").val(objrow.docMadre);
                        $("#txtDireccion").val(objrow.direccionDomicilioMadre);
                        // $("#txtEstadoCivil").val(objPaciente.estadoCivil);
                        $("#txtEdad").val(objrow.edadMadre);
                        $("#txtResidencia").val(objrow.departamentoMadre + '/' + objrow.provinciaMadre + '/' + objrow.distritoMadre);

                        $("#txtFecNac").val(objrow.fecNac);
                        $("#txtHoraNac").val(objrow.horaNac);
                        $("#txtSexoPac").val(objrow.sexo);
                        $("#txtPesoPac").val(objPaciente.peso);
                        //$("#txtTipoParto").val(objPaciente.idTipoParto);
                        $("#cboTipoParto").val(objPaciente.idTipoParto);
                        $("#cboTipoParto").trigger("chosen:updated");
                        $("#txtNroHijo").val(objrow.nroOrdenHijo);

                        $('#modalBuscarPaciente').modal('hide');
                    }
                }
                Cargando(0)

            },
            error: function (msg) {
                Cargando(0)
            }
        })
    },

    CargarDatosLibroNacimiento(objrow) {
        var anio = objrow.fecNac.substring(6, 10);
        $("#hdnAnio").val(anio);
        $("#hdnIdPaciente").val(0);
        $("#hdnNroHistoria").val(0);
        $("#hdnBd").val('4');           //TABLA: LibroNacimientos
        SolicitudConstanciaRn.base = 4;

        $("#txtNombre").val(objrow.nombresMadre);
        $("#txtApPaterno").val(objrow.apPaternoMadre);
        $("#txtApMaterno").val(objrow.apMaternoMadre);
        $("#cboTipoDocumento").val(objrow.idDocIdentidadMadre);
        $("#cboTipoDocumento").trigger("chosen:updated");
        $("#txtNroIdentidad").val(objrow.docMadre);
        $("#txtEdad").val(objrow.edadMadre);        
        $("#txtDireccion").val(objrow.direccionDomicilioMadre);
        $("#txtResidencia").val(objrow.lugarNacimientoMadre);

        $("#txtFecNac").val(objrow.fecNac);
        $("#txtHoraNac").val(objrow.horaNac);
        $("#txtSexoPac").val(objrow.sexo);
        $("#txtPesoPac").val(objrow.peso);
        $("#txtNroHijo").val(objrow.nroEmbarazoMadre);
        //$("#txtTipoParto").val(objPaciente.idTipoParto);
        //$("#cboTipoParto").val(objrow.idTipoGestacion);
        //$("#cboTipoParto").trigger("chosen:updated");

        $('#modalBuscarPaciente').modal('hide');
    },

    LlenarCombos() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposDocumentos?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoDocumento').empty();
                $('#cboTipoDocMadre').empty();
                $(datos.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocumento').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                    $('#cboTipoDocMadre').append('<option  value="' + obj.idDocIdentidad + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar los tipos de documentos!", "2");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/EvaluacionRN/ListarTipoPartoRn?area=Hospitalizacion",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboTipoParto').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoParto').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar los tipos de parto!", "2");
                }, 900)
            }
        });

       $.ajax({
           async: false,
           cache: false,
           url: "/ConstanciasRN/ListarTiposSolicitante?area=Estadistica",
           datatype: "json",
           type: "get",
           success: function (datos) {
               $('#cboSolicitante').empty();
               $(datos.table).each(function (i, obj) {
                   $('#cboSolicitante').append('<option  value="' + obj.idTipoSolicitante + '">' + obj.descripcion + '</option>');
               });
           },
           error: function (msg) {
               setTimeout(function () {
                   alerta("ERROR", "Error listar tipos de solicitante!", "2");
               }, 900)
           }
       });

        $.ajax({
            async: false,
            cache: false,
            url: "/SolicitudConstanciasRN/ListarEstadosSolicitud?area=Estadistica",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboEstadoSolicitud').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboEstadoSolicitud').append('<option  value="' + obj.idEstadoSolicitud + '">' + obj.descripcion + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar estados!", "2");
                }, 900)
            }
        });
              
       $.ajax({
           async: false,
           cache: false,
           url: "/ConstanciasRN/ListarTiposDocumento?area=Estadistica",
           datatype: "json",
           type: "get",
           success: function (datos) {
               $('#cboTipoDoc').empty();
               $(datos.table).each(function (i, obj) {
                   $('#cboTipoDoc').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
               });
               $('#cboTipoDoc').append('<option  value="20">Hoja de Trámite</option>');
           },
           error: function (msg) {
               setTimeout(function () {
                   alerta("ERROR", "Error listar médicos!", "2");
               }, 900)
           }
       });

       //if (bAprobar) {
       //    $('#cboEstadoSolicitud').val(1);
       //}
        
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });
    },

    ValidaComprobante() {
        var midata = new FormData();
        midata.append('NroCorrelativo', $("#txtNroCorrelativo").val());
        midata.append('NroDocumento', $("#txtNroDocumento").val());
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/ValidarComprobantedePago?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.rsp > 0) {
                    alerta(1, datos.mensaje);
                } else {
                    $("#txtNroCorrelativo").focus();
                    alerta(3, datos.mensaje);
                }
            },
            error: function (msg) {
                console.log(msg);
                Cargando(0)
            }
        });
    },

    LimpiarConstanciaNacimiento() {
        $("#hdnAnio").val("");
        $("#hdnIdPaciente").val("");
        $("#hdnNroHistoria").val("");
        $("#hdnBd").val("");

        $("#txtNroAsiento").val("");
        $("#txtNroFolio").val("");

        $("#txtNroHistoria").val("");
        $("#txtNombre").val("");
        $("#txtApPaterno").val("");
        $("#txtApMaterno").val("");
        $("#txtDocIdentidad").val("");
        $("#txtTipoDocumento").val("");
        $("#txtNroIdentidad").val("");
        $("#txtEdad").val("");
        $("#txtNacionalidad").val("");
        $("#txtResidencia").val("");
        $("#txtDireccion").val("");

        $("#txtNombrePadre").val("");
        $("#txtApPaternoPadre").val("");
        $("#txtApMaternoPadre").val("");

        $("#txtCnv").val("");
        $("#txtFechaNac").val("");
        $("#txtHoraNac").val("");
        $("#txtSexoPac").val("");
        $("#txtPesoPac").val("");
        $("#txtTallaPac").val("");
        $("#txtEdadGestacional").val("");
        $("#txtTipoParto").val("");
        $("#txtProducto").val("");
        $("#txtCondicion").val("");

        $("#cboSolicitante").val("");
        $("#cboTipoDoc").val("");
        $("#txtDocumentoSol").val("");
        $("#txtNroTramite").val("");
        $("#txtComentario").val("");
        $('.chzn-select').chosen().trigger("chosen:updated");

    },

    LimpiarFiltrosBusquedaPaciente() {

        //$("#txtAnioNacFiltro").val("");
        //$("#txtApNomFiltro").val("");
        //$("#txtNroHistoriaNacFiltro").val("");
        //$("#txtFechaNacFiltro").datepicker("setDate", FechaDia);
        //$("#txtDniNacFiltro").val("");
        //$("#txtNroHistoriaNacFiltro").val("");
        //$("#txtApPaternoNacFiltro").val("");
        //$("#txtDniMadreNacFiltro").val("");
        $(".searchPaciente, .searchLibroNac").val("");
        //$("#txtFechaNacFiltro, #txtFechaNacLibroNacFiltro").datepicker("setDate", FechaDia);
        ObjtablePacientesRn.fnClearTable();
        ObjtablePacientesLibroNac.fnClearTable();
    },

    LimpiarFiltrosBusqueda() {
        $("#txtNroConstanciaFiltro").val("");
        $("#txtNroDocumentoFiltro").val("");
        $("#txtNroCorrelativoFiltro").val("");
        $("#txtNroHistoriaFiltro").val("");
        $("#txtFechaFiltro").datepicker("setDate", FechaDia);
        //SolicitudConstanciaRn.ListarSolicitudes();
    },

    GuardarConstancia() {
        if (SolicitudConstanciaRn.ValidarCampos() == false) {
            return;
        }

        Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", SolicitudConstanciaRn.idConstancia);
        midata.append("idRegistroRn", SolicitudConstanciaRn.idRegistroRN);
        midata.append("Anio", SolicitudConstanciaRn.anio);
        midata.append("NroHistoria", 0);
        midata.append("Base", SolicitudConstanciaRn.base);

        midata.append("idSolicitante", $("#cboSolicitante").val());
        midata.append("idTipoDocSolicitante", $("#cboTipoDoc").val());
        midata.append("NroDocSolicitante", $("#txtDocumentoSol").val());
        midata.append("NroDocumento", $("#txtNroTramite").val());
        midata.append("Comentario", $("#txtComentario").val());

        $.ajax({
            method: "POST",
            url: "/SolicitudConstanciasRN/GuardarSolicitudRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        alerta(1, datos.mensaje);
                        SolicitudConstanciaRn.cerrarModal();
                        SolicitudConstanciaRn.ListarSolicitudes();
                        
                        Cargando(0);                      
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }
                
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return false;
    },

    //AprobarSolicitud_backup() {
    //    //var midata = new FormData();
    //    SolicitudConstanciaRn.LimpiarConstanciaNacimiento();
    //    var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();
    //    console.log(objrow);             

    //    if (isEmpty(objrow)) {
    //        alerta(2, "Debe seleccionar algun registro.");
    //        return false;
    //    }

    //    if (objrow.idEstadoSolicitud == 2) {
    //        alerta(2, "No se puede modificar el estado, la constancia ya fue aprobada.");
    //        return false;
    //    }

    //    if (objrow.idEstadoSolicitud == 3) {
    //        alerta(2, "No se puede modificar el estado, la constancia ya fue rechazada.");
    //        return false;
    //    }

    //    //if (objrow.idEstadoSolicitud == 4) {
    //    //    alerta(2, "No se puede modificar el estado, la constancia ya fue generado.");
    //    //    return false;
    //    //}

      
    //    $("#hdnIdConstanciaAprob").val(objrow.idSolicitud);

    //    $("#txtNroHistoria").val(objrow.historiaMadre);
    //    $("#txtNombre").val(objrow.nombresMadre);
    //    $("#txtApPaterno").val(objrow.apPaternoMadre);
    //    $("#txtApMaterno").val(objrow.apMaternoMadre);
    //    //$("#txtDocIdentidad").val(objrow.idDocIdentidadMadre);
    //    $("#cboTipoDocumento").val(objrow.tipoDocMadre);
    //    $("#cboTipoDocumento").trigger("chosen:updated");
    //    $("#txtNroIdentidad").val(objrow.nroDocumentoMadre);
    //    $("#txtDireccion").val(objrow.direccionMadre);
    //    // $("#txtEstadoCivil").val(objPaciente.estadoCivil);
    //    $("#txtEdad").val(objrow.edadMadre);
    //    //$("#txtResidencia").val(objrow.departamentoMadre + '/' + objrow.provinciaMadre + '/' + objrow.distritoMadre);
    //    $("#txtResidencia").val(objrow.residenciaActual);


    //    $("#txtFecNac").val(objrow.fechaNacimiento);
    //    $("#txtHoraNac").val(objrow.horaNacimiento);
    //    $("#txtSexoPac").val(objrow.sexo);
    //    $("#txtPesoPac").val(objrow.peso);
    //    //$("#txtTipoParto").val(objPaciente.idTipoParto);
    //    $("#cboTipoParto").val(objrow.idTipoParto);
    //    $("#cboTipoParto").trigger("chosen:updated");
    //    $("#txtNroHijo").val(objrow.nroHijo);
    //    $("#txtComentario").val(objrow.comentario);
    //    $("#txtDocumentoSol").val(objrow.nroDocSolicitante);
    //    $("#txtNroTramite").val(objrow.documento);


    //    //$("#lblNroSolicitud").text(objrow.documento);
    //    $("#btnBuscarPaciente").hide();
    //    $("#cboSolicitante").val(objrow.idSolicitante);
    //    $("#cboSolicitante").prop("disabled", true);
    //    $("#cboSolicitante").trigger("chosen:updated");
    //    $("#cboTipoDoc").val(objrow.idTipoDocSolicitante);
    //    $("#cboTipoDoc").prop("disabled", true);
    //    $("#cboTipoDoc").trigger("chosen:updated");
    //    $("#txtDocumentoSol").prop("disabled", true);
    //    $("#txtNroTramite").prop("disabled", true);
    //    $("#txtComentario").prop("disabled", true);
    //    $("#btnAprobacion").show();
    //    $("#btnAprobar").show();
    //    $("#btnRechazar").show();
    //    $("#btnGuardar").hide();


    //    $("#modalHeader").removeClass("bg-success");
    //    $("#modalHeader").addClass("bg-primary");        

    //    $("#txtComentarioAprob").val("");
    //    $("#txtComentarioAprob").prop("disabled", false);
    //    $("#lblNroSolicitud").text("Aprobación de la Solicitud N° " + $("#hdnIdConstanciaAprob").val());
    //    $("#txtdescripciontramite").text("N° Tramite: " + objrow.documento + "");
    //    $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");

    //    $('#modalSolicitudConstanciaRn').modal('show');
    //    //$('#modalAprobarSolicitud').modal('show');    
        

    //},

    async AprobarSolicitud(){
        SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

        var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta2('info', '', "Debe seleccionar algun registro.");
            return false;
        }

        if (objrow.idEstadoSolicitud == 0) {
            alerta2("info", "", "La solicitud ha sido eliminada por motivo: \n" + objrow.motivoBaja);
            return false;
        }

        const solicitud = await SolicitudConstanciaRn.SeleccionarSolicitud(objrow.idSolicitud);
        console.log(solicitud);

        SolicitudConstanciaRn.idSolicitud = solicitud.idSolicitud;
        SolicitudConstanciaRn.idRegistroRN = solicitud.idRecienNacido;
        SolicitudConstanciaRn.anio = solicitud.anio;
        SolicitudConstanciaRn.base = solicitud.base;

        $("#txtNroAsiento").val(solicitud.nroAsiento);
        $("#txtNroFolio").val(solicitud.nroFolio);

        $("#txtNroHistoria").val(solicitud.historiaMadre);
        $("#txtNombre").val(solicitud.nombresMadre);
        $("#txtApPaterno").val(solicitud.apPaternoMadre);
        $("#txtApMaterno").val(solicitud.apMaternoMadre);

        $("#txtTipoDocumento").val(solicitud.tipoDocIdentidadMadre);
        $("#txtNroIdentidad").val(solicitud.docMadre);
        $("#txtDireccion").val(solicitud.direccionDomicilioMadre);
        $("#txtEdad").val(solicitud.edadMadre != '' ? (solicitud.edadMadre + ' años') : '');
        $("#txtNacionalidad").val(solicitud.nacionalidadMadre);
        $("#txtResidencia").val(solicitud.departamentoMadre + ' / ' + solicitud.provinciaMadre + ' / ' + solicitud.distritoMadre);

        $("#txtNombrePadre").val(solicitud.nombresPadre);
        $("#txtApPaternoPadre").val(solicitud.apPaternoPadre);
        $("#txtApMaternoPadre").val(solicitud.apMaternoPadre);

        $("#txtCnv").val(solicitud.nroDocumento);
        $("#txtFechaNac").val(solicitud.fechaNac);
        $("#txtHoraNac").val(solicitud.horaNac);
        $("#txtSexoPac").val(solicitud.sexo);
        $("#txtPesoPac").val(solicitud.peso);
        $("#txtTallaPac").val(solicitud.talla);
        //$("#txtNroHijo").val(objrow.nroOrdenHijo);   
        $("#txtEdadGestacional").val(solicitud.edadGestacional != '' ? (solicitud.edadGestacional + ' semanas') : '');
        $("#txtTipoParto").val(solicitud.tipoParto);
        $("#txtProducto").val(solicitud.producto);
        $("#txtCondicion").val(solicitud.condicion);


        //$("#lblNroSolicitud").text(objrow.documento);        
        $("#cboSolicitante").val(solicitud.idSolicitante);
        $("#cboSolicitante").prop("disabled", true);
        $("#cboSolicitante").trigger("chosen:updated");

        $("#cboTipoDoc").val(solicitud.idTipoDocSolicitante);
        $("#cboTipoDoc").prop("disabled", true);
        $("#cboTipoDoc").trigger("chosen:updated");

        $("#txtDocumentoSol").val(solicitud.nroDocSolicitante);
        $("#txtDocumentoSol").prop("disabled", true);

        $("#txtNroTramite").val(solicitud.nroDocumento);
        $("#txtNroTramite").prop("disabled", true);

        $("#txtComentario").val(solicitud.comentario);
        $("#txtComentario").prop("disabled", true);

        $("#btnBuscarPaciente").hide();
        $("#btnAprobacion").show();
        $("#btnAprobar").show();
        $("#btnRechazar").show();
        $("#btnGuardar").hide();


        $("#modalHeader").removeClass("bg-success");
        $("#modalHeader").addClass("bg-primary");

        $("#txtComentarioAprob").val("");
        $("#txtComentarioAprob").prop("disabled", false);
        $("#lblNroSolicitud").text("Aprobación de la Solicitud N° " + solicitud.idSolicitud);
        $("#txtdescripciontramite").text("N° Tramite: " + solicitud.nroDocumento + "");
        $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");

        $('#modalSolicitudConstanciaRn').modal('show');

    },



    async RegistroAprobacion(Respuesta) {

        SolicitudConstanciaRn.tipoRolPermiso = await Utilitario.ValidarPermiso(800);
        if (!SolicitudConstanciaRn.tipoRolPermiso) {
            alerta2('info', '', 'Usted no tiene permiso aprobar solicitudes de Constancias de Nacimiento.');
            return false;
        }

        var  mensaje = "";
        if (Respuesta) {
            mensaje = "Esta seguro de <strong style = 'font-weight: 900;' class='text-success'>APROBAR</strong> la <strong style = 'font-weight: 900;'>Solicitud N°. " + SolicitudConstanciaRn.idSolicitud + "</strong>";
        }
        else {
            mensaje = "Esta seguro de <strong style = 'font-weight: 900;' class='text-danger'>RECHAZAR</strong> la <strong style = 'font-weight: 900;'>Solicitud N°. " + SolicitudConstanciaRn.idSolicitud + "</strong>";
        }
        swal({
            title: 'Mensaje',
            text: mensaje,
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async function () {            
            
            Cargando(1);
            var formData = new FormData();
            let datos;
            try {                
                formData.append("idSolicitud", SolicitudConstanciaRn.idSolicitud);
                formData.append("bAprobado", Respuesta);
                formData.append("Comentario", $("#txtComentarioAprob").val());
                datos = await
                $.ajax({
                    method: "POST",
                    url: "/SolicitudConstanciasRN/RegistrarRespuestaSolicitudRn?area=Estadistica",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
                Cargando(0);
                if (datos.respuesta) {
                    respuesta = true;
                    if (Respuesta) {
                        alerta2('success', '', 'Los datos y la constancia fueron generados correctamente.');
                    } else {
                        alerta2('warning', '', 'La solicitud ha sido rechazada. Los datos se guardaron correctamente.');
                    }  
                    SolicitudConstanciaRn.cerrarModal();
                    SolicitudConstanciaRn.ListarSolicitudes();
                }
                //if (datos) {
                //    var EvaDetneo = EvaluacionEmergencia.SeleccionarEvaluacionDetalleNeonatal(idAtencion);
                //    alerta(1, 'La Hoja de Evaluación se actualizó correctamente.');
                //} else {
                //    alerta(3, 'Hubo un error durante la creación de la Hoja de Evaluación');
                //}
            } catch (error) {
                //console.error(error)
                alerta2('error', '', error);
            }


            //$.ajax({
            //    method: "POST",
            //    url: "/SolicitudConstanciasRN/RegistrarRespuestaSolicitudRn?area=Estadistica",
            //    data: midata,
            //    dataType: "json",
            //    processData: false,
            //    contentType: false,
            //    success: function (datos) {

            //        Cargando(0);
            //        if (datos.session) {
            //            if (datos.respuesta) {
            //                var idContancia = datos.respuesta;
            //                //SolicitudConstanciaRn.GenerarConstancia(idContancia);
            //                //Utilitario.GenerarConstanciaNacimiento(idContancia);

            //                //console.log("ID CONSTANCIA" + datos.respuesta);
            //                //alerta(1, datos.mensaje);
            //                //SolicitudConstanciaRn.cerrarModal();
            //                //SolicitudConstanciaRn.ListarSolicitudes();

            //                //Cargando(0);
            //            } else {
            //                Cargando(0);
            //                alerta(1, datos.mensaje);
            //            }
            //        } else {
            //            location.reload();
            //        }

            //        SolicitudConstanciaRn.cerrarModal();
            //        SolicitudConstanciaRn.ListarSolicitudes();
            //    },
            //    error: function (msg) {
            //        Cargando(0)
            //    }
            //});

        });

        

    },

    AgregarSolicitudConstanciaRn() {
        SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

        $("#modalHeader").removeClass("bg-primary");
        $("#modalHeader").addClass("bg-success");
        $("#btnAprobar").hide();
        $("#btnRechazar").hide();
        $("#btnGuardar").show();
        $("#txtComentarioAprob").val("");
        $("#ComentarioAprobacion").hide();
        $("#txtdescripcion").text("");
        $("#lblNroSolicitud").text("");
        $("#txtdescripcion").hide();
        $("#lblNroSolicitud").hide();
        $("#DatosSolicitud").hide();
        $("#btnBuscarPaciente").show();

        $("#cboSolicitante").prop("disabled", false);
        $("#cboSolicitante").trigger("chosen:updated");
        $("#cboTipoDoc").prop("disabled", false);
        $("#cboTipoDoc").trigger("chosen:updated");
        $("#txtDocumentoSol").prop("disabled", false);
        $("#txtNroTramite").prop("disabled", false);
        $("#txtComentario").prop("disabled", false);

        $('#modalSolicitudConstanciaRn').modal('show');
    },

    async ConsultarConstanciaRn() {
        //var midata = new FormData();
        SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

        var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();

        if (isEmpty(objrow)) {
            alerta2('info', '', "Debe seleccionar algun registro.");
            return false;
        }

        if (objrow.idEstadoSolicitud == 0) {
            alerta2("info", "", "La solicitud ha sido eliminada por motivo: \n" + objrow.motivoBaja);
            //return false;
        }

        const solicitud = await SolicitudConstanciaRn.SeleccionarSolicitud(objrow.idSolicitud);
        console.log(solicitud);

        SolicitudConstanciaRn.idSolicitud = solicitud.idSolicitud;
        SolicitudConstanciaRn.idRegistroRN = solicitud.idRecienNacido;
        SolicitudConstanciaRn.anio = solicitud.anio;
        SolicitudConstanciaRn.base = solicitud.base;

        $("#txtNroAsiento").val(solicitud.nroAsiento);
        $("#txtNroFolio").val(solicitud.nroFolio);

        $("#txtNroHistoria").val(solicitud.historiaMadre);
        $("#txtNombre").val(solicitud.nombresMadre);
        $("#txtApPaterno").val(solicitud.apPaternoMadre);
        $("#txtApMaterno").val(solicitud.apMaternoMadre);

        $("#txtTipoDocumento").val(solicitud.tipoDocIdentidadMadre);
        $("#txtNroIdentidad").val(solicitud.docMadre);
        $("#txtDireccion").val(solicitud.direccionDomicilioMadre);
        $("#txtEdad").val(solicitud.edadMadre != '' ? (solicitud.edadMadre + ' años') : '');
        $("#txtNacionalidad").val(solicitud.nacionalidadMadre);
        $("#txtResidencia").val(solicitud.departamentoMadre + ' / ' + solicitud.provinciaMadre + ' / ' + solicitud.distritoMadre);

        $("#txtNombrePadre").val(solicitud.nombresPadre);
        $("#txtApPaternoPadre").val(solicitud.apPaternoPadre);
        $("#txtApMaternoPadre").val(solicitud.apMaternoPadre);

        $("#txtCnv").val(solicitud.nroDocumento);
        $("#txtFechaNac").val(solicitud.fechaNac);
        $("#txtHoraNac").val(solicitud.horaNac);
        $("#txtSexoPac").val(solicitud.sexo);
        $("#txtPesoPac").val(solicitud.peso);
        $("#txtTallaPac").val(solicitud.talla);
        //$("#txtNroHijo").val(objrow.nroOrdenHijo);   
        $("#txtEdadGestacional").val(solicitud.edadGestacional != '' ? (solicitud.edadGestacional + ' semanas') : '');
        $("#txtTipoParto").val(solicitud.tipoParto);
        $("#txtProducto").val(solicitud.producto);
        $("#txtCondicion").val(solicitud.condicion);
                
        
        $("#cboSolicitante").val(solicitud.idSolicitante);
        $("#cboSolicitante").prop("disabled", true);
        $("#cboSolicitante").trigger("chosen:updated");

        $("#cboTipoDoc").val(solicitud.idTipoDocSolicitante);
        $("#cboTipoDoc").prop("disabled", true);
        $("#cboTipoDoc").trigger("chosen:updated");

        $("#txtDocumentoSol").val(solicitud.nroDocSolicitante);
        $("#txtDocumentoSol").prop("disabled", true);

        //$("#txtDocumentoSol").prop("disabled", true);        
        $("#txtNroTramite").val(solicitud.nroDocumento);
        $("#txtNroTramite").prop("disabled", true);

        $("#txtComentario").val(solicitud.comentario);
        $("#txtComentario").prop("disabled", true);

        $("#btnBuscarPaciente").hide();
        $("#btnAprobacion").show();
        $("#btnAprobar").hide();
        $("#btnRechazar").hide();
        $("#btnGuardar").hide();
        $("#DatosSolicitud").show();
        $("#ComentarioAprobacion").show();

        $("#txtComentarioAprob").val(solicitud.comentarioAprobacion);
        $("#txtComentarioAprob").prop("disabled", true);

        $("#modalHeader").removeClass("bg-success");
        $("#modalHeader").addClass("bg-primary");

        $("#lblNroSolicitud").text("Solicitud N° " + solicitud.idSolicitud);
        $("#lblNroSolicitud").show();
        $("#txtdescripciontramite").text("N° Tramite: " + solicitud.nroDocumento + "");
        $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");

        $('#modalSolicitudConstanciaRn').modal('show');
        
    },

    //ConsultarConstancia() {        
    //    //var midata = new FormData();
    //    SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

    //    var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();
    //    console.log(objrow);

    //    if (isEmpty(objrow)) {
    //        alerta(2, "Debe seleccionar algun registro.");
    //        return false;
    //    }


    //    $("#hdnIdConstanciaAprob").val(objrow.idSolicitud);

    //    $("#txtNroHistoria").val(objrow.historiaMadre);
    //    $("#txtNombre").val(objrow.nombresMadre);
    //    $("#txtApPaterno").val(objrow.apPaternoMadre);
    //    $("#txtApMaterno").val(objrow.apMaternoMadre);
    //    //$("#txtDocIdentidad").val(objrow.idDocIdentidadMadre);
    //    $("#cboTipoDocumento").val(objrow.tipoDocMadre);
    //    $("#cboTipoDocumento").trigger("chosen:updated");
    //    $("#txtNroIdentidad").val(objrow.nroDocumentoMadre);
    //    $("#txtDireccion").val(objrow.direccionMadre);
    //    // $("#txtEstadoCivil").val(objPaciente.estadoCivil);
    //    $("#txtEdad").val(objrow.edadMadre);
    //    //$("#txtResidencia").val(objrow.departamentoMadre + '/' + objrow.provinciaMadre + '/' + objrow.distritoMadre);
    //    $("#txtResidencia").val(objrow.residenciaActual);


    //    $("#txtFecNac").val(objrow.fechaNacimiento);
    //    $("#txtHoraNac").val(objrow.horaNacimiento);
    //    $("#txtSexoPac").val(objrow.sexo);
    //    $("#txtPesoPac").val(objrow.peso);
    //    //$("#txtTipoParto").val(objPaciente.idTipoParto);
    //    $("#cboTipoParto").val(objrow.idTipoParto);
    //    $("#cboTipoParto").trigger("chosen:updated");
    //    $("#txtNroHijo").val(objrow.nroHijo);
    //    $("#txtComentario").val(objrow.comentario);
    //    $("#txtDocumentoSol").val(objrow.nroDocSolicitante);
    //    $("#txtNroTramite").val(objrow.documento);


    //    //$("#lblNroSolicitud").text(objrow.documento);
    //    $("#btnBuscarPaciente").hide();
    //    $("#cboSolicitante").val(objrow.idSolicitante);
    //    $("#cboSolicitante").prop("disabled", true);
    //    $("#cboSolicitante").trigger("chosen:updated");
    //    $("#cboTipoDoc").val(objrow.idTipoDocSolicitante);
    //    $("#cboTipoDoc").prop("disabled", true);
    //    $("#cboTipoDoc").trigger("chosen:updated");

    //    $("#txtDocumentoSol").prop("disabled", true);
    //    $("#txtNroTramite").prop("disabled", true);
    //    $("#txtComentario").prop("disabled", true);
    //    $("#btnAprobacion").show();
    //    $("#btnAprobar").hide();
    //    $("#btnRechazar").hide();
    //    $("#btnGuardar").hide();
    //    $("#DatosSolicitud").show();
    //    $("#ComentarioAprobacion").show();

        
    //    $("#txtComentarioAprob").val(objrow.comentarioAprobacion);
    //    $("#txtComentarioAprob").prop("disabled", true);

    //    $("#modalHeader").removeClass("bg-success");
    //    $("#modalHeader").addClass("bg-primary");
                
    //    $("#lblNroSolicitud").text("Solicitud N° " + $("#hdnIdConstanciaAprob").val());
    //    $("#lblNroSolicitud").show();
    //    $("#txtdescripciontramite").text("N° Tramite: " + objrow.documento + "");
    //    $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");

    //    $('#modalSolicitudConstanciaRn').modal('show');
    //    //$('#modalAprobarSolicitud').modal('show');    
                       
    //},

    EliminarSolicitudConstanciaRn() {
        SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

        var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();
        //console.log(objrow);

        if (objrow.idEstadoSolicitud == 0) {
            alerta2("info", "", "La solicitud ha sido eliminada por motivo: \n" + objrow.motivoBaja);
            return false;
        }

        if (SolicitudConstanciaRn.tipoPermiso == '0') {
            if (isEmpty(objrow)) {
                alerta2('warning', '', "Debe seleccionar algun registro.");
                return false;
            }
            
            if (objrow.idEstadoSolicitud == 2) {
                alerta2('warning', '', "No es posible eliminar una constancia ya aprobada.");
                return false;
            }

            if (objrow.idEstadoSolicitud == 3) {
                alerta2('warning', '', "No es posible eliminar una constancia ya rechazada.");
                return false;
            }

            if (objrow.idEstadoSolicitud == 4) {
                alerta2('warning', '', "No es posible eliminar una constancia ya generada.");
                return false;
            }
        }
        

        swal({
            title: 'Eliminar',
            text: 'Paciente: ' + objrow.paciente + '<br>Esta seguro de eliminar la <strong style = "font-weight: 900;">Solicitud de Constancia Nº ' + objrow.idSolicitud + ' y la Constancia N°' + objrow.idConstancia +' </strong> ? <div class="form-group mt-2"><label class="font-weight-bold">Motivo</label><textarea id="txtMotivoEliminación" class="form-control" autocomplete="off"> </textarea></div> ',
            type: 'error',
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(function () {
            Cargando(1);
            var midata = new FormData();
            midata.append("idSolicitud", objrow.idSolicitud);
            midata.append("idConstancia", objrow.idConstancia);
            midata.append("motivoEliminacion", $("#txtMotivoEliminación").val());
            $.ajax({
                method: "POST",
                url: "/SolicitudConstanciasRN/EliminarSolicitud?area=Estadistica",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (datos) {
                    Cargando(0);
                    if (datos.session) {
                        if (datos.respuesta > 0) {
                            SolicitudConstanciaRn.ListarSolicitudes();
                            alerta2("success", "", datos.mensaje);
                        } else {
                            alerta2("error", "", datos.mensaje);
                        }
                    } else {
                        location.reload();
                    }
                },
                error: function (msg) {
                    Cargando(0)
                }
            });
        }, function (dimiss) {

        });
    },

    //GenerarConstancia(idConstancia) {
    //    //Cargando(1);
    //    var midata = new FormData();
    //    midata.append("idConstancia", idConstancia);
    //    $.ajax({
    //        method: "POST",
    //        url: "/SolicitudConstanciasRN/GenerarConstanciaRn?area=Estadistica",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {
    //            Cargando(0);
    //            if (datos.session) {
    //                if (datos.respuesta == "Ok") {
    //                    alerta(1, datos.mensaje);
    //                    SolicitudConstanciaRn.cerrarModal();
    //                    SolicitudConstanciaRn.ListarSolicitudes();
    //                    //Cargando(0);
    //                    //Cargando(1);
    //                    //var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + idConstancia;
    //                    //$('#ifrmReporte').attr('src', url);
    //                } else {
    //                    alerta(3, datos.mensaje);
    //                }
    //            } else {
    //                location.reload();
    //            }

    //        },
    //        error: function (msg) {
    //            Cargando(0)
    //        }
    //    });
    //    return false;
    //},

    
    ImprimirConstanciaSF(idConstancia, firma) {
        swal({
            title: 'Mensaje',
            text: 'La Constancia Nacimiento solo se podrá <strong style="font-weight: 900;text-decoration: underline;">imprimir una sola vez</strong>. <br> ¿Esta seguro de continuar?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#6c6c6c',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
        }).then(async function () {
            try {
                var formData = new FormData();
                let datos;
                let resp;

                formData.append("idConstancia", idConstancia);

                Cargando(1);
                datos = await
                $.ajax({
                    method: "POST",
                    url: "/SolicitudConstanciasRN/ImprimirConstanciaRn?area=Estadistica",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

                Cargando(0);
                if (datos.session) {
                    if (firma.statusFirma == 0) {
                        AbrirVisorDocumento(firma.rutaArchivo, 0);
                    } else if (firma.statusFirma == 1) {
                        AbrirVisorDocumento('/4IdentitySignedFiles' + firma.rutaArchivo, 1);
                    }
                    SolicitudConstanciaRn.ListarSolicitudes();
                    //var rutaArchivo = datos.respuesta;
                    //$('#ifrmReporte').attr('src', PathServerFiles + rutaArchivo);
                    //var myIframe = document.getElementById("ifrmReporte").contentWindow;
                    //myIframe.focus();
                    //myIframe.print();
                    //return false;
                }
                else {
                    //alert("La sesion ya expiro se volvera a recargar la pagina")
                    //location.reload();
                    alerta(2, "La sesion ya expiro, por favor inicie sesión nuevamente.");
                    $("#modalLogin").modal('show');
                }
            } catch (error) {
                //console.error(error)
                Cargando(0);
                console.log('3 - cual se ejecuta primero')
                alerta(3, error);
            }




            //Cargando(1);
            //var midata = new FormData();
            //midata.append("idConstancia", idConstancia);
            //$.ajax({
            //    method: "POST",
            //    url: "/SolicitudConstanciasRN/ImprimirConstanciaRn?area=Estadistica",
            //    data: midata,
            //    dataType: "json",
            //    processData: false,
            //    contentType: false,
            //    success: function (datos) {
            //        if (datos.session) {
            //            if (datos.respuesta != "") {
            //                var rutaArchivo = datos.respuesta;
            //                $('#ifrmReporte').attr('src', rutaArchivo);
            //                var myIframe = document.getElementById("ifrmReporte").contentWindow;
            //                myIframe.focus();
            //                myIframe.print();
            //                return false;
            //                //alerta(1, datos.mensaje);
            //                //Cargando(1);
            //                //var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + idConstancia;
            //                //$('#ifrmReporte').attr('src', url);
            //            } else {
            //                //alerta(3, datos.mensaje);
            //            }
            //        } else {
            //            location.reload();
            //        }
            //        Cargando(0);
            //    },
            //    error: function (msg) {
            //        Cargando(0)
            //    }
            //});
        }, function (dimiss) {

        });

    },

    /*
    Imprimir(idConstancia) {
        Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", idConstancia);
        $.ajax({
            method: "POST",
            url: "/SolicitudConstanciasRN/ImprimirConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.respuesta != "") {
                        var rutaArchivo = datos.respuesta;
                        $('#ifrmReporte').attr('src', rutaArchivo);
                        var myIframe = document.getElementById("ifrmReporte").contentWindow;
                        myIframe.focus();
                        myIframe.print();
                        return false;
                        //alerta(1, datos.mensaje);
                        //Cargando(1);
                        //var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + idConstancia;
                        //$('#ifrmReporte').attr('src', url);
                    } else {
                        //alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }
                Cargando(0);
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return false;
    },*/

    /*
    ImprimirConstancia(idConstancia) {
        Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", idConstancia);
        $.ajax({
            method: "POST",
            url: "/SolicitudConstanciasRN/GenerarConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        alerta(1, datos.mensaje);
                        //Cargando(1);
                        //var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + idConstancia;
                        //$('#ifrmReporte').attr('src', url);
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }
                Cargando(0);
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return false;
    },
    */
    /*
    Imprimir2() {
        url = '/ConstanciasRN/18141217-C.pdf';
        $('#ifrmReporte').attr('src', url);
        var myIframe = document.getElementById("ifrmReporte").contentWindow;

        myIframe.focus();

        myIframe.print();

        return false;
        console.log("CARGADO!!!");
    }*/

};



/*
function ConsultarSolicitudConstanciaRn() {

    var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();
    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a evaluar.");
        return false;
    }
    if (objrow.idEstadoAtencion == 0) {
        alerta(2, "La cuenta se encuentra Anulada.");
        return false;
    }
    if (objrow.cantEvaluacion == 0) {
        alerta(2, "La atención seleccionada no cuenta con la evaluación.");
        return false;
    }
    $('#txtDatos').html('N°.Historia: ' + objrow.nroHistoriaClinica + ' / N°.Cuenta: ' + objrow.nroCuenta + ' / Paciente:' + objrow.paciente);
    $('#modalSolicitudConstanciaRn').modal('show');
    //asignar valores
    $('#txtFecNac').val(objrow.fecNac);
    $('#txtHoraNac').val(objrow.horaIngreso);
    $('#txtPaciente').val(objrow.paciente);
    $('#txtSexoPac').val(objrow.sexo);
    $('#txtNroHijo').val(objrow.nroOrdenHijo);
    $('#txtNombreMadre').val(objrow.madre);
    $('#txtNroDocMadre').val(objrow.docMadre);
    $('#txtNroHistoriaMadre').val(objrow.historiaMadre);
    $('#hdnIdCuentaAtencion').val(objrow.nroCuenta);
    $("#btnGuardar").hide();
    if (objrow.cantEvaluacion > 0) {
        SolicitudConstanciaRn.ObtenerConstanciaRn(objrow.nroCuenta);
    }



}*/



/*
function EliminarSolicitudConstanciaRn() {
    var objrow = ObjtableSolicitudesRn.api(true).row('.selected').data();

    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar la atencion a eliminar.");
        return false;
    }
    if (objrow.cantEvaluacion == 0) {
        alerta(2, "No se puede Eliminar, ya que no cuenta con una evaluación.");
        return false;
    }

    swal({
        title: 'Eliminar',
        text: 'Estas seguro de eliminar la Evaluación del recien nacido ' + objrow.paciente + ' con Nro cuenta: ' + objrow.nroCuenta + ' ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4fb7fe',
        cancelButtonColor: '#EF6F6C',
        confirmButtonText: 'Aceptar'
    }).then(function () {
        Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", objrow.idSolicitud);
        $.ajax({
            method: "POST",
            url: "/SolicitudConstanciasRN/EliminarSolicitud?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        alerta(2, datos.mensaje);
                    } else {
                        alerta(3, datos.mensaje);
                    }
                } else {
                    location.reload();
                }                
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    }, function (dimiss) {

    });
}*/

$(document).ready(function () {    
    SolicitudConstanciaRn.InicializarComponentesSolicitudConstanciaRn();
    SolicitudConstanciaRn.LlenarCombos();
    //SolicitudConstanciaRn.ListarSolicitudes();
    SolicitudConstanciaRn.Eventos();

    PermisoGeneral.ValidarServicioFirmaDigital();
});
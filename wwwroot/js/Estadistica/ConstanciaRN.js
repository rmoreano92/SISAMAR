var ObjtableConstanciasRn;
var ObjtablePacientesRn;
var ObjtablePacientesLibroNac;
var FechaDia;
var idAccion;
var ConstanciaRn = {
    idConstancia: 0,
    idRegistroRN: 0,
    anio: 0,
    base: 0,
    tipoRolPermiso: false,
    permisoReimprime: false,
    tipoBusqueda: '',

    async InicializarComponentesConstanciaRn() {
        ConstanciaRn.tipoRolPermiso = await Utilitario.ValidarPermiso(800);
        ConstanciaRn.permisoReimprime = await Utilitario.ValidarPermiso(801);
        $("#btnFirmaLote").hide();

        $('#modalConstanciaRn').modal({ backdrop: 'static', keyboard: false });
        $('#modalConstanciaRn').modal('hide');
        $('#modalBuscarPaciente').modal({
            backdrop: 'static', keyboard: false
            
        });
        $('#modalBuscarPaciente').modal('hide');
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
        
        ConstanciaRn.DataTableConstanciasRn();        

        $(".chzn-select").chosen({ placeholder_text_single: 'Seleccione una opción' });
        Cargando(0);
    },

    DataTableConstanciasRn() {
        ObjtableConstanciasRn = $("#lstRnConstancias").dataTable({
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true, 
            columns: [
                {
                    "data": "idConstancia", className: 'ContCenter', width: '100px',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.estadoConstancia == 0) {
                            $(td).parent().css('color', '#EF6F6C');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                { "data": "nroHistoria", className: 'ContCenter', width: '150px' },
                { "data": "paciente", width: "15%" },
                { "data": "madre", width: "15%" },
                { "data": "documento", width: '150px' },
                { "data": "fechaNacimiento", width: '150px' },
                { "data": "fechaRegistro", width: '150px' },
                { "data": "fechaImpresion", width: '150px' },
                { "data": "estadoFirma", className: 'ContCenter' },
                {
                    "data": "accion",
                    //"visible": bActivarAccion,
                    "width": "120px",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        if (rowData.fechaImpresion == '--/--/----') {
                            btnImprimeSinF = '<button class="btn btn-sm btn-warning glow_button mm-1 ImprimeConstanciaSF" title="Imprimir Constancia" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';

                            if (ConstanciaRn.tipoRolPermiso) {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeConstanciaCF" title="Imprime Constancia Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarConstanciaSF" title="Firmar Constancia" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            } else {
                                btnImprimeSinF = '<button class="btn btn-sm btn-teal glow_button mm-1 ImprimeConstancia" title="Imprimir Constancia" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                            }
                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            if (ConstanciaRn.permisoReimprime) {
                                btnImprimeSinF = '<button class="btn btn-sm btn-warning glow_button mm-1 ImprimeConstanciaSF" title="Imprimir Constancia" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';
                                $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                            } else {
                                $(td).html('');
                            }
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
            ConstanciaRn.DataTableRegistrosRn();
            ConstanciaRn.DataTableLibroNacimientos();
            //console.log("ABRIOOOOOO");
        });

        $("a[href='#busquedaPacientes-tab']").on('shown.bs.tab', function (e) {
            ConstanciaRn.DataTableRegistrosRn();
        });

        $("a[href='#busquedaLibroNac-tab']").on('shown.bs.tab', function (e) {
            ConstanciaRn.DataTableLibroNacimientos();
        });


        $('#ifrmReporte').on('load', function () { //your code (will be called once iframe is done loading)
            let objFra = document.getElementById('ifrmReporte');
            objFra.contentWindow.focus();
            objFra.contentWindow.print();
            ConstanciaRn.ListarConstancias();
            Cargando(0);
        }); 
        $('#lstPacientesRn tbody').on('click', 'tr', function () {
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
                ObjtableConstanciasRn.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });


        $("#txtNroCorrelativo").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                if ($("#txtNroCorrelativo").val() == "" || $("#txtNroDocumento").val() =="") {
                    alerta(2, "Debe ingresar el correlativo correcto.");
                } else {
                    ConstanciaRn.ValidaComprobante();
                }
            }
        });


        //$("#txtApNomFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});
        //$("#txtFechaNacFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});
        //$("#txtNroHistoriaNacFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});

        $('.searchPaciente').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                ConstanciaRn.ListarPacientesRegistroRN();
            }
        });
        $('.searchLibroNac').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                ConstanciaRn.ListarPacientesLibroNacimiento();
            }
        });

        //$("#txtNroConstanciaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});

        //$("#txtNroCorrelativoFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});

        //$("#txtNroHistoriaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});

        //$("#txtFechaFiltro").keypress(function (e) {
        //    var code = (e.keyCode ? e.keyCode : e.which);
        //    if (code == 13) {
        //        ConstanciaRn.ListarPacientesRegistroRN();
        //    }
        //});

        $('.searchConstancia').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                ConstanciaRn.ListarConstancias();
            }
        });

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstancia', async function () {
            var objrow = ObjtableConstanciasRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableConstanciasRn.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI            
            if (isEmpty(firma)) {
                alerta('2', 'El documento no esta generado.');
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
                        await ConstanciaRn.ImprimirConstanciaSF(row.idConstancia, firma);
                    }, function (dimiss) {                        
                    });
                } else if (firma.statusFirma == 1) {
                    await ConstanciaRn.ImprimirConstanciaSF(row.idConstancia, firma);
                }
                

            }
            Cargando(0);
        });

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstanciaSF', async function () {
            var objrow = ObjtableConstanciasRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableConstanciasRn.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarConstanciaNacimiento(row.idConstancia);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);

        });

        $('#lstRnConstancias tbody').on('click', '.FirmarConstanciaSF', async function () {
            var objrow = ObjtableConstanciasRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableConstanciasRn.fnGetData(objrow);
            var tipo = '';
            var code = '';

            Cargando(1);
            ConstanciaRn.tipoRolPermiso = await Utilitario.ValidarPermiso(800);
            if (!ConstanciaRn.tipoRolPermiso) {
                Cargando(0);
                alerta(2, 'Usted no tiene permiso para firmar este documento.');                
                return false;
            } else {                
                Utilitario.TipoArchivoFirmar = 'CN';
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
                //await Utilitario.AbrirServicioFirmaBit4Id(row.code);
                //await Utilitario.IniciarServicioFirmaBit4Id(row.code);
            }
            Cargando(0);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            //if (firma) {
            //    Utilitario.TipoArchivoFirmar = 'CN';
            //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
            //}
            
        });

        $('#lstRnConstancias tbody').on('click', '.ImprimeConstanciaCF', async function () {
            var objrow = ObjtableConstanciasRn.api(true).row($(this).parents("tr")[0]).index();
            var row = ObjtableConstanciasRn.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnFirmaLote').on('click', async function () {
            let listConstancias = ObjtableConstanciasRn.api(true).data();
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
                const paquete = await Utilitario.CrearPaqueteArchivos7zip('', numConstancia, "'CN'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
                }
            }
            Cargando(0)

            //Cargando(1)
            //Utilitario.TipoArchivoFirmar = 'CN';
            //if (permisoFirmaDigital == 1) {
            //    const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, '', "'CN'");
            //    if (!isEmpty(paquete)) {
            //        await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
            //    }
            //} else if (permisoFirmaDigital == 2) {
            //    const paquete = await Utilitario.CrearPaqueteArchivos7zip(cuentasAtencion, '', "'CN'");
            //    if (!isEmpty(paquete)) {
            //        await Utilitario.IniciarServicioFirmaMultipleFirmaPeru(paquete.data);
            //    }
            //}                          
            //Cargando(0)
        });

    },

    ListarConstancias() {
        var Recurso
        Recurso = $("#lstRnConstancias").data('source');
        Cargando(1);
        var midata = new FormData();
        midata.append('NroHistoria', $("#txtNroHistoriaFiltro").val());
        midata.append('Serie', $("#txtNroDocumentoFiltro").val());
        midata.append('Correlativo', $("#txtNroCorrelativoFiltro").val());
        midata.append('idConstancia', $("#txtNroConstanciaFiltro").val());
        midata.append('FechaAtencion', $("#txtFechaFiltro").val());
        //var dat 
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/BuscarConstanciasRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                if (datos.session) {

                    ObjtableConstanciasRn.fnClearTable();
                    if (!isEmpty(datos.lstConstancias.table)) {
                        if (datos.lstConstancias.table.length > 0) {
                            ObjtableConstanciasRn.fnAddData(datos.lstConstancias.table);

                            if (ConstanciaRn.tipoRolPermiso) {
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

    async SeleccionarConstancia(idConstancia) {
        resp = null;
        var midata = new FormData();
        midata.append('idConstancia', idConstancia);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ConstanciasRN/SeleccionarConstanciaRn?area=Estadistica",
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

    ObtenerConstanciaRn(idCuentaAtencion) {
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

        if ($("#txtNroDocumento").val() == "" || $("#txtNroCorrelativo").val() == "") { alerta2('info', '', "Debe ingresar el comprobante correcto."); $("#txtNroDocumento").focus(); return false; }        

        return true;
    },

    BuscarPaciente() {
        ConstanciaRn.LimpiarFiltrosBusquedaPaciente();
        $('#modalBuscarPaciente').modal('show');
        $('#BusquedaPacienteTab a[href="#busquedaPacientes-tab"]').tab('show')
    },

    cerrarModal() {
        $('#modalConstanciaRn').modal('hide');
     
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
                /*
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
        //midata.append('FechaAtencion', $("#txtFechaNacFiltro").val());
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

    AceptarPaciente() {
        var objrow = ObjtablePacientesRn.api(true).row('.selected').data();
        var objrow2 = ObjtablePacientesLibroNac.api(true).row('.selected').data();
        //console.log(objrow);
        
        if (isEmpty(objrow) && isEmpty(objrow2)) {
            alerta2('info', '', "Debe seleccionar el paciente.");
            return false;
        } else {
            ConstanciaRn.idConstancia = 0;
            if (!isEmpty(objrow)) {
                this.idRegistroRN = objrow.idRegistroRN;
                //this.CargarDatosPaciente(objrow);
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
        ConstanciaRn.anio = objrow.fecNac.substring(6, 10);        
        ConstanciaRn.idRegistroRN = objrow.idRecienNacido;
        if (objrow.tabla == 'SISGALEN') {
            ConstanciaRn.base = 1;            
        } else if (objrow.tabla == 'CEOB_REGCNV') {
            ConstanciaRn.base = 2;
        } else if (objrow.tabla == 'S_NEONATO') {
            ConstanciaRn.base = 3;
        } else if (objrow.tabla == 'LIBRO_NAC') {
            ConstanciaRn.base = 4;
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
            alerta2('info', '', "No hay datos para mostrar. Por favor actualizar el Registro de Nacimiento del Paciente.");
            return false;
        }

        /*
        if (objrow.historiaMadre == '' || objrow.apPaternoMadre == '' || objrow.apMaternoMadre == '' || objrow.nombresMadre == '' || objrow.idDocIdentidadMadre == '' || objrow.docMadre == '' ||
            objrow.edadMadre == '' || objrow.departamentoMadre == '' || objrow.provinciaMadre == '' || objrow.distritoMadre == '' || objrow.direccionDomicilioMadre == '' ||
            objrow.fecNac == '' || objrow.horaNac == '' || objrow.sexo == '' || objrow.nroOrdenHijo == '') {
            alerta(2, "Asegurese de actualizar los datos del paciente y de la madre en su historia.");
            return false;
        }

        
        if (objrow.historiaMadre == null || objrow.apPaternoMadre == null || objrow.apMaternoMadre == null || objrow.nombresMadre == null || objrow.idDocIdentidadMadre == null || objrow.docMadre == null ||
            objrow.edadMadre == null || objrow.departamentoMadre == null || objrow.provinciaMadre == null || objrow.distritoMadre == null || objrow.direccionDomicilioMadre == null ||
            objrow.fecNac == null || objrow.horaNac == null || objrow.sexo == null || objrow.nroOrdenHijo == null) {
            alerta(2, "Asegurese de actualizar los datos del paciente y de la madre en su historia.");
            return false;
        }*/

        /*if (objrow.idDocIdentidad != 1 && objrow.idDocIdentidad != 7) {
            alerta(2, "Por favor actualice el Tipo de Documento y Nro de Documento del paciente. Solo se aceptan DNI o CIU.");
            return false;
        }*/

        //var anio = new Date(objrow.fecNac).getFullYear();
        var anio = objrow.fechaNac.substring(6, 10);
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
                        //    alerta(2, "Por favor actualice el Registro de Nacimiento del paciente.");
                        //    Cargando(0)
                        //    return false;
                        //}

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

                        $("#txtFechaNac").val(objrow.fechaNac);
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
        if (objrow.bActivo == 0) {
            alerta2('info', '', "No hay datos para mostrar. Por favor actualizar el Registro de Nacimiento del Paciente.");
            return false;
        }
        //console.log(objrow);        
        ConstanciaRn.anio = objrow.fecNac.substring(6, 10);
        ConstanciaRn.idRegistroRN = objrow.idRecienNacido;
        ConstanciaRn.base = 4;

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

   AceptarPaciente_Backup() {
       var objrow = ObjtablePacientesRn.api(true).row('.selected').data();


       if (isEmpty(objrow)) {
           alerta2('info', '', "Debe seleccionar el paciente.");
           return false;
       } else {
           if (objrow.bActivo == 0) {
               alerta2('info', '', "Por favor actualizar el Registro de Nacimiento del Paciente.");
               return false;
           }

           

           $("#hdnAnio").val($("#txtAnioNacFiltro").val());
           $("#hdnIdPaciente").val(objrow.idPaciente);
           $("#hdnNroHistoria").val(objrow.nroHistoriaClinica);
          
           
           var midata = new FormData();
           midata.append('Anio', $("#hdnAnio").val());
           midata.append('IdPaciente', $("#hdnIdPaciente").val());
           midata.append('NroHistoria', $("#hdnNroHistoria").val());
           midata.append('bd', $("#hdnBd").val());
           Cargando(1);
           $.ajax({
               method: "POST",
               url: "/ConstanciasRN/ObtenerDatosPaciente?area=Estadistica",
               data: midata,
               dataType: "json",
               processData: false,
               contentType: false,
               success: function (datos) {
                   if (!isEmpty(datos)) {
                      
                       if (datos.rsp = 'OK') {
                           if (!isEmpty(datos.objPaciente.table)) {
                               if (datos.objPaciente.table.length > 0) {
                                   var objPaciente = datos.objPaciente.table[0];
                                   $("#txtNroHistoria").val(objPaciente.nroHistoriaClinicaMadre);
                                   $("#txtNombre").val(objPaciente.nombres);
                                   $("#txtApPaterno").val(objPaciente.apPaterno);
                                   $("#txtApMaterno").val(objPaciente.apMaterno);
                                   $("#txtDocIdentidad").val(objPaciente.tipoDocMadre);
                                   $("#txtNroIdentidad").val(objPaciente.docMadre);
                                   $("#txtDireccion").val(objPaciente.direccion);
                                  // $("#txtEstadoCivil").val(objPaciente.estadoCivil);
                                   $("#txtEdad").val(objPaciente.edadMadre);
                                   $("#txtResidencia").val(objPaciente.residenciaActual);

                                   $("#txtFechaNac").val(objPaciente.fechaNac);
                                   $("#txtHoraNac").val(objPaciente.horaNac);
                                   $("#txtSexoPac").val(objPaciente.sexo);
                                   $("#txtPesoPac").val(objPaciente.peso);
                                   $("#txtTipoParto").val(objPaciente.tipoParto);
                                   $("#txtNroHijo").val(objPaciente.nroGemelar);
                                   $('#modalBuscarPaciente').modal('hide');
                               }
                           }
                       } else {
                           mensaje(3, datos.rsp)
                       }
                   }
                   Cargando(0)
                   
               },
               error: function (msg) {
                   Cargando(0)
               }
           })




       }
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
           url: "/ConstanciasRN/ListarTiposDocumento?area=Estadistica",
           datatype: "json",
           type: "get",
           success: function (datos) {
               $('#cboTipoDoc').empty();
               $(datos.table).each(function (i, obj) {
                   $('#cboTipoDoc').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
               });
           },
           error: function (msg) {
               setTimeout(function () {
                   alerta("ERROR", "Error listar médicos!", "2");
               }, 900)
           }
       });
        
        
        
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
                Cargando(0);
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

    async ValidaEstadoComprobante(numDocumento) {
        var resp = false;
        var midata = new FormData();
        var documento = numDocumento.substring(0, numDocumento.indexOf("-"));
        var correlativo = numDocumento.substring(numDocumento.indexOf("-")+1);

        midata.append('NroCorrelativo', correlativo);
        midata.append('NroDocumento', documento);
        const data = await
                     $.ajax({
                        method: "POST",
                        url: "/ConstanciasRN/ValidarComprobantedePago?area=Estadistica",
                        data: midata,
                        dataType: "json",
                        processData: false,
                        contentType: false,
                        success: function (datos) {
                            Cargando(0);
                            if (datos.rsp > 0) {
                                alerta(3, datos.mensaje);
                                resp = true;
                            } else {
                                var pos = datos.mensaje.indexOf("Anulado");
                                if (pos > 0) {
                                    resp = true;
                                } else {
                                    alerta(3, datos.mensaje);
                                    resp = false;
                                }
                            }
                        },
                        error: function (msg) {
                            console.log(msg);
                            Cargando(0)
                        }
                    });
        
        return resp;
    },

    LimpiarConstanciaNacimiento() {
        $("#hdnAnio").val("");
        $("#hdnIdPaciente").val("");
        $("#hdnNroHistoria").val("");
        $("#hdnBd").val("");         
        ConstanciaRn.base = 0;

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
        //$("#txtNroHijo").val("");
        //$("#cboTipoParto").val("");
        
        $("#cboSolicitante").val("");
        $("#cboTipoDoc").val("");
        $("#txtDocumentoSol").val("");
        $("#txtNroDocumento").val("");
        $("#txtNroCorrelativo").val("");
        $("#lblNroSolicitud").text("");
        $("#txtdescripcionpaciente").text("");
        $('.chzn-select').chosen().trigger("chosen:updated");

    },

    LimpiarFiltrosBusquedaPaciente() {

        //$("#txtAnioNacFiltro").val("");
        //$("#txtApNomFiltro").val("");        
        
        //$("#txtNroHistoriaNacFiltro").val("");
        $("#txtDniNacFiltro").val("");
        $("#txtNroHistoriaNacFiltro").val("");
        $("#txtAnioNacFiltro").val("");
        $("#txtApPaternoNacFiltro").val("");
        $("#txtDniMadreNacFiltro").val("");
        $("#txtFechaNacFiltro").datepicker("setDate", FechaDia);
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
        ConstanciaRn.ListarConstancias();
    },

    
    RegistrarConstancia() {
        if (ConstanciaRn.ValidarCampos() == false) {
            return;
        }
                
        var midata = new FormData();
        midata.append("idConstancia", ConstanciaRn.idConstancia);
        midata.append("idRegistroRn", ConstanciaRn.idRegistroRN);
        midata.append("Anio", ConstanciaRn.anio);
        midata.append("NroHistoria", 0);
        midata.append("Base", ConstanciaRn.base);
        midata.append("NroSerie", $("#txtNroDocumento").val());
        midata.append("NroCorrelativo", $("#txtNroCorrelativo").val());

        midata.append("idSolicitante", $("#cboSolicitante").val());
        midata.append("idTipoDocSolicitante", $("#cboTipoDoc").val());
        midata.append("NroDocSolicitante", $("#txtDocumentoSol").val());

        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/GuardarConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.respuesta != 0) {
                    respuesta = true;
                    alerta(1, 'Los datos y la constancia fueron generados correctamente.');
                    ConstanciaRn.cerrarModal();
                    ConstanciaRn.ListarConstancias();
                } else {
                    alerta(2, datos.mensaje);
                }
                
            },
            error: function (msg) {
                Cargando(0)
            }
        });
        return false;
    },

    GenerarConstancia(idConstancia) {
        //Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", idConstancia);
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/GenerarConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta == "Ok") {
                        alerta(1, datos.mensaje);
                        ConstanciaRn.cerrarModal();
                        ConstanciaRn.ListarConstancias();
                        //Cargando(0);
                        //Cargando(1);
                        //var url = "/ConstanciasRN/Reporte?area=Estadistica&idConstancia=" + idConstancia;
                        //$('#ifrmReporte').attr('src', url);
                    } else {
                        Cargando(0);
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
                    url: "/ConstanciasRN/ImprimirConstanciaRn?area=Estadistica",
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
                    ConstanciaRn.ListarConstancias();
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
            //    url: "/ConstanciasRN/ImprimirConstanciaRn?area=Estadistica",
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
};


function AgregarConstanciaRn() {
    ConstanciaRn.LimpiarConstanciaNacimiento();  
    $("#modalHeader").removeClass("bg-primary");
    $("#modalHeader").addClass("bg-success");
    
    $("#cboSolicitante").prop("disabled", false);
    $("#cboSolicitante").trigger("chosen:updated");
    
    $("#cboTipoDoc").prop("disabled", false);
    $("#cboTipoDoc").trigger("chosen:updated");

    $("#txtDocumentoSol").prop("disabled", false);

    $("#DatosConstancia").hide();
    $("#NroComprobante").hide();
    $("#Comprobante").show();
    $("#btnBuscarPaciente").show();
    $("#btnGuardar").show();

    $('#modalConstanciaRn').modal('show');
}


async function ModificarConstanciaRn() {
    //var midata = new FormData();
    ConstanciaRn.LimpiarConstanciaNacimiento();

    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();

    if (isEmpty(objrow)) {
        alerta2("info", "", "Debe seleccionar algun registro.");
        return false;
    }

    if (objrow.estadoConstancia == 0) {
        alerta2("info", "", "La constancia ha sido eliminada por motivo: \n" + objrow.motivoBaja);
        return false;
    }

    const constancia = await ConstanciaRn.SeleccionarConstancia(objrow.idConstancia);
    //console.log(constancia);

    ConstanciaRn.idConstancia = constancia.idConstancia;
    ConstanciaRn.idRegistroRN = constancia.idRecienNacido;
    ConstanciaRn.anio = constancia.anio;
    ConstanciaRn.base = constancia.base;

    $("#txtNroAsiento").val(constancia.nroAsiento);
    $("#txtNroFolio").val(constancia.nroFolio);

    $("#txtNroHistoria").val(constancia.historiaMadre);
    $("#txtNombre").val(constancia.nombresMadre);
    $("#txtApPaterno").val(constancia.apPaternoMadre);
    $("#txtApMaterno").val(constancia.apMaternoMadre);

    $("#txtTipoDocumento").val(constancia.tipoDocIdentidadMadre);
    $("#txtNroIdentidad").val(constancia.docMadre);
    $("#txtDireccion").val(constancia.direccionDomicilioMadre);
    $("#txtEdad").val(constancia.edadMadre != '' ? (constancia.edadMadre + ' años') : '');
    $("#txtNacionalidad").val(constancia.nacionalidadMadre);
    $("#txtResidencia").val(constancia.departamentoMadre + ' / ' + constancia.provinciaMadre + ' / ' + constancia.distritoMadre);

    $("#txtNombrePadre").val(constancia.nombresPadre);
    $("#txtApPaternoPadre").val(constancia.apPaternoPadre);
    $("#txtApMaternoPadre").val(constancia.apMaternoPadre);

    $("#txtCnv").val(constancia.nroDocumento);
    $("#txtFechaNac").val(constancia.fechaNac);
    $("#txtHoraNac").val(constancia.horaNac);
    $("#txtSexoPac").val(constancia.sexo);
    $("#txtPesoPac").val(constancia.peso);
    $("#txtTallaPac").val(constancia.talla);
    //$("#txtNroHijo").val(objrow.nroOrdenHijo);   
    $("#txtEdadGestacional").val(constancia.edadGestacional != '' ? (constancia.edadGestacional + ' semanas') : '');
    $("#txtTipoParto").val(constancia.tipoParto);
    $("#txtProducto").val(constancia.producto);
    $("#txtCondicion").val(constancia.condicion);


    $("#txtComentario").val(constancia.comentario);
    $("#txtComentario").prop("disabled", false);
    $("#txtDocumentoSol").val(constancia.nroDocSolicitante);
    $("#txtDocumentoSol").prop("disabled", false);

    $("#cboSolicitante").val(constancia.idSolicitante);
    $("#cboSolicitante").prop("disabled", false);
    $("#cboSolicitante").trigger("chosen:updated");

    $("#cboTipoDoc").val(constancia.idTipoDocSolicitante);
    $("#cboTipoDoc").prop("disabled", false);
    $("#cboTipoDoc").trigger("chosen:updated");


    $("#textComprobante").val(constancia.nroSerie + '-' + constancia.nroCorrelativo);
    $("#txtNroDocumento").val(constancia.nroSerie);
    $("#txtNroCorrelativo").val(constancia.nroCorrelativo);
    $("#NroComprobante").show();
    $("#Comprobante").hide();


    $("#btnGuardar").show();
    $("#DatosSolicitud").show();

    $("#btnBuscarPaciente").hide();

    $("#modalHeader").removeClass("bg-success");
    $("#modalHeader").addClass("bg-primary");

    $("#lblNroSolicitud").text("Constancia N° " + constancia.idConstancia);
    //$("#lblNroSolicitud").show();
    $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");
    $("#DatosConstancia").show();

    $('#modalConstanciaRn').modal('show');
    //$('#modalAprobarSolicitud').modal('show');    

}

async function ConsultarConstanciaRn() {
    //var midata = new FormData();
    ConstanciaRn.LimpiarConstanciaNacimiento();

    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();

    if (isEmpty(objrow)) {
        alerta2('info', '', "Debe seleccionar algun registro.");
        return false;
    }

    if (objrow.estadoConstancia == 0) {
        alerta2("info", "", "La constancia ha sido eliminada por motivo: \n" + objrow.motivoBaja);
        //return false;
    }

    const constancia = await ConstanciaRn.SeleccionarConstancia(objrow.idConstancia);
    //console.log(constancia);

    ConstanciaRn.idConstancia = constancia.idConstancia;
    ConstanciaRn.idRegistroRN = constancia.idRecienNacido;
    ConstanciaRn.anio = constancia.anio;
    ConstanciaRn.base = constancia.base;
        
    $("#txtNroAsiento").val(constancia.nroAsiento);
    $("#txtNroFolio").val(constancia.nroFolio);

    $("#txtNroHistoria").val(constancia.historiaMadre);
    $("#txtNombre").val(constancia.nombresMadre);
    $("#txtApPaterno").val(constancia.apPaternoMadre);
    $("#txtApMaterno").val(constancia.apMaternoMadre);

    $("#txtTipoDocumento").val(constancia.tipoDocIdentidadMadre);
    $("#txtNroIdentidad").val(constancia.docMadre);
    $("#txtDireccion").val(constancia.direccionDomicilioMadre);
    $("#txtEdad").val(constancia.edadMadre != '' ? (constancia.edadMadre + ' años') : '');
    $("#txtNacionalidad").val(constancia.nacionalidadMadre);
    $("#txtResidencia").val(constancia.departamentoMadre + ' / ' + constancia.provinciaMadre + ' / ' + constancia.distritoMadre);

    $("#txtNombrePadre").val(constancia.nombresPadre);
    $("#txtApPaternoPadre").val(constancia.apPaternoPadre);
    $("#txtApMaternoPadre").val(constancia.apMaternoPadre);

    $("#txtCnv").val(constancia.nroDocumento);
    $("#txtFechaNac").val(constancia.fechaNac);
    $("#txtHoraNac").val(constancia.horaNac);
    $("#txtSexoPac").val(constancia.sexo);
    $("#txtPesoPac").val(constancia.peso);
    $("#txtTallaPac").val(constancia.talla);
    //$("#txtNroHijo").val(objrow.nroOrdenHijo);   
    $("#txtEdadGestacional").val(constancia.edadGestacional != '' ? (constancia.edadGestacional + ' semanas') : '');
    $("#txtTipoParto").val(constancia.tipoParto);
    $("#txtProducto").val(constancia.producto);
    $("#txtCondicion").val(constancia.condicion);


    $("#txtComentario").val(constancia.comentario);
    $("#txtDocumentoSol").val(constancia.nroDocSolicitante);
    $("#txtDocumentoSol").prop("disabled", true);
    
    $("#cboSolicitante").val(constancia.idSolicitante);
    $("#cboSolicitante").prop("disabled", true);
    $("#cboSolicitante").trigger("chosen:updated");
    $("#cboTipoDoc").val(constancia.idTipoDocSolicitante);
    $("#cboTipoDoc").prop("disabled", true);
    $("#cboTipoDoc").trigger("chosen:updated");
       
    $("#textComprobante").val(constancia.nroSerie + '-' + constancia.nroCorrelativo); 
    $("#txtNroDocumento").val(constancia.nroSerie);
    $("#txtNroCorrelativo").val(constancia.nroCorrelativo);
    $("#NroComprobante").show();
    $("#Comprobante").hide();
     

    $("#btnGuardar").hide();
    $("#DatosSolicitud").show();

    $("#btnBuscarPaciente").hide();          

    $("#modalHeader").removeClass("bg-success");
    $("#modalHeader").addClass("bg-primary");

    $("#lblNroSolicitud").text("Constancia N° " + constancia.idConstancia);
    //$("#lblNroSolicitud").show();
    $("#txtdescripcionpaciente").text("Paciente: " + objrow.paciente + "");
    $("#DatosConstancia").show();

    $('#modalConstanciaRn').modal('show');
    //$('#modalAprobarSolicitud').modal('show');    

}

async function EliminarConstanciaRn() {
    //SolicitudConstanciaRn.LimpiarConstanciaNacimiento();

    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();
    console.log(objrow);

    if (isEmpty(objrow)) {
        alerta2('info', '', "Debe seleccionar algun registro.");
        return false;
    }

    if (objrow.estadoConstancia == 0) {
        alerta2("info", "", "La constancia ha sido eliminada por motivo: \n" + objrow.motivoBaja);
        return false;
    }

    //var boleta = await ConstanciaRn.ValidaEstadoComprobante(objrow.documento);
    
    //if (!boleta) {
    //    alerta(2, "Debe anular el comprobante para poder eliminar el registro de constancia.");
    //    return false;
    //}
    
    swal({
        title: 'Eliminar',
        text: 'Paciente: ' + objrow.paciente + '<br>¿ Esta seguro de eliminar la <strong style = "font-weight: 900;">Constancia Nº ' + objrow.idConstancia + '</strong> ? <div class="form-group mt-2"><label class="font-weight-bold">Motivo</label><textarea id="txtMotivoEliminación" class="form-control" autocomplete="off"> </textarea></div> ',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#4fb7fe',
        cancelButtonColor: '#6c6c6c',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then(function () {
        Cargando(1);
        var midata = new FormData();
        midata.append("idConstancia", objrow.idConstancia);
        midata.append("motivoEliminacion", $("#txtMotivoEliminación").val());
        $.ajax({
            method: "POST",
            url: "/ConstanciasRN/EliminarConstanciaRn?area=Estadistica",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {
                    if (datos.respuesta > 0) {
                        ConstanciaRn.ListarConstancias();
                        alerta2('success', '', datos.mensaje);
                    } else {
                        alerta2('error', '', datos.mensaje);
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
}

/*
function EliminarConstancia() {
    ConstanciaRn.LimpiarConstanciaNacimiento();

    var objrow = ObjtableConstanciasRn.api(true).row('.selected').data();
    console.log(objrow);

    if (isEmpty(objrow)) {
        alerta(2, "Debe seleccionar algun registro.");
        return false;
    }

    if (objrow.idDocIdentidad != 1 && objrow.idDocIdentidad != 7) {
        alerta(2, "Por favor actualice el Tipo de Documento y Nro de Documento del paciente. Solo se aceptan DNI o CIU.");
        return false;
    }
}*/

$(document).ready(function () {
    ConstanciaRn.InicializarComponentesConstanciaRn();
    ConstanciaRn.LlenarCombos();
    //ConstanciaRn.ListarConstancias();
    ConstanciaRn.Eventos();
    //InicializarComponentesConstanciaRn();
   
    //ListarConstancias();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');

    PermisoGeneral.ValidarServicioFirmaDigital();
});
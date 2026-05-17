let AtencionMedica = {
    permisoRefCon: "",
    permisoFua: "",
    //permisoFirmaDigital: "",
    permisoClasiPaciente: "",
    listaEpisodios: [{}],
    codeParteDiario: '',
    statusParteDiario: 0,

    Iniciar: async () => {

        AtencionMedica.Plugins();
        await AtencionMedica.CargaInicial();
        AtencionMedica.InitDatablesAtenciones();
        //AtencionMedica.InitDatablesConsumoAtencion()

        AtencionMedica.Events();

        /////////////DIAGNOSTICO////////////////////
        BusquedaDiagnosticos.IniciarScript();
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        $('#lstDiagnosticos').on('draw.dt', function () {
            Ordenes.CargarDiagnosticosOrdenesMedicas(0);
        });
        /////////////////////////////////////////////

        ///////////CONSUMO EN EL SERVICIO//////////////
        ConsumoServicio.IniciarScript();
        /////////////////////////////////////////////

        /////////////ORDENES Y RECETAS///////////////
        Ordenes.IniciarScript();
        Ordenes.tipoServicio = 'CE';
        await Ordenes.IniciarData();
        //$("#ContentDiagnosticosReceta").hide();
        /////////////////////////////////////////////


        /////////////Solicitud CQx///////////////
        Ordenes.InitDatableBusquedaDiagnostico()

        /////////////////////////////////////////////

        await AtencionMedica.ListaTiposConsulta()

        await AtencionMedica.ListaServicios();

        EstablecimientoSalud.IniciarScript();

        Speech.IniciarScript();


    },

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFinEmb, #txtFUM, #txtFPP, #txtFEcog, #txtFechaControl, #txtFPPControl, #txtProximaConsulta, #txtFechaAtencion, #txtFechaEjecucion').datepicker({ // se agrego txtProximaConsulta RQ0002
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
        $('#txtFinEmb, #txtFUM, #txtFPP, #txtFEcog, #txtFechaControl, #txtFPPControl, #txtProximaConsulta, #txtFechaAtencion, #txtFechaEjecucion').mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

    },

    CargaInicial: async () => {
        AtencionMedica.Limpiar()

        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        //$('#txtFechaAtencion').val(fechaP)
        $("#txtFechaAtencion").datepicker("setDate", fechaP);

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $("#cboTipoConsulta").attr('disabled', 'disabled')
        $("#cboTipoConsulta").trigger("chosen:updated")
        $("#ceAtencion-tab").css("pointer-events", "none")


        //const permisoClasiPac = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
        //const permisoTipoFirma = await PermisoGeneral.SeleccionarPermisoGeneral("FIRMA4IDENTITY")
        //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");        
        //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");

        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        //console.log(permisosGenerales);
        if (!isEmpty(permisosGenerales)) {
            AtencionMedica.permisoClasiPaciente = permisosGenerales.table.find(item => item.codigo === 'CLASI_PAC').valorInt;
            permisoFirmaDigital = permisosGenerales.table.find(item => item.codigo === 'FIRMA_DIGITAL').valorInt;
            AtencionMedica.permisoFua = permisosGenerales.table.find(item => item.codigo === 'FUA').valorInt;
            AtencionMedica.permisoRefCon = permisosGenerales.table.find(item => item.codigo === 'REFCON').valorInt;
        }

        if ($("#txtFechaAtencion").val() == fechaP) {
            if ($("#idMedicotxt").val() > 0) {
                $("#btnLlamarPaciente").show();
            } else {
                $("#btnLlamarPaciente").hide();
            }
        } else {
            $("#btnLlamarPaciente").hide();
        }

    },

    FirmaDocumentosByLote: async (idCuentaAtencion) => {
        let data = await Utilitario.FirmaDocumentosByLote(idCuentaAtencion)
        if (!isEmpty(data)) {
            return data
        }
    },
    FirmaDocumentosByLoteTotal: async (cuentasAtencion) => {
        let data = await Utilitario.FirmaDocumentosByLoteTotal(cuentasAtencion)
        if (!isEmpty(data)) {
            return data
        }
    },

    CondicionEstablecimiento: (idCuentaAtencion, idServicio) => {
        var midata = new FormData();
        midata.append('idNroCuenta', idCuentaAtencion);
        midata.append('idServicio', idServicio);

        $.ajax({
            method: "POST",
            url: "/Atencion/CondicionEstablecimiento?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {

                $(datos.table).each(function (i, obj) {
                    if (obj.categoria == "MGP") {
                        $('#lblDesEstablecimiento').html(obj.descripcion) //KHOYOSI
                        $('#idEnEstablecimiento').val(obj.idTipoCondicionPaciente)
                    }

                    if (obj.categoria == "ServicioMGP") {
                        $('#lblDesServicio').html(obj.descripcion) //KHOYOSI
                        $('#idEnServicio').val(obj.idTipoCondicionPaciente)
                    }
                })

            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar condicion de establecimiento!", "2")
                }, 900)
            }
        });
    },

    TiposClasificacionPaciente: function () {
        let formData = new FormData();
        return HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=ConsultaExterna', formData).then(res => {

            if (res.lsClasiPac.table.length > 0) {
                $('#cboClasisifcacion').empty();
                $(res.lsClasiPac.table).each(function (i, obj) {
                    console.log()
                    $('#cboClasisifcacion').append('<option  value="' + obj.id + '" '+ (obj.id==7?'selected':'') +'>' + obj.descripcion + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            } else {
                alerta(2, 'Error listar clasificacion!')
            }
        })
    },

    ListaTiposConsulta: async () => {
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/ListarTiposConsulta?area=ConsultaExterna",
            datatype: "json",
            type: "get",
            success: function (datos) {

                $('#cboTipoConsulta').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboTipoConsulta').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                //$(".hide_search").chosen({ disable_search_threshold: 10 });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar tipo de consultas!", "2");
                }, 900)
            }
        });
    },

    async ListaServicios() {
        let datos;
        let midata = new FormData();
        midata.append('fecha', $('#txtFechaAtencion').val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            $('#cboConsultorio').empty();
            var servicios = datos.table

            $(servicios).each(function (i, obj) {
                if (obj.activaProcedimiento == 0) {
                    if ($('#idMedicotxt').val() > 0) {
                        if ($('#idMedicotxt').val() == obj.idMedico) {
                            $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
                        }
                    } else {
                        $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
                    }
                }
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
            // JDELGADO001
            $("#cboConsultorio option").each(function () {
                if ($('#idEmpleadotxt').val() == $(this).context.attributes.idempleado.nodeValue) {
                    //console.log("Tiene programacion")
                    $(`#cboConsultorio option[value='${$(this).context.attributes[5].nodeValue}']`).attr("selected", true);
                    $('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
                    return
                } else {
                    //console.log("No tiene programacion")
                }
            });
        } catch (error) {
            Cargando(0)
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    //ListaServicios: async () => {
    //    var midata = new FormData();
    //    //console.log($('#txtFechaAtencion').val());
    //    midata.append('fecha', $('#txtFechaAtencion').val());
    //    Cargando(1);
    //    $.ajax({
    //        method: "POST",
    //        url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        async: false,
    //        success: function (datos) {
    //            Cargando(0);
    //            $('#cboConsultorio').empty();
    //            var servicios = datos.table

    //            $(servicios).each(function (i, obj) {
    //                if (obj.activaProcedimiento == 0) {
    //                    if ($('#idMedicotxt').val() > 0) {
    //                        if ($('#idMedicotxt').val() == obj.idMedico) {
    //                            $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
    //                        }
    //                    } else {
    //                        $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
    //                    }
    //                }                                        
    //            });

    //            $('.chzn-select').chosen().trigger("chosen:updated");
    //            // JDELGADO001
    //            $("#cboConsultorio option").each(function () {
    //                if ($('#idEmpleadotxt').val() == $(this).context.attributes.idempleado.nodeValue) {
    //                    //console.log("Tiene programacion")
    //                    $(`#cboConsultorio option[value='${$(this).context.attributes[5].nodeValue}']`).attr("selected", true);
    //                    $('#lblMedicoProgramado').html("<b>MÉDICO: </b>" + $('#cboConsultorio>option:selected').attr("med"))
    //                    return
    //                } else {
    //                   console.log("No tiene programacion")
    //                }
    //            });
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                Cargando(0);
    //                alerta("ERROR", "Error listar servicios!", "2");
    //            }, 900)
    //        }
    //    });

    //},

    ListaDestinosCE: () => {
        let objrow = oTable_atenciones.api(true).row('.selected').data();
        //console.log('oTable_atenciones', objrow)
        $.ajax({
            async: false,
            cache: false,
            url: "/Atencion/TiposDestinoAtencionSeleccionarDestinosDeConsultorioExterno?area=ConsultaExterna",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboDestino').empty();
                $(datos.table).each(function (i, obj) {
                    if (!isEmpty(objrow)) {
                        if (objrow.idFuenteFinanciamiento != 3 && (obj.idDestinoAtencion == 12 || obj.idDestinoAtencion == 13)) {
                            false;
                        } else {
                            if (Variables.EsConsejeriaOncologica || Variables.EsConsejeriaEstrategiasSanitaria) {
                                if (obj.idDestinoAtencion == 10 || obj.idDestinoAtencion == 60 || obj.idDestinoAtencion == 54) {
                                    $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                                }
                            } else {
                                $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                            }

                        }
                    }

                });
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0)
                AtencionMedica.listaDestinosCE();
                alerta("ERROR", "Error listar destinos!", "2");
            }
        });
    },
    ListaEpisodiosByPaciente: (idPaciente) => {
        var midata = new FormData();
        midata.append('idPaciente', idPaciente)

        $.ajax({
            url: "/Atencion/ListaEpisodiosByAtencion?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                var nroEpisodio = 0
                var fecha = null
                $('#cboEpisodio').empty();
                $('#cboEpisodio').append('<option  value="0">-Seleccione-</option>')

                $(datos.table).each(function (i, obj) {
                    $('#cboEpisodio').append('<option atencion="' + obj.idAtencion + '" value="' + obj.idEpisodio + '"> N°. ' + obj.idEpisodio + ' -  Fech. Apertura: ' + obj.fechaApertura +
                        ' -  Diagnostico: ' + obj.diagnosticoWeb +
                        ' -  FechaCierre: ' + obj.fechaCierre +
                        ' -  Servicio ' + obj.servicioGeneralweb + '</option>')

                    if (obj.idAtencion == $('#idAtencion').val()) {
                        nroEpisodio = obj.idEpisodio;
                        $('#chkNuevo').prop('checked', true)
                        fecha = obj.fechaCierre;
                    }

                });

                if (isEmpty(fecha)) {
                    $('#chkCierre').prop('checked', false)
                }
                else {
                    $('#chkCierre').prop('checked', true)
                }
                $('#cboEpisodio').val(nroEpisodio);
                $('.chzn-select').chosen().trigger("chosen:updated")
                AtencionMedica.listaEpisodios = datos
            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0)
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        })
    },
    ListaDiagnosticosAtenciones: (idAtencion) => {

        Diagnosticos.LimpiarDiagnosticosAtencion();
        oTable_DiagnosticosPreOperatorio.fnClearTable();

        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        $.ajax({

            method: "POST",
            url: "/Atencion/AtencionesDiagnosticosSeleccionarPorAtencion?area=ConsultaExterna",
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
                        Diagnosticos.ListaDiagnosticosAtencion(datos.table);
                        oTable_DiagnosticosPreOperatorio.fnAddData(datos.table);
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
    ListaRecetas: (idAtencion, idTipoFuenteFinan) => {
        Ordenes.limpiarCatalogo();
        //Ordenes.listaRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
        Ordenes.listaCabeceraRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
    },
    ListaRecetasCabeceras: async () => {
        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            resp = datos.table;
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },


    ListaAtencionesCE: async () => {

        var formData = new FormData();
        let datos;
        let resp;

        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());
        formData.append('fecha', $('#txtFechaAtencion').val());
        formData.append('idServicio', $('#cboConsultorio').val());
        formData.append('prog', $('#cboConsultorio>option:selected').attr("prog"));

        try {
            Cargando(1);
            AtencionMedica.codeParteDiario = '';
            AtencionMedica.statusParteDiario = '';
            oTable_atenciones.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListarAtencionesCE?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
            });
            Cargando(0);            
            if (datos.session) {
                oTable_atenciones.fnClearTable();
                if (datos.lstAtenciones.table.length > 0) {
                    oTable_atenciones.fnAddData(datos.lstAtenciones.table);
                    //Cargando(0)

                    ////////////////DEFINIR PARTE DIARIO///////////////////////////////////
                    AtencionMedica.codeParteDiario = datos.lstAtenciones.table[0]['codeParte'];
                    AtencionMedica.statusParteDiario = datos.lstAtenciones.table[0]['statusFirmaParte'];
                    if (AtencionMedica.statusParteDiario == 0) {
                        $("#btnGeneraParte").show();
                        $("#btnDescargaParte").hide();
                        $("#btnDescargaParteSF").show();
                    } else if (AtencionMedica.statusParteDiario == 1) {
                        $("#btnGeneraParte").hide();
                        $("#btnDescargaParte").show();
                        $("#btnDescargaParteSF").hide();
                    }

                    oTable_atenciones.resize();
                    ///////////////////////////////////////////////////////////////////////
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }



        //Cargando(1)
        //oTable_atenciones.fnClearTable();
        ////alert($('#cboConsultorio>option:selected').attr("prog"));
        //var midata = new FormData();
        //midata.append('fecha', $('#txtFechaAtencion').val());
        //midata.append('idServicio', $('#cboConsultorio').val());
        //midata.append('prog', $('#cboConsultorio>option:selected').attr("prog"));
        //$.ajax({ // JDELGADO J1 CAMBIOS EN AJAX
        //    method: "POST",
        //    url: "/Atencion/ListarAtencionesCE?area=ConsultaExterna",
        //    //contentType: "application/json; charset=utf-8",
        //    data: midata,
        //    dataType: "json",
        //    processData: false,
        //    contentType: false,
        //    success: function (datos) {

        //        if (datos.session) {
        //            if (datos.lstAtenciones.table.length > 0) {
        //                oTable_atenciones.fnAddData(datos.lstAtenciones.table);
        //                Cargando(0)
        //            }
        //            else {
        //                Cargando(0)
        //            }
        //        }
        //        else {
        //            //Cargando(0);
        //            location.reload();
        //        }
        //    },
        //    error: function (msg) {
        //        Cargando(0)
        //    }
        //})
    },

    ListaAtencionByCuenta: function (idCuenta) { // JDELGADO J0 CAMBIO AJAX
        let formData = new FormData();
        formData.append('idCuenta', idCuenta);

        return HttpClient.Post('/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna', formData).then(res => {
            if (res.lstAtenciones.table.length > 0) {
                return res.lstAtenciones.table[0]
            }
            return null
        })
    },

    BuscaAtencionesCptCEparaFormatoHIS: (idCuentaAtencion) => {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.listaCpt.table.length !== 0) {
                        oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
                    }
                }
                else {
                    location.reload();
                }
            },
            error: function (msg) {
                alerta(3, "Error al listar Cpt");
                Cargando(0)
            }
        });

        oTable_consumoServAtencion.resize();
    },

    ValidaDatosObligatorios: async () => {
        let objrow = oTable_atenciones.api(true).row('.selected').data();
        fechaDiaValor = AtencionMedica.fechaDia();
        valorFecha = AtencionMedica.fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)

        let objrowAtencion = await AtencionMedica.ListaAtencionByCuenta(Variables.IdCuentaAtencion) // JDELGADO J0 CAMBIO ASYNC METHOD

        //if (valorFecha) {
        //    alerta('3', 'No se puede relizar una atencion antes de la fecha de la cita');
        //    return false;
        //}





        if (objrowAtencion.idEspecialidad == 33) {
            if (isEmpty($('#cboClasificacionTipoAtencion').val()) || $('#cboClasificacionTipoAtencion').val() == 0) {
                alerta('2', 'El tipo de atencion es obligatorio');
                $('.nav-tabs a[href="#Atencion"]').tab('show');
                return false
            }

        }



        if ($("#HoraInicioAtencion").val() == "" || $("#HoraInicioAtencion").val() == "__: __") {
            alerta('2', 'Ingrese Hora de Inicio de Atención');
            $("#HoraInicioAtencion").focus();
            return false;
        }

        ///////VALIDA TRIAJE///////////////

        //RMOREANO 05032026  DATOS OBLIGATORIOS DE TRIAJE SE PIDIO Q SE QUITARA
            //if ($("#txtPeso").val() == "") {
            //    $("#txtPeso").focus();
            //    alerta('2', 'Ingrese peso de triaje');
            //    return false
            //}

            //if ($("#txtTalla").val() == "") {
            //    $("#txtTalla").focus();
            //    alerta('2', 'Ingrese talla de triaje');
            //    return false
            //}
        //RMOREANO 05032026

        /////////////////////////////////VALIDA MODULO ESPECIALIDADES Y ANESTESIO///////////////////////////////////////////////
        if (Variables.TipoModulo == 'ModuloEspecialidades' || Variables.TipoModulo == 'ModuloOnco' || Variables.TipoModulo == 'ModuloEspecialidadesAdolescencia' || Variables.TipoModulo == 'ModuloAnestesio') {
            if (Especialidades.permisoClasiPaciente == 1 || Anestesiologia.permisoClasiPaciente == 1) {
                if ($("#cboClasisifcacion").val() > 0) {
                    if (AtencionMedica.ValidaEntrevista($("#cboClasisifcacion").val()) == false) {
                        $("#atencion-tab").click();
                        return false;
                    }
                } else {
                    $('.nav-tabs a[href="#Atencion"]').tab('show');
                    $("#cboClasisifcacion_chosen").attr("tabindex", -1).focus();
                    $('a[href="#Atencion"]').on('shown.bs.tab', function (e) {
                        $("#cboClasisifcacion_chosen").attr("tabindex", -1).focus();
                    });
                    alerta('2', 'Seleccione Clasificacion de Paciente');
                    return false
                }
            }
        }

        /////////////////////////////VALIDA MODULO MATERNO/////////////////////////////////
        if (Variables.TipoModulo == "ModuloMaterno" || Variables.TipoModulo == "ModuloMaternoAdolescencia") {
            if ($("#chkCalculaFechaEco").is(':checked')) {
                if ($("#txtFEcog").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese fecha ecografica');
                    return false;
                }
            }

            if ($("#chkMuestraEco").is(':checked')) {
                if ($("#txtFEcog").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('3', 'Ingrese fecha ecografica');
                    return false;
                }
                if (!($("#chkCalculaFechaEco").is(':checked'))) {
                    alerta('2', 'Seleccione calcule con ecografía para realizar los calculos de semas y dias de gestación');
                    $("#chkCalculaFechaEco").focus();
                    return false;
                }
            } else {
                if ($("#txtFUM").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    alerta('2', 'Ingrese fecha de ultima regla');
                    $("#txtFUM").focus();
                    return false;
                }
            }

            if ($("#txtSemanas").val() == "") {
                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                alerta('2', 'Ingrese semanas de gestacion');
                return false;
            }

            if ($("#txtDias").val() == "") {
                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                alerta('2', 'Ingrese dias de gestacion');
                return false;
            }

            if ($("#txtFPP").val() == "") {
                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                alerta('2', 'Ingrese fecha probable de parto');
                return false;
            }

            if ($('#txtGestasP').val() != "") {
                if ($('#txtGestasP').val() >= 1) {
                    if (isEmpty($("#txtFinEmb").val())) {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                        $('.nav-tabs a[href="#anteceObst"]').tab('show');
                        $("#txtFinEmb").focus();
                        alerta('2', 'Ingrese fin de embarazo anterior');
                        return false;
                    }

                    fechaEm = AtencionMedica.fechaCorrecta($("#txtFinEmb").val(), objrow.fechaIngreso2)

                    if (fechaEm) {
                        $('.nav-tabs a[href="#Perinatal"]').tab('show');
                        $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                        $('.nav-tabs a[href="#anteceObst"]').tab('show');
                        $("#txtFinEmb").focus();
                        alerta('3', 'La Fecha de fin de embarazo anterior no puede ser mayor a la fecha del control');
                        return false;
                    }
                }
            }

            if ($("#txtPesoPregesta").val() == "") {
                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                $('.nav-tabs a[href="#entrevistaPer"]').tab('show');
                $('.nav-tabs a[href="#anteceObst"]').tab('show');
                $("#txtPesoPregesta").focus();
                alerta('2', 'Ingrese peso Pregestacional - kg ');

                return false;
            }

            if ($('#cboTipoEmbrazo').val() == 2) {
                if ($("#txtNroFetos").val() == "") {
                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('.nav-tabs a[href="#controlPer"]').tab('show');
                    $('.nav-tabs a[href="#dtosBasales"]').tab('show');
                    $("#txtNroFetos").focus();
                    alerta('2', 'Ingrese peso N° de fetos');

                    return false;
                }
            }

            if ($('#txtMotivoConsultaPeri').val() == "") {
                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                $('.nav-tabs a[href="#controlPer"]').tab('show');
                $("#txtMotivoConsultaPeri").focus();
                alerta('2', 'Ingrese motivo de consulta');
                return false;
            }
        }

        ///////////////////////VALIDA MODULO NAR////////////////////////////////
        if (Variables.TipoModulo == "ModuloNAR") {

        }

        /////////////////////VALIDA DIAGNOSTICOS///////////////////////////
        var cantidadtDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        if (cantidadtDiagnosticos.count() == 0 && !Variables.EsConsejeriaObstetrica && !Variables.EsConsejeriaOncologica) {
            $('.nav-tabs a[href="#diagnosticos"]').tab('show');
            alerta('2', 'Ingrese Diagnosticos');
            return false;
        }

        ///////////////////VALIDA RECETA FARMACIA///////////////////////////
        var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalleFarmacia();
        if (ListaRecetaDetalleFarmacia.count() > 0) {
            if (isEmpty($('#txtFechaVigencia').val())) {
                $('.nav-tabs a[href="#ordenes"]').tab('show');
                $('.nav-tabs a[href="#farmacia"]').tab('show');
                $("#txtFechaVigencia").focus();
                alerta('2', 'Ingrese fecha de vigencia');

                return false;
            }
        }

        /////////////////////VALIDA DESTINO DE ATENCION/////////////////////
        if (isEmpty($("#cboDestino").val())) {
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $("#cboDestino_chosen").attr("tabindex", -1).focus();
            $('a[href="#ordenes"]').on('shown.bs.tab', function (e) {
                $("#cboDestino_chosen").attr("tabindex", -1).focus();
            });
            alerta('2', 'Seleccione Destino');
            return false
        }

        if ($("#cboDestino").val() == 60) {
            if (isEmpty($("#txtProximaConsulta").val())) {
                $("#txtProximaConsulta").focus();
                alerta('2', 'Ingrese la Fecha de la Próxima Consulta.');
                return false;
            }

            if ($("#cboTipoConsulta").val() == -1) {
                $('.nav-tabs a[href="#ordenes"]').tab('show');
                $("#cboTipoConsulta_chosen").attr("tabindex", -1).focus();
                $('a[href="#ordenes"]').on('shown.bs.tab', function (e) {
                    $("#cboTipoConsulta_chosen").attr("tabindex", -1).focus();
                });
                alerta('2', 'Seleccione el Tipo de la proxima Consulta.');
                return false;
            }

            //////////////////////CITA PROXIMA///////////////////////////////////////////////////////////
            if (Variables.IdEspecialidadIngreso >= 1 && Variables.IdEspecialidadIngreso <= 5) {
                if (isEmpty($("#cboProgramacionProximaConsulta").val()) == false) {
                    //$('.nav-tabs a[href="#ordenes"]').tab('show');
                    //$("#cboProgramacionProximaConsulta_chosen").attr("tabindex", -1).focus();
                    //$('a[href="#ordenes"]').on('shown.bs.tab', function (e) {
                    //    $("#cboProgramacionProximaConsulta_chosen").attr("tabindex", -1).focus();
                    //});
                    //alerta('2', 'Seleccione el servicio de la proxima Consulta.');
                    //return false;

                    if (isEmpty($("#cboHoraProximaConsulta").val())) {
                        $('.nav-tabs a[href="#ordenes"]').tab('show');
                        $("#cboHoraProximaConsulta_chosen").attr("tabindex", -1).focus();
                        $('a[href="#ordenes"]').on('shown.bs.tab', function (e) {
                            $("#cboHoraProximaConsulta_chosen").attr("tabindex", -1).focus();
                        });
                        alerta('2', 'Seleccione la hora de la proxima Consulta.');
                        return false;
                    }
                }

                //if (isEmpty($("#cboHoraProximaConsulta").val())) {
                //    $('.nav-tabs a[href="#ordenes"]').tab('show');
                //    $("#cboHoraProximaConsulta_chosen").attr("tabindex", -1).focus();
                //    $('a[href="#ordenes"]').on('shown.bs.tab', function (e) {
                //        $("#cboHoraProximaConsulta_chosen").attr("tabindex", -1).focus();
                //    });
                //    alerta('2', 'Seleccione la hora de la proxima Consulta.');
                //    return false;
                //}
            }
            /////////////////////////////////////////////////////////////////////////////////////////////
        }

        if ($('#chkNuevo').prop('checked') === false && !(Variables.EsConsejeriaObstetrica || Variables.EsConsejeriaOncologica || Variables.EsConsejeriaEstrategiasSanitaria)) {
            alerta('2', 'Seleccione un Episodio');
            $('.nav-tabs a[href="#ordenes"]').tab('show');
            $('#chkNuevo').focus();
            return false;
        }

        /////////////KHYOOSI (verficia si se ha guardado la hoja de refcon)///////////////////// 
        const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
        if (permisoRefcon == '1') {
            if (Referencias.estadoGuardadoRefCon == false) {
                alerta('2', 'No ha guardado los datos de Referencia o Contrareferencia.');
                return false;
            }
        }
        ////////////////////////////////////////

        if (objrow.idEstadoAtencion == 0) {
            alerta('2', 'La cuenta del paciente se encuentra anulada');
            return false
        }

        if (objrow.idEstadoAtencion == 2) {
            alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
            return false
        }

        return true;
    },

    GuardarAtencionMedica: async () => {
        let objrow = oTable_atenciones.api(true).row('.selected').data();
        var formData = new FormData();
        var epiNuevo = 0
        var epiCierre = 0

        let asignaDx = false
        let rowDx

        let continuaAtencionPrenatal = 0
        let dx = ObjtableDiagnosticos.api(true).data().toArray()

        if (await AtencionMedica.ValidaDatosObligatorios()) {

            //if (!isEmpty(Variables.IdReferencia) && $('#cboTipoAtencionAdolecencia').val() == 1) {
            //    $(dx).each(async (i, obj) => {
            //        if (obj.codigoCIE10 == 'Z359.1' || obj.codigoCIE10 == 'Z359.2' || obj.codigoCIE10 == 'Z359.3') {
            //            continuaAtencionPrenatal += 1
            //        }
            //    })

            //    if (continuaAtencionPrenatal == 0) {

            //        try {
            //            Cargando(0)

            //            rowDx = asignarDiagnosticosSemanaGestacional()

            //            asignaDx = await alertaAsync('warning', 'Diagnóstico recomendado',
            //                `La paciente tiene ${$("#txtSemanas").val()} semanas de gestación. <br> se debe agregar el Diagnostico:

            //                <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
            //                <tbody>
            //                <tr>
            //                    <th style="width: 30%; background: #f0f0f0; text-align: left; !important">Dx</th>
            //                    <td style="text-align: left !important;"> ${rowDx.codigoCIE10}</td>
            //                </tr>

            //                <tr>
            //                    <th style="width: 30%; background: #f0f0f0; text-align: left; !important">Descripcion</th>
            //                    <td style="text-align: left !important;"> ${rowDx.descripcion}</td>
            //                </tr>
            //                </tbody>
            //                </table>`)

            //        } catch (e) {
            //            return
            //        }
            //    }

            //    if (!asignaDx) {
            //        return
            //    } else {
            //        ObjtableDiagnosticos.api(true).row.add(rowDx).draw(false);
            //    }
            //    Cargando(1);
            //}


            ////////////////////PROXIMA CITA///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (Variables.IdEspecialidadIngreso >= 1 && Variables.IdEspecialidadIngreso <= 5) {
                if ($("#cboDestino").val() == '60' && Variables.IdCitaProxima == 0 && isEmpty($("#cboProgramacionProximaConsulta").val()) == false && isEmpty($("#cboHoraProximaConsulta").val()) == false) {
                    let filiacionPaciente = await Filiacion.SeleccionarAfiliacionSis(Variables.NroDocumento);
                    //console.log(filiacionPaciente);

                    let proxCita = await AtencionMedica.GuardarProximaCita(Variables.IdAtencion, Variables.IdCitaProxima, Variables.IdPaciente, $("#cboProgramacionProximaConsulta").val(), $("#cboHoraProximaConsulta").val(), $("#cboTipoConsulta").val(), Filiacion.IdSiaSis, Filiacion.Codigo);
                    if (proxCita == false) return;
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            if ($('#chkNuevo').prop('checked') === true) {
                epiNuevo = 1
            }

            if ($('#chkCierre').prop('checked') === true) {
                epiCierre = 1
            }

            /////////////////ATENCION//////////////////////////////////////////////////////
            formData.append('idAtencion', $('#idAtencion').val());
            formData.append('idCuentaAtencion', objrow.idCuentaAtencion);
            formData.append('idPaciente', $('#idPaciente').val());
            formData.append('idServicioIngreso', objrow.idServicioIngreso);
            formData.append('idDestinoAtencion', $('#cboDestino').val());
            formData.append('fechaEgreso', objrow.fechaIngreso);
            formData.append('fechaIngreso', objrow.fechaIngreso);
            formData.append('condicionEstablecimiento', $('#idEnEstablecimiento').val());
            formData.append('condicionservicio', $('#idEnServicio').val());
            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());
            formData.append("idTipoAtencionAdolescencia", $('#cboTipoAtencionAdolecencia').val());
            formData.append("idTipoAtencionAnestesio", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0);
            /////////////////////////////////////////////////////////////////////////////

            /////////////////ATENCION DATOS ADICIONALES//////////////////////////////////////////////////////
            formData.append('ProximaCita', $('#txtProximaConsulta').val());
            formData.append('idTipoConsultaProxCita', $("#cboTipoConsulta").val());
            formData.append("Tratamiento", $("#txtTratamiento").val());
            formData.append("PlanTrabajo", $("#txtPlanTrabajo").val());
            formData.append("enfermedadActual", $("#txtEnfermedadActual").val());
            formData.append("tiempoEnfermedad", $("#txtTiempoEmfermedad").val());
            formData.append("TipoTeleconsulta", $("#cboTipoTeleconsulta").val());
            formData.append('ClasificacionTipoAtencion', $("#cboClasificacionTipoAtencion").val());
            formData.append("Recomendaciones", $("#txtRecomendacionesAtencion").val());
            /////////////////////////////////////////////////////////////////////////////

            //////////////////ATENCION EPISODIO//////////////////////
            formData.append('numeroEpisodio', $('#cboEpisodio').val());
            formData.append('epiNuevo', epiNuevo);
            formData.append('epiCierre', epiCierre);
            /////////////////////////////////////////////////////////


            //////////////////ATENCION ENTREVISTA PACIENTE//////////////////////
            formData.append('TipoClasificacion', $('#cboClasisifcacion').val());
            formData.append('NroHistoria', objrow.nroHistoriaClinica);
            formData.append('NroControles', $('#txtControles').val());
            formData.append('EdadGest', $('#txtEdadGestacional').val());
            formData.append('NroGestas', $('#txtGestas').val());
            /////////////////////////////////////////////////////////

            //////////////////ATENCION DATOS AUXILIARES//////////////////////
            formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
            formData.append('antecedPatologico', $('#txtPatologicos').val());
            formData.append('antecedObstetrico', $('#txtObstetricos').val());
            formData.append('antecedAlergico', $('#txtAlergias').val());
            formData.append('antecedFamiliar', $('#txtFamiliares').val());
            formData.append('antecedentes', $('#txtOtros').val());
            formData.append("esPacienteCronico", $('#chkPacienteCronico').is(":checked") == true ? 1 : 0); //RMOREANO 04032026

            /////////////////////////////////////////////////////////


            ////////////////////DIAGNOSTICOS//////////////////////////////
            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
            /////////////////////////////////////////////////////////////


            //////////////////ATENCION TRIAJE//////////////////////////////////
            formData.append("NroHistoriaClinica", objrow.nroHistoriaClinica);
            formData.append("CitaFecha", objrow.fechaIngreso2);
            formData.append("CitaIdServicio", objrow.idServicioIngreso);

            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()

            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePerimCefalico", $("#txtPC").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());

            formData.append('CitaAntecedente', $('#txtAtencedentes').val());
            formData.append("CitaObservaciones", $("#txtOtrasObservacionesGe").val());
            /////////////////////////////////////////////////////////


            formData.append('idMedico', objrow.idMedico);
            formData.append('tipoModulo', Variables.TipoModulo);





            if (Variables.TipoModulo == 'ModuloEspecialidades' || Variables.TipoModulo == 'ModuloEspecialidadesAdolescencia' || Variables.TipoModulo == 'Odontologia') {
                formData = await Especialidades.CargarFormData(formData);

                if (Variables.TipoModulo == 'Odontologia') {
                    //Variables.TipoModulo = 'ModuloOdontologico';
                    await Odonto.GuardarAtencion();
                }
            }

            if (Variables.TipoModulo == 'ModuloMaterno' || Variables.TipoModulo == 'ModuloMaternoAdolescencia') {
                formData = await Perinatal.CargarFormData(formData);
            }

            if (Variables.TipoModulo == 'ModuloNAR') {
                formData = await NinioAltoRiesgo.CargarFormData(formData);
                if (!NinioAltoRiesgo.validaItems()) {
                    alerta('2', 'Seleccione todos los items a eveluar');
                    return false;
                }
            }

            if (Variables.TipoModulo == 'ModuloAnestesio') {
                Anestesiologia.GuardarAtencionAnestesiologia()
            }

            if (Variables.TipoModulo == 'ModuloConsejeriaObstetrica') {
                formData = await ConsejeriaObstetrica.CargarFormData(formData)
            }

            if (Variables.TipoModulo == 'ModuloEstrategiasSanitaria') {
                formData = await ConsejeriaEstrategiaSanitaria.CargarFormData(formData)
            }

            if (Variables.TipoModulo == 'ModuloOnco') {
                formData = await ConsejeriaOncologica.CargarFormData(formData)
            }

            formData.append('idEmpleadoMedico', objrow.idEmpleadoMedico);
            formData.append('codigo', objrow.code);
            formData.append('idReferencia', Referencias.idReferencia);
            formData.append('idContraReferencia', Referencias.idContraReferencia);


            formData.append('idListBar', ObtenerItemListBar());
            //console.log(formData);
            //DATOS DE LA ATENCION CE



            //formData.append('lstRecetaRx', ListaRecetaDetalleRx);
            //formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
            //formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
            //formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());

            //RQ0002 DATOS ADICIONALES DE LA ATENCION 

            //var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
            //var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
            //var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
            //var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
            //var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
            //var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
            //var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
            //var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12) // jdelgado011
            

            AtencionMedica.CambiarEstadoColaCita(null, $('#idAtencion').val(), 6, "Atendido", '');// 6 : Atendido -- MGAMERO

            alerta(4, 'Guardando Atención, por favor espere.');
            let datos;
            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Atencion/RegitraModificaAtencion?area=ConsultaExterna",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                if (datos) {
                    if (datos.session) {
                        if (datos.respuesta == true) {

                            if (Variables.TipoModulo == 'ModuloConsejeriaObstetrica') {
                                formData = await ConsejeriaObstetrica.InsertFactCatalogo()
                            }
                            if (Variables.TipoModulo == 'ModuloOnco') {
                                formData = await ConsejeriaOncologica.InsertFactCatalogo()
                            }

                            alerta('1', 'Se  registro correctamente la atención');
                            $('#btnBuscarAtenciones').trigger('click');
                            //Cargando(0);
                            return true
                        } else {
                            alerta('2', datos.mesanje);
                            //Cargando(0);
                            return false;
                        }
                    }
                    else {
                        //swal({
                        //    title: 'Atenciones',
                        //    text: "Su session ya expiro, vuelva a ingresar en otra ventana",
                        //    type: 'info',
                        //}).done();
                        alerta(2, "La sesión ya expiro, por favor inicie sesión nuevamente.");
                        $("#modalLogin").modal('show');
                    }
                } else {
                    alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
                }
                return false;
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }

            alerta('1', 'Exito!!!!');
        }
    },

    GuardarAtencion: async () => {
        let objrow = oTable_atenciones.api(true).row('.selected').data();



        if (objrow.idEstadoAtencion == 1) {

            var formData = new FormData();


            //if ($('#chkEsEvaluacionPreAnestesica').is(':checked')) { // para atención pre-anestésica
            //    Anestesiologia.GuardarAtencionAnestesiologia()
            //}



            // Fin NINIO SANO



            // FIN RQ0002

            //DATOS DE PERINATAL
            //DATOS PROCABECERA

            if (objrow.usaModuloMaterno == true) {
                formData.append('CEperinatal', true);
            }
            else {
                formData.append('CEperinatal', false);
            }






            //JDELGADO011 INTERCONSULTA
            formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
            formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
            formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
            formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
            //JDELGADO011 INTERCONSULTA

            // jdelgado anestesio
            formData.append("esPreAnestesica", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0)
            // jdelgado anestesio



            //NINIO SANO 
            //ninio sano remplaza tencion

            if (objrow.usaModuloNinoSano == true) {

            } else {
                formData.append('CEninioSano', false);


            }

            alerta(4, 'Guardando Atención, por favor espere.');
            let datos;
            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Atencion/RegitraModifcaEpisodio?area=ConsultaExterna",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                if (datos) {
                    if (datos.session) {
                        if (datos.respuesta == true) {
                            alerta('1', 'Se  registro correctamente la atención');
                            Cargando(0);
                            return true
                        } else {
                            alerta('2', datos.mesanje);
                            Cargando(0);
                            return false;
                        }
                    }
                    else {
                        //swal({
                        //    title: 'Atenciones',
                        //    text: "Su session ya expiro, vuelva a ingresar en otra ventana",
                        //    type: 'info',
                        //}).done();
                        alerta(2, "La sesión ya expiro, por favor inicie sesión nuevamente.");
                        $("#modalLogin").modal('show');
                    }
                } else {
                    alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
                }
                return false;
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }

        } else {
            alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
            return false
        }
    },

    GuardarAtencionV2: async () => {
        let objrow = oTable_atenciones.api(true).row('.selected').data();
        fechaDiaValor = AtencionMedica.fechaDia();
        valorFecha = AtencionMedica.fechaCorrecta(objrow.fechaIngreso2, fechaDiaValor)

        if (await AtencionMedica.ValidaDatosObligatorios()) {
            if ($('#chkNuevo').prop('checked') === true) {
                epiNuevo = 1
            }

            if ($('#chkCierre').prop('checked') === true) {
                epiCierre = 1
            }
        } else {
            return false;
        }


        if (objrow.idEstadoAtencion == 1) {
            var epiNuevo = 0
            var epiCierre = 0
            if ($('#chkNuevo').prop('checked') === true) {
                epiNuevo = 1
            }

            if ($('#chkCierre').prop('checked') === true) {
                epiCierre = 1
            }

            var formData = new FormData();

            var ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21)
            var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23)
            var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20)
            var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3)
            var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2)
            var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11)
            var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5)
            var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12) // jdelgado011

            //-----------------------------DATOS EXTERNOS
            formData.append('fechaIngreso', objrow.fechaIngreso);
            formData.append('antecedQuirurgico', $('#txtQuirurgicos').val());
            formData.append('antecedPatologico', $('#txtPatologicos').val());
            formData.append('antecedObstetrico', $('#txtObstetricos').val());
            formData.append('antecedAlergico', $('#txtAlergias').val());
            formData.append('antecedFamiliar', $('#txtFamiliares').val());
            formData.append('antecedentes', $('#txtOtros').val());

            if ($('#chkEsEvaluacionPreAnestesica').is(':checked')) { // para atención pre-anestésica
                Anestesiologia.GuardarAtencionAnestesiologia()
            }

            //NINIO SANO cambia motivo de consulta
            //if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
            if (Variables.TipoModulo == 'ModuloEspecialidades' || Variables.TipoModulo == 'ModuloOnco' || Variables.TipoModulo == 'ModuloEspecialidadesAdolescencia') {
                formData.append('CitaMotivo', $('#txtMotivoCons').val());
                formData.append('CitaExamenClinico', $('#txtExamenC').val());
            } else {
                //if (objrow.usaModuloNinoSano) {
                if (Variables.TipoModulo == "ModuloNAR") {
                    formData.append('CitaMotivo', $('#txtMotivoConsNinio').val());
                    formData.append('CitaExamenClinico', $('#txtExamenCNinio').val());
                    formData.append('enfermedadActual', $('#txtEnfermedadActual').val());
                    formData.append('tiempoEnfermedad', $('#txtTiempoEmfermedad').val());
                }
                //if (objrow.usaModuloMaterno) {
                if (Variables.TipoModulo == "ModuloMaterno" || Variables.TipoModulo == "ModuloMaternoAdolescencia") {
                    formData.append('CitaMotivo', $('#txtMotivoConsultaPeri').val());
                }
            }

            // Fin NINIO SANO

            formData.append('HoraInicioAtencion', $('#HoraInicioAtencion').val());
            formData.append('CitaAntecedente', $('#txtAtencedentes').val());
            //--------------------------------------------------------------------
            formData.append('idEnEstablecimiento', $('#idEnEstablecimiento').val());
            formData.append('idEnServicio', $('#idEnServicio').val());

            formData.append('tipoClasificacion', $('#cboClasisifcacion').val());
            formData.append('nroHistoria', objrow.nroHistoriaClinica);
            formData.append('nroControles', $('#txtControles').val());
            formData.append('edadGestacional2', $('#txtEdadGestacional').val());
            formData.append('nroGestas', $('#txtGestas').val());

            formData.append('idMedico', objrow.idMedico);
            formData.append('idServicioIngreso', objrow.idServicioIngreso);
            formData.append('idCuentaAtencion', objrow.idCuentaAtencion);
            formData.append('nroEpisodio', $('#cboEpisodio').val());
            formData.append('idPaciente', $('#idPaciente').val());
            formData.append('epiNuevo', epiNuevo);
            formData.append('epiCierre', epiCierre);
            formData.append('idAtencion', $('#idAtencion').val());

            //DATOS DE LA ATENCION CE

            formData.append('idDestino', $('#cboDestino').val());
            formData.append('lstDiagnosticos', JSON.stringify(ListDiagnosticos.toArray()));
            formData.append('lstRecetaRx', ListaRecetaDetalleRx);
            formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
            formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
            formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());

            //RQ0002 DATOS ADICIONALES DE LA ATENCION 

            formData.append('ProximaCita', $('#txtProximaConsulta').val());
            formData.append('idTipoConsultaProxCita', $("#cboTipoConsulta").val());

            // FIN RQ0002

            //DATOS DE PERINATAL
            //DATOS PROCABECERA

            if (Variables.TipoModulo == "ModuloMaterno" || Variables.TipoModulo == "ModuloMaternoAdolescencia") {
                formData.append('CEperinatal', true);
            }
            else {
                formData.append('CEperinatal', false);
            }

            formData.append('IdPrograma', 1);
            formData.append('IdProcabecera', $("#idCabecera").val());

            if ($("#idControl").val() == 0) {
                formData.append('IdControl', 1);
            }
            else {
                formData.append('IdControl', $("#idControl").val());
            }

            formData.append('FechaControl', $('#txtFechaControl').val());
            //DATOS EVAL. EMERGENCIA

            formData.append("IdAtencion", objrow.idAtencion);
            formData.append("FechaUR", $("#txtFUM").val());
            formData.append("FechaPP", $("#txtFPP").val());
            formData.append("Cnp", $("#txtCPNveces").val());         //KHOYOSI 150725
            formData.append("EdadGestacional", $("#txtSemanas").val());
            formData.append("NroFetos", $("#txtNroFetos").val());
            formData.append("DiasGestacionalEco", $("#txtDiasEco").val());
            formData.append("SemanaGestacionalEco", $("#txtSemasEco").val());

            if ($('#chkMuestraEco').prop('checked') === false) {
                formData.append("FechaEcoAct", 0);
                formData.append("FechaEco", "");
            } else {
                formData.append("FechaEcoAct", 1);
                formData.append("FechaEco", $("#txtFEcog").val());
            }

            formData.append("DiasGestacional", $("#txtDias").val());

            if ($('#chkCalculaFechaEco').prop('checked') === false) {
                formData.append("CalculaFE", 0);
            } else {
                formData.append("CalculaFE", 1);
            }

            /***********************ANTECEDENTES PERSONALES*****************************/
            formData.append("Tbc", $('#rdbTbcPSi').prop('checked'));
            formData.append("TbcDescripcion", $("#txtTbcP").val());
            formData.append("Diabetes", $('#rdbPDiabSi').prop('checked'));
            formData.append("DiabetesDescripcion", $("#txtPDiabe").val());
            formData.append("PreeclampsiaEclampsia", $('#rdbPreePSi').prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcion", $("#txtPreeP").val());
            formData.append("Vih", $('#rdbVIHSi').prop('checked'));
            formData.append("vihDescripcion", $("#txtVihP").val());
            formData.append("Alergia", $('#rdbAlergSi').prop('checked'));
            formData.append("AlergiaDescripcion", $("#txtAlergiaP").val());
            formData.append("Otros", $('#rdbOtrosAntePerSi').prop('checked'));
            formData.append("OtrosDescripcion", $("#txtOtrosP").val());
            formData.append("CirugiaMayor", $('#rdbCMSi').prop('checked'));
            formData.append("CirugiaMayorDescripcion", $("#txtCM").val());
            formData.append("Violencia", $('#rdbVioSi').prop('checked'));
            formData.append("ViolenciaDescripcion", $("#txtVio").val());
            formData.append("Hipertencion", $('#rdbHiperPSi').prop('checked'));
            formData.append("HipertencionDescripcion", $("#txtHiperP").val());

            formData.append("VacunaPrevia", $('#rdbVacunaPreSi').prop('checked'));
            formData.append("VacunaPreviaDescripcion", $("#txtVacunaPre").val());


            /***********************ANTECEDENTES FAMILIARES*****************************/
            formData.append("TbcFam", $("#rdbTbcSi").prop('checked'));
            formData.append("TbcDescripcionFam", $("#txtTbc").val());
            formData.append("DiabetesFam", $("#rdbDiabSi").prop('checked'));
            formData.append("DiabetesDescripcionFam", $("#txtDiabe").val());
            formData.append("PreeclampsiaEclampsiaFam", $("#rdbPreeSi").prop('checked'));
            formData.append("PreeclampsiaEclampsiaDescripcionFam", $("#txtPree").val());
            formData.append("OtraCondMedGraveDescripcionFam", $("#txtOtrosFam").val());
            formData.append("OtraCondMedGraveFam", $("#rdbOtrosSi").prop('checked'));
            formData.append("HipertencionFam", $("#rdbHiperSi").prop('checked'));
            formData.append("HipertencionDescripcionFam", $("#txtHiper").val());
            /***********************ANTECEDENTES OBSTETRICOS**************************************/

            formData.append("Gestas", $("#txtGestasP").val());
            formData.append("abortos", $("#txtAbortos").val());
            formData.append("Vaginales", $("#txtVaginales").val());
            formData.append("NacidosVivos", $("#txtNacidosVivos").val());
            formData.append("Viven", $("#txtViven").val());
            formData.append("Partos", $("#txtPartos").val());
            formData.append("Cesareas", $("#txtCesareas").val());
            formData.append("NacidosMuertos", $("#txtNacMuertos").val());
            formData.append("Muerto1Seman", $("#txt1Sem").val());
            formData.append("Despues1Seman", $("#txtDesp1Sem").val());

            formData.append("ceromastres", $("#cho3").prop('checked'));//cho3
            formData.append("menor2500gr", $("#ch2500").prop('checked'));
            formData.append("Multiple", $("#chMult").prop('checked'));
            formData.append("memor37sm", $("#ch37Sem").prop('checked'));

            formData.append("PesoPregestacional", $("#txtPesoPregesta").val());
            formData.append("FechaFinEmbarazoAnt", $("#txtFinEmb").val());
            formData.append("idTerminacion", $("#cboTerminacion").val());

            //alert($("#cboAborto").val());

            formData.append("idAborto", $("#cboAborto").val());
            formData.append("FracasoMetodo", $("#cbofracaso").val());
            formData.append("EmbarazoPlaneado", $("#cboEmbplaneado").val());
            formData.append("EmbarazoEctopico", $("#chEtopico").prop('checked'));
            formData.append("mayor4000g", $("#ch4000g").prop('checked'));
            formData.append("P1", $("#txtPar1").val());
            formData.append("P2", $("#txtPar2").val());
            formData.append("P3", $("#txtPar3").val());
            formData.append("P4", $("#txtPar4").val());

            //GIENCOOBSTETRA
            //formData.append("IdAtencion", $("#").val());
            formData.append("LGeBus", ($('#rdbGBNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LVagina", ($('#rdVaginadNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LCervix", ($('#rdbCervixNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LUtero", ($('#rdbUteroNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DGeBus", $("#txtGB").val());
            formData.append("DVagina", $("#txtVagina").val());
            formData.append("DCervix", $("#txtCervix").val());
            formData.append("DUtero", $("#txtUtero").val());
            formData.append("LAnexos", ($('#rdbAnexosNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LDouglas", ($('#rdbFsDouglasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LParametros", ($('#rdbParamNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LMamas", ($('#rdbMamasNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DAnexos", $("#txtAnexos").val());
            formData.append("DDouglas", $("#txtFsDouglas").val());
            formData.append("DParametros", $("#txtParam").val());
            formData.append("DMamas", $("#txtMamas").val());

            formData.append("LUA", $("#txtAlturaUterina").val());
            formData.append("LLCF", $("#txtLfc").val());
            formData.append("LDU", $("#txtDU").val());

            var situacion, posicion, presentacion, dips = 0;
            situacion = $('#rdbSitLongitudinal').prop('checked') == true ? 1 : $('#rdbSitTransversal').prop('checked') == true ? 0 : 5
            formData.append("LSituacion", situacion);

            posicion = $('#rdbPosDerecha').prop('checked') == true ? 1 : $('#rdbPosIzquierda').prop('checked') == true ? 0 : 5
            formData.append("LPosicion", posicion);

            presentacion = $('#rdbPreCefalica').prop('checked') == true ? 1 : $('#rdbPrePodalica').prop('checked') == true ? 0 : 5
            formData.append("LPresentacion", presentacion);

            dips = $('#rdbDipsI').prop('checked') == true ? 1 : $('#rdbDipsII').prop('checked') == true ? 2 : $('#rdbDipsIII').prop('checked') == true ? 3 : 4
            formData.append("LDips", dips);

            formData.append("DF1Spp", $("#txtF1SiPoPr").val());
            formData.append("DF2Spp", $("#txtF2SiPoPr").val());
            formData.append("DF3Spp", $("#txtF3SiPoPr").val());
            formData.append("LF1Lcf", $("#txtF1Lfc").val());
            formData.append("LF2Lcf", $("#txtF2Lfc").val());
            formData.append("LF3Lcf", $("#txtF3Lfc").val());

            formData.append("LSoplos", ($('#rdbSoplosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LHidraminios", ($('#rdbHidromiosSi').prop('checked') == true) ? 1 : 0);
            formData.append("LPonderado", $("#txtPonderado").val());


            //formData.append("LDilatacion", $("#txtPonderado").val());

            formData.append("DObservaciones", $("#txtObserControl").val());
            formData.append("LEstadoGeneral", ($('#rdbEstGSNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoCV", ($('#rdbCardNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAbdomen", ($('#rdbAbdomenNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoR", ($('#rdbAptRespNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LAparatoU", ($('#rdbAptUrinpNormal').prop('checked') == true) ? 1 : 0);
            formData.append("LExtremidades", ($('#rdbExtremNormal').prop('checked') == true) ? 1 : 0);
            formData.append("DEstadoGeneral", $("#txtEstdGeneSens").val());
            formData.append("DAparatoCV", $("#txtCardvas").val());
            formData.append("DAbdomen", $("#txtAbdomenNormal").val());
            formData.append("DAparatoR", $("#txtbAptResp").val());
            formData.append("DAparatoU", $("#txtbAptUrin").val());
            formData.append("DExtremidades", $("#txtExtrem").val());
            formData.append("LTipoEmbarazo", $("#cboTipoEmbrazo").val());

            formData.append("DEdemas", $("#txtEdemas").val());
            formData.append("DReflejos", $("#txtReflejos").val());

            formData.append("ObservacionGinecologica", $("#txtObserExamenes").val());

            formData.append("Proteinura", $("#txtProteinuria").val());
            formData.append("MovFetales", $("#txtMovFetales").val());
            formData.append("MFF01", $("#txtF1Mf").val());
            formData.append("MFF02", $("#txtF2Mf").val());
            formData.append("MFF03", $("#txtF3Mf").val());

            formData.append("SignosAlarma", $("#txtsignosAlarma").val());
            formData.append("Pap", $('#rdbPapSi').prop('checked'));

            //Traije
            formData.append("NroHistoriaClinica", objrow.nroHistoriaClinica);
            formData.append("CitaFecha", objrow.fechaIngreso2);
            formData.append("CitaIdServicio", objrow.idServicioIngreso);

            presion = $("#txtPA").val() + "/" + $("#txtPAD").val()


            formData.append("TriajePresion", presion);
            formData.append("TriajeTemperatura", $("#txtT").val());
            formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
            formData.append("TriajeFrecCardiaca", $("#txtFc").val());
            formData.append("TriajePerimCefalico", $("#txtPC").val());
            formData.append("TriajePeso", $("#txtPeso").val());
            formData.append("TriajeTalla", $("#txtTalla").val());
            formData.append("CitaObservaciones", $("#txtOtrasObservacionesGe").val()); //se 

            //pelvis
            formData.append("LPelvisGinecoide", $('#rdbPelvisGSI').prop('checked') == true ? 1 : 0);
            formData.append("LCompatibilidadF", $('#rdbCompativilidadSI').prop('checked') == true ? 1 : $('#rdbCompativilidadNo').prop('checked') == true ? 2 : 0);

            //nuevos 
            formData.append("Tratamiento", $("#txtTratamiento").val());
            formData.append("PlanTrabajo", $("#txtPlanTrabajo").val());

            //JDELGADO011 INTERCONSULTA
            formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
            formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
            formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
            formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
            //JDELGADO011 INTERCONSULTA

            // jdelgado anestesio
            formData.append("esPreAnestesica", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0)
            // jdelgado anestesio

            // jdelgado adolescencia
            formData.append("idTipoAtencionAdolescencia", $('#cboTipoAtencionAdolecencia').val())
            // jdelgado adolescencia

            //KHOYOSI - Tipo Atencion Anestesio
            formData.append("idTipoAtencionAnestesio", $('#chkEsEvaluacionPreAnestesica').is(':checked') ? 1 : 0)
            //KHOYOSI - Tipo Atencion Anestesio

            //NINIO SANO 
            //ninio sano remplaza tencion

            //if (objrow.usaModuloNinoSano == true) {
            if (Variables.TipoModulo == "ModuloNAR") {
                formData.append("Apetito", $("#txtApetitoNinio").val());
                formData.append("Suenio", $("#txtSuenioNinio").val());
                formData.append("Sed", $("#txtSedNinio").val());
                formData.append("Orina", $("#txtOrinaNinio").val());
                formData.append("Deposiciones", $("#txtDiposicionesNinio").val());

                formData.append('CEninioSano', true);
                formData.append("tipoEmbarazo", $('#rdbEmbarazoNormal').prop('checked') == true ? 1 : 2);
                formData.append("patologias", $("#txtPatologia").val());
                formData.append("nroEmbarazo", $("#txtNroEmbarazo").val());
                formData.append("atencionPrenatal", $('#rdbAtenPrenatalSi').prop('checked') == true ? 1 : 2);
                formData.append("nroApn", $("#txtNroAPN").val());
                formData.append("lugarApn", $("#txtLugarAPN").val());
                formData.append("tipoParto", $('#rdbPartoEutocico').prop('checked') == true ? 1 : 2);
                formData.append("complicacionParto", $("#txtComplicaciones").val());
                formData.append("lugarParto", $('#rdbLugarPartoEeSs').prop('checked') == true ? 1 : $('#rdbLugarPartoDomicilio').prop('checked') == true ? 2 : 3);
                formData.append("atendidoPor", $('#rdbAtendidoPorPS').prop('checked') == true ? 1 : $('#rdbAtendidoPorTec').prop('checked') == true ? 2 : $('#rdbAtendidoPorACS').prop('checked') == true ? 3 : $('#rdbAtendidoPorFM').prop('checked') == true ? 4 : 5);
                formData.append("atendidoPorotro", $("#txtAtendidoPorOtro").val());
                //->nacimiento
                formData.append("estaGestacionalAlNacer", $("#txtEdadGestacionalNacer").val());
                formData.append("pesoAlNacer", $("#txtPesoNacer").val());
                formData.append("tallaAlNacer", $("#txtTallaNacer").val());
                formData.append("perimetroCefalico", $("#txtPerimetricoCefalico").val());
                formData.append("perimetroToracico", $("#txtPerimetricoToracico").val());

                formData.append("inmedito", $('#rdbInmediatoSi').prop('checked') == true ? 1 : 2);
                formData.append("apgar1min", $("#txtAPGAR1").val());
                formData.append("apgar5min", $("#txtAPGAR5").val());
                formData.append("reanimacion", $('#rdbReanimacionSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatal", $('#rdbPatologiaNeoSi').prop('checked') == true ? 1 : 2);
                formData.append("patologiaNeonatalDescripcion", $("#txtEspecifique").val());
                formData.append("hospitalizacion", $('#rdbHospitalizacionSi').prop('checked') == true ? 1 : 2);
                formData.append("tiempoHospitalizado", $("#txtTiempoHospitalizacion").val());

                //->alimentacion/patologicos
                formData.append("alimentPrimerosSeisMeses", $('#rdbPrimMesesLME').prop('checked') == true ? 1 : $('#rdbPrimMesesMIXTA').prop('checked') == true ? 2 : 3);
                formData.append("alimentInicioAlimentacionComplementaria", $("#txtIncioAlimComplementaria").val());
                formData.append("alimentSumplementoFe", $('#rdbSumplementoSi').prop('checked') == true ? 1 : 2);

                formData.append("patTbc", $('#rdbNinoTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("patSobaAsma", $('#rdbNinoSobaAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("patEpilepsia", $('#rdbNinoEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patInfecciones", $('#rdbNinoInfeccionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patHospitalizaciones", $('#rdbNinoHospitalizacionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patTransferenciaSangre", $('#rdbNinoTransfucionesSi').prop('checked') == true ? 1 : 2);
                formData.append("patCirugia", $('#rdbNinoCirugiaSi').prop('checked') == true ? 1 : 2);
                formData.append("patDisplacia", $('#rdbNinoDisplacíaSi').prop('checked') == true ? 1 : 2);
                formData.append("patHipotiroidismo", $('#rdbNinoHipotiroidismoSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergia", $('#rdbNinoAlergiaMedSi').prop('checked') == true ? 1 : 2);
                formData.append("patOtroAntecedentes", $('#rdbNinoOtrosAntecSi').prop('checked') == true ? 1 : 2);
                formData.append("patAlergiaDesc", $("#txtNinoSanoAlergiaMedicamentos").val());
                formData.append("patOtroAntecedentesDesc", $("#txtNinoSanoOtroAntec").val());

                //->Familaires/Viveinda 
                formData.append("famiTuberculosis", $('#rdbNinoFamiliaresTbcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiTuberculosisDesc", $("#txtNinoFamiliaresTbc").val());
                formData.append("famiAsma", $('#rdbNinoFamiliaresAsmaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAsmaDesc", $("#txtNinoFamiliaresAsma").val());
                formData.append("famiVih", $('#rdbNinoFamiliaresSidaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiVihDesc", $("#txtNinoFamiliaresSida").val());
                formData.append("famiDiabetes", $('#rdbNinoFamiliaresDiabetesSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDiabetesDesc", $("#txtNinoFamiliaresDiabetesSi").val());
                formData.append("famiEpilepsia", $('#rdbNinoFamiliaresEpilepsiaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiEpilepsiaDesc", $("#txtNinoFamiliaresEpilepsia").val());
                formData.append("famiAlerMedica", $('#rdbNinoFamiliaresAlergiaMedcSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlerMedicaDesc", $("#txtNinoFamiliaresAlergiaMedc").val());
                formData.append("famiViolenciaFami", $('#rdbNinoFamiliaresViolenciaSi').prop('checked') == true ? 1 : 2);
                formData.append("famiViolenciaFamiDesc", $("#txtNinoFamiliaresViolencia").val());
                formData.append("famiAlcoholismo", $('#rdbNinoFamiliaresAlcoholismoSi').prop('checked') == true ? 1 : 2);
                formData.append("famiAlcoholismoDesc", $("#txtNinoFamiliaresAlcoholismo").val());
                formData.append("famiDrogadiccion", $('#rdbNinoFamiliaresDrogadiccionSi').prop('checked') == true ? 1 : 2);
                formData.append("famiDrogadiccionDesc", $("#txtNinoFamiliaresDrogadiccion").val());
                formData.append("famiHepatitisB", $('#rdbNinoFamiliaresHepatitisSi').prop('checked') == true ? 1 : 2);
                formData.append("famiHepatitisBDesc", $("#txtNinoFamiliaresHepatitis").val());
                formData.append("viviendaAguaPotable", $('#rdbAguaPotableSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaAguaPotableDesc", $("#txtAguaPotable").val());
                formData.append("viviendaDesague", $('#rdbDesagueSi').prop('checked') == true ? 1 : 2);
                formData.append("viviendaDesagueDesc", $("#txtDesague").val());

                var listaItmsEValuar = NinioAltoRiesgo.DevolverItems();
                formData.append('listaItmsEValuar', listaItmsEValuar);
                formData.append("idPlanDesarrolloPaciente", $("#hdidPlanDesarrolloPaciente").val());
                formData.append("idPlanIntegralPaciente", $("#hdidPlanIntegralPaciente").val());
                formData.append("fechaProgramada", $("#txtFechaProgramada").val());
                formData.append("fechaEjecucion", $("#txtFechaEjecucion").val());
                formData.append("idEstablecimiento", $("#hdidEstablecimiento").val());
                formData.append("evaluacion", NinioAltoRiesgo.obtenerEvaluacion());

                if (!NinioAltoRiesgo.validaItems()) {
                    alerta('2', 'Seleccione todos los items a eveluar');
                    return false;
                }
            } else {
                formData.append('CEninioSano', false);

                formData.append("Apetito", $("#txtApetito").val());
                formData.append("Suenio", $("#txtSuenio").val());
                formData.append("Sed", $("#txtSed").val());
                formData.append("Orina", $("#txtOrina").val());
                formData.append("Deposiciones", $("#txtDiposiciones").val());
            }

            alerta(4, 'Guardando Atención, por favor espere.');
            let datos;
            try {
                Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Atencion/RegitraModifcaEpisodio?area=ConsultaExterna",
                        data: formData,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                if (datos) {
                    if (datos.session) {
                        if (datos.respuesta == true) {
                            alerta('1', 'Se  registro correctamente la atención');
                            Cargando(0);
                            return true
                        } else {
                            alerta('2', datos.mesanje);
                            Cargando(0);
                            return false;
                        }
                    }
                    else {
                        //swal({
                        //    title: 'Atenciones',
                        //    text: "Su session ya expiro, vuelva a ingresar en otra ventana",
                        //    type: 'info',
                        //}).done();
                        alerta(2, "La sesión ya expiro, por favor inicie sesión nuevamente.");
                        $("#modalLogin").modal('show');
                    }
                } else {
                    alerta('2', 'Ocurrio un error al registrar la atencion de,Error ');
                }
                return false;
            } catch (error) {
                Cargando(0);
                alerta(3, error);
            }

        } else {
            alerta('2', 'La Atencion del paciente ya se encuentra cerrada');
            return false
        }
    },

    GeneraParteDiario: async (programacion) => {
        var formData = new FormData();
        let datos;
        let resp = '';

        formData.append('programacion', programacion);
        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/GenerarParteDiario?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);
            //if (datos.estadoCreacion == 'Ok') {
            if (datos.respuesta) {
                //resp = true;
                resp = datos.code;
            } else {
                if (datos.estadoCreacion == 'NONE') {
                    alerta(2, 'No existen datos para mostrar.');
                }
            }
        } catch (error) {
            //console.error(error)
            Cargando(0);
            alerta(3, error);
        }

        return resp;
    },

    CambiarEstadoColaCita(idCita, idAtencion, idEstadoColaCita, justificacion, idUsuarioAuditoria) {
        var midata = new FormData();
        midata.append("idCita", idCita);
        midata.append("idAtencion", idAtencion);
        midata.append("idEstadoColaCita", idEstadoColaCita);
        midata.append("Justificacion", justificacion);
        midata.append("IdUsuarioAuditoria", idUsuarioAuditoria || '');

        Cargando(1);

        $.ajax({
            url: "/Admision/ConfirmarLlegadaCE?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function(datos) {
                //alerta(1, "Los datos se modificaron correctamente");
                //$('#modalLlegada').modal('hide');
                //$('#btnBuscar').trigger('click');
                Cargando(0);
            },
            error: function(msg) {
                alerta("ERROR", "Error al cambiar estado de cola!", "2");
                Cargando(0);
            }
        });
    },

    InitDatablesAtenciones: () => {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "horaInicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoColaCita",
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).css('white-space', 'nowrap');
                        const estado = (rowData.estadoColaCita || '').trim();

                        // Clase por estado (puedes ajustar colores)
                        let cls = 'secondary';

                        if (estado === 'Citado') cls = 'blue';
                        else if (estado === 'Llego') cls = 'info';          // <-- cian
                        else if (estado === 'Triaje') cls = 'warning';      // <-- amarillo
                        else if (estado === 'Llamando') cls = 'danger';     // <-- rojo
                        else if (estado === 'En Atencion') cls = 'primary';
                        else if (estado === 'Atendido') cls = 'success';    // <-- verde (final)
                        else if (estado === 'No se Presento') cls = 'secondary';

                        $(td).html('<span class="chip ' + cls + '">' + estado + '</span>');
                    },
                    width: "4%"
                },
                //{
                //    width: '10%',
                //    targets: 2,
                //    data: "apellidoPaterno",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 3,
                //    data: "apellidoMaterno",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                //{
                //    width: '10%',
                //    targets: 4,
                //    data: "nombres",
                //    visible: false,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')                        
                //    }
                //},
                {
                    width: '15%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(rowData.apellidoPaterno + " " + rowData.apellidoMaterno + " " + rowData.nombres);
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "telefono",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "planA",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                },
                {
                    width: '7%',
                    targets: 6,
                    data: null,
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');

                        if (rowData.estadoCita == "Separada") {
                            $(td).html('<span class="chip orange">' + rowData.estadoCita + '</span>');
                        }
                        else if (rowData.estadoCita == "Atendido") {
                            $(td).html('<span class="chip success">' + rowData.estadoCita + '</span>');
                        }
                        else if (rowData.estadoCita == "Pagada") {
                            $(td).html('<span class="chip blue">' + rowData.estadoCita + '</span>');
                        }
                        else if (rowData.estadoCita == "Vencida (No pagada)") {
                            $(td).html('<span class="chip secondary">' + rowData.estadoCita + '</span>');
                        }
                        else if (rowData.estadoCita == "Anulado") {
                            $(td).html('<span class="chip danger">' + rowData.estadoCita + '</span>');
                        }
                        else {
                            // por si viene algo inesperado
                            $(td).html('<span class="chip secondary">' + (rowData.estadoCita || '') + '</span>');
                        }
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "horaInicioAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }

                },
                {
                    width: '5%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.usaModuloMaterno) {
                            $(td).html('<button class="btnCarnetPrenatal btn btn-sm btn-indigo glow_button" title="Visualiza Carnet Prenatal" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-address-card"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                },
                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                {
                    width: '7%',
                    targets: 9,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";
                            //var rutaBit4Id = "";

                            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            }


                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },
                //////////////////////////KHOYOSI (TICKET PROXIMA CITA)///////////////////////////////////////
                {
                    width: '5%',
                    targets: 10,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                        //KHOYOSI
                        //if (ValidarServicioCarnetPrenatal(rowData.idServicioIngreso)) {
                        if (rowData.idCitaProxima > 0) {
                            $(td).html('<button class="btnImprimirTicketProximaCita btn btn-sm btn-teal glow_button" title="Visualiza Ticket Proxima Cita" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-calendar-heart"></i> </button>');
                        } else {
                            $(td).html("");
                        }
                        //KHOYOSI
                    }
                },
                //////////////////////////KHOYOSI (RECETAS)///////////////////////////////////////
                {
                    width: '7%',
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {
                            var btnRecetas = "";
                            //var rutaBit4Id = "";

                            if (rowData.tieneRecetas > 0) {
                                btnRecetas = '<button class="btnImprimeRecetas btn btn-sm btn-cyan glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-note-medical"></i> </button>';
                            }

                            $(td).html(btnRecetas);
                        }
                        else {
                            $(td).html('');
                        }


                    }
                },
                //{
                //    width: '8%',
                //    targets: 13,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRecetas = "";
                //            //var rutaBit4Id = "";

                //            if (rowData.codeProc != 0) {
                //                btnRecetas = '<button class="btnImprimepRrocedimientos btn btn-sm btn-cyan glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-note-medical"></i> </button>';
                //            }

                //            $(td).html(btnRecetas);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},
                //////////////////////////KHOYOSI (REFCON)///////////////////////////////////////                
                {
                    width: '7%',
                    targets: 12,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idReferencia > 0 || rowData.idContraReferencia > 0) {
                                btnImprimeSinF = '<button class="ImprimeHojaRefConSF btn btn-sm btn-warning glow_button" title="Visualiza REFCON" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                                if (permisoRefcon == '1' && (rowData.codeRef != '0' || rowData.codeCRef != '0')) {
                                    if (rowData.statusFirmaRef == 1 || rowData.statusFirmaCRef == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeHojaRefConCF" title="Imprime REFCON Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarHojaRefConSF" title="Firmar REFCON" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                    }
                },
                ////////////////////////////////////////////////////////////////////

                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '7%',
                    targets: 13,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.fechaEgreso)) {

                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            if (rowData.idCuentaFua > 0) {
                                btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                                //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                                if (AtencionMedica.permisoFua == '1' && rowData.codeFua != '0') {
                                    if (rowData.statusFirmaFua == 1) {
                                        btnImprimeSinF = "";
                                        btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeFuaCF" title="Imprime FUA Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                    } else {
                                        btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarFuaSF" title="Firmar FUA" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                    }
                                }
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                        ////////////////////ESTADO ATENCION: ABIERTO O CERRADO//////////////////////
                        //if (rowData.idEstadoAtencion == 2) {
                        //    $(td).parent().css('background-color', '#ecebeb');
                        //    $($(td).parent()).children('td').css('border-color', 'white');
                        //}

                    }
                }
                ///////////////////////////////////////////////////////////////////////////

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },
    InitDatablesConsumoAtencion: () => {

        var parms = {
            "scrollY": "150px",
            "scrollCollapse": true,
            "order": [[0, "desc"]],
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "idOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idEstadoFacturacion == 9) {
                            $(td).parent().css('color', '#ef6f6c');
                            $(td).parent().css('font-weight', 'bold');
                        }
                        if (rowData.idEstadoFacturacion == 4) {
                            $(td).parent().css('color', '#00cc99');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {

                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }

            ]

        }

        var tableWrapper = $('#tblCSAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_consumoServAtencion = $("#tblCSAtencion").dataTable(parms);

    },

    /////////////////////////////////////KHOYOSI////////////////////////////////////////////////
    ModificarAtencion: async () => {
        //AtencionMedica.ParcialEvents();

        Diagnosticos.LimpiarCampos()
        AtencionMedica.Limpiar()
        //Ordenes.limpiarCatalogo()
        console.log(Variables);

        $('#diagnosticos-tab').css("display", "block");
        $('#ContOrdenesMedicas').css("display", "block");
        $('#EpisodioClinico').css("display", "block");
        $('#ordenes-tab').html(('Órdenes Médicas/Destino/Episodio').toUpperCase())

        //AtencionMedica.ServiciosSeleccionarCEPorEspecialidad(1)
        AtencionMedica.ListaDestinosCE();  //KHOYOSI
        
        if (Variables.EsTeleconsulta) {
            $('#EsTeleconsulta').show()
            $('#cboTipoTeleconsulta').val(2);

            $('.chzn-select').chosen().trigger("chosen:updated");
        } else {
            $('#EsTeleconsulta').hide()
        }

        $('#divTipoAtencion').hide()
        $('.contFuncionesBiologicas').show()
        $('#divContRecomendaciones').hide()

        await AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)
        await AtencionMedica.ListaEpisodiosByPaciente(Variables.IdPaciente);
        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 1);
        //await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento);


        const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
        await Ordenes.CargarDatosOrdenMedica(recetas);



        let objrow = await AtencionMedica.ListaAtencionByCuenta(Variables.IdCuentaAtencion) // JDELGADO J0 CAMBIO ASYNC METHOD


        // Diagnosticos para solicitud CQx
        //await Ordenes.SeleccionarDiagnosticos(Variables.IdAtencion, 8)



        if (objrow.idEspecialidad == 33 || objrow.idServicioIngreso == 247) {
            $('#divTipoAtencion').show()
            $('.contFuncionesBiologicas').hide()
            $('#divContRecomendaciones').show()

        }



        let dt = new Date();
        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        $("#txtNroHistoriaSolicitud").val(objrow.nroHistoriaClinica)
        $("#txtEdadAnioSolicitud").val(objrow.edadEnAnio)
        $("#txtEdadMesSolicitud").val(objrow.edadEnMes)
        $("#txtEdadDiaSolicitud").val(objrow.edadEnDia)
        $("#txtSexoSolicitud").val(objrow.sexo)
        $("#txtServicioSolicitud").val(objrow.servicio)
        $("#txtCamaSolicitud").val(objrow.cama)
        $("#cboUbicacionPlaciente").val(Variables.IdTipoServicio)


        $('#cboClasificacionTipoAtencion').val(objrow.clasificacionTipoAtencion)


        $("#txtFechaSolicitudCQx").datepicker("setDate", fechaP);
        $('#txtHoraSolicitudCQx').val(time)


        $("#txtFechaSolicitudCQx").prop('disabled', true)
        $('#txtHoraSolicitudCQx').prop('disabled', true)
        $('#txtHoraSolicitudCQxAceptada').prop('disabled', true)

        //Lista Triaje
        Triaje.listaTriaje(objrow.idAtencion)
        $("#txtPA").change()
        $("#txtPAD").change()
        $("#txtFc").change()
        $("#txtFr").change()
        $("#txtT").change()

        IdCuentaAtencionTemp = objrow.idCuentaAtencion
        $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion)



        $('#HoraInicioAtencion').val((objrow.horaInicioAtencion == "     " || objrow.horaInicioAtencion == "" ? time : objrow.horaInicioAtencion))
        $('#txtHoraCia').val(Variables.HoraInicioCita);

        $('#txtPlanTrabajo').val(objrow.planTrabajo);
        $('#txtTratamiento').val(objrow.tratamiento);
        $('#txtOtrasObservacionesGe').val(objrow.citaObservaciones);

        $('#txtRecomendacionesAtencion').val(objrow.recomendaciones);

        if (Variables.EsTeleconsulta) {
            $("#cboTipoTeleconsulta").val((isEmpty(objrow.tipoTeleconsulta) ? 2 : objrow.tipoTeleconsulta))
        } else {
            $("#cboTipoTeleconsulta").val(0)
        }

        $('#lblEstadoAtencion').html(objrow.descEstadoAtencion);
        AtencionMedica.CondicionEstablecimiento(objrow.idCuentaAtencion, objrow.idServicioIngreso);


        if (Variables.TipoModulo == 'ModuloEspecialidadesAdolescencia' || Variables.TipoModulo == 'ModuloMaternoAdolescencia') {
            $('#contenedorChkEsAdolecencia').show();
            $('#cboTipoAtencionAdolecencia').attr('disabled', false);

            if (Variables.IdTipoAtencionAdolescencia > 0) {
                $('#cboTipoAtencionAdolecencia').val(Variables.IdTipoAtencionAdolescencia);
                $('#cboTipoAtencionAdolecencia').prop('disabled', true);
            } else if (Variables.TipoModulo == 'ModuloMaternoAdolescencia') {
                $('#cboTipoAtencionAdolecencia').val(1);
                $('#cboTipoAtencionAdolecencia').prop('disabled', false);
            }
        }

        if (Variables.TipoModulo == 'ModuloEspecialidades' || Variables.TipoModulo == 'ModuloEspecialidadesAdolescencia' || Variables.TipoModulo == 'Odontologia') {
            AtencionMedica.CargarDatosAtencionEspecialidades(objrow)

            if (Variables.TipoModulo == 'Odontologia') {
                Odonto.CargarDatosAlFormulario(Variables.IdAtencion);
            }

        } else if (Variables.TipoModulo == 'ModuloConsejeriaObstetrica') {
            await AtencionMedica.CargarDatosAtencionEspecialidades(objrow)
            AtencionMedica.CargarDatosConsejeriaObstetrica(objrow)
        } else if (Variables.TipoModulo == 'ModuloEstrategiasSanitaria') {
            await AtencionMedica.CargarDatosAtencionEspecialidades(objrow)
            AtencionMedica.CargarDatosConsejeriaEstrategiaSanitaria(objrow)
        } else if (Variables.TipoModulo == 'ModuloOnco') {
            await AtencionMedica.CargarDatosAtencionEspecialidades(objrow)
            AtencionMedica.CargarDatosConsejeriaOncologica(objrow)
        } else if (Variables.TipoModulo == 'ModuloAnestesio') {
            AtencionMedica.CargarDatosAtencionEspecialidades(objrow)
            AtencionMedica.CargarDatosAtencionAnestesio(objrow);
        } else if (Variables.TipoModulo == 'ModuloMaterno' || Variables.TipoModulo == 'ModuloMaternoAdolescencia') {
            AtencionMedica.CargarDatosAtencionPrenatal(objrow);
        } else if (Variables.TipoModulo == 'ModuloNAR') {
            AtencionMedica.CargarDatosAtencionNinoAltoRiesgo(objrow);
        }

        $('#txtQuirurgicos').val(objrow.antecedQuirurgico)
        $('#txtPatologicos').val(objrow.antecedPatologico)
        $('#txtObstetricos').val(objrow.antecedObstetrico)
        $('#txtAlergias').val(objrow.antecedAlergico)
        $('#txtOtros').val(objrow.antecedentes)

        $('#txtFamiliares').val(objrow.antecedFamiliar)



        //if (objrow.costoCeroCE == "S") {
        //    AtencionMedica.ListaEpisodiosByPaciente(Variables.IdPaciente);
        //    await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 1);
        //    await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento);
        //    $('#cboDestino').val($('#idDestinoAtencion').val());
        //    $("#cboDestino").trigger("chosen:updated");
        //    //$('#modalAgregar').modal('show');
        //    $('.nav-tabs a[href="#ceAtencion"]').tab('show');
        //    //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
        //} else {
        //    let fuentesFin = await PermisoGeneral.SeleccionaParametros(1008)
        //    let arrayFuentesFin = fuentesFin[0].valorTexto.split(',')

        //    if (arrayFuentesFin.includes(objrow.idFuenteFinanciamiento.toString())) {
        //        AtencionMedica.ListaEpisodiosByPaciente(Variables.IdPaciente);
        //        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 1);
        //        await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento);
        //        $('#cboDestino').val($('#idDestinoAtencion').val());
        //        $("#cboDestino").trigger("chosen:updated");
        //        //$('#modalAgregar').modal('show');
        //        $('.nav-tabs a[href="#ceAtencion"]').tab('show');
        //        //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
        //    }
        //    else {
        //        if (objrow.idEstadoCita == 4 || objrow.idEstadoCita == 2) {
        //            AtencionMedica.ListaEpisodiosByPaciente(Variables.IdPaciente);
        //            await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 1);
        //            await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento);
        //            $('#cboDestino').val($('#idDestinoAtencion').val());
        //            $("#cboDestino").trigger("chosen:updated");
        //            // $('#modalAgregar').modal('show');
        //            $('.nav-tabs a[href="#ceAtencion"]').tab('show');
        //            //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
        //        }
        //        else {
        //            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
        //            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        //            alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pago");
        //            return false;
        //        }
        //    }
        //}

        Ordenes.ubicaFarmacia(await Utilitario.ConfiguracionIpress(1072))
        Ordenes.ubicaMedico(Variables.IdMedico); //KHOYOSI


        // JDELGADO

        ConsumoServicio.ServicioSeleccionarPorTipoServicio(0)
        // JDELGADO

        // JDELGADO J0
        $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
        $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        // JDELGADO J0

        $('#hdIdServicioPaciente').val(objrow.idServicioIngreso);
        $('#hdIdTipoServicio').val(1);


        $('#cboDestino').val($('#idDestinoAtencion').val());
        $('#txtProximaConsulta').val(objrow.proximaCita);
        $('#cboTipoConsulta').val(objrow.idTipoConsultaProxCita);
        $('#cboTipoConsulta').attr("disabled", true);

        $('#cboProgramacionProximaConsulta').empty();
        $('#cboProgramacionProximaConsulta').val("");
        $('#cboHoraProximaConsulta').empty();
        $('#cboHoraProximaConsulta').val("");

        $('.chzn-select').chosen().trigger("chosen:updated");
        $('#cboDestino').change();

        ////////////////////CITA PROXIMA (POR EL MOMENTO SOLO PARA CONSULTORIOS DE OBSTETRICIA)/////////////////////////////////////////
        if (Variables.IdEspecialidadIngreso >= 1 && Variables.IdEspecialidadIngreso <= 5) {
            $("#divProgramacionProximaConsulta").show();
            $("#divHoraProximaConsulta").show();
        } else {
            $("#divProgramacionProximaConsulta").hide();
            $("#divHoraProximaConsulta").hide();
        }

        //if (Variables.IdCitaProxima > 0) {
        //    await AtencionMedica.ProximaConsulta_Change();
        //    $('#cboProgramacionProximaConsulta').val(objrow.idProgramacionCitaProxima);
        //    await AtencionMedica.ProgramacionCuposTotales();
        //    $('#cboHoraProximaConsulta').val(objrow.horaInicioCitaProxima);

        //    $('#txtProximaConsulta').prop('disabled', true);
        //    $('#cboTipoConsulta').prop('disabled', true);
        //    $('#cboProgramacionProximaConsulta').prop('disabled', true);
        //    $('#cboHoraProximaConsulta').prop('disabled', true);
        //} else {
        //    await AtencionMedica.ProximaConsulta_Change();
        //    $('#cboProgramacionProximaConsulta').val('');
        //    await AtencionMedica.ProgramacionProximaConsulta_Change();
        //    $('#cboHoraProximaConsulta').val('');

        //    $('#txtProximaConsulta').prop('disabled', false);
        //    $('#cboTipoConsulta').prop('disabled', false);
        //    $('#cboProgramacionProximaConsulta').prop('disabled', false);
        //    $('#cboHoraProximaConsulta').prop('disabled', false);
        //}
        //$('.chzn-select').chosen().trigger("chosen:updated");
        /////////////////////////////////////////////////////////////////////////////




        Ordenes.activaTabs();
    },

    CargarDatosAtencionEspecialidades: async (objrow) => {
        
        await Especialidades.Iniciar();
        $("#atencion-tab").html("ATENCIÓN MÉDICA");

        $("#txtPC").attr("disabled", true)

        if (Variables.UsaModuloAnestesio) {
            $('#chkEsEvaluacionPreAnestesica').attr('disabled', false);
            $('#chkEsEvaluacionPreAnestesica').prop('checked', false);
            $('#contenedorChkEsEvaluacionPreAnestesica').show();

            if (Variables.IdTipoAtencionAnestesio == 0) {
                $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)
            }
        }

        //await AtencionMedica.TiposClasificacionPaciente();
        //console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)
        if(objrow.idClasificacionPaciente!=null) $('#cboClasisifcacion').val(objrow.idClasificacionPaciente);
        $('.chzn-select').chosen().trigger("chosen:updated")
        Especialidades.Bloqueo($('#cboClasisifcacion').val())

        $('#txtControles').val(objrow.nroControles)
        $('#txtEdadGestacional').val(objrow.edadGestacional)
        $('#txtGestas').val(objrow.nroGestas)

        $('#txtMotivoCons').val(objrow.citaMotivo)

        $("#txtApetito").val(objrow.apetito);
        $("#txtSuenio").val(objrow.suenio);
        $("#txtSed").val(objrow.sed);
        $("#txtOrina").val(objrow.orina);
        $("#txtDiposiciones").val(objrow.deposiciones);

        $('#txtQuirurgicos').val(objrow.antecedQuirurgico)
        $('#txtPatologicos').val(objrow.antecedPatologico)
        $('#txtObstetricos').val(objrow.antecedObstetrico)
        $('#txtAlergias').val(objrow.antecedAlergico)
        $('#txtOtros').val(objrow.antecedentes)

        $('#txtFamiliares').val(objrow.antecedFamiliar)
        $('#chkPacienteCronico').prop('checked', objrow.esPacienteCronico == 1 ? true : false); //RMOREANO 04032026
        if (objrow.esPacienteCronico == 1) {
            $('#chkPacienteCronico').prop('disabled', true);
        }

        $('#txtExamenC').val(objrow.citaExamenClinico)
        //$('#txtExamenGeneral').val(objrow.citaExamenFisicoGeneral)
        //$('#txtExamenRegional').val(objrow.citaExamenFisicoRegional)

        $('#txtAtencedentes').val(objrow.citaAntecedente)
    },

    CargarDatosConsejeriaObstetrica: async (objrow) => {
        await ConsejeriaObstetrica.Iniciar();
        $("#atencion-tab").html("ATENCIÓN");

        $('#diagnosticos-tab').css("display", "none");
        $('#ContOrdenesMedicas').css("display", "none");
        $('#EpisodioClinico').css("display", "none");
        $('#ordenes-tab').html('DESTINO DE ATENCIÓN')



        $("#txtPC").attr("disabled", true)

        //await AtencionMedica.TiposClasificacionPaciente();
        //console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)

        $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
        $('.chzn-select').chosen().trigger("chosen:updated")
        ConsejeriaObstetrica.Bloqueo($('#cboClasisifcacion').val())


        $('#txtControles').val(objrow.nroControles)
        $('#txtEdadGestacional').val(objrow.edadGestacional)
        $('#txtGestas').val(objrow.nroGestas)




        $('#txtNroCPN').val(objrow.nroCPN)

        $("#chkBeneficioLactanciaMaterna").prop("checked", objrow.beneficioLactanciaMaterna == 1);
        $("#chkLactanciaMaternaLibreDemanda").prop("checked", objrow.lactanciaMaternaLibreDemanda == 1);
        $("#chkContactoPielPiel").prop("checked", objrow.contactoPielPiel == 1);
        $("#chkAlojamientoConjunto").prop("checked", objrow.alojamientoConjunto == 1);
        $("#chkExtraccionConservacionLecheMaterna").prop("checked", objrow.extraccionConservacionLecheMaterna == 1);
        $("#chkTecnicasAmamantamiento").prop("checked", objrow.tecnicasAmamantamiento == 1);
        $("#chkSucedaneosBiberonesTetinas").prop("checked", objrow.sucedaneosBiberonesTetinas == 1);
        $("#chkCorteOportunoCordonUmbilical").prop("checked", objrow.corteOportunoCordonUmbilical == 1);
        $("#chkLactanciaMaternaPrimeraHora").prop("checked", objrow.lactanciaMaternaPrimeraHora == 1);
        $("#chkDonacionLecheMaterna").prop("checked", objrow.donacionLecheMaterna == 1);


        $('#txtMotivoConsejeria').val(objrow.motivoConsejeria)
        $('#txtIdentificacionNecesidades').val(objrow.identificacionNecesidades)
        $('#txtDeteccionSignosAlarma').val(objrow.deteccionSignosAlarma)
        $('#txtRecomendacionesSugerencias').val(objrow.recomendacionesSugerencias)

    },

    CargarDatosConsejeriaEstrategiaSanitaria: async (objrow) => {
        await ConsejeriaEstrategiaSanitaria.Iniciar();
        $("#atencion-tab").html("ATENCIÓN");

        //$('#diagnosticos-tab').css("display", "none");
        $('#ContOrdenesMedicas').css("display", "none");
        $('#EpisodioClinico').css("display", "none");
        $('#ordenes-tab').html('DESTINO DE ATENCIÓN')



        $("#txtPC").attr("disabled", true)

        //await AtencionMedica.TiposClasificacionPaciente();
        //console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)

        $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
        $('.chzn-select').chosen().trigger("chosen:updated")
        ConsejeriaOncologica.Bloqueo($('#cboClasisifcacion').val())


        $('#txtControles').val(objrow.nroControles)
        $('#txtEdadGestacional').val(objrow.edadGestacional)
        $('#txtGestas').val(objrow.nroGestas)



        $('#txtMotivoConsejeria').val(objrow.motivoConsejeriaEstrategia)
        $('#txtIdentificacionNecesidades').val(objrow.identificacionNecesidadesEstrategia)
        $('#txtDeteccionSignosAlarma').val(objrow.deteccionSignosAlarmaEstrategia)
        $('#txtRecomendacionesSugerencias').val(objrow.recomendacionesSugerenciasEstrategia)

    },

    CargarDatosConsejeriaOncologica: async (objrow) => {
        await ConsejeriaOncologica.Iniciar();
        $("#atencion-tab").html("ATENCIÓN");

        $('#diagnosticos-tab').css("display", "none");
        $('#ContOrdenesMedicas').css("display", "none");
        $('#EpisodioClinico').css("display", "none");
        $('#ordenes-tab').html('DESTINO DE ATENCIÓN')

        $("#txtPC").attr("disabled", true)

        //await AtencionMedica.TiposClasificacionPaciente();
        //console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)

        $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
        $('.chzn-select').chosen().trigger("chosen:updated")
        ConsejeriaOncologica.Bloqueo($('#cboClasisifcacion').val())


        $('#txtControles').val(objrow.nroControles)
        $('#txtEdadGestacional').val(objrow.edadGestacional)
        $('#txtGestas').val(objrow.nroGestas)




        $("#cboMotivoConsejeriaOnco").val(objrow.motivoConsejeriaOnco);
        $("#cboTemaConsejeriaOnco").val(objrow.temaConsejeriaOnco);
        $("#cboAntecedenteFamiliarCoOnco").val(objrow.antecedenteFamiliarCoOnco);
        $("#txtAntecedenteFamiliarDescripcionCoOnco").val(objrow.antecedenteFamiliarDescripcionCoOnco);
        $("#txtAndriaOnco").val(objrow.andriaOnco);
        $("#cboUsoAnticonceptivoOnco").val(objrow.usoAnticonceptivoOnco);
        $("#txtEdadPrimeraMenstruacionOnco").val(objrow.edadPrimeraMenstruacionOnco);
        $("#cboGestacionOnco").val(objrow.gestacionOnco);
        $("#cboPerdidas").val(objrow.perdidas);
        $("#txtParidadOnco").val(objrow.paridadOnco);
        $("#txtEdadPrimerEmbarazoOnco").val(objrow.edadPrimerEmbarazoOnco);
        $("#txtEdadPrimeraRelacionSexual").val(objrow.edadPrimeraRelacionSexual);

        $('#txtFechaUltimaMenstruacionOnco').datepicker("setDate", FormatearFecha(objrow.fechaUltimaMenstruacionOnco));

        $("#cboTerapiaReemplazoRenalOnco").val(objrow.terapiaReemplazoRenalOnco);
        $("#txtRecomendacionesSugerenciasOnco").val(objrow.recomendacionesSugerenciasOnco);

        // Asignar valores a los checkboxes
        $("#chkConsumoTabacoOnco").prop('checked', objrow.consumoTabacoOnco === 1);
        $("#chkConsumoAlcoholOnco").prop('checked', objrow.consumoAlcoholOnco === 1);
        $("#chkObesidadOnco").prop('checked', objrow.obesidadOnco === 1);
        $("#chkSedentarismoOnco").prop('checked', objrow.sedentarismoOnco === 1);
        $("#chkComportamientoSexualInadecuado").prop('checked', objrow.comportamientoSexualInadecuado === 1);

        $("#chkTratamientoParaFertilidad").prop('checked', objrow.tratamientoParaFertilidad === 1);
        $("#chkLactanciaMaterna").prop('checked', objrow.lactanciaMaterna === 1);

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    CargarDatosAtencionPrenatal: async (objrow) => {
        Perinatal.Iniciar();
        $("#atencion-tab").html("ATENCIÓN PRENATAL");

        $('#txtMotivoConsultaPeri').val(objrow.citaMotivo)

        await Perinatal.ListaProCabByIdAten(objrow.idAtencion, objrow.idPaciente);

    },

    CargarDatosAtencionNinoAltoRiesgo: async (objrow) => {
        NinioAltoRiesgo.Iniciar();
        $("#atencion-tab").html("ATENCIÓN NAR");
        NinioAltoRiesgo.limpiarDatos()

        $('#txtMotivoConsNinio').val(objrow.citaMotivo)
        $('#txtExamenCNinio').val(objrow.citaExamenClinico)
        $('#txtEnfermedadActual').val(objrow.enfermedadActual)
        $('#txtTiempoEmfermedad').val(objrow.tiempoEnfermedad)
        $("#txtPC").attr("disabled", false)

        $("#txtApetitoNinio").val(objrow.apetito);
        $("#txtSuenioNinio").val(objrow.suenio);
        $("#txtSedNinio").val(objrow.sed);
        $("#txtOrinaNinio").val(objrow.orina);
        $("#txtDiposicionesNinio").val(objrow.deposiciones);


        await NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
        NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
        NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
        NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
        NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
        NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
        NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)
    },

    CargarDatosAtencionAnestesio: async (objrow) => {
        Anestesiologia.Iniciar();
        $("#atencion-tab").html("ATENCIÓN PRE-ANESTÉSICA");

        $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
        $('.chzn-select').chosen().trigger("chosen:updated")
        Anestesiologia.Bloqueo($('#cboClasisifcacion').val())

        await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS

        let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(objrow.idAtencion)


        if (Variables.UsaModuloAnestesio) {
            $('#chkEsEvaluacionPreAnestesica').attr('disabled', false);
            $('#chkEsEvaluacionPreAnestesica').prop('checked', false);
            $('#contenedorChkEsEvaluacionPreAnestesica').show();
            if (Variables.IdTipoAtencionAnestesio == 1) {
                $('#chkEsEvaluacionPreAnestesica').prop('checked', true)
                $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)

                Anestesiologia.CompletarAtencionAnestesio(objrow.idAtencion, objrow.idCuentaAtencion)
            }
        }

        //if (atencionAnestesiologia.length > 0) {
        //if (Variables.IdTipoAtencionAnestesio == 1) {
        //    $('#chkEsEvaluacionPreAnestesica').prop('checked', true)
        //    $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)
        //    //$('#contenedorPreAnestesica').show()
        //    //$('#contenedorEspecialidades').hide()

        //    //$('[href="#examenEvalAnest"]').closest('li').show()
        //    //$('[href="#resultadosAnest"]').closest('li').show()



        //    Anestesiologia.CompletarAtencionAnestesio(objrow.idAtencion, objrow.idCuentaAtencion)
        //}
        //} else {
        //    $('#chkEsEvaluacionPreAnestesica').prop('checked', false)

        //    $('#contenedorPreAnestesica').hide()
        //    $('#contenedorEspecialidades').show()

        //    //$('[href="#examenEvalAnest"]').closest('li').hide()
        //    //$('[href="#resultadosAnest"]').closest('li').hide()
        //}

    },
    /////////////////////////////////////KHOYOSI////////////////////////////////////////////////

    Mostrar: async (tipoBoton) => {

        Diagnosticos.LimpiarCampos()
        AtencionMedica.Limpiar()
        Ordenes.limpiarCatalogo()

        AtencionMedica.ServiciosSeleccionarCEPorEspecialidad(1)
        //Anestesiologia.CargaDatosPorDefecto()             //DESCOMENTAR LUEGO

        Ordenes.ubicaFarmacia(await Utilitario.ConfiguracionIpress(1072))

        // JDELGADO VALIDACIONES PRE-ANESTESICA
        if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
            $('#contenedorChkEsEvaluacionPreAnestesica').show()
        } else {
            $('#contenedorChkEsEvaluacionPreAnestesica').hide()
        }

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado
        $('#chkEsEvaluacionPreAnestesica').attr('disabled', false)

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $('[href="#examenEvalAnest"]').closest('li').hide()
        $('[href="#resultadosAnest"]').closest('li').hide()

        // JDELGADO VALIDACIONES PRE-ANESTESICA

        let objrowTb = oTable_atenciones.api(true).row('.selected').data()


        // INICIA LOGICA PARA ABRIR ATENCION
        let objrow = await AtencionMedica.ListaAtencionByCuenta(objrowTb.idCuentaAtencion) // JDELGADO J0 CAMBIO ASYNC METHOD

        if (isEmpty(objrow)) {
            alerta(2, 'Seleccione un registro')
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
            return false
        }

        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        if (objrowTb.idTipoAtencionAdolescencia == 1) {
            objrow.usaModuloMaterno = true
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = true
            objrowTb.usaModuloNinoSano = false

            $('#cboTipoAtencionAdolecencia').val(1)

            //$('#cboTipoAtencionAdolecencia').trigger('change')            //DESCOMENTAR LUEGO
            $('#cboTipoAtencionAdolecencia').prop('disabled', true);

        } else if (objrowTb.idTipoAtencionAdolescencia == 2) {
            objrow.usaModuloMaterno = false
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = false
            objrowTb.usaModuloNinoSano = false

            $('#cboTipoAtencionAdolecencia').val(2)

            //$('#cboTipoAtencionAdolecencia').trigger('change')           //DESCOMENTAR LUEGO
            $('#cboTipoAtencionAdolecencia').prop('disabled', true);

        } else {
            if (objrowTb.usaModuloMaterno) {
                $('#cboTipoAtencionAdolecencia').val(1)
                //$('#cboTipoAtencionAdolecencia').trigger('change')           //DESCOMENTAR LUEGO
            } else if (!objrowTb.usaModuloMaterno && !objrowTb.usaModuloNinoSano) {
                $('#cboTipoAtencionAdolecencia').val(2)
                //$('#cboTipoAtencionAdolecencia').trigger('change')           //DESCOMENTAR LUEGO
            } else {
                $('#cboTipoAtencionAdolecencia').val(0)
            }
            $('#cboTipoAtencionAdolecencia').prop('disabled', false);
        }

        Ordenes.ubicaMedico(objrowTb.idMedico); //KHOYOSI
        AtencionMedica.ListaDestinosCE();  //KHOYOSI

        if (objrow.idEstadoAtencion == 2) {
            ///////KHOYOSI//////////                
            if (tipoBoton == 1) {
                //swal({
                //    title: 'Alerta',
                //    html: "<h4><b>La cuenta ya se encuentra cerrada<b></h4>",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Alerta', "La cuenta ya se encuentra cerrada.");
                return false;
            }

            if (tipoBoton == 3) {
                alerta(3, "La cuenta ya se encuentra cerrada");
            }
            ///////KHOYOSI//////////
        }

        //DESCOMENTAR LUEGO
        //await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS

        $('#lblEstadoAtencion').html(objrow.descEstadoAtencion)             //KHOYOSI
        if (objrow.idTipoFinanciamiento == "" || objrow.idTipoFinanciamiento == 0) {
            alerta(3, "Seleccione correctamente el paciente, problemas con el plan")
            return false
        }

        if ($('#idPaciente').val() !== "") {
            AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)

            //Lista Triaje
            Triaje.listaTriaje(objrow.idAtencion)
            $("#txtPA").change()
            $("#txtPAD").change()
            $("#txtFc").change()
            $("#txtFr").change()
            $("#txtT").change()

            IdCuentaAtencionTemp = objrow.idCuentaAtencion
            $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion)
            $('#txtQuirurgicos').val(objrow.antecedQuirurgico)
            $('#txtPatologicos').val(objrow.antecedPatologico)
            $('#txtObstetricos').val(objrow.antecedObstetrico)
            $('#txtAlergias').val(objrow.antecedAlergico)
            $('#txtFamiliares').val(objrow.antecedFamiliar)
            $('#txtOtros').val(objrow.antecedentes)

            //NINIO SANO cmbia citamotivo
            if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
                $('#txtMotivoCons').val(objrow.citaMotivo)
                $('#txtExamenC').val(objrow.citaExamenClinico)
                $("#txtPC").attr("disabled", true)
            }
            else {
                if (objrow.usaModuloNinoSano) {
                    NinioAltoRiesgo.limpiarDatos()
                    $('#txtMotivoConsNinio').val(objrow.citaMotivo)
                    $('#txtExamenCNinio').val(objrow.citaExamenClinico)
                    $('#txtEnfermedadActual').val(objrow.enfermedadActual)
                    $('#txtTiempoEmfermedad').val(objrow.tiempoEnfermedad)
                    $("#txtPC").attr("disabled", false)
                }
                if (objrow.usaModuloMaterno) {
                    $('#txtMotivoConsultaPeri').val(objrow.citaMotivo)
                }

            }
            // FIN NINIO SANO

            // ANESTESIOLOGIA - JDELGADO0
            if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
                let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(objrow.idAtencion)

                if (atencionAnestesiologia.length > 0) {
                    $('#chkEsEvaluacionPreAnestesica').prop('checked', true)

                    $('#contenedorPreAnestesica').show()
                    $('#contenedorEspecialidades').hide()

                    $('[href="#examenEvalAnest"]').closest('li').show()
                    $('[href="#resultadosAnest"]').closest('li').show()

                    $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)

                    Anestesiologia.CompletarAtencionAnestesio(objrow.idAtencion, objrow.idCuentaAtencion)
                } else {
                    $('#chkEsEvaluacionPreAnestesica').prop('checked', false)

                    $('#contenedorPreAnestesica').hide()
                    $('#contenedorEspecialidades').show()

                    $('[href="#examenEvalAnest"]').closest('li').hide()
                    $('[href="#resultadosAnest"]').closest('li').hide()
                }
            }
            // ANESTESIOLOGIA - JDELGADO0

            $('#HoraInicioAtencion').val((objrow.horaInicioAtencion == "     " || objrow.horaInicioAtencion == "" ? time : objrow.horaInicioAtencion))

            $('#txtHoraCia').val(objrowTb.horaInicio)
            $('#txtAtencedentes').val(objrow.citaAntecedente)
            $('#txtOtrasObservacionesGe').val(objrow.citaObservaciones) //nuevo
            //lleno entrevista 
            $('#txtControles').val(objrow.nroControles)
            $('#txtEdadGestacional').val(objrow.edadGestacional)
            $('#txtGestas').val(objrow.nroGestas)
            console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)
            $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
            $('.chzn-select').chosen().trigger("chosen:updated")
            AtencionMedica.Bloqueo($('#cboClasisifcacion').val())

            AtencionMedica.CondicionEstablecimiento(objrow.idCuentaAtencion, objrow.idServicioIngreso)

            if (objrow.idEstadoAtencion !== 1) {
                $('#btnguardar').css("visibility", 'hidden');
            }
            else {
                switch (tipoBoton) {
                    case 1:
                        $('#btnguardar').attr("disabled", false)
                        $('#btnguardar').css("visibility", 'visible')
                        Diagnosticos.HabilitarBotones()
                        break
                    case 4:
                        $('#btnguardar').attr("disabled", true)
                        $('#btnguardar').css("visibility", 'hidden')
                        Diagnosticos.DeshablitarBotones()
                        break
                    default:
                    // code block
                }
            }

            if (objrow.costoCeroCE == "S") {
                AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val());
                AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                $('#cboDestino').val($('#idDestinoAtencion').val());
                $("#cboDestino").trigger("chosen:updated");
                //$('#modalAgregar').modal('show');
                $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
            } else {
                let fuentesFin = await PermisoGeneral.SeleccionaParametros(1008)
                let arrayFuentesFin = fuentesFin[0].valorTexto.split(',')

                if (arrayFuentesFin.includes(objrow.idFuenteFinanciamiento.toString())) {
                    AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val())
                    AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                    AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                    $('#cboDestino').val($('#idDestinoAtencion').val());
                    $("#cboDestino").trigger("chosen:updated");
                    //$('#modalAgregar').modal('show');
                    $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                    //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                }
                else {
                    if (objrow.idEstadoCita == 4 || objrow.idEstadoCita == 2) {
                        AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val());
                        AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                        AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                        $('#cboDestino').val($('#idDestinoAtencion').val());
                        $("#cboDestino").trigger("chosen:updated");
                        // $('#modalAgregar').modal('show');
                        $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                        //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                    }
                    else {
                        //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pago");
                        return false;
                    }
                }
            }

            // INICIO ACTIVA TAB NIÑO SANO
            if (objrow.usaModuloMaterno == true) {
                $('[href="#entrevista"]').closest('li').hide();
                $('[href="#NinoSano"]').closest('li').hide();

                $('.nav-tabs a[href="#Perinatal"]').tab('show');
                $('[href="#Perinatal"]').closest('li').show();

                Perinatal.ListaProCabByIdAten(objrow.idAtencion, objrow.idPaciente)

            }
            else if (objrow.usaModuloNinoSano == true) {
                $('[href="#entrevista"]').closest('li').hide();
                $('[href="#Perinatal"]').closest('li').hide();
                $('.nav-tabs a[href="#NinoSano"]').tab('show');
                $('[href="#NinoSano"]').closest('li').show();
                await NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
                NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
                NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
                NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
                NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
                NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
                NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)

            }
            else {

                $('[href="#NinoSano"]').closest('li').hide();
                $('[href="#Perinatal"]').closest('li').hide();
                $('[href="#entrevista"]').closest('li').show();
                $('.nav-tabs a[href="#entrevista"]').tab('show');
            }
            // FIN ACTIVA TAB NIÑO SANO

            //rmoreanoc RQ0002
            $('#txtProximaConsulta').val(objrow.proximaCita);
            $('#cboTipoConsulta').val(objrow.idTipoConsultaProxCita)
            $('#cboTipoConsulta').attr("disabled", true);
            $('.chzn-select').chosen().trigger("chosen:updated");
            $('#cboDestino').change();
            //fin rmoreano

            $('#txtPlanTrabajo').val(objrow.planTrabajo);
            $('#txtTratamiento').val(objrow.tratamiento);
            $("#cboTipoTeleconsulta").val(objrow.tipoTeleconsulta)

            //NINIO SANO CAMBIA CARGA DE SIGNOS BIOLOGICOS
            if (objrow.usaModuloNinoSano == true) {
                $("#txtApetitoNinio").val(objrow.apetito);
                $("#txtSuenioNinio").val(objrow.suenio);
                $("#txtSedNinio").val(objrow.sed);
                $("#txtOrinaNinio").val(objrow.orina);
                $("#txtDiposicionesNinio").val(objrow.deposiciones);
            }
            else {
                $("#txtApetito").val(objrow.apetito);
                $("#txtSuenio").val(objrow.suenio);
                $("#txtSed").val(objrow.sed);
                $("#txtOrina").val(objrow.orina);
                $("#txtDiposiciones").val(objrow.deposiciones);
            }

            /////////KHOYOSI (Valida si ya se ha generado un hoja de refcon)////////////
            //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");            
            if (AtencionMedica.permisoRefCon == '1') {
                if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {
                    Referencias.estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon
                }
            }
            ///////////////////////////////////////////////////////////////////////////


            //Validamos si los combobox cargaron correctamente
            if ($("#cboDestino").children('option').length == 0) {
                AtencionMedica.ListaDestinosCE();
            }

            if ($("#cboFarmacia").children('option').length == 0) {
                Ordenes.listaFarmacias();
            }

            if ($("#cboRx").children('option').length == 0) {
                Ordenes.BuscarCatalogo(21, 0);                                        //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(21, objrow.idServicioIngreso);        //KHOYOSI                    
            }

            if ($("#cboEcoObs").children('option').length == 0) {
                Ordenes.BuscarCatalogo(23, 0);                                        //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(23, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cboecoGene").children('option').length == 0) {
                Ordenes.BuscarCatalogo(20, 0);                                        //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(20, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cboanaPatologica").children('option').length == 0) {
                Ordenes.BuscarCatalogo(3, 0);                                         //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(3, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cboPatoClinica").children('option').length == 0) {
                Ordenes.BuscarCatalogo(2, 0);                                         //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(2, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cbobancoSangre").children('option').length == 0) {
                Ordenes.BuscarCatalogo(11, 0);                                        //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(11, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cbotomografia").children('option').length == 0) {
                Ordenes.BuscarCatalogo(22, 0);                                        //KHOYOSI (COMENTADO)
                //Ordenes.BuscarCatalogoPorServicio(22, objrow.idServicioIngreso);        //KHOYOSI
            }

            if ($("#cboClasisifcacion").children('option').length == 0) {
                AtencionMedica.TiposClasificacionPaciente();
            }

            // JDELGADO J0
            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
            // JDELGADO J0

            $('#hdIdServicioPaciente').val(objrow.idServicioIngreso);
            $('#hdIdTipoServicio').val(1);

            ///////////////KHOYOSI////////////////////////////
            //if (ValidarServicioCarnetPrenatal(objrow.idServicioIngreso)) {
            if (objrow.usaModuloMaterno) {
                $('#btnCarnetPrenatal').show();
            } else {
                $('#btnCarnetPrenatal').hide();
            }

        } else {
            alerta(2, 'Seleccione un registro');
            return false;
        }

    },

    MostrarParaAdolecencia: async (tipoBoton) => { // JDELGADO J0 CAMBIO ASYNC METHOD

        //Anestesiologia.CargaDatosPorDefecto()             DESCOEMNTAR LUEGO
        Diagnosticos.LimpiarCampos()
        //Ordenes.ubicaFarmacia(116)
        Ordenes.ubicaFarmacia(await Utilitario.ConfiguracionIpress(1072))

        AtencionMedica.Limpiar()
        Ordenes.limpiarCatalogo

        // JDELGADO VALIDACIONES PRE-ANESTESICA
        if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
            $('#contenedorChkEsEvaluacionPreAnestesica').show()
        } else {
            $('#contenedorChkEsEvaluacionPreAnestesica').hide()
        }

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado
        $('#chkEsEvaluacionPreAnestesica').attr('disabled', false)

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $('[href="#examenEvalAnest"]').closest('li').hide();
        $('[href="#resultadosAnest"]').closest('li').hide();

        // JDELGADO VALIDACIONES PRE-ANESTESICA

        var objrowTb = oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        }

        let objrow = await AtencionMedica.ListaAtencionByCuenta(objrowTb.idCuentaAtencion);

        // JDELGADO J0 CAMBIO ASYNC METHOD

        // await Anestesiologia.ListarExamenesAnestesiologiaByCuenta(objrowTb.idCuentaAtencion)

        if (isEmpty(objrow)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            if ($('#cboTipoAtencionAdolecencia').val() == 1) {
                objrow.usaModuloMaterno = true
                objrow.usaModuloNinoSano = false

                objrowTb.usaModuloMaterno = true
                objrowTb.usaModuloNinoSano = false

            } else if ($('#cboTipoAtencionAdolecencia').val() == 2) {
                objrow.usaModuloMaterno = false
                objrow.usaModuloNinoSano = false

                objrowTb.usaModuloMaterno = false
                objrowTb.usaModuloNinoSano = false
            }


            Ordenes.ubicaMedico(objrowTb.idMedico); //KHOYOSI
            AtencionMedica.ListaDestinosCE();  //KHOYOSI
            if (objrow.idEstadoAtencion == 2) {
                ///////KHOYOSI//////////                
                if (tipoBoton == 1) {
                    //swal({
                    //    title: 'Alerta',
                    //    html: "<h4><b>La cuenta ya se encuentra cerrada<b></h4>",
                    //    type: 'warning',
                    //    allowOutsideClick: false,
                    //}).done();
                    alerta2('warning', 'Alerta', "<h4><b>La cuenta ya se encuentra cerrada.<b></h4>");
                    return false;
                }

                if (tipoBoton == 3) {
                    alerta(3, "La cuenta ya se encuentra cerrada");
                }
                ///////KHOYOSI//////////
            }

            //await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS         //DESCOMENTAR LUEGO
            //$('#lblEstadoAtencion').html("Estado Atencion: " + objrow.descEstadoAtencion)
            $('#lblEstadoAtencion').html(objrow.descEstadoAtencion)             //KHOYOSI
            if (objrow.idTipoFinanciamiento == "" || objrow.idTipoFinanciamiento == 0) {
                alerta(3, "Seleccione correctamente el paciente, problemas con el plan");
                return false
            }
            if ($('#idPaciente').val() !== "") {
                //Lista Recetas
                //listaRecetasCabeceras();          //COMENTADO POR KHOYOSI
                AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                //Lista Triaje
                Triaje.listaTriaje(objrow.idAtencion);
                $("#txtPA").change();
                $("#txtPAD").change();
                $("#txtFc").change();
                $("#txtFr").change();
                $("#txtT").change();
                //anm
                IdCuentaAtencionTemp = objrow.idCuentaAtencion;
                $('#hdIdCuentaAtencion').val(objrow.idCuentaAtencion);
                $('#txtQuirurgicos').val(objrow.antecedQuirurgico);
                $('#txtPatologicos').val(objrow.antecedPatologico);
                $('#txtObstetricos').val(objrow.antecedObstetrico);
                $('#txtAlergias').val(objrow.antecedAlergico);
                $('#txtFamiliares').val(objrow.antecedFamiliar);
                $('#txtOtros').val(objrow.antecedentes);
                //$('#txtMotivoCons').val(objrow.citaMotivo);

                //NINIO SANO cmbia citamotivo
                if (objrow.usaModuloMaterno == false && objrow.usaModuloNinoSano == false) {
                    $('#txtMotivoCons').val(objrow.citaMotivo);
                    $('#txtExamenC').val(objrow.citaExamenClinico);
                    $("#txtPC").attr("disabled", true);
                }
                else {
                    if (objrow.usaModuloNinoSano) {
                        NinioAltoRiesgo.limpiarDatos();
                        $('#txtMotivoConsNinio').val(objrow.citaMotivo);
                        $('#txtExamenCNinio').val(objrow.citaExamenClinico);
                        $('#txtEnfermedadActual').val(objrow.enfermedadActual);
                        $('#txtTiempoEmfermedad').val(objrow.tiempoEnfermedad);
                        $("#txtPC").attr("disabled", false);
                    }
                    if (objrow.usaModuloMaterno) {
                        $('#txtMotivoConsultaPeri').val(objrow.citaMotivo);
                    }

                }
                // FIN NINIO SANO


                // ANESTESIOLOGIA - JDELGADO0
                if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
                    let atencionAnestesiologia = await Anestesiologia.ListarAtencionesAnestesiologia(objrow.idAtencion)

                    if (atencionAnestesiologia.length > 0) {
                        $('#chkEsEvaluacionPreAnestesica').prop('checked', true)

                        $('#contenedorPreAnestesica').show()
                        $('#contenedorEspecialidades').hide()

                        $('[href="#examenEvalAnest"]').closest('li').show();
                        $('[href="#resultadosAnest"]').closest('li').show();

                        $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)

                        Anestesiologia.CompletarAtencionAnestesio(objrow.idAtencion, objrow.idCuentaAtencion)
                    } else {
                        $('#chkEsEvaluacionPreAnestesica').prop('checked', false)

                        $('#contenedorPreAnestesica').hide()
                        $('#contenedorEspecialidades').show()

                        $('[href="#examenEvalAnest"]').closest('li').hide();
                        $('[href="#resultadosAnest"]').closest('li').hide();
                    }
                }
                // ANESTESIOLOGIA - JDELGADO0


                var dt = new Date();
                var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())
                $('#HoraInicioAtencion').val((objrow.horaInicioAtencion == "     " ? time : objrow.horaInicioAtencion));

                $('#txtHoraCia').val(objrowTb.horaInicio);
                $('#txtAtencedentes').val(objrow.citaAntecedente);
                $('#txtOtrasObservacionesGe').val(objrow.citaObservaciones); //nuevo
                //lleno entrevista 
                $('#txtControles').val(objrow.nroControles);
                $('#txtEdadGestacional').val(objrow.edadGestacional);
                $('#txtGestas').val(objrow.nroGestas);
                console.log('objrow.idClasificacionPaciente', objrow.idClasificacionPaciente)
                $('#cboClasisifcacion').val(objrow.idClasificacionPaciente)
                $('.chzn-select').chosen().trigger("chosen:updated");
                AtencionMedica.Bloqueo($('#cboClasisifcacion').val());


                AtencionMedica.CondicionEstablecimiento(objrow.idCuentaAtencion, objrow.idServicioIngreso)

                //alert(objrow.idEstadoAtencion);

                if (objrow.idEstadoAtencion !== 1) {
                    $('#btnguardar').css("visibility", 'hidden');
                }
                else {

                    switch (tipoBoton) {
                        case 1:
                            $('#btnguardar').attr("disabled", false);
                            $('#btnguardar').css("visibility", 'visible');
                            Diagnosticos.HabilitarBotones();
                            break;
                        case 4:

                            $('#btnguardar').attr("disabled", true);
                            $('#btnguardar').css("visibility", 'hidden');
                            Diagnosticos.DeshablitarBotones();
                            break;

                        default:
                        // code block
                    }
                }

                if (objrow.costoCeroCE == "S") {
                    AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val());
                    AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                    AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                    $('#cboDestino').val($('#idDestinoAtencion').val());
                    $("#cboDestino").trigger("chosen:updated");
                    //$('#modalAgregar').modal('show');
                    $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                    //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                }
                else {

                    let fuentesFin = await PermisoGeneral.SeleccionaParametros(1008)
                    let arrayFuentesFin = fuentesFin[0].valorTexto.split(',')

                    if (arrayFuentesFin.includes(objrow.idFuenteFinanciamiento.toString())) {
                        AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val())
                        AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                        AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                        $('#cboDestino').val($('#idDestinoAtencion').val());
                        $("#cboDestino").trigger("chosen:updated");
                        //$('#modalAgregar').modal('show');
                        $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                        //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                    }
                    else {
                        if (objrow.idEstadoCita == 4 || objrow.idEstadoCita == 2) {
                            AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val());
                            AtencionMedica.ListaDiagnosticosAtenciones($('#idAtencion').val())
                            AtencionMedica.ListaRecetas(objrow.idCuentaAtencion, objrow.idTipoFinanciamiento)
                            $('#cboDestino').val($('#idDestinoAtencion').val());
                            $("#cboDestino").trigger("chosen:updated");
                            // $('#modalAgregar').modal('show');
                            $('.nav-tabs a[href="#ceAtencion"]').tab('show');
                            //$("#lsAtenciones-tab").css("pointer-events", "none"); // JDELGADO J0 CAMBIAR EN LA VISTA
                        }
                        else {
                            //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
                            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                            alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pago");
                            return false;
                        }
                    }
                }


                //NINNIO SANO ACTIVA TAB
                if (objrow.usaModuloMaterno == true) {
                    $('[href="#entrevista"]').closest('li').hide();
                    $('[href="#NinoSano"]').closest('li').hide();

                    $('.nav-tabs a[href="#Perinatal"]').tab('show');
                    $('[href="#Perinatal"]').closest('li').show();

                    Perinatal.ListaProCabByIdAten(objrow.idAtencion, objrow.idPaciente)
                }
                else if (objrow.usaModuloNinoSano == true) {
                    $('[href="#entrevista"]').closest('li').hide();
                    $('[href="#Perinatal"]').closest('li').hide();
                    $('.nav-tabs a[href="#NinoSano"]').tab('show');
                    $('[href="#NinoSano"]').closest('li').show();
                    console.log('entrando a nino sano')

                    await NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
                    NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
                    NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)
                }
                else {

                    $('[href="#NinoSano"]').closest('li').hide();
                    $('[href="#Perinatal"]').closest('li').hide();
                    $('[href="#entrevista"]').closest('li').show();
                    $('.nav-tabs a[href="#entrevista"]').tab('show');
                }

                //fin


                //rmoreanoc RQ0002
                $('#txtProximaConsulta').val(objrow.proximaCita);
                $('#cboTipoConsulta').val(objrow.idTipoConsultaProxCita)
                $('#cboTipoConsulta').attr("disabled", true);
                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#cboDestino').change();
                //fin rmoreano

                $('#txtPlanTrabajo').val(objrow.planTrabajo);
                $('#txtTratamiento').val(objrow.tratamiento);
                $("#cboTipoTeleconsulta").val(objrow.tipoTeleconsulta)

                //NINIO SANO CAMBIA CARGA DE SIGNOS BIOLOGICOS
                if (objrow.usaModuloNinoSano == true) {
                    $("#txtApetitoNinio").val(objrow.apetito);
                    $("#txtSuenioNinio").val(objrow.suenio);
                    $("#txtSedNinio").val(objrow.sed);
                    $("#txtOrinaNinio").val(objrow.orina);
                    $("#txtDiposicionesNinio").val(objrow.deposiciones);
                }
                else {
                    $("#txtApetito").val(objrow.apetito);
                    $("#txtSuenio").val(objrow.suenio);
                    $("#txtSed").val(objrow.sed);
                    $("#txtOrina").val(objrow.orina);
                    $("#txtDiposiciones").val(objrow.deposiciones);
                }

                /////////KHOYOSI (Valida si ya se ha generado un hoja de refcon)////////////
                //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                if (AtencionMedica.permisoRefCon == '1') {
                    if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {
                        Referencias.estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon
                    }
                }
                ///////////////////////////////////////////////////////////////////////////


                //Validamos si los combobox cargaron correctamente
                if ($("#cboDestino").children('option').length == 0) {
                    AtencionMedica.ListaDestinosCE();
                }
                if ($("#cboFarmacia").children('option').length == 0) {
                    Ordenes.listaFarmacias();
                }
                if ($("#cboRx").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(21, 0);                                        //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(21, objrow.idServicioIngreso);        //KHOYOSI                    
                }

                if ($("#cboEcoObs").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(23, 0);                                        //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(23, objrow.idServicioIngreso);        //KHOYOSI
                }

                if ($("#cboecoGene").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(20, 0);                                        //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(20, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cboanaPatologica").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(3, 0);                                         //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(3, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cboPatoClinica").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(2, 0);                                         //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(2, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cbobancoSangre").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(11, 0);                                        //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(11, objrow.idServicioIngreso);        //KHOYOSI
                }
                if ($("#cbotomografia").children('option').length == 0) {
                    Ordenes.BuscarCatalogo(22, 0);                                        //KHOYOSI (COMENTADO)
                    //Ordenes.BuscarCatalogoPorServicio(22, objrow.idServicioIngreso);        //KHOYOSI
                }

                if ($("#cboClasisifcacion").children('option').length == 0) {
                    AtencionMedica.TiposClasificacionPaciente();
                }

                // JDELGADO J0
                $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                // JDELGADO J0

                $('#hdIdServicioPaciente').val(objrow.idServicioIngreso);
                $('#hdIdTipoServicio').val(1);


                ///////////////KHOYOSI////////////////////////////
                //if (ValidarServicioCarnetPrenatal(objrow.idServicioIngreso)) {
                if (objrow.usaModuloMaterno) {
                    $('#btnCarnetPrenatal').show();
                } else {
                    $('#btnCarnetPrenatal').hide();
                }

            }
            else {
                alerta(2, 'Seleccione un registro');
                return false;
            }
        }

    },

    ValidaEntrevista: (tipo) => {
        valor = true;

        switch (tipo) {
            case "1":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtEdadGestacional').val() == "" || $('#txtEdadGestacional').val() == 0) {
                    alerta('2', 'Ingrese edad gestacional');
                    $('#txtEdadGestacional').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "2":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "") {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }
                break;
            case "3":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }
                break;
            case "4":
                if ($('#txtControles').val() == "" || $('#txtControles').val() == 0) {
                    alerta('2', 'Ingrese Nro. de controles');
                    $('#txtControles').focus();
                    valor = false;
                }

                if ($('#txtGestas').val() == "" || $('#txtGestas').val() == 0) {
                    alerta('2', 'Ingrese Nro. de gestas');
                    $('#txtGestas').focus();
                    valor = false;
                }

                break;

            default:
                valor = true;
            // code block
        }

        return valor

    },

    ServiciosSeleccionarCEPorEspecialidad: (idEspecialidad) => {
        let formData = new FormData()
        formData.append('idEspecialidad', idEspecialidad)
        HttpClient.Post('/Utilitario/ServiciosSeleccionarCEPorEspecialidad?area=ConsultaExterna', formData)
            .then(res => {
                let opcionesAdolecencia = 0
                if (res.estado) {
                    $(res.data.table).each((i, obj) => {
                        if (obj.idServicio == $('#cboConsultorio').val()) {
                            opcionesAdolecencia = 1
                        }
                    })

                    if (opcionesAdolecencia == 1) {
                        $('#contenedorChkEsAdolecencia').show()
                    } else {
                        $('#contenedorChkEsAdolecencia').hide()
                    }

                } else {
                    alerta(2, res.msg)
                    return false
                }
            })
    },
    RefresacaCombox: () => {
        alerta(1, "Se esta recargando los datos de los combobox");
        var objrowTb = AtencionMedica.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro de la lista de pacientes');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Cargando(1);
            AtencionMedica.ListaDestinosCE()
            AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val())
            Ordenes.listaFarmacias()

            Ordenes.BuscarCatalogo(21, 0);
            Ordenes.BuscarCatalogo(23, 0);
            Ordenes.BuscarCatalogo(20, 0);
            Ordenes.BuscarCatalogo(3, 0);
            Ordenes.BuscarCatalogo(2, 0);
            Ordenes.BuscarCatalogo(11, 0);
            Ordenes.BuscarCatalogo(22, 0);

            //Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val())
            //Ordenes.BuscarCatalogoPorServicio(22, $("#cboConsultorio").val())

            Cargando(0);
        }
    },

    CargarCatalogo: () => {
        Cargando(1);
        Ordenes.BuscarCatalogo(21, 0);
        Ordenes.BuscarCatalogo(23, 0);
        Ordenes.BuscarCatalogo(20, 0);
        Ordenes.BuscarCatalogo(3, 0);
        Ordenes.BuscarCatalogo(2, 0);
        Ordenes.BuscarCatalogo(11, 0);
        Ordenes.BuscarCatalogo(22, 0);

        //Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());
        //Ordenes.BuscarCatalogoPorServicio(22, $("#cboConsultorio").val());
        Cargando(0);
    },

    CargarModuloAtencion: async (idServicio, idTipoAtencion, tipoAtencionAnestesio) => {
        Cargando(1)
        var midata = new FormData();
        midata.append('idServicio', idServicio);
        midata.append('idTipoAtencion', idTipoAtencion);
        midata.append('tipoAtencionAnestesio', tipoAtencionAnestesio);
        $("#modulo").html("");

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/CargarModuloV2?area=ConsultaExterna",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $("#modulo").html(datos);
            //$("#modulo").load('/Atencion/CargarModulo');
            //console.log(datos);
            Cargando(0)
        } catch (error) {
            //console.error(error)
            Cargando(0)
            alerta(3, JSON.stringify(error));
        }
    },
    CargarModuloAdolecencia: async (idTipo) => {
        Cargando(1)
        let formData = new FormData();
        formData.append('idTipo', idTipo);

        HttpClient.Post('/Atencion/CargarModuloAdolecencia?area=ConsultaExterna', formData)
            .then(res => {

                if (res.estado) {
                    $.ajax({
                        method: "GET",
                        url: res.data,
                        data: null,
                        dataType: "HTML",
                        cache: false,
                        processData: false,
                        contentType: false,
                    })
                        .done(function (htmlRes) {
                            console.log('Esto pasa primero')
                            $("#modulo").html(htmlRes);
                            Cargando(0)
                        })
                        .done(function () {
                            AtencionMedica.MostrarParaAdolecencia(1)
                        })
                        .fail(function () {
                            alerta(2, "Error al cargar modulo");
                            Cargando(0)
                        })
                } else {
                    alerta(2, res.msg);
                    Cargando(0)
                }

            })
            .catch((e) => {
                alerta(2, "Error al cargar modulo " + e);
                Cargando(0)
            })

    },

    ImprimiInforme2: async (idCuentaAtencion, code, idDoc) => {
        Cargando(1);
        //var objrow = oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=A";
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url, true);

        request.onload = async function () {
            if (request.status === 200) {
                if (this.response.size > 0) {
                    var url = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = url;
                    //a.download = this.response.name || "CE-" + $.now()
                    a.download = "CE-" + idCuentaAtencion + "-" + $.now()
                    //a.click();
                    Cargando(0);
                    AbrirVisorDocumento(url, 1);

                    await ListaAtencionesCE();

                } else {
                    Cargando(0);
                    alerta(2, "El documento aún no está firmado digitalmente.")
                }

            } else {
                Cargando(0);
                alerta(3, "Hubo un error al generar el documento.")
            }
        }
        request.send();
    },
    ImprimirDocumentoConFirma: (idCuentaAtencion, code, idDoc, tipo) => {
        //var midata = new FormData();
        Cargando(1);
        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = async function () {
            if (this.response.size > 0) {
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = tipo + idCuentaAtencion + "-" + $.now()
                //a.click();

                AbrirVisorDocumento(url, 1);

                await ListaAtencionesCE();
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
            Cargando(0);
        }
        request.send();
    },

    fechaDia: () => {
        var fechaG = new Date();
        var diaG = fechaG.getDate();
        var mesG = parseInt(fechaG.getMonth()) + 1;
        var yyyG = fechaG.getFullYear();

        fechaA = diaG + "/" + mesG + "/" + yyyG
        return fechaA
    },
    fechaCorrecta: (fecha1, fecha2) => {

        var midata = new FormData();

        midata.append('fecha1', fecha1);
        midata.append('fecha2', fecha2);

        valor = false

        $.ajax({
            method: "POST",
            url: "/Atencion/validaFechaMayor?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                valor = datos.resultado
            },
            error: function (msg) {
                setTimeout(function () {
                    valor = false
                }, 900)
            }
        });

        return valor
    },

    Limpiar: () => {
        $('#chkNuevo').prop('checked', false)
        $('#chkCierre').prop('checked', false)
        $('#hdIdCuentaAtencion').val(0);
        $('#txtMotivoConsultaPeri').val("");
        $('#txtHoraCia').val("");
        $('#HoraInicioAtencion').val("");

        $('#chkEsEvaluacionPreAnestesica').attr('disabled', true)
        $('#chkEsEvaluacionPreAnestesica').prop('checked', false)
        $('#contenedorChkEsEvaluacionPreAnestesica').hide();

        $('#cboClasisifcacion').val(0);

        $('#cboTipoAtencionAdolecencia').val(null);
        $('#cboTipoAtencionAdolecencia').prop('disabled', true);
        $('#contenedorChkEsAdolecencia').hide();

        $('.chzn-select').chosen().trigger("chosen:updated");

        IdCuentaAtencionTemp = 0;
    },

    BloquearCampos: () => {
        $("#TabPanelRegistro .campo input[type=text]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo textarea").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=checkbox]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo input[type=radio]").attr('disabled', 'disabled');
        $("#TabPanelRegistro .campo .chzn-select").attr('disabled', 'disabled');
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesCPT").hide();
        $(".OpcionesOrdenes").hide();
        $(".OpcionesDiagnosticos").hide();

        $("#btnguardar").hide();
    },
    DesbloquearCampos: () => {
        $("#TabPanelRegistro .campo input[type=text]").removeAttr("disabled");
        $("#TabPanelRegistro .campo textarea").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=checkbox]").removeAttr("disabled");
        $("#TabPanelRegistro .campo input[type=radio]").removeAttr("disabled");
        $("#TabPanelRegistro .campo .chzn-select").removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");

        $(".OpcionesCPT").show();
        $(".OpcionesOrdenes").show();
        $(".OpcionesDiagnosticos").show();

        $("#btnguardar").show();
    },
    Bloqueo: (valorClas) => {
        switch (valorClas) {
            case "1":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", false);
                $('#txtGestas').attr("disabled", false);
                break;
            case "2":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", false);
                break;
            case "3":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", true);

                break;
            case "4":
                $('#txtControles').attr("disabled", false);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", false);
                break;
            default:
                $('#txtControles').attr("disabled", true);
                $('#txtEdadGestacional').attr("disabled", true);
                $('#txtGestas').attr("disabled", true);
                break;
            // code block
        }
    },


    Events: () => {

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            // El tab que se acaba de mostrar
            //console.log(e.target.id);
            //let tabActual = $(e.target).text();
            let tabActual = e.target.id;
            if (tabActual == "TabPanelBusqueda") {
                oTable_atenciones.resize();
            }

        });

        $('#btnBuscarAtenciones').on('click', async function (e) {
            e.preventDefault();
            $('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencion').val() == "") {
                alerta2("info", "", "Ingrese fecha de atencion");
                return false;
            }

            $('#lblMedicoProgramado').html($('#cboConsultorio>option:selected').attr("med"))            //KHOYOSI
            await AtencionMedica.ListaAtencionesCE();


            /*if (await Utilitario.ValidarSesion()) {
                $('#lblMedicoProgramado').html('');
                if ($('#txtFechaAtencion').val() == "") {
                    alerta('2', 'Ingrese fecha de atencion');
                    return false;
                }
                else {                    
                    $('#lblMedicoProgramado').html($('#cboConsultorio>option:selected').attr("med"))            //KHOYOSI
                    await AtencionMedica.ListaAtencionesCE();
                }
            }      */
        });

        $('#btnConsultarAtenciones').on('click', async function () {

            let objrowTb = oTable_atenciones.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra anulado.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "La cuenta del paciente se encuentra anulado.");
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra cerrado.",
                //    type: 'warning',
                //}).done();
                alerta(2, "La cuenta del paciente se encuentra cerrado.");
                //return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            Variables.Cargar(objrowTb);

            //await AtencionMedica.CargarModuloAtencion($('#cboConsultorio').val(), Variables.IdTipoAtencionAdolescencia, Variables.TipoAtencionAnestesio);
            await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, Variables.IdTipoAtencionAdolescencia, Variables.IdTipoAtencionAnestesio);

            Variables.TipoModulo = $("#TipoModulo").val();

            AtencionMedica.BloquearCampos();
            await AtencionMedica.ModificarAtencion();

            MostrarAreaRegistro();
            $("#atencion-tab").click();


        })

        $('#btnLlamarPaciente').on('click', async function () {
            let objrowTb = oTable_atenciones.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "Atenciones", "Seleccione un registro.");
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                alerta2("warning", "Atenciones", "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                alerta2("warning", "Atenciones", "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if ((Number(objrowTb.idEstadoColaCita ?? 0)) < 2) { // MGAMERO
                alerta2('warning','Atenciones',"Aún no se confirma la llegada del Paciente.<br><b>Estado Cola: " + (objrowTb.estadoColaCita ?? '') + "</b>");
                return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }

            if ($("#idMedicotxt").val() != objrowTb.idMedico) {
                alerta2("info", "Atenciones", "Usted no tiene permiso para llamar al paciente.");
                return false
            }

            $("#txtLlamadoCuenta").val(objrowTb.idCuentaAtencion);
            $("#txtLlamadoHistoria").val(objrowTb.nroHistoriaClinica);
            $("#txtLlamadoPaciente").val(objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno + ' ' + objrowTb.nombres);
            await Utilitario.GenerarAccionFlujoAtencionCE(objrowTb.idAtencion, 1);      //1: Llamar Paciente
            AtencionMedica.CambiarEstadoColaCita(null, objrowTb.idAtencion, 4, "Llamando desde Registro de Atención C.E.", '');// 4 : Llamando -- MGAMERO
            $("#modalLlamadoPaciente").modal("show");
        });

        $('#btnCancelarLlamadoPaciente').on('click', async function () {
            let objrowTb = oTable_atenciones.api(true).row('.selected').data();
            $("#txtLlamadoCuenta").val("");
            $("#txtLlamadoHistoria").val("");
            $("#txtLlamadoPaciente").val("");
            await Utilitario.GenerarAccionFlujoAtencionCE(objrowTb.idAtencion, 0);      //0: Cancelar llamado Paciente
            $("#modalLlamadoPaciente").modal("hide");
            setTimeout(()=> $('#btnBuscarAtenciones').trigger('click'), 500);
        });

        $('#btnModificarAtenciones').on('click', async function () {
            let objrowTb = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            if (objrowTb.idEstadoAtencion == 0) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra anulado.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "La cuenta del paciente se encuentra anulado.");
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if ((Number(objrowTb.idEstadoColaCita ?? 0)) < 2) { //MGAMERO
                alerta2('warning','Atenciones',"Aún no se confirma la llegada del Paciente.<br><b>Estado Cola: " + (objrowTb.estadoColaCita ?? '') + "</b>");
                return false;
            }

            if (objrowTb.idEstadoAtencion == 2) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra cerrado.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "La cuenta del paciente se encuentra cerrado.");
                //alerta(2, "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if (objrowTb.generaPago == 1) {
                if (objrowTb.costoCeroCE != "S") {
                    if (objrowTb.idEstadoCita != 4 && objrowTb.idEstadoCita != 2) {
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        alerta(2, "Paciente con Plan: " + objrowTb.planA + " no pagó.");
                        return false;
                    }
                }
            }
            
            //return false; // PRUEBAAAAAA


            Variables.Cargar(objrowTb);

            //await AtencionMedica.CargarModuloAtencion($('#cboConsultorio').val(), Variables.IdTipoAtencionAdolescencia, Variables.TipoAtencionAnestesio);
            await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, Variables.IdTipoAtencionAdolescencia, Variables.IdTipoAtencionAnestesio);

            Variables.TipoModulo = $("#TipoModulo").val();

            AtencionMedica.DesbloquearCampos();
            await AtencionMedica.ModificarAtencion();

            /////////KHOYOSI (Valida si ya se ha generado un hoja de refcon)////////////
            //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
            if (AtencionMedica.permisoRefCon == '1') {
                if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {

                    if (objrowTb.idReferencia > 0) {
                        Referencias.idReferencia = objrowTb.idReferencia
                    } else if (objrowTb.idContraReferencia > 0) {
                        Referencias.idContraReferencia = objrowTb.idContraReferencia
                    }

                    Referencias.estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon                    
                }
                Referencias.idResponsable = objrowTb.idEmpleadoMedico
            }
            ///////////////////////////////////////////////////////////////////////////


            // jdelgado agregando validacion lab
            if ($('#cboConsultorio>option:selected').attr("idEspecialidad") == 9) {
                console.log('Es onco')
                $('#contLabDiag').show()
                $('#contLabCpt').show()
            } else {
                console.log('No es onco')
                $('#contLabDiag').hide()
                $('#contLabCpt').hide()
            }
            // jdelgado agregando validacion lab

            // jdelgado agregando validacion lab
            if ($('#hdUsaLabs').val() == '1') {
                $('#contUsaLabDiag').show()
                $('#contUsaLabCpt').show()
            } else {
                $('#contUsaLabDiag').hide()
                $('#contUsaLabCpt').hide()
            }
            // jdelgado agregando validacion lab

            //////////////KHOYOSI/////////////////////
            await Utilitario.GenerarAccionFlujoAtencionCE(objrowTb.idAtencion, 2);      //2: Atendiendo Paciente
            /////////////////////////////////////////

            MostrarAreaRegistro();
            $("#atencion-tab").click();
            //$("#atencion-tab").html('ATENCIÓN PRENATAL');

            AtencionMedica.CambiarEstadoColaCita(null, objrowTb.idAtencion, 5, "En Atención C.E.", '');// 5 : En Atención -- MGAMERO

        })
        //GUARDAR ATENCION
        $('#btnguardar').on('click', async function () {

            Cargando(1);

            // Si es paciente crónico validar múltiplos de 3
            //if ($('#chkPacienteCronico').is(':checked')) {
            //    if (!AtencionMedica.ValidarCantidadesFarmaciaDivisible3()) {
            //        Cargando(0);
            //        return false;
            //    }
            //}

            let consumoServ = oTable_consumoServAtencion.api(true).data()

            let procesaTeleconsulta = 0

            if (Variables.EsTeleconsulta) {
                $(consumoServ).each(async (i, obj) => {
                    if (obj.codigo == '99499.11' || obj.codigo == '99499.12') {
                        procesaTeleconsulta += 1
                    }
                })
            }

            if (Variables.EsTeleconsulta && procesaTeleconsulta == 0 && !Variables.EsConsejeriaObstetrica) {
                alerta2('warning', 'Atenciones', "Tiene que registrar procedimientos de teleinterconsulta (99499.11 o 99499.12).");
                Cargando(0)
                return false
            }

            // Notificacion para relacionar Dx con medicamentos
            let existeMedicamentoSinRelacionar = false
            dataTableFarmacia = oTable_farmacia.api(true).rows().data();
            dataTableFarmacia.each(function (value, index) {
                var cboDx = "#cboDx_" + dataTableFarmacia[index]["idItem"];

                if (isEmpty($(cboDx).val())) {
                    existeMedicamentoSinRelacionar = true
                }
                console.log('cboDx', $(cboDx).val())
            })

            if (existeMedicamentoSinRelacionar) {

                swal({
                    title: 'Atención',
                    html: 'Existen medicamentos que no tienes Diagnostico relacionado ¿Desea continuar?',
                    icon: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#706f6f',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        Cargando(1);
                        if (await Utilitario.ValidarSesion()) {

                            //const data = await AtencionMedica.GuardarAtencionV2()
                            const data = await AtencionMedica.GuardarAtencionMedica();
                            if (data == true) {
                                const datarec = await Ordenes.GuardarOrdenesMedicasV2();

                                //const dataProcedimientoServicio = await Utilitario.GenerarFormatoConsumoServicio(Variables.IdCuentaAtencion);         //COMENTADO POR KHOYOSI

                                if (Variables.IdTipoFinanciamiento == 2) {
                                    const datafua = await Utilitario.GenerarFuaPdf(Variables.IdCuentaAtencion, Variables.IdCuentaAtencion);

                                }

                                if (datarec.length > 0) {
                                    const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
                                    VisorReceta.AbrirVisorRecetas(recetas);
                                }

                                //console.log(datarec);
                                //$('.nav-tabs a[href="#lsAtenciones"]').tab('show')

                                //////////////KHOYOSI/////////////////////
                                await Utilitario.GenerarAccionFlujoAtencionCE(Variables.IdAtencion, 0);      //0: ESPERANDO
                                /////////////////////////////////////////


                                let rowAtencion = oTable_atenciones.api(true).row('.selected').data()

                                // if (rowAtencion.idEstadoCita != 2) {
                                if (true) {
                                    if (!isEmpty(Variables.IdReferencia)) {

                                        let fechaAtencion = $("#txtFechaAtencion").val(); // '13/01/2025'

                                        // Convertir la fecha a formato yyyy-MM-dd
                                        let partes = fechaAtencion.split('/'); // Divide por el separador '/'
                                        let fechaConvertida = `${partes[2]}-${partes[1]}-${partes[0]}`; // Reorganiza como yyyy-MM-dd


                                        await AtencionMedica.GenerarPacienteRecibido(
                                            fechaCita = fechaConvertida,horaCita = $('#txtHoraCia').val(),
                                            apellidoMaterno = rowAtencion.apellidoMaternoPersonal, apellidoPaterno = rowAtencion.apellidoPaternoPersonal,
                                            fechaNacimiento = rowAtencion.fechaNacimientoPersonal, idcolegio = rowAtencion.idcolegioPersonal,
                                            idprofesion = rowAtencion.idProfesionPersonal, nombres = rowAtencion.nombresPersonal,
                                            nroDocumento = rowAtencion.nroDocumentoPersonal, sexo = rowAtencion.sexoPersonal, tipoDocumento = rowAtencion.idTipoDocumentoPersonal)
                                        //await AtencionMedica.RecibirReferenciaPaciente(fechaConvertida, $('#txtHoraCia').val())
                                    }
                                }


                                console.log("1.- Recargando lista de atenciones.....");
                                //AtencionMedica.ListaAtencionesCE();
                                setTimeout(()=> {
                                    $('#btnBuscarAtenciones').trigger('click');
                                    ReposicionarVista();        //KHOYOSI
                                    MostrarAreaLista();         //KHOYOSI
                                    CerrarModulo();             //KHOYOSI
                                }, 500);
                                
                            }
                        }

                        Cargando(0)
                    }
                }).catch(swal.noop);
                Cargando(0)
                return false
            }
            //

            if (await Utilitario.ValidarSesion()) {

                //const data = await AtencionMedica.GuardarAtencionV2()                
                const data = await AtencionMedica.GuardarAtencionMedica();
                if (data == true) {
                    const datarec = await Ordenes.GuardarOrdenesMedicasV2();

                    const dataProcedimientoServicio = await Utilitario.GenerarFormatoConsumoServicio(Variables.IdCuentaAtencion);

                    if (Variables.IdTipoFinanciamiento == 2) {
                        const datafua = await Utilitario.GenerarFuaPdf(Variables.IdCuentaAtencion, Variables.IdCuentaAtencion);

                    }

                    if (datarec.length > 0) {
                        const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
                        VisorReceta.AbrirVisorRecetas(recetas);
                    }

                    //console.log(datarec);
                    //$('.nav-tabs a[href="#lsAtenciones"]').tab('show')

                    //////////////KHOYOSI/////////////////////
                    await Utilitario.GenerarAccionFlujoAtencionCE(Variables.IdAtencion, 0);      //0: ESPERANDO
                    /////////////////////////////////////////


                    let rowAtencion = oTable_atenciones.api(true).row('.selected').data()

                    //if (rowAtencion.idEstadoCita != 2) {
                    if (!isEmpty(Variables.IdReferencia)) {

                        let fechaAtencion = $("#txtFechaAtencion").val(); // '13/01/2025'

                        // Convertir la fecha a formato yyyy-MM-dd
                        let partes = fechaAtencion.split('/'); // Divide por el separador '/'
                        let fechaConvertida = `${partes[2]}-${partes[1]}-${partes[0]}`; // Reorganiza como yyyy-MM-dd


                        // await AtencionMedica.GenerarPacienteRecibido(fechaConvertida, $('#txtHoraCia').val())
                        await AtencionMedica.GenerarPacienteRecibido(
                                            fechaCita = fechaConvertida,horaCita = $('#txtHoraCia').val(),
                                            apellidoMaterno = rowAtencion.apellidoMaternoPersonal, apellidoPaterno = rowAtencion.apellidoPaternoPersonal,
                                            fechaNacimiento = rowAtencion.fechaNacimientoPersonal, idcolegio = rowAtencion.idcolegioPersonal,
                                            idprofesion = rowAtencion.idProfesionPersonal, nombres = rowAtencion.nombresPersonal,
                                            nroDocumento = rowAtencion.nroDocumentoPersonal, sexo = rowAtencion.sexoPersonal, tipoDocumento = rowAtencion.idTipoDocumentoPersonal)
                        //await AtencionMedica.RecibirReferenciaPaciente(fechaConvertida, $('#txtHoraCia').val())
                    }
                    //}
                    /*Recargar: */
                    console.log("2.- Recargando lista de atenciones...");
                    setTimeout(()=> {
                        $('#btnBuscarAtenciones').trigger('click');
                        ReposicionarVista();        //KHOYOSI
                        MostrarAreaLista();         //KHOYOSI
                        CerrarModulo();             //KHOYOSI
                    }, 500);
                }
            }
            
            Cargando(0)
        })

        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                html: '¿Estas seguro de  Salir?',
                icon: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    //////////////KHOYOSI/////////////////////
                    await Utilitario.GenerarAccionFlujoAtencionCE(Variables.IdAtencion, 0);      //0: ESPERANDO
                    /////////////////////////////////////////
                    setTimeout(()=> {
                        AtencionMedica.ListaAtencionesCE();
                        $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                        ReposicionarVista();        //KHOYOSI
                        MostrarAreaLista();         //KHOYOSI
                        CerrarModulo();             //KHOYOSI
                        oTable_atenciones.resize();
                        //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
                    }, 500);
                    
                }

            }).catch(swal.noop);

        });

        ////////////////////////////EVENTOS IMPRIMIR PARTE DIARIO///////////////////////////////////////
        $('#btnDescargaParteSF').on('click', async function () {
            if (isEmpty(AtencionMedica.codeParteDiario) == false) {
                const firma = await Utilitario.SeleccionarFirmaDigitalV2(AtencionMedica.codeParteDiario)
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            } else {
                alerta2('info', '', 'No existe Parte Diario para la programación seleccionada.')
            }

            ///////////////////////COMENTADO POR KHOYOSI/////////////////////////
            //var programacion = $('#cboConsultorio>option:selected').attr("prog")
            //Cargando(1);
            //const data = await AtencionMedica.GeneraParteDiario(programacion);
            //Cargando(0);

            //if (data != '0') {
            //    alerta(1, 'El Parte Diario se genero correctamente.');
            //    const firma = await Utilitario.SeleccionarFirmaDigitalV2(data);

            //    if (typeof firma === 'undefined') {
            //        alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
            //    } else {
            //        AbrirVisorDocumento(firma.rutaArchivo, 0);
            //    }
            //} else {
            //    alerta(2, 'Hubo un error al generar el Parte Diario.')
            //}

            //if (data == true) {
            //    alerta(1, 'El Parte Diario se genero correctamente.');
            //    const firma = await Utilitario.SeleccionarFirmaDigital(programacion, programacion, 'CE-PD')               //KHOYOSI

            //    if (typeof firma === 'undefined') {
            //        alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
            //    } else {
            //        //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
            //        AbrirVisorDocumento(firma.rutaArchivo, 0)
            //    }
            //} else {
            //    alerta(2, 'Hubo un error al generar el Parte Diario.')
            //}
        })

        $('#btnDescargaParte').on('click', async function () {
            if (isEmpty(AtencionMedica.codeParteDiario) == false) {
                await Utilitario.AbrirDocumentoFirmadoBit4Id(AtencionMedica.codeParteDiario);
            } else {
                alerta2('info', '', 'No existe Parte Diario para la programación seleccionada.')
            }

            //var programacion = $('#cboConsultorio>option:selected').attr("prog");         
            ////////////////// COMENTADO POR KHOYOSI///////////////////////
            //var codePD = $("#btnDescargaParte").attr("data-code");

            //if (isEmpty(codePD)) {
            //    alerta('2', 'El documento del Parte Diario no se encuentra firmado digitalmente.');
            //} else {
            //    Utilitario.AbrirDocumentoFirmadoBit4Id(codePD);
            //}


            //var programacion = $('#cboConsultorio>option:selected').attr("prog");
            //const firma = await Utilitario.SeleccionarFirmaDigital(0, programacion, 'CE-PD')               //KHOYOSI
            //if (typeof firma === 'undefined') {
            //    alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
            //} else {
            //    if (firma.statusFirma == 0) {
            //        alerta('2', 'El documento del Parte Diario no se encuentra firmado digitalmente.')
            //    } else {
            //        //Utilitario.AbrirDocumentoFirmadoBit4Id(firma.idRegistro, firma.idCuentaAtencion, 'CE-PD');
            //        Utilitario.AbrirDocumentoFirmadoBit4Id(firma.code);
            //    }                
            //    //AtencionMedica.ImprimiParteDiarioConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo)
            //}

        })

        $('#btnGeneraParte').on('click', async function () {
            if (isEmpty(AtencionMedica.codeParteDiario) == false) {
                Utilitario.TipoArchivoFirmar = 'CE-PD';
                //await Utilitario.IniciarServicioFirmaBit4Id(AtencionMedica.codeParteDiario);
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(AtencionMedica.codeParteDiario); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(AtencionMedica.codeParteDiario); }

            } else {
                alerta2('info', '', 'No existe Parte Diario para la programación seleccionada.')
            }

            ///////////COEMNTADO POR KHOYOS//////////////////////
            //swal({
            //    title: 'Generar Parte Diario',
            //    text: 'Estas seguro generar y firmar el parte diario?',
            //    type: 'warning',
            //    allowOutsideClick: false,
            //    showCancelButton: true,
            //    confirmButtonColor: '#4fb7fe',
            //    cancelButtonColor: '#656464',
            //    confirmButtonText: 'Aceptar',
            //    cancelButtonText: 'Cancelar'
            //}).then(async function () {
            //    var programacion = $('#cboConsultorio>option:selected').attr("prog")
            //    const data = await AtencionMedica.GeneraParteDiario(programacion)

            //    Cargando(1)
            //    Utilitario.TipoArchivoFirmar == 'PD';
            //    if (data != '0') {
            //        alerta(1, 'El Parte Diario se genero correctamente.')
            //        const firma = await Utilitario.SeleccionarFirmaDigitalV2(data)               //KHOYOSI
            //        $("#btnDescargaParte").attr("data-code", data);
            //        if (typeof firma === 'undefined') {
            //            alerta('2', 'Hubo un error al cargar el documento del Parte Diario.')
            //        } else {
            //            /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(firma.code); }*/
            //            if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(firma.code); }
            //            if (permisoFirmaDigital == 2) { await Utilitario.AbrirServicioFirmaPeru(firma.code); }
            //            //await Utilitario.AbrirServicioFirmaBit4Id(firma.code);                       
            //        }
            //    } else {
            //        alerta(2, 'Hubo un error al generar el Parte Diario.')
            //    }
            //    Cargando(0)

            //})
        })
        // PARTE DIARIO

        //FIRMAR CE, RECFON, FUA        
        $('#tblAtencion tbody').on('click', '.btnFirmaCE', async function () {
            Utilitario.TipoArchivoFirmar = 'CE';
        })
        /////////////////////////////

        /////////////////////////////////EVENTOS MOSTRAR VISOR RECETAS//////////////////////////////////////////////
        $('#btnImprimeRecetas').on('click', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)
            const recetas = await Ordenes.SeleccionarRecetasCabecera(Variables.IdCuentaAtencion, Variables.IdTipoFinanciamiento, Variables.IdServicioIngreso, Variables.IdMedico);
            VisorReceta.AbrirVisorRecetas(recetas);
        })

        $('#tblAtencion tbody').on('click', '.btnImprimeRecetas', async function () {// KHOYOSI
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            Variables.Limpiar();
            //Variables.Cargar(objrow);
            Variables.IdCuentaAtencion = row.idCuentaAtencion;
            Variables.IdTipoFinanciamiento = row.idTipoFinanciamiento;
            Variables.IdServicioIngreso = row.idServicioIngreso;
            Variables.IdMedico = row.idMedico;
            //Variables.IdCuentaAtencion = row.idCuentaAtencion;
            const recetas = await Ordenes.SeleccionarRecetasCabecera(row.idCuentaAtencion, row.idTipoFinanciamiento, row.idServicioIngreso, row.idMedico);
            VisorReceta.AbrirVisorRecetas(recetas);
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        $('#btnCboRefresca').on('click', function () {
            AtencionMedica.RefresacaCombox();
        })

        $("#txtFechaAtencion").focusout(function (e) { // JDELGADO001
            $('#lblMedicoProgramado').html("")
            var code = (e.keyCode ? e.keyCode : e.which)
            if (code == 13) {
                oTable_atenciones.fnClearTable()
                if ($("#txtFechaAtencion").val() == "") {
                    alerta('2', 'Ingrese fecha de atencion')
                    return false;
                }
                else {
                    if (esFormatoFecha($("#txtFechaAtencion").val())) {
                        AtencionMedica.ListaServicios();
                    }
                }
            }

            if ($("#txtFechaAtencion").val() == fechaP) {
                if ($("#idMedicotxt").val() > 0) {
                    $("#btnLlamarPaciente").show();
                }

            } else {
                $("#btnLlamarPaciente").hide();
            }
        })

        $('#txtFechaAtencion').on('change', function () {
            $('#lblMedicoProgramado').html("")
            oTable_atenciones.fnClearTable()
            if ($("#txtFechaAtencion").val() == "") {
                alerta('2', 'Ingrese fecha de atencion')
                return false;
            }
            else {
                if (esFormatoFecha($("#txtFechaAtencion").val())) {
                    AtencionMedica.ListaServicios();
                }
            }

            if ($("#txtFechaAtencion").val() == fechaP) {
                if ($("#idMedicotxt").val() > 0) {
                    $("#btnLlamarPaciente").show();
                }
            } else {
                $("#btnLlamarPaciente").hide();
            }
        });

        $('#cboConsultorio').on('change', function (e) {
            e.preventDefault();
            $("#codeParte").val($('#cboConsultorio>option:selected').attr("code"))
            $("#statusParte").val($('#cboConsultorio>option:selected').attr("status"))

            //console.log($('#cboConsultorio>option:selected').attr("idEmpleado"));

            if ($('#cboConsultorio>option:selected').attr("code") != "" && $('#cboConsultorio>option:selected').attr("status") == 1) {
                $('#btnGeneraParte').css("visibility", 'hidden')
            }
            else {
                $('#btnGeneraParte').css("visibility", 'visible')
            }
            $('#btnBuscarAtenciones').trigger("click")
        })

        $('#cboTipoAtencionAdolecencia').on('change', async function () {
            //await AtencionMedica.CargarModuloAdolecencia($('#cboTipoAtencionAdolecencia').val())
            if ($('#cboTipoAtencionAdolecencia').val() == 1) {
                await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, 1, 0);
                Perinatal.Iniciar();
                $("#atencion-tab").html("ATENCIÓN PRENATAL");
                await Perinatal.ListaProCabByIdAten(Variables.IdAtencion, Variables.IdPaciente);
            } else if ($('#cboTipoAtencionAdolecencia').val() == 2) {
                await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, 2, 0);
                Especialidades.Iniciar();
                $("#atencion-tab").html("ATENCIÓN MÉDICA");
            }
            Variables.TipoModulo = $("#TipoModulo").val();
        })

        ////////////////////////////////EVENTOS IMPRIME PROCEDIMIENTOS//////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.btnImprimepRrocedimientos', async function () { // JDELGADO J0 CAMBIO METODO IMPRESION}
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeProc)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, Vuelva a guardar la atencion.')

            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        })
        /////////////////////////////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////EVENTOS IMPRIMIR FUA/////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.codeFua)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarFuaPdf(row.idCuentaAtencion, row.idCuentaAtencion);

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

        $('#tblAtencion tbody').on('click', '.ImprimeFuaCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.codeFua);
        });

        $('#tblAtencion tbody').on('click', '.FirmarFuaSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_atenciones.fnGetData(objrow)

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.codeFua)               //KHOYOSI            
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua); }*/
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.codeFua); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.codeFua); }
                //await Utilitario.AbrirServicioFirmaBit4Id(row.codeFua);
            }
            Cargando(0);
        });

        /////////////////////////////////EVENTOS IMPRIMIR REFCON/////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            var idRefCon = 0;
            var tipo = '';
            var code = '';

            Cargando(1);
            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(code)               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarRefConPdf(row.idCuentaAtencion, idRefCon, tipo);

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

        //$('#tblAtencion tbody').on('click', '.ImprimeHojaRefConConF', async function () {
        //    var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atenciones.fnGetData(objrow);


        //    if (row.idReferencia != null) {
        //        idRefCon = row.idReferencia;
        //        tipo = 'RF';
        //    } else {
        //        if (row.idContraReferencia != null) {
        //            idRefCon = row.idContraReferencia;
        //            tipo = 'CRF';
        //        }
        //    }

        //    const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, idRefCon, tipo)               //KHOYOSI
        //    ImprimirRefConFirmado(firma.idCuentaAtencion, firma.idRegistro, firma.code, firma.idDoc, firma.tipo);
        //});

        $('#tblAtencion tbody').on('click', '.ImprimeHojaRefConCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            await Utilitario.AbrirDocumentoFirmadoBit4Id(code);
        });

        $('#tblAtencion tbody').on('click', '.FirmarHojaRefConSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            var tipo = '';
            var code = '';

            if (row.idReferencia > 0) {
                idRefCon = row.idReferencia;
                tipo = 'RF'
                code = row.codeRef;
            } else if (row.idContraReferencia > 0) {

                idRefCon = row.idContraReferencia;
                tipo = 'CRF';
                code = row.codeCRef;
            }
            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(code)               //KHOYOSI            
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(code); }*/
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(code); }
                //await Utilitario.AbrirServicioFirmaBit4Id(code);
            }
            Cargando(0);
        });

        ////////////////////////////////EVENTOS IMPRIMIR INFORME/////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.ImprimeInforme', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A')               //KHOYOSI
            const informe = await AtencionMedica.ImprimiInforme2(firma.idCuentaAtencion, firma.code, firma.idDoc)
        });

        $('#tblAtencion tbody').on('click', '.ImprimeInformeSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code)               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                if (typeof row.usaModuloMaterno === 'undefined') {
                    alerta(2, "Seleccione Fila");
                } else {
                    if (row.usaModuloMaterno) {
                        tipoFormato = 1;
                    }
                    else if (row.usaModuloNinoSano) {
                        tipoFormato = 2;
                    }
                    else {
                        tipoFormato = 0;
                    }

                    tipoHoja = 'AT';
                    if (row.idTipoAtencionAnestesio > 0) {
                        tipoHoja = 'AN';
                    }
                    //imprimiInformeSF(row.idCuentaAtencion, row.idProCabecera, tipoFormato)
                }

                const pdf = await Utilitario.GenerarAtencionPdf(row.idCuentaAtencion, row.idAtencion, row.idProCabecera, tipoFormato, tipoHoja);

                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });

        $('#tblAtencion tbody').on('click', '.ImprimeInformeCF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#tblAtencion tbody').on('click', '.FirmarInformeSF', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI            
            if (firma) {
                /*if (permisoFirmaDigital == 1) { await Utilitario.AbrirServicioFirmaBit4Id(row.code); }*/
                if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
                if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
            }
            Cargando(0);
        });

        //////////////////////////////KHOYOSI///////////////////////////////////////////////
        $('#tblAtencion tbody').on('click', '.btnCarnetPrenatal', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(row.idPaciente);

            //AbrirVisorDocumento(carnet, 0);
            //Cargando(0);
            //console.log("RUTA: " + ruta);
            //$("#visorDocumento").attr("src", PathServerFiles + row.rutaArchivo);
            //$('#modalVisorDocumento').modal('show');            
        });
        $('#tblAtencion tbody').on('click', '.Firma4Identity', async function (event) {
            event.preventDefault();

            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            //console.log(row);
            Cargando(1);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A');               //KHOYOSI
            //$(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('.bit4id-document').text(`${PathServerFiles}${firma.rutaArchivo}`);
            $('.bit4id-documentName').text(firma.rutaArchivo.substr(firma.rutaArchivo.indexOf("/") + 1,).substr(firma.rutaArchivo.substr(firma.rutaArchivo.indexOf("/") + 1,).indexOf("/") + 1,));
            $('.bit4id-documentID').text(`${firma.rutaArchivo},${firma.idCuentaAtencion},CE-A,ConsultaExterna,RegistroAtencion`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";

            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            Cargando(0);

            return false
        });
        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprime', async function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'CE-A');               //KHOYOSI
            AbrirVisorDocumento('/4IdentitySignedFiles' + firma.rutaArchivo, 1);
            Cargando(0);
        });
        $('#tblAtencion tbody').on('click', '.Firma4IdentityFUA', function (event) {
            event.preventDefault();

            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);
            $(".bit4id-sign").attr("action", '/Utilitario/FirmaComponent?area=ConsultaExterna');
            $('#bit4id-document').text(`${PathServerFiles}${row.rutaArchivoFua}`);
            $('#bit4id-documentName').text(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).substr(row.rutaArchivoFua.substr(row.rutaArchivoFua.indexOf("/") + 1,).indexOf("/") + 1,));
            $('#bit4id-documentID').text(`${row.rutaArchivoFua},${row.idCuentaAtencion},FUA`);
            //imgVisto = "<?="http://".$_SERVER['HTTP_HOST'].str_replace("firmaDocumentos.php","images/isotipo.png",$_SERVER['PHP_SELF'])?>";
            //imgFormat = "[{\"align\":\"middle\",\"data_format\":{\"timezone\":\"America/Lima\",\"strtime\":\"%d/%m/%Y %H:%M:%S\"},\"format\":[\"Firmado digitalmente por:\",\"$(CN)s\",\"Fecha: $(date)s\"]}]";
            $(".bit4id-image").html(`${PathServerFiles}/logosFirma/isotipo.png`);
            $(".bit4id-paragraphFormat").html(`${PathServerFiles}/logosFirma/isotipo.png`);

            window.location.href = document.getElementsByClassName('bit4-link')[0].href;

            return false
        });
        $('#tblAtencion tbody').on('click', '.btnFirma4IdentityImprimeFUA', function () {
            var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atenciones.fnGetData(objrow);

            AbrirVisorDocumento('/4IdentitySignedFiles' + row.rutaArchivoFua, 0);
        });
        $('#tblAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atenciones.api(true).row($(this)).index();
            var row = oTable_atenciones.fnGetData(pos);

            $('#idPaciente').val(row.idPaciente);
            $('#idAtencion').val(row.idAtencion);
            $('#idDestinoAtencion').val(row.idDestinoAtencion);
            $('#txtDatos').html('N°. HC: ' + row.nroHistoriaClinica + ' / N°. Cuenta: ' + row.idCuentaAtencion + ' / Paciente: ' + row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres + " / Edad: " + row.edadPaciente)
            $('#txtDatoCuenta').val(row.idCuentaAtencion);
            $('#txtDatoPaciente').val(row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombres);
            $('#txtDatoHistoria').val(row.nroHistoriaClinica);
            $('#txtDatoEdad').val(row.edadPaciente);
        });


        $('#chkEsEvaluacionPreAnestesica').on('click', async () => {
            if ($('#chkEsEvaluacionPreAnestesica').is(':checked')) {
                await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, 0, 1);
                Anestesiologia.Iniciar(); cboTipoAtencionAdolecencia
                $("#atencion-tab").html("ATENCIÓN PRE-ANESTÉSICA");
                /*$('#contenedorEspecialidades').hide()
                $('#contenedorPreAnestesica').show()

                $('[href="#examenEvalAnest"]').closest('li').show();
                $('[href="#resultadosAnest"]').closest('li').show();*/
            } else {
                await AtencionMedica.CargarModuloAtencion(Variables.IdServicioIngreso, 0, 0);
                Especialidades.Iniciar();
                $("#atencion-tab").html("ATENCIÓN MÉDICA");
                //$('#contenedorPreAnestesica').hide()
                //$('#contenedorEspecialidades').show()

                //$('[href="#examenEvalAnest"]').closest('li').hide();
                //$('[href="#resultadosAnest"]').closest('li').hide();
            }
            Variables.TipoModulo = $("#TipoModulo").val();
            $("#atencion-tab").click();
        })


        ////////////////////KHOYOSI PARTIAL EVENTS/////////////////////////////////////
        $('#btnCarnetPrenatal').on('click', async function () {
            var objrow = oTable_atenciones.api(true).row('.selected').data();
            console.log("btnCarnetPrenatal");
            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(objrow.idPaciente);
        })
        $("#btnImprimeSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = oTable_atenciones.api(true).row('.selected').data();
            //SeguimientoPaciente.llendaDatos(Variables.NroHistoriaClinica, 0)
            SeguimientoPaciente.llenaDatos(Variables.NroHistoriaClinica, 0);
            $("#modalSeguimiento").modal('show');
        })
        $("#btnCerrarSeguimiento").on('click', function () {
            $("#modalSeguimiento").modal('hide');
        })
        //jdelgado
        $("#btnImprimeSeguimientoCPN").on('click', function () {
            SeguimientoPacienteCPN.limpiaDatos();
            var objrow = oTable_atenciones.api(true).row('.selected').data()
            //console.log(objrow)
            SeguimientoPacienteCPN.llendaDatos(Variables.NroHistoriaClinica)
            $("#modalSeguimientoCPN").modal('show');
        })
        $("#btnCerrarSeguimientoCPN").on('click', function () {
            $("#modalSeguimientoCPN").modal('hide');
        })

        $('#btnImprimeAtencion').on('click', function () {
            var objrow = AtencionMedica.oTable_atenciones.api(true).row('.selected').data();
            tipoFormato = 0;
            if (objrow.usaModuloMaterno) {
                tipoFormato = 1;
            }
            else {
                tipoFormato = 0;
            }
            imprimiInforme(objrow.idCuentaAtencion, tipoFormato, objrow.idProCabecera)
        })

        $('#btnFirmaAtencion').on('click', async function () {
            let objrow = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(objrow)) {
                alerta2('info', '', 'Seleccione un registro')
                return false
            }

            if (objrow.idEstadoAtencion == 0) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra anulado.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            if (objrow.idEstadoAtencion == 2) {
                //swal({
                //    title: 'Atenciones',
                //    text: "La cuenta del paciente se encuentra cerrado.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "La cuenta del paciente se encuentra cerrado.");
                return false;
            }

            if (isEmpty(objrow.fechaEgreso)) {
                //swal({
                //    title: 'Atenciones',
                //    text: "El paciente aun no ha sido atendido.",
                //    type: 'warning',
                //    allowOutsideClick: false,
                //}).done();
                alerta2('warning', 'Atenciones', "El paciente aun no ha sido atendido.");
                return false;
            }

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'CE';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(objrow.idCuentaAtencion, '', "'CE-A','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    //await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data);
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(objrow.idCuentaAtencion, "'CE-A','REC','RF', 'CRF','FUA'");
            }
            Cargando(0)
        })

        $('#btnFirmaLote').on('click', async function () {
            let listAtenciones = oTable_atenciones.api(true).data();
            let cuentasAtencion = [];


            $(listAtenciones).each(async (i, obj) => {
                if (!isEmpty(obj.fechaEgreso) && obj.idEstadoCita == 2) {
                    cuentasAtencion.push(obj.idCuentaAtencion);
                }
            });

            if (cuentasAtencion.length == 0) {
                alerta2('info', '', 'No existen atenciones abiertas y/o atendidas para firmar.');
                return false;
            }

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'CE';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, '', "'CE-A','REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, "'CE-A','REC','RF', 'CRF','FUA'");
            }
            Cargando(0)
        })

        $('#btnFirmaLoteAtenciones').on('click', async function () {
            let listAtenciones = oTable_atenciones.api(true).data();
            let cuentasAtencion = [];

            $(listAtenciones).each(async (i, obj) => {
                if (!isEmpty(obj.fechaEgreso) && obj.idEstadoCita == 2) {
                    cuentasAtencion.push(obj.idCuentaAtencion);
                }
            });

            if (cuentasAtencion.length == 0) {
                alerta2('info', '', 'No existen atenciones abiertas y/o atendidas para firmar.');
                return false;
            }

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'CE';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, '', "'CE-A'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, "'CE-A'");
            }
            Cargando(0)
        })

        $('#btnFirmaLoteOtros').on('click', async function () {
            let listAtenciones = oTable_atenciones.api(true).data();
            let cuentasAtencion = [];

            $(listAtenciones).each(async (i, obj) => {
                if (!isEmpty(obj.fechaEgreso) && obj.idEstadoCita == 2) {
                    cuentasAtencion.push(obj.idCuentaAtencion);
                }
            });

            if (cuentasAtencion.length == 0) {
                alerta2('info', '', 'No existen atenciones abiertas y/o atendidas para firmar.');
                return false;
            }

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'CE';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos(cuentasAtencion, '', "'REC','RF', 'CRF','FUA'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data);
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru(cuentasAtencion, "'REC','RF', 'CRF','FUA'");
            }
            Cargando(0)
        })

        $("#txtPesoPregesta").on('focusout', function () {
            //console.log("funciono");
            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        })
        $("#txtTalla").on('change', function () {

            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))

        })

        //$('#txtProximaConsulta').datepicker({
        //    changeMonth: true,  // Permite cambiar el mes
        //    changeYear: true    // Permite cambiar el año
        //}).on('changeMonth', function (event) {
        //    AtencionMedica.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, FormatearFecha(Variables.FechaIngreso));
        //    //console.log("El mes ha cambiado a: " + (parseInt(event.date.getMonth()) + 1)); // Mes actualizado (0-11)

        //}).on('changeYear', function (event) {
        //    //console.log("El año ha cambiado a: " + event.date.getFullYear()); // Año actualizado

        //});

        //$('#txtProximaConsulta').datepicker({
        //    todayHighlight: true,
        //    autoclose: true,
        //    orientation: "bottom"
        //}).on('hide', function () {
        //    console.log("El calendario se ha cerrado.");
        //    AtencionMedica.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, FormatearFecha(Variables.FechaIngreso));
        //});


        $("#cboDestino").on('change', async function () {
            $("#divProximaConsulta").hide();
            $("#divReferencia").hide();

            if ($("#cboDestino").val() == 60) {
                $('#txtProximaConsulta').attr("disabled", false);
                //$("#cboTipoConsulta").removeAttr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");

                ///////////////////PROXIMA CITA/////////////////////////////////////////////////////////
                if (Variables.IdEspecialidadIngreso >= 1 && Variables.IdEspecialidadIngreso <= 5) {
                    if (Variables.IdCitaProxima > 0) {
                        let citaProx = await AtencionMedica.CitaSeleccionarPorId(Variables.IdCitaProxima);
                        if (isEmpty(citaProx) == false) {
                            $('#txtProximaConsulta').val(citaProx.fecha);
                            await AtencionMedica.ProximaConsulta_Change();
                            //$('#cboTipoConsulta').val(citaProx.idTipoConsulta);
                            $('#cboProgramacionProximaConsulta').val(citaProx.idProgramacion);
                            await AtencionMedica.ProgramacionCuposTotales();
                            $('#cboHoraProximaConsulta').val(citaProx.horaInicio);

                            $('#cboDestino').attr("disabled", true);
                            $('#txtProximaConsulta').attr("disabled", true);
                            $('#cboTipoConsulta').attr("disabled", true);
                            $('#cboProgramacionProximaConsulta').attr("disabled", true);
                            $('#cboHoraProximaConsulta').attr("disabled", true);

                            $('.chzn-select').chosen().trigger("chosen:updated");
                        }
                    }
                }
                ///////////////////////////////////////////////////////////////////////////////////////////

                $("#divProximaConsulta").show();
            } else {
                $('#txtProximaConsulta').val("");
                $('#cboTipoConsulta').val(1);

                $('#cboProgramacionProximaConsulta').empty();
                $('#cboProgramacionProximaConsulta').val("");
                $('#cboHoraProximaConsulta').empty();
                $('#cboHoraProximaConsulta').val("");

                $('#txtProximaConsulta').attr("disabled", true);
                $("#cboTipoConsulta").attr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");

                $("#divProximaConsulta").hide();
            }

            //KHOYOSI (START)   (validamos que boton mostrar de acuerdo al destino que se seleccione)
            //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
            if (AtencionMedica.permisoRefCon == '1') {
                if ($("#cboDestino").val() == 12 || $("#cboDestino").val() == 13) {
                    Referencias.estadoGuardadoRefCon = false;           //asigna que no aun no se ha guardado la hoja de refcon, a causa de que se ha seleccionado un nuevo destino
                    if ($("#cboDestino").val() == 12) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " REFERENCIA")
                    }
                    if ($("#cboDestino").val() == 13) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " CONTRAREFERENCIA")
                    }
                    $("#divReferencia").show();
                    $('#btnRefCon').show();
                } else {
                    Referencias.estadoGuardadoRefCon = true //asiga que se ha guardado la hoja de refcon, ya que el destino es diferente a las opciones de Referencia o Contrareferencia
                    $("#divReferencia").hide();
                    $('#btnRefCon').hide();
                }
            }
            //KHOYOSI (END)
        });

        ////////////////////////EVENTOS - PROXIMA CITA//////////////////////////////////////////////////////////////////////////
        $('#txtProximaConsulta').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        }).on('show', async function () {
            //console.log("El calendario se ha desplegado.");
            await AtencionMedica.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, 0, FormatearFecha(Variables.FechaIngreso), '#a09afd');
            await AtencionMedica.ListarFechasFuturasProgramacionMedica(Variables.IdEspecialidadIngreso, Variables.IdMedico, FormatearFecha(Variables.FechaIngreso), '#03dda6');
        });

        $("#txtProximaConsulta").on('change', async function () {
            await AtencionMedica.ProximaConsulta_Change();
        });

        $("#cboProgramacionProximaConsulta").on('change', async function () {
            await AtencionMedica.ProgramacionProximaConsulta_Change();
        });

        //$('.btnImprimirTicketProximaCita').on('click', async function () {
        $(document).on("click", ".btnImprimirTicketProximaCita", async function () {
            let objCupo = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(objCupo) == false) {
                if (objCupo.idCitaProxima > 0) {
                    let citaProx = await AtencionMedica.CitaSeleccionarPorId(objCupo.idCitaProxima);

                    var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + citaProx.idCita + "&nroCupo=" + citaProx.turno
                    //$('#ifrmTicketCita').attr('src', url)
                    newIframe.src = url;

                    //$('#btnCerrarModalCita').trigger("click")
                    //$("#modalTicket").modal('show')
                }
            }

        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        $('#cboEpisodio').on('change', function () {
            var fecha = null
            var episodio = 0
            var idAtencion = $("#cboEpisodio option:selected").attr("atencion");
            episodio = $('#cboEpisodio').val()
            $('#chkNuevo').prop('checked', false)
            $('#chkCierre').prop('checked', false)

            $(AtencionMedica.listaEpisodios.table).each(function (i, obj) {
                //console.log(obj.idEpisodio + '---' + episodio );

                if (obj.idEpisodio == episodio) {
                    if (isEmpty(obj.fechaCierre)) {
                        $('#chkCierre').prop('checked', false)
                    }
                    else {
                        $('#chkCierre').prop('checked', true)
                    }
                }
                if (obj.idAtencion == idAtencion) {
                    $('#chkNuevo').prop('checked', true)
                }
            });
        });


    },

    //////////////////////////////////////////PROXIMA CITA////////////////////////////////////////////////////////////////////////////////
    async ProximaConsulta_Change() {
        let fecha = $("#txtProximaConsulta").val();

        $("#cboProgramacionProximaConsulta").empty();
        $("#cboHoraProximaConsulta").empty();
        $("#cboProgramacionProximaConsulta").val("");
        $("#cboHoraProximaConsulta").val("");

        if (isEmpty(fecha) == false) {
            if (esFormatoFecha(fecha) == true) {
                await AtencionMedica.ListarServiciosPorFechaEspecialidadMedico(Variables.IdEspecialidadIngreso, 0, fecha);
            }
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async ProgramacionProximaConsulta_Change() {
        let idProg = $("#cboProgramacionProximaConsulta").val();

        $("#cboHoraProximaConsulta").empty();
        $("#cboHoraProximaConsulta").val("");

        if (isEmpty(idProg) == false) {
            await AtencionMedica.ListarProgramacionMedicaCuposDisponibles(idProg);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async ProgramacionProximaConsulta_Change() {
        let idProg = $("#cboProgramacionProximaConsulta").val();

        $("#cboHoraProximaConsulta").empty();
        $("#cboHoraProximaConsulta").val("");

        if (isEmpty(idProg) == false) {
            await AtencionMedica.ListarProgramacionMedicaCuposDisponibles(idProg);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async ProgramacionCuposTotales() {
        let idProg = $("#cboProgramacionProximaConsulta").val();

        $("#cboHoraProximaConsulta").empty();
        $("#cboHoraProximaConsulta").val("");

        if (isEmpty(idProg) == false) {
            await AtencionMedica.ListarProgramacionMedicaCuposTotales(idProg);
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async CitaSeleccionarPorId(idCita) {
        let datos;
        let resp = null;
        let midata = new FormData();
        midata.append('idCita', idCita);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/CitaSeleccionarPorId?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.dataSet.table.length > 0) {
                resp = datos.dataSet.table[0];
            }
        } catch (error) {
            Cargando(0)
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return resp;
    },

    async ListarFechasFuturasProgramacionMedica(idEspecialidad, idMedico, fechaAtencion, codigoColor) {
        let datos;
        let midata = new FormData();
        midata.append('idEspecialidad', idEspecialidad);
        midata.append('idMedico', idMedico);
        midata.append('fechaAtencion', fechaAtencion);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarFechasFuturasProgramacionMedica?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0)
            if (datos.dataSet.table.length > 0) {
                datos = datos.dataSet.table;
                $(datos).each(function (i, obj) {
                    ResaltarFechaDatePicker(obj.fecha, codigoColor);
                });
            }
        } catch (error) {
            Cargando(0)
            //console.error(JSON.stringify(error))
            alerta(3, JSON.stringify(error));
        }

        return datos;
    },

    async ListarServiciosPorFechaEspecialidad(idEspecialidad, fecha) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idTipoServicio', 1);
        data.append('idEspecialidad', idEspecialidad);
        data.append('activaProcedimiento', 0);
        data.append('fecha', fecha);

        try {
            $('#cboProgramacionProximaConsulta').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarServiciosPorFechaEspecialidad?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboProgramacionProximaConsulta').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + ' (' + obj.codigoTurno + ') ' + ' [' + obj.medico + ']' + '</option>');
            });
            $('#cboProgramacionProximaConsulta').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async ListarServiciosPorFechaEspecialidadMedico(idEspecialidad, idMedico, fecha) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idTipoServicio', 1);
        data.append('idEspecialidad', idEspecialidad);
        data.append('idMedico', idMedico);
        data.append('activaProcedimiento', 0);
        data.append('fecha', fecha);

        try {
            $('#cboProgramacionProximaConsulta').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarServiciosPorFechaEspecialidadMedico?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboProgramacionProximaConsulta').append('<option data-medico="' + obj.medico + '" value="' + obj.idProgramacion + '">' + obj.nombre + ' (' + obj.codigoTurno + ') ' + ' [' + obj.medico + ']' + '</option>');
            });
            $('#cboProgramacionProximaConsulta').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async ListarProgramacionMedicaCuposDisponibles(idProgramacion) {
        let resp = null;
        let datos
        let cantidadCupos = 0;
        let cantidadContinuadores = 0;
        let limiteNuevos = 4;     //LIMITE DE PACIENTES NUEVOS POR PROGRAMACION
        let limiteContinuadores = 0;
        let data = new FormData();

        data.append('idProgramacion', idProgramacion);

        try {
            $('#cboHoraProximaConsulta').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarProgramacionMedicaCuposTotales?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            cantidadCupos = resp.table.length;
            limiteContinuadores = cantidadCupos - limiteNuevos;

            $(resp.table).each(function (i, obj) {
                if (obj.tipoPaciente == 'CONTINUADOR') {
                    cantidadContinuadores++;
                }

                if (obj.idPaciente == 0) {
                    $('#cboHoraProximaConsulta').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
                }
            });

            if (cantidadContinuadores == limiteContinuadores) {
                $('#cboHoraProximaConsulta').empty();
                alerta(4, 'Ya no existen cupos disponibles.');
            }

            $('#cboHoraProximaConsulta').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async ListarProgramacionMedicaCuposTotales(idProgramacion) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idProgramacion', idProgramacion);

        try {
            $('#cboHoraProximaConsulta').empty();
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/ListarProgramacionMedicaCuposTotales?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);

            resp = datos.respuesta;
            $(resp.table).each(function (i, obj) {
                $('#cboHoraProximaConsulta').append('<option data-horaInicio="' + obj.horaInicio + '" data-horaFin="' + obj.horaFin + '" value="' + obj.horaInicio + '">' + obj.cupoDisponible + '</option>');
            });
            $('#cboHoraProximaConsulta').val("");
            $('.chzn-select').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);
            resp = null;
            alerta2("error", "", error);
        }

        return resp;
    },

    async GuardarProximaCita(idAtencionOrigen, idCita, idPaciente, idProgramacion, horaInicioAtencion, idTipoConsulta, idSiaSis, sisCodigo) {
        let formData = new FormData();
        let datos;
        let resp = false;
        let result = null;

        formData.append('IdAtencionOrigen', idAtencionOrigen);
        formData.append('IdCita', idCita);
        formData.append('IdPaciente', idPaciente);
        formData.append('IdProgramacion', idProgramacion);
        formData.append('HoraInicioAtencion', horaInicioAtencion);
        formData.append('IdTipoConsulta', idTipoConsulta);
        formData.append('IdSiaSis', idSiaSis);
        formData.append('SisCodigo', sisCodigo);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Citas/GuardarProximaCita?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                datos = datos.respuesta.table[0];
                if (datos.errorNumber == 0) {
                    alerta(1, datos.successMessage);
                    //alerta2("success", "", datos.successMessage);
                    return true;
                } else {
                    alerta(3, datos.errorMessage);
                    //alerta2("error", "", datos.errorMessage);
                    return false;
                }
            }
            else {
                alerta2('error', '', 'Hubo un error al guardar la cita.');
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    GenerarPacienteRecibido: async function (fechaCita, horaCita,
        apellidoMaterno, apellidoPaterno, fechaNacimiento, idcolegio, idprofesion, nombres, nroDocumento, sexo, tipoDocumento) {
        var midata = new FormData();
        midata.append('codigoRenipressDestino', '6208');
        midata.append('condicionPaciente', 'E');
        midata.append('fechaCita', fechaCita);
        midata.append('horaCita', horaCita);
        midata.append('idReferencia', Variables.IdReferencia);
        midata.append('llegoPaciente', 'S');

        
        midata.append('apellidoMaterno', apellidoMaterno);
        midata.append('apellidoPaterno', apellidoPaterno);
        midata.append('fechaNacimiento', fechaNacimiento);
        midata.append('idcolegio', idcolegio);
        midata.append('idprofesion', idprofesion);
        midata.append('nombres', nombres);
        midata.append('nroDocumento', nroDocumento);
        midata.append('sexo', sexo);
        midata.append('tipoDocumento', tipoDocumento);

        //Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/GenerarPacienteRecibido?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.estado) {
                    let mensaje = res.msj; // Suponiendo que res.msj contiene el código de respuesta

                    if (mensaje == "0000") {
                        alerta(1, "Operación correcta");
                    }
                    else if (mensaje == "0001") {
                        alerta(2, "No se encontró registro de la referencia");
                    }
                    else if (mensaje == "0002") {
                        alerta(2, "Verificar la fecha de fechaCita y horaCita");
                    }
                    else if (mensaje == "1001") {
                        alerta(2, "Ingresar el id de REFERENCIA idReferencia");
                    }
                    else if (mensaje == "1002") {
                        alerta(2, "Ingresar la fecha de la cita fechaCita");
                    }
                    else if (mensaje == "1003") {
                        alerta(2, "Ingresar la hora de la cita horaCita");
                    }
                    else if (mensaje == "1004") {
                        alerta(2, "Ingresar el código de establecimiento destino codigoRenipressDestino");
                    }
                    else if (mensaje == "1005") {
                        alerta(2, "Ingresar la llegada del paciente llegoPaciente");
                    }
                    else if (mensaje == "1006") {
                        alerta(2, "Ingresar la llegada del paciente valido llegoPaciente");
                    }
                    else if (mensaje == "1007") {
                        alerta(2, "Ingresar la condición del paciente condicionPaciente");
                    }
                    else if (mensaje == "1008") {
                        alerta(2, "Ingresar una condición de paciente valido condicionPaciente");
                    }
                    else if (mensaje == "9000") {
                        alerta(2, "Error del servicio");
                    }
                    else {
                        alerta(2, "Código de respuesta no reconocido");
                    }


                } else {
                    alerta(res.tipo, res.msj)
                    console.log(res)
                }


                //Cargando(0)
            }
        });
    },


    RecibirReferenciaPaciente: async function (fechaCita, horaCita) {
        var formData = new FormData();

        formData.append("idReferencia", Variables.IdReferencia)

        Cargando(1)
        $.ajax({
            method: "POST",
            url: "/Referencia/REFCONSP_REGISTRO_CITA?area=Comun",
            //contentType: "application/json; charset=utf-8",
            data: formData,
            dataType: "json",
            cache: false,
            processData: false,
            contentType: false,
            async: true,
            success: function (res) {

                if (res.data.table.length > 0) {
                    let data = new FormData()

                    let dataCita = res.data.table[0]

                    data.append('data', JSON.stringify({
                        "codigoRenipressDestino": dataCita.codigoRenipressDestino,
                        "condicionPaciente": 'E',
                        "fechaCita": fechaCita,
                        "horaCita": horaCita,
                        "idReferencia": Variables.IdReferencia,
                        "llegoPaciente": 'S',

                        "personalRegistra": {
                            "apellidoMaterno": dataCita.apeMaternoMedico,
                            "apellidoPaterno": dataCita.apePaternoMedico,
                            "fechaNacimiento": dataCita.fechaNacimientoMedico,
                            "idcolegio": "1",
                            "idprofesion": "1",
                            "nombres": dataCita.nombresMedico,
                            "nroDocumento": dataCita.numeroDocumentoMedico,
                            "sexo": dataCita.sexoMedicoo,
                            "tipoDocumento": dataCita.tipoDocumentoMedico
                        }
                    }))

                    $.ajax({
                        method: "POST",
                        url: "/Referencia/recibirReferenciaPaciente?area=Comun",
                        //contentType: "application/json; charset=utf-8",
                        data: data,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                        async: true,
                        success: function (res) {

                            if (res.data.codigo == '0000') {
                                //swal({
                                //    title: 'Atenciones',
                                //    text: "La referencia fue aceptada",
                                //    type: 'info',
                                //}).done()
                                alerta2('info', 'Atenciones', "La referencia fue aceptada.");
                            }

                            Cargando(0)


                            //Cargando(0)
                        },
                        error: function () {
                            //swal({
                            //    title: 'Atenciones',
                            //    text: "Algo salio mal",
                            //    type: 'info',
                            //}).done()
                            alerta2('info', 'Atenciones', "Algo salio mal.");
                            Cargando(0)
                            Cargando(0)
                        }
                    })
                }


                Cargando(0)


                //Cargando(0)
            },
            error: function () {
                Cargando(0)
            }
        });
    },


}

function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function

/////////////////////////KHOYOSI//////////////////////////////////
async function ModificarRefCon() {
    //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
    if (AtencionMedica.permisoRefCon == '1') {
        var objrow = oTable_atenciones.api(true).row('.selected').data();
        if ($("#cboDestino").val() == 12) {
            var tipoRef = 1
            $('.txtTituloRefCon').html('Referencia / N°. HC: ' + objrow.nroHistoriaClinica + ' / N°. Cuenta: ' + objrow.idCuentaAtencion + ' / Paciente: ' + objrow.apellidoPaterno + ' ' + objrow.apellidoMaterno + ' ' + objrow.nombres + " / Edad: " + objrow.edadPaciente)
        }
        if ($("#cboDestino").val() == 13) {
            var tipoRef = 2
            $('.txtTituloRefCon').html('Contrareferencia / N°. HC: ' + objrow.nroHistoriaClinica + ' / N°. Cuenta: ' + objrow.idCuentaAtencion + ' / Paciente: ' + objrow.apellidoPaterno + ' ' + objrow.apellidoMaterno + ' ' + objrow.nombres + " / Edad: " + objrow.edadPaciente)
        }

        if (objrow.usaModuloMaterno) {
            var modulo = "ModuloMaterno";
        } else if (objrow.usaModuloNinoSano) {
            var modulo = "ModuloNinoSano";
        } else {
            var modulo = "ModuloCE"
        }

        await Referencias.Iniciar();

        const data = await Referencias.CargarDataSinValidar(objrow.idCuentaAtencion, objrow.idAtencion, tipoRef, modulo);

        $("#btnGuardar").show();
    }
}
//rmoreano
ValidarCantidadesFarmaciaDivisible3: () => {
    // Si no existe la tabla o no está marcado el checkbox, pasar
    if (!$('#chkPacienteCronico').is(':checked')) return true;
    if (typeof oTable_farmacia === 'undefined' || oTable_farmacia == null) return true;

    let dataTableFarmacia = oTable_farmacia.api(true).rows().data();
    let noDivisibles = [];

    // DataTables devuelve una colección que soporta .each
    dataTableFarmacia.each(function (item, index) {
        // Intentar leer varios nombres posibles para la cantidad
        const raw = item.cantidad ?? item.cant ?? item.cantidadReceta ?? item.cantidadSolicitada ?? item.cantidadPres ?? item.qty ?? 0;
        const qty = parseInt(raw, 10) || 0;

        // Si la cantidad es 0 o no es entero, lo consideramos inválido para la validación
        if (qty === 0 || (qty % 3) !== 0) {
            noDivisibles.push({
                index,
                codigo: item.codigo ?? item.idItem ?? item.idCatalogo ?? '',
                descripcion: item.nombre ?? item.descripcion ?? item.dproducto ?? '',
                cantidad: qty
            });
        }
    });

    if (noDivisibles.length > 0) {
        // Construir mensaje breve con los primeros 10 elementos para no saturar la alerta
        const lista = noDivisibles.slice(0, 10).map(d => `${d.descripcion} (cant: ${d.cantidad})`).join('<br>');
        const resto = noDivisibles.length > 10 ? `<br>... y ${noDivisibles.length - 10} más` : '';
        alerta2('warning', 'Paciente crónico', `Los siguientes medicamentos deben tener cantidad múltiplo de 3:<br>${lista}${resto}`);
        return false;
    }

    return true;
},
//rmoreano
function asignarDiagnosticosSemanaGestacional() {

    let EdadGestacional = $("#txtSemanas").val()

    let rowDx
    if (EdadGestacional >= 1 && EdadGestacional <= 13) {
        rowDx = {
            "codigoCIE10": "Z359.1 ",
            "codigoCIEsinPto": "Z3591  ",
            "descripcion": "Supervisión de embarazo con factor de riesgo 1º trimestre (Atención pre natal)",
            "esActivo": true,
            "fechaInicioVigencia": "2024-10-17T00:00:00",
            "iddiagnostico": 50937,
            "idTipoDiagnostico": "101",
            "tipoDiagnostico": " P = Presuntivo  ",
            "lab": "",
            "intrahospitalario": false
        }
    } else if (EdadGestacional >= 14 && EdadGestacional <= 26) {
        rowDx = {
            "codigoCIE10": "Z359.2 ",
            "codigoCIEsinPto": "Z3592  ",
            "descripcion": " Supervisión de embarazo con factor de riesgo 2º trimestre (Atención pre natal)",
            "esActivo": true,
            "fechaInicioVigencia": "2024-10-17T00:00:00",
            "iddiagnostico": 50938,
            "idTipoDiagnostico": "101",
            "tipoDiagnostico": " P = Presuntivo  ",
            "lab": "",
            "intrahospitalario": false
        }
    } else if (EdadGestacional >= 27) {
        rowDx = {
            "codigoCIE10": "Z359.3 ",
            "codigoCIEsinPto": "Z3593  ",
            "descripcion": "Supervisión de embarazo con factor de riesgo 3º trimestre (Atención pre natal)",
            "esActivo": true,
            "fechaInicioVigencia": "2024-10-17T00:00:00",
            "iddiagnostico": 50939,
            "idTipoDiagnostico": "101",
            "tipoDiagnostico": " P = Presuntivo  ",
            "lab": "",
            "intrahospitalario": false
        }
    }
    return rowDx
}



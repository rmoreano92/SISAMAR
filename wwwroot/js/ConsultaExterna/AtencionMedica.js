let AtencionMedica = {

    listaEpisodios: [{}],

    CargaInicial: () => {
        AtencionMedica.Limpiar();
        
        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");

        console.log("AtencionMedicaInit.permisoClasiPaciente", AtencionMedicaInit.permisoClasiPaciente)
        if (AtencionMedicaInit.permisoClasiPaciente == '0') { // jdelgado para el control de versiones
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }
    },
    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#tblAnexos').DataTable({
            //"scrollX": true,
            "searching": false,
            "lengthChange": false,
            "paging": false
        });

        $('#txtFinEmb,#txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta,txtFechaAtencion').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });



        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");

        //$("tagMedicoProgramado").hide();
    },

    ListaDestinosCE: () => {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
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
                            $('#cboDestino').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
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
    ListaTiposConsulta: () => {
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
    ListaEpisodiosByPaciente: (idPaciente) => {
        var midata = new FormData();
        midata.append('idPaciente', idPaciente);

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
                $('#cboEpisodio').append('<option  value="0">-Seleccione-</option>');

                $(datos.table).each(function (i, obj) {
                    $('#cboEpisodio').append('<option atencion="' + obj.idAtencion + '" value="' + obj.idEpisodio + '"> N°. ' + obj.idEpisodio + ' -  Fech. Apertura: ' + obj.fechaApertura +
                        ' -  Diagnostico: ' + obj.diagnosticoWeb +
                        ' -  FechaCierre: ' + obj.fechaCierre +
                        ' -  Servicio ' + obj.servicioGeneralweb + '</option>');

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
                $('.chzn-select').chosen().trigger("chosen:updated");
                AtencionMedica.listaEpisodios = datos


            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0)
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },
    ListaDiagnosticosAtenciones: (idAtencion) => {

        Diagnosticos.LimpiarDiagnosticosAtencion();

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
    ListaRecetas: (idAtencion, idTipoFuenteFinan) => {

        Ordenes.limpiarCatalogo();
        //Ordenes.listaRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
        Ordenes.listaCabeceraRecetasByIdCuenta(idAtencion, idTipoFuenteFinan)
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

    // comentado por jdelado
    //ListaAtencionByIdCuentaAtencionInterConsulta: function (idCuenta) { // JDELGADO J0 CAMBIO AJAX
    //    let formData = new FormData();
    //    formData.append('idCuenta', idCuenta);

    //    return HttpClient.Post('/Atencion/ListaAtencionByIdCuentaAtencionInterConsulta?area=ConsultaExterna', formData).then(res => {
    //        if (res.lstAtenciones.table.length > 0) {
    //            return res.lstAtenciones.table[0]
    //        }
    //        return null
    //    })
    //},

    GeneraParteDiario: async (programacion) => {
        var formData = new FormData();
        let datos;
        let resp = false;

        formData.append('programacion', programacion);
        try {
            //Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/GeneraParteDiario?area=ConsultaExterna",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //Cargando(0);
            if (datos.estadoCreacion == 'Ok') {
                resp = true;
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
    ImprimiParteDiarioConFirma: (idRegistro, code, idDoc, tipo) => {
        Cargando(1);
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idRegistro + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {
            if (this.response.size > 0) {
                var idServicio = $("#cboConsultorio").val()
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                //a.download = this.response.name || "CE-" + $.now()
                a.download = "CE-" + idRegistro + "-" + $.now()
                //a.click();
                listaServicios();
                $("#cboConsultorio").val(idServicio)
                $('.chzn-select').chosen().trigger("chosen:updated");
                $("#cboConsultorio").change();
                Cargando(0);

                AbrirVisorDocumento(url, 1);
            } else {
                alerta(2, "El documento aún no está firmado digitalmente.")
            }
        }
        Cargando(0);

        request.send();
    },

    Mostrar: async (tipoBoton) => { // JDELGADO J0 CAMBIO ASYNC METHOD

        AtencionMedica.ServiciosSeleccionarCEPorEspecialidad(1)

        Anestesiologia.CargaDatosPorDefecto()
        //return false
        Diagnosticos.LimpiarCampos()
        //Ordenes.ubicaFarmacia(116)
        Ordenes.ubicaFarmacia(await Utilitario.ConfiguracionIpress(1072))

        AtencionMedica.Limpiar()
        Ordenes.limpiarCatalogo

        // JDELGADO VALIDACIONES PRE-ANESTESICA
        if ($('#cboConsultorio').val() == 54 || $('#cboConsultorio').val() == 175) {
            console.log("pre anestesica")
            $('#contenedorChkEsEvaluacionPreAnestesica').show()
        } else {
            console.log("especialidad")
            $('#contenedorChkEsEvaluacionPreAnestesica').hide()
        }

        $('#chkEsEvaluacionPreAnestesica').attr('checked', false) // jdelgado
        $('#chkEsEvaluacionPreAnestesica').attr('disabled', false)

        $('#contenedorPreAnestesica').hide()
        $('#contenedorEspecialidades').show()

        $('[href="#examenEvalAnest"]').closest('li').hide();
        $('[href="#resultadosAnest"]').closest('li').hide();

        // JDELGADO VALIDACIONES PRE-ANESTESICA

        var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        }
        let objrow = await AtencionMedica.ListaAtencionByCuenta(objrowTb.idCuentaAtencion); // JDELGADO J0 CAMBIO ASYNC METHOD

        // await Anestesiologia.ListarExamenesAnestesiologiaByCuenta(objrowTb.idCuentaAtencion)

        // jdelgado cambios adolescencia
        
        if (objrowTb.idTipoAtencionAdolescencia == 1) {
            objrow.usaModuloMaterno = true
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = true
            objrowTb.usaModuloNinoSano = false

            $('#cboTipoAtencionAdolecencia').val(1)

            $('#cboTipoAtencionAdolecencia').trigger('change')
            $('#cboTipoAtencionAdolecencia').prop('disabled', true);

        } else if (objrowTb.idTipoAtencionAdolescencia == 2) {
            objrow.usaModuloMaterno = false
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = false
            objrowTb.usaModuloNinoSano = false

            $('#cboTipoAtencionAdolecencia').val(2)

            $('#cboTipoAtencionAdolecencia').trigger('change')
            $('#cboTipoAtencionAdolecencia').prop('disabled', true);

        } else {
            if (objrowTb.usaModuloMaterno) {
                $('#cboTipoAtencionAdolecencia').val(1)
                $('#cboTipoAtencionAdolecencia').trigger('change')
            } else if (!objrowTb.usaModuloMaterno && !objrowTb.usaModuloNinoSano) {
                $('#cboTipoAtencionAdolecencia').val(2)
                $('#cboTipoAtencionAdolecencia').trigger('change')
            } else {
                $('#cboTipoAtencionAdolecencia').val(0)
            }
            $('#cboTipoAtencionAdolecencia').prop('disabled', false);
        }

        $('.chzn-select').chosen().trigger("chosen:updated")
        // jdelgado cambios adolescencia

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Ordenes.ubicaMedico(objrowTb.idMedico); //KHOYOSI
            AtencionMedica.ListaDestinosCE();  //KHOYOSI
            if (objrow.idEstadoAtencion == 2) {
                ///////KHOYOSI//////////                
                if (tipoBoton == 1) {
                    swal({
                        title: 'Alerta',
                        html: "<h4><b>La cuenta ya se encuentra cerrada<b></h4>",
                        type: 'warning',
                    }).done();
                    return false;
                }

                if (tipoBoton == 3) {
                    alerta(3, "La cuenta ya se encuentra cerrada");
                }
                ///////KHOYOSI//////////
            }

            await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
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
                $('#HoraInicioAtencion').val((objrow.horaInicioAtencion == "     " || objrow.horaInicioAtencion == "" ? time : objrow.horaInicioAtencion));

                $('#txtHoraCia').val(objrowTb.horaInicio);
                $('#txtAtencedentes').val(objrow.citaAntecedente);
                $('#txtOtrasObservacionesGe').val(objrow.citaObservaciones); //nuevo
                //lleno entrevista 
                $('#txtControles').val(objrow.nroControles);
                $('#txtEdadGestacional').val(objrow.edadGestacional);
                $('#txtGestas').val(objrow.nroGestas);
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
                    NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
                    NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
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
                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#cboDestino').change();
                //fin rmoreano

                $('#txtPlanTrabajo').val(objrow.planTrabajo);
                $('#txtTratamiento').val(objrow.tratamiento);

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
                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                if (permisoRefcon == '1') {
                    if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {
                        estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon
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

                //$('#btnAbrirModalCierreCiclo').hide();          //DESCOEMNTAR CUANDO SALGA A PRODUCCION
                //$('#btnImprimeSeguimientoCPN').hide();          //DESCOEMNTAR CUANDO SALGA A PRODUCCION
            }
            else {
                alerta(2, 'Seleccione un registro');
                return false;
            }
        }

    },

    MostrarParaAdolecencia: async (tipoBoton) => { // JDELGADO J0 CAMBIO ASYNC METHOD


        Anestesiologia.CargaDatosPorDefecto()
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

        var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
        }

        let objrow = await AtencionMedica.ListaAtencionByCuenta(objrowTb.idCuentaAtencion);

        console.log('objrow', objrow.usaModuloMaterno)
        console.log('objrow', objrow.usaModuloNinoSano)

        if ($('#cboTipoAtencionAdolecencia').val() == 1) {
            objrow.usaModuloMaterno = true
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = true
            objrowTb.usaModuloNinoSano = false
            
        } else if ($('#cboTipoAtencionAdolecencia').val() == 2){
            objrow.usaModuloMaterno = false
            objrow.usaModuloNinoSano = false

            objrowTb.usaModuloMaterno = false
            objrowTb.usaModuloNinoSano = false
        }
        

        console.log('objrow', objrow.usaModuloMaterno)
        console.log('objrow', objrow.usaModuloNinoSano)

         // JDELGADO J0 CAMBIO ASYNC METHOD

        // await Anestesiologia.ListarExamenesAnestesiologiaByCuenta(objrowTb.idCuentaAtencion)

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Ordenes.ubicaMedico(objrowTb.idMedico); //KHOYOSI
            AtencionMedica.ListaDestinosCE();  //KHOYOSI
            if (objrow.idEstadoAtencion == 2) {
                ///////KHOYOSI//////////                
                if (tipoBoton == 1) {
                    swal({
                        title: 'Alerta',
                        html: "<h4><b>La cuenta ya se encuentra cerrada<b></h4>",
                        type: 'warning',
                    }).done();
                    return false;
                }

                if (tipoBoton == 3) {
                    alerta(3, "La cuenta ya se encuentra cerrada");
                }
                ///////KHOYOSI//////////
            }

            await Anestesiologia.ListarExamenesPatologiaParaAtencionAnestesiologia(objrow.idAtencion, objrow.idCuentaAtencion) // JDELGADO AGREGANDO NUEVO METODO PARA LOS RESULTADOS
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
                    NinioAltoRiesgo.listaNinioAltoRiesgoAlimentPatologicos(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoAntecPerinatales(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoNacimiento(objrow.idAtencion);
                    NinioAltoRiesgo.listaNinioAltoRiesgoVivienda(objrow.idAtencion)
                    NinioAltoRiesgo.AtenInteItemDesarrolloPacientePendiente(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanDesarrolloPacienteDet(objrow.idAtencion, objrow.idPaciente)
                    NinioAltoRiesgo.AtenInteListarPlanIntegralDesarrolloPaciente(objrow.idPaciente);
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
                $('.chzn-select').chosen().trigger("chosen:updated");
                $('#cboDestino').change();
                //fin rmoreano

                $('#txtPlanTrabajo').val(objrow.planTrabajo);
                $('#txtTratamiento').val(objrow.tratamiento);

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
                const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
                if (permisoRefcon == '1') {
                    if (objrowTb.idReferencia > 0 || objrowTb.idContraReferencia > 0) {
                        estadoGuardadoRefCon = true;        //variable que controla si debe o no guardarse la hoja de refcon
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

    Events: () => {
        //luis
        $('.nav-link').on('click', function () {
            //alert("prueba");
            $($.fn.dataTable.tables(true)).css('width', '100%');
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        });
        $('#ceAtencion-tab').on('click', function () {
            var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            if (isEmpty(objrowTb)) {
                swal({
                    title: 'Alerta',
                    text: "Seleccione un registro",
                    type: 'warning',
                }).done();
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                return false;
            }

        })
        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                text: '¿Estas seguro de  Salir?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {

                AtencionMedicaInit.ListaAtencionesCE();
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }).catch(swal.noop);

        });
        
        $('#btnCarnetPrenatal').on('click', async function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();

            //Cargando(1);
            const carnet = await CarnetPrenatal.GenerarCarnetVista(objrow.idPaciente);       
        });

        $("#modalReceta").on('hidden.bs.modal', function () {

            //ListaAtencionesCE();
        });

        $("#modalConsumoServicio").on('hidden.bs.modal', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });

        $('#btnEliminarCSAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            //ConsumoServicio.eliminar(objrow.idCuentaAtencion)
            var objrowConsumoServ = oTable_consumoServAtencion.api(true).row('.selected').data();
            if (objrow.idEstadoAtencion == 2) {
                alerta('2', 'Verifique el estado de la atencion');
                return false;
            }
            else {
                if (objrowConsumoServ.idEstadoFacturacion == 1) {
                    swal({
                        title: 'Eliminar',
                        text: 'Estas seguro de eliminar orden?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    }).then(function () {

                        ConsumoServicio.eliminar(objrowConsumoServ.idOrden)
                        AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
                    });
                }
                else {
                    alerta('2', 'Esta orden no se puede eliminar, verifique el estado');
                    return false;
                }
            }

        });

        $('#btnActualizaCSAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            AtencionMedica.BuscaAtencionesCptCEparaFormatoHIS(objrow.idCuentaAtencion)
        });

        $('#btnAgregarCSAtencion').on('click', function () {
            ConsumoServicio.bloqueoProcedencia();
            ConsumoServicio.limpiar();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            $("#txtNroCuentaRegistro").val(objrow.idCuentaAtencion);
            ConsumoServicio.listaPorCuenta(objrow.idCuentaAtencion, 1);
            $('#modalConsumoServicio').modal('show');
        });

        $("#txtPesoPregesta").on('focusout', function () {
            //console.log("funciono");
            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
        });

        $("#txtTalla").on('change', function () {

            $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
            $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))

        });

        // JDELGADO

        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            var valorClas = $("#cboClasisifcacion").val()
            AtencionMedica.Bloqueo(valorClas)
        })

        //rmoreano RQ0002
        $("#cboDestino").on('change', async function () {

            if ($("#cboDestino").val() == 60) {
                $('#txtProximaConsulta').attr("disabled", false);
                $("#cboTipoConsulta").removeAttr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");
            } else {
                $('#txtProximaConsulta').val("");
                $('#cboTipoConsulta').val(-1);
                $('#txtProximaConsulta').attr("disabled", true);
                $("#cboTipoConsulta").attr('disabled', 'disabled');
                $("#cboTipoConsulta").trigger("chosen:updated");
            }

            //KHOYOSI (START)   (validamos que boton mostrar de acuerdo al destino que se seleccione)
            const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
            if (permisoRefcon == '1') {
                if ($("#cboDestino").val() == 12 || $("#cboDestino").val() == 13) {
                    estadoGuardadoRefCon = false;           //asigna que no aun no se ha guardado la hoja de refcon, a causa de que se ha seleccionado un nuevo destino
                    if ($("#cboDestino").val() == 12) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Referencia")
                    }
                    if ($("#cboDestino").val() == 13) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Contrareferencia")
                    }
                    $('#btnRefCon').show()
                } else {
                    estadoGuardadoRefCon = true //asiga que se ha guardado la hoja de refcon, ya que el destino es diferente a las opciones de Referencia o Contrareferencia
                    $('#btnRefCon').hide()
                }
            }
            //KHOYOSI (END)
        })
        //fin rmoreano RQ0002

        $("#btnImprimeSeguimiento").on('click', function () {
            SeguimientoPaciente.limpiaDatos();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            SeguimientoPaciente.llendaDatos(objrow.nroHistoriaClinica, 0)
            $("#modalSeguimiento").modal('show');
        })
        $("#btnCerrarSeguimiento").on('click', function () {
            $("#modalSeguimiento").modal('hide');
        })

        //jdelgado
        $("#btnImprimeSeguimientoCPN").on('click', function () {
            SeguimientoPacienteCPN.limpiaDatos();
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data()
            console.log(objrow)
            SeguimientoPacienteCPN.llendaDatos(objrow.nroHistoriaClinica)
            $("#modalSeguimientoCPN").modal('show');
        })
        $("#btnCerrarSeguimientoCPN").on('click', function () {
            $("#modalSeguimientoCPN").modal('hide');
        })
        //jdelgado

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
        })

        $('#btnImprimeAtencion').on('click', function () {
            var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
            tipoFormato = 0;
            if (objrow.usaModuloMaterno) {
                tipoFormato = 1;
            }
            else {
                tipoFormato = 0;
            }
            imprimiInforme(objrow.idCuentaAtencion, tipoFormato, objrow.idProCabecera)
        })
        

        $('#tblCSAtencion tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_consumoServAtencion.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

    },

    RefresacaCombox: () => {
        alerta(1, "Se esta recargando los datos de los combobox");
        var objrowTb = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro de la lista de pacientes');
            $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            return false;
        }
        else {
            Cargando(1);
            AtencionMedica.ListaDestinosCE()
            AtencionMedica.ListaEpisodiosByPaciente($('#idPaciente').val());
            Ordenes.listaFarmacias();
            Ordenes.BuscarCatalogo(21, 0);
            Ordenes.BuscarCatalogo(23, 0);
            Ordenes.BuscarCatalogo(20, 0);
            Ordenes.BuscarCatalogo(3, 0);
            Ordenes.BuscarCatalogo(2, 0);
            Ordenes.BuscarCatalogo(11, 0);
            Ordenes.BuscarCatalogo(12, 0);

            //////////////////////KHOYOSI//////////////////////////////////
            //Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());
            //Ordenes.BuscarCatalogoPorServicio(22, $("#cboConsultorio").val());
            /////////////////////////////////////////////////////////////////

            Cargando(0);
        }
    },
    Limpiar: () => {
        $('#chkNuevo').prop('checked', false)
        $('#chkCierre').prop('checked', false)
        $('#hdIdCuentaAtencion').val(0);
        $('#txtMotivoConsultaPeri').val("");
        $('#txtHoraCia').val("");
        $('#HoraInicioAtencion').val("");

        IdCuentaAtencionTemp = 0;
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
    }
}

$(document).ready(() => {
    
    AtencionMedica.CargaInicial()
    AtencionMedica.Plugins()

    AtencionMedica.InitDatablesConsumoAtencion()

    AtencionMedica.ListaDestinosCE()
    AtencionMedica.ListaTiposConsulta()
    AtencionMedica.TiposClasificacionPaciente()

    AtencionMedica.Events()
})

var ATENCIONES = function () {
    
    // JDELGADO J0 CAMBIAR RECETAS
    let tabSelect = '';
    function showHideTabs(idReceta, tab) {
        if (idReceta == 0) {
            $(`a[href="${tab}"]`).closest('li').hide()
        } else {
            $(`a[href="${tab}"]`).closest('li').show()
            tabSelect = tab
            //$(`a[href="${tab}"]`).click();
            //$(`.nav-tabs a[href="${tab}"]`).tab('show');
        }
    }
    // JDELGADO J0 CAMBIAR RECETAS
    
    ////////////////////KEVIN//////////////////////////////
    var CargarCatalogo = function () {
        Cargando(1);
        Ordenes.BuscarCatalogoPorServicio(21, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(23, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(20, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(3, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(2, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(11, $("#cboConsultorio").val());
        Ordenes.BuscarCatalogoPorServicio(22, $("#cboConsultorio").val());
        Cargando(0);
    }
    //////////////////////////////////////////////////////

    
    var statusDownload = function () {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        var midata = new FormData();
        //console.log(objrow.code);
        midata.append('code', objrow.code);
        midata.append('documentId', objrow.idDoc);
        midata.append('idCuentaAtencion', objrow.idCuentaAtencion);
        midata.append('tipo', "A");

        $.ajax({
            method: "POST",
            url: "/Atencion/statusAndDownload?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


            },
            error: function (msg) {
                alerta(3, "Error al listar Cpt");
                Cargando(0)
            }
        });

    }

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
    const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
    if (permisoRefcon == '1') {
        var objrow = AtencionMedicaInit.oTable_atenciones.api(true).row('.selected').data();
        if ($("#cboDestino").val() == 12) {
            var tipoRef = 1
        }
        if ($("#cboDestino").val() == 13) {
            var tipoRef = 2
        }

        if (objrow.usaModuloMaterno) {
            var modulo = "ModuloMaterno";
        } else if (objrow.usaModuloNinoSano) {
            var modulo = "ModuloNinoSano";
        } else {
            var modulo = "ModuloCE"
        }

        const data = await Referencias.CargarDataSinValidar(objrow.idCuentaAtencion, objrow.idAtencion, tipoRef, modulo);

        $("#btnGuardar").show();
    }    
}

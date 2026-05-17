

var Triaje = {
    ObtenerGlasgowSegunContexto() {
        const idTipoPaciente = ($('#cboTipoPaciente').val() || '').toString();
        const descripcionTipoPaciente = ($('#cboTipoPaciente option:selected').text() || '').toLowerCase();
        const esPediatrico = descripcionTipoPaciente.includes('pediatr');
        const usaGlasgowCabecera = esPediatrico || idTipoPaciente === '3';

        const glasgowCabecera = ($('#txtGlasgow').val() || '').trim();
        const glasgowTriaje = ($('#txtGlasgowTriaje').val() || '').trim();

        if (usaGlasgowCabecera) {
            return glasgowCabecera || glasgowTriaje;
        }

        return glasgowTriaje || glasgowCabecera;
    },
    Plugins() {
        $('#txtFechaTriajeBusq').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        })
    },
    CargaInicial() {
        //moment.locale('es')
        //$("#txtFechaTriajeBusq").val(moment().format('L'))
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
        $("#txtFechaTriajeBusq").datepicker("setDate", fechaP);

    },

    ListarAtencionesCEFiltrarPorPaciente(idAtencion, idServicio, idEvaluacion) {
        var formData = new FormData();

        formData.append("nroHistoriaClinica", $("#txtNroHistoriaBusq").val());
        formData.append("apellidoPaterno", $("#txtApPaternoBusq").val());
        formData.append("apellidoMaterno", $("#txtApMaternoBusq").val());
        formData.append("primerNombre", '');
        formData.append("dni", $("#txtNroDniBusq").val());
        formData.append("idCuentaAtencion", $("#txtNroCuentaBusq").val());
        formData.append("lcFechaTriaje", $("#txtFechaTriajeBusq").val());

        Cargando(1);
        oTable_TriajeCE.fnClearTable()
        HttpClient.Post('/RegistroTriaje/ListarAtencionesCEFiltrarPorPaciente?area=ConsultaExterna', formData)
            .then((res) => {
                if (res.dataSet.table.length > 0) {
                    oTable_TriajeCE.fnAddData(res.dataSet.table)
                }
                Cargando(0)
            })
            .catch(e => {
                alerta("ERROR", "Error al listar triaje! " + e, "2");
                Cargando(0)
            })
    },
    //////////////////KHOYOSI///////////////////////
    GuardarTriajeHospEmeg(idAtencion, idServicio, idEvaluacion) {
        var formData = new FormData();

        presion = $("#txtPA").val() + "/" + $("#txtPAD").val()
        formData.append("TriajePresion", presion);
        formData.append("TriajeTemperatura", $("#txtT").val());
        formData.append("TriajeFrecRespiratoria", $("#txtFr").val());
        formData.append("TriajeFrecCardiaca", $("#txtFc").val());
        formData.append("TriajePeso", $("#txtPeso").val());
        formData.append("TriajeTalla", $("#txtTalla").val());
        formData.append("TriajeSaturacionOxigeno", $("#txtSO").val());

        formData.append("TriajePerimCefalico", $("#txtPC").val());                  //MGAMERO
        formData.append("TriajePulso", $("#txtPulso").val());                       //MGAMERO
        formData.append("TriajePerimAbdominal", $("#txtPAbdo").val());              //MGAMERO
        formData.append("TriajeDolor", $("#txtDolor").val());                       //MGAMERO
        formData.append("TriajeLlenadoCapilar", $("#txtLlenadoCapilar").val());     //MGAMERO
        //        formData.append("Glasgow", $("#txtGlasgowTriaje").val());     //RMOREANO
        formData.append('Glasgow', EvaluacionEmergencia.obtenerGlasgowSegunTipoPaciente());
        formData.append("BiernamPierson", $("#txtBiermanPierson").val());     //RMOREANO

        formData.append("idServicio", idServicio);
        formData.append("idNumero", idEvaluacion);
        formData.append("idAtencion", idAtencion);

        Cargando(1);

        HttpClient.Post('/Atencion/ModificarTriajeEmgHosp?area=ConsultaExterna', formData)
            .then((res) => {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtPAD").val("");
                $("#txtPC").val("");
                $("#txtSO").val("");       //KHOYOSI         
                 
                $("#txtPulso").val("");            //MGAMERO
                $("#txtPAbdo").val("");            //MGAMERO
                $("#txtDolor").val("");            //MGAMERO
                $("#txtLlenadoCapilar").val("");   //MGAMERO
                $("#txtGlasgowTriaje").val("");   //RMOREANO
                $("#txtBiermanPierson").val("");   //RMOREANO

                Cargando(0);
            })
            .catch(e => {
                alerta("ERROR", "Error guardar triaje! " + e, "2");
                Cargando(0);
            })
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
            url: "/Admision/ConfirmarLlegadaCE?area=ConsultaExterna", // si luego cambia, lo pasamos también como parámetro
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function(datos) {
                alerta(1, "Los datos se modificaron correctamente");
                $('#modalLlegada').modal('hide');
                $('#btnBuscar').trigger('click');
                Cargando(0);
            },
            error: function(msg) {
                alerta("ERROR", "Error al cambiar estado de cola!", "2");
                Cargando(0);
            }
        });
    },

    InsertaTriajeCE() {
        var midata = new FormData();

        presion = $("#txtPA").val() + "/" + $("#txtPAD").val()
        midata.append("TriajePresion", presion);
        midata.append("TriajeTemperatura", $("#txtT").val());
        midata.append("TriajeFrecRespiratoria", $("#txtFr").val());
        midata.append("TriajeFrecCardiaca", $("#txtFc").val());
        midata.append("TriajePeso", $("#txtPeso").val());
        midata.append("TriajeTalla", $("#txtTalla").val());
        midata.append("TriajePerimCefalico", $("#txtPC").val());
        midata.append("TriajeSaturacionOxigeno", $("#txtSO").val());
        midata.append("TriajePerimAbdominal", $("#txtPAbdo").val());
        midata.append("TriajePulso", $("#txtPulso").val());
        midata.append("idAtencion", $("#txtIdAtencionTriaje").val());

        midata.append("NroHistoriaClinica", $("#txtNroHistoriaTriaje").val());
        midata.append("CitaIdServicio", $("#txtIdservicioTriaje").val());
        midata.append("CitaFecha", $("#txtCitaFechaTriaje").val());

        Cargando(1);
        $.ajax({
            url: "/Atencion/InsertaTriajeCE?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtPAD").val("");
                $("#txtPC").val("");
                $("#txtSO").val("");       //KHOYOSI               

                alerta(1, "Los datos se modificaron correctamente")

                $('#modalTriaje').modal('hide')

                Cargando(0);
            },
            error: function (msg) {
                alerta("ERROR", "Error guardar triaje!", "2");
                Cargando(0);
            }
        });
    },
    ///////////////////////////////////////////////
    ListaAtencionByIdCuentaAtencion(tipo) {
        var midata = new FormData();

        midata.append("idCuenta", $('#txtCuentaTriaje').val());

        Cargando(1);
        $.ajax({
            url: "/Atencion/ListaAtencionByIdCuentaAtencion?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                atencion = datos.lstAtenciones.table[0]

                $('#txtNombrePaciente').val(`${atencion.nroHistoriaClinica} - ${atencion.apellidoPaterno} ${atencion.apellidoMaterno} ${atencion.nombres}`)
                $('#txtDatosCuenta').val(`F.Ing: ${atencion.fechaIngreso} - ${atencion.desServicio} - IAFA ${atencion.planA}`)
                $('#txtIdAtencionTriaje').val(atencion.idAtencion)

                $('#txtNroHistoriaTriaje').val(atencion.nroHistoriaClinica)
                $('#txtIdservicioTriaje').val(atencion.idServicioIngreso)
                $('#txtCitaFechaTriaje').val(atencion.fechaIngreso)

                // Validación de NO PAGÓ
                if (atencion.generaPago == 1) {
                    if (atencion.costoCeroCE != "S") {
                        if (atencion.idEstadoCita != 4 && atencion.idEstadoCita != 2) {
                            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                            alerta(2, `Paciente con Plan: <b>${atencion.planA}</b> no pagó.`);
                            $('.bloquear-campo').attr('disabled', true)
                            $('#btnguardarTriaje').hide()
                            Cargando(0);
                            return false;
                        }
                    }
                }
                
                //return false; // PRUEBAAAAAA



                formData = new FormData()
                formData.append('IdAtencion', atencion.idAtencion)
                HttpClient.Post('/RegistroTriaje/AtencionesCeListaTriajeByIdAtencion?area=ConsultaExterna', formData).then(res => {

                    if (tipo == 1) {
                        if (res.dataSet.table.length > 0) {
                            alerta(2, 'El triaje ya fue registrado para esta atencion')
                            $('.bloquear-campo').attr('disabled', true)
                            $('#btnguardarTriaje').hide()
                            return false
                        }
                    }
                    
                })

                Cargando(0);
            },
            error: function (msg) {
                alerta("ERROR", "Error listar datos atencion!", "2");
                Cargando(0);
            }
        });
    },
	
	BuscarAtencionParaTriajeNuevo(midata) {
        Cargando(1);
        $.ajax({
            url: "/Atencion/BuscarAtencionParaTriajeNuevo?area=ConsultaExterna",
			type: "POST",
			data: midata,
            async: false,
            success: function (datos) {
				if(datos.lstAtenciones.table.length==0)
				{
					Cargando(0);
					alerta(2, 'No existe datos para atencion')
					return false
				}
				if(datos.lstAtenciones.table.length>1)
					alerta(2, 'Tiene varias atenciones, se muestra la mas antigua.');
                atencion = datos.lstAtenciones.table[0]

                $('#txtNombrePaciente').val(`${atencion.nroHistoriaClinica} - ${atencion.apellidoPaterno} ${atencion.apellidoMaterno} ${atencion.nombres}`)
                $('#txtDatosCuenta').val(`F.Ing: ${atencion.fechaIngreso} - ${atencion.desServicio} - IAFA ${atencion.planA}`)
                $('#txtIdAtencionTriaje').val(atencion.idAtencion)

                $('#txtNroHistoriaTriaje').val(atencion.nroHistoriaClinica)
                $('#txtIdservicioTriaje').val(atencion.idServicioIngreso)
                $('#txtCitaFechaTriaje').val(atencion.fechaIngreso)

                // Validación de NO PAGÓ
                if (atencion.generaPago == 1) {
                    if (atencion.costoCeroCE != "S") {
                        if (atencion.idEstadoCita != 4 && atencion.idEstadoCita != 2) {
                            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                            alerta(2, `Paciente con Plan: <b>${atencion.planA}</b> no pagó.`);
                            $('.bloquear-campo').attr('disabled', true)
                            $('#btnguardarTriaje').hide()
                            Cargando(0);
                            return false;
                        }
                    }
                }
                Cargando(0);
            },
            error: function (msg) {
                alerta("ERROR", "Error listar datos atencion!", "2");
                Cargando(0);
            }
        });
    },

    listaTriaje(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        $.ajax({
            url: "/Atencion/ListaTriaje?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtPAD").val("");
                $("#txtPC").val("");
                $("#txtPAbdo").val("");
                $("#txtSO").val("");       //KHOYOSI
                $("#txtPulso").val("");       //JVICENTE

                datos = datos.data

                if (datos.table.length > 0) {

                    presionAr = datos.table[0].triajePresion

                    if (!(presionAr == null)) {
                        presionSep = presionAr.split("/");

                        $("#txtPA").val(presionSep[0]);
                        $("#txtPAD").val(presionSep[1]);
                    }
                    else {
                        $("#txtPA").val("");
                        $("#txtPAD").val("");
                    }


                    $("#txtT").val(datos.table[0].triajeTemperatura);


                    if (datos.table[0].triajeFrecRespiratoria == 0) {
                        $("#txtFr").val("");
                    }
                    else {
                        $("#txtFr").val(datos.table[0].triajeFrecRespiratoria);
                    }

                    if (datos.table[0].triajeFrecCardiaca == 0) {
                        $("#txtFc").val("");
                    }
                    else {
                        $("#txtFc").val(datos.table[0].triajeFrecCardiaca);
                    }

                    $("#txtPeso").val(datos.table[0].triajePeso);
                    $("#txtTalla").val(datos.table[0].triajeTalla);
                    
                    $("#txtPC").val(datos.table[0].triajePerimCefalico);

                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);    //KHOYOSI
                    $("#txtPAbdo").val(datos.table[0].triajePerimAbdominal);    //KHOYOSI
                    $("#txtPulso").val(datos.table[0].triajePulso);             //JVICENTE

                    //$("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
                        $("#txtTriajeIMC").val(Triaje.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                        $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
                    }

                    Triaje.validarRango();
                }
                
            },
            error: function (msg) {
                alerta("ERROR", "Error listar triaje!", "2");
            }
        });
    },

    listaTriajeEmgHosp(idAtencion, idServicio, idNumero) {
        
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('idServicio', idServicio);
        midata.append('idNumero', idNumero);
        $.ajax({
            url: "/Atencion/ListaTriajeEmgHosp?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtTriajeIMC").val("");
                $("#txtPAD").val("");
                if (datos.table.length > 0) {
                    presionAr = datos.table[0].triajePresion

                    if (!(presionAr == null)) {
                        presionSep = presionAr.split("/");

                        $("#txtPA").val(presionSep[0]);
                        $("#txtPAD").val(presionSep[1]);
                    }
                    else {
                        $("#txtPA").val("");
                        $("#txtPAD").val("");
                    }


                    $("#txtT").val(datos.table[0].triajeTemperatura);


                    if (datos.table[0].triajeFrecuenciaRespiratoria == 0) {
                        $("#txtFr").val("");
                    }
                    else {
                        $("#txtFr").val(datos.table[0].triajeFrecuenciaRespiratoria);
                    }

                    if (datos.table[0].triajeFrecuenciaCardiaca == 0) {
                        $("#txtFc").val("");
                    }
                    else {
                        $("#txtFc").val(datos.table[0].triajeFrecuenciaCardiaca);
                    }

                    $("#txtPeso").val(datos.table[0].triajePeso);
                    $("#txtTalla").val(datos.table[0].triajeTalla);


                    if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
                        $("#txtTriajeIMC").val(Triaje.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                        $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
                    }

                    
                    $("#txtPC").val(datos.table[0].triajePerimCefalico);                //MGAMERO
                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI

                    $("#txtPulso").val(datos.table[0].triajePulso);                     //MGAMERO
                    $("#txtPAbdo").val(datos.table[0].triajePerimAbdominal);            //MGAMERO
                    $("#txtDolor").val(datos.table[0].triajeDolor);                     //MGAMERO
                    $("#txtLlenadoCapilar").val(datos.table[0].triajeLlenadoCapilar);   //MGAMERO
                    $("#txtGlasgow").val(datos.table[0].glasgow);   //RMOREANO 11042026
                    $("#txtGlasgowTriaje").val(datos.table[0].glasgow);   //RMOREANO 11042026
                    $('#txtObservacionTriaje').val(datos.table[0].observacionTriaje);
                    $("#txtBiermanPierson").val(datos.table[0].biermanPierson);   //RMOREANO 11042026


                    //$("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    Triaje.validarRango();
                }
                
            },
            error: function (msg) {
                alerta("ERROR", "Error listar triaje!", "2");
            }
        });
    },


    async TriajeEmgHospListar(idAtencion, idServicio, idNumero) {
        let respuesta = null;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idAtencion', idAtencion);
        formData.append('idServicio', idServicio);
        formData.append('idNumero', idNumero);

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaTriajeEmgHosp?area=ConsultaExterna",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.table.length > 0) {
                presionAr = datos.table[0].triajePresion

                if (!(presionAr == null)) {
                    presionSep = presionAr.split("/");

                    $("#txtPA").val(presionSep[0]);
                    $("#txtPAD").val(presionSep[1]);
                }
                else {
                    $("#txtPA").val("");
                    $("#txtPAD").val("");
                }


                $("#txtT").val(datos.table[0].triajeTemperatura);


                if (datos.table[0].triajeFrecuenciaRespiratoria == 0) {
                    $("#txtFr").val("");
                }
                else {
                    $("#txtFr").val(datos.table[0].triajeFrecuenciaRespiratoria);
                }

                if (datos.table[0].triajeFrecuenciaCardiaca == 0) {
                    $("#txtFc").val("");
                }
                else {
                    $("#txtFc").val(datos.table[0].triajeFrecuenciaCardiaca);
                }

                $("#txtPeso").val(datos.table[0].triajePeso);
                $("#txtTalla").val(datos.table[0].triajeTalla);


                if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
                    $("#txtTriajeIMC").val(Triaje.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                    $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
                }

                $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI

                //$("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                //txtPesoPregesta

                Triaje.validarRango();

                resp = true;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    listaTriajeInterconsulta(idAtencion) {
        var midata = new FormData();
        midata.append('idAtencion', idAtencion);

        $.ajax({
            url: "/Atencion/ListaTriajeInterconsulta?area=ConsultaExterna",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $("#txtPA").val("");
                $("#txtT").val("");
                $("#txtFr").val("");
                $("#txtFc").val("");
                $("#txtPeso").val("");
                $("#txtTalla").val("");
                $("#txtImc").val("");
                $("#txtPAD").val("");
                $("#txtPC").val("");
                $("#txtSO").val("");       //KHOYOSI
                if (datos.table.length > 0) {
                    presionAr = datos.table[0].triajePresion

                    if (!(presionAr == null)) {
                        presionSep = presionAr.split("/");

                        $("#txtPA").val(presionSep[0]);
                        $("#txtPAD").val(presionSep[1]);
                    }
                    else {
                        $("#txtPA").val("");
                        $("#txtPAD").val("");
                    }


                    $("#txtT").val(datos.table[0].triajeTemperatura);


                    if (datos.table[0].triajeFrecRespiratoria == 0) {
                        $("#txtFr").val("");
                    }
                    else {
                        $("#txtFr").val(datos.table[0].triajeFrecRespiratoria);
                    }

                    if (datos.table[0].triajeFrecCardiaca == 0) {
                        $("#txtFc").val("");
                    }
                    else {
                        $("#txtFc").val(datos.table[0].triajeFrecCardiaca);
                    }

                    $("#txtPeso").val(datos.table[0].triajePeso);
                    $("#txtTalla").val(datos.table[0].triajeTalla);
                    $("#txtPC").val(datos.table[0].triajePerimCefalico);

                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI

                    //$("#txtImc").val(Triaje.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Triaje.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Triaje.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    Triaje.validarRango();
                }

            },
            error: function (msg) {
                alerta("ERROR", "Error listar triaje!", "2");
            }
        });
    },
    calculaImc(peso, talla) {

        peso = peso = "" ? 0 : peso
        talla = talla = "" ? 0 : talla

        m = talla * 0.01
        imc = peso / (m * m)
        //imc = peso / (1000)
        imc = Math.round(imc);
        if (isNaN(imc) || (imc == "Infinity")) {
            imc = 0
        }
        else {
            imc = imc
        }

        return imc
    },

    CalcularIMC(peso, talla) {

        var imc = peso / (Math.pow((talla / 100), 2))
        imc = Math.round(imc * 100) / 100;
                
        return imc
    },

    InitDatablesTriajeCE() {

        var parms = {
            destroy: true,
            responsive: true,
            bFilter: false,
            columns: [
                {
                    data: "idCuentaAtencion",
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
                    data: "triajeFecha",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "consultorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaCita",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TriajeCE = $("#tblTriajeCE").dataTable(parms);
    },

    eventos() {
        $("#txtPA").on("change", function () {
            if (90 > $("#txtPA").val() || $("#txtPA").val() > 140) {

                $("#txtPA").css('color', 'red');
            }
            else {
                $("#txtPA").css('color', 'black');
            }
        });
        //JDELGADO J0 CAMBIO FORMULA PRESION PAD
        $("#txtPAD").on("change", function () {
            if (50 > $("#txtPAD").val() || $("#txtPAD").val() > 140) {

                $("#txtPAD").css('color', 'red');
            }
            else {
                $("#txtPAD").css('color', 'black');
            }
        });

        $("#txtFc").on("change", function () {
            if (60 > $("#txtFc").val() || $("#txtFc").val() > 90) {

                $("#txtFc").css('color', 'red');
            }
            else {
                $("#txtFc").css('color', 'black');
            }
        });

        $("#txtFr").on("change", function () {
            if (12 > $("#txtFr").val() || $("#txtFr").val() > 20) {

                $("#txtFr").css('color', 'red');
            }
            else {
                $("#txtFr").css('color', 'black');
            }
        });

        $("#txtT").on("change", function () {
            if (36 > $("#txtT").val() || $("#txtT").val() > 37) {

                $("#txtT").css('color', 'red');
            }
            else {
                $("#txtT").css('color', 'black');
            }
        });

        $("#txtPeso").on("change", function () {
            if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {
                $("#txtTriajeIMC").val(Triaje.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
            }
        });

        $("#txtTalla").on("change", function () {
            if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {                
                $("#txtTriajeIMC").val(Triaje.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Triaje.imc($("#txtTriajeIMC").val()) + ')');
            }
            
        });
                   

        //////////////////KHOYOSI/////////////////////////////
        $("#txtSO").on("change", function () {
            if (95 > $("#txtSO").val() || $("#txtSO").val() > 100) {

                $("#txtSO").css('color', 'red');
            }
            else {
                $("#txtSO").css('color', 'black');
            }
        });
        //////////////////KHOYOSI/////////////////////////////
        $('#btnBuscar').on('click', function () {
            
            if ($('#txtNroCuentaBusq').val() == '' && $('#txtNroDniBusq').val() == '' && $('#txtNroHistoriaBusq').val() == '' && $('#txtApPaternoBusq').val() == '' && $('#txtApMaternoBusq').val() == '' && $('#txtFechaTriajeBusq').val() == '') {
                alerta(2, 'Ingrese al menos un valor para la busqueda')
                return false
            }
            Triaje.ListarAtencionesCEFiltrarPorPaciente()
        })
        $('#btnBuscarDatosPaciente').on('click', function () {
			let contador = 0;
			if ($("#txtApellidoPaterno").val() !== "") contador++;
			if ($("#txtApellidoMaterno").val() !== "") contador++;
			if ($("#txtNombres").val() !== "") contador++;
            if ($('#txtCuentaTriaje').val() !== '' || $('#txtNumeroDocumento').val() !== '' || contador>=2){
				var data = {
					idCuenta: $("#txtCuentaTriaje").val(),
					NumeroDocumento: $("#txtNumeroDocumento").val(),
					ApellidoPaterno: $("#txtApellidoPaterno").val(),
					ApellidoMaterno: $("#txtApellidoMaterno").val(),
					Nombres: $("#txtNombres").val()
				};
				Triaje.BuscarAtencionParaTriajeNuevo(data);
            }
			else
			{
				alerta(2,"Ingrese datos de busqueda");
				return false;
			}
        })

        $('#btnguardarTriaje').on('click', function () {

            //RMOREANO 05032026 SE RETIRO CAMPOS OBLIGATORIOS
            //if ($('#txtPeso').val() == '') {
            //    alerta(2, "El Peso es obligatorio")
            //    $('#txtPeso').focus()
            //    return false
            //}
            //if ($('#txtTalla').val() == '') {
            //    alerta(2, "La Talla es obligatoria")
            //    $('#txtTalla').focus()
            //    return false
            //}
            //RMOREANO 05032026 SE RETIRO CAMPOS OBLIGATORIOS
            Triaje.InsertaTriajeCE()
            Triaje.CambiarEstadoColaCita(
                null, // La cita la conseguiré desde el Stored Procedure con el IdAtencion
                $("#txtIdAtencionTriaje").val(),
                3, // Triaje
                "Confirma guardado desde Triaje",
                ''
            );
        })


        $('#btnAgregar').on('click', function () {
            Triaje.LimpiarCampos()
            $('#btnBuscarDatosPaciente').attr('disabled', false)
            $('#modalTriaje').modal('show')
        })
        $('#btnModificar').on('click', function () {
            let objRowTriaje = oTable_TriajeCE.api(true).row('.selected').data()
            if (isEmpty(objRowTriaje)) {
                alerta(2, 'Selecciona un registro')
                return false
            }
            Triaje.LimpiarCampos()

            $('#txtCuentaTriaje').attr('disabled', true)
            $('#btnBuscarDatosPaciente').attr('disabled', true)

            $('#txtCuentaTriaje').val(objRowTriaje.idCuentaAtencion)
            Triaje.ListaAtencionByIdCuentaAtencion(2)
            Triaje.listaTriaje(objRowTriaje.idAtencion)

            $('#modalTriaje').modal('show')
        })
        $('#btnConsultar').on('click', function () {
            let objRowTriaje = oTable_TriajeCE.api(true).row('.selected').data()
            if (isEmpty(objRowTriaje)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            Triaje.LimpiarCampos()
            $('#btnBuscarDatosPaciente').attr('disabled', true)
            $('.bloquear-campo').attr('disabled', true)
            $('#btnguardarTriaje').hide()

            $('#txtCuentaTriaje').val(objRowTriaje.idCuentaAtencion)
            Triaje.ListaAtencionByIdCuentaAtencion(2)
            Triaje.listaTriaje(objRowTriaje.idAtencion)

            $('#modalTriaje').modal('show')
        })
        $('#btnCerrarModalTriaje').on('click', function () {
            $('#modalTriaje').modal('hide')
        })

        $('#btnLimpiar').on('click', function () {
            $('#txtNroCuentaBusq').val('')
            $('#txtNroDniBusq').val('')
            $('#txtNroHistoriaBusq').val('')
            $('#txtApPaternoBusq').val('')
            $('#txtApMaternoBusq').val('')
            $('#txtFechaTriajeBusq').val('')
        })


        $('#tblTriajeCE tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_TriajeCE.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        })
    },
    imc(imc) {
        grado = "";
        if (imc < 18.5) {
            grado = "Bajo peso";
        } else if (imc >= 18.5 && imc <= 24.99) {
            grado = "Peso Normal";
        } else if (imc >= 25 && imc <= 29.99) {
            grado = "Sobrepeso";
        } else if (imc >= 30 && imc <= 34.99) {
            grado = "Obesidad grado I";
        } else if (imc >= 35 && imc <= 39.99) {
            grado = "Obesidad grado II";
        } else if (imc >= 40) {
            grado = "Obesidad grado III";
        }

        return grado
    },
    ///////////////////////KHOYOSI//////////////////////////////////
    validarRango() {
        if (90 > $("#txtPA").val() || $("#txtPA").val() > 140) {

            $("#txtPA").css('color', 'red');
        }
        else {
            $("#txtPA").css('color', 'black');
        }

        if (50 > $("#txtPAD").val() || $("#txtPAD").val() > 140) {

            $("#txtPAD").css('color', 'red');
        }
        else {
            $("#txtPAD").css('color', 'black');
        }

        if (60 > $("#txtFc").val() || $("#txtFc").val() > 90) {

            $("#txtFc").css('color', 'red');
        }
        else {
            $("#txtFc").css('color', 'black');
        }

        if (12 > $("#txtFr").val() || $("#txtFr").val() > 20) {

            $("#txtFr").css('color', 'red');
        }
        else {
            $("#txtFr").css('color', 'black');
        }

        if (36 > $("#txtT").val() || $("#txtT").val() > 37) {

            $("#txtT").css('color', 'red');
        }
        else {
            $("#txtT").css('color', 'black');
        }

        if (95 > $("#txtSO").val() || $("#txtSO").val() > 100) {

            $("#txtSO").css('color', 'red');
        }
        else {
            $("#txtSO").css('color', 'black');
        }
    },
    ///////////////////////KHOYOSI//////////////////////////////////
    LimpiarCampos() {
        $('.bloquear-campo').attr('disabled', false)
        $('#btnguardarTriaje').show()

        $('#txtNombrePaciente').val('')
        $('#txtDatosCuenta').val('')
        $('#txtIdAtencionTriaje').val('')
        $('#txtNroHistoriaTriaje').val('')
        $('#txtIdservicioTriaje').val('')
        $('#txtCitaFechaTriaje').val('')

        $('#txtCuentaTriaje').val('')
        $('#txtNombrePaciente').val('')
        $('#txtDatosCuenta').val('')

        $("#txtPA").val("");
        $("#txtT").val("");
        $("#txtFr").val("");
        $("#txtFc").val("");
        $("#txtPeso").val("");
        $("#txtTalla").val("");
        $("#txtImc").val("");
        $("#txtPAD").val("");
        $("#txtPC").val("");
        $("#txtSO").val("");
    }
};

$(document).ready(function () {
    Triaje.Plugins()
    Triaje.CargaInicial()

    Triaje.InitDatablesTriajeCE()

    Triaje.eventos()



});




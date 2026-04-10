var Admision = {
    Plugins() {
        $('#txtFechaAdmBusq').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        })
    },
    CargaInicial() {
        //moment.locale('es')
        //$("#txtFechaAdmBusq").val(moment().format('L'))
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
        $("#txtFechaAdmBusq").datepicker("setDate", fechaP);

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

    ListarAtencionesCEFiltrarPorPaciente(idAtencion, idServicio, idEvaluacion) {
        var formData = new FormData();

        formData.append("nroHistoriaClinica", $("#txtNroHistoriaBusq").val());
        formData.append("apellidoPaterno", $("#txtApPaternoBusq").val());
        formData.append("apellidoMaterno", $("#txtApMaternoBusq").val());
        formData.append("primerNombre", '');
        formData.append("dni", $("#txtNroDniBusq").val());
        formData.append("idCuentaAtencion", $("#txtNroCuentaBusq").val());
        formData.append("lcFechaTriaje", $("#txtFechaAdmBusq").val());

        Cargando(1);
        oTable_TriajeCE.fnClearTable()
        HttpClient.Post('/Admision/ListarAtencionesCEFiltrarPorPaciente?area=ConsultaExterna', formData)
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

                Cargando(0);
            })
            .catch(e => {
                alerta("ERROR", "Error guardar triaje! " + e, "2");
                Cargando(0);
            })
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
        midata.append("idCita", $("#txtIdCita").val());

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
                /*
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
                */
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

                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI
                    $("#txtPAbdo").val(datos.table[0].triajePerimAbdominal);     //KHOYOSI

                    //$("#txtImc").val(Admision.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Admision.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Admision.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    Admision.validarRango();
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
                        $("#txtTriajeIMC").val(Admision.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                        $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Admision.imc($("#txtTriajeIMC").val()) + ')');
                    }

                    $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI

                    //$("#txtImc").val(Admision.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Admision.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Admision.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    Admision.validarRango();
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
                    $("#txtTriajeIMC").val(Admision.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                    $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Admision.imc($("#txtTriajeIMC").val()) + ')');
                }

                $("#txtSO").val(datos.table[0].triajeSaturacionOxigeno);     //KHOYOSI

                //$("#txtImc").val(Admision.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                $("#txtImc").val(Admision.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                $("#txtImcDes").val(Admision.imc($("#txtImc").val()))
                //txtPesoPregesta

                Admision.validarRango();

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

                    //$("#txtImc").val(Admision.calculaImc($("#txtPeso").val(), $("#txtTalla").val())) // cambio calculo imc
                    $("#txtImc").val(Admision.calculaImc($("#txtPesoPregesta").val(), $("#txtTalla").val()))
                    $("#txtImcDes").val(Admision.imc($("#txtImc").val()))
                    //txtPesoPregesta

                    Admision.validarRango();
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
                        $(td).attr('align', 'center')
                    },
                    width: "4%"
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    },
                    width: "4%"
                },
                {
                    data: null, // usamos toda la fila
                    render: function(data, type, row) {
                        const apP = (row.apellidoPaterno || '').trim();
                        const apM = (row.apellidoMaterno || '').trim();
                        const nom = (row.primerNombre || '').trim();
                        return (apP + ' ' + apM + ' ' + nom).replace(/\s+/g, ' ').trim();
                    },
                    createdCell: function(td) {
                        $(td).attr('align', 'left');
                    },
                    width: "20%"
                },
                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    visible: false,
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    visible: false,
                },
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    visible: false,
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
                {
                    data: "consultorio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    },
                    width: "15%"
                },
                {
                    data: "fechaCita",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    },
                    width: "4%"
                },
                {
                    data: "horaInicio",
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    },
                    width: "4%"
                },
                {
                    width: "1%",
                    targets: 11,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnImprimeTicket = "";
                        btnImprimeTicket = '<button class="ImprimeTicket btn btn-sm btn-warning glow_button" title="Visualiza Ticket" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                        $(td).html(btnImprimeTicket);
                    }

                    
                },
                {
                    data: "idCita",
                    createdCell: function(td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')
                    },
                    visible: false,
                },
            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TriajeCE = $("#tblTriajeCE").dataTable(parms);
    },

    eventos() {
        $('#tblTriajeCE tbody').on('click', '.ImprimeTicket', function () {

            // 1) Obtener el TR correcto (soporta responsive child row)
            let $tr = $(this).closest('tr');
            if ($tr.hasClass('child')) {
                $tr = $tr.prev(); // la fila real
            }

            // 2) Obtener data de la fila
            const row = oTable_TriajeCE.api().row($tr).data();
            if (!row) return;

            Cargando(1);

            // 3) Tomar idCita desde la data (según tu columna oculta)
            const idCita = row.idCita;      // <-- ESTE ES EL QUE TE FALTABA
            const area  = "ConsultaExterna";

            // 4) Calcular nroCupo
            let idCupo = row.turno;

            // 5) Armar URL con parámetros (bien encodeado)
            const qs = $.param({ area: area, idCita: idCita, nroCupo: idCupo });
            const url = "/Citas/ImprimeTicketCita?" + qs;

            // 6) Cargar PDF en iframe y mostrar modal
            $('#ifrmTicketCita').attr('src', url);

            $('#btnCerrarModalCita').trigger("click");
            $("#modalTicket").modal('show');

            Cargando(0);
        });

        $('#btnCerrarTicket').on('click', function() {
            $('#modalTicket').modal('hide')
        })

        $('#modalTicket').on('hidden.bs.modal', function () {
            const $ifr = $('#ifrmTicketCita');
            $ifr.attr('src', 'about:blank');   // o '' también funciona
        });

        $("#txtPA").on("change", function () {
            if (90 > $("#txtPA").val() || $("#txtPA").val() > 140) {

                $("#txtPA").css('color', 'red');
            }
            else {
                $("#txtPA").css('color', 'black');
            }
        });
        
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
                $("#txtTriajeIMC").val(Admision.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Admision.imc($("#txtTriajeIMC").val()) + ')');
            }
        });

        $("#txtTalla").on("change", function () {
            if ($("#txtPeso").val() != '' && $("#txtTalla").val() != '') {                
                $("#txtTriajeIMC").val(Admision.CalcularIMC($("#txtPeso").val(), $("#txtTalla").val()));
                $("#txtTriajeIMC").val($("#txtTriajeIMC").val() + ' (' + Admision.imc($("#txtTriajeIMC").val()) + ')');
            }
            
        });
                   

        
        $("#txtSO").on("change", function () {
            if (95 > $("#txtSO").val() || $("#txtSO").val() > 100) {

                $("#txtSO").css('color', 'red');
            }
            else {
                $("#txtSO").css('color', 'black');
            }
        });
        
        $('#btnBuscar').on('click', function () {
            
            if ($('#txtNroCuentaBusq').val() == '' && $('#txtNroDniBusq').val() == '' && $('#txtNroHistoriaBusq').val() == '' && $('#txtApPaternoBusq').val() == '' && $('#txtApMaternoBusq').val() == '' && $('#txtFechaAdmBusq').val() == '') {
                alerta(2, 'Ingrese al menos un valor para la busqueda')
                return false
            }
            Admision.ListarAtencionesCEFiltrarPorPaciente()
        })
        $('#btnBuscarDatosPaciente').on('click', function () {
            if ($('#txtCuentaTriaje').val() == '') {
                alerta(2, "Ingresa el numero de cuenta")
                return false;
            }
            Admision.ListaAtencionByIdCuentaAtencion(1)
        })

        $('#btnguardarTriaje').on('click', function () {
            if ($('#txtPeso').val() == '') {
                alerta(2, "El Peso es obligatorio")
                $('#txtPeso').focus()
                return false
            }
            if ($('#txtTalla').val() == '') {
                alerta(2, "La Talla es obligatoria")
                $('#txtTalla').focus()
                return false
            }

            Admision.InsertaTriajeCE()
        })
        /*

        $('#btnAgregar').on('click', function () {
            Admision.LimpiarCampos()
            $('#btnBuscarDatosPaciente').attr('disabled', false)
            $('#modalTriaje').modal('show')
        })

        $('#btnModificar').on('click', function () {
            let objRowTriaje = oTable_TriajeCE.api(true).row('.selected').data()
            if (isEmpty(objRowTriaje)) {
                alerta(2, 'Selecciona un registro')
                return false
            }
            Admision.LimpiarCampos()

            $('#txtCuentaTriaje').attr('disabled', true)
            $('#btnBuscarDatosPaciente').attr('disabled', true)

            $('#txtCuentaTriaje').val(objRowTriaje.idCuentaAtencion) 
            
            Admision.ListaAtencionByIdCuentaAtencion(2)
            Admision.listaTriaje(objRowTriaje.idAtencion)

            
            alert(objRowTriaje.IdCita + '' + objRowTriaje.idCita);
            $('#modalTriaje').modal('show')
        })
        */

        // MGAMERO - INICIO
        $('#btnLlegoPaciente').on('click', function() {
            let objRowTriaje = oTable_TriajeCE.api(true).row('.selected').data()
            if (isEmpty(objRowTriaje)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            //Valida si no es hoy
            const fechaHoy = Admision.obtenerFechaHoy();
            const fechaCita = (objRowTriaje.fechaCita || '').trim();

            if (fechaCita !== fechaHoy) {
                alerta(2, 'Solo puedes confirmar llegada de Citas del dia de hoy');
                return false;
            }

            //Valida si pagó
			if (objRowTriaje.generaPago == 1) {
				if (objRowTriaje.costoCeroCE != "S") {
					if (objRowTriaje.idEstadoCita != 4 && objRowTriaje.idEstadoCita != 2) {

						Swal.fire({
							title: "Paciente no pagó",
							text: "Paciente con Plan: " + objRowTriaje.planA + " no pagó. ¿Desea cambiar el estado a pagado?",
							icon: "warning",
							showCancelButton: true,
							confirmButtonText: "Sí",
							cancelButtonText: "No"
						}).then((result) => {
							if (result.isConfirmed) {
								fetch("/Admision/CambiarEstadoCitaPagado?idCita=" + objRowTriaje.idCita, {
									method: "POST"
								})
								.then(res => res.json())
								.then(data => {
									if(data.resultado)
									{
										Swal.fire("Actualizado", "La cita fue marcada como pagada.", "success");
										$('#btnBuscar').trigger('click');
									}
									else
										Swal.fire("Error", data.mensaje, "error");
								})
								.catch(err => {
									Swal.fire("Error", "No se pudo actualizar el estado.", "error");
								});
							}
						});
						return false;
					}
				}
			}

            Admision.LimpiarCampos()

            $('#txtCuentaTriaje').attr('disabled', true)
            $('#btnBuscarDatosPaciente').attr('disabled', true)
            $('#txtIdCita').val(objRowTriaje.idCita) //MGAMERO

            $('#txtCuentaTriaje').val(objRowTriaje.idCuentaAtencion)
            Admision.ListaAtencionByIdCuentaAtencion(2)
            //Admision.listaTriaje(objRowTriaje.idAtencion)

             
            $('#modalLlegada').modal('show')
        })       
        
        $('#btnGuardarLlegada').on('click', function() {
            /*
            if ($('#txtPeso').val() == '') {
                alerta(2, "El Peso es obligatorio")
                $('#txtPeso').focus()
                return false
            }
            if ($('#txtTalla').val() == '') {
                alerta(2, "La Talla es obligatoria")
                $('#txtTalla').focus()
                return false
            }
            */

            Admision.CambiarEstadoColaCita(
                $("#txtIdCita").val(),
                $("#txtIdAtencionTriaje").val(),
                2, // Llego
                "Confirma llegada de paciente desde Admisión",
                ''
            );

        })


        $('#btnCerrarModalLlegada').on('click', function() {
            $('#modalLlegada').modal('hide')
        })

        // MGAMERO - FIN
        $('#btnConsultar').on('click', function () {
            let objRowTriaje = oTable_TriajeCE.api(true).row('.selected').data()
            if (isEmpty(objRowTriaje)) {
                alerta(2, 'Selecciona un registro')
                return false
            }

            Admision.LimpiarCampos()
            $('#btnBuscarDatosPaciente').attr('disabled', true)
            $('.bloquear-campo').attr('disabled', true)
            $('#btnguardarTriaje').hide()

            $('#txtCuentaTriaje').val(objRowTriaje.idCuentaAtencion)
            Admision.ListaAtencionByIdCuentaAtencion(2)
            Admision.listaTriaje(objRowTriaje.idAtencion)

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
            $('#txtFechaAdmBusq').val('')
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
    
    obtenerFechaHoy() {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    },

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
        $('#txtIdCita').val('')
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
    Admision.Plugins()
    Admision.CargaInicial()
    Admision.InitDatablesTriajeCE()
    Admision.eventos()
});




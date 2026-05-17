let ImgMovimiento = {
    accion: '',
    idCuentaAtencion: 0,
    idAtencion: 0,
    idPaciente: 0,
    idMovimiento: 0,
    idOrden: 0,
    idOrdenPago: 0,
    idReceta: 0,
    idComprobantePago: 0,
    idTipoFinanciamiento: 0,
    idMovApReemplazo: 0,
    detalleExamenes: null,
    detalleInsumos: [],
}

let Imagenologia = {
    idCuentaAtencion: 0,
    idOrden: 0,
    idMovimiento: 0,
    idProducto: 0,
    idPuntoCarga: 0,
    puntoCarga: '',
    idCargoResponsable: 0,
    tipoResponsableEstudio: '',
    requiereInsumo: false,
    modoCargaInsumo: 0,
    tipoFormulario: '',

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtBusqFechaInicio, #txtBusqFechaFin, #txtFechaResultado, #txtResFechaNacimiento, #txtMovFechaNacimiento, #txtMovFechaFUR, #txtMovFechaFPP').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $("#txtBusqFechaInicio, #txtBusqFechaFin, #txtFechaResultado, #txtResFechaNacimiento, #txtMovFechaNacimiento, #txtMovFechaFUR, #txtMovFechaFPP").mask("Dd/Mm/abcd");

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtBusqHoraInicio, #txtBusqHoraFin, #txtHoraResultado, #txtMovHoraNacimiento").mask("Hn:Nn");
    },

    CargaInicial: async () => {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $("#txtBusqFechaInicio").datepicker("setDate", fechaP);
        $("#txtBusqFechaFin").datepicker("setDate", fechaP);

        $("#txtBusqHoraInicio").val("00:00:00");
        $("#txtBusqHoraFin").val("23:59:59");

        $("#btnInsumosImgMov").hide();

        $("#frameInformeResultado").hide();

        Imagenologia.idPuntoCarga = $("#PuntoCarga").html();
        if (Imagenologia.idPuntoCarga == 20) {
            Imagenologia.idCargoResponsable = 8;
            Imagenologia.puntoCarga = "Ecografía General";
        }
        if (Imagenologia.idPuntoCarga == 21) {
            Imagenologia.idCargoResponsable = 7;
            Imagenologia.puntoCarga = "Rayos X";
            Imagenologia.requiereInsumo = true;
            $("#btnInsumosImgMov").show();
            $("#frameInformeResultado").show();
        }
        if (Imagenologia.idPuntoCarga == 22) {
            Imagenologia.idCargoResponsable = 6;
            Imagenologia.puntoCarga = "Tomografía";
        }
        if (Imagenologia.idPuntoCarga == 23) {
            Imagenologia.idCargoResponsable = 4;
            Imagenologia.puntoCarga = "Ecografía Obstétrica";
        }

        BusqRecetasPacientes.idPuntoCarga = Imagenologia.idPuntoCarga;

        $('.chzn-select').chosen().trigger("chosen:updated");

        const permisoResultados = await Utilitario.ValidarPermiso(1000);
        if (permisoResultados == false) {
            $("#btnModificarResultadoImg").remove();
            $("#btnEliminarResultadoImg").remove();
        }
    },

    CargarCombos() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/listarTipoServicio?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboBusqTipoServicio').empty();
                $(datos.data.table).each(function (i, obj) {
                    if (obj.valor < 4) {
                        $('#cboBusqTipoServicio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    }
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "Error listar tipos servicio!");
                }, 900)
            }
        });

        let formDataServicio = new FormData()
        formDataServicio.append('idTipoServicio', 5);
        formDataServicio.append('idDepartamento', 0);
        formDataServicio.append('idEspecialidad', 21);
        formDataServicio.append('idServicio', 0);
        $.ajax({
            async: false,
            cache: false,
            url: "/Servicios/ListarServicios?area=General",
            datatype: "json",
            type: "post",
            data: formDataServicio,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboServicioRealizaPrueba').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    if (obj.idServicio != 22) {
                        $('#cboServicioRealizaPrueba').append('<option  value="' + obj.idServicio + '">' + obj.nombre + '</option>');
                    }
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "Error listar servicio!");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/ConfiguracionResultadosImagenes/ImgGruposSeleccionarTodos?area=FactConfig",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboBusqGrupoExamen').empty();
                $('#cboBusqGrupoExamen').append('<option value="0">Todos</option>');
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboBusqGrupoExamen').append('<option  value="' + obj.idGrupo + '">' + obj.nombreGrupo + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "Error listar grupos examen!");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/ImagenologiaResultados/EmpleadosImagenologiaTodos?area=Imagenes",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboBusqRealizaExamen').empty();
                $('#cboBusqRealizaExamen').append('<option value="0">Todos</option>');
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboBusqRealizaExamen').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "Error listar empleados imagenologia!");
                }, 900)
            }
        });


        let formDataCargo = new FormData()
        formDataCargo.append('idCargo', Imagenologia.idCargoResponsable)
        $.ajax({
            async: false,
            cache: false,
            url: "/ImagenologiaMovimiento/EmpleadosImagenologiaPorCargo?area=Imagenes",
            datatype: "json",
            type: "post",
            data: formDataCargo,
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboMovRegistraOrden').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboMovRegistraOrden').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
                $('#cboMovRegistraOrden').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "Error listar empleados por cargo imagenologia!");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Empleados/ListarMedicosTodos?area=Seguridad",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMovMedicoSolicita').empty();
                $('#cboMovMedicoRealiza').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboMovMedicoSolicita').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                    $('#cboMovMedicoRealiza').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
                $('#cboMovMedicoSolicita').val("");
                $('#cboMovMedicoRealiza').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "ERROR", "Error listar medicos solciita y realiza");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListaTiposSexo?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboMovSexo').empty();
                $(datos.lsSexos.table).each(function (i, obj) {
                    $('#cboMovSexo').append('<option  value="' + obj.idTipoSexo + '">' + obj.descripcion + '</option>');
                });
                $('#cboMovSexo').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "ERROR", "Error listar medicos solciita y realiza");
                }, 900)
            }
        });

        $.ajax({
            async: false,
            cache: false,
            url: "/Utilitario/ListarTiposFinanciamientos?area=Comun",
            datatype: "json",
            type: "post",
            success: function (datos) {
                $('#cboMovPlan').empty();
                $(datos.lstData.table).each(function (i, obj) {
                    $('#cboMovPlan').append('<option  value="' + obj.idTipoFinanciamiento + '">' + obj.descripcion + '</option>');
                });
                $('#cboMovPlan').val("");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta2("danger", "", "ERROR", "Error listar medicos solciita y realiza");
                }, 900)
            }
        });


        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    //FactOrdenServicioPorFechasImgPaciente: () => {
    //    let formData = new FormData()
    //    formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
    //    formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
    //    formData.append('idPuntoCarga', Imagenologia.idPuntoCarga) // cambiar por parametro

    //    //oTable_patologiaClinica.fnClearTable()
    //    //oTable_reporteICIDonaciones.fnClearTable()
    //    return HttpClient.Post('/LaboratorioResultados/FactOrdenServicioPorFechasImgPaciente?area=Laboratorio', formData)
    //        .then(res => {
    //            if (res.estado) {
    //                return res.data.table
    //            } else {
    //                alerta(3, res.mensaje)
    //                return null
    //            }
    //        })
    //        .catch(e => {
    //            alerta(2, 'Error: ' + e)
    //            return null
    //        })
    //},

    FactOrdenServicioPorFechasImgPaciente: () => {
        let formData = new FormData();
        formData.append('idMovimiento', $("#txtBusqNroMovimiento").val())
        formData.append('idCuenta', $("#txtBusqNroCuenta").val())
        formData.append('historia', $("#txtBusqNroHistoria").val())
        formData.append('nombres', $("#txtBusqNombres").val())
        formData.append('fechaInicio', $("#txtBusqFechaInicio").val() + ' ' + $("#txtBusqHoraInicio").val())
        formData.append('fechaFin', $("#txtBusqFechaFin").val() + ' ' + $("#txtBusqHoraFin").val())
        formData.append('idTipoServicio', $("#cboBusqTipoServicio").val())
        formData.append('idGrupoExamen', $("#cboBusqGrupoExamen").val())
        formData.append('idRealizaExamen', $("#cboBusqRealizaExamen").val())
        formData.append('idPuntoCarga', Imagenologia.idPuntoCarga) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/ImagenologiaMovimiento/ListarMovimientosImagenelogia?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    return res.data.table
                } else {
                    alerta(3, res.mensaje)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null
            })
    },

    ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga: (idOrden, idPuntoCarga, idMovimiento) => {
        let formData = new FormData()
        formData.append('idOrden', idOrden)
        formData.append('idPuntoCarga', idPuntoCarga)
        formData.append('idMovimiento', idMovimiento) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/ImagenologiaMovimiento/ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga?area=Laboratorio', formData)
            .then(res => {
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table;
                    } else {
                        return null;
                    }
                } else {
                    alerta(3, res.mensaje)
                    return null;
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                return null;
            })
    },



    //FactOrdenServicioPorIdMovimiento: (idMovimiento, idPuntoCarga) => {
    //    let formData = new FormData()
    //    formData.append('idMovimiento', idMovimiento)
    //    formData.append('idPuntoCarga', idPuntoCarga) // cambiar por parametro

    //    //oTable_patologiaClinica.fnClearTable()
    //    //oTable_reporteICIDonaciones.fnClearTable()
    //    return HttpClient.Post('/PatologiaClinica/FactOrdenServicioPorIdMovimiento?area=Laboratorio', formData)
    //        .then(res => {
    //            if (res.estado) {
    //                return res.data.table
    //            } else {
    //                alerta(3, res.mensaje)
    //                return null
    //            }
    //        })
    //        .catch(e => {
    //            alerta(2, 'Error: ' + e)
    //            return null
    //        })
    //},

    async EmpleadosImagenologiaResultados(idGrupo) {
        let respuesta = null;
        let resp = false;
        let data = new FormData();

        data.append('idGrupo', idGrupo);

        try {
            $('#cboRealizaPrueba').empty();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaResultados/EmpleadosImagenologiaPorGrupo?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $(datos.dataSet.table).each(function (i, obj) {
                $('#cboRealizaPrueba').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
            });
            $('.chzn-select').chosen().trigger("chosen:updated");
        } catch (error) {
            alerta2("error", "", error);
        }

    },


    async CargarModuloResultado(formularioRegistro) {
        let resp = false;
        let midata = new FormData();
        midata.append('formularioRegistro', formularioRegistro);

        $("#modulo").html("");

        try {
            Cargando(1)
            let datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaResultados/CargarModuloResultado?area=Imagenes",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (isEmpty(datos) == false) {
                $("#PanelResultadosPersonalizadosImg").html(datos);
                resp = true;
            }


            //$('#TituloModalResImg').html($('#tipoModulo').val())
            Cargando(0)
        } catch (error) {
            //console.error(error)
            Cargando(0)
            alerta(3, JSON.stringify(error));
        }

        return resp;
    },

    async CargarDatosResultadosImagenologia(datos) {
        Imagenologia.LimpiarCamposResultados();
        $("#TituloModalResImg").text("(" + datos.codigo + ") " + datos.nombre);
        await Imagenologia.EmpleadosImagenologiaResultados(datos.idGrupo);
        Imagenologia.idCuentaAtencion = datos.idCuentaAtencion;
        Imagenologia.idOrden = datos.idOrden;
        Imagenologia.idMovimiento = datos.idMovimiento;
        Imagenologia.idProducto = datos.idProducto;
        $("#txtGrupoExamen").val(datos.grupo);
        //$("#txtFechaResultado").val();
        $("#txtFechaResultado").datepicker("setDate", datos.fechaResultado);
        $("#txtHoraResultado").val(datos.horaResultado);
        $("#txtCodigoIngreso").val(datos.codigoIngreso);
        $("#txtMedicoSolicitante").val(datos.medicoSolicitante);
        $("#cboRealizaPrueba").val(datos.idRealizaAnalisis);
        $("#cboServicioRealizaPrueba").val(datos.idServicioRealiza);

        $("#txtResNroHistoria").val(datos.nroHistoriaClinica);
        $("#txtResTipoHistoria").val(datos.tipoNumeracionHistoria);
        $("#txtResApPaterno").val(datos.apPaterno);
        $("#txtResApMaterno").val(datos.apMaterno);
        $("#txtResNombres").val(datos.nombres);
        $("#txtResSexo").val(datos.sexo);
        //$("#txtResFechaNacimiento").val(respuesta.fechaNacimiento);
        $("#txtResFechaNacimiento").datepicker("setDate", datos.fechaNacimiento);
        //$("#txtResEdad").val(CalcularEdadSegunFecha(datos.fechaNacimiento, datos.fechaOrden));
        let edad = null;
        edad = CalcularEdadAnioMesDiaSegunFecha(datos.fechaNacimiento, datos.fechaOrden);
        $('#txtResEdad').val(edad.años + "A " + edad.meses + "M " + edad.dias + "D ");

        $('#frmEdadGestacional').hide();
        $('#frmTalla').hide();
        if (edad.años == 0 && edad.meses == 0) {
            $('#frmEdadGestacional').show();
            $('#txtResEdadGest').val(datos.edadGestacionalRn);
            $('#txtResPeso').val(datos.pesoRn);
            $('#txtResTalla').val(datos.tallaRn);
        } else {
            $('#frmTalla').show();
            $('#txtResPeso').val(datos.peso);
            $('#txtResTalla').val(datos.talla);
        }



        $("#txtResInforme").val(datos.informe);
        $("#txtResObservaciones").val(datos.observaciones);
        $("#txtResConclusiones").val(datos.conclusiones);
        $('.chzn-select').chosen().trigger("chosen:updated");
        //const cabecera = await Imagenologia.CargarCabeceraResultadosLaboratorio(idProducto, idOrden);
        //if (cabecera) {

        //$("#txtResFechaFUR").datepicker("setDate", datos.fur);
        //$("#txtResFechaFPP").datepicker("setDate", datos.fpp);
        //$("#txtResGesta").val(datos.gesta);
        //$("#txtResParidad1").val(datos.paridad1);
        //$("#txtResParidad2").val(datos.paridad2);
        //$("#txtResParidad3").val(datos.paridad3);
        //$("#txtResParidad4").val(datos.paridad4);
        //$("#txtMovEdadGestSem").val(datos.edadGestSem);
        //$("#txtMovEdadGestDias").val(datos.edadGestDias);


        if (isEmpty(datos.tipoFormulario)) {
            Imagenologia.tipoFormulario = "";
            $("#PanelResultadosPersonalizadosImg").hide();
            $("#PanelResultadosImg").show();
            let formato = await Imagenologia.CargarFormatoResultado(datos.idProducto);
            if (formato) {
                let resultados = await Imagenologia.CargarResultadosImagenologia(datos.idProducto, datos.idOrden, 'IMG');
                if (resultados) {
                    $('#modalImgResultado').modal('show');
                }
            }
        } else {
            Imagenologia.tipoFormulario = datos.tipoFormulario;
            $("#PanelResultadosImg").hide();
            $("#PanelResultadosPersonalizadosImg").show();
            let formato = await Imagenologia.CargarModuloResultado(datos.tipoFormulario)
            if (formato) {
                let resultados = await Imagenologia.CargarResultadosPersonalizadosImagenologia(datos);
                if (resultados) {
                    $('#modalImgResultado').modal('show');
                }
            }
            //$('#modalImgResultado').modal('show');
        }



        //} 
    },

    async CargarCabeceraResultadosLaboratorio(idProducto, idOrden) {
        let respuesta = null;
        let resp = false;
        let data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idProducto', idProducto);
        data.append('tipo', 'LAB');

        try {
            oTable_resultadosOrdenes.fnClearTable();
            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/LaboratorioResultados/ListarCabeceraResultados?area=Laboratorio",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsResultados.table.length > 0) {
                respuesta = datos.lsResultados.table[0];
                $("#txtGrupoExamen").val(respuesta.grupo);
                //$("#txtFechaResultado").val();
                $("#txtFechaResultado").datepicker("setDate", respuesta.fechaResultado);
                $("#txtCodigoIngreso").val(respuesta.codigoIngreso);
                $("#txtMedicoSolicitante").val(respuesta.medicoSolicitante);
                $("#cboRealizaPrueba").val(respuesta.idRealizaAnalisis);

                $("#txtResNroHistoria").val(respuesta.nroHistoriaClinica);
                $("#txtResTipoHistoria").val(respuesta.tipoHistoria);
                $("#txtResApPaterno").val(respuesta.apPaterno);
                $("#txtResApMaterno").val(respuesta.apMaterno);
                $("#txtResNombres").val(respuesta.nombres);
                $("#txtResSexo").val(respuesta.sexo);
                //$("#txtResFechaNacimiento").val(respuesta.fechaNacimiento);
                $("#txtResFechaNacimiento").datepicker("setDate", respuesta.fechaNacimiento);
                $("#txtResEdad").val(CalcularEdadSegunFecha(respuesta.fechaNacimiento, respuesta.fechaResultado));
                $('.chzn-select').chosen().trigger("chosen:updated");
                resp = true;
            } else {
                let FechaHora = await Utilitario.FechaHoraServidor();
                $("#txtFechaResultado").datepicker("setDate", FechaHora.substring(0, 10));
                $("#txtHoraResultado").val(FechaHora.substring(11, 16));
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta2("error", "", error);
        }

        return resp;
    },


    async CargarFormatoResultado(idProducto) {
        let resp = false;
        let i = 0;
        let j = 0;
        let lenT = 0;
        let lenC = 0;
        let valor = null;
        let valorCombo = null;
        const formato = await ConfigResImg.CargarFormatoResultadosImagenologia(idProducto);
        lenT = formato.length;
        console.log("cantidad: " + formato.length);

        console.log("valor" + formato[0].grupo);


        if (!isEmpty(formato)) {
            let hmltTablaFormato = "";
            //var resultados = datos.lsResultados.table;
            let htmlGrupo = "";
            let htmlItem = "";
            let htmlValorNumero = "";
            let htmlValorTexto = "";
            let htmlValorCombo = "";
            let htmlValorComboOption = "";
            let htmlValorCheck = "";
            let htmlValorReferencial = "";
            let controlValor = false;
            let controlCombo = false;
            let idCombo = "";
            let idComboTemp = "";
            //let htmlGrupoCombo = "";
            //let htmlItemCombo = "";

            oTable_ResultadosImagenologia.fnClearTable();

            while (i < lenT) {
                valor = formato[i];

                controlValor = true;

                htmlGrupo = "<td>" + valor.grupo + "</td>";
                htmlItem = "<td>" + valor.item + "</td>";

                if (valor.soloNumero == 1 && controlValor == true) {
                    htmlValorNumero = "<td><input type='text' class='form-control form-control-sm solo-numero campoResultado' id='numValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "' data-ordenXresultado='" + valor.ordenXresultado + "' autocomplete='off'></td>";
                    controlValor = false;
                } else {
                    htmlValorNumero = "<td></td>";
                }

                if (valor.soloTexto == 1 && controlValor == true) {
                    htmlValorTexto = "<td><input type='text' class='form-control form-control-sm campoResultado' id='txtValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "' data-ordenXresultado='" + valor.ordenXresultado + "' autocomplete='off'></td>";
                    controlValor = false;
                } else {
                    htmlValorTexto = "<td></td>";
                }

                if (valor.soloCombo == 1 && controlValor == true) {
                    controlCombo = true;
                    //htmlGrupoCombo = "<td>" + valor.grupo + "</td>";
                    //htmlItemCombo = "<td>" + valor.item + "</td>";
                    htmlValorComboOption = "<option value=''></option>";
                    idCombo = valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem;
                    while (controlCombo && i < lenT) {
                        valor = formato[i];
                        idComboTemp = valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem;
                        if (valor.soloCombo == 1 && idCombo == idComboTemp) {
                            htmlValorComboOption = htmlValorComboOption + "<option value='" + valor.ordenXresultado + "' data-ordenXresultado='" + valor.ordenXresultado + "'>" + valor.valorSiEsCombo + "</option>";
                            i++;

                            if (i == lenT) {
                                htmlValorCombo = "<td>" +
                                    "<select class='chzn-select-deselect w-100 campoResultado' data-placeholder='Seleccione una opción' id='cmbValorResultado_" + idCombo + "'>" +
                                    htmlValorComboOption +
                                    "</select>" +
                                    "</td>";

                                controlCombo = false;
                                controlValor = false;
                            }
                        } else {
                            htmlValorCombo = "<td>" +
                                "<select class='chzn-select-deselect w-100 campoResultado' data-placeholder='Seleccione una opción' id='cmbValorResultado_" + idCombo + "'>" +
                                htmlValorComboOption +
                                "</select>" +
                                "</td>";

                            controlCombo = false;
                            controlValor = false;
                            i--;
                        }

                    }
                } else {
                    htmlValorCombo = "<td></td>";
                }

                if (valor.soloCheck == 1 && controlValor == true) {
                    //htmlValorCheck = "<td><input type='text' class='form-control form-control-sm' id='txtValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "' autocomplete='off'></td>";
                    htmlValorCheck = "<td><div class='check__toggle text-sm-center'>" +
                        "<label class='toggle'>" +
                        "<input class='toggle__input campo bloquear-campos campoResultado' type='checkbox' id='chkValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "' data-ordenXresultado='" + valor.ordenXresultado + "'>" +
                        "<span class='toggle__label'></span>" +
                        "</label>" +
                        "</div>" +
                        "</td>";
                    controlValor = false;
                } else {
                    htmlValorCheck = "<td></td>";
                }

                htmlValorReferencial = "<td><div id='txtValorReferencial_" + valor.idProductoCpt + "_" + valor.idGrupo + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado + "'>" + isNull(valor.valorReferencial, "") + "</div></td>"

                if (controlValor == false) {
                    hmltTablaFormato = hmltTablaFormato + "<tr>" + htmlGrupo + htmlItem + htmlValorNumero + htmlValorTexto + htmlValorCombo + htmlValorCheck + htmlValorReferencial + "</tr>";
                }

                i++;
            }


            $('#tbodyFormatoResultadosImg').html(hmltTablaFormato);
            oTable_ResultadosImagenologia.resize();
            //$('#tblResultadosExamenes').DataTable().columns.adjust();            
            $('.chzn-select').chosen().trigger("chosen:updated");
            $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
            $("#tblFormatoResultadosImg .chzn-select").val("");
            $('#modalImgResultado').modal('show');

            return true;

        } else {
            alerta2('info', '', 'No existe formato de resultados para el exámen seleccionado.');
            return false;
        }
    },

    async CargarResultadosImagenologia(idProducto, idOrden, tipo) {
        let hmltTabla = "";
        let resp = false;
        let data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idProducto', idProducto);
        data.append('tipo', tipo);

        try {
            oTable_resultadosOrdenes.fnClearTable();
            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaResultados/ListarResultados?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsResultados.table.length > 0) {
                let resultados = datos.lsResultados.table;
                let idGrupoRes = 0
                let idItemRes = 0
                resultados.forEach(function (valor) {

                    if (valor.soloNumero) {
                        $("#numValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupoCpt + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado).val(valor.valor);
                    }

                    if (valor.soloTexto) {
                        $("#txtValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupoCpt + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado).val(valor.valor);
                    }

                    if (valor.soloCombo) {
                        $("#cmbValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupoCpt + "_" + valor.idItemGrupo + "_" + valor.idItem).val(valor.ordenXresultado);
                    }

                    if (valor.soloCheck) {
                        $("#chkValorResultado_" + valor.idProductoCpt + "_" + valor.idGrupoCpt + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado).val(valor.valor);
                    }

                    $("txtValorReferencial_" + valor.idProductoCpt + "_" + valor.idGrupoCpt + "_" + valor.idItemGrupo + "_" + valor.idItem + "_" + valor.ordenXresultado).html(valor)

                    $('#lblNombreExamen').html(valor.producto);
                    if (valor.idGrupo != idGrupoRes) {
                        idGrupoRes = valor.idGrupo;
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" + valor.grupo + "</b> </td></tr>";
                    }

                    if (valor.idItem != idItemRes) {
                        idItemRes = valor.idItem;
                        hmltTabla = hmltTabla + "<tr><td>" + valor.item + " </td><td>" + valor.valor + "</td><td>" + valor.valorReferencial + "</td></tr>";
                    }
                    //$('#txtObserOrdRes').val(valor.observaciones + '\n' + valor.conclusiones);
                });
                //$('#tbodyResultados').html(hmltTabla);
                //$('#modalResultadosLabImg').modal('show');
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");

            } else {
                if (isEmpty($("#txtResObservaciones").val())) {
                    let FechaHora = await Utilitario.FechaHoraServidor();
                    $("#txtFechaResultado").datepicker("setDate", FechaHora.substring(0, 10));
                    $("#txtHoraResultado").val(FechaHora.substring(11, 16));
                    alerta2('info', '', 'No existen resultados para el examen seleccionado.');
                }
            }

            return true;
        } catch (error) {
            alerta2("error", "", error);
            return false;
        }

    },

    async CargarResultadosImagenesLaboratorio(idProducto, idOrden, tipo) {
        var hmltTabla = "";
        var data = new FormData();

        data.append('idOrden', idOrden);
        data.append('idProducto', idProducto);
        data.append('tipo', tipo);

        try {
            oTable_resultadosOrdenes.fnClearTable();
            $('#lblNombreExamen').html("");
            $('#tbodyResultados').html("");
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarResultadosLabImg?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.lsResultados.table.length > 0) {
                var resultados = datos.lsResultados.table;
                var idGrupoRes = 0
                var idItemRes = 0
                resultados.forEach(function (valor) {
                    $('#lblNombreExamen').html(valor.producto);
                    if (valor.idGrupo != idGrupoRes) {
                        idGrupoRes = valor.idGrupo;
                        //hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;'><td><b>" + valor.grupo + "</b> </td><td> </td><td> </td></tr>";
                        hmltTabla = hmltTabla + "<tr style='background-color: #d3e4f5;font-weight:bold'><td colspan='3'><b>" + valor.grupo + "</b> </td></tr>";
                    }

                    if (valor.idItem != idItemRes) {
                        idItemRes = valor.idItem;
                        //hmltTabla = hmltTabla + "<tr><td></td><td>" + valor.item + " </td><td>" + valor.valor + "</td></tr>";
                        hmltTabla = hmltTabla + "<tr><td>" + valor.item + " </td><td>" + valor.valor + "</td><td>" + valor.valorReferencial + "</td></tr>";
                    }
                    $('#txtObserOrdRes').val(valor.observaciones + '\n' + valor.conclusiones);
                });
                $('#tbodyResultados').html(hmltTabla);
                //$('#tblResultadosExamenes').DataTable().columns.adjust();
                $('#modalResultadosLabImg').modal('show');

            } else {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta2("error", "", error);
        }

    },

    async CargarResultadosPersonalizadosImagenologia(datos) {

        $("#txtFechaFUR").datepicker("setDate", datos.fur);
        $("#txtFechaFPP").datepicker("setDate", datos.fpp);
        $("#txtGesta").val(datos.gesta);
        $("#txtGestaRes").val(datos.gesta);

        if (isEmpty(datos.paridad) == false) {
            let strParidad = datos.paridad;
            let numerosParidad = strParidad.split("-");
            numerosParidad.forEach(function (valor, index) {
                //console.log("Índice: " + index + ", Valor: " + valor);
                $("#txtParidad" + (index + 1)).val(valor);
                $("#txtParidadRes" + (index + 1)).val(valor);
            });
        }
        $("#txtEdadGestacional").val(datos.edadGestSem + " Sem. " + datos.edadGestDias + " Dias.");
        $("#txtEdadGestSem").val(datos.edadGestSem);
        $("#txtEdadGestDias").val(datos.edadGestDias);

        if (datos.nombre.toUpperCase().includes("UNICO")) {
            $('#rdbFeto2').parent().find('.radioButtonStyleSpan').hide();
            $('#rdbFeto3').parent().find('.radioButtonStyleSpan').hide();
        } /*else {
            console.log("La palabra NO está en el texto");
        }*/

        if (Imagenologia.tipoFormulario == "frmCardiotocografiaCST" || Imagenologia.tipoFormulario == "frmCardiotocografiaNST") {
            await EcoCardiotografia.Iniciar();
            await EcoCardiotografia.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoAbdominalBasic") {
            await EcoAbdominalBasica.Iniciar();
            await EcoAbdominalBasica.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoCardiografia") {
            await EcoCardiografia.Iniciar();
            await EcoCardiografia.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoDopplerCrec") {
            await EcoDopplerCrecimiento.Iniciar();
            await EcoDopplerCrecimiento.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmecoGenetica") {
            await EcoGenetica.Iniciar();
            await EcoGenetica.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmecoMorfologico") {
            await EcoMorfologica.Iniciar();
            await EcoMorfologica.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoNeurosonografi") {
            await EcoNeurosonografia.Iniciar();
            await EcoNeurosonografia.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoUteroGrav") {
            await EcoUteroGravido.Iniciar();
            await EcoUteroGravido.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        } else if (Imagenologia.tipoFormulario == "frmEcoVaginalBasica") {
            await EcoVaginalBasica.Iniciar();
            await EcoVaginalBasica.CargarResultado(datos.idOrden, datos.idMovimiento, datos.idProducto);
        }

        return true;
    },


    //ListarSaldosPorAlmacenConFechaCorte: () => {
    //    let formData = new FormData()
    //    formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
    //    formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())

    //    //oTable_patologiaClinica.fnClearTable()
    //    //oTable_reporteICIDonaciones.fnClearTable()
    //    HttpClient.Post('/PatologiaClinica/ListarExamenesConResultadoPorFecha?area=Farmacia', formData)
    //        .then(res => {
    //            if (res.estado) {
    //                if (res.data.table.length > 0) {
    //                    //oTable_patologiaClinica.fnAddData(res.data.table)
    //                }
    //                Cargando(0)
    //            } else {
    //                alerta(3, res.mensaje)
    //                Cargando(0)
    //            }
    //            return res
    //            Cargando(0)
    //        })
    //        .catch(e => {
    //            alerta(2, 'Error: ' + e)
    //            Cargando(0)
    //        })
    //},

    DataTableProductosBuscados() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '28vh',
            autoWidth: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '75%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 1,
                    data: "precioUnitario",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }
        var tableWrapper = $('#tblProductosBuscados');
        oTable_ProductosBuscados = $("#tblProductosBuscados").dataTable(parms);
        $('#tblProductosBuscados_length').css('display', 'none');

        //let offSetElement = $('#frameBusquedaProductos').offset();
        //$('#frameResultadosBusquedaProductos').css({
        //    top: offSetElement.top,
        //    left: offSetElement.left
        //});

    },

    DataTableBoletasPendientesDeUso() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '28vh',
            autoWidth: false,

            columns: [
                {
                    width: '10%',
                    targets: 0,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    visible: false,
                    data: "ptoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "idOrdenPago",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "tipoComprobante",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "nroSerie",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "nroDocumento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 1,
                    data: "procedimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblBoletasPendientes');
        oTable_BoletasPendientesDeUso = $("#tblBoletasPendientes").dataTable(parms);
        // $('#tblBoletasPendientes').css('display', 'none');


    },

    DataTableInsumosBuscados() {
        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            scrollY: '28vh',
            autoWidth: false,
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 1,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '75%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '15%',
                //    targets: 1,
                //    data: "precioUnitario",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
            ]
        }
        var tableWrapper = $('#tblInsumosBuscados');
        oTable_InsumosBuscados = $("#tblInsumosBuscados").dataTable(parms);
        $('#tblInsumosBuscados_length').css('display', 'none');

        //let offSetElement = $('#frameBusquedaProductos').offset();
        //$('#frameResultadosBusquedaProductos').css({
        //    top: offSetElement.top,
        //    left: offSetElement.left
        //});

    },

    InitDatablesDetalleProductos: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "seUsaSinPrecio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idImagEstado == 0) {
                            $(td).parent().css('color', '#f44336');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: '38%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '8%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = '  <input type="text" id="txtCantImgMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.cantidad, 1) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCampoDetalle dCantImgMov">'
                        $(td).html(inputCantidad);

                    }
                },
                {
                    width: '8%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputPrecio = '<div id="htmlPrecioImgMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" class="dPrecioImgMov">' + isNull(rowData.precioUnitario, 0.00) + '</div>'
                        $(td).html(inputPrecio);

                    }
                },
                {
                    width: '8%',
                    targets: 4,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputTotal = '<div id="htmlSubTotalImgMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" class="dSubTotalImgMov">' + isNull(rowData.importe, rowData.precioUnitario) + '</div>'
                        $(td).html(inputTotal);

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    visible: Imagenologia.idPuntoCarga == 21 ? true : false,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        let btnInsumos = '<button id="htmlInsumosImgMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" class="dInsumosImgProd btn btn-sm btn-secondary"><i class="fa fa-plus"></i></button>'
                        $(td).html(btnInsumos);

                    }
                },
                {
                    width: '22%',
                    targets: 6,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputObservaciones = '  <input type="text" id="txtObsImgMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.observaciones, "") + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm dCampoDetalle dObsImgMov">'
                        $(td).html(inputObservaciones);

                    }
                },


            ]

        }

        var tableWrapper = $('#tblImgMovDetalleProductos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ImgMovDetalleProductos = $("#tblImgMovDetalleProductos").dataTable(parms);

    },

    InitDatablesDetalleInsumos: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //{
                //    width: '0%',
                //    targets: 0,
                //    visible: false,
                //    data: "idPuntoCarga",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '0%',
                //    targets: 0,
                //    visible: false,
                //    data: "seUsaSinPrecio",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                {
                    width: '15%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idImagEstado == 0) {
                            $(td).parent().css('color', '#f44336');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: '55%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = '  <input type="text" id="txtCantTomadaImgInsMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.cantidadTomada, 1) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCampoDetalle dCantTomadaImgInsMov">'
                        $(td).html(inputCantidad);

                    }
                },

                {
                    width: '15%',
                    targets: 2,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        let inputCantidad = '  <input type="text" id="txtCantFalladaImgInsMov_' + rowData.idProducto + '" data-fila="' + rowData.index + '" value="' + isNull(rowData.cantidadFallada, 0) + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero dCampoDetalle dCantFalladaImgInsMov">'
                        $(td).html(inputCantidad);

                    }
                },


            ]

        }

        var tableWrapper = $('#tblImgMovDetalleInsumos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ImgMovDetalleInsumos = $("#tblImgMovDetalleInsumos").dataTable(parms);

    },

    InitDatablesListaOrdenes: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '20vh',
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idImagEstado == 0) {
                            $(td).parent().css('color', '#f44336');
                            $(td).parent().css('font-weight', 'bold');
                        }
                    }
                },
                {
                    width: '5%',
                    targets: 1,
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "paciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "estadoOrden",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "fechaDespacho",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "ordenaPrueba",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    //data: "idTipoSexo",
                    data: "sexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                //{
                //    width: '8%',
                //    targets: 7,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        var btnRuta = "";
                //        var btnImprime = "";
                //        var btnImprimeSinF = "";
                //        //var rutaBit4Id = "";

                //        btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //        if (rowData.code != '0') {
                //            if (rowData.statusFirma == 1) {
                //                btnImprimeSinF = "";
                //                btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            } else {
                //                btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //            }
                //        }

                //        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);


                //    }
                //}
            ]

        }

        var tableWrapper = $('#tblListadoOrdenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ListaOrdenes = $("#tblListadoOrdenes").dataTable(parms);

    },

    InitDatablesListaOrdenesDetalle: () => {

        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '13%',
                    targets: 1,
                    data: "grupo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '17%',
                    targets: 1,
                    data: "realizaExamen",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '7%',
                    targets: 2,
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 3,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 4,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '7%',
                    targets: 5,
                    data: "resultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                //{
                //    width: '20%',
                //    targets: 6,
                //    data: "obseraciones",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')

                //    }
                //},
                {
                    width: '10%',
                    targets: 7,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";
                        //var rutaBit4Id = "";
                        if (rowData.resultado == 'SI' && rowData.code != '') {
                            btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            if (rowData.code != '0') {
                                if (rowData.statusFirma == 1) {
                                    btnImprimeSinF = "";
                                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeResultadoCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                                } /*else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';                                   
                                }*/

                                if (rowData.statusFirmaEmpleado == 0 && rowData.statusFirmaOrden == 0) {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
                            } else {
                                btnImprimeSinF = '<button class="ImprimeInformeResultadoSF btn btn-sm btn-secondary glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                            }

                        }

                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);


                    }
                }
            ]

        }

        var tableWrapper = $('#tblListadoOrdenesDetalle'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ListaOrdenesDetalle = $("#tblListadoOrdenesDetalle").dataTable(parms);

    },

    IniciarDataTableResultados() {
        var parms = {
            "scrollY": "400px",
            "scrollCollapse": true,
            "targets": 'no-sort',
            "bSort": false,
            //data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //buttons: ['copy', 'csv', 'print']
            //columns: [                            

        }

        var tableWrapper = $('#tblResultadosExamenes'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_resultadosOrdenes = $("#tblResultadosExamenes").dataTable(parms);
        $('#tblResultadosExamenes_length').css('display', 'none')
        $('#tblResultadosExamenes').DataTable().columns.adjust();

    },

    InitDataTableFormatoResultado() {
        var parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
        }

        var tableWrapper = $('#tblFormatoResultadosImg'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ResultadosImagenologia = $("#tblFormatoResultadosImg").dataTable(parms);
        $('#tblFormatoResultadosImg_length').css('display', 'none')
        $('#tblFormatoResultadosImg').DataTable().columns.adjust();

    },



    Events: () => {

        //$('#btnListarOrdenesPatologia').on('click', () => {
        //    Imagenologia.ListarSaldosPorAlmacenConFechaCorte()
        //})

        $('#modalImgMovimiento').on('shown.bs.modal', function (e) {
            oTable_ImgMovDetalleProductos.resize();
        });

        $('#modalImgInsumos').on('shown.bs.modal', function (e) {
            oTable_ImgMovDetalleInsumos.resize();
        });

        $('#modalImgResultado').on('shown.bs.modal', function (e) {
            oTable_ResultadosImagenologia.resize();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnListarOrdenesImagenologia").click();
            }
        });

        $('#btnAgregarMovimiento').on('click', async () => {
            Cargando(1);
            Imagenologia.LimpiarCamposMovimiento();
            await Imagenologia.ListaDiagnosticosPorFiltro('');
            ImgMovimiento.accion = "A";
            $("#frameResultadosBusquedaProductos").hide();
            $("#frameResultadosBusquedaInsumos").hide();
            Imagenologia.DesbloquearCamposMovimiento();
            await Imagenologia.ValidarUsuarioRegistra();
            $("#modalImgMovimiento").modal("show");
            Cargando(0);
        });

        $('#btnModificarMovimiento').on('click', async () => {
            let objMov = oTable_ListaOrdenes.api(true).row('.selected').data();
            if (isEmpty(objMov)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objMov.idImagEstado == 0) {
                alerta2("info", "", "El movimiento ha sido anulado.<br>No es posible modificar este registro.");
                return;
            }

            Cargando(1);
            Imagenologia.LimpiarCamposMovimiento();
            ImgMovimiento.accion = "M";
            await Imagenologia.SeleccionarImgMovimiento(objMov.idMovimiento);
            $("#frameResultadosBusquedaProductos").hide();
            $("#frameResultadosBusquedaInsumos").hide();
            Imagenologia.DesbloquearCamposMovimiento();
            $("#modalImgMovimiento").modal("show");
            Cargando(0);
        });

        $('#btnConsultarMovimiento').on('click', async () => {
            let objMov = oTable_ListaOrdenes.api(true).row('.selected').data();
            if (isEmpty(objMov)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            Cargando(1);
            Imagenologia.LimpiarCamposMovimiento();
            ImgMovimiento.accion = "C";
            await Imagenologia.SeleccionarImgMovimiento(objMov.idMovimiento);
            $("#frameResultadosBusquedaProductos").hide();
            $("#frameResultadosBusquedaInsumos").hide();
            Imagenologia.BloquearCamposMovimiento();
            $("#modalImgMovimiento").modal("show");
            Cargando(0);
        });

        $('#btnEliminarMovimiento').on('click', async () => {
            //Cargando(1);
            //Imagenologia.LimpiarCamposMovimiento();
            //ImgMovimiento.accion = "E";
            let objMov = oTable_ListaOrdenes.api(true).row('.selected').data();
            if (isEmpty(objMov)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objMov.idImagEstado == 0) {
                alerta2("info", "", "El movimiento ha sido anulado.");
                return;
            }
            //await Imagenologia.SeleccionarImgMovimiento(objMov.idMovimiento);
            //$("#frameResultadosBusquedaProductos").hide();
            //$("#modalImgMovimiento").modal("show");
            //Cargando(0);

            let anularOrden = await await alertaAsync('question', 'ELIMINAR', "¿Esta seguro de anular la orden?" + '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' + objMov.idMovimiento + '</th></tr></table>', 'CANCELAR', false, 'ELIMINAR');

            if (anularOrden.isConfirmed) {
                await Imagenologia.EliminarImgMovimiento(objMov.idMovimiento);
            }

            // swal({
            //     title: 'ELIMINAR',
            //     text: "¿Esta seguro de anular la orden?" + '<br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' + objMov.idMovimiento + '</th></tr></table>',
            //     type: 'error',
            //     allowOutsideClick: false,
            //     showCancelButton: true,
            //     confirmButtonColor: '#ea423e',
            //     cancelButtonColor: '#6c6c6c',
            //     confirmButtonText: 'ELIMINAR',
            //     cancelButtonText: 'CANCELAR',
            // }).then(async function () {
            //     await Imagenologia.EliminarImgMovimiento(objMov.idMovimiento);
            // }, function (dimiss) {

            // });



        });

        $('#btnCancelarMovimiento').on('click', async () => {

            let cerrarMovimiento = await alertaAsync('question', 'CERRAR', '¿Esta seguro de cerrar el módulo de registro de ordenes?')

            if (cerrarMovimiento.isConfirmed) {
                Cargando(1)
                Imagenologia.LimpiarCamposMovimiento();
                //$('#btnListarOrdenesImagenologia').click();
                $("#modalImgMovimiento").modal("hide");
                Cargando(0)
            }


        });

        $('#btnCancelarBoletasPendientes').on('click', async () => {
            let cerrarMovimiento = await alertaAsync('question', 'CERRAR', '¿Esta seguro de salir?')

            if (cerrarMovimiento.isConfirmed) {
                $('#modalBoletasPendientesDeUso').modal('hide')
            }

        });

        $('#chkMovIAFAnoCubre').change(function () {
            if ($('#chkMovIAFAnoCubre').is(":checked")) {
                $("#cboMovPlan").val(1);
            } else {
                $("#cboMovPlan").val(ImgMovimiento.idTipoFinanciamiento);
            }
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#cboMovDx_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await Imagenologia.ListaDiagnosticosPorFiltro(filtro);
        });


        $('#btnListarOrdenesImagenologia').on('click', async () => {
            Cargando(1)

            oTable_ListaOrdenes.fnClearTable();
            oTable_ListaOrdenesDetalle.fnClearTable();
            let ordenServicioPorFechas = await Imagenologia.FactOrdenServicioPorFechasImgPaciente()
            //console.log(ordenServicioPorFechas);
            if (ordenServicioPorFechas.length == 0) {
                Cargando(0)
                alerta(2, 'No se encontro resultados para la busqueda indicada.')
                return false
            }

            oTable_ListaOrdenes.fnAddData(ordenServicioPorFechas)
            oTable_ListaOrdenes.resize();
            Cargando(0)
        })


        $('#btnImprimirTodosResultados').on('click', async function () {
            let objOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            //var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();

            if (isEmpty(objOrden)) {
                alerta2('info', '', 'Por favor seleccione un registro.')
                return false
            }

            Cargando(1);
            let tipoFormato = 'IMG-RES-GRUPO';
            const firma = await Utilitario.SeleccionarFirmaDigitalPorGrupo(objOrden.idMovimiento, tipoFormato);
            if (typeof firma === 'undefined') {
                alerta2('info', '', 'El documento no ha podido ser generado por falta de información. Por favor guarde algun resultado del movimiento seleccionado.');
            } else {
                await Utilitario.GenerarGrupoDocumentoPdf(objOrden.idMovimiento, tipoFormato);
            }
            Cargando(0);

        });

        $('#tblBoletasPendientes tbody').on('click', 'tr', async function () {
            oTable_BoletasPendientesDeUso.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            // await Imagenologia.ListarDetalleOrden();
        });

        $('#tblBoletasPendientes tbody').on('dblclick', 'tr', async function () {
            oTable_BoletasPendientesDeUso.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let seleccionarBoleta = await alertaAsync('question', 'Confirmar', '¿Esta seguro de registrar el movimiento con esta boleta?')

            if (seleccionarBoleta.isConfirmed) {
                let boletas = oTable_BoletasPendientesDeUso.api(true).row('.selected').data()

                $('#TabPacienteExterno').trigger('click')

                $('#txtMovNroCorrelativoBoleta').val(boletas.nroSerie)
                $('#txtMovNroDocumentoBoleta').val(boletas.nroDocumento)

                let nroSerie = $('#txtMovNroCorrelativoBoleta').val();
                let nroDocumento = $('#txtMovNroDocumentoBoleta').val();
                if (isEmpty(nroSerie) == false && isEmpty(nroDocumento) == false) {
                    Imagenologia.LimpiarCamposMovimiento();
                    await Imagenologia.BuscarComprobantePago(nroSerie, nroDocumento, Imagenologia.idPuntoCarga);
                }

                $('#modalBoletasPendientesDeUso').modal('hide')
            }

            // await Imagenologia.ListarDetalleOrden();
        });

        $('#tblListadoOrdenes tbody').on('click', 'tr', async function () {
            oTable_ListaOrdenes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            await Imagenologia.ListarDetalleOrden();
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', 'tr', async function () {
            oTable_ListaOrdenesDetalle.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoSF', async function () {
            let objOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            let objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();

            Cargando(1);
            let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code);               //KHOYOSI            
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.');

                let tipoFormato = 'IMG-RES';
                let tipoFormatoGrupo = 'IMG-RES-GRUPO';
                //console.log('row', row) /// verificar aqui los parametros y los datos que se enviaran
                const pdf = await Utilitario.GenerarFormatoResultadosPorItem(objOrden.idCuentaAtencion, row.idOrden, objOrden.idMovimiento, row.idProducto, tipoFormato);
                const pdfGrupo = await Utilitario.GenerarFormatoResultadosPorGrupo(objOrden.idCuentaAtencion, objOrden.idOrden, objOrden.idMovimiento, row.idProducto, tipoFormatoGrupo);

                if (pdf == true && pdfGrupo == true) {
                    Imagenologia.ListarDetalleOrden();
                    alerta('1', 'Se generó el documento correctamente.');
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.');
                }
            } else {
                //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });

        $('#btnModificarResultadoImg').on('click', async function () {
            let objrowTb = oTable_ListaOrdenesDetalle.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            if (objrowTb.idImagEstado == 0) {
                alerta2("info", "", "El movimiento ha sido anulado.<br>No es posible modificar este registro.");
                return;
            }

            if (!isEmpty(objrowTb)) {
                await Imagenologia.CargarDatosResultadosImagenologia(objrowTb);
                Imagenologia.DesbloquearCamposResultados();
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna examen.');
            }
            //$('#modalImgResultado').modal('show');
        });

        $('#btnCancelarResultado').on('click', async function () {
            $('#modalImgResultado').modal('hide');
        });

        $('#btnConsultarResultadoImg').on('click', async function () {
            let objrowTb = oTable_ListaOrdenesDetalle.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                if (isEmpty(objrowTb.tipoFormulario)) {
                    await Imagenologia.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'IMG');
                } else {
                    await Imagenologia.CargarDatosResultadosImagenologia(objrowTb);
                }

                Imagenologia.BloquearCamposResultados();
            } else {
                alerta2('info', '', 'No se ha seleccionado ninguna examen.');
            }
        });

        $('#btnEliminarResultadoImg').on('click', async function () {
            let objrowTb = oTable_ListaOrdenesDetalle.api(true).row('.selected').data();

            if (isEmpty(objrowTb)) {
                alerta2('info', '', 'No se ha seleccionado ningun examen.');
                return;
            }

            if (objrowTb.idImagEstado == 0) {
                alerta2("info", "", "El movimiento ha sido anulado.<br>No es posible eliminar este registro.");
                return;
            }

            if (objrowTb.resultado == "NO") {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
                return;
            }

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar los resultados del examen <span class='font-weight-bold'>(" + objrowTb.codigo + ") " + objrowTb.nombre + "</span> ?",
                type: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function () {
                await Imagenologia.EliminarResultado(objrowTb.idMovimiento, objrowTb.idProducto);
            }, function (dimiss) {

            });
        });

        $('#btnCerrarResultadoLabImg').on('click', function () {
            oTable_resultadosOrdenes.fnClearTable();
            $('#modalResultadosLabImg').modal('hide');
        });

        /*==============================FIRMA DIGITAL===========================================*/
        $('#tblListadoOrdenesDetalle tbody').on('click', '.FirmarInformeResultadoSF', async function () {
            let objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);

            Cargando(1);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI
            //if (firma) {

            //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
            //}
            Utilitario.TipoArchivoFirmar = 'IMG-RES';
            if (permisoFirmaDigital == 1) { await Utilitario.IniciarServicioFirmaBit4Id(row.code); }
            if (permisoFirmaDigital == 2) { await Utilitario.IniciarServicioFirmaPeru(row.code); }
            //            await Utilitario.IniciarServicioFirmaBit4Id(row.code);

            Cargando(0);

        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoCF', async function () {
            let objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            let row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnFirmaMovimiento').on('click', async function () {
            let objrow = oTable_ListaOrdenes.api(true).row('.selected').data()

            if (isEmpty(objrow)) {
                alerta2('info', '', 'Por favor seleccione un registro.')
                return false
            }

            if (objrow.idImagEstado == 0) {
                swal({
                    title: 'Movimiento',
                    text: "El movimiento se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            Cargando(1)
            Utilitario.TipoArchivoFirmar = 'IMG-RES';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos('', objrow.idMovimiento, "'IMG-RES','IMG-RES-GRUPO'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'IMG-RES','IMG-RES-GRUPO'", objrow.idMovimiento);
            }

            Cargando(0)
        });

        $('#btnFirmaLote').on('click', async function () {
            let listMovimientos = oTable_ListaOrdenes.api(true).data();
            let numMovimientos = [];

            Cargando(1)
            $(listMovimientos).each(async (i, obj) => {
                if (obj.idImagEstado != 0) {
                    numMovimientos.push(obj.idMovimiento);
                }
            })

            Utilitario.TipoArchivoFirmar = 'IMG-RES';
            if (permisoFirmaDigital == 1) {
                const paquete = await Utilitario.CrearPaqueteArchivos('', numMovimientos, "'IMG-RES','IMG-RES-GRUPO'");
                if (!isEmpty(paquete)) {
                    await Utilitario.IniciarServicioFirmaMultipleBit4Id(paquete.data)
                }
            } else if (permisoFirmaDigital == 2) {
                await Utilitario.IniciarServicioFirmaLoteFirmaPeru('', "'IMG-RES','IMG-RES-GRUPO'", numMovimientos);
            }

            Cargando(0)
        });



        $('#btnLimpiarBusqueda').on('click', () => {
            Imagenologia.Limpiar();
            Imagenologia.CargaInicial();
        });

        /*=========================REGISTRO DE RESULTADOS===========================================*/
        $(document).on("keyup", ".campoResultado", function (e) {
            if (e.which == 13) {
                e.preventDefault();
                let focused = $(':focus');
                // Encontrar el siguiente elemento que puede recibir foco
                let next = $('input').eq($('input').index(focused) + 1);
                // Pasar el foco al siguiente elemento
                next.focus();
            }
        });


        // Función para abrir el Chosen manualmente
        $.fn.extend({
            openChosen: function () {
                $(this).trigger("mousedown"); // Simula un clic para abrir el select de Chosen
            }
        });

        $(document).on("keyup", ".campoRes, .chosen-container", function (e) {
            if (e.which == 13) {
                e.preventDefault();
                let focused = $(':focus');

                let focusableElements = $('input, select.chzn-select');

                let index = focusableElements.index(focused);
                let next = focusableElements.eq(index + 1);

                if (next.length) {
                    // Si el siguiente campo es un Chosen, abrirlo correctamente y detener el foco
                    if (next.hasClass('chzn-select')) {
                        next.next('.chosen-container').find('a.chosen-single').trigger("mousedown");
                        return false; // Evita que el foco pase al siguiente campo
                    } else {
                        next.focus();
                    }
                }
            }
        });

        $('#btnSubirArchivoLab').on('click', () => {
            $('#archivoLab').click();
        });

        $('#archivoLab').change(function () {
            let archivo = $(this).val(); // Obtener el valor del input file (la ruta del archivo)

            if (archivo) {
                $('#txtNombreArchivo').val("ARCHIVO CARGADO");
            } else {
                $('#txtNombreArchivo').val('SIN ARCHIVO');
            }
        });

        $('#btnGuardarResultado').on('click', async () => {
            Cargando(1);
            valida = Imagenologia.ValidarDatosObligatoriosResultados();
            if (valida) {
                let res = false;
                if (isEmpty(Imagenologia.tipoFormulario)) {
                    res = await Imagenologia.GuardarResultado();
                } else {
                    res = await Imagenologia.GuardarResultadoPersonalizado();
                }

                if (res) {

                    try {
                        let datosCita = oTable_ListaOrdenes.api(true).row('.selected').data()

                        if (!isEmpty(datosCita.idReferencia)) {

                            let fechaAtencion = datosCita.fechaCita; // '13/01/2025'
                            let horaAtencion = datosCita.horaCita; // '13/01/2025'

                            // Convertir la fecha a formato yyyy-MM-dd
                            let partes = fechaAtencion.split('/'); // Divide por el separador '/'
                            let fechaConvertida = `${partes[2]}-${partes[1]}-${partes[0]}`; // Reorganiza como yyyy-MM-dd


                            await AtencionMedica.GenerarPacienteRecibido(fechaConvertida, horaAtencion)
                            //await AtencionMedica.RecibirReferenciaPaciente(fechaConvertida, $('#txtHoraCia').val())
                        }
                    }
                    catch (e) {
                        console.log(e)
                    }

                    await Imagenologia.ListarDetalleOrden();
                    $("#PanelResultadosImg").hide();
                    $("#PanelResultadosPersonalizadosImg").hide();
                    $("#PanelResultadosPersonalizadosImg").html("");
                    $("#modalImgResultado").modal("hide");
                }
            }
            Cargando(0);
        });

        /*===============================================================================================*/

        /*===============================BUSQUEDA DE PRODUCTOS==============================================*/
        $('#tblProductosBuscados tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblProductosBuscados tbody').on('dblclick', 'tr', function () {
            $(this).removeClass('selected');
            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();
            Imagenologia.AgregarProducto(objrowTb);

            //console.log(objrowTb);
        });

        $('#btnAgregaProducto').on('click', async function () {
            let objrowTb = oTable_ProductosBuscados.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Imagenologia.AgregarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para agregar.");
            }
        });

        $('#btnQuitarProducto').on('click', async function () {
            let objrowTb = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Imagenologia.QuitarProducto(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un producto para eliminar.");
            }
        });
        $('#txtCodigoProductoBusqueda').on("keyup", async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                if (ImgMovimiento.idTipoFinanciamiento > 0 && (ImgMovimiento.idPaciente > 0 || ImgMovimiento.idComprobantePago > 0)) {
                    $("#txtNombreProductoBusqueda").val("");
                    let busqueda = $("#txtCodigoProductoBusqueda").val().trim();
                    await Imagenologia.ListarProductosBuscados('C', busqueda, $("#cboMovPlan").val(), Imagenologia.idPuntoCarga, 1);
                } else {
                    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                }
            }
        });

        $('#txtNombreProductoBusqueda').on("keyup", async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                if (ImgMovimiento.idTipoFinanciamiento > 0 && (ImgMovimiento.idPaciente > 0 || ImgMovimiento.idComprobantePago > 0)) {
                    $("#txtCodigoProductoBusqueda").val("");
                    let busqueda = $("#txtNombreProductoBusqueda").val().trim();
                    await Imagenologia.ListarProductosBuscados('N', busqueda, $("#cboMovPlan").val(), Imagenologia.idPuntoCarga, 1);
                } else {
                    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                }
            }
        });

        $(document).on('keyup', function (e) {
            let indice = 0;
            let selectedRow = null;


            if (e.keyCode === 121) {
                e.preventDefault();
                $("#txtNombreProductoBusqueda").focus();
            }

            //if (e.keyCode === 38) {
            //    e.preventDefault();
            //    if ($("#frameResultadosBusquedaProductos").is(":visible")) {
            //        selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
            //        indice = selectedRow.index()
            //        if (isEmpty(indice) == false) {
            //            indice = indice - 1;
            //        } else {
            //            indice = 0;
            //        }

            //        if (indice >= 0) {
            //            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            //            $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //        }
            //    }
            //}

            //if (e.keyCode === 40) {
            //    e.preventDefault();
            //    if ($("#frameResultadosBusquedaProductos").is(":visible")) {
            //        selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
            //        indice = selectedRow.index()
            //        if (isEmpty(indice) == false) {
            //            indice = indice + 1;
            //        } else {
            //            indice = 0;
            //        }

            //        if (indice >= 0) {
            //            oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
            //            $('#tblProductosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
            //        }
            //    }
            //}

            if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                let selectedRow = oTable_ProductosBuscados.api(true).row('.selected');
                let indice = selectedRow.index();

                if (!isEmpty(indice)) {
                    indice = e.keyCode === 38 ? indice - 1 : indice + 1;
                } else {
                    indice = 0;
                }

                if (indice >= 0) {
                    oTable_ProductosBuscados.$('tr.selected').removeClass('selected');
                    let newRow = $('#tblProductosBuscados tbody tr:eq(' + indice + ')');
                    newRow.addClass('selected');

                    // Desplazar el scroll para que la fila sea visible
                    newRow[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }

            if (e.which == 13) {
                e.preventDefault();
                if ($("#frameResultadosBusquedaProductos").is(":visible")) {
                    $("#btnAgregaProducto").click();
                }
            }

        });
        /*===============================================================================================*/

        /*=================================BUSQUEDA DE INSUMOS===============================================*/
        $('#tblInsumosBuscados tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_InsumosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        $('#tblInsumosBuscados tbody').on('dblclick', 'tr', function () {
            $(this).removeClass('selected');
            oTable_InsumosBuscados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrowTb = oTable_InsumosBuscados.api(true).row('.selected').data();
            Imagenologia.AgregarInsumo(objrowTb);

            //console.log(objrowTb);
        });

        $('#btnAgregaInsumo').on('click', async function () {
            let objrowTb = oTable_InsumosBuscados.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Imagenologia.AgregarInsumo(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un insumo para agregar.");
            }
        });

        $('#btnQuitarInsumo').on('click', async function () {
            let objrowTb = oTable_ImgMovDetalleInsumos.api(true).row('.selected').data();

            if (isEmpty(objrowTb) == false) {
                Imagenologia.QuitarInsumo(objrowTb);
            } else {
                alerta2("info", "", "Por favor seleccione un insumo para eliminar.");
            }
        });

        $('#txtCodigoInsumoBusqueda').on("keyup", async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                if (ImgMovimiento.idTipoFinanciamiento > 0 && (ImgMovimiento.idPaciente > 0 || ImgMovimiento.idComprobantePago > 0)) {
                    $("#txtNombreInsumoBusqueda").val("");
                    let busqueda = $("#txtCodigoInsumoBusqueda").val().trim();
                    await Imagenologia.ListarInsumosBuscados('C', busqueda, $("#cboMovPlan").val(), Imagenologia.idPuntoCarga, '0');
                } else {
                    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                }
            }
        });

        $('#txtNombreInsumoBusqueda').on("keyup", async function (event) {
            if (event.keyCode != 121 && event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40 && event.keyCode != 13) {
                event.preventDefault();
                if (ImgMovimiento.idTipoFinanciamiento > 0 && (ImgMovimiento.idPaciente > 0 || ImgMovimiento.idComprobantePago > 0)) {
                    $("#txtCodigoInsumoBusqueda").val("");
                    let busqueda = $("#txtNombreInsumoBusqueda").val().trim();
                    await Imagenologia.ListarInsumosBuscados('N', busqueda, $("#cboMovPlan").val(), Imagenologia.idPuntoCarga, '0');
                } else {
                    alerta2("info", "", "Por favor, primero seleccione un paciente.");
                }
            }
        });

        $(document).on('keyup', function (e) {
            let indice = 0;
            let selectedRow = null;


            if (e.keyCode === 122) {
                e.preventDefault();
                $("#txtNombreInsumoBusqueda").focus();
            }

            if (e.keyCode === 38) {
                e.preventDefault();
                if ($("#frameResultadosBusquedaInsumos").is(":visible")) {
                    selectedRow = oTable_InsumosBuscados.api(true).row('.selected');
                    indice = selectedRow.index()
                    if (isEmpty(indice) == false) {
                        indice = indice - 1;
                    } else {
                        indice = 0;
                    }

                    if (indice >= 0) {
                        oTable_InsumosBuscados.$('tr.selected').removeClass('selected');
                        $('#tblInsumosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
                    }
                }
            }

            if (e.keyCode === 40) {
                e.preventDefault();
                if ($("#frameResultadosBusquedaInsumos").is(":visible")) {
                    selectedRow = oTable_InsumosBuscados.api(true).row('.selected');
                    indice = selectedRow.index()
                    if (isEmpty(indice) == false) {
                        indice = indice + 1;
                    } else {
                        indice = 0;
                    }

                    if (indice >= 0) {
                        oTable_InsumosBuscados.$('tr.selected').removeClass('selected');
                        $('#tblInsumosBuscados tbody tr:eq(' + indice + ')').addClass('selected');
                    }
                }
            }

            if (e.which == 13) {
                e.preventDefault();
                if ($("#frameResultadosBusquedaInsumos").is(":visible")) {
                    $("#btnAgregaInsumo").click();
                }
            }

        });

        /*=====================================================================================================*/

        /*==================BLOQUEAR EVENTOS DE TECLAS EN NAVEGADOR==========================================*/
        $(document).on('keydown', function (e) {
            if (e.keyCode === 121 || e.keyCode === 122) { // 121 es el keyCode de F10, 122 es el F11
                e.preventDefault(); // Prevenir el comportamiento predeterminado del navegador
            }
        })
        /*===================================================================================================*/

        /*===============================REGISTRO DE MOVIMIENTOS==============================================*/

        /*------------BUSQUEDA DE CUENTAS----------------------------------*/
        $('#txtMovNroCuenta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtMovNroCuenta").blur();
                let nroCuenta = $('#txtMovNroCuenta').val();
                Imagenologia.LimpiarCamposMovimiento();
                await Imagenologia.BuscarNumeroCuenta(nroCuenta);
            }
        });

        $('#btnAceptarCAPaciente').on('click', async function () {
            let cuenta = oTable_CuentasAtencionesPacientes.api(true).row('.selected').data();
            if (isEmpty(cuenta)) {
                alerta2("info", "", "Seleccione un registro por favor.");
            } else {
                if (cuenta.idEstado != 1) {
                    alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
                    return;
                }
                $(".searchCAPaciente").val("");
                oTable_BusquedaCAPacientes.fnClearTable();
                oTable_CuentasAtencionesPacientes.fnClearTable();
                $("#modalBusquedaCuentasAtenciones").modal("hide");
                Imagenologia.LimpiarCamposMovimiento();
                await Imagenologia.BuscarNumeroCuenta(cuenta.idCuentaAtencion);
            }

        });

        /*------------BUSQUEDA DE RECETAS----------------------------------*/
        $('#txtMovNroReceta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtMovNroReceta").blur();
                let nroReceta = $('#txtMovNroReceta').val();
                if (isEmpty(nroReceta) == false) {
                    Imagenologia.LimpiarCamposMovimiento();
                    await Imagenologia.BuscarNumeroReceta(nroReceta);
                }

            }
        });

        $('#btnAceptarRecetaPaciente').on('click', async function () {
            let receta = oTable_BusquedaRecetasPacientes.api(true).row('.selected').data();
            if (isEmpty(receta)) {
                alerta2("info", "", "Seleccione un registro por favor.");
            } else {
                if (receta.idEstadoAtencion != 1) {
                    alerta2("info", "", "La cuenta seleccionada NO se encuentra ABIERTA.");
                    return;
                }
                $(".searchRecetaPaciente").val("");
                BusqRecetasPacientes.CargarFechaHoy();
                oTable_BusquedaRecetasPacientes.fnClearTable();
                $("#modalBusquedaRecetas").modal("hide");
                Imagenologia.LimpiarCamposMovimiento();
                await Imagenologia.BuscarNumeroReceta(receta.idReceta);
            }

        });
        /*-----------------------------------------------------------------*/


        /*------------BUSQUEDA COMPROBANTE PAGO----------------------------------*/
        $('#txtMovNroCorrelativoBoleta , #txtMovNroDocumentoBoleta').keypress(async function (e) {
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                let nroSerie = $('#txtMovNroCorrelativoBoleta').val();
                let nroDocumento = $('#txtMovNroDocumentoBoleta').val();
                if (isEmpty(nroSerie) == false && isEmpty(nroDocumento) == false) {
                    Imagenologia.LimpiarCamposMovimiento();
                    await Imagenologia.BuscarComprobantePago(nroSerie, nroDocumento, Imagenologia.idPuntoCarga);
                }

            }
        });
        /*-----------------------------------------------------------------*/

        /*-----------------------------DATOS PACIENTE------------------------------------------------*/
        $('#txtMovFechaNacimiento').change(function () {
            if (isEmpty($('#txtMovFechaNacimiento').val()) == false) {
                let edad = CalcularEdadAnioMesDia($('#txtMovFechaNacimiento').val())
                $('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
            }
        });
        /*-----------------------------------------------------------------------------*/

        $('#btnGuardarMovimiento').on('click', async function () {

            await Imagenologia.GuardarMovimiento();

        });

        /*-----------------------------DETALLE DE PRODUCTOS---------------------------------------------------------*/
        $('#tblImgMovDetalleProductos tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_ImgMovDetalleProductos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });

        $(document).on("keyup", ".dCantImgMov", function () {
            let idElement = $(this).prop("id");
            let idProducto = idElement.split("_")
            let cantidad = parseInt($("#" + idElement).val());
            let precio = parseFloat($("#htmlPrecioImgMov_" + idProducto[1]).html());
            let total = parseFloat((cantidad * precio).toFixed(3));
            $("#htmlSubTotalImgMov_" + idProducto[1]).html(total);
            Imagenologia.Totalizar();
        });
        /*-----------------------------------------------------------------------------------------------------*/

        /*-----------------------------DETALLE DE INSUMOS---------------------------------------------------------*/
        $(document).on('click', '.dInsumosImgProd', function (e) {
            $("#frameResultadosBusquedaProductos").hide();

            let objMov = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();
            if (isEmpty(objMov)) {
                alerta2("info", "", "Por favor seleccione un registro.");
                return;
            }

            $("#InsumoProductoImg").html("(" + objMov.codigo + ") " + objMov.nombre);
            Imagenologia.CargarDetalleInsumoMovimiento();
            Imagenologia.modoCargaInsumo = 1;       //POR PRODUCTO
            $("#modalImgInsumos").modal("show");
        });

        $('#btnInsumosImgMov').on('click', async function () {
            $("#frameResultadosBusquedaProductos").hide();

            let objMov = oTable_ImgMovDetalleProductos.api(true).data();
            if (objMov.length == 0) {
                alerta2("info", "", "Por favor primero agregue los examenes a registrar.");
                return;
            }
            oTable_ImgMovDetalleInsumos.fnClearTable();
            $("#InsumoProductoImg").html("Todos");
            Imagenologia.modoCargaInsumo = 2;           //TOTAL
            $("#modalImgInsumos").modal("show");
        });

        $('#btnAgregarInsumos').on('click', async function () {
            $("#frameResultadosBusquedaInsumos").hide();
            if (Imagenologia.modoCargaInsumo == 1) {
                Imagenologia.AgregarDetalleInsumosPorProducto();
            }

            if (Imagenologia.modoCargaInsumo == 2) {
                Imagenologia.AgregarDetalleInsumosPorMovimiento();
            }

            oTable_ImgMovDetalleInsumos.fnClearTable();
            $('#modalImgInsumos').modal('hide');
        });

        $('#btnCancelarInsumos').on('click', async function () {
            $("#frameResultadosBusquedaInsumos").hide();
            $('#modalImgInsumos').modal('hide');
        });

        $('#tblImgMovDetalleInsumos tbody').on('click', 'tr', function () {
            $(this).removeClass('selected');
            oTable_ImgMovDetalleInsumos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

        });


        //$(document).on("keyup", ".dCantImgMov", function () {
        //    let idElement = $(this).prop("id");
        //    let idProducto = idElement.split("_")
        //    let cantidad = parseInt($("#" + idElement).val());
        //    let precio = parseFloat($("#htmlPrecioImgMov_" + idProducto[1]).html());
        //    let total = parseFloat((cantidad * precio).toFixed(3));
        //    $("#htmlSubTotalImgMov_" + idProducto[1]).html(total);
        //    Imagenologia.Totalizar();
        //});
        /*-----------------------------------------------------------------------------------------------------*/

        /*====================================================================================================*/


        /*====================CAlCULO FPP Y EG====================================================*/
        $("#txtMovFechaFUR").on('change', async function () {
            let valor = $(this).val();

            await Imagenologia.MovCalcularEdadGestacional(valor);

        });
        /*===========================================================================================*/


    },

    async MovCalcularEdadGestacional(fecha) {
        $("#txtMovFechaFPP").val("");
        $("#txtMovEdadGestSem").val("");
        $("#txtMovEdadGestDias").val("");
        if (isEmpty(fecha) == false) {
            if (esFormatoFecha(fecha)) {
                let fechaHoraHoy = await Utilitario.FechaHoraServidor();
                let fechaRegistro = isNull($("#txtMovFechaRegistroMovimiento").val(), fechaHoraHoy);
                fechaRegistro = fechaRegistro.substring(0, 10);

                let edadGest = Utilitario.CalcularEdadGestacional(fechaRegistro, fecha, "", "", 1);
                $("#txtMovFechaFPP").datepicker("setDate", edadGest.fpp);
                $("#txtMovEdadGestSem").val(edadGest.cantSemanas);
                $("#txtMovEdadGestDias").val(edadGest.cantDias);

            }
        }
    },

    /*---------------------------------------------BUSQUEDA DE PRODUCTOS------------------------------------------------------*/
    async ListarProductosBuscados(tipoBusqueda, busqueda, idTipoFinanciamiento, idPuntoCarga, tipoServicioOfrecido) {
        resp = null;
        let filtroBusqueda = "";
        let midata = new FormData();

        try {
            oTable_ProductosBuscados.fnClearTable();
            if (busqueda.length >= 2 && idTipoFinanciamiento > 0) {
                if (idPuntoCarga != 1 && idPuntoCarga != 99) {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosPtos.idPuntoCarga = " + idPuntoCarga
                }

                if (idTipoFinanciamiento != 0) {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosHosp.idTipoFinanciamiento = " + idTipoFinanciamiento
                }

                if (tipoServicioOfrecido != 0) {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.EsCPT = " + tipoServicioOfrecido
                }

                if (busqueda != "") {
                    if (tipoBusqueda == "C") {      //C: busqeuda por codigo
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Codigo like '" + busqueda + "%' "
                    } else if (tipoBusqueda == "N") {       //N: busqeuda por nombre
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Nombre like '%" + busqueda + "%' "
                    }
                }

                //midata.append('lnIdAlmacen', $('#cboFarmaciaDestinoNI').val());
                midata.append('lcFiltro', filtroBusqueda);

                Cargando(1);
                $("#frameResultadosBusquedaProductos").show();
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/ImagenologiaMovimiento/FactCatalogoServiciosSeleccionarServiciosLike?area=Imagenes",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (datos.lstData.table.length > 0) {
                    oTable_ProductosBuscados.fnAddData(datos.lstData.table);
                    oTable_ProductosBuscados.resize();
                    //resp = datos.lstData.table[0];

                    if (!isElementFullVisible(document.getElementById('frameResultadosBusquedaProductos'))) {
                        //console.log("El div NOOOOO es completamente visible y necesita scroll.");
                        smoothScrollToContent($('#frameResultadosBusquedaProductos'));
                    }

                }
            } else {
                $("#frameResultadosBusquedaProductos").hide();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", error.toString());
        }
        //return resp;
    },

    QuitarProducto() {
        let objDetalleProd = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();
        oTable_ImgMovDetalleProductos.api(true).row('.selected').remove().draw(false);
        oTable_ImgMovDetalleProductos.resize();

        let nuevoDetalleInsumos = ImgMovimiento.detalleInsumos.filter(obj => obj.idProductoCPT != objDetalleProd.idProducto);
        ImgMovimiento.detalleInsumos = nuevoDetalleInsumos;

        Imagenologia.Totalizar();
    },

    AgregarProducto(examen) {
        oTable_ProductosBuscados.fnClearTable();
        $("#txtCodigoProductoBusqueda").val("")
        $("#txtNombreProductoBusqueda").val("")
        $("#frameResultadosBusquedaProductos").hide();

        if (Imagenologia.ItemYaExiste(examen.idProducto) == false) {
            examen.nombre = examen.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');
            //producto.precioUnitario = await NotaIngreso.DevuelvePrecioSegunTipoConcepto(producto.idProducto, NotaIngreso.tipoPrecioParaNiNs);

            //NotaIngreso.indexDetalle = NotaIngreso.indexDetalle + 1;
            //producto.index = NotaIngreso.indexDetalle;

            oTable_ImgMovDetalleProductos.fnAddData(examen);
            oTable_ImgMovDetalleProductos.resize();

            Imagenologia.Totalizar();
        }

    },

    ItemYaExiste(idProducto) {
        resp = false;
        let lstDetalleLabMov = Imagenologia.DevolverDetalleMovimiento();
        lstDetalleLabMov.forEach(function (detalle) {
            if (detalle.idProductoCPT == idProducto) {
                resp = true;
                alerta2("info", "", "Este examen ya se encuentra registrado.");
            }
        });

        return resp;
    },

    Totalizar() {
        let lstDetalleLabMov = Imagenologia.DevolverDetalleMovimiento();
        let total = 0.00;
        lstDetalleLabMov.forEach(function (detalle) {
            total = parseFloat(total) + parseFloat((detalle.importe));
        });

        $("#TotalDetalleImgMov").html("S/. " + parseFloat(total).toFixed(2));
    },

    DevolverDetalleMovimiento() {
        let detalleLabMov = [];
        let objItemDetalle = null;
        let lstDetalleLabMov = oTable_ImgMovDetalleProductos.api(true).data().toArray();

        for (let [i, obj] of lstDetalleLabMov.entries()) {

            objItemDetalle = {
                index: obj.index,               //para controlar cada fila como unica
                idProductoCPT: obj.idProducto,
                idPuntoCarga: obj.idPuntoCarga,
                cantidad: parseInt($('#txtCantImgMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val()),
                precio: obj.precioUnitario,
                importe: parseFloat(obj.precioUnitario * parseInt($('#txtCantImgMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val())).toFixed(3),
                totalPorPagar: parseFloat(obj.precioUnitario * parseInt($('#txtCantImgMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val())).toFixed(3),
                total: parseFloat(obj.precioUnitario * parseInt($('#txtCantImgMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val())).toFixed(3),
                labConfHIS: '',
                grupoHIS: 0,
                subgrupoHIS: 0,
                observaciones: '',
                seUsaSinPrecio: obj.seUsaSinPrecio
            }

            detalleLabMov.push(objItemDetalle);

        }

        return detalleLabMov;
    },


    ValidarDetalleMovimiento() {
        let cantidad = 0;
        let idPuntoCarga = 0;
        let lstDetalleLabMov = oTable_ImgMovDetalleProductos.api(true).data().toArray();

        for (let [i, obj] of lstDetalleLabMov.entries()) {
            cantidad = parseInt($('#txtCantImgMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val());
            //idPuntoCarga = parseInt($('#txtIdPtoCargaLabMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val());

            if (cantidad <= 0) {
                alerta2("info", "", "El examen " + obj.nombre + " tiene problemas con la cantidad.");
                return false;
            }

            if (obj.seUsaSinPrecio == false) {
                if (obj.precioUnitario <= 0) {
                    alerta2("info", "", "El examen " + obj.nombre + " tiene problemas con el precio.");
                    return false;
                }
            }

            if (obj.idPuntoCarga != Imagenologia.idPuntoCarga) {
                alerta2("info", "", "Los examenes a realizar no pertenecen a " + Imagenologia.puntoCarga + ".");
                Imagenologia.LimpiarCamposMovimiento();
                return false;
            }

        }

        return true;
    },

    /*-------------------------------------------------------------------------------------------------------------------------------------*/

    /*---------------------------------------------BUSQUEDA DE INSUMOS------------------------------------------------------*/
    async ListarInsumosBuscados(tipoBusqueda, busqueda, idTipoFinanciamiento, idPuntoCarga, tipoServicioOfrecido) {
        resp = null;
        let filtroBusqueda = "";
        let midata = new FormData();

        try {
            oTable_InsumosBuscados.fnClearTable();
            if (busqueda.length >= 3 && idTipoFinanciamiento > 0) {
                if (idPuntoCarga != 1 && idPuntoCarga != 99) {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosPtos.idPuntoCarga = " + idPuntoCarga
                }

                //if (idTipoFinanciamiento != 0) {
                //    filtroBusqueda = filtroBusqueda + " and FactCatalogoServiciosHosp.idTipoFinanciamiento = " + idTipoFinanciamiento
                //}

                if (tipoServicioOfrecido != "") {
                    filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.EsCPT = " + tipoServicioOfrecido
                }

                if (busqueda != "") {
                    if (tipoBusqueda == "C") {      //C: busqeuda por codigo
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Codigo like '" + busqueda + "%' "
                    } else if (tipoBusqueda == "N") {       //N: busqeuda por nombre
                        filtroBusqueda = filtroBusqueda + " and FactCatalogoServicios.Nombre like '%" + busqueda + "%' "
                    }
                }

                //midata.append('lnIdAlmacen', $('#cboFarmaciaDestinoNI').val());
                midata.append('lcFiltro', filtroBusqueda);

                Cargando(1);
                $("#frameResultadosBusquedaInsumos").show();
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/ImagenologiaMovimiento/FactCatalogoServiciosSeleccionarServiciosLike?area=Imagenes",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });
                Cargando(0);
                if (datos.lstData.table.length > 0) {
                    oTable_InsumosBuscados.fnAddData(datos.lstData.table);
                    oTable_InsumosBuscados.resize();
                    //resp = datos.lstData.table[0];
                }
            } else {
                $("#frameResultadosBusquedaInsumos").hide();
            }
        } catch (error) {
            Cargando(0);
            alerta2("error", "", error.toString());
        }
        //return resp;
    },

    QuitarInsumo() {
        oTable_ImgMovDetalleInsumos.api(true).row('.selected').remove().draw(false);
        oTable_ImgMovDetalleInsumos.resize();

        Imagenologia.Totalizar();
    },

    AgregarInsumo(insumo) {
        oTable_InsumosBuscados.fnClearTable();
        $("#txtCodigoInsumoBusqueda").val("")
        $("#txtNombreInsumoBusqueda").val("")
        $("#frameResultadosBusquedaInsumos").hide();

        if (Imagenologia.modoCargaInsumo == 1) {
            let objDetalleProd = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();
            if (isEmpty(objDetalleProd)) {
                alerta2("info", "", "Seleccione un examen.");
            }

            if (Imagenologia.InsumoYaExiste(insumo.idProducto) == false) {
                insumo.idProductoCPT = objDetalleProd.idProducto;
                insumo.nombreCPT = objDetalleProd.nombre;
                insumo.nombre = insumo.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');

                oTable_ImgMovDetalleInsumos.fnAddData(insumo);
                oTable_ImgMovDetalleInsumos.resize();
            }
        }

        if (Imagenologia.modoCargaInsumo == 2) {
            if (Imagenologia.InsumoYaExiste(insumo.idProducto) == false) {
                insumo.idProductoCPT = 0;
                insumo.nombreCPT = "";
                insumo.nombre = insumo.nombre.replace(/</g, '(').replace(/>/g, ')').replace(/(\r\n|\n|\r)/g, '');

                oTable_ImgMovDetalleInsumos.fnAddData(insumo);
                oTable_ImgMovDetalleInsumos.resize();
            }
        }

    },

    InsumoYaExiste(idProducto) {
        resp = false;
        let lstDetalleImgIns = Imagenologia.DevolverDetalleInsumo();
        lstDetalleImgIns.forEach(function (detalle) {
            if (detalle.idProducto == idProducto) {
                resp = true;
                alerta2("info", "", "Este insumo ya se encuentra registrado.");
            }
        });

        return resp;
    },

    DevolverDetalleInsumo() {
        let detalleInsuMov = [];
        let objItemDetalle = null;
        let lstDetalleImgIns = oTable_ImgMovDetalleInsumos.api(true).data().toArray();

        for (let [i, obj] of lstDetalleImgIns.entries()) {

            objItemDetalle = {
                index: 0,               //para controlar cada fila como unica
                idProductoCPT: obj.idProductoCPT,
                nombreCPT: obj.nombreCPT,
                codigo: obj.codigo,
                idProducto: obj.idProducto,
                nombre: obj.nombre,
                cantidadTomada: parseInt($('#txtCantTomadaImgInsMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val()),
                cantidadTFallada: parseInt($('#txtCantFalladaImgInsMov_' + obj.idProducto + "[data-fila='" + obj.index + "']").val())
            }

            detalleInsuMov.push(objItemDetalle);

        }

        return detalleInsuMov;
    },

    DevolverDetalleInsumosMovimiento() {
        let detalleInsuMov = [];
        let objItemDetalle = null;
        let lstDetalleProductos = oTable_ImgMovDetalleProductos.api(true).data().toArray();
        let lstDetalleImgIns = oTable_ImgMovDetalleInsumos.api(true).data().toArray();

        for (let [i, objProd] of lstDetalleProductos.entries()) {
            for (let [i, objIns] of lstDetalleImgIns.entries()) {
                objItemDetalle = {
                    index: 0,               //para controlar cada fila como unica
                    idProductoCPT: objProd.idProducto,
                    nombreCPT: objProd.nombre,
                    codigo: objIns.codigo,
                    idProducto: objIns.idProducto,
                    nombre: objIns.nombre,
                    cantidadTomada: parseInt($('#txtCantTomadaImgInsMov_' + objIns.idProducto + "[data-fila='" + objIns.index + "']").val()),
                    cantidadTFalladas: parseInt($('#txtCantFalladaImgInsMov_' + objIns.idProducto + "[data-fila='" + objIns.index + "']").val())
                }

                detalleInsuMov.push(objItemDetalle);

            }
        }

        return detalleInsuMov;
    },

    AgregarDetalleInsumosPorProducto() {
        let lstDetalleImgIns = Imagenologia.DevolverDetalleInsumo();
        //let detalleInsuMov = ImgMovimiento.detalleInsumos.toArray();
        let objDetalleProd = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();
        if (lstDetalleImgIns.length > 0) {
            if (isEmpty(objDetalleProd)) {
                alerta2("info", "", "Seleccione un examen.");
            }


            if (isEmpty(ImgMovimiento.detalleInsumos)) {
                ImgMovimiento.detalleInsumos = [];
            }

            let nuevoDetalleInsumos = ImgMovimiento.detalleInsumos.filter(obj => obj.idProductoCPT != objDetalleProd.idProducto);

            ImgMovimiento.detalleInsumos = nuevoDetalleInsumos;
            ImgMovimiento.detalleInsumos.push(lstDetalleImgIns[0]);

            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).removeClass("btn-secondary");
            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).addClass("btn-indigo");
            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).html('<i class="fa fa-check"></i>');
        } else {
            let nuevoDetalleInsumos = ImgMovimiento.detalleInsumos.filter(obj => obj.idProductoCPT != objDetalleProd.idProducto);

            ImgMovimiento.detalleInsumos = nuevoDetalleInsumos;

            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).removeClass("btn-indigo");
            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).addClass("btn-secondary");
            $("#htmlInsumosImgMov_" + objDetalleProd.idProducto).html('<i class="fa fa-plus"></i>');
        }

        //return detalleInsuMov;
    },

    AgregarDetalleInsumosPorMovimiento() {
        let lstDetalleImgIns = Imagenologia.DevolverDetalleInsumosMovimiento();
        //let objDetalleProd = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();

        if (lstDetalleImgIns.length > 0) {
            ImgMovimiento.detalleInsumos = [];
            ImgMovimiento.detalleInsumos = lstDetalleImgIns;

            $(".dInsumosImgProd").removeClass("btn-secondary");
            $(".dInsumosImgProd").addClass("btn-indigo");
            $(".dInsumosImgProd").html('<i class="fa fa-check"></i>');
        } /*else {
            $(".dInsumosImgProd").removeClass("btn-indigo");
            $(".dInsumosImgProd").addClass("btn-secondary");
            $(".dInsumosImgProd").html('<i class="fa fa-plus"></i>');
        }*/

        //return detalleInsuMov;
    },

    CargarDetalleInsumoMovimiento() {
        let objDetalleProd = oTable_ImgMovDetalleProductos.api(true).row('.selected').data();
        if (isEmpty(objDetalleProd)) {
            alerta2("info", "", "Seleccione un examen.");
        }

        if (isEmpty(ImgMovimiento.detalleInsumos)) {
            ImgMovimiento.detalleInsumos = [];
        }

        let detalleInsumosCPT = ImgMovimiento.detalleInsumos.filter(obj => obj.idProductoCPT == objDetalleProd.idProducto);

        oTable_ImgMovDetalleInsumos.fnClearTable();
        if (detalleInsumosCPT.length > 0) {
            oTable_ImgMovDetalleInsumos.fnAddData(detalleInsumosCPT);
            oTable_ImgMovDetalleInsumos.resize();
        }

    },


    ValidarDetalleInsumosMovimiento() {
        let resp = true;
        let cantidadTomada = 0;
        let cantidadFallada = 0;
        let detalleInsumosCPT = [];
        let lstDetalleLabMov = oTable_ImgMovDetalleProductos.api(true).data().toArray();

        for (let [i, objProd] of lstDetalleLabMov.entries()) {
            if (resp) {
                detalleInsumosCPT = ImgMovimiento.detalleInsumos.filter(obj => obj.idProductoCPT == objProd.idProducto);

                if (detalleInsumosCPT.length > 0) {
                    for (let [i, objIns] of detalleInsumosCPT.entries()) {
                        if (resp) {
                            cantidadTomada = objIns.cantidadTomada;
                            cantidadFallada = objIns.cantidadFalalda;

                            if (cantidadTomada <= 0) {
                                alerta2("info", "", "El insumo <span class='font-weight-bold'>" + objIns.nombre + "</span> para el examen <span class='font-weight-bold'>" + objIns.nombreCPT + "</span>, tiene problemas con la cantidad tomada.");
                                resp = false;
                            }

                            //if (cantidadFalalda <= 0) {
                            //    alerta2("info", "", "El insumo " + objIns.nombre + " para el examen " + objIns.nombreCPT + ", tiene problemas con la cantidad fallada.");
                            //    resp = false;
                            //}
                        }
                    }
                } else {
                    alerta2("info", "", "El examen <span class='font-weight-bold'>" + objProd.nombre + "</span>, no tiene insumos registrados.");
                    resp = false;
                }
            }

        }

        return resp;
    },

    /*-------------------------------------------------------------------------------------------------------------------------------------*/

    async ListarComprobantesPagoPendientes(idCuentaAtencion) {

        oTable_BoletasPendientesDeUso.fnClearTable()

        let ordenesPagoSinUtilizar = await Utilitario.ListarExamenesImagenologiaByPtoCarga(idCuentaAtencion, Imagenologia.idPuntoCarga) /// modificando
        
        if (!isEmpty(ordenesPagoSinUtilizar) && ordenesPagoSinUtilizar.table.length > 0) {

            let confirmarUsoBoletas = await alertaAsync('warning', 'Atención', '<p style="color: red; font-size: 20px; font-weight: bold;">Existen boletas pendientes en esta cuenta. ¿Desea utilizarlas para registrar el movimiento?<p>')

            if (confirmarUsoBoletas.isConfirmed) {
                oTable_BoletasPendientesDeUso.fnAddData(ordenesPagoSinUtilizar.table)

                $('#modalBoletasPendientesDeUso').modal('show')
            }
        }
    },

    /*------------BUSQUEDA DE CUENTAS----------------------------------*/
    async BuscarNumeroCuenta(idCuentaAtencion) {


        let datos = await Utilitario.AtencionesSelecionarPorCuenta(idCuentaAtencion);
        let dx = await Imagenologia.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(datos.idAtencion, 0);

        if (isEmpty(datos)) {
            return;
        }

        if (datos.idEstadoAtencion != 1) {
            alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
            return;
        }

        if (datos.idTipoServicio == 1) {
            if (datos.idTipoFinanciamiento == 1) {
                alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
                return;
            }
        }

        await this.ListarComprobantesPagoPendientes(idCuentaAtencion)

        ImgMovimiento.idCuentaAtencion = datos.idCuentaAtencion;
        ImgMovimiento.idOrden = 0;
        ImgMovimiento.idPaciente = datos.idPaciente;
        //ImgMovimiento.idReceta = null;
        ImgMovimiento.idTipoFinanciamiento = datos.idTipoFinanciamiento;

        $('#txtMovTipoHistoria').val(datos.tipoNumeracionHistoria);
        $('#txtMovNroHistoria').val(datos.nroHistoriaClinica);
        $('#txtMovApPaterno').val(datos.apellidoPaterno);
        $('#txtMovApMaterno').val(datos.apellidoMaterno);
        $('#txtMovPrimerNombre').val(datos.primerNombre);
        $('#txtMovSegundoNombre').val(datos.segundoNombre);
        let edad = CalcularEdadAnioMesDia(datos.fechaNacimiento)
        $('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
        //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
        $("#txtMovFechaNacimiento").datepicker("setDate", datos.fechaNacimiento);
        $('#txtMovHoraNacimiento').val(datos.horaNacimiento);
        $('#cboMovSexo').val(datos.idTipoSexo);

        if (ImgMovimiento.idPaciente > 0) {
            $("#txtMovFechaNacimiento").attr("disabled", true);
            $("#txtMovHoraNacimiento").attr("disabled", true);
            $("#cboMovSexo").attr("disabled", true);
        } else {
            $("#txtMovFechaNacimiento").removeAttr("disabled");
            $("#txtMovHoraNacimiento").removeAttr("disabled");
            $("#cboMovSexo").removeAttr("disabled");
        }

        $('#txtMovNroCuenta').val(datos.idCuentaAtencion);
        $('#txtMovEstadoCuenta').val("F.Ing: " + datos.fechaIngreso + " - " + datos.tipoServicio);
        $('#txtMovProcedencia').val(datos.servicio);
        $('#cboMovPlan').val(datos.idTipoFinanciamiento);
        $('#txtMovFuenteFinanciamiento').val("IAFA Act.: " + datos.planA);

        if (datos.idCuentaAtencion > 0) {
            $('#cboMovMedicoSolicita_chosen').removeClass("d-none");
            $('#txtMovMedicoSolicita').hide();
        } else {
            $('#cboMovMedicoSolicita_chosen').addClass("d-none");
            $('#txtMovMedicoSolicita').show();
        }

        let esDefinitivo = false;
        let cieDx = '';
        let idDx = 0;

        if (isEmpty(dx) === false) {
            dx.forEach(function (valor) {
                if (esDefinitivo == false) {
                    cieDx = valor.codigoCIE10;
                    idDx = valor.idDiagnostico;
                    if (valor.codigoTipoDiagnostico == "D") {
                        esDefinitivo = true;
                    }
                }
            });
            await Imagenologia.ListaDiagnosticosPorFiltro(isNull(cieDx, ''));
            $('#cboMovDx').val(idDx);

            if (esDefinitivo) {
                $("#chkMovEsDxDefinitivo").prop("checked", true)
            } else {
                $("#chkMovEsDxDefinitivo").prop("checked", false)
            }
        }

        $("#txtMovFechaFUR").datepicker("setDate", datos.fur);
        $("#txtMovFechaFPP").datepicker("setDate", datos.fpp);
        $("#txtMovGesta").val(datos.gesta);
        $("#txtMovParidad1").val(datos.paridad1);
        $("#txtMovParidad2").val(datos.paridad2);
        $("#txtMovParidad3").val(datos.paridad3);
        $("#txtMovParidad4").val(datos.paridad4);
        $("#txtMovEdadGestSem").val(datos.edadGestSem);
        $("#txtMovEdadGestDias").val(datos.edadGestDias);

        $("#frameBusquedaProductos").show();

        await Imagenologia.MovCalcularEdadGestacional($("#txtMovFechaFUR").val());

        await Imagenologia.ValidarUsuarioRegistra();

        $('.chzn-select').chosen().trigger("chosen:updated");

        //console.log(datos);

    },

    /*------------BUSQUEDA DE RECETAS----------------------------------*/
    async BuscarNumeroReceta(idReceta) {

        let datos = await Utilitario.RecetaCabeceraDetalleSeleccionaPorNroReceta(idReceta);
        let cabecera = datos.table[0];
        let detalle = datos.table1;
        let dx = await Imagenologia.ListarDiagnosticosPorAtencionPorNumeroEvaluacion(cabecera.idAtencion, cabecera.nroEvaluacion);

        if (cabecera.idEstadoReceta == 0) {
            alerta2("info", "", "La receta se encuentra anulada");
            return;
        }

        if (cabecera.idEstadoReceta == 2 || (cabecera.idEstadoReceta == 3 && cabecera.idComprobantePago > 0 && isEmpty(cabecera.documentoDespachado) == false)) {
            alerta2("info", "", "La receta se encuentra despachada con <br>Nº Movimiento: " + cabecera.documentoDespachado);
            return;
        }

        if (cabecera.idEstadoAtencion != 1) {
            alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
            return;
        }

        if (cabecera.idPuntoCarga != Imagenologia.idPuntoCarga) {
            alerta2("info", "", "La receta NO pertenece al servicio de " + Imagenologia.puntoCarga);
            return;
        }

        if (cabecera.idTipoServicio == 1) {
            if (cabecera.idTipoFinanciamiento == 1) {
                if (isNull(cabecera.idComprobantePago, 0) == 0) {
                    alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
                    return;
                } else {
                    alerta2("info", "", "La receta solo tiene BOLETA, aún no es ATENDIDA.<br><span class='font-weight-bold'>Nº Cuenta: </span>" + cabecera.idCuentaAtencion + " <span class='font-weight-bold'>Boleta: </span>" + cabecera.comprobantePago);
                    return;
                }
            }
        }

        ImgMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
        ImgMovimiento.idOrden = 0;
        ImgMovimiento.idPaciente = cabecera.idPaciente;
        ImgMovimiento.idReceta = cabecera.idReceta;
        ImgMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

        $('#txtMovTipoHistoria').val(cabecera.tipoNumeracionHistoria);
        $('#txtMovNroHistoria').val(cabecera.nroHistoriaClinica);
        $('#txtMovApPaterno').val(cabecera.apellidoPaterno);
        $('#txtMovApMaterno').val(cabecera.apellidoMaterno);
        $('#txtMovPrimerNombre').val(cabecera.primerNombre);
        $('#txtMovSegundoNombre').val(cabecera.segundoNombre);
        let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento)
        $('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
        //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
        $("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
        $('#txtMovHoraNacimiento').val(cabecera.horaNacimiento);
        $('#cboMovSexo').val(cabecera.idTipoSexo);

        if (ImgMovimiento.idPaciente > 0) {
            $("#txtMovFechaNacimiento").attr("disabled", true);
            $("#txtMovHoraNacimiento").attr("disabled", true);
            $("#cboMovSexo").attr("disabled", true);
        } else {
            $("#txtMovFechaNacimiento").removeAttr("disabled");
            $("#txtMovHoraNacimiento").removeAttr("disabled");
            $("#cboMovSexo").removeAttr("disabled");
        }

        $('#txtMovNroReceta').val(cabecera.idReceta);
        $('#txtMovNroCuenta').val(cabecera.idCuentaAtencion);
        $('#txtMovEstadoCuenta').val("F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio);
        $('#txtMovProcedencia').val(cabecera.servicio);
        $('#cboMovPlan').val(cabecera.idTipoFinanciamiento);
        $('#txtMovFuenteFinanciamiento').val("IAFA Act.: " + cabecera.planA);

        //$('#cboMovMedicoSolicita').val(cabecera.idMedicoSolicita);
        if (cabecera.idReceta > 0 && cabecera.idMedicoSolicita > 0) {
            $('#cboMovMedicoSolicita_chosen').removeClass("d-none");
            $('#cboMovMedicoSolicita').val(cabecera.idMedicoSolicita);
            $('#txtMovMedicoSolicita').hide();
        } else {
            $('#cboMovMedicoSolicita_chosen').addClass("d-none");
            $('#txtMovMedicoSolicita').show();
        }

        let esDefinitivo = false;
        let cieDx = '';
        let idDx = 0;

        if (isEmpty(dx) === false) {
            dx.forEach(function (valor) {
                if (esDefinitivo == false) {
                    cieDx = valor.codigoCIE10;
                    idDx = valor.idDiagnostico;
                    if (valor.codigoTipoDiagnostico == "D") {
                        esDefinitivo = true;
                    }
                }
            });
            await Imagenologia.ListaDiagnosticosPorFiltro(isNull(cieDx, ''));
            $('#cboMovDx').val(idDx);

            if (esDefinitivo) {
                $("#chkMovEsDxDefinitivo").prop("checked", true)
            } else {
                $("#chkMovEsDxDefinitivo").prop("checked", false)
            }
        }

        $("#txtMovFechaFUR").datepicker("setDate", cabecera.fur);
        $("#txtMovFechaFPP").datepicker("setDate", cabecera.fpp);
        $("#txtMovGesta").val(cabecera.gesta);
        $("#txtMovParidad1").val(cabecera.paridad1);
        $("#txtMovParidad2").val(cabecera.paridad2);
        $("#txtMovParidad3").val(cabecera.paridad3);
        $("#txtMovParidad4").val(cabecera.paridad4);
        $("#txtMovEdadGestSem").val(cabecera.edadGestSem);
        $("#txtMovEdadGestDias").val(cabecera.edadGestDias);

        $("#frameBusquedaProductos").show();

        await Imagenologia.MovCalcularEdadGestacional($("#txtMovFechaFUR").val());

        await Imagenologia.ValidarUsuarioRegistra();

        $('.chzn-select').chosen().trigger("chosen:updated");

        oTable_ImgMovDetalleProductos.fnAddData(detalle);
        Imagenologia.Totalizar();

        //console.log(cabecera);
        //console.log(detalle);

    },


    /*------------BUSQUEDA DE COMPROBANTE PAGO----------------------------------*/
    async BuscarComprobantePago(nroSerie, nroDocumento, idPuntoCarga) {

        let datos = await Utilitario.RecetaCabeceraDetalleSeleccionaPorComprobantePago(nroSerie, nroDocumento, idPuntoCarga);
        let cabecera = datos.table[0];
        let detalle = datos.table1;

        if (cabecera.idEstadoComprobante != 4) {
            alerta2("info", "", "El comprobante se encuentra anulada");
            return;
        }

        if (cabecera.idMovimientoImg > 0) {
            alerta2("info", "", "El comprobante se encuentra despachado con <br>Nº Movimiento: " + cabecera.idMovimientoImg);
            return;
        }

        //if (cabecera.idEstadoReceta == 2 || (cabecera.idEstadoReceta == 3 && cabecera.idComprobantePago > 0 && isEmpty(cabecera.documentoDespachado) == false)) {
        //    alerta2("info", "", "La receta se encuentra despachada con <br>Nº Movimiento: " + cabecera.documentoDespachado);
        //    return;
        //}

        //if (cabecera.idCuentaAtencion > 0) {
        //    if (cabecera.idEstadoAtencion != 1) {
        //        alerta2("info", "", "El estado de la cuenta NO se encuentra ABIERTA");
        //        return;
        //    }
        //}


        //if (cabecera.idPuntoCarga != Imagenologia.idPuntoCarga) {
        //    alerta2("info", "", "La receta NO pertenece al servicio de " + Imagenologia.puntoCarga);
        //    return;
        //}

        //if (cabecera.idTipoServicio == 1 && isNull(cabecera.idComprobantePago, 0) == 0) {
        //    alerta2("info", "", "Es un paciente PAGANTE y viene por CONSULTORIO EXTERNO. Debe de pagar antes en caja.");
        //    return;
        //} else {
        //    alerta2("info", "", "La receta solo tiene BOLETA, aún no es ATENDIDA.<br><span class='font-weight-bold'>Nº Cuenta: </span>" + cabecera.idCuentaAtencion + " <span class='font-weight-bold'>Boleta: </span>" + cabecera.comprobantePago);
        //    return;
        //}

        ImgMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
        ImgMovimiento.idOrden = cabecera.idOrden;
        ImgMovimiento.idComprobantePago = cabecera.idComprobantePago;
        ImgMovimiento.idOrdenPago = cabecera.idOrdenPago;
        ImgMovimiento.idPaciente = cabecera.idPaciente;
        ImgMovimiento.idReceta = cabecera.idReceta;
        ImgMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

        $('#txtMovTipoHistoria').val(cabecera.tipoNumeracionHistoria);
        $('#txtMovNroHistoria').val(cabecera.nroHistoriaClinica);
        $('#txtMovApPaterno').val(cabecera.apellidoPaterno);
        $('#txtMovApMaterno').val(cabecera.apellidoMaterno);
        $('#txtMovPrimerNombre').val(cabecera.primerNombre);

        if (ImgMovimiento.idPaciente > 0) {
            $("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
            $('#txtMovHoraNacimiento').val(cabecera.horaNacimiento);
            $('#cboMovSexo').val(cabecera.idTipoSexo);

            $("#txtMovApPaterno").attr("disabled", true);
            $("#txtMovApMaterno").attr("disabled", true);
            $("#txtMovPrimerNombre").attr("disabled", true);
            $("#txtMovSegundoNombre").attr("disabled", true);

            $("#txtMovFechaNacimiento").attr("disabled", true);
            $("#txtMovHoraNacimiento").attr("disabled", true);
            $("#cboMovSexo").attr("disabled", true);
        } else {
            $("#txtMovApPaterno").removeAttr("disabled");
            $("#txtMovApMaterno").removeAttr("disabled");
            $("#txtMovPrimerNombre").removeAttr("disabled");
            $("#txtMovSegundoNombre").removeAttr("disabled");

            $("#txtMovFechaNacimiento").removeAttr("disabled");
            $("#txtMovHoraNacimiento").removeAttr("disabled");
            $("#cboMovSexo").removeAttr("disabled");
        }
        //$('#txtMovSegundoNombre').val(cabecera.segundoNombre);
        //let edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento)
        //$('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
        //$("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
        //$('#txtMovHoraNacimiento').val(cabecera.horaNacimiento);
        //$('#cboMovSexo').val(cabecera.idTipoSexo);

        $('#txtMovNroCorrelativoBoleta').val(cabecera.nroSerie);
        $('#txtMovNroDocumentoBoleta').val(cabecera.nroDocumento);
        $('#txtMovNroOrden').val(cabecera.idOrden);

        //$('#txtMovNroReceta').val(cabecera.idReceta);
        //$('#txtMovNroCuenta').val(cabecera.idCuentaAtencion);
        //$('#txtMovEstadoCuenta').val("F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio);
        $('#txtMovProcedencia').val(cabecera.servicio);
        $('#cboMovPlan').val(cabecera.idTipoFinanciamiento);
        $('#txtMovFuenteFinanciamiento').val("IAFA Act.: " + cabecera.planA);

        if (/*cabecera.idReceta > 0 && */ cabecera.idMedicoSolicita > 0) {
            $('#cboMovMedicoSolicita_chosen').removeClass("d-none");
            $('#cboMovMedicoSolicita').val(cabecera.idMedicoSolicita);
            $('#txtMovMedicoSolicita').hide();
        } else {
            $('#cboMovMedicoSolicita_chosen').addClass("d-none");
            $('#txtMovMedicoSolicita').show();
        }

        $("#txtMovFechaFUR").datepicker("setDate", cabecera.fur);
        $("#txtMovFechaFPP").datepicker("setDate", cabecera.fpp);
        $("#txtMovGesta").val(cabecera.gesta);
        $("#txtMovParidad1").val(cabecera.paridad1);
        $("#txtMovParidad2").val(cabecera.paridad2);
        $("#txtMovParidad3").val(cabecera.paridad3);
        $("#txtMovParidad4").val(cabecera.paridad4);
        $("#txtMovEdadGestSem").val(cabecera.edadGestSem);
        $("#txtMovEdadGestDias").val(cabecera.edadGestDias);

        await Imagenologia.MovCalcularEdadGestacional($("#txtMovFechaFUR").val());


        $("#frameBusquedaProductos").hide();
        //$("#frameBusquedaInsumos").hide();

        await Imagenologia.ListaDiagnosticosPorFiltro('');

        $('.chzn-select').chosen().trigger("chosen:updated");

        oTable_ImgMovDetalleProductos.fnAddData(detalle);
        Imagenologia.ValidarDetalleMovimiento();
        Imagenologia.Totalizar();

        await Imagenologia.ValidarUsuarioRegistra();

        //console.log(cabecera);
        //console.log(detalle);

    },


    /*-----------------------------------------------------------------*/
    ValidarDatosObligatoriosMovimiento() {
        ImgMovimiento.detalleExamenes = Imagenologia.DevolverDetalleMovimiento();
        //ImgMovimiento.detalleInsumos = Imagenologia.DevolverDetalleInsumo();

        if (ImgMovimiento.idMovimiento == 0) {
            if (isNull(ImgMovimiento.idCuentaAtencion, 0) == 0 && isNull(ImgMovimiento.idComprobantePago, 0) == 0) {
                alerta2("info", "", "Por favor ingrese un paciente por receta, cuenta o comprobante de pago");
                return false;
            }
        }

        if (Imagenologia.idPuntoCarga == 3) {
            if ($("#rdbMovTipoEstudioCito").is(":checked") == false && $("#rdbMovTipoEstudioHisto").is(":checked") == false) {
                alerta2("info", "", "Por favor seleccione si es un examen de Citología o Histología");
                return false;
            }
        }

        if (isEmpty($("#cboMovRegistraOrden").val())) {
            alerta2("info", "", "Por favor seleccione quien Registra Orden");
            return false;
        }


        // if (ImgMovimiento.idCuentaAtencion > 0) {
        //    if (isEmpty($("#cboMovMedicoSolicita").val())) {
        //        alerta2("info", "", "Por favor seleccione Médico Solicita");
        //        return false;
        //    }
        //} else {
        //    if (isEmpty($("#txtMovMedicoSolicita").val())) {
        //        alerta2("info", "", "Por favor ingrese Médico Solicita");
        //        return false;
        //    }
        //}

        if ($("#txtMovMedicoSolicita").is(":visible")) {
            if (isEmpty($("#txtMovMedicoSolicita").val())) {
                alerta2("info", "", "Por favor ingrese Médico Solicita");
                return false;
            }
        }

        if ($("#cboMovMedicoSolicita").is(":visible")) {
            if (isEmpty($("#cboMovMedicoSolicita").val())) {
                alerta2("info", "", "Por favor seleccione Médico Solicita");
                return false;
            }
        }

        //if (isEmpty($("#cboMovMedicoRealiza").val())) {
        //    alerta2("info", "", "Por favor seleccione Médico Realiza");
        //    return false;
        //}

        if (isEmpty($("#txtMovApPaterno").val())) {
            alerta2("info", "", "Por favor ingrese el Apellido Paterno del paciente.");
            return false;
        }

        if (isEmpty($("#txtMovApMaterno").val())) {
            alerta2("info", "", "Por favor ingrese el Apellido Materno del paciente.");
            return false;
        }

        if (isEmpty($("#txtMovPrimerNombre").val())) {
            alerta2("info", "", "Por favor ingrese el Primer Nombre del paciente.");
            return false;
        }

        if (isEmpty($("#txtMovFechaNacimiento").val())) {
            alerta2("info", "", "Por favor ingrese la Fecha Nacimiento del paciente.");
            return false;
        }

        if (isEmpty($("#cboMovSexo").val())) {
            alerta2("info", "", "Por favor seleccione el Sexo del paciente.");
            return false;
        }

        if (Imagenologia.requiereInsumo == true) {
            if (ImgMovimiento.detalleInsumos.length == 0) {
                alerta2("info", "", "Por favor agregue los insumos.");
                return false;
            } else {
                if (Imagenologia.ValidarDetalleInsumosMovimiento() == false) {
                    return false;
                }
            }
        }

        if (ImgMovimiento.detalleExamenes.length == 0) {
            alerta2("info", "", "Por favor agregue los examenes.");
            return false;
        } else {
            if (Imagenologia.ValidarDetalleMovimiento() == false) {
                return false;
            }
        }

        return true;
    },

    async GuardarMovimiento() {
        if (Imagenologia.ValidarDatosObligatoriosMovimiento() == false) {
            return false;
        }

        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //ImgMovimiento.detalleInsumos = Imagenologia.DevolverDetalleInsumo();
        ImgMovimiento.detalleExamenes = Imagenologia.DevolverDetalleMovimiento();

        let paridad = '';
        if ($("#txtMovParidad1").val().length < 2) {
            $("#txtMovParidad1").val('0' + $("#txtMovParidad1").val());
        }

        if ($("#txtMovParidad2").val().length < 2) {
            $("#txtMovParidad2").val('0' + $("#txtMovParidad2").val());
        }

        if ($("#txtMovParidad3").val().length < 2) {
            $("#txtMovParidad3").val('0' + $("#txtMovParidad3").val());
        }

        if ($("#txtMovParidad4").val().length < 2) {
            $("#txtMovParidad4").val('0' + $("#txtMovParidad4").val());
        }

        paridad = $("#txtMovParidad1").val() + '-' + $("#txtMovParidad2").val() + '-' + $("#txtMovParidad3").val() + '-' + $("#txtMovParidad4").val();

        data.append('IdCuentaAtencion', ImgMovimiento.idCuentaAtencion);
        data.append('IdMovimiento', ImgMovimiento.idMovimiento);
        data.append('IdOrden', ImgMovimiento.idOrden);
        data.append('IdOrdenPago', ImgMovimiento.idOrdenPago);
        data.append('IdReceta', ImgMovimiento.idReceta);
        data.append('MovTipo', 'S');
        //data.append('IdTipoConcepto', 3);
        data.append('IdPuntoCarga', Imagenologia.idPuntoCarga);                //NUEVO PUNTO DE CARGA GENETICA, PARA TAMIZAJE
        data.append('MedicoSolicita', $("#txtMovMedicoSolicita").val());
        data.append('IdMedicoSolicita', $("#cboMovMedicoSolicita").val());
        data.append('IdMedicoRealiza', $("#cboMovMedicoRealiza").val());
        data.append('IdPersonaTomaImagen', $("#cboMovRegistraOrden").val());
        data.append('Eo_FUM', $("#txtMovFechaFUR").val());
        data.append('Eo_FPP', $("#txtMovFechaFPP").val());
        data.append('Eo_Gestantes', $("#txtMovGesta").val());
        data.append('Eo_Partos', paridad);
        data.append('Eo_EG', $("#txtMovEdadGestSem").val());
        data.append('Eo_EGDias', $("#txtMovEdadGestDias").val());
        //data.append('TipoAP', $("#rdbMovTipoEstudioCito").is(":checked") ? 'C' : ($("#rdbMovTipoEstudioHisto").is(":checked") ? 'H' : ''));
        //data.append('IdMovApReemplazo', ImgMovimiento.idMovApReemplazo);
        data.append('IdComprobantePago', ImgMovimiento.idComprobantePago);
        data.append('CorrelativoAnual', null);
        data.append('IdDiagnostico', $("#cboMovDx").val());
        data.append('EsDiagnosticoDefinitivo', ($("#cboMovDx").val() > 0 ? ($('#chkMovEsDxDefinitivo').is(":checked") ? 1 : 2) : 0));  //1-definitivo, 2-presuntivo
        data.append('CubreIAFA', $('#chkMovIAFAnoCubre').is(":checked") ? 1 : 0);
        data.append('FechaHoraNacimiento', $("#txtMovFechaNacimiento").val() + ' ' + isNull($("#txtMovHoraNacimiento").val(), '00:00'));
        data.append('IdTipoSexo', $("#cboMovSexo").val());
        data.append('InsumosCPT', JSON.stringify(ImgMovimiento.detalleInsumos));
        data.append('ProductosCPT', JSON.stringify(ImgMovimiento.detalleExamenes));

        try {

            Cargando(1);
            return HttpClient.Post('/ImagenologiaMovimiento/GuardarMovimiento?area=Imagenes', data)
                .then(datos => {
                    console.log(datos)
                    Cargando(0);
                    //if (datos.respuesta.length > 0) {
                    if (datos.respuesta > 0) {
                        //let resp1 = datos.respuesta[0];
                        let resp1 = datos.respuesta;
                        let nroMovimiento = datos.movimiento;
                        let codigoAp = datos.codigoAp;

                        if (ImgMovimiento.accion == "A") {
                            Imagenologia.LimpiarCamposMovimiento();
                            ImgMovimiento.accion = "A";
                            $("#frameResultadosBusquedaProductos").hide();
                            Imagenologia.DesbloquearCamposMovimiento();
                        } else {
                            $('#btnListarOrdenesImagenologia').click();
                            $("#modalImgMovimiento").modal("hide");
                        }

                        let mensajeResp = '';
                        mensajeResp = 'Los datos se han registrado correctamente. <br><table class="table table-bordered border mx-auto" style="width: 290px;"><tr><th class="text-sm-center" style="width: 170px;background: lightsteelblue;">Nº Movimiento</th><th class="text-sm-center">' + nroMovimiento + '</th></tr></table>';

                        //alerta2("success", "", "Los datos se han registrado correctamente. Se ha generado el número de movimiento: " + resp1.idMovimiento);
                        alerta2("success", "", mensajeResp);

                    } else {
                        resp = false;
                        alerta2("error", "", "Hubo un error en el registro de los datos.");
                    }

                })
                .catch((e) => {
                    Cargando(0);
                    //alerta(3, 'Algo salio mal ' + e)
                    alerta2("error", "", JSON.stringify(e));
                    return null
                }) /// falta hcer los cambios aqui

        } catch (error) {
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
            console.log('error lab', error)
            alerta(3, error);
        }

        return resp;
    },

    async EliminarImgMovimiento(idMovimiento) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let datos
        var data = new FormData();

        data.append('idMovimiento', idMovimiento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaMovimiento/EliminarMovimiento?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            if (datos.respuesta.table.length > 0) {
                let respuesta = datos.respuesta.table[0];

                if (respuesta.error == 0) {
                    $('#btnListarOrdenesImagenologia').click();
                    alerta2("success", "", respuesta.mensaje);
                } else {
                    alerta2("warning", "", respuesta.mensaje);
                }
            } else {
                resp = false;
                alerta2("error", "", "Hubo un error en la eliminacion de los datos.");
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async SeleccionarImgMovimiento(idMovimiento) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let datos
        var data = new FormData();

        data.append('idMovimiento', idMovimiento);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaMovimiento/SeleccionarMovimiento?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            if (datos.respuesta.table.length > 0) {
                cabecera = datos.respuesta.table[0];
                detalle = datos.respuesta.table1;
                insumos = datos.respuesta.table2;

                ImgMovimiento.idMovimiento = cabecera.idMovimiento;
                ImgMovimiento.idOrden = cabecera.idOrden;
                ImgMovimiento.idOrdenPago = cabecera.idOrdenPago;
                ImgMovimiento.idComprobantePago = cabecera.idComprobantePago;
                ImgMovimiento.idCuentaAtencion = cabecera.idCuentaAtencion;
                ImgMovimiento.idPaciente = cabecera.idPaciente;
                ImgMovimiento.idReceta = cabecera.idReceta;
                ImgMovimiento.idTipoFinanciamiento = cabecera.idTipoFinanciamiento;

                $('#txtMovNroMovimiento').val(cabecera.idMovimiento);
                $('#txtMovEstadoMovimiento').val(cabecera.estadoOrden);
                $('#txtMovFechaRegistroMovimiento').val(cabecera.fechaRegistro);
                $('#txtMovFechaRealizaMovimiento').val(cabecera.fechaRealizaCpt);

                $('#txtMovTipoHistoria').val(cabecera.tipoNumeracionHistoria);
                $('#txtMovNroHistoria').val(cabecera.nroHistoriaClinica);
                $('#txtMovApPaterno').val(cabecera.apellidoPaterno);
                $('#txtMovApMaterno').val(cabecera.apellidoMaterno);
                $('#txtMovPrimerNombre').val(cabecera.primerNombre);
                $('#txtMovSegundoNombre').val(cabecera.segundoNombre);

                let edad = null;
                if (ImgMovimiento.idMovimiento > 0) {
                    edad = CalcularEdadAnioMesDiaSegunFecha(cabecera.fechaNacimiento, cabecera.fechaAtencion);
                } else {
                    edad = CalcularEdadAnioMesDia(cabecera.fechaNacimiento);
                }
                //console.log(edad);
                $('#txtMovEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");
                //$('#txtMovFechaNacimiento').val(datos.fechaNacimiento);
                $("#txtMovFechaNacimiento").datepicker("setDate", cabecera.fechaNacimiento);
                $('#txtMovHoraNacimiento').val(cabecera.horaNacimiento);
                $('#cboMovSexo').val(cabecera.idTipoSexo);

                if (cabecera.idCuentaAtencion > 0) {
                    $("#TabPacienteConCuenta").show();
                    $("#TabPacienteExterno").hide();
                    $('#tabImgMovimiento a[href="#TabPanelPacienteConCuenta"]').tab('show');
                    $('#txtMovNroCuenta').val(cabecera.idCuentaAtencion);
                    $('#txtMovEstadoCuenta').val("F.Ing: " + cabecera.fechaIngreso + " - " + cabecera.tipoServicio);
                    $('#txtMovProcedencia').val(cabecera.servicio);
                    $('#cboMovPlan').val(cabecera.idTipoFinanciamiento);
                    $('#txtMovFuenteFinanciamiento').val("IAFA Act.: " + cabecera.planA);

                } else {
                    $("#TabPacienteExterno").show();
                    $("#TabPacienteConCuenta").hide();
                    $('#tabImgMovimiento a[href="#TabPanelPacienteExterno"]').tab('show');
                    $('#txtMovNroCorrelativoBoleta').val(cabecera.nroSerie);
                    $('#txtMovNroDocumentoBoleta').val(cabecera.nroDocumento);
                    $('#txtMovNroOrden').val(cabecera.idOrden);

                }

                await Imagenologia.ListaDiagnosticosPorFiltro(isNull(cabecera.codigoDiagnostico, ''));
                $('#cboMovDx').val(cabecera.idDiagnostico);
                if (cabecera.esDiagnosticoDefinitivo == 1) {
                    $("#chkMovEsDxDefinitivo").prop("checked", true);
                } else {
                    $("#chkMovEsDxDefinitivo").prop("checked", false);
                }

                $('#cboMovRegistraOrden').val(cabecera.idRegistraOrden);
                $('#cboMovMedicoSolicita').val(cabecera.idSolicitaPrueba);
                $('#cboMovMedicoRealiza').val(cabecera.idRealizaPrueba);

                $("#txtMovFechaFUR").datepicker("setDate", cabecera.fur);
                $("#txtMovFechaFPP").datepicker("setDate", cabecera.fpp);
                $("#txtMovGesta").val(cabecera.gesta);
                if (isEmpty(cabecera.paridad) == false) {
                    let strParidad = cabecera.paridad;
                    let numerosParidad = strParidad.split("-");
                    numerosParidad.forEach(function (valor, index) {
                        //console.log("Índice: " + index + ", Valor: " + valor);
                        $("#txtMovParidad" + (index + 1)).val(valor);
                    });
                }
                $("#txtMovEdadGestSem").val(cabecera.edadGestSem);
                $("#txtMovEdadGestDias").val(cabecera.edadGestDias);

                if (cabecera.idPaciente > 0) {
                    $("#txtMovFechaNacimiento").attr("disabled", true);
                    $("#txtMovHoraNacimiento").attr("disabled", true);
                    $("#cboMovSexo").attr("disabled", true);
                } else {
                    let datosPaciente = cabecera.paciente.split(' ');
                    $('#txtMovTipoHistoria').val("");
                    $('#txtMovNroHistoria').val("");
                    $('#txtMovApPaterno').val((isEmpty(datosPaciente[0]) ? "" : datosPaciente[0]));
                    $('#txtMovApMaterno').val((isEmpty(datosPaciente[1]) ? "" : datosPaciente[1]));
                    $('#txtMovPrimerNombre').val((isEmpty(datosPaciente[2]) ? "" : datosPaciente[2]));
                    $('#txtMovSegundoNombre').val((isEmpty(datosPaciente[3]) ? "" : datosPaciente[3]));


                    $("#txtMovFechaNacimiento").removeAttr("disabled");
                    $("#txtMovHoraNacimiento").removeAttr("disabled");
                    $("#cboMovSexo").removeAttr("disabled");
                }

                //if (cabecera.idSolicitaPrueba > 0) {
                $('#cboMovMedicoSolicita_chosen').removeClass("d-none");
                $('#txtMovMedicoSolicita').hide();
                $('#txtMovMedicoSolicita').val("");
                //} else {
                //    $('#cboMovMedicoSolicita_chosen').addClass("d-none");
                //    $('#txtMovMedicoSolicita').show();
                //    $('#txtMovMedicoSolicita').val(cabecera.solicitaPrueba);
                //}


                $('.chzn-select').chosen().trigger("chosen:updated");

                /////////////////CARGA DETALLE DE PRODUCTOS DEL MOVIMIENTO//////////////////////////////
                oTable_ImgMovDetalleProductos.fnAddData(detalle);

                /////////////////CARGA DETALLE DE ISNUMOS DEL MOVIMIENTO//////////////////////////////
                let detalleInsuMov = [];
                let objItemInsumo = null;
                $(insumos).each(function (i, obj) {
                    objItemInsumo = {
                        index: 0,               //para controlar cada fila como unica
                        idProductoCPT: obj.idProductoCPT,
                        nombreCPT: obj.nombreCPT,
                        codigo: obj.codigo,
                        idProducto: obj.idProducto,
                        nombre: obj.nombre,
                        cantidadTomada: obj.cantidadTomada,
                        cantidadTFallada: obj.cantidadFallada
                    }

                    detalleInsuMov.push(objItemInsumo);

                    $("#htmlInsumosImgMov_" + obj.idProductoCPT).removeClass("btn-secondary");
                    $("#htmlInsumosImgMov_" + obj.idProductoCPT).addClass("btn-indigo");
                    $("#htmlInsumosImgMov_" + obj.idProductoCPT).html('<i class="fa fa-check"></i>');
                });

                ImgMovimiento.detalleInsumos = detalleInsuMov;


                Imagenologia.Totalizar();

            } else {
                resp = false;
                alerta2("error", "", "Hubo un error en la seleccion de los datos.");
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    async ValidarUsuarioRegistra() {
        let idUsu = Utilitario.ObtenerIdUsuarioSesion();
        $("#cboMovRegistraOrden").val(idUsu);
        $('.chzn-select').chosen().trigger("chosen:updated");
        let val = $("#cboMovRegistraOrden").val();
        if (val > 0) {
            $("#cboMovRegistraOrden").attr("disabled", true);
        } else {
            $("#cboMovRegistraOrden").removeAttr("disabled");
        }
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async ListaDiagnosticosPorFiltro(filtro) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#cboMovDx').empty();
        $('#cboMovDx').append('<option  value="0">Busque y seleccione un diagnóstico</option>');
        $('#cboMovDx').val("0");
        $('.chzn-select').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Diagnosticos/ListaDiagnosticosPorFiltro?area=Comun",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.table).each(function (i, obj) {
                    $('#cboMovDx').append('<option data-cie10="' + obj.codigoCIE10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#cboMovDx').val("0");
                $('.chzn-select').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#cboMovDx_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    async ListarDiagnosticosPorAtencionPorNumeroEvaluacion(idAtencion, eval) {

        //Diagnosticos.LimpiarDiagnosticosAtencion();
        //ObjtableDiagnosticos.fnClearTable();
        let resp = null;
        let midata = new FormData();
        midata.append('idAtencion', idAtencion);
        midata.append('evaluacion', eval);

        await $.ajax({

            method: "POST",
            url: "/Diagnosticos/ListarDiagnosticosPorAtencionPorNumeroEvaluacion?area=ConsultaExterna",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {


                if (datos.table.length > 0) {
                    //ObjtableDiagnosticos.fnAddData(datos.table);
                    //ObjtableDiagnosticos.resize();
                    resp = datos.table;
                }

                else {
                    Cargando(0)
                }

            },
            error: function (msg) {
                Cargando(0)
            }
        })

        return resp;
    },


    ValidarDatosObligatoriosResultados() {
        if (isEmpty($("#txtFechaResultado").val())) {
            alerta2("info", "", "Ingrese la Fecha Resultado.");
            return false;
        }

        if (isEmpty($("#txtHoraResultado").val())) {
            alerta2("info", "", "Ingrese la Hora Resultado.");
            return false;
        }

        if (isEmpty($("#cboRealizaPrueba").val())) {
            alerta2("info", "", "Seleccione quien Realiza Prueba.");
            return false;
        }

        //if (isEmpty($("#cboServicioRealizaPrueba").val())) {
        //    alerta2("info", "", "Seleccione el Servicio que Realiza Prueba.");
        //    return false;
        //}

        return true;
    },

    async GuardarResultado() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        let detalleResultado = Imagenologia.DevolverDetalleResultado();

        data.append('IdCuentaAtencion', Imagenologia.idCuentaAtencion);
        data.append('IdOrden', Imagenologia.idOrden);
        data.append('IdMovimiento', Imagenologia.idMovimiento);
        data.append('IdProducto', Imagenologia.idProducto);
        data.append('IdRealizaAnalisis', $("#cboRealizaPrueba").val());
        data.append('IdServicioRealiza', $("#cboServicioRealizaPrueba").val());
        data.append('FechaResultado', $("#txtFechaResultado").val() + ' ' + $("#txtHoraResultado").val());
        //data.append('CodigoIngreso', $("#txtCodigoIngreso").val());
        data.append('detalleResultado', JSON.stringify(detalleResultado));
        data.append('Informe', $("#txtResInforme").val());
        data.append('Observaciones', $("#txtResObservaciones").val());
        data.append('Conclusiones', $("#txtResConclusiones").val());

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaResultados/GuardarResultados?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            if (datos.respuesta) {
                alerta2("success", "", "Los resultados se guardaron correctamente.");
                resp = true;
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("danger", "", JSON.stringify(error));
        }

        return resp;

    },

    async GuardarResultadoPersonalizado() {
        let resp = false;
        if (Imagenologia.tipoFormulario == "frmCardiotocografiaCST" || Imagenologia.tipoFormulario == "frmCardiotocografiaNST") {
            resp = await EcoCardiotografia.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoAbdominalBasic") {
            resp = await EcoAbdominalBasica.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoCardiografia") {
            resp = await EcoCardiografia.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoDopplerCrec") {
            resp = await EcoDopplerCrecimiento.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmecoGenetica") {
            resp = await EcoGenetica.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmecoMorfologico") {
            resp = await EcoMorfologica.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoNeurosonografi") {
            resp = await EcoNeurosonografia.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoUteroGrav") {
            resp = await EcoUteroGravido.GuardarResultado();
        } else if (Imagenologia.tipoFormulario == "frmEcoVaginalBasica") {
            resp = await EcoVaginalBasica.GuardarResultado();
        }

        return resp;
    },

    async EliminarResultado(idMovimiento, idProducto) {
        let cabecera = null;
        let detalle = null;
        let resp = false;
        let datos
        var data = new FormData();

        data.append('idMovimiento', idMovimiento);
        data.append('idProducto', idProducto);

        try {
            Cargando(1);

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenologiaResultados/EliminarResultado?area=Imagenes",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);

            if (datos.respuesta.table.length > 0) {
                let respuesta = datos.respuesta.table[0];

                if (respuesta.error == 0) {
                    await Imagenologia.ListarDetalleOrden();
                    alerta2("success", "", respuesta.mensaje);
                } else {
                    alerta2("warning", "", respuesta.mensaje);
                }
            } else {
                resp = false;
                alerta2("error", "", "Hubo un error en la eliminación de los datos.");
            }

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;

    },

    DevolverDetalleResultado() {
        let detalleResultado = [];
        let objItemDetalle = null;
        let lstDetalleResultado = oTable_ResultadosImagenologia.api(true).data().toArray();

        let valorNumero = "";
        let valorTexto = "";
        let valorCombo = "";
        let valorCheck = "";

        $('#tblFormatoResultadosImg tbody tr').each(function () {
            valorNumero = $(this).find("td:eq(2) input").length == 0 ? null : $(this).find("td:eq(2) input").val();
            valorTexto = $(this).find("td:eq(3) input").length == 0 ? null : $(this).find("td:eq(3) input").val();
            valorCombo = $(this).find("td:eq(4) select").length == 0 ? null : isNull($(this).find("td:eq(4) select option:selected").text(), 0);
            valorCheck = $(this).find("td:eq(5) input").length == 0 ? null : $(this).find("td:eq(5) input").is(':checked') == true ? 1 : 0;

            ordenNumero = $(this).find("td:eq(2) input").length == 0 ? 0 : $(this).find("td:eq(2) input").attr("data-ordenxresultado");
            ordenTexto = $(this).find("td:eq(3) input").length == 0 ? 0 : $(this).find("td:eq(3) input").attr("data-ordenxresultado");
            ordenCombo = $(this).find("td:eq(4) select").length == 0 ? 0 : isNull($(this).find("td:eq(4) select option:selected").attr("data-ordenxresultado"), 0);
            ordenCheck = $(this).find("td:eq(5) input").length == 0 ? 0 : $(this).find("td:eq(5) input").attr("data-ordenxresultado");

            ordenXresultado = parseInt(ordenNumero) + parseInt(ordenTexto) + parseInt(ordenCombo) + parseInt(ordenCheck);

            if (ordenXresultado > 0) {
                if (!isEmpty(ordenNumero) || !isEmpty(ordenTexto) || !isEmpty(ordenCombo) || !isEmpty(ordenCheck)) {
                    objItemDetalle = {
                        IdOrden: Imagenologia.idOrden,
                        IdProducto: Imagenologia.idProducto,
                        OrdenResultado: ordenXresultado,
                        ValorNumero: valorNumero,
                        ValorTexto: valorTexto,
                        ValorCombo: valorCombo,
                        ValorCheck: valorCheck,
                        //realizaAnalisis: $("#cboRealizaPrueba").val(),
                        //CodigoIngreso: $("#txtCodigoIngreso").val()
                    }
                    detalleResultado.push(objItemDetalle);
                }
            }


            //console.log(valorTexto);
            //console.log(valorCombo);
            //console.log(valorCheck);
            //console.log("-------------------------------");
        });

        //console.log(detalleResultado);

        return detalleResultado;
    },

    async ListarDetalleOrden() {
        Cargando(1)
        let objRow = oTable_ListaOrdenes.api(true).row('.selected').data()

        if (isEmpty(objRow)) {
            alerta(2, 'Selecciona una orden')
            Cargando(0)
            return false
        }

        let facturacionServicioDespacho = await Imagenologia.ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(objRow.idOrden, objRow.idPuntoCarga, objRow.idMovimiento)
        //console.log(facturacionServicioDespacho);
        oTable_ListaOrdenesDetalle.fnClearTable();
        if (!isEmpty(facturacionServicioDespacho)) {
            oTable_ListaOrdenesDetalle.fnAddData(facturacionServicioDespacho);
        }
        Cargando(0)
    },

    Limpiar() {
        $(".search").val("");
        $("#cboBusqTipoServicio").val("0");
        $("#cboBusqGrupoExamen").val("0");
        $("#cboBusqRealizaExamen").val("0");
    },

    LimpiarCamposResultados() {
        Imagenologia.idCuentaAtencion = 0;
        Imagenologia.idOrden = 0;
        Imagenologia.idMovimiento = 0;
        Imagenologia.idProducto = 0;
        Imagenologia.tipoFormulario = "";
        //Imagenologia.tipoResponsableEstudio = '';
        $(".campoRes").val("");
        $('.chzn-select').chosen().trigger("chosen:updated");
        oTable_ResultadosImagenologia.fnClearTable();
    },

    BloquearCamposResultados() {
        $("#txtFechaResultado").attr("disabled", true);
        $("#txtHoraResultado").attr("disabled", true);
        $("#cboRealizaPrueba").attr("disabled", true);
        $("#PanelResultadosImg .campoRes").attr("disabled", true);
        $("#PanelResultadosPersonalizadosImg .campoRes").attr("disabled", true);
        $("#btnGuardarResultado").hide();
        $(".chzn-select").chosen().trigger("chosen:updated");
    },

    DesbloquearCamposResultados() {
        //$("#txtFechaResultado").removeAttr("disabled");
        //$("#txtHoraResultado").removeAttr("disabled");
        $("#cboRealizaPrueba").removeAttr("disabled");
        $("#PanelResultadosImg .campoRes").removeAttr("disabled");
        $("#PanelResultadosPersonalizadosImg .campoRes").removeAttr("disabled", true);
        $("#btnGuardarResultado").show();
        $(".chzn-select").chosen().trigger("chosen:updated");
    },

    BloquearCamposMovimiento() {
        $(".campoMov").attr("disabled", true);
        $(".campoMovBusq").attr("disabled", true);
        $("#btnReemplazarAP").hide();
        $(".dCampoDetalle").attr("disabled", true);
        $("#frameBusquedaProductos").hide();
        $("#frameBusquedaInsumos").hide();
        $("#btnGuardarMovimiento").hide();
        $(".chzn-select").chosen().trigger("chosen:updated");
    },

    DesbloquearCamposMovimiento() {
        $(".campoMov").removeAttr("disabled");
        $("#btnReemplazarAP").show();

        $("#frameBusquedaProductos").show();
        $("#frameBusquedaInsumos").show();
        $('#btnGuardarMovimiento').show();

        if (ImgMovimiento.accion == "A") {
            $(".campoMovBusq").removeAttr("disabled");
            $("#formMovIAFAnoCubre").show();
            $("#btnReemplazarAP").hide();

            $('#TabPacienteConCuenta').show();
            $('#TabPacienteExterno').show();
            $('#tabImgMovimiento a[href="#TabPanelPacienteConCuenta"]').tab('show');

            $('#cboMovMedicoSolicita_chosen').removeClass("d-none");
            $('#txtMovMedicoSolicita').hide();

            $('.rdbMovTipoEstudio').removeAttr("disabled");
        } else {
            $(".campoMovBusq").attr("disabled", true);
            $('.rdbMovTipoEstudio').attr("disabled", true);
            $("#formMovIAFAnoCubre").hide();
            if (ImgMovimiento.idPaciente > 0) {
                $("#txtMovFechaNacimiento").attr("disabled", true);
                $("#txtMovHoraNacimiento").attr("disabled", true);
                $("#cboMovSexo").attr("disabled", true);
            } else {
                $("#txtMovFechaNacimiento").removeAttr("disabled");
                $("#txtMovHoraNacimiento").removeAttr("disabled");
                $("#cboMovSexo").removeAttr("disabled");
            }

            if (ImgMovimiento.idComprobantePago > 0) {
                $("#btnGuardarMovimiento").hide();
                $("#frameBusquedaProductos").hide();
                $("#frameBusquedaInsumos").hide();
            }
        }

        //$('#cboMovMedicoSolicita_chosen').removeClass("d-none");
        //$('#txtMovMedicoSolicita').hide();

        $(".dCampoDetalle").removeAttr("disabled");

        $(".chzn-select").chosen().trigger("chosen:updated");
    },

    LimpiarCamposMovimiento() {
        //ImgMovimiento.accion = "";
        ImgMovimiento.idCuentaAtencion = null;
        ImgMovimiento.idAtencion = null;
        ImgMovimiento.idPaciente = 0;
        ImgMovimiento.idMovimiento = 0;
        ImgMovimiento.idOrden = 0;
        ImgMovimiento.idOrdenPago = null;
        ImgMovimiento.idReceta = null;
        ImgMovimiento.idComprobantePago = null;
        ImgMovimiento.idTipoFinanciamiento = null;
        ImgMovimiento.detalleExamenes = null;
        ImgMovimiento.detalleInsumos = [];

        $(".campoMov").val("");
        $("#modalImgMovimiento input").val("");
        $("#modalImgMovimiento select").val("");
        //$(".rdbMovTipoEstudio").prop('checked', false);
        $("#chkMovIAFAnoCubre").prop('checked', false);
        $("#chkMovEsDxDefinitivo").prop('checked', false);

        //if (ImgMovimiento.accion == "A") {

        //}
        //Imagenologia.tipoResponsableEstudio == 'C' ? $('#rdbMovTipoEstudioCito').prop("checked", true) : (Imagenologia.tipoResponsableEstudio == 'H' ? $('#rdbMovTipoEstudioHisto').prop("checked", true) : false)          //SE COMENTO A PETICIION  DEL ING. ROLY

        $(".chzn-select").chosen().trigger("chosen:updated");
        $("#TotalDetalleImgMov").html("");

        oTable_ImgMovDetalleProductos.fnClearTable();
    },

    GenerarPacienteRecibido: async function (fechaCita, horaCita) {
        var midata = new FormData();
        midata.append('codigoRenipressDestino', '6208');
        midata.append('condicionPaciente', 'E');
        midata.append('fechaCita', fechaCita);
        midata.append('horaCita', horaCita);
        midata.append('idReferencia', Variables.IdReferencia);
        midata.append('llegoPaciente', 'S');
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
                        console.log(1, "Operación correcta");
                    }
                    else if (mensaje == "0001") {
                        console.log(2, "No se encontró registro de la referencia");
                    }
                    else if (mensaje == "0002") {
                        console.log(2, "Verificar la fecha de fechaCita y horaCita");
                    }
                    else if (mensaje == "1001") {
                        console.log(2, "Ingresar el id de REFERENCIA idReferencia");
                    }
                    else if (mensaje == "1002") {
                        console.log(2, "Ingresar la fecha de la cita fechaCita");
                    }
                    else if (mensaje == "1003") {
                        console.log(2, "Ingresar la hora de la cita horaCita");
                    }
                    else if (mensaje == "1004") {
                        console.log(2, "Ingresar el código de establecimiento destino codigoRenipressDestino");
                    }
                    else if (mensaje == "1005") {
                        console.log(2, "Ingresar la llegada del paciente llegoPaciente");
                    }
                    else if (mensaje == "1006") {
                        console.log(2, "Ingresar la llegada del paciente valido llegoPaciente");
                    }
                    else if (mensaje == "1007") {
                        console.log(2, "Ingresar la condición del paciente condicionPaciente");
                    }
                    else if (mensaje == "1008") {
                        console.log(2, "Ingresar una condición de paciente valido condicionPaciente");
                    }
                    else if (mensaje == "9000") {
                        console.log(2, "Error del servicio");
                    }
                    else {
                        console.log(2, "Código de respuesta no reconocido");
                    }


                } else {
                    //alerta(res.tipo, res.msj)
                    console.log(res)
                }


                //Cargando(0)
            }
        })
    }
}

$(document).ready(() => {
    Imagenologia.Plugins()
    Imagenologia.CargaInicial();
    Imagenologia.CargarCombos();
    Imagenologia.InitDatablesListaOrdenes()
    Imagenologia.InitDatablesListaOrdenesDetalle()
    Imagenologia.IniciarDataTableResultados();
    Imagenologia.InitDataTableFormatoResultado();
    Imagenologia.InitDatablesDetalleProductos();
    Imagenologia.InitDatablesDetalleInsumos();
    Imagenologia.DataTableProductosBuscados();
    Imagenologia.DataTableInsumosBuscados();
    Imagenologia.DataTableBoletasPendientesDeUso()
    //Imagenologia.InitDatablesListaCodigosApDisponibles();
    //Imagenologia.InitDatablesPatologiaClinica()

    Imagenologia.Events();

    BusqCuentasPacientes.Iniciar();
    BusqRecetasPacientes.Iniciar();

    PermisoGeneral.ValidarServicioFirmaDigital();

})
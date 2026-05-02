var OrdenesRecetasMedicas = null;
var OrdenesRecetasMedicasSeguimiento = null;
var IdCuentaAtencionTemp = 0;

var Ordenes = {
    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaVigencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });
    },


    //var listaServicios = function () {
    //    $.ajax({
    //        async: false,
    //        cache: false,
    //        url: "/Atencion/ListarServicio?area=ConsultaExterna",
    //        datatype: "json",
    //        type: "post",
    //        success: function (datos) {
    //            $('#cboConsultorio').empty();
    //            $(datos.table).each(function (i, obj) {
    //                $('#cboConsultorio').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');

    //            });

    //            $('.chzn-select').chosen().trigger("chosen:updated");

    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error listar servicios!", "2");
    //            }, 900)
    //        }
    //    });
    //}

    listaFecha() {
        var midata = new FormData();
        midata.append('idParametro', 356);
        $.ajax({
            method: "POST",
            url: "/Parametros/SeleccionaFilaParametro?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                var fecha = new Date();
                var dias = parseInt(datos.table[0]['valorTexto']); // Número de días a agregar
                fecha.setDate(fecha.getDate() + dias);

                var dia = fecha.getDate();
                var mes = parseInt(fecha.getMonth()) + 1;
                var yyy = fecha.getFullYear();

                if (dia < 10)
                    dia = '0' + dia; //agrega cero si el menor de 10
                if (mes < 10)
                    mes = '0' + mes

                fechaP = dia + "/" + mes + "/" + yyy

                $('#txtFechaVigencia').val(fechaP);
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar fecha!", "2");
                }, 900)
            }
        });
    },
    listaFarmacias () {
        $.ajax({
            method: "POST",
            url: "/Farmacia/FarmaciasSegunFiltro?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboFarmacia').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboFarmacia').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar farmacias!", "2");
                }, 900)
            }
        });
    },
    //RQ0003 RMOREANO 
    ListarDosis() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Receta/ListarDosis?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboDosis').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDosis').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar las dosis!", "2");
                }, 900)
            }
        });
    },
    ListarVias() {
        $.ajax({
            async: false,
            cache: false,
            url: "/Receta/ListarViasAdministracion?area=Comun",
            datatype: "json",
            type: "get",
            success: function (datos) {
                $('#cboVia').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboVia').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar las vias de administración!", "2");
                }, 900)
            }
        });
    },
    //RQ0003 
    ListarMedicos() { // JDELGADO010
        //console.log("ENTRANDO A LISTAR MEDICOS")
        $.ajax({
            method: "POST",
            url: "/Utilitario/ListarMedicos?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMedicoReceta').empty();
                $(datos.dataSet.table).each(function (i, obj) {
                    $('#cboMedicoReceta').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                });
                $('#cboMedicoReceta').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar medicos!", "2");
                }, 900)
            }
        });
    },
    listaCabeceraRecetasByIdCuenta(idCuentaAtencion, idTipoFuenteFina) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono

        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#hdIdRecetaRX').val(0)
                $('#lblRx').html(0)

                $('#hdIdRecetaEcoObs').val(0)
                $('#lblEcoObs').html(0)

                $('#hdIdRecetaEcoGene').val(0)
                $('#lblEcoGene').html(0)

                $('#hdIdRecetaPatoClinica').val(0)
                $('#lblPatoClinica').html(0)

                $('#hdIdRecetaAnaPatologica').val(0)
                $('#lblanaPatologica').html(0)

                $('#hdIdRecetabancoSangre').val(0)
                $('#lblbancoSangre').html(0)

                $('#hdIdRecetaFarmacia').val(0)
                $('#lblFarmacia').html(0)

                $('#hdIdRecetaInterconsulta').val(0)
                $('#lblInterconsulta').html(0)

                // jdelgado tomografia
                $('#hdIdRecetatomografia').val(0)
                $('#lbltomografia').html(0)
                // jdelgado tomografia

                $('#btnAgregaRayosX').css("visibility", 'visible');
                $('#btnQuitarRayos').css("visibility", 'visible');
                $('#btnAgregaEcoObs').css("visibility", 'visible');
                $('#btnQuitarEcoObs').css("visibility", 'visible');
                $('#btnAgregaEcoGene').css("visibility", 'visible');
                $('#btnQuitarEcoGene').css("visibility", 'visible');
                $('#btnAgregaPatoClinica').css("visibility", 'visible');
                $('#btnQuitarPatoClinica').css("visibility", 'visible');
                $('#btnAgregaanaPatologica').css("visibility", 'visible');
                $('#btnQuitaranaPatologica').css("visibility", 'visible');
                $('#btnAgregabancoSangre').css("visibility", 'visible');
                $('#btnQuitarbancoSangre').css("visibility", 'visible');
                $('#btnAgregaFarmacia').css("visibility", 'visible');
                $('#btnQuitarFarmacia').css("visibility", 'visible');
                $('#btnAgregainterconsultas').css("visibility", 'visible');
                $('#btnQuitarinterconsultas').css("visibility", 'visible');

                $('#btnAgregainterconsultas').css("visibility", 'visible');
                $('#btnQuitarinterconsultas').css("visibility", 'visible');

                $('#btnAgregatomografia').css("visibility", 'visible');
                $('#btnQuitartomografia').css("visibility", 'visible');

                $(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
                $(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
                $('#txtResumenHistoriaClinica').val('')
                $('#txtMotivoInterconsulta').val('')

                if (datos.table.length > 0) {//rx
                    $(datos.table).each(function (i, obj) {

                        if (obj.idPuntoCarga == 21) //rx
                        {
                            $('#lblRx').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaRX').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaRayosX').css("visibility", 'visible');
                                $('#btnQuitarRayos').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaRayosX').css("visibility", 'hidden')
                                $('#btnQuitarRayos').css("visibility", 'hidden')
                                $('#lblRx').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 23) {//eco obs
                            $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoObs').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaEcoObs').css("visibility", 'visible');
                                $('#btnQuitarEcoObs').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaEcoObs').css("visibility", 'hidden')
                                $('#btnQuitarEcoObs').css("visibility", 'hidden')
                                $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 20) {//eco gene
                            $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoGene').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaEcoGene').css("visibility", 'visible');
                                $('#btnQuitarEcoGene').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaEcoGene').css("visibility", 'hidden')
                                $('#btnQuitarEcoGene').css("visibility", 'hidden')
                                $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 2) {//pt clinica
                            $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaPatoClinica').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaPatoClinica').css("visibility", 'visible');
                                $('#btnQuitarPatoClinica').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaPatoClinica').css("visibility", 'hidden')
                                $('#btnQuitarPatoClinica').css("visibility", 'hidden')
                                $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 3) {//anat patologica
                            $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaAnaPatologica').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaanaPatologica').css("visibility", 'visible');
                                $('#btnQuitaranaPatologica').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaanaPatologica').css("visibility", 'hidden')
                                $('#btnQuitaranaPatologica').css("visibility", 'hidden')
                                $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 11) {//sangre
                            $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetabancoSangre').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

                            if (obj.idEstado === 1) {
                                $('#btnAgregabancoSangre').css("visibility", 'visible');
                                $('#btnQuitarbancoSangre').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregabancoSangre').css("visibility", 'hidden')
                                $('#btnQuitarbancoSangre').css("visibility", 'hidden')
                                $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 12) {//sangre
                            $('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaInterconsulta').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 12)
                            Ordenes.SeleccionaRecetaDetalleInterconsultaByIdReceta(obj.idReceta)
                            if (obj.idEstado === 1) {
                                $('#btnAgregainterconsultas').css("visibility", 'visible');
                                $('#btnQuitarinterconsultas').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregainterconsultas').css("visibility", 'hidden')
                                $('#btnQuitarinterconsultas').css("visibility", 'hidden')
                                $('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 22) {//tomografia jdelgado
                            $('#lbltomografia').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetatomografia').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 22)
                            if (obj.idEstado === 1) {
                                $('#btnAgregatomografia').css("visibility", 'visible');
                                $('#btnQuitartomografia').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregatomografia').css("visibility", 'hidden')
                                $('#btnQuitartomografia').css("visibility", 'hidden')
                                $('#lbltomografia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 5) {//farmacia
                            $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaFarmacia').val(obj.idReceta)
                            $('#txtFechaVigencia').val(obj.fechaVigenciaWeb)
                            
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaFarmacia').css("visibility", 'visible');
                                $('#btnQuitarFarmacia').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaFarmacia').css("visibility", 'hidden')
                                $('#btnQuitarFarmacia').css("visibility", 'hidden')
                                $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        else {
                            //Ordenes.listaFecha();
                        }
                    });
                    //('#lblPatoClinica').html("Receta Nro.: " + datos.table3[0]["idReceta"]);
                    //$('#hdIdRecetaPatoClinica').val(datos.table3[0]["idReceta"]);
                }
                else {
                    Ordenes.listaFecha();
                }
                Ordenes.validaActivabtnPaquete();
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar recetas!", "2");
                }, 900)
            }
        });
    },
    asignaPrecio(idproducto, idpuntoCarga, idTipoFinanciamiento) {
        precio=0
        var midata = new FormData();
        midata.append('idproducto', idproducto);
        midata.append('idpuntoCarga', idpuntoCarga);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);

        $.ajax({
            method: "POST",
            url: "/Catalogo/ProductoByIdByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                if (datos.session) {
                    if (datos.listaCatalogo.table.length > 0) {
                        precio = datos.listaCatalogo.table[0]["precioUnitario"]
                    }
                    else {
                        precio = 0
                    }
                }
                else {
                    Alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error asigna precio!", "2");
                    return 0
                }, 900)
            }
        });

        return precio;
    },
    listaCabPaquetes() {
        var midata = new FormData();
        midata.append('tipo', 0);
        midata.append('descripcion', "");

        $.ajax({
            method: "POST",
            url: "/Catalogo/FactCatalogoPaqueteXtipoPaquete?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboPaquetes').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboPaquetes').append('<option  value="' + obj.idFactPaquete + '">' + obj.descripcion + '</option>');
                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");
                    $("#cboPaquetes").change();
                //}
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar paquetes!", "2");
                }, 900)
            }
        });
    },
    ListarEspecialidades() { // JDELGADO011
        fetch('/Utilitario/ListarEspecialidades?area=Comun', {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(res => {
                $('#cboEspecialidades').empty();
                if (res.session) {
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboEspecialidades').append('<option  value="' + obj.idEspecialidad + '">' + obj.nombre + '</option>');
                    });
                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alert("La sesión ya expiró se volverá a recargar la página")
                }
            })
    },
    ListarTiposConsulta() { // JDELGADO011
        fetch('/Utilitario/ListarTiposConsulta?area=Comun', {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(res => {
                $('#cboTipoAtencion').empty();
                if (res.session) {
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboTipoAtencion').append('<option  value="' + obj.idTipoConsulta + '">' + obj.descripcion + '</option>');
                    });
                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alert("La sesión ya expiró se volverá a recargar la página")
                }
            })
    },
    SeleccionaRecetaDetalleInterconsultaByIdReceta(idReceta) { // JDELGADO011
        //console.log("idReceta", idReceta)
        let formData = new FormData()
        formData.append('idReceta', idReceta)
        fetch('/Receta/SeleccionaRecetaDetalleInterconsultaByIdReceta?area=Comun', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(res => {
                $(`#cboEspecialidades option[value='${res.table[0].idEspecialidad}']`).attr("selected", true);
                $(`#cboTipoAtencion option[value='${res.table[0].idTipoConsulta}']`).attr("selected", true);
                $('#txtResumenHistoriaClinica').val(res.table[0].resumenHistoriaClinica)
                $('#txtMotivoInterconsulta').val(res.table[0].motivoInterconsulta)
            })
    },
    listaRecetasByIdRecetaByPuntoCarga(idReceta, idPuntoCarga) {

        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idPuntoCarga', idPuntoCarga);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetaDetalle?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                switch (idPuntoCarga) {
                    case 21:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0) {
                                oTable_rayos.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 23:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0) {
                                oTable_ecoObs.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 20:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0) {
                                oTable_ecoGeneral.fnAddData(datos.table);
                            }
                        }   
                        break;
                    case 2:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0) {
                                oTable_PatoClinica.fnAddData(datos.table);
                            }
                        }
                        break;
                    case 3:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0)
                                oTable_anatPatologica.fnAddData(datos.table);
                        }
                        break;
                    case 11:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0)
                                oTable_bancoSangre.fnAddData(datos.table);
                        }
                        break;
                    case 22:
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0)
                                oTable_tomografia.fnAddData(datos.table);
                        }
                        break;
                    case 12: // jdelgado011
                        if (!isEmpty(datos.table)) {
                            if (datos.table.length !== 0)
                                oTable_interconsulta.fnAddData(datos.table);
                        }
                        break;
                    case 5:
                        if(!isEmpty(datos.table))
                        {
                            if (datos.table.length !== 0)
                                oTable_farmacia.fnAddData(datos.table);
                            else
                                Ordenes.listaFecha();
                        }
                        break;
                    }
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar receta detalle!", "2");
                }, 900)
            }
        });
    },
    activaTabs() {

        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoGene').val(0)
        $('#lblEcoGene').html(0)

        $('#hdIdRecetaPatoClinica').val(0)
        $('#lblPatoClinica').html(0)

        $('#hdIdRecetaAnaPatologica').val(0)
        $('#lblanaPatologica').html(0)

        $('#hdIdRecetabancoSangre').val(0)
        $('#lblbancoSangre').html(0)

        $('#hdIdRecetaFarmacia').val(0)
        $('#lblFarmacia').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        $('[href="#farmacia"]').closest('li').show();
        $('[href="#ecoObst"]').closest('li').show();
        $('[href="#rayos"]').closest('li').show();
        $('[href="#ecoGene"]').closest('li').show();
        $('[href="#anatoPato"]').closest('li').show();
        $('[href="#patoClinica"]').closest('li').show();
        $('[href="#bancoSangre"]').closest('li').show();
        $('[href="#tomografia"]').closest('li').show();

        //$('.nav-tabs a[href="#patoClinica"]').tab('show');
        $('.nav-tabs a[href="#farmacia"]').tab('show');     //KHOYOSI
        $("#cboFarmacia").change();                         //KHOYOSI
    },
    bloqueByPuntoCarga(idReceta, idPuntoCarga) {
       
        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoGene').val(0)
        $('#lblEcoGene').html(0)

        $('#hdIdRecetaPatoClinica').val(0)
        $('#lblPatoClinica').html(0)

        $('#hdIdRecetaAnaPatologica').val(0)
        $('#lblanaPatologica').html(0)

        $('#hdIdRecetabancoSangre').val(0)
        $('#lblbancoSangre').html(0)

        $('#hdIdRecetaFarmacia').val(0)
        $('#lblFarmacia').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        $('[href="#farmacia"]').closest('li').hide();
        $('[href="#ecoObst"]').closest('li').hide();
        $('[href="#rayos"]').closest('li').hide();
        $('[href="#ecoGene"]').closest('li').hide();
        $('[href="#anatoPato"]').closest('li').hide();
        $('[href="#patoClinica"]').closest('li').hide();
        $('[href="#bancoSangre"]').closest('li').hide();
        $('[href="#tomografia"]').closest('li').hide();

        switch (idPuntoCarga) {
            case 21:
                    $('#lblRx').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaRX').val(idReceta);
                $('.nav-tabs a[href="#rayos"]').tab('show');
                $('[href="#rayos"]').closest('li').show();
                break;
            case 23:
                    $('#lblEcoObs').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaEcoObs').val(idReceta);
                $('.nav-tabs a[href="#ecoObst"]').tab('show'); 
                $('[href="#ecoObst"]').closest('li').show();
                break;
            case 20:
                    $('#lblEcoGene').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaEcoGene').val(idReceta);
                $('.nav-tabs a[href="#ecoGene"]').tab('show');    
                $('[href="#ecoGene"]').closest('li').show();
                break;
            case 2:
                    $('#lblPatoClinica').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaPatoClinica').val(idReceta);
                $('.nav-tabs a[href="#patoClinica"]').tab('show');    
                $('[href="#patoClinica"]').closest('li').show();
                break;
            case 3:
                    $('#lblanaPatologica').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaAnaPatologica').val(idReceta);
                $('.nav-tabs a[href="#anatoPato"]').tab('show');
                $('[href="#anatoPato"]').closest('li').show();
                break;
            case 11:
                    $('#lblbancoSangre').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetabancoSangre').val(idReceta);
                $('.nav-tabs a[href="#bancoSangre"]').tab('show');
                $('[href="#bancoSangre"]').closest('li').show();
                break;
            case 22:
                $('#lbltomografia').html("Receta Nro.: " + idReceta);
                $('#hdIdRecetatomografia').val(idReceta);
                $('.nav-tabs a[href="#tomografia"]').tab('show');
                $('[href="#tomografia"]').closest('li').show();
                break;
            case 5:
                    $('#lblFarmacia').html("Receta Nro.: " + idReceta);
                    $('#hdIdRecetaFarmacia').val(idReceta);
                $('.nav-tabs a[href="#farmacia"]').tab('show');
                $('[href="#farmacia"]').closest('li').show();
                break;

            case 12:
                $('#lblInterconsulta').html("Receta Nro.: " + idReceta);
                $('#hdIdRecetaInterconsulta').val(idReceta);
                $('.nav-tabs a[href="#interconsultas"]').tab('show');
                $('[href="#interconsultas"]').closest('li').show();
                break;

        }
    },
    initDatablesCatalogo() {

        var parms = {
            key: true,
            data: null,
            //destroy: true,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogo'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_catalogo = $("#tblCatalogo").dataTable(parms);
    },
    initDatablesPaquetes() {
        var parms = {
            "scrollY": "300px",
            "scrollCollapse": true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "importe",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //cambio vias 
                {
                    visible: false,
                    data: "idViaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    visible: false,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblPaqueteDetalle'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.tblPaqueteDetalle select').select2(); // initialize select2 dropdown
        oTable_paquete = $("#tblPaqueteDetalle").dataTable(parms);
        $('#tblPaqueteDetalle_length').css('display', 'none')
    },
    initDatablesFarmacia() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            //deferRender: true,
            //scroller: true,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0, 
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '40%',
                    targets: 1, 
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 2, 
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                        var inputCantidad = '';                        
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);                        
                    }
                },
                //RQ0003 RMOREANO
                {
                    width: '0%',
                    targets: 3, 
                    visible: false,
                    data: "idDosisRecetada",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 4, 
                    data: "dosis",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    targets: 5, 
                    visible: false,
                    data: "idViaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '15%',
                    targets: 6, 
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '25%',
                    targets: 7,
                    data: "observaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
                        if (rowData.observaciones=="") {
                            caja = '  <input id="txtFrec_' + rowData.idItem + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        } else {
                            caja = '  <input id="txtFrec_' + rowData.idItem + '" value="' + rowData.observaciones +'" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        }
                        $(td).html(caja)
                    }
                }
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblCatalogoFarmacia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmacia = $("#tblCatalogoFarmacia").dataTable(parms);
        $('#tblCatalogoFarmacia_length').css('display', 'none');
    },
    initDatablesEcoObs() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0, 
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1, 
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }

            ],
            fixedColumns: true
        }
        var tableWrapper = $('#tblCatalogoEcoObs'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObs = $("#tblCatalogoEcoObs").dataTable(parms);
        $('#tblCatalogoEcoObs_length').css('display', 'none')
    },
    initDatablesAnatomiaPatologica() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0, 
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1, 
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2, 
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogoAnaPatologica'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_anatPatologica = $("#tblCatalogoAnaPatologica").dataTable(parms);
        $('#tblCatalogoAnaPatologica_length').css('display', 'none')
    },
    initDatablesParologiaClinica() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCatalogoPatoClinica'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_PatoClinica = $("#tblCatalogoPatoClinica").dataTable(parms);
        $('#tblCatalogoPatoClinica_length').css('display', 'none')

    },
    initDatablesBancoSangre() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogobancoSangre'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_bancoSangre = $("#tblCatalogobancoSangre").dataTable(parms);
        $('#tblCatalogobancoSangre_length').css('display', 'none')
    },
    initDatablesTomografia() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogotomografia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_tomografia = $("#tblCatalogotomografia").dataTable(parms);
        $('#tblCatalogotomografia_length').css('display', 'none')
    },
    initDatablesInterconsulta() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCatalogointerconsultas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_interconsulta = $("#tblCatalogointerconsultas").dataTable(parms);
        $('#tblCatalogointerconsultas_length').css('display', 'none')
    },
    initDatablesEcoGeneral() {
        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCatalogoEcoGene'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoGeneral = $("#tblCatalogoEcoGene").dataTable(parms);
        $('#tblCatalogoEcoGene_length').css('display', 'none')

    },
    initDatablesRayos() {

        var parms = {
            "scrollY": "145px",
            "scrollCollapse": true,
            "autoWidth": false,
            data: null,
            destroy: true,
            info: false,
            bFilter: false,
            paging: false,
            responsive: true,
            //scrollY: '40vh',
            //dom: 'Bflr<"table-responsive"t>ip',
            buttons: ['copy', 'csv', 'print'],
            columns: [
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idItem",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '80%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 2,
                    data: "cantidadPedida",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogoRayos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_rayos = $("#tblCatalogoRayos").dataTable(parms);
        $('#tblCatalogoRayos_length').css('display', 'none')

    },
    DevolverRecetaDetalle(idCatalogo) {
        var lstRecetadetalle = []
        var html = "";
        html += '[';
        switch (idCatalogo) {
            case 21:

                dataRx = oTable_rayos.api(true).rows().data();
                dataRx.each(function (value, index) {
                    html += '{"idItem":"' + dataRx[index]["idItem"] + '","cantidadPedida":"' + dataRx[index]["cantidadPedida"] + '","precio":"' + dataRx[index]["precio"] + '","total":"' + dataRx[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });

                break;
            case 23:
                
                dataEcoObs = oTable_ecoObs.api(true).rows().data();
                dataEcoObs.each(function (value, index) {
                    html += '{"idItem":"' + dataEcoObs[index]["idItem"] + '","cantidadPedida":"' + dataEcoObs[index]["cantidadPedida"] + '","precio":"' + dataEcoObs[index]["precio"] + '","total":"' + dataEcoObs[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 20:

                dataEcoGeneral = oTable_ecoGeneral.api(true).rows().data();
                dataEcoGeneral.each(function (value, index) {
                    html += '{"idItem":"' + dataEcoGeneral[index]["idItem"] + '","cantidadPedida":"' + dataEcoGeneral[index]["cantidadPedida"] + '","precio":"' + dataEcoGeneral[index]["precio"] + '","total":"' + dataEcoGeneral[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 3:

                dataanatPatologica = oTable_anatPatologica.api(true).rows().data();
                dataanatPatologica.each(function (value, index) {
                    html += '{"idItem":"' + dataanatPatologica[index]["idItem"] + '","cantidadPedida":"' + dataanatPatologica[index]["cantidadPedida"] + '","precio":"' + dataanatPatologica[index]["precio"] + '","total":"' + dataanatPatologica[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 2:

                dataPatoClinica = oTable_PatoClinica.api(true).rows().data();
                dataPatoClinica.each(function (value, index) {
                    html += '{"idItem":"' + dataPatoClinica[index]["idItem"] + '","cantidadPedida":"' + dataPatoClinica[index]["cantidadPedida"] + '","precio":"' + dataPatoClinica[index]["precio"] + '","total":"' + dataPatoClinica[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 11:
                databancoSangre = oTable_bancoSangre.api(true).rows().data();
                databancoSangre.each(function (value, index) {
                    html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 22:
                dataTomografia = oTable_tomografia.api(true).rows().data();
                dataTomografia.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataTomografia[index]["idItem"];            //KHOYOSI
                    //html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataTomografia[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataTomografia[index]["precio"] + '","total":"' + dataTomografia[index]["total"] + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break

            case 12:
                datainterconsulta = oTable_interconsulta.api(true).rows().data();
                datainterconsulta.each(function (value, index) {
                    html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + datainterconsulta[index]["cantidadPedida"] + '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] + '"},';
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            case 5:

                databafarmacia = oTable_farmacia.api(true).rows().data();
                databafarmacia.each(function (value, index) {
                    var txtFrec = "#txtFrec_" + databafarmacia[index]["idItem"];
                    html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idDosisRecetada":"' + databafarmacia[index]["idDosisRecetada"] + '","idViaAdministracion":"' + databafarmacia[index]["idViaAdministracion"] + '","observaciones":"' + $(txtFrec).val() + '"},';
                });
                break;
        }
        html += ']';
        var htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },
    validaActivabtnPaquete() {
        cantidadFm = oTable_farmacia.api(true).rows().data().length  
        cantidadRx = oTable_farmacia.api(true).rows().data().length 
        cantidadEgen = oTable_ecoGeneral.api(true).rows().data().length
        cantidadEobs = oTable_ecoObs.api(true).rows().data().length
        cantidadPatClin = oTable_PatoClinica.api(true).rows().data().length
        cantidadAntPat = oTable_anatPatologica.api(true).rows().data().length
        cantidadBs = oTable_bancoSangre.api(true).rows().data().length
        cantidadTomografia = oTable_tomografia.api(true).rows().data().length
        if (cantidadFm > 0 ||
            cantidadRx > 0 ||
            cantidadEgen > 0 ||
            cantidadEobs > 0 ||
            cantidadPatClin > 0 ||
            cantidadAntPat > 0 ||
            cantidadBs > 0 ||
            cantidadTomografia > 0)
            {
                $('#btnMuestraPaquete').css("visibility", 'hidden')
                return false;
            }
            else {
                $('#btnMuestraPaquete').css("visibility", 'visible');
                return true;
            }
            
    },
    eventos() {
        $('#btnCargarPaqueteDetalle').on('click', function () {
            Cargando(1);

            if ((Ordenes.validaActivabtnPaquete()) === false) {

                alerta("3", "Ya existen productos en las recetas por lo cual no se puede agregar un paquete", "Aviso");
                Cargando(0);
                return false;

            }
            else {
                dataPq = oTable_paquete.api(true).rows().data();
                dataPq.each(function (value, index) {
                    idPuntoCarga = dataPq[index]["idPuntoCarga"]
                    idProducto = dataPq[index]["idProducto"]
                    idFuente = $('#hdIdTipoFuenteFian').val()
                    precioUnitario = Ordenes.asignaPrecio(idProducto, idPuntoCarga, idFuente)

                    //RQ0002 RMOREANO
                    var objRow
                    if (idPuntoCarga == 5) {
                        //objVia = Ordenes.DevuelveViaxIdProducto(idProducto);
                       
                        //var lstvia = objVia.split("-");


                         objRow = {
                             idItem: idProducto,
                             producto: dataPq[index]["descripcion"],
                             cantidadPedida: dataPq[index]["cantidad"],
                             precio: precioUnitario,
                             total: precioUnitario * dataPq[index]["cantidad"],
                             idDosisRecetada: 1,
                             dosis: "1",
                             idViaAdministracion: dataPq[index]["idViaAdministracion"],
                             vias: dataPq[index]["vias"],
                             observaciones: ""//$('#txtFrecuencia').val()

                        }
                    } else {
                         objRow = {
                            idItem: idProducto,
                            producto: dataPq[index]["descripcion"],
                            cantidadPedida: dataPq[index]["cantidad"],
                            precio: precioUnitario,
                            total: precioUnitario * dataPq[index]["cantidad"]

                        }
                    }
                    // FIN RQ0002
                    

                    switch (idPuntoCarga) {
                        case 21: oTable_rayos.api(true).row.add(objRow).draw(false);
                            break;
                        case 23: oTable_ecoObs.api(true).row.add(objRow).draw(false);
                            break;
                        case 20: oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
                            break;
                        case 2: oTable_PatoClinica.api(true).row.add(objRow).draw(false);
                            break;
                        case 3: oTable_anatPatologica.api(true).row.add(objRow).draw(false);
                            break;
                        case 11: oTable_bancoSangre.api(true).row.add(objRow).draw(false);
                            break;
                        case 5: oTable_farmacia.api(true).row.add(objRow).draw(false);
                            break;
                        case 22: oTable_tomografia.api(true).row.add(objRow).draw(false);
                            break;
                        case 12: oTable_interconsulta.api(true).row.add(objRow).draw(false);
                            break;

                    }
                    Cargando(0)
                    $('#modalPaquete').modal('hide');

                });
            }


            
            
           
         
        });

        $('#btnCerrarPaquete').on('click', function () {
            $('#modalPaquete').modal('hide');
        })
        $('#btnMuestraPaquete').on('click', function () {
            $('#modalPaquete').modal('show');
        })

        $("#cboPaquetes").on("change", function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idPaquete', $("#cboPaquetes").val());
            midata.append('tipo', 0);

            $.ajax({
                method: "POST",
                url: "/Catalogo/FactDetallePaquete?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0);
                    oTable_paquete.fnClearTable();
                    if (datos.table.length > 0) {
                        oTable_paquete.fnAddData(datos.table)
                    }


                },
                error: function (msg) {
                    Cargando(0);
                    setTimeout(function () {
                        //                    Cargando(0);
                        alerta("ERROR", "Error listar detalle de paquete!", "2");
                    }, 900)
                }
            });

        })
        $("#cboFarmacia").on("change", function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idFarmacia', $("#cboFarmacia").val());
            $.ajax({
                method: "POST",
                url: "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun",
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                async: false,
                success: function (datos) {
                    Cargando(0);
                    $('#cboMedicamento').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboMedicamento').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');


                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");

                },
                error: function (msg) {
                    Cargando(0);
                    setTimeout(function () {
                        //                    Cargando(0);
                        alerta("ERROR", "Error listar farmacias!", "2");
                    }, 900)
                }
            });

        })

        $('#btnAgregaFarmacia').on('click', function () {
            Ordenes.agregarProd(5);
        })
        $('#btnQuitarFarmacia').on('click', function () {
            Ordenes.quitarProd(5);
        })

        $('#btnAgregabancoSangre').on('click', function () {
            Ordenes.agregarProd(11);
        })
        $('#btnQuitarbancoSangre').on('click', function () {
            Ordenes.quitarProd(11);
        })

        $('#btnAgregatomografia').on('click', function () {
            Ordenes.agregarProd(22);
        })
        $('#btnQuitartomografia').on('click', function () {
            Ordenes.quitarProd(22);
        })

        $('#btnAgregaPatoClinica').on('click', function () {
            Ordenes.agregarProd(2);
        })
        $('#btnQuitarPatoClinica').on('click', function () {
            Ordenes.quitarProd(2);
        })

        $('#btnAgregaanaPatologica').on('click', function () {
            Ordenes.agregarProd(3);
        })
        $('#btnQuitaranaPatologica').on('click', function () {
            Ordenes.quitarProd(3);
        })

        $('#btnAgregaEcoGene').on('click', function () {
            Ordenes.agregarProd(20);
        })
        $('#btnQuitarEcoGene').on('click', function () {
            Ordenes.quitarProd(20);
        })

        $('#btnAgregaRayosX').on('click', function () {
            Ordenes.agregarProd(21);
        })
        $('#btnQuitarRayos').on('click', function () {
            Ordenes.quitarProd(21);
        })

        $('#btnQuitarEcoObs').on('click', function () {
            Ordenes.quitarProd(23);
        })
        $('#btnAgregaEcoObs').on('click', function () {
            Ordenes.agregarProd(23);
        })

        $('#btnQuitarinterconsultas').on('click', function () {
            Ordenes.quitarProd(12);
        })
        $('#btnAgregainterconsultas').on('click', function () {
            Ordenes.agregarProd(12);
        })

        $('#btLimpiar').on('click', function () {
            Ordenes.limpiarCatalogo();
        })

        $('#btnCerrar').on('click', function () {
            $('#modalBusquedaCatalogo').modal('hide');
        })

        $('#tblCatalogo tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_catalogo.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#tblCatalogoEcoGene tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ecoGeneral.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogoEcoObs tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ecoObs.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });


        $('#tblCatalogoRayos tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_rayos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogoAnaPatologica tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_anatPatologica.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogoPatoClinica tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_PatoClinica.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogobancoSangre tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_bancoSangre.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogotomografia tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_tomografia.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });


        $('#tblCatalogoFarmacia tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_farmacia.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogointerconsultas tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_interconsulta.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });
    },
    ubicaFarmacia(valor) {
      
        $('#cboFarmacia').val(valor)
        $('.chzn-select').chosen().trigger("chosen:updated");
        $("#cboFarmacia").change();
        $('#cboFarmacia').attr('disable', false);
        
    },
    limpiarCatalogo() {
        //oTable_catalogo.fnClearTable();
        oTable_rayos.fnClearTable();
        oTable_ecoObs.fnClearTable();
        oTable_ecoGeneral.fnClearTable();
        oTable_anatPatologica.fnClearTable();
        oTable_bancoSangre.fnClearTable();
        oTable_PatoClinica.fnClearTable();
        oTable_farmacia.fnClearTable();
        oTable_tomografia.fnClearTable();
        oTable_interconsulta.fnClearTable();
        $('#txtCAntidadFarmacia').val(1);
        $('#txtCAntidadRx').val(1);
        $('#txtCAntidadObs').val(1);
        $('#txtCAntidadEcoGeneral').val(1);
        $('#txtCAntidadAPatologica').val(1);
        $('#txtCAntidadPatoClinica').val(1);
        $('#txtCAntidadbancoSangre').val(1);
        $('#txtCAntidadinterconsultas').val(1);
        $('#txtCAntidadtomografia').val(1);
    },


    CargaInicial() {

    },

    quitarProd(idCatalogo) {
        if (idCatalogo == 21) {
            var objselec = oTable_rayos.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_rayos.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 23) {
            var objselec = oTable_ecoObs.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_ecoObs.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 20) {
            var objselec = oTable_ecoGeneral.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_ecoGeneral.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 3) {
            var objselec = oTable_anatPatologica.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_anatPatologica.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }
        if (idCatalogo ==2) {
            var objselec = oTable_PatoClinica.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_PatoClinica.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }
        if (idCatalogo == 11) {
            var objselec = oTable_bancoSangre.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_bancoSangre.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 5) {
            var objselec = oTable_farmacia.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_farmacia.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 12) {
            var objselec = oTable_interconsulta.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_interconsulta.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }

        if (idCatalogo == 22) {
            var objselec = oTable_tomografia.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_tomografia.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }
    },
    existeProd(idproducto,idCatalogo) {
        if (idCatalogo == 21) {
            lstProductosRayos = oTable_rayos.api(true).rows().data();
            if (lstProductosRayos.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosRayos.length; i++) {
                if (lstProductosRayos[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 23) {
            lstProductosEco= oTable_ecoObs.api(true).rows().data();
            if (lstProductosEco.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosEco.length; i++) {
                if (lstProductosEco[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 20) {
            lstProductosEcoGeneral = oTable_ecoGeneral.api(true).rows().data();
            if (lstProductosEcoGeneral.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosEcoGeneral.length; i++) {
                if (lstProductosEcoGeneral[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 3) {
            lstProductosAnatomiaPatologica = oTable_anatPatologica.api(true).rows().data();
            if (lstProductosAnatomiaPatologica.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosAnatomiaPatologica.length; i++) {
                if (lstProductosAnatomiaPatologica[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 2) {
            lstProductosPatoClinica = oTable_PatoClinica.api(true).rows().data();
            if (lstProductosPatoClinica.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosPatoClinica.length; i++) {
                if (lstProductosPatoClinica[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo ==11) {

            lstProductosbancoSangre = oTable_bancoSangre.api(true).rows().data();
            if (lstProductosbancoSangre.length == 0) {
                return false;
            }

            for (var i = 0; i < lstProductosbancoSangre.length; i++) {
                if (lstProductosbancoSangre[i].idItem == idproducto) {
                    return true;
                }
            }

        }

        if (idCatalogo == 22) {

            lstProductostomografia = oTable_tomografia.api(true).rows().data();
            if (lstProductostomografia.length == 0) {
                return false;
            }

            for (var i = 0; i < lstProductostomografia.length; i++) {
                if (lstProductostomografia[i].idItem == idproducto) {
                    return true;
                }
            }

        }

        if (idCatalogo == 12) {
            lstProductosinterconsulta = oTable_interconsulta.api(true).rows().data();
            if (lstProductosinterconsulta.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosinterconsulta.length; i++) {
                if (lstProductosinterconsulta[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 5) {
            lstProductosFarmacia = oTable_farmacia.api(true).rows().data();
            if (lstProductosFarmacia.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosFarmacia.length; i++) {
                if (lstProductosFarmacia[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        return false;
    },
    //////////////////////////////KHOYOSI////////////////////////////////////////
    listaCabeceraRecetasByIdCuentaPorNroEvaluacion(idCuentaAtencion, idTipoFuenteFina, nroEvaluacion, idServicio, idMedico) {

        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)
        var midata = new FormData();

        midata.append('idCuentaAtencion', idCuentaAtencion);
        midata.append('nroEvaluacion', nroEvaluacion);
        midata.append('idServicio', idServicio);
        midata.append('idMedico', idMedico);

        $.ajax({
            method: "POST",
            url: "/Receta/ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,

            success: function (datos) {
                $('#hdIdRecetaRX').val(0)
                $('#lblRx').html(0)

                $('#hdIdRecetaEcoObs').val(0)
                $('#lblEcoObs').html(0)

                $('#hdIdRecetaEcoGene').val(0)
                $('#lblEcoGene').html(0)

                $('#hdIdRecetaPatoClinica').val(0)
                $('#lblPatoClinica').html(0)

                $('#hdIdRecetaAnaPatologica').val(0)
                $('#lblanaPatologica').html(0)

                $('#hdIdRecetabancoSangre').val(0)
                $('#lblbancoSangre').html(0)

                $('#hdIdRecetaFarmacia').val(0)
                $('#lblFarmacia').html(0)

                $('#hdIdRecetaInterconsulta').val(0)
                $('#lblInterconsulta').html(0)

                $('#btnAgregaRayosX').css("visibility", 'visible');
                $('#btnQuitarRayos').css("visibility", 'visible');
                $('#btnAgregaEcoObs').css("visibility", 'visible');
                $('#btnQuitarEcoObs').css("visibility", 'visible');
                $('#btnAgregaEcoGene').css("visibility", 'visible');
                $('#btnQuitarEcoGene').css("visibility", 'visible');
                $('#btnAgregaPatoClinica').css("visibility", 'visible');
                $('#btnQuitarPatoClinica').css("visibility", 'visible');
                $('#btnAgregaanaPatologica').css("visibility", 'visible');
                $('#btnQuitaranaPatologica').css("visibility", 'visible');
                $('#btnAgregabancoSangre').css("visibility", 'visible');
                $('#btnQuitarbancoSangre').css("visibility", 'visible');
                $('#btnAgregaFarmacia').css("visibility", 'visible');
                $('#btnQuitarFarmacia').css("visibility", 'visible');

                if (datos.table.length > 0) {//rx

                    $(datos.table).each(function (i, obj) {
                        if (obj.idPuntoCarga == 21) //rx
                        {
                            $('#lblRx').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaRX').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaRayosX').css("visibility", 'visible');
                                $('#btnQuitarRayos').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaRayosX').css("visibility", 'hidden')
                                $('#btnQuitarRayos').css("visibility", 'hidden')
                                $('#lblRx').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 23) {//eco obs
                            $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoObs').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaEcoObs').css("visibility", 'visible');
                                $('#btnQuitarEcoObs').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaEcoObs').css("visibility", 'hidden')
                                $('#btnQuitarEcoObs').css("visibility", 'hidden')
                                $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 20) {//eco gene
                            $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaEcoGene').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaEcoGene').css("visibility", 'visible');
                                $('#btnQuitarEcoGene').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaEcoGene').css("visibility", 'hidden')
                                $('#btnQuitarEcoGene').css("visibility", 'hidden')
                                $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 2) {//pt clinica
                            $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaPatoClinica').val(obj.idReceta);
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaPatoClinica').css("visibility", 'visible');
                                $('#btnQuitarPatoClinica').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaPatoClinica').css("visibility", 'hidden')
                                $('#btnQuitarPatoClinica').css("visibility", 'hidden')
                                $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 3) {//anat patologica
                            $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaAnaPatologica').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaanaPatologica').css("visibility", 'visible');
                                $('#btnQuitaranaPatologica').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaanaPatologica').css("visibility", 'hidden')
                                $('#btnQuitaranaPatologica').css("visibility", 'hidden')
                                $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 11) {//sangre
                            $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetabancoSangre').val(obj.idReceta)
                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

                            if (obj.idEstado === 1) {
                                $('#btnAgregabancoSangre').css("visibility", 'visible');
                                $('#btnQuitarbancoSangre').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregabancoSangre').css("visibility", 'hidden')
                                $('#btnQuitarbancoSangre').css("visibility", 'hidden')
                                $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        if (obj.idPuntoCarga == 5) {//farmacia
                            $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta);
                            $('#hdIdRecetaFarmacia').val(obj.idReceta)
                            $('#txtFechaVigencia').val(obj.fechaVigenciaWeb)

                            Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
                            if (obj.idEstado === 1) {
                                $('#btnAgregaFarmacia').css("visibility", 'visible');
                                $('#btnQuitarFarmacia').css("visibility", 'visible');
                            }
                            else {
                                $('#btnAgregaFarmacia').css("visibility", 'hidden')
                                $('#btnQuitarFarmacia').css("visibility", 'hidden')
                                $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                            }
                        }
                        else {
                            //Ordenes.listaFecha();
                        }
                        Ordenes.ubicaMedico(obj.idMedicoReceta);
                        //OrdenesRecetasMedicas = datos.table;
                    });

                    //('#lblPatoClinica').html("Receta Nro.: " + datos.table3[0]["idReceta"]);
                    //$('#hdIdRecetaPatoClinica').val(datos.table3[0]["idReceta"]);
                }
                else {
                    Ordenes.ubicaMedico(idMedico);
                    Ordenes.listaFecha();
                }
                OrdenesRecetasMedicas = datos.table;
                console.log(OrdenesRecetasMedicas);
                Ordenes.validaActivabtnPaquete();
            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar recetas!", "2");
                }, 900)
            }
        });
    },

    ObtenerIdMedicoSesion() {
        var idMed = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdMedicoLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idMed = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            }
        });

        return idMed;
    },

    ubicaMedico(valor) {
        //console.log("Medico: " + valor);
        $('#cboMedicoReceta').val(valor);
        if (valor > 0) {
            $('#cboMedicoReceta').attr('disabled', true);
        } else {
            $('#cboMedicoReceta').attr('disabled', false);
        }
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    limpiarCatalogoV2() {
        //oTable_catalogo.fnClearTable();
        oTable_rayos.fnClearTable();
        oTable_ecoObs.fnClearTable();
        oTable_ecoGeneral.fnClearTable();
        oTable_anatPatologica.fnClearTable();
        oTable_bancoSangre.fnClearTable();
        oTable_PatoClinica.fnClearTable();
        oTable_farmacia.fnClearTable();
        oTable_interconsulta.fnClearTable();
        oTable_tomografia.fnClearTable();

        $('#txtCAntidadFarmacia').val(1);
        $('#txtCAntidadRx').val(1);
        $('#txtCAntidadObs').val(1);
        $('#txtCAntidadEcoGeneral').val(1);
        $('#txtCAntidadAPatologica').val(1);
        $('#txtCAntidadPatoClinica').val(1);
        $('#txtCAntidadbancoSangre').val(1);
        $('#txtCAntidadinterconsultas').val(1);

        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoGene').val(0)
        $('#lblEcoGene').html(0)

        $('#hdIdRecetaPatoClinica').val(0)
        $('#lblPatoClinica').html(0)

        $('#hdIdRecetaAnaPatologica').val(0)
        $('#lblanaPatologica').html(0)

        $('#hdIdRecetabancoSangre').val(0)
        $('#lblbancoSangre').html(0)

        $('#hdIdRecetaFarmacia').val(0)
        $('#lblFarmacia').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        //$('#cboMedicoReceta').val(ObtenerIdMedicoSesion());
        //console.log(this.ObtenerIdMedicoSesion());
        Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());
        Ordenes.listaFecha();
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////KHOYOSI/////////////////
    agregarProd(idCatalogo) {
        //////////////////KHOYOSI/////////////////////////////////////
        if ($("#cboMedicoReceta").val() == 0 || $("#cboMedicoReceta").val() == null || $("#cboMedicoReceta").val() == '') {
            alerta(2, "Seleccione el médico que receta.");
            return false;
        }
        /////////////////////////////////////////////////////////////////

        if ($('#hdIdTipoFuenteFian').val() == "" ||  $('#hdIdTipoFuenteFian').val() == 0)
        {
            alerta(3, "Existe problemas con el producto, guarde la atención y vuelva a generar las recetas");
        }
        else{
            if (idCatalogo == 21) {
                var objselec = $("#cboRx option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboRx option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadRx').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboRx option:selected').text(),
                            cantidadPedida: $('#txtCAntidadRx').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadRx').val()
                        }
                        oTable_rayos.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadRx").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 23) {
                var objselec = $("#cboEcoObs option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboEcoObs option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadObs').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboEcoObs option:selected').text(),
                            cantidadPedida: $('#txtCAntidadObs').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadObs').val()
                        }
                        oTable_ecoObs.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadObs").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 20) {
                var objselec = $("#cboecoGene option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboecoGene option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadEcoGeneral').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboecoGene option:selected').text(),
                            cantidadPedida: $('#txtCAntidadEcoGeneral').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadEcoGeneral').val()
                        }
                        oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadEcoGeneral").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 3) {
                var objselec = $("#cboanaPatologica option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {

                    alerta(2, $('#cboanaPatologica option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadAPatologica').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboanaPatologica option:selected').text(),
                            cantidadPedida: $('#txtCAntidadAPatologica').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadAPatologica').val()
                        }
                        oTable_anatPatologica.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadAPatologica").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 2) {
                var objselec = $("#cboPatoClinica option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboPatoClinica option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadPatoClinica').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboPatoClinica option:selected').text(),
                            cantidadPedida: $('#txtCAntidadPatoClinica').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadPatoClinica').val()
                        }
                        oTable_PatoClinica.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadPatoClinica").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 11) {
                var objselec = $("#cbobancoSangre option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cbobancoSangre option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadbancoSangre').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbobancoSangre option:selected').text(),
                            cantidadPedida: $('#txtCAntidadbancoSangre').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadbancoSangre').val()
                        }
                        oTable_bancoSangre.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadbancoSangre").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 22) {
                var objselec = $("#cbotomografia option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cbotomografia option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadtomografia').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbotomografia option:selected').text(),
                            cantidadPedida: $('#txtCAntidadtomografia').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadtomografia').val()
                        }
                        oTable_tomografia.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadtomografia").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 12) {
                var objselec = $("#cbointerconsultas option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cbointerconsultas option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadinterconsultas').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbointerconsultas option:selected').text(),
                            cantidadPedida: $('#txtCAntidadinterconsultas').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadinterconsultas').val()
                        }
                        oTable_interconsulta.api(true).row.add(objRow).draw(false);
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadinterconsultas").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 5) {
                var objselec = $("#cboMedicamento").val()

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboMedicamento option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadFarmacia').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboMedicamento option:selected').text(),
                            cantidadPedida: $('#txtCAntidadFarmacia').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadFarmacia').val(),
                            //RQ0003 RMOREANO 
                            idDosisRecetada: $('#cboDosis').val(),
                            dosis: $('#cboDosis option:selected').text(),
                            idViaAdministracion: $('#cboVia').val(),
                            vias: $('#cboVia option:selected').text(),
                            observaciones: $('#txtFrecuencia').val()
                            //RQ0003 RM
                        }
                        oTable_farmacia.api(true).row.add(objRow).draw(false);
                        oTable_farmacia.fnAdjustColumnSizing();
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadFarmacia").focus();
                        return false;
                    }
                }
            }
        }
    },

    BuscarCatalogo(idPunto, idFarmacia) {
        var midata = new FormData();
        midata.append('idPuntoCarga', idPunto);
        midata.append('idFarmacia', idFarmacia);
        $.ajax({
            method: "POST",
            url: "/Catalogo/CatalogoServiciosSeleccionarSoloConPreciosEnParticular?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (idPunto === 21) {
                    
                    $('#cboRx').empty();
                }
                if (idPunto === 23) {
                    $('#cboEcoObs').empty();
                }
                if (idPunto === 20) {
                    $('#cboecoGene').empty();
                }
                if (idPunto === 3) {
                    $('#cboanaPatologica').empty();
                }
                if (idPunto === 2) {
                    $('#cboPatoClinica').empty();
                }
                if (idPunto === 11) {
                    $('#cbobancoSangre').empty();
                }
                if (idPunto === 12) {
                    $('#cbointerconsultas').empty();
                }
                if (idPunto === 22) {
                    $('#cbotomografia').empty();
                }
                $('.chzn-select').chosen().trigger("chosen:updated");
                //oTable_catalogo.fnClearTable();
                if (!isEmpty(datos.table)) {
                    $(datos.table).each(function (i, obj) {
                        if (obj.idEstado == 1) {

                            if (idPunto === 21) {
                                $('#cboRx').append('<option  idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }

                            if (idPunto === 23) {
                                $('#cboEcoObs').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 20) {
                                $('#cboecoGene').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 3) {
                                $('#cboanaPatologica').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 2) {
                                $('#cboPatoClinica').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 11) {
                                $('#cbobancoSangre').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 12) {
                                $('#cbointerconsultas').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                            if (idPunto === 22) {
                                $('#cbotomografia').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                            }
                        }
                    });
                }
                $('.chzn-select').chosen().trigger("chosen:updated");
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    
    DevuelveViaxIdProducto(idProducto) {
        
        var Via = "";
        
        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idProducto);


        $.ajax({
            method: "POST",
            url: "/Receta/ListarViasAdministracionbyProducto?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,

            success: function (datos) {
                if (datos.table.length > 0) {
                    Via = datos.table[0]["valor"] + "-" + datos.table[0]["descripcion"];

                }
                else {
                    Via = 0 + "-" + "***";
                }

            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error asigna precio!", "2");
                    return 0

                }, 900) 
            }
        });

        return Via;

    },

    /////////////////////KHOYOSI//////////////////////////////////
    listaMedicos() {
        $.ajax({
            method: "POST",
            url: "/Receta/ListaMedicos?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                $('#cboMedicoReceta').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMedicoReceta').append('<option  value="' + obj.idMedico + '">' + obj.dmedico + '</option>');
                });
                $('#cboMedicoReceta').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar farmacias!", "2");
                }, 900)
            }
        });
    },
    /////////////////////////////////////////////////////////////////


    async GuardarOrdenesMedicas() {
        var formData = new FormData();
        let datos;
        let resp = false;

        var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21);
        var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23);
        var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20);
        var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3);
        var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2);
        var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11);
        var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5);
        var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12); // jdelgado011
        var ListaRecetaDetalleTomografia = Ordenes.DevolverRecetaDetalle(22); // jdelgado011

        //rayos
        formData.append('lstRecetaRx', ListaRecetaDetalleRx);
        formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
        //ecoobst
        formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
        formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());
        //EcoGeneral
        formData.append('lstRecetaEcoGeneral', ListaRecetaDetalleEcoGeneral);
        formData.append('idRecetaEcoGene', $('#hdIdRecetaEcoGene').val());
        //anatoPatolg
        formData.append('lstRecetaAnatoPatologica', ListaRecetaDetalleAnatoPatologica);
        formData.append('idRecetaAnaPatologica', $('#hdIdRecetaAnaPatologica').val());
        //patogClinica
        formData.append('lstRecetaPatalogiaClinica', ListaRecetaDetallePatalogiaClinica);
        formData.append('idRecetaPatoClinica', $('#hdIdRecetaPatoClinica').val());
        //patogClinica
        formData.append('lstRecetaBancoSangre', ListaRecetaDetalleBancoSangre);
        formData.append('idRecetaBancoSangre', $('#hdIdRecetabancoSangre').val());
        //farmacia
        formData.append('lstRecetaFarmacia', ListaRecetaDetalleFarmacia);
        formData.append('idRecetaFarmacia', $('#hdIdRecetaFarmacia').val());
        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());

        //JDELGADO011 INTERCONSULTA
        formData.append('lstRecetaInterconsulta', ListaRecetaDetalleInterconsulta); //jdelgado011
        formData.append('idRecetaInterconsulta', $('#hdIdRecetaInterconsulta').val()); //jdelgado011

        //JDELGADO011 TOMOGRAFIA
        formData.append('lstRecetaTomografia', ListaRecetaDetalleTomografia); //jdelgado011
        formData.append('idRecetaTomografia', $('#hdIdRecetatomografia').val()); //jdelgado011

        formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
        formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
        formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
        formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
        //JDELGADO011 INTERCONSULTA


        //formData.append('idMedico', $('#cboMedico').val());
        formData.append('idMedico', $('#cboMedicoReceta').val());
        formData.append('fechaVigencia', $('#txtFechaVigencia').val());
        //formData.append('idServicioReceta', $('#cboProcedencia').val());
        formData.append('idServicioReceta', $('#hdIdServicioPaciente').val());
        formData.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        formData.append('nroEvaluacion', $('#hdNroEvaluacion').val());

        alerta(4, 'Generando recetas, por favor espere.');
        try {
            Cargando(1);
            datos = await
            $.ajax({
                method: "POST",
                url: "/Receta/RegistraRecetas?area=Comun",
                data: formData,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });
            Cargando(0);
            if (datos.session) {
                if (datos.rpt) {
                    if (datos.msjReceta != "") {
                        var recetas = [
                            { "idPuntoCarga": 21, "idReceta": datos.lrcRx },
                            { "idPuntoCarga": 2, "idReceta": datos.lrcPatoClin },
                            { "idPuntoCarga": 3, "idReceta": datos.lrcAnaPato },
                            { "idPuntoCarga": 11, "idReceta": datos.lrcBancoS },
                            { "idPuntoCarga": 20, "idReceta": datos.lrcEcoGene },
                            { "idPuntoCarga": 23, "idReceta": datos.lrcEcoObst },
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmacia },
                            { "idPuntoCarga": 22, "idReceta": datos.lrcTomografia },
                            //{ idPuntoCarga = 12, idReceta = datos.lrcFarmacia },
                        ]
                        VisorReceta.AbrirVisorRecetas(recetas);
                        //idRecetaRX = datos.lrcRx;
                        //idRecetaPatCli = datos.lrcPatoClin;
                        //idRecetaAnatPat = datos.lrcAnaPato;
                        //idRecetaBs = datos.lrcBancoS;
                        //idRecetaEcoGene = datos.lrcEcoGene;
                        //idRecetaEcoObs = datos.lrcEcoObst;
                        //idRecetaFarm = datos.lrcFarmacia;

                        //console.log(idRecetaRx);
                        //console.log(idRecetaPatoClinica);
                        //console.log(idRecetaAnaPatologica);
                        //console.log(idRecetaBancoSangre);
                        //console.log(idRecetaEcoGene);
                        //console.log(idRecetaEcoObs);
                        //console.log(idRecetaFarmacia);

                        swal({
                            title: 'Recetas',
                            text: datos.msjReceta,
                            type: 'info',
                        }).done();

                        resp = true;
                    }

                    alerta('1', 'Se  registro correctamente las recetas');
                    return false
                }
                else {
                    alerta('2', datos.msjReceta);
                }
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            console.error(JSON.stringify(error))
            Cargando(0);
            alerta(3, JSON.stringify(error));
        }

        return resp;
    }

};

$(document).ready(function () {
     
    Ordenes.CargaInicial();
    Ordenes.plugins();
    //Ordenes.initDatablesCatalogo();
    Ordenes.initDatablesFarmacia();
    Ordenes.initDatablesRayos();  
    Ordenes.initDatablesEcoObs();
    Ordenes.initDatablesEcoGeneral();
    Ordenes.initDatablesAnatomiaPatologica();
    Ordenes.initDatablesParologiaClinica();
    Ordenes.initDatablesBancoSangre();
    Ordenes.initDatablesPaquetes();
    Ordenes.initDatablesInterconsulta()
    Ordenes.initDatablesTomografia();
    Ordenes.eventos();
    Ordenes.BuscarCatalogo(21,0);
    Ordenes.BuscarCatalogo(23,0);
    Ordenes.BuscarCatalogo(20,0);
    Ordenes.BuscarCatalogo(3, 0);
    Ordenes.BuscarCatalogo(2, 0);
    Ordenes.BuscarCatalogo(11, 0);
    Ordenes.BuscarCatalogo(12, 0);
    Ordenes.listaFarmacias();
    //Ordenes.listaMedicos();     //KHOYOSI
    Ordenes.listaCabPaquetes();
    //RQ0003 RMOREANO 
    Ordenes.ListarDosis();
    Ordenes.ListarVias();
    //RQ0003  
    Ordenes.ListarMedicos() // JDELGADO010
    Ordenes.ListarEspecialidades() // JDELGADO011
    Ordenes.ListarTiposConsulta() // JDELGADO011
});   



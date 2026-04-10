//window.onbeforeunload = async function (e) { // -M

//const { Decimal } = require("../../../AdmiRE/vendors/decimal.js/decimal");

    
//    if (!isEmpty(EmisionComprobante.codigoGestionCaja)) {
//        e.preventDefault();
//        e.returnValue = ''; // Requerido en algunos navegadores
//        await EmisionComprobante.CierreCaja();
//    }
    
//};

var EmisionComprobante = {
    codigoGestionCaja: '',
    idCaja: 0,
    idPaciente: 0,
    idCuentaAtencion: 0,
    idOrdenPagoVenta: 0,
    idOrdenPagoServicio: 0,
    idOrdenPagoFarmacia: 0,
    idReceta: 0,

    async Iniciar() {
        EmisionComprobante.codigoGestionCaja = $("#txtCodigoGestioncaja").val();
        EmisionComprobante.idCaja = $("#txtIdCaja").val();

        BusqCuentasPacientes.Iniciar();
        BusqRecetasPacientes.Iniciar();

        BusquedaServiciosProductos.Iniciar();

        EmisionComprobante.Eventos();
        await EmisionComprobante.IniciarValoresPorDefecto();
                
        $("#frameExoneradoServiciosProductos").hide();
        $("#frameTotalServiciosProductos").hide();

        
    },

    async IniciarValoresPorDefecto() {
        $('input[name="rdbTipoPagoCaja"][value="1"]').prop('checked', true);
        $('input[name="rdbTipoPagoCaja"][value="1"]').change();
        $('input[name="rdbTipoServicioCaja"][value="10"]').prop('checked', true);
        $('input[name="rdbTipoServicioCaja"][value="10"]').change();
        $("#cboTipoNumeracionHistoriaCaja").val(1);
        $("#cboTipoNumeracionHistoriaCaja").change();
        $("#cboBuscarTipoComprobanteCaja").val("");
        $("#cboBuscarTipoComprobanteCaja").change();
        $("#cboTipoPlanFinanciamientoCaja").val(1);
        $("#cboTipoPlanFinanciamientoCaja").change();
        $("#cboTipoComprobanteCaja").val(3);
        $("#cboTipoComprobanteCaja").change();
        $("#cboTipoFormaPagoCaja").val(1); 
        $("#cboTipoFormaPagoCaja").change();
        $('#cboTipoDocumentoCaja option[value="11"]').attr('disabled', true);

        await EmisionComprobante.ObtenerSiguienteDocumento();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

    },

    Eventos() {

        $('input[name="rdbTipoPagoCaja"]').on('change', function () {
            EmisionComprobante.LimpiarBusqueda();
            EmisionComprobante.TipoPagoCaja_Change();
        });

        $('#cboTipoComprobanteCaja').on('change', async function () {
            await EmisionComprobante.TipoComprobanteCaja_Change();
        });        

        $('#btnLimpiarFiltroCaja').on('click', async  function () {
            EmisionComprobante.LimpiarBusqueda();
        });

        $('#cboTipoDocumentoCaja').on('change', async function () {
            EmisionComprobante.TipoDocumentoIdentidad_Change();
        });

        $('#btnAperturaCaja').on('click', async function () {
            //if (NotaCredito.ValidarDatosObligatoriosRegistro() == true) {
            swal({
                title: 'Apertura',
                text: "¿Esta seguro de realizar la APERTURA DE CAJA?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await EmisionComprobante.AperturaCaja();
                }                
            }, function (dimiss) {

            });//}
        });

        $('#btCierreCaja').on('click', async function () {
            //if (NotaCredito.ValidarDatosObligatoriosRegistro() == true) {
            swal({
                title: 'Cierre',
                text: "¿Esta seguro de realizar el CIERRE DE CAJA?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {
                if (result.isConfirmed) {
                    const resp = await EmisionComprobante.CierreCaja();
                }                                
            }, function (dimiss) {

            });//}
        });

        $('#btnPagarCaja').on('click', async function () {

            const btn = $(this);

            // Evitar doble clickkk
            if (btn.prop('disabled')) return;

            // Deshabilitar el botón
            btn.prop('disabled', true);

            swal({
                title: 'Guardar',
                text: "¿Esta seguro de procesar el pago?",
                icon: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function (result) {

                if (result.isConfirmed) {

                    const resp = await EmisionComprobante.EmisionComprobanteGuardar();

                    if (resp) {
                        EmisionComprobante.LimpiarBusqueda();
                        EmisionComprobante.TipoPagoCaja_Change();
                    }
                }

                // Habilitar de nuevo el botón SOLO si lo deseas
                btn.prop('disabled', false);

            }, function () {
                // Si cierra o cancela → se vuelve a habilitar
                btn.prop('disabled', false);
            });

        });

        $('#btnEliminarComprobante').on('click', async function () {
            let objrowTb = oTable_Comprobantes.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.idEstadoComprobante == 4 || objrowTb.idEstadoComprobante == 6) {
                swal({
                    title: 'ANULAR',
                    text: "¿Esta seguro de anular el comprobante seleccionado?",
                    icon: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function (result) {
                    if (result.isConfirmed) {
                        let resp = await EmisionComprobante.EmisionComprobanteEliminar(objrowTb.idComprobantePago);
                        if (resp) {
                            await GestionCaja.ListarCajaComprobantesPago();
                        }
                    }
                    
                }, function (dimiss) {

                });
            } else {
                if (objrowTb.idEstadoComprobante == 9) {
                    alerta2("info", "", "El comprobante ya se encuentra ANULADO.");
                }
            }

            


        });

        /*------------BUSQUEDA DE HISTORIAS Y DOCUMENTOS----------------------------------*/
        $('#txtNroHistoriaCaja').keypress(async function (e) {
            BusquedaServiciosProductos.Limpiar();
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroHistoriaCaja").blur();
                let tipoPago = $('input[name="rdbTipoPagoCaja"]:checked').val();
                let tipoHistoria = $('#cboTipoNumeracionHistoriaCaja').val();
                let nroHistoria = $('#txtNroHistoriaCaja').val();

                if (tipoPago == 1 && !isEmpty(tipoHistoria) && !isEmpty(nroHistoria)) {
                    if (esNumero(nroHistoria)) {
                        await EmisionComprobante.ObtenerDatosPacienteParaCobrar(tipoHistoria, nroHistoria, '', '');
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }
                    
                }                 
            }
        });

        $('#txtNroDniCaja').keypress(async function (e) {
            BusquedaServiciosProductos.Limpiar();
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroDniCaja").blur();
                let tipoPago = $('input[name="rdbTipoPagoCaja"]:checked').val();                
                let nroDocumento = $('#txtNroDniCaja').val();

                if (tipoPago == 1 && !isEmpty(nroDocumento)) {
                    if (esNumero(nroDocumento)) {
                        await EmisionComprobante.ObtenerDatosPacienteParaCobrar(0, '', nroDocumento, '');
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }
                    
                }
            }
        });
        /*-------------------------------------------------------------------------------------*/

        /*------------BUSQUEDA DE CUENTAS----------------------------------*/
        $('#txtNroCuentaCaja').keypress(async function (e) {
            BusquedaServiciosProductos.Limpiar();
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroCuentaCaja").blur();
                let tipoPago = $('input[name="rdbTipoPagoCaja"]:checked').val();
                let nroCuenta = $('#txtNroCuentaCaja').val();
                
                if (tipoPago == 1 && !isEmpty(nroCuenta)) {
                    if (esNumero(nroCuenta)) {
                        await EmisionComprobante.ObtenerDatosPacienteParaCobrar(0, '', '', nroCuenta);
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }
                    
                } else if (tipoPago == 4 && !isEmpty(nroCuenta)) {
                    if (esNumero(nroCuenta)) {
                        await EmisionComprobante.ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(nroCuenta);
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }
                }
            }
        });

        $('#btnAceptarCAPaciente').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
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

                $("#txtNroCuentaCaja").blur();
                let tipoPago = $('input[name="rdbTipoPagoCaja"]:checked').val();
                let nroCuenta = cuenta.idCuentaAtencion;

                if (tipoPago == 1 && !isEmpty(nroCuenta)) {
                    if (esNumero(nroCuenta)) {
                        await EmisionComprobante.ObtenerDatosPacienteParaCobrar(0, '', '', nroCuenta);
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }

                } else if (tipoPago == 4 && !isEmpty(nroCuenta)) {
                    if (esNumero(nroCuenta)) {
                        await EmisionComprobante.ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(nroCuenta);
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }
                }                               
            }
        });
        /*-------------------------------------------------------------------------------------*/
                
        /*-----------------BUSQUEDA POR ORDEN DE PAGO O PREVENTA---------------------------------------*/
        $('#txtNroOrdenCaja').keypress(async function (e) {
            BusquedaServiciosProductos.Limpiar();
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroOrdenCaja").blur();
                let nroOrden = $('#txtNroOrdenCaja').val();
                if (!isEmpty(nroOrden)) {
                    //Imagenologia.LimpiarCamposMovimiento();
                    //await Imagenologia.BuscarNumeroReceta(nroReceta);
                    if (nroOrden.toUpperCase().endsWith("F")) {
                        let nroPreventa = nroOrden.slice(0, -1); // Quita el último carácter
                        if (esNumero(nroPreventa)) {
                            EmisionComprobante.ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(0, nroPreventa);
                            
                        } else {
                            alter2("info", "", "No es número valido.");
                        }                        
                    } else {
                        let nroOrdenPago = nroOrden;
                        if (esNumero(nroOrdenPago)) {
                            EmisionComprobante.ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(nroOrdenPago, 0);
                            
                        } else {
                            alter2("info", "", "No es número valido.");
                        }                            
                    }                    
                }
            }
        });
        /*---------------------------------------------------------------------------------------------*/

        /*------------BUSQUEDA DE RECETAS----------------------------------*/
        $('#txtNroRecetaCaja').keypress(async function (e) {
            BusquedaServiciosProductos.Limpiar();
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $("#txtNroRecetaCaja").blur();
                let nroReceta = $('#txtNroRecetaCaja').val();
                if (!isEmpty(nroReceta)) {    
                    if (esNumero(nroReceta)) {
                        EmisionComprobante.ObtenerItemsServiciosParaCobrarPorReceta(nroReceta);   
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }                    
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

                $("#txtNroRecetaCaja").blur();
                let nroReceta = receta.idReceta;
                if (!isEmpty(nroReceta)) {
                    if (esNumero(nroReceta)) {
                        EmisionComprobante.ObtenerItemsServiciosParaCobrarPorReceta(nroReceta);
                        
                    } else {
                        alter2("info", "", "No es número valido.");
                    }                    
                }
            }

        });
        /*-----------------------------------------------------------------*/

        /*--------------------------OTROS PAGOS-------------------------------*/
        $('#btnAgregarDepositoGarantia').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(1);
        });
        $('#btnAgregarPagoCuenta').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(2);
        });
        $('#btnAgregarDevolucion').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(3);
        });
        $('#btnOtrosIngresosAdministrativos').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(4);
        });
        $('#btnOtrosIngresosClinica').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(5);
        });
        $('#btnAgregarProcedimientos').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(6);
        });
        $('#btnAgregarFarmacia').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(7);
        });
        $('#btnAgregarCapacitacion').on('click', async function () {
            BusquedaServiciosProductos.Limpiar();
            BusquedaServiciosProductos.cantidadEditable = 0;
            BusquedaServiciosProductos.precioEditable = 1;
            $("#framBusquedaServiciosProductos").hide();
            EmisionComprobante.ObtenerItemsPersonalizadoParaCobrar(8);
        });
        /*-----------------------------------------------------------------*/                   

        /*------------BUSQUEDA COMPROBANTE PAGO----------------------------------*/
        //$('#txtBuscarNroSerieComprobanteCaja , #txtBuscarNroDocumentoComprobanteCaja').keypress(async function (e) {
        //    BusquedaServiciosProductos.Limpiar();
        //    // Comprobar si la tecla presionada es 'Enter' (código 13)
        //    if (e.which == 13) {
        //        e.preventDefault();
        //        let nroSerie = $('#txtBuscarNroSerieComprobanteCaja').val();
        //        let nroDocumento = $('#txtBuscarNroDocumentoComprobanteCaja').val();
        //        if (isEmpty(nroSerie) == false && isEmpty(nroDocumento) == false) {
        //            Imagenologia.LimpiarCamposMovimiento();
        //            await Imagenologia.BuscarComprobantePago(nroSerie, nroDocumento, Imagenologia.idPuntoCarga);
        //        }

        //    }
        //});
        /*-----------------------------------------------------------------*/

        //////////////////////DETECTA CAMBIOS//////////////////////////////////////////////////////////////
        $('#cboTipoPlanFinanciamientoCaja').on('change', async function () {
            BusquedaServiciosProductos.IniciarVariables('S', $('#cboTipoPlanFinanciamientoCaja').val(), null, 1);
        });

        $('#TotalServiciosProductos').on('change', function () {
            EmisionComprobante.Totalizar();
        });

        $('#txtEfectivoComprobanteCaja').on('keyup', function () {
            EmisionComprobante.Efectivo_Change();
        });

        $('#frameDatosFacturacion input').on('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var card = $(this).closest('#frameDatosFacturacion');
                var inputs = card.find('input');
                var index = inputs.index(this);
                if (index + 1 < inputs.length) {
                    inputs.eq(index + 1).focus(); // Salta al siguiente input
                } else {
                    let tipoPago = $('input[name="rdbTipoPagoCaja"]:checked').val();
                    if (tipoPago == 1 || tipoPago == 5) {
                        $('#txtNombreServicioProductoBusqueda').focus();
                    } else {
                        $('#btnPagarCaja').focus();
                    }                    
                }
            }
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'F2') {
                e.preventDefault();
                var $boton = $('#btnPagarCaja'); // o $('.btn-guardar')

                if ($boton.is(':visible')) {
                    $boton.focus();
                    $boton.click();
                }
            }
        });

        
        //////////////////////////////////////////////////////////////////////////////////////////////////

        //////////////////////EFECTOS///////////////////////////////////////////////////////////////
        $('.card-list-radio').on('mouseenter', function () {
            $(this).find('label').show();
            $(this).addClass('expandida');
            //console.log('Cursor encima del div');
        });

        $('.card-list-radio').on('mouseleave', function () {
            const $checked = $(this).find('input[type="radio"]:checked');
            $(this).find('label').hide(); // ocultar todos
            $checked.closest('label').show(); // mostrar el seleccionado
            $(this).removeClass('expandida');

            //console.log('Cursor fuera del div');
        });
        $('.card-list-radio input[type="radio"]').on('change', async function () {
            const $cardListRadio = $(this).parent().parent().parent();
            $cardListRadio.find('label').hide(); // ocultar todos
            $(this).closest('label').show(); // mostrar el seleccionado
            $cardListRadio.removeClass('expandida');
            //console.log($(this).parent().parent().parent());
        });


    },

    ////////////////////////CONSULTA BD//////////////////////////////////////////////////////////////////////////////////////////
    async AperturaCaja() {
        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/AperturaCaja?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        resp = true;
                        location.reload();
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async CierreCaja() {        
        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();
        
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CierreCaja?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {                        
                        resp = true;
                        location.reload();
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    async ObtenerSiguienteDocumento() {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idCaja', EmisionComprobante.idCaja);               //IdCaja
        formData.append('idTipoComprobante', $("#cboTipoComprobanteCaja").val());       //2: Factura    3: Boleta

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerSiguienteDocumento?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta.table[0];
                $("#txtNroSerieComprobanteCaja").val(resp.nroSerie);
                $("#txtNroDocumentoComprobanteCaja").val(resp.nroDocumento);
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ObtenerDatosPacienteParaCobrar(tipoHistoria, historia, nroDocumento, nroCuenta) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('tipoHistoria', tipoHistoria);
        formData.append('historia', historia);
        formData.append('nroDocumento', nroDocumento);
        formData.append('nroCuenta', nroCuenta);

        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerDatosPacienteParaCobrar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                EmisionComprobante.CargarDatosParaCobrar(datos.respuesta);
                $("#txtNombreServicioProductoBusqueda").focus();
            }
            else {
                alerta2("info", "", "No existen datos con la información ingresada.");
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta(idCuenta) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idCuenta', idCuenta);

        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerItemsServiciosFarmaciaParaCobrarPorCuenta?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                EmisionComprobante.CargarDatosParaCobrar(datos.respuesta);
                $("#btnPagarCaja").focus();
            }
            else {
                alerta2("info", "", "No existen datos con la información ingresada.");
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ObtenerItemsServiciosParaCobrarPorReceta(nroReceta) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idReceta', nroReceta);              

        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerItemsServiciosParaCobrarPorReceta?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                EmisionComprobante.CargarDatosParaCobrar(datos.respuesta);
                $("#btnPagarCaja").focus();
            }
            else {
                alerta2("info", "", "No existen datos con la información ingresada.");
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ObtenerItemsServiciosFarmaciaParaCobrarPorOrden(idOrdenPago, idPreventa) {
        let respuesta;
        let resp = false;
        let datos
        let formData = new FormData();

        formData.append('idOrdenPago', idOrdenPago);              
        formData.append('idPreventa', idPreventa);              

        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerItemsServiciosFarmaciaParaCobrarPorOrden?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                EmisionComprobante.CargarDatosParaCobrar(datos.respuesta);
                $("#btnPagarCaja").focus();
            }
            else {
                alerta2("info", "", "No existen datos con la información ingresada.");
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async ObtenerItemsPersonalizadoParaCobrar(idTipoItem) {
        let respuesta;
        let resp = false;
        let datos
        let rspta
        let formData = new FormData();

        formData.append('idCuentaAtencion', EmisionComprobante.idCuentaAtencion);
        formData.append('idTipoItem', idTipoItem);
        
        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/ObtenerItemsPersonalizadoParaCobrar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                rspta = datos.respuesta.table[0];
                if (rspta.errorNumber > 0 && rspta.warningNumber == 0) {
                    alerta2("error", "", rspta.errorMessage);
                    resp = false;
                    return resp;
                }

                if (rspta.warningNumber > 0) {
                    alerta2("warning", "", rspta.warningMessage);
                    resp = false;
                    return resp;
                }
               // console.log(resp.respuesta);
                if (rspta.successNumber > 0) {                    
                    EmisionComprobante.CargarDetalleParaCobrar(datos.respuesta.table1);
                    $(".dPrecioUnitarioServicioProducto").focus();
                    resp = true;
                    return resp;
                }                
            }
            else {
                alerta2("info", "", "No existen datos con la información ingresada.");
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async EmisionComprobanteGuardar() {
        if (parseFloat($("#txtTotalPagarComprobanteCaja").val()) < 0) {
            alerta2("warning", "", "El total es menor a 0 (CERO). No es posible procesar el pago.");
            return false;
        }

        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();
                
        let tipoPagoCaja = $('input[name="rdbTipoPagoCaja"]:checked').val();

        //formData.append('IdCaja', $("#XXXXXXX").val());
        //EmisionComprobante.codigoGestionCaja = 29926;
        formData.append('codigoGestionCaja', EmisionComprobante.codigoGestionCaja);
        formData.append('IdGestionCaja', 0);
        formData.append('IdTipoComprobante', $("#cboTipoComprobanteCaja").val());
        formData.append('IdTipoPago', 1);
        formData.append('IdFormaPago', $("#cboTipoFormaPagoCaja").val());
        formData.append('IdTipoPagoCaja', tipoPagoCaja);
        formData.append('IdPaciente', EmisionComprobante.idPaciente);
        formData.append('IdCuentaAtencion', EmisionComprobante.idCuentaAtencion);
        formData.append('IdTipoFinanciamiento', $("#cboTipoPlanFinanciamientoCaja").val());
        formData.append('IdOrdenPagoVenta', EmisionComprobante.idOrdenPagoVenta);
        //formData.append('IdOrdenPagoServicio', EmisionComprobante.idOrdenPagoServicio);
        //formData.append('IdOrdenPagoFarmacia', EmisionComprobante.idOrdenPagoFarmacia);
        formData.append('IdReceta', EmisionComprobante.idReceta);
        formData.append('IdTipoDocIdentidad', $("#cboTipoDocumentoCaja").val());
        formData.append('NroDocumentoIdentidad', $("#txtNroDocumentoCaja").val());
        //formData.append('DniReceptor', ($("#cboTipoDocumentoCaja").val() != 11 ? $("#txtNroDocumentoCaja").val() : null));
        //formData.append('RUC', ($("#cboTipoDocumentoCaja").val() == 11 ? $("#txtNroDocumentoCaja").val() : null));
        formData.append('RazonSocial', $("#txtRazonSocialCaja").val());
        formData.append('Direccion', $("#txtDireccionCaja").val());
        formData.append('CorreoElectronico', $("#txtCorreoCaja").val());
        formData.append('Observaciones', $("#txtObservacionCaja").val());
        formData.append('detalle', JSON.stringify(BusquedaServiciosProductos.DevolverDetalleServicioProducto()));

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/EmisionComprobanteGuardar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0 && datos.warningNumber == 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                        return resp;
                    }

                    if (datos.successNumber > 0) {
                        mensaje = mensaje + datos.successMessage;
                        if (datos.idComprobantePagoS > 0) {
                            mensaje = mensaje + '<br><br>Comprobante Servicios<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + datos.nroSerieS + '</td><td align="left">' + datos.nroDocumentoS + '</td></tr></table>';
                        }

                        if (datos.idComprobantePagoF > 0) {
                            mensaje = mensaje + '<br><br>Comprobante Farmacia<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + datos.nroSerieF + '</td><td align="left">' + datos.nroDocumentoF + '</td></tr></table>';
                        }
                        
                        alerta2("success", "", mensaje);
                        resp = true;
                        return resp;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async EmisionComprobanteEliminar(idComprobantePago) {
        //if (NotaDebito.ValidarDatosObligatoriosRegistro() == false) {
        //    return false;
        //}

        let respuesta;
        let resp = false;
        let datos;
        let mensaje = '';
        let formData = new FormData();
                
        formData.append('codigoGestionCaja', EmisionComprobante.codigoGestionCaja);        
        formData.append('idComprobantePago', idComprobantePago);

        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/EmisionComprobanteEliminar?area=Caja",
                    //contentType: "application/json; charset=utf-8",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.sesion) {
                if (datos.respuesta.table.length > 0) {
                    datos = datos.respuesta.table[0];
                    if (datos.errorNumber > 0) {
                        alerta2("error", "", datos.errorMessage);
                        resp = false;
                    }

                    if (datos.warningNumber > 0) {
                        alerta2("warning", "", datos.warningMessage);
                        resp = false;
                    }

                    if (datos.successNumber > 0) {
                        mensaje = mensaje + datos.successMessage;
                        if (datos.idComprobantePago > 0) {
                            mensaje = mensaje + '<br><br>Comprobante Anulado<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + datos.nroSerie + '</td><td align="left">' + datos.nroDocumento + '</td></tr></table>';
                        }

                        alerta2("success", "", mensaje);
                        resp = true;
                    }
                }
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////METODOS////////////////////////////////////////////////////////////////////////////////////////
    CargarDatosParaCobrar(datos) {
        if (datos.table.length > 0) {
            cabecera = datos.table[0];
            $("#txtNroHistoriaCaja").val(cabecera.nroHistoriaClinica == 0 ? '' : cabecera.nroHistoriaClinica);
            $("#txtNroDniCaja").val(cabecera.nroDocumento == 0 ? '' : cabecera.nroDocumento);
            $("#txtNroCuentaCaja").val(cabecera.idCuentaAtencion == 0 ? '' : cabecera.idCuentaAtencion);
            $("#txtNroOrdenCaja").val(cabecera.idOrdenPagoVenta == 0 ? '' : cabecera.idOrdenPagoVenta);
            $("#txtNroRecetaCaja").val(cabecera.idReceta == 0 ? '' : cabecera.idReceta);
            $("#cboTipoPlanFinanciamientoCaja").val(cabecera.idTipoFinanciamiento);

            if (cabecera.tieneSeguro == 1) {
                //alerta2("info", "", "El paciente cuenta con seguro.");
                alerta(4, "El paciente cuenta con seguro.");
            }

            //if (cabecera.tieneSeguro == 0) {
                if (cabecera.sePuedePagar == 1) {
                    if (isEmpty(cabecera.validacion)) {
                        EmisionComprobante.idPaciente = cabecera.idPaciente;
                        EmisionComprobante.idCuentaAtencion = cabecera.idCuentaAtencion;
                        EmisionComprobante.idOrdenPagoVenta = cabecera.idOrdenPagoVenta;
                        EmisionComprobante.idReceta = cabecera.idReceta;

                        if ($("#cboTipoComprobanteCaja").val() == 3) {
                            $("#cboTipoDocumentoCaja").val(cabecera.idDocIdentidad);
                            $("#txtNroDocumentoCaja").val(cabecera.nroDocumento == 0 ? '' : cabecera.nroDocumento);
                        }                        
                        $("#txtRazonSocialCaja").val(cabecera.paciente);
                        $("#txtCorreoCaja").val(cabecera.email);
                        $("#txtDireccionCaja").val(cabecera.direccionDomicilio);

                        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

                        if (cabecera.tipoOrden == 'S') {
                            if (datos.table1.length > 0) {
                                detalleListaServicios = datos.table1;
                                $("#TabDetalleServicios").click();
                            }
                        } else if (cabecera.tipoOrden == 'B') {
                            if (datos.table1.length > 0) {
                                detalleListaProductos = datos.table1;
                                $("#TabDetalleProductos").click();
                            }
                        } else if (cabecera.tipoOrden == 'BS') {
                            if (datos.table1.length > 0) {
                                detalleListaServicios = datos.table1;
                                $("#TabDetalleServicios").click();
                            }
                            if (datos.table2.length > 0) {
                                detalleListaProductos = datos.table2;
                                $("#TabDetalleProductos").click();
                            }

                            if (datos.table3.length > 0) {                                
                                $("#txtTotalAdelantoComprobanteCaja").val(datos.table3[0].adelantos);
                            }
                        }

                        EmisionComprobante.Totalizar();
                        //if (datos.table1.length > 0) {
                        //    detalle = datos.table1;
                        //    oTable_DetalleServiciosProductos.fnAddData(detalle);
                        //    oTable_DetalleServiciosProductos.resize();   
                        //    let total = BusquedaServiciosProductos.Totalizar();
                        //    $("#txtTotalComprobanteCaja").val(total);
                        //    $("#txtEfectivoComprobanteCaja").val(total);
                        //}
                    } else {
                        alerta2("info", "", cabecera.validacion);
                    }
                } else if (!isEmpty(cabecera.validacion)) {
                    alerta2("info", "", cabecera.validacion);
                }
            //} else {
            //    alerta2("info", "", "El paciente cuenta con seguro.");
            //}
        } 
    },

    CargarDetalleParaCobrar(detalle) {
        if (detalle.length > 0) {
            detalleListaServicios = detalle;
            $("#TabDetalleServicios").click();
        }

        EmisionComprobante.Totalizar();
    },

    TipoDocumentoIdentidad_Change() {
        let idTipoDoc = $('#cboTipoDocumentoCaja').val();

        if (idTipoDoc == 11) {
            $("#lblNroDocumentoCaja").html("RUC");
            $("#lblRazonSocialCaja").html("Razón Social");
        } else {
            $("#lblNroDocumentoCaja").html("Nº Documento");
            $("#lblRazonSocialCaja").html("Apellidos y Nombres");
        }
    },

    TipoPagoCaja_Change() {
        $("#cboTipoNumeracionHistoriaCaja").attr("disabled", true); $("#cboTipoNumeracionHistoriaCaja").val(1);
        $("#txtNroHistoriaCaja").attr("disabled", true);
        $("#txtNroDniCaja").attr("disabled", true);
        $("#txtNroCuentaCaja").attr("disabled", true); $("#btnmodalBusquedaCuentasAtenciones").hide();
        $("#txtNroOrdenCaja").attr("disabled", true);
        $("#txtNroRecetaCaja").attr("disabled", true); $("#btnmodalBusquedaRecetas").hide();
        $("#cboBuscarTipoComprobanteCaja").attr("disabled", true); $("#cboBuscarTipoComprobanteCaja").val("");
        $("#txtBuscarNroSerieComprobanteCaja").attr("disabled", true);
        $("#txtBuscarNroDocumentoComprobanteCaja").attr("disabled", true);
        $("#cboTipoPlanFinanciamientoCaja").attr("disabled", true); $("#cboTipoPlanFinanciamientoCaja").val(1);

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        BusquedaServiciosProductos.cantidadEditable = 0;
        BusquedaServiciosProductos.precioEditable = 0;
        BusquedaServiciosProductos.productoEditable = 0;
        let valor = $('input[name="rdbTipoPagoCaja"]:checked').val();
        if (valor == 1 || valor == 5) {
            BusquedaServiciosProductos.DesbloquearBusquedaServiciosProductos();
            BusquedaServiciosProductos.BloquearServicios();
            BusquedaServiciosProductos.BloquearProductos();

            if (valor == 1) {
                $("#cboTipoNumeracionHistoriaCaja").removeAttr("disabled");
                $("#txtNroHistoriaCaja").removeAttr("disabled");
                $("#txtNroDniCaja").removeAttr("disabled");
                $("#txtNroCuentaCaja").removeAttr("disabled"); $("#btnmodalBusquedaCuentasAtenciones").show();
                $("#txtNroRecetaCaja").removeAttr("disabled"); $("#btnmodalBusquedaRecetas").show();
            }

            if (valor == 5) {
                $("#cboTipoPlanFinanciamientoCaja").removeAttr("disabled");
            }

            $("#frameDetalleExoneradoServiciosProductos").hide();
            $("#frameDetalleTotalServiciosProductos").hide();
            BusquedaServiciosProductos.cantidadEditable = 1;
            BusquedaServiciosProductos.productoEditable = 1;
        } else if (valor == 2 || valor == 3) {
            BusquedaServiciosProductos.BloquearBusquedaServiciosProductos();

            if (valor == 2) {
                $("#txtNroOrdenCaja").removeAttr("disabled");
                //$("#txtNroRecetaCaja").removeAttr("disabled"); $("#btnmodalBusquedaRecetas").show();

                $("#frameDetalleExoneradoServiciosProductos").show();
                $("#frameDetalleTotalServiciosProductos").show();
            }

            if (valor == 3) {
                $("#cboBuscarTipoComprobanteCaja").removeAttr("disabled");
                $("#txtBuscarNroSerieComprobanteCaja").removeAttr("disabled");
                $("#txtBuscarNroDocumentoComprobanteCaja").removeAttr("disabled");
            }

            
        } else if (valor == 4) {
            BusquedaServiciosProductos.BloquearBusquedaServiciosProductos();
            BusquedaServiciosProductos.DesbloquearServicios();
            BusquedaServiciosProductos.DesbloquearProductos();

            $("#txtNroCuentaCaja").removeAttr("disabled"); $("#btnmodalBusquedaCuentasAtenciones").show();

            $("#frameDetalleExoneradoServiciosProductos").show();
            $("#frameDetalleTotalServiciosProductos").show();
        }

        BusquedaServiciosProductos.Limpiar();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    async TipoComprobanteCaja_Change() {
        await EmisionComprobante.ObtenerSiguienteDocumento();
        let tipoComprobante = $('#cboTipoComprobanteCaja').val();

        if (tipoComprobante == 2) {
            $("#cboTipoDocumentoCaja").val(11);
            $('#cboTipoDocumentoCaja option[value="11"]').removeAttr('disabled');
            $("#cboTipoDocumentoCaja").attr("disabled", true);
        } else if (tipoComprobante == 3) {
            $("#cboTipoDocumentoCaja").val("");            
            $('#cboTipoDocumentoCaja option[value="11"]').attr('disabled', true);
            $("#cboTipoDocumentoCaja").removeAttr("disabled");
        }

        EmisionComprobante.TipoDocumentoIdentidad_Change();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    Totalizar() {        
        //let totalDescuento = parseFloat($("#ExoneradoServiciosProductos").val());
        //let totalAdelanto = parseFloat($("#txtTotalAdelantoComprobanteCaja").val());
        //let total = parseFloat($("#TotalServiciosProductos").val());
        //let totalNeto = parseFloat(total - totalDescuento - totalAdelanto).toFixed(1);

        let totalDescuento = new Decimal(isNull($("#ExoneradoServiciosProductos").val(), 0.00));
        let totalAdelanto = new Decimal(isNull($("#txtTotalAdelantoComprobanteCaja").val(), 0.00));
        let total = new Decimal(isNull($("#TotalServiciosProductos").val(), 0.00));
        let totalNeto = total.minus(totalDescuento).minus(totalAdelanto);

        
        $("#txtTotalExoneradoComprobanteCaja").val(totalDescuento);
        $("#txtTotalComprobanteCaja").val(total);
        $("#txtTotalPagarComprobanteCaja").val(totalNeto.toFixed(1));
        $("#txtEfectivoComprobanteCaja").val(totalNeto.toFixed(1));
        EmisionComprobante.Efectivo_Change();
    },

    Efectivo_Change() {
        let efectivo = new Decimal(isNull($("#txtEfectivoComprobanteCaja").val(), 0.00));
        let totalPagar = new Decimal(isNull($("#txtTotalPagarComprobanteCaja").val(), 0.00));

        let producto = efectivo.minus(totalPagar);

        if (producto < 0) {
            $("#txtFaltaComprobanteCaja").val(producto * -1);
            $("#txtVueltoComprobanteCaja").val(0.00);
        } else {
            $("#txtVueltoComprobanteCaja").val(producto);
            $("#txtFaltaComprobanteCaja").val(0.00);
        }
    },

    LimpiarBusqueda() {
        //EmisionComprobante.codigoGestionCaja = 0;
        EmisionComprobante.idPaciente = 0;
        EmisionComprobante.idCuentaAtencion = 0;
        EmisionComprobante.idOrdenPagoServicio = 0;
        EmisionComprobante.idOrdenPagoFarmacia = 0;
        EmisionComprobante.idOrdenPagoVenta = 0;
        EmisionComprobante.idReceta = 0;

        $("#frameFiltroBusquedaCaja .writing").val("");

        $("#cboTipoNumeracionHistoriaCaja").val(1);
        $("#cboBuscarTipoComprobanteCaja").val(3);
        $("#cboTipoPlanFinanciamientoCaja").val(1);

        EmisionComprobante.LimpiarDatosFacturacion();
        EmisionComprobante.TipoComprobanteCaja_Change();

        BusquedaServiciosProductos.Limpiar();

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarDatosFacturacion() {        
        $("#frameDatosFacturacion .writing").val("");
        $("#cboTipoDocumentoCaja").val("");
        
        EmisionComprobante.TipoDocumentoIdentidad_Change();

        $("#TotalCaja .writing").val("");
        $("#TotalCaja .reading").val("");

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
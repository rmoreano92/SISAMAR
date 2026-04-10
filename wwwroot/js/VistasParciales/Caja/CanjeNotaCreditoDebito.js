var CanjeNotaCD = {
    idTipoNota: 0,
    idNota: 0,

    Iniciar() {
        CanjeNotaCD.Eventos();
    },

    Eventos() {
        $('input[name="rdbTipoNota"]').on('change', function () {
            let valor = $('input[name="rdbTipoNota"]:checked').val();
            if (valor == 2) {
                $("#btnGuardarCanjeNotaCreditoDebito").html("DEVOLUCIÓN");
            } else if (valor == 1) {
                $("#btnGuardarCanjeNotaCreditoDebito").html("CANJEAR");
            }            
        });

        $('.searchNota').keypress(function (e) {            
            // Comprobar si la tecla presionada es 'Enter' (código 13)
            if (e.which == 13) {
                e.preventDefault();
                $('#btnBuscarNotaCreditoDebito').click();
            }
        });

        $('#btnBuscarNotaCreditoDebito').on('click', async function () {
            if (isEmpty($("#txtNroSerieNotaCreditoDebitoBuscar").val())) {
                $("#txtNroSerieNotaCreditoDebitoBuscar").focus();
                alerta2("info", "", "Por ingrese el Nº Serie");
                return false;
            }

            if (isEmpty($("#txtNroDocumentoNotaCreditoDebitoBuscar").val())) {
                $("#txtNroDocumentoNotaCreditoDebitoBuscar").focus();
                alerta2("info", "", "Por ingrese el Nº Documento");
                return false;
            }

            await CanjeNotaCD.NotaCreditoDebitoSeleccionar($('input[name="rdbTipoNota"]:checked').val(), $("#txtNroSerieNotaCreditoDebitoBuscar").val(), $("#txtNroDocumentoNotaCreditoDebitoBuscar").val());
        });

        $('#btnLimpiarNotaCreditoDebito').on('click', async function () {
            CanjeNotaCD.Limpiar();
        });

        $('#btnGuardarCanjeNotaCreditoDebito').on('click', function () {
            let valor = $('input[name="rdbTipoNota"]:checked').val();
            let titulo = '';
            let mensaje = '';
            if (valor == 2) {
                titulo = "DEVOLUCIÓN";
                mensaje = "¿Esta seguro de realizar la DEVOLUCIÓN de la NOTA DE CRÉDITO?";
            } else if (valor == 1) {
                titulo = "CANJEAR";
                mensaje = "¿Esta seguro de realizar el CANJE de la NOTA DE DÉBITO?";
            }   

            if (CanjeNotaCD.idTipoNota > 0 && CanjeNotaCD.idNota > 0) {
                swal({
                    title: titulo,
                    text: mensaje,
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function () {
                    const resp = await CanjeNotaCD.CanjeNotaCreditoDebitoGuardar();
                    if (resp) {
                        CanjeNotaCD.Limpiar();
                    }
                }, function (dimiss) {

                });
            } else {
                alerta2("info", "", "Por favor seleccione una nota de crédito o débito previamente.");
            }
        });

        $('#btnEliminarDevolucionNotaCredito').on('click', async function () {
            let objrowTb = oTable_NotasCredito.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.idEstadoNota == 3) {
                swal({
                    title: 'REVERTIR',
                    text: "¿Esta seguro de revertir la devolución de la nota de crédito seleccionada?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function () {
                    let resp = await CanjeNotaCD.CanjeNotaCreditoDebitoEliminar(objrowTb.idTipoNota, objrowTb.idNota);
                    if (resp) {
                        await GestionCaja.ListarCajaComprobantesPago();
                    }
                }, function (dimiss) {

                });
            } else {
                alerta2("info", "", "La nota de crédito aun no ha sido CANJEADO.");
            }
        });

        $('#btnEliminaCanjeNotaDebito').on('click', async function () {
            let objrowTb = oTable_NotasDebito.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro por favor.');
                return false;
            }

            if (objrowTb.idEstadoNota == 3) {
                swal({
                    title: 'REVERTIR',
                    text: "¿Esta seguro de revertir el canje de la nota de dédito seleccionada?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then(async function () {
                    let resp = await CanjeNotaCD.CanjeNotaCreditoDebitoEliminar(objrowTb.idTipoNota, objrowTb.idNota);
                    if (resp) {
                        await GestionCaja.ListarCajaComprobantesPago();
                    }
                }, function (dimiss) {

                });
            } else {
                alerta2("info", "", "La nota de débito aun no ha sido CANJEADO.");
            }
        });


    },

    async NotaCreditoDebitoSeleccionar(idTipoNota, nroSerie, nroDocumento) {
        let respuesta;
        let resp = false;
        let datos
        let rspta
        let formData = new FormData();
                
        formData.append('idTipoNota', idTipoNota);
        formData.append('nroSerie', nroSerie);
        formData.append('nroDocumento', nroDocumento);

        try {
            Cargando(1);
            oTable_DetalleServiciosProductos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/NotaCreditoDebitoSeleccionar?area=Caja",
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
                    CanjeNotaCD.Limpiar();
                    CanjeNotaCD.CargarDetalleNotaCreditoDebito(datos.respuesta.table1[0]);
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

    async CanjeNotaCreditoDebitoGuardar() {
        let respuesta;
        let resp = false;
        let datos
        let rspta
        let formData = new FormData();
        let mensaje = '';

        formData.append('codigoGestionCaja', EmisionComprobante.codigoGestionCaja);
        formData.append('idTipoNota', CanjeNotaCD.idTipoNota);
        formData.append('idNota', CanjeNotaCD.idNota);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CanjeNotaCreditoDebitoGuardar?area=Caja",
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
                    $("#btnGuardarCanjeNotaCreditoDebito").attr("disabled", true);
                    alerta2("error", "", rspta.errorMessage);
                    resp = false;
                    return resp;
                }

                if (rspta.warningNumber > 0) {
                    alerta2("warning", "", rspta.warningMessage);
                    $("#btnGuardarCanjeNotaCreditoDebito").attr("disabled", true);
                    resp = false;
                    return resp;
                }
                // console.log(resp.respuesta);
                if (rspta.successNumber > 0) {
                    mensaje = mensaje + rspta.successMessage;
                    if (rspta.idNota > 0) {
                        mensaje = mensaje + '<br><br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + rspta.nroSerie + '</td><td align="left">' + rspta.nroDocumento + '</td></tr></table>';
                    }
                    alerta2("success", "", mensaje);

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

    async CanjeNotaCreditoDebitoEliminar(idTipoNota, idNota) {
        let respuesta;
        let resp = false;
        let datos
        let rspta
        let formData = new FormData();
        let mensaje = '';

        formData.append('codigoGestionCaja', EmisionComprobante.codigoGestionCaja);
        formData.append('idTipoNota', idTipoNota);
        formData.append('idNota', idNota);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/GestionCaja/CanjeNotaCreditoDebitoEliminar?area=Caja",
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
                    mensaje = mensaje + rspta.successMessage;
                    if (rspta.idNota > 0) {
                        mensaje = mensaje + '<br><br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Nº Serie</th><th>Nº Documento</th></tr><tr><td align="left">' + rspta.nroSerie + '</td><td align="left">' + rspta.nroDocumento + '</td></tr></table>';
                    }
                    alerta2("success", "", mensaje);

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

    CargarDetalleNotaCreditoDebito(datos) {
        if (datos) {
            CanjeNotaCD.idTipoNota = datos.idTipoNota;
            CanjeNotaCD.idNota = datos.idNota;

            $("#txtTipoNotaCreditoDebito").val(datos.tipoNota);
            $("#txtNroSerieNotaCreditoDebito").val(datos.nroSerie);
            $("#txtNroDocumentoNotaCreditoDebito").val(datos.nroDocumento);
            $("#txtEstadoNotaCreditoDebito").val(datos.estado);
            $("#txtFechaEmisionNotaCreditoDebito").val(datos.fechaHoraEmision);
            $("#txtTipoDocumentoIdentidadNotaCreditoDebito").val(datos.tipoDocumentoIdentidad);
            $("#txtNroDocumentoIdentidadNotaCreditoDebito").val(datos.nroDocumentoIdentidad);
            $("#txtRazonSocialNotaCreditoDebito").val(datos.razonSocial);
            $("#txtDireccionNotaCreditoDebito").val(datos.direccion);
            $("#txtMotivoNotaCreditoDebito").val(datos.motivo);
            $("#txtResponableAprobacionNotaCreditoDebito").val(datos.responsableAprobacion);
            $("#txtConceptoNotaCreditoDebito").val(datos.concepto);
            $("#txtImporteNotaCreditoDebito").val(datos.importe);

            $("#btnGuardarCanjeNotaCreditoDebito").removeAttr("disabled");
        }
    },

    Limpiar() {
        CanjeNotaCD.idTipoNota = 0
        CanjeNotaCD.idNota = 0

        $("#txtNroSerieNotaCreditoDebitoBuscar").val("");
        $("#txtNroDocumentoNotaCreditoDebitoBuscar").val("");

        $("#txtTipoNotaCreditoDebito").val("");
        $("#txtNroSerieNotaCreditoDebito").val("");
        $("#txtNroDocumentoNotaCreditoDebito").val("");
        $("#txtEstadoNotaCreditoDebito").val("");
        $("#txtFechaEmisionNotaCreditoDebito").val("");
        $("#txtTipoDocumentoIdentidadNotaCreditoDebito").val("");
        $("#txtNroDocumentoIdentidadNotaCreditoDebito").val("");
        $("#txtRazonSocialNotaCreditoDebito").val("");
        $("#txtDireccionNotaCreditoDebito").val("");
        $("#txtMotivoNotaCreditoDebito").val("");
        $("#txtResponableAprobacionNotaCreditoDebito").val("");
        $("#txtConceptoNotaCreditoDebito").val("");
        $("#txtImporteNotaCreditoDebito").val("");

        $("#btnGuardarCanjeNotaCreditoDebito").attr("disabled", true);
        
    },


}
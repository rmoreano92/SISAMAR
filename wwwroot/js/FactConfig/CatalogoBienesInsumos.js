var CatalogoBienInsumo = {
    IdProducto: 0,
    IdProductoUnidosis: 0,
    TiposFinanciamiento: JSON.parse($('#dataTiposFinan').attr('data-financiamiento')),
    focusTipoPrecio: "",

    async Iniciar() {
        CatalogoBienInsumo.DataTableBusqueda();
        await CatalogoBienInsumo.Plugins();
        CatalogoBienInsumo.Eventos();
    },

    async Plugins() {
        //let FechaHora = await Utilitario.FechaHoraServidor();        
        //let FechaDia = FechaHora.substring(0, 10);

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        //$("#txtFechaIngresoIniBusq, #txtFechaIngresoFinBusq").datepicker("setDate", FechaDia);

        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';
        $(".maskFecha").mask("Dd/Mm/abcd");


        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $(".maskHora").mask("Hn:Nn");

        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect").chosen({ allow_single_deselect: true });
    },

    ///////////////////////DATATABLE//////////////////////////////////////////////////////////////////////////////
    DataTableBusqueda() {
        var parms = {
            //"paging": false,
            //"bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '45vh',
            columns: [
                {
                    data: "codigo",
                    width: "7%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "producto",
                    width: "23%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioUnitario",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioCompra",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioUltCompra",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioDistribucion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "precioDonacion",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoProducto",
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: null,
                    width: "10%",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        if (rowData.estado == 1) {
                            $(td).html('<span class="chip success">ACTIVO</span >');
                        } else if (rowData.estado == 0) {
                            $(td).html('<span class="chip secondary">INACTIVO</span >');
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        } else {
                            $(td).html("");
                        }
                    }
                },

            ]
        }

        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CatalogoBienesInsumos = $("#tblCatalogoBienesInsumos").dataTable(parms);
    },

    //////////////////////////EVENTOS/////////////////////////////////////////////////////////////////////////////////
    Eventos() {
        $('#btnBuscar').on('click', async function () {
            await CatalogoBienInsumo.FactCatalogoBienesInsumosListar();
        });

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $(".search").blur();
                $("#btnBuscar").click();
            }
        });

        $('#btnLimpiar').on('click', function () {
            CatalogoBienInsumo.LimpiarCamposBusqueda();
        });

        $('#tblCatalogoBienesInsumos tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_CatalogoBienesInsumos.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });

        $('#btnAgregar').on('click', async function () {
            await CatalogoBienInsumo.LimpiarCamposRegistro(); 
            CatalogoBienInsumo.DesbloquearRegistro();
            $("#modalRegistroCatalogoBienInsumo").modal("show");
        });

        $('#btnModificar').on('click', async function () {
            let objrowTb = oTable_CatalogoBienesInsumos.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await CatalogoBienInsumo.LimpiarCamposRegistro();            
            CatalogoBienInsumo.DesbloquearRegistro();
            const resp = await CatalogoBienInsumo.CargarDatos(objrowTb.idProducto);
            if (resp) {                
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                $("#modalRegistroCatalogoBienInsumo").modal("show");
            }
        });

        $('#btnConsultar').on('click', async function () {
            let objrowTb = oTable_CatalogoBienesInsumos.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            await CatalogoBienInsumo.LimpiarCamposRegistro();            
            const resp = await CatalogoBienInsumo.CargarDatos(objrowTb.idProducto);
            if (resp) {
                $(".reading").attr("disabled", true);
                $('.chzn-select-deselect').chosen().trigger("chosen:updated");
                CatalogoBienInsumo.BloquearRegistro();
                $("#modalRegistroCatalogoBienInsumo").modal("show");
            }
        });

        $('#btnEliminar').on('click', async function () {
            let objrowTb = oTable_CatalogoBienesInsumos.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta2("info", "", 'Seleccione un registro.');
                return false;
            }

            swal({
                title: 'ELIMINAR',
                text: "¿Esta seguro de eliminar el producto/insumo?" + '<br><table class="table table-bordered border mx-auto"><tr style="width: 170px;background: lightsteelblue;"><th>Código</th><th>Producto/Insumo</th></tr><tr><td>' + objrowTb.codigo + '</td><td align="left">' + objrowTb.producto + '</td></tr></table>',
                type: 'error',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#ea423e',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'ELIMINAR',
                cancelButtonText: 'CANCELAR',
            }).then(async function () {
                CatalogoBienInsumo.IdProducto = objrowTb.idProducto;
                CatalogoBienInsumo.IdProductoUnidosis = objrowTb.idProductoUnidosis;
                const resp = await CatalogoBienInsumo.FactCatalogoBienInsumoEliminar();
                if (resp) {
                    await CatalogoBienInsumo.LimpiarCamposRegistro();
                    CatalogoBienInsumo.FactCatalogoBienesInsumosListar();
                }
            }, function (dimiss) {

            });

        });
        
        $('#btnGuardarBienInsumo').on('click', async function () {

            swal({
                title: 'Guardar',
                text: "¿Esta seguro de guardar el registro?",
                type: 'question',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#6c6c6c',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {
                const resp = await CatalogoBienInsumo.FactCatalogoBienInsumoGuardar();
                if (resp) {
                    await CatalogoBienInsumo.LimpiarCamposRegistro();
                    CatalogoBienInsumo.FactCatalogoBienesInsumosListar();
                    $("#modalRegistroCatalogoBienInsumo").modal("hide");
                }
            }, function (dimiss) {

            });
        });

        $('#btnCancelarBienInsumo').on('click', async function () {
            await CatalogoBienInsumo.LimpiarCamposRegistro();
            $("#modalRegistroCatalogoBienInsumo").modal("hide");
        });

        //---------------------REGISTRO BIEN E INNSUMO------------------------------------//
        $('#cboGrupoFarmacologicoBI').on('change', async function () {
            await CatalogoBienInsumo.ListarSubGrupoFarmacologico();
        });

        $(".tipoPrecio").focus(function () {
            CatalogoBienInsumo.focusTipoPrecio = this.id;            
        });

        $('#btnIgualarPrecios').on('click', async function () {
            if (!isEmpty(CatalogoBienInsumo.focusTipoPrecio)) {
                let precio = $("#" + CatalogoBienInsumo.focusTipoPrecio).val();
                let tipoPrecio = $("#" + CatalogoBienInsumo.focusTipoPrecio).attr("data-tipoprecio");
                $('[data-tipoprecio="' + tipoPrecio + '"]').val(precio);
            }

            CatalogoBienInsumo.focusTipoPrecio = "";
        });

        $('#chkEsUnidosisBI').on('click', function () {
            CatalogoBienInsumo.EsUnidosis_Change();
        });

        $("#txtxDenominacionBI, #txtxPresentacionBI, #txtxConcentracionBI, #txtFormaFarmaceuticaBI").on("keyup", function (event) {
            $("#txtxNombreBI").val($("#txtxDenominacionBI").val() + " " + $("#txtxPresentacionBI").val() + " " + $("#txtxConcentracionBI").val() + " " + $("#txtFormaFarmaceuticaBI").val());

            //console.log("Tecla soltada:", event.key);
        });

        $('#btnCalcularPrecios').on('click', function () {
            CatalogoBienInsumo.CalcularPrecios();
        });

        //---------------------------ACTUALIZACIÓN DE CATALOGO-------------------------------------//
        $('#btnSubirCatalogoBI').on('click', () => {
            $('#catalogoBI').click();
        });

        $('#catalogoBI').change(function () {
            // Verificar si se seleccionó al menos un archivo
            if (this.files.length > 0) {
                // Mostrar el nombre del archivo seleccionado
                //alerta2("question", "", "Archivo seleccionado:" + this.files[0].name);
                //console.log("Archivo seleccionado:", this.files[0].name);
                swal({
                    title: 'Catalogo Bienes e Insumos',
                    text: 'Se ha seleccionado el archivo <strong style="font-weight: 900;">"' + this.files[0].name + '"</strong>. <br> ¿Esta seguro de procesar este archivo?',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    allowOutsideClick: false
                }).then(async function () {
                    let fileZip = document.getElementById('catalogoBI').files[0];
                    let resp = await CatalogoBienInsumo.ProcesarCatalogoZip(fileZip);
                    if (resp) {
                        //await Laboratorio.ListarImagenesAdjuntas(Laboratorio.idOrden, Laboratorio.idMovimiento, Laboratorio.idProducto);
                    }
                }, function (dimiss) {
                });
            } else {
                alerta2("info", "", "No se seleccionó ningun archivo.");
            }
            
        });


    },

    ///////////////////////////////CONSUMO BD///////////////////////////////////////////////////////////////
    async FactCatalogoBienesInsumosListar() {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        //if (isEmpty($("#txtCodigoProductoBusq").val()) && isEmpty($("#txtNombreProductoBusq").val())) {
        //    alerta2("info", "", "Por favor ingrese algun de los filtros de busqueda.");
        //    return false;
        //}

        data.append('idTipoCatalogo', $("#cboTipoCatalogoBusq").val());
        data.append('codigo', $("#txtCodigoProductoBusq").val());
        data.append('nombre', $("#txtNombreProductoBusq").val());
        
        try {
            Cargando(1);
            oTable_CatalogoBienesInsumos.fnClearTable();
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/FactCatalogoBienesInsumosListar?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                oTable_CatalogoBienesInsumos.fnAddData(datos.respuesta.table);
                oTable_CatalogoBienesInsumos.resize();
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async FactCatalogoBienInsumoSeleccionar(idProducto) {
        var respuesta;
        var resp = false;
        let datos
        var data = new FormData();

        data.append('idProducto', idProducto);

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/FactCatalogoBienInsumoSeleccionar?area=FactConfig",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (datos.respuesta.table.length > 0) {
                resp = datos.respuesta;
            }
            else {
                resp = null;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },


    async ListarSubGrupoFarmacologico() {
        let datos = null;
        let midata = new FormData();
       

        $('#cboSubGrupoFarmacologicoBI').empty();
        $('#cboSubGrupoFarmacologicoBI').append('<option value=""></option>');        
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        try {

            midata.append('idGrupo', $("#cboGrupoFarmacologicoBI").val());

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/ListarFactInsumosSubGrupoFarmacologico?area=FactConfig",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);            
            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboSubGrupoFarmacologicoBI').append('<option value="' + obj.idSubGrupoFarmacologico + '">' + obj.descripcion + '</option>');
            });

            $('#cboSubGrupoFarmacologicoBI').val("");
            $('.chzn-select-deselect').chosen().trigger("chosen:updated");

        } catch (error) {
            Cargando(0);            
            resp = false;
            //console.error(error)
            alerta(3, error);
        }
                
    },

    async FactCatalogoBienInsumoGuardar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('IdProducto', CatalogoBienInsumo.IdProducto);
        formData.append("Codigo", $("#txtCodigoBI").val());
        formData.append("Nombre", $("#txtxNombreBI").val());
        formData.append("NombreComercial", $("#txtxNombreComercialBI").val());
        formData.append("IdGrupoFarmacologico", $("#cboGrupoFarmacologicoBI").val());
        formData.append("IdSubGrupoFarmacologico", $("#cboSubGrupoFarmacologicoBI").val());
        formData.append("IdPartida", $("#cboPartidaBI").val());
        formData.append("IdCentroCosto", $("#cboCentroCostoBI").val());
        formData.append("PrecioCompra", $("#txtPrecioCompraBI").val());
        formData.append("PrecioDistribucion", $("#txtPrecioDistribucionBI").val());
        formData.append("PrecioDonacion", $("#txtPrecioDonacionBI").val());
        formData.append("PrecioUltCompra", $("#txtPrecioUltimaCompraBI").val());
        formData.append("IdTipoSalidaBienInsumo", $("#cboTipoSalidaBI").val());
        formData.append("StockMinimo", $("#txtStockMinimoBI").val());
        formData.append("TipoProducto", $("#cboTipoProductoBI").val());
        formData.append("Denominacion", $("#txtxDenominacionBI").val());
        formData.append("Concentracion", $("#txtxConcentracionBI").val());
        formData.append("Presentacion", $("#txtxPresentacionBI").val());
        formData.append("FormaFarmaceutica", $("#txtFormaFarmaceuticaBI").val());
        formData.append("MaterialEnvase", $("#txtMaterialEnvaseBI").val());
        formData.append("PresentacionEnvase", $("#txtPresentacionEnvaseBI").val());
        formData.append("Fabricante", $("#txtFabricanteBI").val());
        formData.append("IdPaisOrigen", $("#cboPaisOrigenBI").val());
        formData.append("Petitorio", ($("#chkPetitorioBI").is(':checked') ? 1 : 0));
        formData.append("TipoProductoSismed", $("#cboTipoProductoSismedBI").val());

        formData.append("EsUnidosis", ($("#chkPetitorioBI").is(':checked') ? 1 : 0));
        formData.append("IdProductoUnidosis", CatalogoBienInsumo.IdProductoUnidosis);
        formData.append("CodigoUnidosis", $("#txtCodigoUnidosisBI").val());
        formData.append("PresentacionUnidosis", $("#txtPresentacionUnidosisBI").val());
        formData.append("EquivalenciaUnidosis", $("#txtEquivalenciaUnidosisBI").val());
        formData.append("UnidadMedidaUnidosis", $("#txtUnidadMedidaUnidosisBI").val());

        formData.append('detalle', JSON.stringify(CatalogoBienInsumo.DevolverDetallePrecios()));
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/FactCatalogoBienInsumoGuardar?area=FactConfig",
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
                        alerta2("success", "", datos.successMessage);
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

    async FactCatalogoBienInsumoEliminar() {
        var respuesta;
        var resp = false;
        let datos
        var formData = new FormData();

        formData.append('IdProducto', CatalogoBienInsumo.IdProducto);
        formData.append("IdProductoUnidosis", CatalogoBienInsumo.IdProductoUnidosis);
        formData.append('idListBar', ObtenerItemListBar());

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/FactCatalogoBienInsumoEliminar?area=FactConfig",
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
                        alerta2("success", "", datos.successMessage);
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


    async ProcesarCatalogoZip(fileZip) {
        var formData = new FormData();
        let datos;
        let resp = false;
        //let fileImage = document.getElementById('imagenLab').files[0];

        formData.append('fileZip', fileZip);
        formData.append('idListBar', ObtenerItemListBar());

        Cargando(1);        
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/CatalogoBienesInsumos/ProcesarArchivoZip?area=FactConfig",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });            
            Cargando(0);
            if (datos.sesion) {
                if (datos.success) {
                    alerta2("success", "", "Los datos se procesaron correctamente.");
                    resp = true;
                } else {
                    alerta2("error", "", datos.mensaje);
                    resp = false;
                }           
            } else {
                Utilitario.CargarModalInicioSesion();
            }
        } catch (error) {            
            Cargando(0);
            resp = false;
            alerta2('error', '', error);
        }

        return resp;
    },


    ////////////////////METODOS//////////////////////////////////////////////////////////////////////
    async CargarDatos(idProducto) {
        let resp = false;
        let datos = await CatalogoBienInsumo.FactCatalogoBienInsumoSeleccionar(idProducto);
        if (!isEmpty(datos)) {
            let producto = datos.table[0];
            let precios = datos.table1;
            CatalogoBienInsumo.IdProducto = producto.idProducto;
            CatalogoBienInsumo.IdProductoUnidosis = producto.idProductoUnidosis;
            $("#txtCodigoBI").val(producto.codigo);
            $("#txtxNombreBI").val(producto.nombre);
            $("#txtxNombreComercialBI").val(producto.nombreComercial);
            $("#txtxDenominacionBI").val(producto.denominacion);
            $("#txtxPresentacionBI").val(producto.presentacion);
            $("#txtxConcentracionBI").val(producto.concentracion);
            $("#txtFormaFarmaceuticaBI").val(producto.formaFarmaceutica);
            $("#cboPaisOrigenBI").val(producto.idPaisOrigen);
            $("#txtMaterialEnvaseBI").val(producto.materialEnvase);
            $("#txtPresentacionEnvaseBI").val(producto.presentacionEnvase);
            $("#txtFabricanteBI").val(producto.fabricante);              
            $("#chkPetitorioBI").prop("checked", producto.petitorio == 1 ? true : false );
            $("#cboTipoProductoSismedBI").val(producto.tipoProductoSismed);
            $("#cboTipoProductoBI").val(producto.tipoProducto);
            $("#cboTipoSalidaBI").val(producto.idTipoSalidaBienInsumo);
            $("#chkEsUnidosisBI").prop("checked", producto.esUnidosis == 1 ? true : false);    
            CatalogoBienInsumo.EsUnidosis_Change();
            $("#txtCodigoUnidosisBI").val(producto.codigoUnidosis);
            $("#txtPresentacionUnidosisBI").val(producto.presentacionBienInsumo);
            $("#txtEquivalenciaUnidosisBI").val(producto.equivalenciaUnidosis);
            $("#txtUnidadMedidaUnidosisBI").val(producto.unidadMedidaUnidosis);
            $("#cboGrupoFarmacologicoBI").val(producto.idGrupoFarmacologico);
            await CatalogoBienInsumo.ListarSubGrupoFarmacologico();
            $("#cboSubGrupoFarmacologicoBI").val(producto.idSubGrupoFarmacologico);
            $("#cboCentroCostoBI").val(producto.idCentroCosto);
            $("#cboPartidaBI").val(producto.idPartida);

            $("#txtPrecioCompraBI").val(producto.precioCompra);            
            $("#txtPrecioDistribucionBI").val(producto.precioDistribucion);
            $("#txtPrecioDonacionBI").val(producto.precioDonacion);
            $("#txtPrecioUltimaCompraBI").val(producto.precioUltCompra);
            $("#txtStockMinimoBI").val(producto.stockMinimo);

            $(precios).each(function (i, obj) {
                $('#txtPrecioVenta_' + obj.idTipoFinanciamiento).val(obj.precioUnitario);

                if (obj.activo == 1) {
                    $('#rdbHabilitarSi_' + obj.idTipoFinanciamiento).prop("checked", true);
                } else {
                    $('#rdbHabilitarNo_' + obj.idTipoFinanciamiento).prop("checked", true);
                }
                

                if (obj.idTipoFinanciamiento == 1) {
                    $("#txtPrecioVentaBI").val(obj.precioUnitario);
                }                
            });

            resp = true;
        }

        return resp;
    },

    DevolverDetallePrecios() {
        let detallePrecios = [];
        let objItemDetalle = null;

        $.each(CatalogoBienInsumo.TiposFinanciamiento, function (index, item) {
            if (!isEmpty($("#txtPrecioVenta_" + item.idTipoFinanciamiento).val())) {
                objItemDetalle = {
                    IdProducto: CatalogoBienInsumo.IdProducto,
                    IdTipoFinanciamiento: item.idTipoFinanciamiento,
                    PrecioUnitario: $("#txtPrecioVenta_" + item.idTipoFinanciamiento).val(),
                    Activo: ($("#rdbHabilitarSi_" + item.idTipoFinanciamiento).is(':checked') ? 1 : 0),
                }

                detallePrecios.push(objItemDetalle);
            }
            //console.log("ID: " + item.idTipoFinanciamiento);
            //console.log("Nombre: " + item.Nombre);
        });

        return detallePrecios;
    },

    EsUnidosis_Change() {
        $('#txtCodigoUnidosisBI').val("");
        $('#txtPresentacionUnidosisBI').val("");
        $('#txtEquivalenciaUnidosisBI').val("");
        $('#txtUnidadMedidaUnidosisBI').val("");

        if ($('#chkEsUnidosisBI').is(':checked')) {
            $('#txtCodigoUnidosisBI').removeAttr("disabled");
            $('#txtPresentacionUnidosisBI').removeAttr("disabled");
            $('#txtEquivalenciaUnidosisBI').removeAttr("disabled");
            $('#txtUnidadMedidaUnidosisBI').removeAttr("disabled");
        } else {
            $('#txtCodigoUnidosisBI').attr("disabled", true);
            $('#txtPresentacionUnidosisBI').attr("disabled", true);
            $('#txtEquivalenciaUnidosisBI').attr("disabled", true);
            $('#txtUnidadMedidaUnidosisBI').attr("disabled", true);
        }
    },

    async CalcularPrecios() {
        if ($('#txtPrecioCompraBI').val() > 0) {
            let param = await Utilitario.SeleccionarParametro(307);
            valor = param.valorTexto;

            let precioDistribucion = (parseFloat($('#txtPrecioCompraBI').val()) + (parseFloat(valor) * parseFloat($('#txtPrecioCompraBI').val())) / 100).toFixed(2);
            let precioVenta = (parseFloat($('#txtPrecioCompraBI').val()) + ((parseFloat(valor) + parseFloat(valor)) * parseFloat($('#txtPrecioCompraBI').val())) / 100).toFixed(2);

            $('#txtPrecioDistribucionBI').val(precioDistribucion);
            $('#txtPrecioVentaBI').val(precioVenta);
            $('#txtPrecioVenta_1').val(precioVenta);
            $('#txtPrecioVenta_1').focus();

            //console.log(precioDistribucion)
            //console.log(precioVenta)
        }
    },

    async LimpiarCamposRegistro() {
        CatalogoBienInsumo.IdProducto = 0;
        CatalogoBienInsumo.IdProductoUnidosis = 0;

        $('.writing').val('');
        $('.reading').val('');

        $('.writing').removeAttr("checked")
        $(".rdbHabilitarSi").prop('checked', true);

        CatalogoBienInsumo.EsUnidosis_Change();
        //$(".rdbPuntajeEvaluacion").prop('checked', false);
        //$('#sbRs1').collapse('show');
        //$('.nav-tabs a[href="#panelRs113"]').tab('show');

        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    LimpiarCamposBusqueda() {
        $(".search").val("");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
    },

    BloquearRegistro() {
        $(".writing").attr('disabled', 'disabled');
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");
        $("#btnCalcularPrecios").hide();
        $("#btnIgualarPrecios").hide();
        $("#btnGuardarBienInsumo").hide();
    },

    DesbloquearRegistro() {
        $(".writing").removeAttr("disabled");
        $('.chzn-select-deselect').chosen().trigger("chosen:updated");        
        $("#btnCalcularPrecios").show();
        $("#btnIgualarPrecios").show();
        $("#btnGuardarBienInsumo").show();
        //$("#btnEliminarMedicinaReproductiva").hide();

        //let color = $('input[name="EvalMacroColor"]:checked').val();
        //if (color == 9) {
        //    $("#txtEvalMacroColorOpt9").removeAttr("disabled");
        //} else {
        //    $("#txtEvalMacroColorOpt9").attr("disabled", true);
        //}

        //let lugar = $('#cboLugarObtencion').val();
        //if (lugar == 9) {
        //    $("#txtLugarObtencion").removeAttr("disabled");
        //} else {
        //    $("#txtLugarObtencion").attr("disabled", true);
        //}

        //let metodo = $('#cboMetodoObtencion').val();
        //if (metodo == 9) {
        //    $("#txtMetodoObtencion").removeAttr("disabled");
        //} else {
        //    $("#txtMetodoObtencion").attr("disabled", true);
        //}
    },


}



$(document).ready(function () {
    CatalogoBienInsumo.Iniciar();

    //PermisoGeneral.ValidarServicioFirmaDigital();
});
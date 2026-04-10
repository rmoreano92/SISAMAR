let ConsejeriaEstrategiaSanitaria = {
    permisoClasiPaciente: '0',
    idOrden: 0,
    idOrdenPago: 0,

    async CargaInicial() {
        ConsejeriaObstetrica.permisoClasiPaciente = await PermisoGeneral.SeleccionarPermisoGeneral("CLASI_PAC")
        if (ConsejeriaObstetrica.permisoClasiPaciente == '0') {
            $('#divClasificacionPaciente').hide()
        } else {
            $('#divClasificacionPaciente').show()
        }

        let AtencionesCpt = await ConsejeriaObstetrica.BuscaAtencionesCptCEparaFormatoHIS(Variables.IdCuentaAtencion)

        if (AtencionesCpt.listaCpt.table.length > 0) {
            ConsejeriaObstetrica.idOrden = AtencionesCpt.listaCpt.table[0].idOrden
            ConsejeriaObstetrica.idOrdenPago = AtencionesCpt.listaCpt.table[0].idOrdenPago
        } else {
            ConsejeriaObstetrica.idOrden = 0
            ConsejeriaObstetrica.idOrdenPago = 0
        }


        oTable_TiposConsejeria.api(true).data().toArray()

        let tiposConsejeria = oTable_TiposConsejeria.api(true).data().toArray()

        $(tiposConsejeria).each((i, obj) => {
            if (obj.idProducto == 53070) {
                $(".bloquear-campos-lactancia").attr("disabled", false);
            } else {
                $(".bloquear-campos-lactancia").attr("disabled", true);
            }
        })

        await ConsejeriaObstetrica.listaDetalleDespacho(ConsejeriaObstetrica.idOrden)

    },

    Eventos() {
        $("#cboClasisifcacion").on('change', function () {
            $('#txtControles').val(0);
            $('#txtEdadGestacional').val(0);
            $('#txtGestas').val(0);
            var valorClas = $("#cboClasisifcacion").val()
            ConsejeriaObstetrica.Bloqueo(valorClas)
        });

        $('#btnAgregaTipoConsejeria').on('click', async function () {
            await ConsejeriaObstetrica.AgregarTipoConsejeria();
            $("#cboTipoConsejeria").focus();
        })

        $('#cboTipoConsejeria').on('change', async function () {
            if ($('#cboTipoConsejeria').val() == 53070) {
                $(".bloquear-campos-lactancia").attr("disabled", false);
            } else {
                $(".bloquear-campos-lactancia").attr("disabled", true);
            }

        })
    },

    async TiposClasificacionPaciente() {
        let formData = new FormData()
        return HttpClient.Post('/Atencion/TiposClasificacionPaciente?area=ConsultaExterna', formData)
            .then(res => {
                if (res.lsClasiPac.table.length > 0) {
                    //$('#cboClasisifcacionAnest').empty();
                    $('#cboClasisifcacion').empty();
                    $(res.lsClasiPac.table).each(function (i, obj) {
                        console.log()
                        //$('#cboClasisifcacionAnest').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                        $('#cboClasisifcacion').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                    })

                    $('.chzn-select').chosen().trigger("chosen:updated")

                } else {
                    alerta(2, 'Error listar clasificacion!')
                }
            })
    },

    async ListarCptConsejeriaObstetrica() {


        let formData = new FormData()
        return HttpClient.Post('/Atencion/ListarCptConsejeriaObstetrica?area=ConsultaExterna', formData)
            .then(res => {
                if (res.lsClasiPac.table.length > 0) {
                    //$('#cboClasisifcacionAnest').empty();
                    $('#cboTipoConsejeria').empty();
                    $(res.lsClasiPac.table).each(function (i, obj) {
                        console.log()
                        //$('#cboClasisifcacionAnest').append('<option  value="' + obj.id + '">' + obj.descripcion + '</option>');
                        $('#cboTipoConsejeria').append('<option  value="' + obj.idProducto + '" codigo="' + obj.codigo + '"' + '>' + '(' + obj.codigo + ') - ' + obj.nombre + '</option>');
                    })

                    $('#cboTipoConsejeria').val(0)

                    $('.chzn-select').chosen().trigger("chosen:updated")

                } else {
                    alerta(2, 'Error listar clasificacion!')
                }
            })
    },

    //async ListarDxUltimaAtencion() {

    //    let diagnosticos = await Diagnosticos.AtencionesDiagnosticosSeleccionarPorAtencion(Variables.IdAtencion, 1);


    //    if (!isEmpty(diagnosticos)) {

    //        if (diagnosticos.table.length > 0) {
    //            console.log('Tiene diagnosticos')

    //            oTable_DiagnosticosUltimoControlCita.fnClearTable()

    //            if (diagnosticos.table.length > 0) {
    //                oTable_DiagnosticosUltimoControlCita.fnAddData(diagnosticos.table)
    //            }
    //        } else {
    //            console.log('No tiene diagnosticos')

    //            let formData = new FormData()

    //            formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion)

    //            return HttpClient.Post('/Diagnosticos/ListarDxUltimaAtencion?area=ConsultaExterna', formData)
    //                .then(res => {
    //                    if (res.data.table.length > 0) {
    //                        //$('#cboClasisifcacionAnest').empty();
    //                        oTable_DiagnosticosUltimoControlCita.fnClearTable()

    //                        oTable_DiagnosticosUltimoControlCita.fnAddData(res.data.table)

    //                    } else {
    //                        alerta(2, 'Error listar clasificacion!')
    //                    }
    //                })
    //        }
    //    }

    //},


    ExisteProd(idproducto) {

        let lstConsejeria = oTable_TiposConsejeria.api(true).rows().data();
        if (lstConsejeria.length == 0) {
            return false;
        }

        for (var i = 0; i < lstConsejeria.length; i++) {
            if (lstConsejeria[i].idProducto == idproducto) {

                return true;
            }
        }

    },

    async AgregarTipoConsejeria() {
        var objselec = $("#cboTipoConsejeria").val();

        if (isEmpty(objselec)) {
            alerta(2, "Selecciona el tipo de consejeria");
            return false
        }

        if (ConsejeriaObstetrica.ExisteProd(objselec)) {

            alerta(2, $('#cboTipoConsejeria option:selected').text() + " ya fue agregado.");
            return false;
        }
        else {
            if ($('#txtNroConsejeria').val() > 0) {
                var objRow = {
                    idProducto: objselec,
                    codigo: $('#cboTipoConsejeria option:selected').attr("codigo"),
                    nombre: $('#cboTipoConsejeria option:selected').text(),
                    nroConsejeria: $('#txtNroConsejeria').val()
                }
                oTable_TiposConsejeria.api(true).row.add(objRow).draw(false);

                //$('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())

            }
            else {
                alerta(2, "Ingrese una cantidad correcta");
                $("#txtNroConsejeria").focus();
                return false;
            }
        }
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

    async CargarFormData(formData) {


        formData.append("MotivoConsejeria", $("#txtMotivoConsejeria").val());
        formData.append("IdentificacionNecesidades", $("#txtIdentificacionNecesidades").val());
        formData.append("DeteccionSignosAlarma", $("#txtDeteccionSignosAlarma").val());
        formData.append("RecomendacionesSugerencias", $("#txtRecomendacionesSugerencias").val());
        //formData.append("lstDiagnosticosConsejeria", JSON.stringify(oTable_DiagnosticosUltimoControlCita.api(true).data().toArray()));
        formData.append("esConsejeria", 3);

        return formData;
    },

    FactCatalogoServiciosXidTipoFinanciamiento: function (idProducto, idTipoFinanciamiento) {
        let formData = new FormData();
        formData.append("idProducto", idProducto)
        formData.append("idTipoFinanciamiento", idTipoFinanciamiento)

        return HttpClient.Post('/Utilitario/FactCatalogoServiciosXidTipoFinanciamiento?area=Comun', formData).then(res => {
            if (res.dataSet.table.length > 0) {
                return res.dataSet.table
            } else {
                return null
            }

        })
    },

    CargarDetalleConsumo: async function () {
        let tiposConsejeria = oTable_TiposConsejeria.api(true).data().toArray()
        // Iterar sobre tiposConsejeria y llenar detalleConsumo
        let detalleConsumo = []

        for (let i = 0; i < tiposConsejeria.length; i++) {
            let obj = tiposConsejeria[i];
            let items = await ConsejeriaObstetrica.FactCatalogoServiciosXidTipoFinanciamiento(obj.idProducto, Variables.IdTipoFinanciamiento);

            items.forEach(item => {
                detalleConsumo.push({
                    "idProducto": item.idProducto,
                    "cantidad": 1,
                    "precio": item.precioUnitario,
                    "total": item.precioUnitario,
                    "labConfHIS": "",
                    "grupoHIS": 0,
                    "subgrupoHIS": 0,
                });
            });
        }

        return detalleConsumo
    },

    InsertFactCatalogo: async function () {

        let tiposConsejeria = oTable_TiposConsejeria.api(true).data().toArray()

        if (tiposConsejeria.length > 0) {

            let detalleConsumo = await ConsejeriaObstetrica.CargarDetalleConsumo();

            var formData = new FormData();

            formData.append('IdOrden', ConsejeriaObstetrica.idOrden);
            formData.append('idOrdenPago', ConsejeriaObstetrica.idOrdenPago);
            formData.append('IdPuntoCarga', 1);
            formData.append('IdPaciente', Variables.IdPaciente);
            formData.append('IdCuentaAtencion', Variables.IdCuentaAtencion);
            formData.append('IdServicioPaciente', Variables.IdServicioIngreso);
            formData.append('idTipoFinanciamiento', Variables.IdTipoFinanciamiento);
            formData.append('idFuenteFinanciamiento', Variables.IdFuenteFinanciamiento);

            formData.append('IdEstadoFacturacion', 1);
            formData.append('FechaHoraRealizaCpt', Variables.FechaIngreso);
            formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
            formData.append('permiso', 1);

            return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicioV2?area=Facturacion', formData)
                .then(res => {
                    //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                    if (res.estado) {
                        return res
                    } else {
                        alerta(3, res.msg)
                        Cargando(0)
                        return null
                    }
                })
                .catch(e => {
                    alerta(3, 'Error: ' + e)
                })

        }

    },
    async listaDetalleDespacho(idOrden) {
        var midata = new FormData();
        midata.append('idOrden', idOrden);
        oTable_TiposConsejeria.fnClearTable();
        $.ajax({
            method: "POST",
            url: "/ConsumoServicio/FacturacionServicioDespachoDetalleFiltraPorIdOrden?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                if (datos.data.table.length !== 0) {
                    oTable_TiposConsejeria.fnAddData(datos.data.table);
                    Cargando(0)
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });

        $('#lblTotal').html('Total S/' + ConsumoServicio.calculaTotal())
    },
    async BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion) {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        return $.ajax({
            method: "POST",
            url: "/ConsumoServicio/BuscaAtencionesCptCEparaFormatoHIS?area=Facturacion",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                Cargando(0)
                if (datos.session) {
                    if (datos.listaCpt.table.length !== 0) {
                        console.log('datos', datos)
                        return datos.listaCpt.table[0]
                    }
                    Cargando(0)
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

    },


    InitDatablesDiagnosticosUltimoControlCita: () => {

        params = {
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            "autoWidth": false,
            scrollCollapse: true,
            bLengthChange: false,
            bPaginate: false,
            buttons: [],
            columns: [
                {
                    width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false
                },
                { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": visible },
                { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }

            ]
        }

        oTable_DiagnosticosUltimoControlCita = $("#tblDiagnosticosUltimoControlCita").dataTable(params);

    },
    InitDatablesTiposConsejeria: () => {

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
                    data: "idProducto",
                    "visible": false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        //if (rowData.idEstadoFacturacion == 9) {
                        //    $(td).parent().css('color', '#ef6f6c');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                        //if (rowData.idEstadoFacturacion == 4) {
                        //    $(td).parent().css('color', '#00cc99');
                        //    $(td).parent().css('font-weight', 'bold');
                        //}
                    }
                },
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
                },
                {
                    data: "nroConsejeria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }

            ]

        }

        var tableWrapper = $('#tblTiposConsejeria'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_TiposConsejeria = $("#tblTiposConsejeria").dataTable(parms);

    },


    async Iniciar() {
        ConsejeriaEstrategiaSanitaria.CargaInicial();
        ConsejeriaEstrategiaSanitaria.Eventos();

        ConsejeriaEstrategiaSanitaria.InitDatablesDiagnosticosUltimoControlCita()
        ConsejeriaEstrategiaSanitaria.InitDatablesTiposConsejeria()

        await ConsejeriaEstrategiaSanitaria.TiposClasificacionPaciente();
        await ConsejeriaEstrategiaSanitaria.ListarCptConsejeriaObstetrica();
        //await ConsejeriaObstetrica.ListarDxUltimaAtencion();



    }
}
let RegistroVacunas = {

    NroDosis: 0,
    EdadPaciente: 0,
    TipoEdadPaciente: 0,
    IdAtencion: 0,
    IdProducto: 0,
    IdPaciente: 0,
    IdCuentaAtencion: 0,
    IdServicioIngreso: 0,

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaAtencion, #txtFechaVacunacion').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        let dt = new Date();
        let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

        var dia = dt.getDate()
        var mes = parseInt(dt.getMonth()) + 1
        var yyy = dt.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencion').datepicker("setDate", fechaP)
    },

    ListarPersonalInmunizaciones: () => {

        fetch('/Inmunizaciones/ListarPersonalInmunizaciones?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {

                $('#cboVacunador').empty();
                $('#cboSupervisor').empty();
                $(response.data.table).each(function (i, obj) {
                    $('#cboVacunador').append(`<option value="${obj.idEmpleado}">${obj.nombres}</option>`)
                    $('#cboSupervisor').append(`<option value="${obj.idEmpleado}">${obj.nombres}</option>`)
                })

                $('#cboVacunador').val(0);
                $('#cboSupervisor').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },

    ListarTurnosInmunizaciones: () => {

        fetch('/Inmunizaciones/ListarTurnosInmunizaciones?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {

                $('#cboTurno').empty();
                $(response.data.table).each(function (i, obj) {
                    $('#cboTurno').append(`<option value="${obj.idHisTurno}">${obj.descripcion}</option>`)
                })

                $('#cboTurno').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    ListarProcedimientosInmunizaciones: function () {

        return HttpClient.Get('/Inmunizaciones/ListarProcedimientosInmunizaciones?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {

                    oTable_vacunas.fnClearTable()

                    if (res.estado) {
                        if (res.data.table.length > 0) {
                            oTable_vacunas.fnAddData(res.data.table)
                        }

                        return res.data.table[0]
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }
            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    ListaTiposDocumentos: () => {

        fetch('/Utilitario/ListaTiposDocumentos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboTipoDocPaciente').empty();
                $('#cboTipoDocMadre').empty();
                $(response.lsDocumentos.table).each(function (i, obj) {
                    $('#cboTipoDocPaciente').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                    $('#cboTipoDocMadre').append(`<option value="${obj.idDocIdentidad}">${obj.descripcionLarga}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },
    TiposEdadSeleccionarTodos: () => {

        fetch('/Utilitario/TiposEdadSeleccionarTodos?area=Comun', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                $('#cboTipoEdadPaciente').empty();
                $('#cboTipoEdadPaciente').append(`<option value="0">--Seleccionar--</option>`)
                $(response.lsTiposEdad.table).each(function (i, obj) {
                    $('#cboTipoEdadPaciente').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");
            })
    },

    ListarAtencionesInmunizaciones: function (NroCuenta, HistoriaClinica, ApellidoPaterno, fechaIngreso) {
        let formData = new FormData();
        formData.append("NroCuenta", NroCuenta)
        formData.append("HistoriaClinica", HistoriaClinica)
        formData.append("ApellidoPaterno", ApellidoPaterno)
        formData.append("FechaIngreso", fechaIngreso)

        return HttpClient.Post('/Atencion/ListarAtencionesInmunizaciones', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table
                    } else {
                        alerta(2, 'No se encontraron datos del paciente, intente nuevamente')
                        Cargando(0)
                        return null
                    }
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },
    ListarProcedimientosInmunizaciones: function () {

        return HttpClient.Get('/Inmunizaciones/ListarProcedimientosInmunizaciones?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {

                    oTable_vacunas.fnClearTable()

                    if (res.estado) {
                        if (res.data.table.length > 0) {
                            oTable_vacunas.fnAddData(res.data.table)
                        }

                        return res.data.table[0]
                    } else {
                        alerta('3', 'Error: ' + res.msg)
                        return null
                    }
                }
            })
            .catch((e) => {
                alerta(3, 'Algo salio mal ' + e)
                return null
            })
    },

    ListarAtenciones: async function () {
        Cargando(1)

        let atenciones = await RegistroVacunas.ListarAtencionesInmunizaciones($('#txtNroCuentaBusqueda').val(), $('#txtNroHistoriaBusqueda').val(), $('#txtNroApellidoPaternoBusqueda').val(), $('#txtFechaAtencion').val())

        oTable_atenciones.fnClearTable()
        if (atenciones.length > 0) {
            oTable_atenciones.fnAddData(atenciones)
        }

        Cargando(0)
    },

    SeleccionarNroDosis: function (NroDosis) {
        RegistroVacunas.NroDosis = NroDosis

        $('#cboDosisVacunaAplicada').val(RegistroVacunas.NroDosis)

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    InsertarVacunasInmunizaciones: function (IdAtencion, IdPaciente, IdProducto, Dosis, CoMorbilidad, GrupoRiesgo, ContactoTBP, Lote, Fecha, Estrategia, ResponsableVacuna, SupervisorVacuna, Idturno) {

        let formData = new FormData()

        formData.append("IdAtencion", IdAtencion)
        formData.append("IdPaciente", IdPaciente)
        formData.append("IdProducto", IdProducto)
        formData.append("Dosis", Dosis)
        formData.append("CoMorbilidad", CoMorbilidad)
        formData.append("GrupoRiesgo", GrupoRiesgo)
        formData.append("ContactoTBP", ContactoTBP)
        formData.append("Estrategia", Estrategia)
        formData.append("ResponsableVacuna", ResponsableVacuna)
        formData.append("SupervisorVacuna", SupervisorVacuna)
        formData.append("Idturno", Idturno)
        formData.append("Lote", Lote)
        formData.append("Fecha", Fecha)


        return HttpClient.Post('/Inmunizaciones/InsertarVacunasInmunizaciones?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },
    ListarVacunasInmunizacionesByIdAtencionIdProductoDosis: function (IdPaciente, IdProducto, Dosis) {

        let formData = new FormData()

        formData.append("IdPaciente", IdPaciente)
        formData.append("IdProducto", IdProducto)
        formData.append("Dosis", Dosis)


        return HttpClient.Post('/Inmunizaciones/ListarVacunasInmunizacionesByIdAtencionIdProductoDosis?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
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
    InsertFactCatalogo: async function (
        idProducto, idOrden, idOrdenPago, idPuntoCarga, idPaciente, idCuentaAtencion, idServicioPaciente, idTipoFinanciamiento, idFuenteFinanciamiento,
        idEstadoFacturacion, FechaHoraRealizaCpt) {

        let items = await RegistroVacunas.FactCatalogoServiciosXidTipoFinanciamiento(idProducto, idTipoFinanciamiento)
        let detalleConsumo = []
        $(items).each((i, item) => {
            detalleConsumo.push({
                "idProducto": item.idProducto,
                "cantidad": 1,
                "precio": item.precioUnitario,
                "total": item.precioUnitario,
                "labConfHIS": "",
                "grupoHIS": 0,
                "subgrupoHIS": 0,
            })
        })

        var formData = new FormData();

        formData.append('IdOrden', idOrden);
        formData.append('idOrdenPago', idOrdenPago);
        formData.append('IdPuntoCarga', idPuntoCarga);
        formData.append('IdPaciente', idPaciente);
        formData.append('IdCuentaAtencion', idCuentaAtencion);
        formData.append('IdServicioPaciente', idServicioPaciente);
        formData.append('idTipoFinanciamiento', idTipoFinanciamiento);
        formData.append('idFuenteFinanciamiento', idFuenteFinanciamiento);

        formData.append('IdEstadoFacturacion', idEstadoFacturacion);
        formData.append('FechaHoraRealizaCpt', FechaHoraRealizaCpt);
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
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
    },


    GuardarAtencionInmunizaciones: function (IdAtencion) {

        let formData = new FormData()

        formData.append("IdAtencion", IdAtencion)


        return HttpClient.Post('/Inmunizaciones/GuardarAtencionInmunizaciones?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
                Cargando(0)
            })
    },

    InitDatablesAtenciones: () => {

        var parms = {
            "paging": true,
            "ordering": false,
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
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '6%',
                    targets: 5,
                    data: "fecNacim",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 6,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 7,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 10,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                {
                    width: '6%',
                    targets: 11,
                    data: "idEstadoAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }

                },
                ///////////////////////////FUA//////////////////////////////////
                {
                    width: '5%',
                    targets: 13,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.idCuentaFua > 0) {
                            btnImprimeSinF = '<button class="ImprimeFuaSF btn btn-sm btn-warning glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';

                            //const permisoFua = await PermisoGeneral.SeleccionarPermisoGeneral("FUA");
                            if (rowData.codeFua != '0') {
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
                }
                ///////////////////////////////////////////////////////////////////////////
                //////////////////////////KHOYOSI (INFORME)///////////////////////////////////////
                //{
                //    width: '8%',
                //    targets: 11,
                //    data: null,
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).css('text-align', 'center')
                //        if (!isEmpty(rowData.fechaEgreso)) {
                //            var btnRuta = "";
                //            var btnImprime = "";
                //            var btnImprimeSinF = "";
                //            //var rutaBit4Id = "";

                //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            if (rowData.code != '0') {
                //                if (rowData.statusFirma == 1) {
                //                    btnImprimeSinF = "";
                //                    btnImprime = ' <button class="btn btn-sm btn-success glow_button ImprimeInformeCF" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //                } else {
                //                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //                }
                //            }

                //            //if (rowData.idFirmaAtencion > 0) {                            
                //            //    if (AtencionMedica.permisoFirma4Identity == '1') {
                //            //        if (rowData.statusFirma == 0) {
                //            //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            //            //rutaBit4Id = '/Utilitario/FirmaDigitalBitFourId?server=' + PathServerFiles +'&idCuenta=' + rowData.idCuentaAtencion + '&idRegistro=' + rowData.idCuentaAtencion + '&tipo=CE-A';
                //            //            //btnRuta = '<a href="' + rutaBit4Id + '" target="_blank" class="btn btn-sm btn-info" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                //            //            btnRuta = '<button onclick="Utilitario.AbrirServicioFirmaBit4Id(' + rowData.idCuentaAtencion + ',' + rowData.idCuentaAtencion + ', \'CE-A\')" class="btn btn-sm btn-info btnFirmaCE" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                //            //            //btnRuta = '<button class="Firma4Identity btn btn-sm btn-info glow_button" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-pencil"></i> </button>'; // cambiar luego
                //            //        } else {
                //            //            //btnImprime = ' <button class="btnFirma4IdentityImprime btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>'; // cambiar luego
                //            //            btnImprime = ' <button onclick="Utilitario.AbrirDocumentoFirmadoBit4Id(' + rowData.idCuentaAtencion + ',' + rowData.idCuentaAtencion + ', \'CE-A\')" class="btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            //        }
                //            //    } else {
                //            //        if (rowData.statusFirma == 0) {
                //            //            btnImprimeSinF = '<button class="ImprimeInformeSF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-eye"></i> </button>';
                //            //            btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></a>';
                //            //        }
                //            //        if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                //            //            btnImprime = ' <button class="ImprimeInforme btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip" style="margin: 2px;"><i class="fa fa-print"></i> </button>';
                //            //        }
                //            //    }
                //            //}

                //            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                //        }
                //        else {
                //            $(td).html('');
                //        }


                //    }
                //},

            ]

        }

        var tableWrapper = $('#tblAtencion'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atenciones = $("#tblAtencion").dataTable(parms);

    },
    InitDatablesVacunas: () => {

        var parms = {
            "paging": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '35%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosisRN > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosisRN)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosisRN})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente != 2 || RegistroVacunas.TipoEdadPaciente != 1) {
                                    if (RegistroVacunas.TipoEdadPaciente == 4 || (RegistroVacunas.TipoEdadPaciente == 3 && RegistroVacunas.EdadPaciente <= 20)) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosisRN})"><i class="far fa-plus"></i> </button>`;
                                    } else {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosisRN})"><i class="far fa-plus"></i> </button>`;
                                    }
                                }
                            }


                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        console.log('RegistroVacunas.TipoEdadPaciente', RegistroVacunas.TipoEdadPaciente)
                        console.log('RegistroVacunas.EdadPaciente', RegistroVacunas.EdadPaciente)

                        if (rowData.dosis2Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis2Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis2Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 2) {
                                    if (RegistroVacunas.EdadPaciente == 2) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis2Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 2) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis2Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                } else if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis2Meses})"><i class="far fa-plus"></i> </button>`;
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis4Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis4Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 2) {
                                    if (RegistroVacunas.EdadPaciente == 4) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 4) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                } else if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Meses})"><i class="far fa-plus"></i> </button>`;
                                }
                            }

                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis6Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis6Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis6Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 2) {
                                    if (RegistroVacunas.EdadPaciente == 6) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis6Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 6) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis6Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                } else if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis6Meses})"><i class="far fa-plus"></i> </button>`;
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 6,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis7Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis7Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis7Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 2) {
                                    if (RegistroVacunas.EdadPaciente == 7) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis7Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 7) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis7Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                } else if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis7Meses})"><i class="far fa-plus"></i> </button>`;
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis8Meses > 0) {
                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis8Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis8Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 2) {
                                    if (RegistroVacunas.EdadPaciente == 8) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis8Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 8) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis8Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                } else if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis8Meses})"><i class="far fa-plus"></i> </button>`;
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis1Anio > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis1Anio)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    if (RegistroVacunas.EdadPaciente == 1) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 1) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio})"><i class="far fa-plus"></i> </button>`;
                                    }
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis1Anio3Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis1Anio3Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio3Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 1) { // nada funciona, pensar otra logica pipipi
                                    if ((RegistroVacunas.EdadPaciente * 15) == 15) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio3Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if ((RegistroVacunas.EdadPaciente * 15) > 15) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio3Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '10%',
                    targets: 10,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis1Anio6Meses > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis1Anio6Meses)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio6Meses})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    if ((RegistroVacunas.EdadPaciente * 18) == 18) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio6Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if ((RegistroVacunas.EdadPaciente * 18) > 18) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis1Anio6Meses})"><i class="far fa-plus"></i> </button>`;
                                    }
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: null,
                    createdCell: async function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        var btnRuta = "";
                        var btnImprime = "";
                        var btnImprimeSinF = "";

                        if (rowData.dosis4Anios > 0) {

                            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, rowData.idProducto, rowData.dosis4Anios)

                            if (listaVacunas.table.length > 0) {
                                btnImprimeSinF = `<button class="VisualizarVacunaRegistrada btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Anios})"><i class="far fa-eye"></i></button>`;
                            } else {
                                if (RegistroVacunas.TipoEdadPaciente == 1) {
                                    if (RegistroVacunas.EdadPaciente == 4) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-info glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Anios})"><i class="far fa-plus"></i> </button>`;
                                    }
                                    if (RegistroVacunas.EdadPaciente > 4) {
                                        btnImprimeSinF = `<button class="ModalRegistrarVacuna btn btn-sm btn-danger glow_button" title="Visualiza FUA" data-toggle="tooltip" style="margin: 2px;" onclick="RegistroVacunas.SeleccionarNroDosis(${rowData.dosis4Anios})"><i class="far fa-plus"></i> </button>`;
                                    }
                                }
                            }
                        }
                        $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                    }
                }

            ]

        }

        var tableWrapper = $('#tblVacunas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_vacunas = $("#tblVacunas").dataTable(parms);

    },


    LimpiarCampos() {
        $('#cboEstrategia').val(0)
        $('#cboVacunador').val(0)
        $('#cboSupervisor').val(0)
        $('#cboTurno').val(0)
        $('#cboGrupoRiesgoVacunaAplicada').val(0)
        $('#txtLoteVacunaAplicada').val('')
        $('#txtCoMorbilidad').val('')
        $('#txtContactoTBP').val('')
    },

    Events: () => {
        $('#btnBuscarAtenciones').on('click', function () {

            RegistroVacunas.ListarAtenciones()

        })
        $('#btnModificarAtenciones').on('click', function () {

            let objrowTb = oTable_atenciones.api(true).row('.selected').data()

            if (isEmpty(objrowTb)) {
                alerta(2, 'Seleccione un registro')
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show')
                return false
            }

            console.log('objrowTb', objrowTb)
            let dt = new Date();
            let time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes())

            var dia = dt.getDate()
            var mes = parseInt(dt.getMonth()) + 1
            var yyy = dt.getFullYear()
            if (dia < 10)
                dia = '0' + dia //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes
            fechaP = dia + "/" + mes + "/" + yyy

            $('#txtFechaVacunacion').datepicker("setDate", fechaP)
            $('#txtApellidosNombresPaciente').val(`${objrowTb.apellidoPaterno} ${objrowTb.apellidoMaterno} ${objrowTb.primerNombre} ${objrowTb.segundoNombre}`)
            $('#txtNroHistoria').val(`${objrowTb.nroHistoriaClinica}`)
            $('#cboTipoDocPaciente').val(`${objrowTb.idDocIdentidad}`)
            $('#txtNroDocumento').val(`${objrowTb.nroDocumento}`)

            $('#cboTipoDocMadre').val(`${objrowTb.madreTipoDocumento}`)
            $('#txtNroDocMadre').val(`${objrowTb.madreDocumento}`)
            $('#txtApellidosNombresMadre').val(`${objrowTb.madreApellidoPaterno} ${objrowTb.madreApellidoMaterno} ${objrowTb.madrePrimerNombre} ${objrowTb.madreSegundoNombre}`)

            RegistroVacunas.EdadPaciente = objrowTb.edad
            RegistroVacunas.TipoEdadPaciente = objrowTb.idTipoEdad
            RegistroVacunas.IdAtencion = objrowTb.idAtencion
            RegistroVacunas.IdPaciente = objrowTb.idPaciente
            RegistroVacunas.IdCuentaAtencion = objrowTb.idCuentaAtencion
            RegistroVacunas.IdServicioIngreso = objrowTb.idServicioIngreso


            RegistroVacunas.ListarProcedimientosInmunizaciones()

            RegistroVacunas.LimpiarCampos()

            $('#lblEdadPaciente').text(`(Edad ${objrowTb.edad} ${objrowTb.tipoEdad})`)

            $('.chzn-select').chosen().trigger("chosen:updated");

            MostrarAreaRegistro();
            $("#atencion-tab").click();

        })
        $("#btnCerrarAtencion").on('click', function () {
            swal({
                title: 'Salir',
                text: '¿Estas seguro de  Salir?',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(function () {

                $('#btnBuscarAtenciones').click()
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                ReposicionarVista();        //KHOYOSI
                MostrarAreaLista();         //KHOYOSI
                CerrarModulo();             //KHOYOSI
                //$("#lsAtenciones-tab").css("pointer-events", ""); // JDELGADO J0 CAMBIAR EN LA VISTA
            }).catch(swal.noop);

        });
        $('#btnCerrarModal').on('click', function () {
            //TamizajeNeonatal.LimpiarCampos()
            RegistroVacunas.LimpiarCampos()
            $('#modalRegistroVacuna').modal('hide')
        })

        $('#btnRegistrarVacuna').on('click', async function () {
            Cargando(1)
            let registro = await RegistroVacunas.InsertarVacunasInmunizaciones(
                IdAtencion = RegistroVacunas.IdAtencion, IdPaciente = RegistroVacunas.IdPaciente, IdProducto = RegistroVacunas.IdProducto, Dosis = $('#cboDosisVacunaAplicada').val(),
                CoMorbilidad = $('#txtCoMorbilidad').val(), GrupoRiesgo = $('#cboGrupoRiesgoVacunaAplicada').val(), ContactoTBP = $('#txtContactoTBP').val(),
                Lote = $('#txtLoteVacunaAplicada').val(), Fecha = $('#txtFechaVacunacion').val(), Estrategia = $('#cboEstrategia').val(), ResponsableVacuna = $('#cboVacunador').val(),
                SupervisorVacuna = $('#cboSupervisor').val(), Idturno = $('#cboTurno').val())


            let FactCatalogoServicio = await RegistroVacunas.InsertFactCatalogo(
                RegistroVacunas.IdProducto, 0, 0, 1, RegistroVacunas.IdPaciente, RegistroVacunas.IdCuentaAtencion, RegistroVacunas.IdServicioIngreso, 2,
                3, 1, $('#txtFechaVacunacion').val())

            //console.log('FactCatalogoServicio', FactCatalogoServicio)
            console.log('registro', registro)

            RegistroVacunas.ListarProcedimientosInmunizaciones()

            $('#modalRegistroVacuna').modal('hide')
            Cargando(0)
        })

        $('#btnGuardarAtencion').on('click', async function () {
            swal({
                title: 'Guardar',
                text: '¿Estas seguro de guardar la atencion?',
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                confirmButtonColor: '#4fb7fe',
                cancelButtonColor: '#706f6f',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async function () {

                Cargando(1)


                let registro = await RegistroVacunas.GuardarAtencionInmunizaciones(IdAtencion = RegistroVacunas.IdAtencion)


                //let FactCatalogoServicio = await RegistroVacunas.InsertFactCatalogo(
                //    RegistroVacunas.IdProducto, 0, 0, 1, RegistroVacunas.IdPaciente, RegistroVacunas.IdCuentaAtencion, RegistroVacunas.IdServicioIngreso, 2,
                //    3, 1, $('#txtFechaVacunacion').val())

                //console.log('FactCatalogoServicio', FactCatalogoServicio)
                console.log('registro', registro)

                RegistroVacunas.ListarProcedimientosInmunizaciones()

                $('#modalRegistroVacuna').modal('hide')
                $('#btnBuscarAtenciones').click()
                $('.nav-tabs a[href="#lsAtenciones"]').tab('show');
                ReposicionarVista();        //KHOYOSI
                MostrarAreaLista();         //KHOYOSI
                CerrarModulo();             //KHOYOSI
                Cargando(0)

            }).catch(swal.noop);



        })

        $('#tblAtencion tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atenciones.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
        $('#tblVacunas tbody').on('click', '.ModalRegistrarVacuna', async function () {
            var objrow = oTable_vacunas.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_vacunas.fnGetData(objrow)


            $('#txtCodigoVacunaAplicada').val(row.codigo)
            $('#txtDescripcionVacunaAplicada').val(row.nombre)
            $('#cboDosisVacunaAplicada').val(RegistroVacunas.NroDosis)

            RegistroVacunas.IdProducto = row.idProducto


            $('.chzn-select').chosen().trigger("chosen:updated");

            $('#modalRegistroVacuna').modal('show')
            console.log('row', row)
        });

        $('#tblVacunas tbody').on('click', '.VisualizarVacunaRegistrada', async function () {
            var objrow = oTable_vacunas.api(true).row($(this).parents("tr")[0]).index()
            var row = oTable_vacunas.fnGetData(objrow)

            let listaVacunas = await RegistroVacunas.ListarVacunasInmunizacionesByIdAtencionIdProductoDosis(RegistroVacunas.IdPaciente, row.idProducto, RegistroVacunas.NroDosis)


            $('#cboActividad').val(listaVacunas.table[0].actividad)
            $('#cboEstrategia').val(listaVacunas.table[0].estrategia)
            $('#cboVacunador').val(listaVacunas.table[0].responsableVacuna)
            $('#cboSupervisor').val(listaVacunas.table[0].supervisorVacuna)
            $('#cboTurno').val(listaVacunas.table[0].idturno)

            $('#cboDosisVacunaAplicada').val(RegistroVacunas.NroDosis)
            $('#txtCodigoVacunaAplicada').val(row.codigo)
            $('#txtDescripcionVacunaAplicada').val(row.nombre)

            $('#txtLoteVacunaAplicada').val(listaVacunas.table[0].lote)
            $('#cboGrupoRiesgoVacunaAplicada').val(listaVacunas.table[0].grupoRiesgo)
            $('#txtCoMorbilidad').val(listaVacunas.table[0].coMorbilidad)
            $('#txtContactoTBP').val(listaVacunas.table[0].contactoTBP)


            RegistroVacunas.IdProducto = row.idProducto


            $('.chzn-select').chosen().trigger("chosen:updated");

            $('#modalRegistroVacuna').modal('show')
            console.log('row', row)
        });
    }

}

$(document).ready(() => {
    RegistroVacunas.Plugins()

    RegistroVacunas.ListarPersonalInmunizaciones()
    RegistroVacunas.ListarTurnosInmunizaciones()
    RegistroVacunas.TiposEdadSeleccionarTodos()
    RegistroVacunas.ListaTiposDocumentos()

    RegistroVacunas.InitDatablesAtenciones()
    RegistroVacunas.InitDatablesVacunas()

    RegistroVacunas.Events()
})
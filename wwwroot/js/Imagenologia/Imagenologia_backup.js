let Imagenologia = {
    idPuntoCarga: 0,
    idProducto: 0,
    idOrden: 0,
    idMovimiento: 0,

    Plugins: () => {

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#txtFechaInicio, #txtFechaFin').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom",
            dateFormat: 'dd/mm/yy'
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraInicio, #txtHoraFin").mask("Hn:Nn");
    },

    CargaInicial: () => {
        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $("#txtFechaInicio").datepicker("setDate", fechaP);
        $("#txtFechaFin").datepicker("setDate", fechaP);

        Imagenologia.idPuntoCarga = $("#PuntoCarga").html();
    },

    CargarModuloRegistro: async (formularioRegistro) => {
        Cargando(1)
        var midata = new FormData();
        midata.append('formularioRegistro', formularioRegistro);

        $("#modulo").html("");

        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/ImagenesResultados/CargarModulo?area=ConsultaExterna",
                    data: midata,
                    dataType: "HTML",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            $("#modulo").html(datos);


            $('#TituloModalResImg').html($('#tipoModulo').val())
            Cargando(0)
        } catch (error) {
            //console.error(error)
            Cargando(0)
            alerta(3, JSON.stringify(error));
        }
    },

    CargarDatosResultadoCabecera: function (objRowOrden, row) {
        Imagenologia.idProducto = row.idProducto
        Imagenologia.idOrden = row.idOrden

        $('#txtResNroHistoria').val(objRowOrden.nroHistoriaClinica)
        $('#txtResTipoHistoria').val(objRowOrden.tiposNumeracionHistoria)
        $('#txtResApPaterno').val(objRowOrden.apellidoPaterno)
        $('#txtResApMaterno').val(objRowOrden.apellidoMaterno)
        $('#txtResNombres').val(objRowOrden.primerNombre)
        $('#txtResSexo').val(objRowOrden.tiposSexo)
        $('#txtResFechaNacimiento').val(objRowOrden.fechaNacimientoFromatted)
        //$('#txtResEdad').val(objRowOrden.ordenaPrueba)
        let edad = null;
        edad = CalcularEdadAnioMesDiaSegunFecha(objRowOrden.fechaNacimientoFromatted, row.fechaAnalisis);
        $('#txtResEdad').val(edad.años + "A " + edad.meses + "M " + edad.días + "D ");

        $('#txtMedicoSolicitante').val(objRowOrden.ordenaPrueba)

        $('#txtFechaResultado').val(row.fechaAnalisis)
        $('#txtHoraResultado').val(row.horaAnalisis)
        $('#cboRealizaPrueba').val(row.realizaAnalisis)
    },

    Eventos() {

        $('#btnListarOrdenesPatologia').on('click', async () => {
            Cargando(1)

            oTable_ListaOrdenes.fnClearTable();
            oTable_ListaOrdenesDetalle.fnClearTable();
            let ordenServicioPorFechas = await Imagenologia.FactOrdenServicioPorFechasLabPaciente()
            //console.log(ordenServicioPorFechas);
            if (ordenServicioPorFechas.length == 0) {
                Cargando(0)
                alerta(2, 'No se encontro resultados para la busqueda indicada.')
                return false
            }

            oTable_ListaOrdenes.fnAddData(ordenServicioPorFechas)

            Cargando(0)
        })

        $('#btnImprimirTodosResultados').on('click', async () => {
            let objRowOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            Cargando(1)
            if (isEmpty(objRowOrden)) {
                alerta(2, 'Selecciona un elemento de la lista de Ordenes')
                Cargando(0)
                return false
            }


            const ordenServicio = await Imagenologia.FactOrdenServicioPorIdMovimiento(objRowOrden.idMovimiento, objRowOrden.idPuntoCarga)

            if (ordenServicio.length > 0) {

                let firma = await Utilitario.SeleccionarFirmaDigitalV2(ordenServicio[0].code)
                if (typeof firma === 'undefined') {
                    alerta('2', 'El documento no esta generado, se procedera a generar el documento.')

                    let tipoFormato = 'LAB-REST';
                    const pdf = await Utilitario.GenerarFormatoResultados(objRowOrden.idOrden, objRowOrden.idPuntoCarga, objRowOrden.idMovimiento, tipoFormato);

                    if (pdf) {
                        alerta('1', 'Se generó el documento correctamente.')
                    }
                } else {
                    //url = PathServerFiles + firma.rutaArchivo;               //KHOYOSI      
                    AbrirVisorDocumento(firma.rutaArchivo, 0);
                }

                Cargando(0)
            }

            //KHOYOSI


        })

        $('#tblListadoOrdenes tbody').on('click', 'tr', async function () {
            oTable_ListaOrdenes.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            await Imagenologia.ListarDetalleOrden();
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', 'tr', async function () {
            oTable_ListaOrdenesDetalle.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        });


        $('#tblListadoOrdenesDetalle tbody').on('dblclick', 'tr', async function () {
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);

            let objRowOrden = oTable_ListaOrdenes.api(true).row('.selected').data()

            if (row.idformulario == 'frmEcoVaginalBasica') {
                swal({
                    title: 'Modificar Registros',
                    text: "¿Desea registrar en la nueva version de formularios?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async function () {

                    await Imagenologia.CargarModuloRegistro('frmEcoVaginalBasica')

                    Imagenologia.CargarDatosResultadoCabecera(objRowOrden, row)
                    await EcografiaVaginalBasica.Init()
                    await EcografiaVaginalBasica.CargarDatos()


                    $('#modalResultadoImagenes').modal('show');
                }, function (dimiss) {

                });
            }

            console.log('row', row)

            if (row.idformulario == 'frmecoGenetica') {
                swal({
                    title: 'Modificar Registros',
                    text: "¿Desea registrar en la nueva version de formularios?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async function () {

                    await Imagenologia.CargarModuloRegistro('frmEcoGenetica')

                    Imagenologia.CargarDatosResultadoCabecera(objRowOrden, row)
                    await EcografiaGenetica.Init()
                    await EcografiaGenetica.CargarDatos()


                    $('#modalResultadoImagenes').modal('show');
                }, function (dimiss) {

                });
            }

            if (row.idformulario == 'frmEcoAbdominalBasic') {
                swal({
                    title: 'Modificar Registros',
                    text: "¿Desea registrar en la nueva version de formularios?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async function () {

                    await Imagenologia.CargarModuloRegistro('frmEcoAbdominalBasic')

                    Imagenologia.CargarDatosResultadoCabecera(objRowOrden, row)
                    await EcografiaBasica.Init()
                    await EcografiaBasica.CargarDatos()


                    $('#modalResultadoImagenes').modal('show');
                }, function (dimiss) {

                });
            }

            if (row.idformulario == 'frmEcoUteroGrav') {
                swal({
                    title: 'Modificar Registros',
                    text: "¿Desea registrar en la nueva version de formularios?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async function () {

                    await Imagenologia.CargarModuloRegistro('frmEcoUteroGrav')

                    Imagenologia.CargarDatosResultadoCabecera(objRowOrden, row)
                    await EcografiaUtero.Init()
                    await EcografiaUtero.CargarDatos()


                    $('#modalResultadoImagenes').modal('show');
                }, function (dimiss) {

                });
            }

            if (row.idformulario == 'frmEcoDopplerCrec') {
                swal({
                    title: 'Modificar Registros',
                    text: "¿Desea registrar en la nueva version de formularios?",
                    type: 'question',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(async function () {

                    await Imagenologia.CargarModuloRegistro('frmEcoDopplerCrec')

                    Imagenologia.CargarDatosResultadoCabecera(objRowOrden, row)
                    await EcografiaDoppler.Init()
                    await EcografiaDoppler.CargarDatos()


                    $('#modalResultadoImagenes').modal('show');
                }, function (dimiss) {

                });
            }

            console.log('row', row)
        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoSF', async function () {
            let objOrden = oTable_ListaOrdenes.api(true).row('.selected').data()
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();

            Cargando(1);
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(row.code);               //KHOYOSI
            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.');

                let tipoFormato = 'IMG-RES';
                //console.log('row', row) /// verificar aqui los parametros y los datos que se enviaran
                const pdf = await Utilitario.GenerarFormatoResultadosPorItem(objOrden.idCuentaAtencion, row.idOrden, objOrden.idMovimiento, row.idProducto, tipoFormato);

                if (pdf) {
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

        $('#btnConsultarResultadoImg').on('click', async function () {
            var objrowTb = oTable_ListaOrdenesDetalle.api(true).row('.selected').data();
            if (!isEmpty(objrowTb)) {
                await Imagenologia.CargarResultadosImagenesLaboratorio(objrowTb.idProducto, objrowTb.idOrden, 'IMG');
            } else {
                alerta2('warning', '', 'No se ha seleccionado ninguna receta.');
            }
        });

        $('#btnCerrarResultadoLabImg').on('click', function () {
            oTable_resultadosOrdenes.fnClearTable();
            $('#modalResultadosLabImg').modal('hide');
        });

        /*==============================FIRMA DIGITAL===========================================*/
        $('#tblListadoOrdenesDetalle tbody').on('click', '.FirmarInformeResultadoSF', async function () {
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);

            Cargando(1);
            //const firma = await Utilitario.ValidarUsuarioFirmaDigital(row.code)               //KHOYOSI
            //if (firma) {

            //    await Utilitario.AbrirServicioFirmaBit4Id(row.code);
            //}
            Utilitario.TipoArchivoFirmar = 'LAB-RES';
            await Utilitario.AbrirServicioFirmaBit4Id(row.code);

            Cargando(0);

        });

        $('#tblListadoOrdenesDetalle tbody').on('click', '.ImprimeInformeResultadoCF', async function () {
            var objrow = oTable_ListaOrdenesDetalle.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_ListaOrdenesDetalle.fnGetData(objrow);
            await Utilitario.AbrirDocumentoFirmadoBit4Id(row.code);
        });

        $('#btnFirmaMovimiento').on('click', async function () {
            let objrow = oTable_ListaOrdenes.api(true).row('.selected').data()

            if (isEmpty(objrow)) {
                alerta(2, 'Seleccione un registro')
                return false
            }

            if (objrow.idLabEstado == 0) {
                swal({
                    title: 'Movimiento',
                    text: "El movimiento se encuentra anulado.",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                //alerta(2, "La cuenta del paciente se encuentra anulado.");
                return false;
            }

            Cargando(1);
            Utilitario.TipoArchivoFirmar = 'IMG-RES';
            const paquete = await Utilitario.CrearPaqueteArchivosConRegistros(objrow.idMovimiento, 0, 0, Utilitario.TipoArchivoFirmar);
            if (!isEmpty(paquete)) {
                await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
            }
            Cargando(0);
        });

        $('#btnFirmaLote').on('click', async function () {
            let listMovimientos = oTable_ListaOrdenes.api(true).data();
            let numMovimientos = [];

            Cargando(1)
            $(listMovimientos).each(async (i, obj) => {
                if (obj.idLabEstado != 0) {
                    numMovimientos.push(obj.idMovimiento);
                }
            })

            Utilitario.TipoArchivoFirmar = 'LAB-RES';
            const paquete = await Utilitario.CrearPaqueteArchivosConRegistros(numMovimientos, 0, 0, Utilitario.TipoArchivoFirmar);
            if (!isEmpty(paquete)) {
                await Utilitario.AbrirServicioFirmaBit4IdMultiple(paquete.data)
            }
            Cargando(0)
        });


        $('#btnLimpiarBusqueda').on('click', () => {
            Imagenologia.Limpiar();
        })





        $('#btnCancelarResultado').on('click', function () {
            $('#modalResultadoImagenes').modal('hide')

            EcografiaVaginalBasica.LimpiarResultadoEcoVaginalBasica()
        })
    },

    FactOrdenServicioPorFechasLabPaciente() {
        let formData = new FormData()
        formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
        formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
        formData.append('idPuntoCarga', Laboratorio.idPuntoCarga) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/ImagenologiaResultados/FactOrdenServicioPorFechasLabPaciente?area=Laboratorio', formData)
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

    ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(idOrden, idPuntoCarga, idMovimiento) {
        let formData = new FormData()
        formData.append('idOrden', idOrden)
        formData.append('idPuntoCarga', idPuntoCarga)
        formData.append('idMovimiento', idMovimiento) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/ImagenesResultados/ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga?area=Imagenologia', formData)
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

    FactOrdenServicioPorFechasLabPaciente() {
        let formData = new FormData();
        formData.append('idMovimiento', $("#txtNroMovimiento").val())
        formData.append('idCuenta', $("#txtNroCuenta").val())
        formData.append('historia', $("#txtNroHistoria").val())
        formData.append('nombres', $("#txtNombres").val())
        formData.append('fechaInicio', $("#txtFechaInicio").val() + ' ' + $("#txtHoraInicio").val())
        formData.append('fechaFin', $("#txtFechaFin").val() + ' ' + $("#txtHoraFin").val())
        formData.append('idPuntoCarga', Imagenologia.idPuntoCarga) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/ImagenesResultados/FactOrdenServicioPorFechasImgPaciente?area=Imagenologia', formData)
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

    FactOrdenServicioPorIdMovimiento(idMovimiento, idPuntoCarga) {
        let formData = new FormData()
        formData.append('idMovimiento', idMovimiento)
        formData.append('idPuntoCarga', idPuntoCarga) // cambiar por parametro

        //oTable_patologiaClinica.fnClearTable()
        //oTable_reporteICIDonaciones.fnClearTable()
        return HttpClient.Post('/PatologiaClinica/FactOrdenServicioPorIdMovimiento?area=Laboratorio', formData)
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
                    $('#txtObserOrdRes').val(valor.obseraciones + '\n' + valor.conclusiones);
                });
                $('#tbodyResultados').html(hmltTabla);
                //$('#tblResultadosExamenes').DataTable().columns.adjust();
                $('#modalResultadosLabImg').modal('show');

            } else {
                alerta2('info', '', 'No existen resultados para el examen seleccionado.');
            }
        } catch (error) {
            alerta(3, error);
        }

    },




    //ListarSaldosPorAlmacenConFechaCorte() {
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


    InitDatablesListaOrdenes: () => {

        var parms = {
            "paging": true,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            columns: [
                {
                    width: '5%',
                    targets: 0,
                    data: "idMovimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        if (rowData.idLabEstado == 0) {
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
                    data: "fechaCreacion",
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
                    data: "idTipoSexo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                }

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
            "ordering": true,
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
                    width: '20%',
                    targets: 1,
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '5%',
                    targets: 2,
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 3,
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 4,
                    data: "total",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 5,
                    data: "resultado",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '20%',
                    targets: 6,
                    data: "obseraciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
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
                                } else {
                                    btnRuta = '<button class="btn btn-sm btn-info btnFirmaCE FirmarInformeResultadoSF" title="Firmar Atención" data-toggle="tooltip" style="margin: 2px;"> <i class="fa fa-pencil"></i></button>';
                                }
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

    async ListarDetalleOrden() {
        Cargando(1)
        let objRow = oTable_ListaOrdenes.api(true).row('.selected').data()

        if (isEmpty(objRow)) {
            alerta(2, 'Selecciona una orden')
            Cargando(0)
            return false
        }

        Imagenologia.idMovimiento = objRow.idMovimiento

        let facturacionServicioDespacho = await Imagenologia.ImgFacturacionServicioDespachoFiltraPorIdOrdenIdPuntoCarga(objRow.idOrden, objRow.idPuntoCarga, objRow.idMovimiento)
        console.log(facturacionServicioDespacho);
        oTable_ListaOrdenesDetalle.fnClearTable();
        if (!isEmpty(facturacionServicioDespacho)) {
            oTable_ListaOrdenesDetalle.fnAddData(facturacionServicioDespacho);
        }
        Cargando(0)
    },



    EmpleadoImgMGP: async function (idGrupo) {

        let formData = new FormData()

        formData.append("idGrupo", idGrupo);

        let response = await HttpClient.Post(`/ImagenesResultados/EmpleadoImgMGP`, formData)

        $('#cboRealizaPrueba').empty()
        $('#cboRealizaPrueba').append('<option  value="0">--Seleccionar--</option>')

        if (isEmpty(response)) {
            return false
        }

        let data = response.data.table

        if (data.length <= 0) {
            return false
        }

        $(data).each(function (i, obj) {
            //console.log('obj', obj)
            //if (obj.idEspecialidad == 13 || obj.idEspecialidad == 14) {
            $('#cboRealizaPrueba').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>')
            //}
        });

        $('.chzn-select').chosen().trigger("chosen:updated")


    },





    Limpiar() {
        $(".search").val("");
    }
}


$(document).ready(() => {
    Imagenologia.Plugins();
    Imagenologia.CargaInicial();
    Imagenologia.InitDatablesListaOrdenes();
    Imagenologia.InitDatablesListaOrdenesDetalle();
    Imagenologia.IniciarDataTableResultados();


    Imagenologia.EmpleadoImgMGP(9);

    Imagenologia.Eventos();
})
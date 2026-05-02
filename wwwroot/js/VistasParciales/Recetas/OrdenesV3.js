var OrdenesRecetasMedicas = null;
var OrdenesRecetasMedicasSeguimiento = null;
var IdCuentaAtencionTemp = 0;
var isSwitchingTabsTiposOrdenes = false;

var Ordenes = {
    accion: '',
    idCuentaAtencion: 0,
    idServicio: 0,
    tipoServicio: '',

    IdSolicitudSOP: 0,
    objDiagSel: null,

    lstDxAtencion: null,

    idSolicitudAntimicrobiano: 0,

    prescriptores: null,

    productosSinSolicitud: [],

    plugins() {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true });
        $(".chzn-select-deselect,#select2_sample").chosen();

        $('#txtFechaVigencia').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });


        $('#txtFechaParaCQx, #txtFechaSolicitudCQx, #txtFechaSolicitudCQxAceptada').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';

        $("#txtHoraParaCqx, #txtHoraSolicitudCQx, #txtHoraSolicitudCQxAceptada").mask("Hn:Nn");

        $('#txtHoraSolicitudCQx').prop('disabled', true)
        $('#txtHoraSolicitudCQxAceptada').prop('disabled', true)
    },


    //var listaServicios = function () {  $.ajax({
    //  
    //        //async: false,
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


    // SOLICITUD CENTRO QUIRURGICO
    InitDatableBusquedaDiagnostico() {

        $('#modalBusquedaDiagnosticosSolicitudCQx').modal('hide');

        ObjtableBusquedaSolicitudCQxDiagnostico = $("#lstDiagnosticosSolicitudCQxBusqueda").dataTable({
            destroy: true,
            data: null,
            info: false,
            bFilter: false,
            scrollY: '70vh',
            "autoWidth": false,
            scrollCollapse: true,
            bLengthChange: false,
            buttons: [],
            columns: [
                { "data": "iddiagnostico", className: 'ContCenter', "visible": false },
                { "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { "data": "codigoCIE10", className: 'ContCenter', width: '10%' },
                { "data": "descripcion" },
                { "data": "esActivo", className: 'ContCenter', "visible": false },
                { "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                { "data": "intrahospitalario", className: 'ContCenter', "visible": false }
            ]
        });

    },
    InitDatableDiagnostico() {
        visible = true;


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
                //{ width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false },
                //{ width: '10%', targets: 9, "data": "lab", className: 'ContCenter', "visible": visible }

            ]
        }

        ObjtableDiagnosticosSolicitudCQx = $("#lstDiagnosticosSolicitudCQx").dataTable(params);

        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $('.chzn-select').chosen().trigger("chosen:updated");
        $('.chosen-container').css({ 'width': '100%' });


        $('#txtLabDiagnostico').val('')

        $('#cbolabDiagnostico').val(-1)
        $('#cbolabDiagnostico').trigger("chosen:updated");

        //Cargando(0);
    },


    InitDataTableCondicionPaciente() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            //scrollY: '20vh',
            columns: [
                {
                    targets: 0,
                    width: '0%',
                    visible: false,
                    data: "idTipoCondicionAntimicrobiano",

                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 1,
                    width: '80%',
                    data: "condicion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                        $(td).html('<button class="btn btn-sm btn-danger layout_btn_prevent btnEliminarCondicionPacienteSolAntimic"><i class="fa-solid fa-trash-can"></i></button>');
                    }
                },

            ]
        }

        var tableWrapper = $('#tblCondicionPacienteSolAntimic'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_CondicionPacienteSolAntimic = $("#tblCondicionPacienteSolAntimic").dataTable(parms);

    },

    AbrirModalBusqueda() {
        $('#modalBusquedaDiagnosticosSolicitudCQx').modal('show');
    },

    CerrarModalBusqueda() {
        $('#modalBusquedaDiagnosticosSolicitudCQx').modal('hide');
    },

    BuscarDiagnosticoBusqueda() {
        var midata = new FormData();
        midata.append('Codigo', $("#txtCodigoDiagSolicitudCQxFiltro").val());
        midata.append('Descripcion', $("#txtDescripcionDiagSolicitudCQxFiltro").val());
        $.ajax({
            method: "POST",
            url: "/PlanificacionFamiliar/ObtenerDiagnosticoV2?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                ObjtableBusquedaSolicitudCQxDiagnostico.fnClearTable();
                if (!isEmpty(datos.table)) {
                    if (datos.table.length > 0) {
                        ObjtableBusquedaSolicitudCQxDiagnostico.fnAddData(datos.table);
                    }

                }

            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    AgregarDiagnosticoBusqueda() {

        Ordenes.objDiagSel = ObjtableBusquedaSolicitudCQxDiagnostico.api(true).row('.selected').data();
        $("#txtCodigoDiagSolicitudCQx").val(Ordenes.objDiagSel.codigoCIE10);
        $("#hdnIdDiagnosticoSolicitudCQx").val(Ordenes.objDiagSel.iddiagnostico);
        $("#txtDescripcionDiagSolicitudCQx").val(Ordenes.objDiagSel.descripcion);
        Ordenes.CerrarModalBusqueda()

    },

    BuscarDiagnostico(Codigo) {
        var midata = new FormData();
        midata.append('Codigo', Codigo);
        midata.append('Descripcion', $("#txtDescripcionDiagSolicitudCQxFiltro").val());
        $.ajax({
            method: "POST",
            url: "/PlanificacionFamiliar/ObtenerDiagnostico?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            success: function (datos) {
                ObjtableBusquedaSolicitudCQxDiagnostico.fnClearTable();
                if (!isEmpty(datos.table)) {
                    ObjtableBusquedaSolicitudCQxDiagnostico.fnAddData(datos.table);
                }
            },
            error: function (msg) {
                Cargando(0)
            }
        });
    },

    AgregarDiagnostico() {
        $("#cboTipoDiagnosticoSolicitudCQx").trigger("chosen:updated");
        if ($("#txtDescripcionDiagSolicitudCQx").val() == "") { alerta(2, "Debe seleccionar el Diagnóstico"); $("#txtCodigoDiagSolicitudCQx").focus(); return false; }
        if ($("#cboTipoDiagnosticoSolicitudCQx").val() == -1) { alerta(2, "Debe seleccionar el Tipo de Diagnóstico."); $("#cboTipoDiagnosticoSolicitudCQx").focus(); return false; }
        if (Ordenes.ExisteDiagnosticos()) {
            alerta(2, "El Diagnóstico ya fue agregado.");
            return false;
        } else {

            let idTipoDx = $("#cboTipoDiagnosticoSolicitudCQx").val();
            let txtTipoDx = $('#cboTipoDiagnosticoSolicitudCQx option:selected').text();


            var objRow = {
                codigoCIE10: Ordenes.objDiagSel.codigoCIE10,
                codigoCIEsinPto: Ordenes.objDiagSel.codigoCIEsinPto,
                descripcion: Ordenes.objDiagSel.descripcion,
                esActivo: Ordenes.objDiagSel.esActivo,
                fechaInicioVigencia: Ordenes.objDiagSel.fechaInicioVigencia,
                iddiagnostico: Ordenes.objDiagSel.iddiagnostico,
                idTipoDiagnostico: idTipoDx,
                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                tipoDiagnostico: txtTipoDx,
                //lab: $('#hdUsaLabs').val() == '1' ? $('#txtLabDiagnostico').val() : $('#cbolabDiagnostico').val(),
                //intrahospitalario: Diagnosticos.objDiagSel.intrahospitalario
            }
            ObjtableDiagnosticosSolicitudCQx.api(true).row.add(objRow).draw(false);
            //ObjtableDiagnosticos.api(true).row.add(objRow).draw(false);
            $("#txtDescripcionDiagSolicitudCQx").val("");
            $("#txtCodigoDiagSolicitudCQx").val("");
            $("#cboTipoDiagnosticoSolicitudCQx").val(-1);

            $('#txtLabDiagnostico').val('')

            $('#cbolabDiagnostico').val(-1)

            $('#cbolabDiagnostico').trigger("chosen:updated");
            $("#cboTipoDiagnosticoSolicitudCQx").trigger("chosen:updated");
            return true;
        };
    },

    ExisteDiagnosticos() {
        lstDiagnosticos = ObjtableDiagnosticosSolicitudCQx.api(true).rows().data();
        if (lstDiagnosticos.length == 0) {
            return false;
        }

        for (var i = 0; i < lstDiagnosticos.length; i++) {
            if (lstDiagnosticos[i].iddiagnostico == $("#hdnIdDiagnosticoSolicitudCQx").val()) {
                return true;
            }
        }

        return false;
    },
    QuitarDiagnostico() {
        var objrowDiag = ObjtableDiagnosticosSolicitudCQx.api(true).row('.selected').data();
        if (!isEmpty(objrowDiag)) {
            ObjtableDiagnosticosSolicitudCQx.api(true).row('.selected').remove().draw(false);

        } else {
            alerta(2, "Debe Seleccionar el diagnostico a eliminar.");
        }
    },

    SeleccionarDiagnosticos: async (idAtencion, clasificacion) => {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;

            $(datos.table).each((i, obj) => {
                if (obj.idTipoDiagnosticoCQx == 1) {
                    ObjtableDiagnosticosSolicitudCQx.api(true).row.add(obj).draw(false);
                }

            })


            //if (datos.table.length !== 0) {

            //    if (!isEmpty(datos.table)) {
            //        oTable_DiagnosticosPreOperatorio.fnClearTable()
            //        oTable_DiagnosticosPostOperatorios.fnClearTable()
            //    }
            //}
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },

    // SOLICITUD CENTRO QUIRURGICO


    async listaFecha() {
        var midata = new FormData();
        midata.append('idParametro', 356);

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Parametros/SeleccionaFilaParametro?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            let fecha = new Date();
            let dias = parseInt(datos.table[0]['valorTexto']); // Número de días a agregar
            fecha.setDate(fecha.getDate() + dias);

            let dia = fecha.getDate();
            let mes = parseInt(fecha.getMonth()) + 1;
            let yyy = fecha.getFullYear();

            if (dia < 10)
                dia = '0' + dia; //agrega cero si el menor de 10
            if (mes < 10)
                mes = '0' + mes

            fechaP = dia + "/" + mes + "/" + yyy

            //$('#txtFechaVigencia').val(fechaP);
            $("#txtFechaVigencia").datepicker("setDate", fechaP);

            resp = true;

        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }


    },


    async listaFarmacias() {
        let idTipoServicio = $("#hdIdTipoServicio").val();

        await $.ajax({
            method: "POST",
            url: "/Farmacia/FarmaciasSegunFiltro?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboFarmacia').empty();
                $(datos.table).each(function (i, obj) {
                    if (idTipoServicio == '2') {
                        if (obj.idAlmacen == 438 || obj.idAlmacen == 441) {
                            $('#cboFarmacia').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                        }
                    } else {
                        $('#cboFarmacia').append('<option  value="' + obj.idAlmacen + '">' + obj.descripcion + '</option>');
                    }

                    
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
    async ListarDosis() {
        await $.ajax({
            //async: false,
            cache: false,
            url: "/Receta/ListarDosis?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboDosis').empty();
                $('#cboDosisAntimic').empty();
                $('#cboDosisIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboDosis').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboDosisAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboDosisIntSanit').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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

    async ListarVias() {
        await $.ajax({
            //async: false,
            cache: false,
            url: "/Receta/ListarViasAdministracion?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboVia').empty();
                $('#cboViaAntimic').empty();
                $('#cboViaIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboVia').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboViaAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboViaIntSanit').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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

    async ListarFrecuencias() {    //KHOYOSI
        await $.ajax({
            //async: false,
            cache: false,
            url: "/Receta/ListarFrecuencias?area=Comun",
            datatype: "json",
            type: "get",
            processData: false,
            contentType: false,
            success: function (datos) {
                $('#cboFrecuenciaPatoClinica').empty();
                $('#cboFrecuenciaAPatologica').empty();
                $('#cboFrecuenciaBancoSangre').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboFrecuenciaPatoClinica').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboFrecuenciaAPatologica').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                    $('#cboFrecuenciaBancoSangre').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
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

    async ListarPrescriptores() {       
        
        await $.ajax({
            //async: false,
            cache: false,
            url: "/Receta/ListarPrescriptores?area=Comun",
            datatype: "json",
            type: "post",
            processData: false,
            contentType: false,
            success: function (datos) {    
                if (datos.dataSet.table.length > 0) {
                    Ordenes.prescriptores = datos.dataSet.table;
                    Ordenes.CargarPrescriptores("01,03,05");    
                }      
                
            },
            error: function (msg) {
                setTimeout(function () {
                    alerta("ERROR", "Error listar los prescriptores!", "2");
                }, 900)
            }
        });
    },

    CargarPrescriptores(colegios) {
        let selectHtml = "";
        let tipoPrescriptor = "";
        //let miString = "01,05,06,08";
        let tiposColegios = colegios.split(","); 
        //let idMedico = $('#cboMedicoReceta').val();

        $('#cboMedicoReceta').empty();
        $.each(tiposColegios, function (index, value) {
            $(Ordenes.prescriptores).each(function (i, obj) {
                if (obj.idColegioHIS == value) {
                    tipoPrescriptor = obj.tipoPrescriptor;
                    selectHtml = selectHtml + '<option data-colegio="' + obj.idColegioHIS + '" value="' + obj.idMedico + '">' + obj.medico + '</option>';
                }                
            });

            $('#cboMedicoReceta').append('<optgroup label="' + tipoPrescriptor + '">' + selectHtml + '</optgroup>');
            //console.log("Índice:", index, "Valor:", value);
        });

        //$('#cboMedicoReceta').val(idMedico);
        $('#cboMedicoReceta').val(0);
        $('.chzn-select').chosen().trigger("chosen:updated");
    },


    async ListarMedicos() { // KHOYOSI
        let medicos = await Utilitario.ListarProfesionalesDeLaSalud();
        //$('#cboMedicoReceta').empty();
        $('#cboSolicitudCirujano').empty();
        $('#cboSolicitudPrimerAyudante').empty();
        $('#cboSolicitudAnestesiologoCQx').empty();
        $(medicos).each(function (i, obj) {
            if (obj.idColegioHIS == '01' || obj.idColegioHIS == '03' || obj.idColegioHIS == '05') {
                //$('#cboMedicoReceta').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                $('#cboSolicitudCirujano').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                $('#cboSolicitudPrimerAyudante').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
                $('#cboSolicitudAnestesiologoCQx').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
            }
        });
        //$('#cboMedicoReceta').val(0);
        $('#cboSolicitudCirujano').val(0);
        $('#cboSolicitudPrimerAyudante').val(0);
        $('#cboSolicitudAnestesiologoCQx').val(0);
        $('.chzn-select').chosen().trigger("chosen:updated");

        //console.log("ENTRANDO A LISTAR MEDICOS")
        //$.ajax({
        //    method: "POST",
        //    url: "/Utilitario/ListarMedicos?area=Comun",
        //    data: null,
        //    dataType: "json",
        //    processData: false,
        //    contentType: false,
        //    //async: false,
        //    success: function (datos) {
        //        $('#cboMedicoReceta').empty();
        //        $('#cboSolicitudCirujano').empty();
        //        $('#cboSolicitudPrimerAyudante').empty();
        //        $('#cboSolicitudAnestesiologoCQx').empty();
        //        $(datos.dataSet.table).each(function (i, obj) {
        //            $('#cboMedicoReceta').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
        //            $('#cboSolicitudCirujano').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
        //            $('#cboSolicitudPrimerAyudante').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
        //            $('#cboSolicitudAnestesiologoCQx').append('<option  value="' + obj.idMedico + '">' + obj.medico + '</option>');
        //        });
        //        $('#cboMedicoReceta').val(0);
        //        $('#cboSolicitudCirujano').val(0);
        //        $('#cboSolicitudPrimerAyudante').val(0);
        //        $('#cboSolicitudAnestesiologoCQx').val(0);
        //        $('.chzn-select').chosen().trigger("chosen:updated");
        //    },
        //    error: function (msg) {
        //        setTimeout(function () {
        //            //                    Cargando(0);
        //            alerta("ERROR", "Error listar medicos!", "2");
        //        }, 900)
        //    }
        //});
    },


    async ConsultarStockProductoPorFarmacia(idAlmacen, idProducto) { // JDELGADOPM
        let formData = new FormData()

        formData.append('idAlmacen', idAlmacen)
        formData.append('idProducto', idProducto)


        let res = await HttpClient.Post(`/Utilitario/ConsultarStockProductoPorFarmacia`, formData)
        let data

        if (!res.session) {
            alerta(2, 'La sesion expiro, vuelva a ingresar sus credenciales para continuar.')
            Cargando(0)
            return false
        }
        if (!res.estado) {
            console.error(2, 'Problemas al realizar la operacion: ' + res.msg)
            Cargando(0)
            return false
        }

        console.log('res', res)

        data = res.data

        return data

    },

    async VerificarSolicitudAntimicrobianoPorProducto(idProducto, idCuentaAtencion) {
        let respuesta = null;
        let datos
        var data = new FormData();
        let resp = false;

        data.append('idProducto', idProducto);
        data.append('idCuentaAtencion', idCuentaAtencion);

        try {
            Cargando(1);            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/VerificarSolicitudAntimicrobianoPorProducto?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            //if (datos.sesion) {
                if (datos.table.length > 0) {
                    respuesta = datos;
                                        
                    resp = true;

                } /*else {
                    resp = false;
                    alerta2("error", "", "Hubo un error en la seleccion de los datos de la cita.");
                }*/
            //}
            //else {
            //    location.reload();
            //}

        } catch (error) {
            resp = false;
            Cargando(0);
            alerta2("error", "", JSON.stringify(error));
        }

        return resp;
    },

    async DevolverProductosSinSolicitudAntimicrobianos() {
        let productosSinSolicitud = [];
        let productosFarmacia = oTable_farmacia.api(true).rows().data();

        for (let item of productosFarmacia.toArray()) {
            if (item.tipoProducto == "ANT") {
                let tieneSolicitud = await Ordenes.VerificarSolicitudAntimicrobianoPorProducto(item.idItem, Variables.IdCuentaAtencion);       //KHOYOSI
                if (!tieneSolicitud) {
                    let objProdAnt = {
                        idProducto: item.idItem,
                        producto: item.producto
                    }
                    productosSinSolicitud.push(objProdAnt);
                }
            }
        }

        return productosSinSolicitud;
    },

    //async ListarRecetasCabeceras(idCuentaAtencion, idTipoFuenteFina, idServicio, idMedico) { // KHOYOSI                
    //    var resp = [];
    //    let datos;
    //    var data = new FormData();

    //    $('#hdIdTipoFuenteFian').val(idTipoFuenteFina);
    //    data.append('idCuentaAtencion', idCuentaAtencion);
    //    data.append('idServicio', idServicio);
    //    data.append('idMedico', idMedico);
    //    try {

    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Receta/ListaRecetasCabeceraIdCuentaAtencionV2?area=Comun",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        if (datos.table.length > 0) {
    //            resp = datos.table;
    //        }
    //    } catch (error) {
    //        alerta(3, error);
    //    }

    //    return resp;
    //},

    //async SeleccionarRecetasCabecera(idCuentaAtencion, idTipoFuenteFina) { // KHOYOSI                
    //    var resp = false;
    //    let datos
    //    var data = new FormData();

    //    Ordenes.LimpiarOrdenesMedicas();
    //    $('#hdIdTipoFuenteFian').val(idTipoFuenteFina);
    //    data.append('idCuentaAtencion', idCuentaAtencion);
    //    try {

    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=Comun",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        if (datos.table.length > 0) {
    //            await Ordenes.CargarDatosRecetaCabecera(datos);
    //        } else {
    //            Ordenes.listaFecha();
    //        }
    //        OrdenesRecetasMedicas = datos.table;
    //        Ordenes.validaActivabtnPaquete();
    //        resp = true;
    //    } catch (error) {
    //        resp = false;
    //        alerta(3, error);
    //    }

    //    return resp;
    //},

    async SeleccionarRecetasCabeceraPorIdReceta(idReceta, idTipoFuenteFina, idServicio, idMedico) { // KHOYOSI
        var resp = [];
        let datos;
        var data = new FormData();

        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina);
        data.append('idReceta', idReceta);
        data.append('idServicio', idServicio);
        data.append('idMedico', idMedico);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdReceta?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                resp = datos.table;
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarRecetasCabecera(idCuentaAtencion, idTipoFuenteFina, idServicio, idMedico) { // KHOYOSI                
        var resp = [];
        let datos
        var data = new FormData();

        //Ordenes.LimpiarOrdenesMedicas();
        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina);
        data.append('idCuentaAtencion', idCuentaAtencion);
        data.append('idServicio', idServicio);
        data.append('idMedico', idMedico);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdCuentaAtencionV2?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                resp = datos.table;
            }
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarRecetasCabeceraPorNroEvaluacion(idCuentaAtencion, idTipoFuenteFina, nroEvaluacion, idServicio, idMedico) { // KHOYOSI
        var resp = [];
        let datos
        var data = new FormData();

        //Ordenes.LimpiarOrdenesMedicas();
        $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)

        data.append('idCuentaAtencion', idCuentaAtencion);
        data.append('nroEvaluacion', nroEvaluacion);
        data.append('idServicio', idServicio);
        data.append('idMedico', idMedico);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length > 0) {
                resp = datos.table;
            }
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },

    //async SeleccionarRecetaDetalle(idReceta, idPuntoCarga) {

    //    let resp = false;
    //    let datos
    //    let data = new FormData();

    //    data.append('idReceta', idReceta);
    //    data.append('idPuntoCarga', idPuntoCarga);

    //    try {

    //        datos = await
    //            $.ajax({
    //                method: "POST",
    //                url: "/Receta/ListaRecetaDetalle?area=Comun",
    //                //contentType: "application/json; charset=utf-8",
    //                data: data,
    //                dataType: "json",
    //                cache: false,
    //                processData: false,
    //                contentType: false,
    //            });

    //        switch (idPuntoCarga) {
    //            case 21:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        oTable_rayos.fnAddData(datos.table);
    //                    }
    //                }
    //                break;
    //            case 23:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        oTable_ecoObs.fnAddData(datos.table);
    //                    }
    //                }
    //                break;
    //            case 24:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        oTable_ecoObsProc.fnAddData(datos.table);
    //                    }
    //                }
    //                break;
    //            case 20:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        oTable_ecoGeneral.fnAddData(datos.table);
    //                    }
    //                }
    //                break;
    //            case 2:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        oTable_PatoClinica.fnAddData(datos.table);
    //                    }
    //                }
    //                break;
    //            case 3:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0)
    //                        oTable_anatPatologica.fnAddData(datos.table);
    //                }
    //                break;
    //            case 11:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0)
    //                        oTable_bancoSangre.fnAddData(datos.table);
    //                }
    //                break;
    //            case 22:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0)
    //                        oTable_tomografia.fnAddData(datos.table);
    //                }
    //                break;
    //            case 12: // jdelgado011
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0)
    //                        oTable_interconsulta.fnAddData(datos.table);
    //                }
    //                break;
    //            case 5:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0) {
    //                        //if (esRecetaAntimicrobiano == 0) {
    //                        //    oTable_farmacia.fnAddData(datos.table);
    //                        //}
    //                        //if (esRecetaAntimicrobiano == 1) {
    //                        //    oTable_farmaciaAntimic.fnAddData(datos.table);
    //                        //    Ordenes.SeleccionarSolicitudAntimicrobiano();
    //                        //}   
    //                        oTable_farmacia.fnAddData(datos.table);
    //                    }
    //                    else {
    //                        Ordenes.listaFecha();
    //                    }

    //                }
    //                break;
    //            case 1060:
    //                if (!isEmpty(datos.table)) {
    //                    if (datos.table.length !== 0)
    //                        oTable_solicitudCQx.fnAddData(datos.table);
    //                    else
    //                        Ordenes.listaFecha();
    //                }
    //                break;
    //        }

    //        oTable_DiagnosticosOrdenesMedicas.fnClearTable();
    //        if (datos.table1.length > 0) {
    //            oTable_DiagnosticosOrdenesMedicas.fnAddData(datos.table1);
    //        }

    //        resp = true;
    //    } catch (error) {
    //        resp = false;
    //        alerta(3, error);
    //    }

    //    return resp;
    //},

    async SeleccionarRecetaDetalle(idReceta, idPuntoCarga) {
        let resp = null;
        let datos
        let data = new FormData();

        data.append('idReceta', idReceta);
        data.append('idPuntoCarga', idPuntoCarga);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetaDetalle?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0) {
                resp = datos;
            }

        } catch (error) {

            alerta(3, error);
        }

        return resp;
    },

    async SeleccionarRecetaAntimicrobianoDetalle(idReceta, idPuntoCarga) {
        let resp = false;
        let datos
        let data = new FormData();

        data.append('idReceta', idReceta);
        data.append('idPuntoCarga', idPuntoCarga);

        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Receta/ListaRecetaDetalle?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.table.length !== 0)
                oTable_farmaciaAntimic.fnAddData(datos.table);
            else
                Ordenes.listaFecha();

            oTable_DiagnosticosOrdenesMedicas.fnClearTable();
            if (datos.table1.length > 0) {
                oTable_DiagnosticosOrdenesMedicas.fnAddData(datos.table1);
            }

            resp = true;
        } catch (error) {
            resp = false;
            alerta(3, error);
        }

        return resp;
    },





    //listaCabeceraRecetasByIdCuenta(idCuentaAtencion, idTipoFuenteFina) { // JDELGADO J0 NOTA INGRESO Convertir metodo asyncrono
    //    Ordenes.limpiarCatalogoV2();

    //    $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)
    //    var midata = new FormData();
    //    midata.append('idCuentaAtencion', idCuentaAtencion);
    //    $.ajax({
    //        method: "POST",
    //        url: "/Receta/ListaRecetasCabeceraIdCuentaAtencion?area=Comun",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        success: function (datos) {
    //            $('#hdIdRecetaRX').val(0)
    //            $('#lblRx').html(0)

    //            $('#hdIdRecetaEcoObs').val(0)
    //            $('#lblEcoObs').html(0)

    //            $('#hdIdRecetaEcoGene').val(0)
    //            $('#lblEcoGene').html(0)

    //            $('#hdIdRecetaPatoClinica').val(0)
    //            $('#lblPatoClinica').html(0)

    //            $('#hdIdRecetaAnaPatologica').val(0)
    //            $('#lblanaPatologica').html(0)

    //            $('#hdIdRecetabancoSangre').val(0)
    //            $('#lblbancoSangre').html(0)

    //            $('#hdIdRecetaFarmacia').val(0)
    //            $('#lblFarmacia').html(0)

    //            $('#hdIdRecetaInterconsulta').val(0)
    //            $('#lblInterconsulta').html(0)

    //            // jdelgado tomografia
    //            $('#hdIdRecetatomografia').val(0)
    //            $('#lbltomografia').html(0)
    //            // jdelgado tomografia

    //            $('#btnAgregaRayosX').css("visibility", 'visible');
    //            $('#btnQuitarRayos').css("visibility", 'visible');
    //            $('#btnAgregaEcoObs').css("visibility", 'visible');
    //            $('#btnQuitarEcoObs').css("visibility", 'visible');
    //            $('#btnAgregaEcoGene').css("visibility", 'visible');
    //            $('#btnQuitarEcoGene').css("visibility", 'visible');
    //            $('#btnAgregaPatoClinica').css("visibility", 'visible');
    //            $('#btnQuitarPatoClinica').css("visibility", 'visible');
    //            $('#btnAgregaanaPatologica').css("visibility", 'visible');
    //            $('#btnQuitaranaPatologica').css("visibility", 'visible');
    //            $('#btnAgregabancoSangre').css("visibility", 'visible');
    //            $('#btnQuitarbancoSangre').css("visibility", 'visible');
    //            $('#btnAgregaFarmacia').css("visibility", 'visible');
    //            $('#btnQuitarFarmacia').css("visibility", 'visible');
    //            $('#btnAgregainterconsultas').css("visibility", 'visible');
    //            $('#btnQuitarinterconsultas').css("visibility", 'visible');

    //            $('#btnAgregatomografia').css("visibility", 'visible');
    //            $('#btnQuitartomografia').css("visibility", 'visible');

    //            $(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
    //            $(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
    //            $('#txtResumenHistoriaClinica').val('')
    //            $('#txtMotivoInterconsulta').val('')

    //            if (datos.table.length > 0) {//rx
    //                $(datos.table).each(function (i, obj) {

    //                    if (obj.idPuntoCarga == 21) //rx
    //                    {
    //                        $('#lblRx').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaRX').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaRayosX').css("visibility", 'visible');
    //                            $('#btnQuitarRayos').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaRayosX').css("visibility", 'hidden')
    //                            $('#btnQuitarRayos').css("visibility", 'hidden')
    //                            $('#lblRx').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 23) {//eco obs
    //                        $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaEcoObs').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaEcoObs').css("visibility", 'visible');
    //                            $('#btnQuitarEcoObs').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaEcoObs').css("visibility", 'hidden')
    //                            $('#btnQuitarEcoObs').css("visibility", 'hidden')
    //                            $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 20) {//eco gene
    //                        $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaEcoGene').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaEcoGene').css("visibility", 'visible');
    //                            $('#btnQuitarEcoGene').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaEcoGene').css("visibility", 'hidden')
    //                            $('#btnQuitarEcoGene').css("visibility", 'hidden')
    //                            $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 2) {//pt clinica
    //                        $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaPatoClinica').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaPatoClinica').css("visibility", 'visible');
    //                            $('#btnQuitarPatoClinica').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaPatoClinica').css("visibility", 'hidden')
    //                            $('#btnQuitarPatoClinica').css("visibility", 'hidden')
    //                            $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 3) {//anat patologica
    //                        $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaAnaPatologica').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaanaPatologica').css("visibility", 'visible');
    //                            $('#btnQuitaranaPatologica').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaanaPatologica').css("visibility", 'hidden')
    //                            $('#btnQuitaranaPatologica').css("visibility", 'hidden')
    //                            $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 11) {//sangre
    //                        $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetabancoSangre').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregabancoSangre').css("visibility", 'visible');
    //                            $('#btnQuitarbancoSangre').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregabancoSangre').css("visibility", 'hidden')
    //                            $('#btnQuitarbancoSangre').css("visibility", 'hidden')
    //                            $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 12) {//interconsulta
    //                        $('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaInterconsulta').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 12)
    //                        Ordenes.SeleccionaRecetaDetalleInterconsultaByIdReceta(obj.idReceta)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregainterconsultas').css("visibility", 'visible');
    //                            $('#btnQuitarinterconsultas').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregainterconsultas').css("visibility", 'hidden')
    //                            $('#btnQuitarinterconsultas').css("visibility", 'hidden')
    //                            $('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 22) {//tomografia jdelgado
    //                        $('#lbltomografia').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetatomografia').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 22)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregatomografia').css("visibility", 'visible');
    //                            $('#btnQuitartomografia').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregatomografia').css("visibility", 'hidden')
    //                            $('#btnQuitartomografia').css("visibility", 'hidden')
    //                            $('#lbltomografia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 5) {//farmacia
    //                        $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaFarmacia').val(obj.idReceta)
    //                        $('#txtFechaVigencia').val(obj.fechaVigenciaWeb)

    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaFarmacia').css("visibility", 'visible');
    //                            $('#btnQuitarFarmacia').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaFarmacia').css("visibility", 'hidden')
    //                            $('#btnQuitarFarmacia').css("visibility", 'hidden')
    //                            $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    else {
    //                        //Ordenes.listaFecha();
    //                    }
    //                });
    //                //('#lblPatoClinica').html("Receta Nro.: " + datos.table3[0]["idReceta"]);
    //                //$('#hdIdRecetaPatoClinica').val(datos.table3[0]["idReceta"]);
    //            }
    //            else {
    //                Ordenes.listaFecha();
    //            }
    //            Ordenes.validaActivabtnPaquete();
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error listar recetas!", "2");
    //            }, 900)
    //        }
    //    });
    //},

    async asignaPrecio(idproducto, idpuntoCarga, idTipoFinanciamiento) {
        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idproducto);
        midata.append('idpuntoCarga', idpuntoCarga);
        midata.append('idTipoFinanciamiento', idTipoFinanciamiento);

        await $.ajax({
            method: "POST",
            url: "/Catalogo/ProductoByIdByFuente?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,

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

    async listaCabPaquetes() {
        let midata = new FormData();
        let resp = false;

        midata.append('tipo', 0);
        midata.append('descripcion', "");

        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Catalogo/FactCatalogoPaqueteXtipoPaquete?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            $('#cboPaquetes').empty();
            $(datos.table).each(function (i, obj) {
                $('#cboPaquetes').append('<option  value="' + obj.idFactPaquete + '">' + obj.descripcion + '</option>');
            });

            $('.chzn-select').chosen().trigger("chosen:updated");
            $("#cboPaquetes").change();
            resp = true;
        } catch (error) {
            resp = false;
            alerta("ERROR", "Error listar paquetes!", "2");
        }

        return resp;
    },

    async ListarEspecialidades() { // JDELGADO011
        await fetch('/Utilitario/ListarEspecialidades?area=Comun', {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(res => {
                $('#cboEspecialidades').empty();
                if (res.session) {
                    $('#cboEspecialidades').append('<option  value="0">' + '-- Seleccionar --' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboEspecialidades').append('<option  value="' + obj.idEspecialidad + '">' + obj.nombre + '</option>');
                    });
                    $('#cboEspecialidades').val(0);
                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alert("La sesión ya expiró se volverá a recargar la página")
                }
            })
    },

    async ListarEspecialidadesHospitalizacion() { // JDELGADO011
        fetch('/Utilitario/ListarEspecialidades?area=Comun', {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(res => {
                $('#cboEspecialidades').empty();
                if (res.session) {
                    $('#cboEspecialidades').append('<option  value="0">' + '-- Seleccionar --' + '</option>');
                    $(res.dataSet.table).each(function (i, obj) {

                        if (obj.idEspecialidad == '33' || obj.idEspecialidad == '32' || obj.idEspecialidad == '36') {
                            $('#cboEspecialidades').append('<option  value="' + obj.idEspecialidad + '">' + obj.nombre + '</option>');
                        }


                    });
                    $('#cboEspecialidades').val(0);
                    $('.chzn-select').chosen().trigger("chosen:updated");
                } else {
                    alert("La sesión ya expiró se volverá a recargar la página")
                }
            })
    },

    async ListarTiposConsulta() { // JDELGADO011
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

    SeleccionarDiagnosticosCQx: async (idAtencion, clasificacion) => {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasificacion);

        ObjtableDiagnosticosSolicitudCQx.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/AtencionesDiagnosticosSeleccionarPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;

            $(datos.table).each((i, obj) => {
                if (obj.idTipoDiagnosticoCQx == 1) {
                    ObjtableDiagnosticosSolicitudCQx.api(true).row.add(obj).draw(false);
                }

            })


            //if (datos.table.length !== 0) {

            //    if (!isEmpty(datos.table)) {
            //        oTable_DiagnosticosPreOperatorio.fnClearTable()
            //        oTable_DiagnosticosPostOperatorios.fnClearTable()
            //    }
            //}
        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },

    SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(idReceta) { // JDELGADO011
        //console.log("idReceta", idReceta)

        var fecha = new Date()
        var dia = fecha.getDate()
        var mes = parseInt(fecha.getMonth()) + 1
        var yyy = fecha.getFullYear()
        if (dia < 10)
            dia = '0' + dia //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        let time1 = fecha.getHours() + ":" + (fecha.getMinutes() < 10 ? ("0" + fecha.getMinutes()) : fecha.getMinutes())
        //$('#txtFechaAtencion').val(fechaP)
        $("#txtFechaSolicitudCQx").datepicker("setDate", fechaP);
        $('#txtHoraSolicitudCQx').val(time1)

        $('#txtHoraSolicitudCQx').prop('disabled', true)
        $('#txtHoraSolicitudCQxAceptada').prop('disabled', true)

        let formData = new FormData()


        fetch('/SalaOperaciones/SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud?area=Comun&NroSolicitud=' + idReceta, {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(async res => {

                if (res.data.table.length > 0) {

                    let datosSolicitud = res.data.table[0]

                    $("#txtEdadAnioSolicitud").val(datosSolicitud.edadEnAnio)
                    $("#txtEdadMesSolicitud").val(datosSolicitud.edadEnMes)
                    $("#txtEdadDiaSolicitud").val(datosSolicitud.edadEnDia)

                    $("#cboClaseIntervencion").val(datosSolicitud.idTIpoIntervencion)
                    $("#cboUbicacionPlaciente").val(datosSolicitud.idUbicacionPaciente)
                    $("#cboClasePlaciente").val(datosSolicitud.idTipoPaciente)
                    $("#cboSolicitudCirujano").val(datosSolicitud.idCirujanoII)
                    $("#cboSolicitudPrimerAyudante").val(datosSolicitud.idMedicoAyudanteI)
                    $("#cboSolicitudAnestesiologoCQx").val(datosSolicitud.idAnestesiologo)
                    $("#cboSolicitudTipoAnestesiaPreviaCQx").val(datosSolicitud.idTipoAnestesiaPrevia)
                    $("#cboSalaSolicitudCQx").val(datosSolicitud.idSala)
                    $("#txtFechaParaCQx").val(datosSolicitud.fechaSugerida)
                    $("#txtHoraParaCqx").val(datosSolicitud.horaSugerida)
                    $("#txtFechaSolicitudCQx").val(datosSolicitud.fechaSolicitud)
                    $("#txtHoraSolicitudCQx").val(datosSolicitud.horaSolicitud)
                    $("#txtFechaSolicitudCQxAceptada").val(datosSolicitud.fechaAceptada)
                    $("#txtHoraSolicitudCQxAceptada").val(datosSolicitud.horaAceptada)

                    //await Ordenes.SeleccionarDiagnosticos(Variables.IdAtencion, 8)
                    await Ordenes.SeleccionarDiagnosticosCQx(Variables.IdAtencion, 8)

                }
                console.log('SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud', res)
            })
    },
    //listaRecetasByIdRecetaByPuntoCarga(idReceta, idPuntoCarga) {

    //    var midata = new FormData();
    //    midata.append('idReceta', idReceta);
    //    midata.append('idPuntoCarga', idPuntoCarga);

    //    $.ajax({
    //        method: "POST",
    //        url: "/Receta/ListaRecetaDetalle?area=Comun",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,
    //        //async: false,

    //        success: function (datos) {
    //            switch (idPuntoCarga) {
    //                case 21:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0) {
    //                            oTable_rayos.fnAddData(datos.table);
    //                        }
    //                    }
    //                    break;
    //                case 23:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0) {
    //                            oTable_ecoObs.fnAddData(datos.table);
    //                        }
    //                    }
    //                    break;
    //                case 20:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0) {
    //                            oTable_ecoGeneral.fnAddData(datos.table);
    //                        }
    //                    }
    //                    break;
    //                case 2:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0) {
    //                            oTable_PatoClinica.fnAddData(datos.table);
    //                        }
    //                    }
    //                    break;
    //                case 3:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0)
    //                            oTable_anatPatologica.fnAddData(datos.table);
    //                    }
    //                    break;
    //                case 11:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0)
    //                            oTable_bancoSangre.fnAddData(datos.table);
    //                    }
    //                    break;
    //                case 22:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0)
    //                            oTable_tomografia.fnAddData(datos.table);
    //                    }
    //                    break;
    //                case 12: // jdelgado011
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0)
    //                            oTable_interconsulta.fnAddData(datos.table);
    //                    }
    //                    break;
    //                case 5:
    //                    if (!isEmpty(datos.table)) {
    //                        if (datos.table.length !== 0)
    //                            oTable_farmacia.fnAddData(datos.table);
    //                        else
    //                            Ordenes.listaFecha();
    //                    }
    //                    break;
    //            }
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error listar receta detalle!", "2");
    //            }, 900)
    //        }
    //    });
    //},

    activaTabs() {

        $('[href="#farmacia"]').closest('li').show();
        $('[href="#farmaciaMedInsum"]').closest('li').show();
        $('[href="#farmaciaAntimicro"]').closest('li').show();
        $('[href="#farmaciaIntSanit"]').closest('li').show();
        $('[href="#ecoObst"]').closest('li').show();
        $('[href="#ecoObstProc"]').closest('li').show();
        $('[href="#rayos"]').closest('li').show();
        $('[href="#ecoGene"]').closest('li').show();
        $('[href="#anatoPato"]').closest('li').show();
        $('[href="#patoClinica"]').closest('li').show();
        $('[href="#bancoSangre"]').closest('li').show();
        $('[href="#tomografia"]').closest('li').show();
        $('[href="#interconsultas"]').closest('li').show();
        $('[href="#solicitudCQx"]').closest('li').show();

        $('#TabContentOrdenes [role="tabpanel"]').removeClass("active in");
        $('#TabContentOrdenes [role="tabpanel"]').attr('aria-expanded', 'false');

        $('.nav-tabs a[href="#farmacia"]').tab('show');     //KHOYOSI        
        $('#farmacia').attr('aria-expanded', 'true');
        $('#farmacia').addClass('active in');

        $('.nav-tabs a[href="#farmaciaMedInsum"]').tab('show');     //KHOYOSI
        $('#farmaciaMedInsum').attr('aria-expanded', 'true');
        $('#farmaciaMedInsum').addClass('active in');

        $("#cboFarmacia").change();                         //KHOYOSI
    },

    //bloqueByPuntoCarga(idReceta, idPuntoCarga) {      //SE CAMBIO POR EL METODO (CargarCabeceraPorPuntoCarga)

    //    $('#hdIdRecetaRX').val(0)
    //    $('#lblRx').html(0)

    //    $('#hdIdRecetaEcoObs').val(0)
    //    $('#lblEcoObs').html(0)

    //    $('#hdIdRecetaEcoObsProc').val(0)
    //    $('#lblEcoObsProc').html(0)

    //    $('#hdIdRecetaEcoGene').val(0)
    //    $('#lblEcoGene').html(0)

    //    $('#hdIdRecetaPatoClinica').val(0)
    //    $('#lblPatoClinica').html(0)

    //    $('#hdIdRecetaAnaPatologica').val(0)
    //    $('#lblanaPatologica').html(0)

    //    $('#hdIdRecetabancoSangre').val(0)
    //    $('#lblbancoSangre').html(0)

    //    $('#hdIdRecetaFarmacia').val(0)
    //    $('#lblFarmacia').html(0)

    //    $('#hdIdRecetaInterconsulta').val(0)
    //    $('#lblInterconsulta').html(0)

    //    $('#hdIdRecetatomografia').val(0)
    //    $('#lbltomografia').html(0)

    //    $('[href="#farmacia"]').closest('li').hide();
    //    $('[href="#ecoObst"]').closest('li').hide();
    //    $('[href="#ecoObstProc"]').closest('li').hide();
    //    $('[href="#ecoMedFet"]').closest('li').hide();
    //    $('[href="#rayos"]').closest('li').hide();
    //    $('[href="#ecoGene"]').closest('li').hide();
    //    $('[href="#anatoPato"]').closest('li').hide();
    //    $('[href="#patoClinica"]').closest('li').hide();
    //    $('[href="#bancoSangre"]').closest('li').hide();
    //    $('[href="#tomografia"]').closest('li').hide();
    //    $('[href="#interconsultas"]').closest('li').hide();

    //    switch (idPuntoCarga) {
    //        case 21:
    //            $('#lblRx').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaRX').val(idReceta);
    //            $('.nav-tabs a[href="#rayos"]').tab('show');
    //            $('[href="#rayos"]').closest('li').show();
    //            break;
    //        case 23:
    //            $('#lblEcoObs').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaEcoObs').val(idReceta);
    //            $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
    //            $('[href="#ecoMedFet"]').closest('li').show();
    //            $('.nav-tabs a[href="#ecoObst"]').tab('show');
    //            $('[href="#ecoObst"]').closest('li').show();                
    //            break;
    //        case 24:
    //            $('#lblEcoObsProc').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaEcoObsProc').val(idReceta);
    //            $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
    //            $('[href="#ecoMedFet"]').closest('li').show();
    //            $('.nav-tabs a[href="#ecoObstProc"]').tab('show');
    //            $('[href="#ecoObstProc"]').closest('li').show();                
    //            break;
    //        case 20:
    //            $('#lblEcoGene').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaEcoGene').val(idReceta);
    //            $('.nav-tabs a[href="#ecoGene"]').tab('show');
    //            $('[href="#ecoGene"]').closest('li').show();
    //            break;
    //        case 2:
    //            $('#lblPatoClinica').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaPatoClinica').val(idReceta);
    //            $('.nav-tabs a[href="#patoClinica"]').tab('show');
    //            $('[href="#patoClinica"]').closest('li').show();
    //            break;
    //        case 3:
    //            $('#lblanaPatologica').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaAnaPatologica').val(idReceta);
    //            $('.nav-tabs a[href="#anatoPato"]').tab('show');
    //            $('[href="#anatoPato"]').closest('li').show();
    //            break;
    //        case 11:
    //            $('#lblbancoSangre').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetabancoSangre').val(idReceta);
    //            $('.nav-tabs a[href="#bancoSangre"]').tab('show');
    //            $('[href="#bancoSangre"]').closest('li').show();
    //            break;
    //        case 22:
    //            $('#lbltomografia').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetatomografia').val(idReceta);
    //            $('.nav-tabs a[href="#tomografia"]').tab('show');
    //            $('[href="#tomografia"]').closest('li').show();
    //            break;
    //        case 5:
    //            $('#lblFarmacia').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaFarmacia').val(idReceta);
    //            $('.nav-tabs a[href="#farmacia"]').tab('show');
    //            $('[href="#farmacia"]').closest('li').show();
    //            break;

    //        case 12:
    //            $('#lblInterconsulta').html("Receta Nro.: " + idReceta);
    //            $('#hdIdRecetaInterconsulta').val(idReceta);
    //            $('.nav-tabs a[href="#interconsultas"]').tab('show');
    //            $('[href="#interconsultas"]').closest('li').show();
    //            break;

    //    }
    //},

    CargarCabeceraPorPuntoCarga(datos) {
        let labelReceta = '';
        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoObsProc').val(0)
        $('#lblEcoObsProc').html(0)

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

        $('#hdIdRecetaFarmaciaAntimic').val(0)
        $('#lblFarmaciaAntimic').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        $('#hdIdRecetaSolicitudCQx').val(0)
        $('#lblSolicitudCQx').html(0)

        $('[href="#farmacia"]').closest('li').hide();
        $('[href="#farmaciaMedInsum"]').closest('li').hide();
        $('[href="#farmaciaAntimicro"]').closest('li').hide();
        $('[href="#farmaciaIntSanit"]').closest('li').hide();
        $('[href="#ecoObst"]').closest('li').hide();
        $('[href="#ecoObstProc"]').closest('li').hide();
        $('[href="#ecoMedFet"]').closest('li').hide();
        $('[href="#rayos"]').closest('li').hide();
        $('[href="#ecoGene"]').closest('li').hide();
        $('[href="#anatoPato"]').closest('li').hide();
        $('[href="#patoClinica"]').closest('li').hide();
        $('[href="#bancoSangre"]').closest('li').hide();
        $('[href="#tomografia"]').closest('li').hide();
        $('[href="#interconsultas"]').closest('li').hide();
        $('[href="#solicitudCQx"]').closest('li').hide();

        labelReceta = "(Receta N° " + datos.idReceta + ")";
        labelReceta = labelReceta + (datos.estado != "" ? "(Estado: " + datos.estado + ") " : "");
        labelReceta = labelReceta + (datos.movimiento != "" ? "(Movim: " + datos.movimiento + ")" : "");
        labelReceta = labelReceta + (datos.boleta != "" ? "(Boleta: " + datos.boleta + ")" : "");

        //Ordenes.idCuentaAtencion = datos.idCuentaAtencion;
        //Ordenes.idServicio = datos.idServicioReceta;



        switch (datos.idPuntoCarga) {
            case 21:
                $('#lblRx').html(labelReceta);
                $('#hdIdRecetaRX').val(datos.idReceta);
                $('.nav-tabs a[href="#rayos"]').tab('show');
                $('[href="#rayos"]').closest('li').show();
                break;
            case 23:
                $('#lblEcoObs').html(labelReceta);
                $('#hdIdRecetaEcoObs').val(datos.idReceta);
                $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
                $('[href="#ecoMedFet"]').closest('li').show();
                $('.nav-tabs a[href="#ecoObst"]').tab('show');
                $('[href="#ecoObst"]').closest('li').show();
                break;
            case 24:
                $('#lblEcoObsProc').html(labelReceta);
                $('#hdIdRecetaEcoObsProc').val(datos.idReceta);
                $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
                $('[href="#ecoMedFet"]').closest('li').show();
                $('.nav-tabs a[href="#ecoObstProc"]').tab('show');
                $('[href="#ecoObstProc"]').closest('li').show();
                break;
            case 20:
                $('#lblEcoGene').html(labelReceta);
                $('#hdIdRecetaEcoGene').val(datos.idReceta);
                $('.nav-tabs a[href="#ecoGene"]').tab('show');
                $('[href="#ecoGene"]').closest('li').show();
                break;
            case 2:
                $('#lblPatoClinica').html(labelReceta);
                $('#hdIdRecetaPatoClinica').val(datos.idReceta);
                $('.nav-tabs a[href="#patoClinica"]').tab('show');
                $('[href="#patoClinica"]').closest('li').show();
                break;
            case 3:
                $('#lblanaPatologica').html(labelReceta);
                $('#hdIdRecetaAnaPatologica').val(datos.idReceta);
                $('.nav-tabs a[href="#anatoPato"]').tab('show');
                $('[href="#anatoPato"]').closest('li').show();
                break;
            case 11:
                $('#lblbancoSangre').html(labelReceta);
                $('#hdIdRecetabancoSangre').val(datos.idReceta);
                $('.nav-tabs a[href="#bancoSangre"]').tab('show');
                $('[href="#bancoSangre"]').closest('li').show();
                break;
            case 22:
                $('#lbltomografia').html(labelReceta);
                $('#hdIdRecetatomografia').val(datos.idReceta);
                $('.nav-tabs a[href="#tomografia"]').tab('show');
                $('[href="#tomografia"]').closest('li').show();
                break;
            case 5:
                if (datos.esRecetaAntimicrobiano == 0) {
                    $('#lblFarmacia').html(labelReceta);
                    $('#hdIdRecetaFarmacia').val(datos.idReceta);
                    $('.nav-tabs a[href="#farmacia"]').tab('show');
                    $('[href="#farmacia"]').closest('li').show();
                    $('.nav-tabs a[href="#farmaciaMedInsum"]').tab('show');
                    $('[href="#farmaciaMedInsum"]').closest('li').show();
                }

                if (datos.esRecetaAntimicrobiano == 1) {
                    $('#lblFarmaciaAntimic').html(labelReceta);
                    $('#hdIdRecetaFarmaciaAntimic').val(datos.idReceta);
                    $('.nav-tabs a[href="#farmacia"]').tab('show');
                    $('[href="#farmacia"]').closest('li').show();
                    $('.nav-tabs a[href="#farmaciaAntimicro"]').tab('show');
                    $('[href="#farmaciaAntimicro"]').closest('li').show();
                }
                break;

            case 12:
                $('#lblInterconsulta').html(labelReceta);
                $('#hdIdRecetaInterconsulta').val(datos.idReceta);
                $('.nav-tabs a[href="#interconsultas"]').tab('show');
                $('[href="#interconsultas"]').closest('li').show();
                break;

            case 1060:
                $('#lblSolicitudCQx').html(labelReceta);
                $('#hdIdRecetaSolicitudCQx').val(datos.idReceta);
                $('.nav-tabs a[href="#solicitudCQx"]').tab('show');
                $('[href="#solicitudCQx"]').closest('li').show();

                //Ordenes.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(datos.idReceta)
                break;

        }
    },

    //CargarDatosRecetaCabecera(datos) {
    async CargarDatosOrdenMedica(datos) {
        let labelReceta = "";
        let detalleReceta = null;

        //Ordenes.activaTabs();
        Ordenes.LimpiarOrdenesMedicas();
        $('[href="#farmacia"]').closest('li').hide();
        $('[href="#farmaciaMedInsum"]').closest('li').hide();
        $('[href="#farmaciaAntimicro"]').closest('li').hide();
        $('[href="#farmaciaIntSanit"]').closest('li').hide();
        $('[href="#ecoObst"]').closest('li').hide();
        $('[href="#ecoObstProc"]').closest('li').hide();
        $('[href="#ecoMedFet"]').closest('li').hide();
        $('[href="#rayos"]').closest('li').hide();
        $('[href="#ecoGene"]').closest('li').hide();
        $('[href="#anatoPato"]').closest('li').hide();
        $('[href="#patoClinica"]').closest('li').hide();
        $('[href="#bancoSangre"]').closest('li').hide();
        $('[href="#tomografia"]').closest('li').hide();
        $('[href="#interconsultas"]').closest('li').hide();
        $('[href="#solicitudCQx"]').closest('li').hide();

        await Ordenes.ListarDiagnosticosRecetasPorAtencion(Variables.IdAtencion, Variables.NumeroEvaluacion);
        if (datos.length > 0) {
            $(datos).each(async function (i, obj) {
                labelReceta = "(Receta N° " + obj.idReceta + ")";
                labelReceta = labelReceta + (obj.estadoReceta != "" ? "(Estado: " + obj.estadoReceta + ") " : "");
                labelReceta = labelReceta + (obj.movimiento != "" ? "(Movim: " + obj.movimiento + ")" : "");
                labelReceta = labelReceta + (obj.boleta != "" ? "(Boleta: " + obj.boleta + ")" : "");

                if (obj.idPuntoCarga == 21) //rx
                {
                    $('#lblRx').html(labelReceta);
                    $('#hdIdRecetaRX').val(obj.idReceta);
                    $('.nav-tabs a[href="#rayos"]').tab('show');
                    $('[href="#rayos"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 21)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_rayos.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaRayosX').css("visibility", 'visible');
                        $('#btnQuitarRayos').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaRayosX').css("visibility", 'hidden')
                        $('#btnQuitarRayos').css("visibility", 'hidden')
                        //$('#lblRx').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 23) {//eco obs
                    $('#lblEcoObs').html(labelReceta);
                    $('#hdIdRecetaEcoObs').val(obj.idReceta);
                    $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
                    $('[href="#ecoMedFet"]').closest('li').show();
                    $('.nav-tabs a[href="#ecoObst"]').tab('show');
                    $('[href="#ecoObst"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 23)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_ecoObs.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaEcoObs').css("visibility", 'visible');
                        $('#btnQuitarEcoObs').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaEcoObs').css("visibility", 'hidden')
                        $('#btnQuitarEcoObs').css("visibility", 'hidden')
                        //$('#lblEcoObs').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 24) {//eco obs proc
                    $('#lblEcoObsProc').html(labelReceta);
                    $('#hdIdRecetaEcoObsProc').val(obj.idReceta);
                    $('.nav-tabs a[href="#ecoMedFet"]').tab('show');
                    $('[href="#ecoMedFet"]').closest('li').show();
                    $('.nav-tabs a[href="#ecoObstProc"]').tab('show');
                    $('[href="#ecoObstProc"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 24)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_ecoObsProc.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaEcoObsProc').css("visibility", 'visible');
                        $('#btnQuitarEcoObsProc').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaEcoObsProc').css("visibility", 'hidden')
                        $('#btnQuitarEcoObsProc').css("visibility", 'hidden')
                        //$('#lblEcoObsProc').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 20) {//eco gene
                    $('#lblEcoGene').html(labelReceta);
                    $('#hdIdRecetaEcoGene').val(obj.idReceta);
                    $('.nav-tabs a[href="#ecoGene"]').tab('show');
                    $('[href="#ecoGene"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 20)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_ecoGeneral.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaEcoGene').css("visibility", 'visible');
                        $('#btnQuitarEcoGene').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaEcoGene').css("visibility", 'hidden')
                        $('#btnQuitarEcoGene').css("visibility", 'hidden')
                        //$('#lblEcoGene').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 2) {//pt clinica
                    $('#lblPatoClinica').html(labelReceta);
                    $('#hdIdRecetaPatoClinica').val(obj.idReceta);
                    $('.nav-tabs a[href="#patoClinica"]').tab('show');
                    $('[href="#patoClinica"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 2)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_PatoClinica.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaPatoClinica').css("visibility", 'visible');
                        $('#btnQuitarPatoClinica').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaPatoClinica').css("visibility", 'hidden')
                        $('#btnQuitarPatoClinica').css("visibility", 'hidden')
                        //$('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 3) {//anat patologica
                    $('#lblanaPatologica').html(labelReceta);
                    $('#hdIdRecetaAnaPatologica').val(obj.idReceta)
                    $('.nav-tabs a[href="#anatoPato"]').tab('show');
                    $('[href="#anatoPato"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 3)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_anatPatologica.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregaanaPatologica').css("visibility", 'visible');
                        $('#btnQuitaranaPatologica').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaanaPatologica').css("visibility", 'hidden')
                        $('#btnQuitaranaPatologica').css("visibility", 'hidden')
                        //$('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 11) {//sangre
                    $('#lblbancoSangre').html(labelReceta);
                    $('#hdIdRecetabancoSangre').val(obj.idReceta)
                    $('.nav-tabs a[href="#bancoSangre"]').tab('show');
                    $('[href="#bancoSangre"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 11)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_bancoSangre.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregabancoSangre').css("visibility", 'visible');
                        $('#btnQuitarbancoSangre').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregabancoSangre').css("visibility", 'hidden')
                        $('#btnQuitarbancoSangre').css("visibility", 'hidden')
                        //$('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }
                if (obj.idPuntoCarga == 12) {//interconsulta
                    $('#lblInterconsulta').html(labelReceta);
                    $('#hdIdRecetaInterconsulta').val(obj.idReceta)
                    $('.nav-tabs a[href="#interconsultas"]').tab('show');
                    $('[href="#interconsultas"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 12)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_interconsulta.fnAddData(detalleReceta.table);
                    }

                    Ordenes.SeleccionaRecetaDetalleInterconsultaByIdReceta(obj.idReceta)
                    if (obj.idEstado === 1) {
                        $('#btnAgregainterconsultas').css("visibility", 'visible');
                        $('#btnQuitarinterconsultas').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregainterconsultas').css("visibility", 'hidden')
                        $('#btnQuitarinterconsultas').css("visibility", 'hidden')
                        //$('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }

                if (obj.idPuntoCarga == 1060) {// solicitudCQx
                    labelReceta = "(N° Solicitud " + obj.idReceta + ")";
                    $('#lblSolicitudCQx').html(labelReceta);
                    $('#hdIdRecetaSolicitudCQx').val(obj.idReceta)
                    $('.nav-tabs a[href="#solicitudCQx"]').tab('show');
                    $('[href="#solicitudCQx"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 1060)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_solicitudCQx.fnAddData(detalleReceta.table);
                    }

                    Ordenes.SeleccionarSolicitudesSalaOperacionCQxByNroSolicitud(obj.idReceta) // aqui tengo que jalar los datos de la interconsulta
                    if (obj.idEstado === 1) {
                        $('#btnAgregaSolicitudCQx').css("visibility", 'visible');
                        $('#btnQuitarSolicitudCQx').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregaSolicitudCQx').css("visibility", 'hidden')
                        $('#btnQuitarSolicitudCQx').css("visibility", 'hidden')
                        //$('#lblInterconsulta').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }


                if (obj.idPuntoCarga == 22) {//tomografia jdelgado
                    $('#lbltomografia').html(labelReceta);
                    $('#hdIdRecetatomografia').val(obj.idReceta)
                    $('.nav-tabs a[href="#tomografia"]').tab('show');
                    $('[href="#tomografia"]').closest('li').show();
                    detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 22)
                    if (!isEmpty(detalleReceta.table)) {
                        oTable_tomografia.fnAddData(detalleReceta.table);
                    }

                    if (obj.idEstado === 1) {
                        $('#btnAgregatomografia').css("visibility", 'visible');
                        $('#btnQuitartomografia').css("visibility", 'visible');
                    }
                    else {
                        $('#btnAgregatomografia').css("visibility", 'hidden')
                        $('#btnQuitartomografia').css("visibility", 'hidden')
                        //$('#lbltomografia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                    }
                }

                if (obj.idPuntoCarga == 5) {//farmacia

                    /////////RECETA FARMACIA///////////////////////////////////
                    if (isNull(obj.esRecetaAntimicrobiano, 0) == 0 && isNull(obj.esRecetaIntervencionSanitaria, 0) == 0) {
                    //if ((isNull(obj.esRecetaAntimicrobiano, 0) == 0 || isNull(obj.esRecetaAntimicrobiano, 0) == 1) && isNull(obj.esRecetaIntervencionSanitaria, 0) == 0) {          //SE CAMBIO LA LOGICA  PARA INCLUIR LOS ANRTIMICROBIANOS DENTRO DE LA MISMA VISTA DE MEDICAMENTO
                        $('#lblFarmacia').html(labelReceta);
                        $('#hdIdRecetaFarmacia').val(obj.idReceta);
                        $('.nav-tabs a[href="#farmacia"]').tab('show');
                        $('[href="#farmacia"]').closest('li').show();
                        $('.nav-tabs a[href="#farmaciaMedInsum"]').tab('show');
                        $('[href="#farmaciaMedInsum"]').closest('li').show();
                        $("#txtFechaVigencia").datepicker("setDate", obj.fechaVigenciaWeb);
                        $("#txtOtrosMedicamentos").val(obj.otrosMedicamentos);

                        detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 5)
                        if (!isEmpty(detalleReceta.table)) {
                            oTable_farmacia.fnAddData(detalleReceta.table);
                        }

                        //SE AGREGO LA LOGICA  PARA INCLUIR LA SOLICUTUD ANRTIMICROBIANOS DENTRO DE LA MISMA VISTA DE MEDICAMENTO
                        /*
                        if (isNull(obj.esRecetaAntimicrobiano, 0) == 1) {
                            $('#hdIdRecetaFarmaciaAntimic').val(obj.idReceta);
                            if (obj.idSolicitudAntimicrobiano > 0) {
                                //$('#rdbGeneraSolAntimicSI').click();
                                $('#rdbGeneraSolAntimicSI').prop('checked', true);
                                Ordenes.DesbloquearCamposAntimicrobianos();
                                await Ordenes.SeleccionarSolicitudAntimicrobiano(obj.idSolicitudAntimicrobiano);
                            } else {
                                //$('#rdbGeneraSolAntimicNO').click();
                                $('#rdbGeneraSolAntimicNO').prop('checked', true);
                                Ordenes.LimpiarCamposAntimicrobianos();
                                Ordenes.BloquearCamposAntimicrobianos();
                            }
                            $("#frmSolicitudAntimicrobianos").show();
                        } else {
                            $('#hdIdRecetaFarmacia').val(obj.idReceta);
                            $("#frmSolicitudAntimicrobianos").hide();
                        }
                        */
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        if (obj.idEstado === 1) {
                            $('#btnAgregaFarmacia').css("visibility", 'visible');
                            $('#btnQuitarFarmacia').css("visibility", 'visible');
                        }
                        else {
                            $('#btnAgregaFarmacia').css("visibility", 'hidden')
                            $('#btnQuitarFarmacia').css("visibility", 'hidden')
                            //$('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                        }
                    }

                    //SE CAMBIO LA COMENTO PARA INCLUIR LOS ANRTIMICROBIANOS DENTRO DE LA MISMA VISTA DE MEDICAMENTO
                    /////////RECETA FARMACIA ANTIMICROBIANOS///////////////////////////////////
                    if (isNull(obj.esRecetaAntimicrobiano, 0) == 1 && isNull(obj.esRecetaIntervencionSanitaria, 0) == 0) {
                        $('#lblFarmaciaAntimic').html(labelReceta);
                        $('#hdIdRecetaFarmaciaAntimic').val(obj.idReceta);
                        await Ordenes.SeleccionarProaAntimicrobiano(obj.idReceta); // MGAMERO - PROA
                        $('.nav-tabs a[href="#farmacia"]').tab('show');
                        $('[href="#farmacia"]').closest('li').show();
                        $('.nav-tabs a[href="#farmaciaAntimicro"]').tab('show');
                        $('[href="#farmaciaAntimicro"]').closest('li').show();
                        $("#txtFechaVigencia").datepicker("setDate", obj.fechaVigenciaWeb);

                        //detalleReceta = await Ordenes.SeleccionarRecetaAntimicrobianoDetalle(obj.idReceta, 5)
                        detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 5)
                        if (!isEmpty(detalleReceta.table)) {
                            oTable_farmaciaAntimic.fnAddData(detalleReceta.table);
                        }

                        if (obj.idSolicitudAntimicrobiano > 0) {
                            $('#rdbGeneraSolAntimicSI').click();
                            Ordenes.DesbloquearCamposAntimicrobianos();
                            await Ordenes.SeleccionarSolicitudAntimicrobiano(obj.idSolicitudAntimicrobiano);
                        } else {
                            $('#rdbGeneraSolAntimicNO').click();
                            Ordenes.LimpiarCamposAntimicrobianos();
                            Ordenes.BloquearCamposAntimicrobianos();
                        }

                        if (obj.idEstado === 1) {
                            $('#btnAgregaFarmaciaAntimic').css("visibility", 'visible');
                            $('#btnQuitarFarmaciaAntimic').css("visibility", 'visible');
                        }
                        else {
                            $('#btnAgregaFarmaciaAntimic').css("visibility", 'hidden')
                            $('#btnQuitarFarmaciaAntimic').css("visibility", 'hidden')
                            //$('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                        }
                    }

                    /////////RECETA FARMACIA INTERVENCION SANITARIA///////////////////////////////////
                    if (isNull(obj.esRecetaAntimicrobiano, 0) == 0 && isNull(obj.esRecetaIntervencionSanitaria, 0) == 1) {
                        $('#lblFarmaciaIntSanit').html(labelReceta);
                        $('#hdIdRecetaFarmaciaIntSanit').val(obj.idReceta);
                        $('.nav-tabs a[href="#farmaciaIntSanit"]').tab('show');
                        $('[href="#farmaciaIntSanit"]').closest('li').show();
                        $('.nav-tabs a[href="#farmaciaIntSanit"]').tab('show');
                        $('[href="#farmaciaIntSanit"]').closest('li').show();
                        $("#txtFechaVigencia").datepicker("setDate", obj.fechaVigenciaWeb);

                        //$('#XXXXXXXXXXXXXXX').val(obj.IdObstetraReceta);
                        $('#cboCoordinadorIntSanit').val(obj.idCoordinadorIS);
                        $('#cboComponenteIntSanit').val(obj.idComponenteIS);
                        $('#cboComponenteIntSanit').change();
                        $('#cboSubComponenteIntSanit').val(obj.idSubComponenteIS);
                        await Ordenes.ListaDiagnosticosIntervencionSanitaria(obj.codigoDxIS);
                        $('#cboDiagnosticoIntSanit').val(obj.idDiagnosticoIS);
                        $('#txtObservacionesIntSanit').val(obj.observacionesIS);

                        $('.chzn-select').chosen().trigger("chosen:updated");

                        detalleReceta = await Ordenes.SeleccionarRecetaDetalle(obj.idReceta, 5)
                        if (!isEmpty(detalleReceta.table)) {
                            oTable_farmaciaIntSanit.fnAddData(detalleReceta.table);
                        }

                        if (obj.idEstado === 1) {
                            $('#btnAgregaFarmaciaIntSanit').css("visibility", 'visible');
                            $('#btnQuitarFarmaciaIntSanit').css("visibility", 'visible');
                        }
                        else {
                            $('#btnAgregaFarmaciaIntSanit').css("visibility", 'hidden')
                            $('#btnQuitarFarmaciaIntSanit').css("visibility", 'hidden')
                            //$('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
                        }
                    }



                }


                Ordenes.ubicaMedico(obj.idMedicoReceta);

                //oTable_DiagnosticosOrdenesMedicas.fnClearTable();
                //if (isEmpty(detalleReceta.table1) == false) {
                //    if (detalleReceta.table1.length > 0) {
                //        oTable_DiagnosticosOrdenesMedicas.fnAddData(detalleReceta.table1);
                //    }
                //}

            });
        } else {
            Ordenes.listaFecha();
        }

        OrdenesRecetasMedicas = datos;
        Ordenes.validaActivabtnPaquete();
    },


    initDatablesCatalogo() {

        let parms = {
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
        let parms = {
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
                    width: '10%',
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "codigo",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '50%',
                    data: "descripcion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "cantidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "precio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    data: "importe",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    visible: false,
                    data: "idPuntoCarga",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
                    visible: false,
                    data: "idProducto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                //cambio vias 
                {
                    width: '0%',
                    visible: false,
                    data: "idViaAdministracion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '0%',
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
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '35%',
                    targets: 1,
                    data: "producto",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        //console.log(td);
                        if (rowData.tipoProducto == "ANT") {
                            $(td).parent().css('color', '#c100cc');
                            //$(td).parent().css('font-weight', 'bold');
                        }
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
                    width: '10%',
                    targets: 6,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 7,
                    data: "observaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
                        if (rowData.observaciones == "") {
                            caja = '  <input id="txtFrec_' + rowData.idItem + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        } else {
                            caja = '  <input id="txtFrec_' + rowData.idItem + '" value="' + rowData.observaciones + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        }
                        $(td).html(caja)
                    }
                },
                {
                    width: '15%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
                        console.log(rowData.dx, Diagnosticos.DevolverDiagnosticos().toArray());
                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS

                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            //$('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    },

                },                
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblCatalogoFarmacia'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmacia = $("#tblCatalogoFarmacia").dataTable(parms);
        $('#tblCatalogoFarmacia_length').css('display', 'none');
    },

    initDatablesFarmaciaAntimirobianos() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '35%',
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
                        inputCantidad = '  <input id="txtCantAntimic_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
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
                    width: '10%',
                    targets: 6,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 7,
                    data: "observaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
                        if (rowData.observaciones == "") {
                            caja = '  <input id="txtFrecAntimic_' + rowData.idItem + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        } else {
                            caja = '  <input id="txtFrecAntimic_' + rowData.idItem + '" value="' + rowData.observaciones + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        }
                        $(td).html(caja)
                    }
                },
                {
                    width: '15%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDxAntimic_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblCatalogoFarmaciaAntimic'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmaciaAntimic = $("#tblCatalogoFarmaciaAntimic").dataTable(parms);
        $('#tblCatalogoFarmaciaAntimic_length').css('display', 'none');
    },

    initDatablesFarmaciaIntervencionSanitaria() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '35%',
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
                        inputCantidad = '  <input id="txtCantIntSanit_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
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
                    width: '10%',
                    targets: 6,
                    data: "vias",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 7,
                    data: "observaciones",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";
                        if (rowData.observaciones == "") {
                            caja = '  <input id="txtFrecIntSanit_' + rowData.idItem + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        } else {
                            caja = '  <input id="txtFrecIntSanit_' + rowData.idItem + '" value="' + rowData.observaciones + '" style=" width: 90%;" autocomplete="off" placeholder="" class="form-control form-control-sm">'
                        }
                        $(td).html(caja)
                    }
                },
                {
                    width: '15%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDxIntSanit_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
                //RQ0003
            ]
        }
        var tableWrapper = $('#tblCatalogoFarmaciaIntSanit'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_farmaciaIntSanit = $("#tblCatalogoFarmaciaIntSanit").dataTable(parms);
        $('#tblCatalogoFarmaciaIntSanit_length').css('display', 'none');
    },


    initDatablesEcoObs() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

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
    initDatablesEcoObsProc() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }

            ],
            fixedColumns: true
        }
        var tableWrapper = $('#tblCatalogoEcoObsProc'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_ecoObsProc = $("#tblCatalogoEcoObsProc").dataTable(parms);
        $('#tblCatalogoEcoObsProc_length').css('display', 'none')
    },
    initDatablesAnatomiaPatologica() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '60%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idFrecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "frecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx || Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`
                        //caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${Ordenes.lstDxAtencion.length==1 && !rowData?.dx ?Ordenes.lstDxAtencion[0]:rowData?.dx}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS

                        console.log("prueba", cellData, rowData , row, col);
                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            //caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                            caja += '<option  value="'+obj.codigoCIE10.toString().trim() +'">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

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
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '60%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idFrecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "frecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

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
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '60%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '0%',
                    targets: 0,
                    visible: false,
                    data: "idFrecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: "frecuencia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
                //{
                //    width: '0%',
                //    targets: 3,
                //    visible: false,
                //    data: "idEspecialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '20%',
                //    targets: 4,
                //    data: "especialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }
        var tableWrapper = $('#tblCatalogobancoSangre'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_bancoSangre = $("#tblCatalogobancoSangre").dataTable(parms);
        $('#tblCatalogobancoSangre_length').css('display', 'none')
    },
    initDatablesTomografia() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

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
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '60%',
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
                },
                {
                    width: '0%',
                    targets: 3,
                    visible: false,
                    data: "idEspecialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 4,
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '20%',
                    targets: 5,
                    data: "otraEspecialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
            ]
        }

        var tableWrapper = $('#tblCatalogointerconsultas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_interconsulta = $("#tblCatalogointerconsultas").dataTable(parms);
        $('#tblCatalogointerconsultas_length').css('display', 'none')
    },
    initDatablesEcoGeneral() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

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

        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
            ]
        }
        var tableWrapper = $('#tblCatalogoRayos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_rayos = $("#tblCatalogoRayos").dataTable(parms);
        $('#tblCatalogoRayos_length').css('display', 'none')

    },
    initDatablesSolicitudCQx() {
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
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
                    width: '70%',
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
                        $(td).attr('align', 'left')
                        var inputCantidad = '';
                        inputCantidad = '  <input id="txtCant_' + rowData.idItem + '" value="' + rowData.cantidadPedida + '" style=" width: 80%;" autocomplete="off" placeholder="" class="form-control form-control-sm solo-numero">'
                        $(td).html(inputCantidad);
                    }
                },
                {
                    width: '20%',
                    //visible: false,
                    targets: 8,
                    data: "dx",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        var caja = "";

                        caja = `<select class="chzn-select" data-placeholder="Seleccionar una opcion" id="cboDx_${rowData.idItem}" value="${rowData?.dx||Diagnosticos?.DevolverDiagnosticos()?.toArray()[0]?.codigoCIE10.trim()}">`

                        let cboDx = "#cboDx_" + rowData.idItem;            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS


                        //AGREAGADO POR KHOYOSI
                        $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        });

                        caja += `</select>`

                        $(td).html(caja)


                        //COMENTADO POR KHOYOSI
                        //if ((typeof ObjtableDiagnosticos) != 'undefined') {
                        //    let lstDx = ObjtableDiagnosticos.api(true).data().toArray()

                        //    if (lstDx.length > 0) {
                        //        $(lstDx).each(function (i, obj) {
                        //            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //        });

                        //        caja += `</select>`

                        //        $(td).html(caja)
                        //    }
                        //} else {
                        //    let formData = new FormData()

                        //    formData.append('IdAtencion', Variables.IdAtencion)
                        //    HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                        //        .then(res => {
                        //            if (!isEmpty(res)) {
                        //                if (res.estado) {
                        //                    let data = res.data
                        //                    if (data.table.length > 0) {
                        //                        $(data.table).each(function (i, obj) {
                        //                            caja += '<option  value="' + obj.codigoCIE10.toString().trim() + '">' + obj.codigoCIE10 + '</option>'
                        //                        });

                        //                        caja += `</select>`

                        //                        $(td).html(caja)

                        //                        setTimeout(() => {
                        //                            $(cboDx).val(cellData)

                        //                            $('.chzn-select').chosen().trigger("chosen:updated")
                        //                        }, 500)
                        //                    }
                        //                } else {
                        //                    alerta('3', 'Error: ' + res.msg)
                        //                    return null
                        //                }
                        //            }

                        //        })
                        //        .catch((e) => {
                        //            alerta(3, 'Algo salio mal ' + e)
                        //            return null
                        //        })
                        //}





                        setTimeout(() => {
                            $(cboDx).val(cellData)

                            $('.chzn-select').chosen().trigger("chosen:updated")
                        }, 500)

                    }
                }
                //{
                //    width: '0%',
                //    targets: 3,
                //    visible: false,
                //    data: "idEspecialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //},
                //{
                //    width: '20%',
                //    targets: 4,
                //    data: "especialidad",
                //    createdCell: function (td, cellData, rowData, row, col) {
                //        $(td).attr('align', 'left')
                //    }
                //}
            ]
        }
        var tableWrapper = $('#tblCatalogoSolicitudCQx'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_solicitudCQx = $("#tblCatalogoSolicitudCQx").dataTable(parms);
        $('#tblCatalogoSolicitudCQx_length').css('display', 'none')
    },

    ////////////////////COMENTADO POR KHOYOSI ---- SE MOVIO LOS DAIGNOSTICOS EN LA PARTE SUPERIOR --------------
    //initDiagnosticosInterconsulta() {

    //    let params = {
    //        destroy: true,
    //        data: null,
    //        info: false,
    //        bFilter: false,
    //        scrollY: '70vh',
    //        "autoWidth": false,
    //        scrollCollapse: true,
    //        bLengthChange: false,
    //        bPaginate: false,
    //        buttons: [],
    //        columns: [
    //            { width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false },
    //            { width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
    //            { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
    //            { width: '80%', targets: 3, "data": "descripcion" },
    //            { width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
    //            { width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
    //            { width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
    //            { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": true },
    //            { width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false }

    //        ]
    //    }
    //    var tableWrapper = $('#tblDiagnosticosInterconsulta'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
    //    //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
    //    oTable_DiagnosticosInterconsulta = $("#tblDiagnosticosInterconsulta").dataTable(params);
    //    $('#tblDiagnosticosInterconsulta_length').css('display', 'none')

    //},

    initDiagnosticosOrdenesMedicas() {

        let params = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            columns: [
                //{ width: '0%', targets: 0, "data": "iddiagnostico", className: 'ContCenter', "visible": false },
                //{ width: '0%', targets: 1, "data": "codigoCIEsinPto", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 2, "data": "codigoCIE10", className: 'ContCenter' },
                { width: '80%', targets: 3, "data": "descripcion" },
                //{ width: '0%', targets: 4, "data": "esActivo", className: 'ContCenter', "visible": false },
                //{ width: '0%', targets: 5, "data": "fechaInicioVigencia", className: 'ContCenter', "visible": false },
                //{ width: '0%', targets: 6, "data": "idTipoDiagnostico", className: 'ContCenter', "visible": false },
                { width: '10%', targets: 7, "data": "tipoDiagnostico", className: 'ContCenter', "visible": true },
                /*{ width: '10%', targets: 8, "data": "intrahospitalario", className: 'ContCenter', "visible": false }*/

            ]
        }
        var tableWrapper = $('#tblDiagnosticosOrdenesMedicas'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_DiagnosticosOrdenesMedicas = $("#tblDiagnosticosOrdenesMedicas").dataTable(params);
        $('#tblDiagnosticosOrdenesMedicas_length').css('display', 'none')

    },

    DevolverRecetaDetalle(idCatalogo) {
        var lstRecetadetalle = []
        var html = "";
        html += '[';
        switch (idCatalogo) {
            case 21:
                dataRx = oTable_rayos.api(true).rows().data();
                dataRx.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataRx[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataRx[index]["idItem"];
                    //html += '{"idItem":"' + dataRx[index]["idItem"] + '","cantidadPedida":"' + dataRx[index]["cantidadPedida"] + '","precio":"' + dataRx[index]["precio"] + '","total":"' + dataRx[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataRx[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataRx[index]["precio"] + '","total":"' + dataRx[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 23:
                dataEcoObs = oTable_ecoObs.api(true).rows().data();
                dataEcoObs.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataEcoObs[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataEcoObs[index]["idItem"];
                    //html += '{"idItem":"' + dataEcoObs[index]["idItem"] + '","cantidadPedida":"' + dataEcoObs[index]["cantidadPedida"] + '","precio":"' + dataEcoObs[index]["precio"] + '","total":"' + dataEcoObs[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataEcoObs[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataEcoObs[index]["precio"] + '","total":"' + dataEcoObs[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 24:
                dataEcoObsProc = oTable_ecoObsProc.api(true).rows().data();
                dataEcoObsProc.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataEcoObsProc[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataEcoObsProc[index]["idItem"];
                    //html += '{"idItem":"' + dataEcoObs[index]["idItem"] + '","cantidadPedida":"' + dataEcoObs[index]["cantidadPedida"] + '","precio":"' + dataEcoObs[index]["precio"] + '","total":"' + dataEcoObs[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataEcoObsProc[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataEcoObsProc[index]["precio"] + '","total":"' + dataEcoObsProc[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 20:
                dataEcoGeneral = oTable_ecoGeneral.api(true).rows().data();
                dataEcoGeneral.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataEcoGeneral[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataEcoGeneral[index]["idItem"];
                    //html += '{"idItem":"' + dataEcoGeneral[index]["idItem"] + '","cantidadPedida":"' + dataEcoGeneral[index]["cantidadPedida"] + '","precio":"' + dataEcoGeneral[index]["precio"] + '","total":"' + dataEcoGeneral[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataEcoGeneral[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataEcoGeneral[index]["precio"] + '","total":"' + dataEcoGeneral[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 3:
                dataanatPatologica = oTable_anatPatologica.api(true).rows().data();
                dataanatPatologica.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataanatPatologica[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataanatPatologica[index]["idItem"];
                    //html += '{"idItem":"' + dataanatPatologica[index]["idItem"] + '","cantidadPedida":"' + dataanatPatologica[index]["cantidadPedida"] + '","precio":"' + dataanatPatologica[index]["precio"] + '","total":"' + dataanatPatologica[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataanatPatologica[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataanatPatologica[index]["precio"] + '","total":"' + dataanatPatologica[index]["total"] + '","idFrecuencia":"' + isNull(dataanatPatologica[index]["idFrecuencia"], 0) + '","dx":"' + $(cboDx).val() + '"},';      //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 2:
                dataPatoClinica = oTable_PatoClinica.api(true).rows().data();
                dataPatoClinica.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataPatoClinica[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataPatoClinica[index]["idItem"];
                    //html += '{"idItem":"' + dataPatoClinica[index]["idItem"] + '","cantidadPedida":"' + dataPatoClinica[index]["cantidadPedida"] + '","precio":"' + dataPatoClinica[index]["precio"] + '","total":"' + dataPatoClinica[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataPatoClinica[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataPatoClinica[index]["precio"] + '","total":"' + dataPatoClinica[index]["total"] + '","idFrecuencia":"' + isNull(dataPatoClinica[index]["idFrecuencia"], 0) + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;

            case 11:
                databancoSangre = oTable_bancoSangre.api(true).rows().data();
                databancoSangre.each(function (value, index) {
                    var txtCant = "#txtCant_" + databancoSangre[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + databancoSangre[index]["idItem"];
                    //html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '","idFrecuencia":"' + isNull(databancoSangre[index]["idFrecuencia"], 0) + '","dx":"' + $(cboDx).val() + '"},';      //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break

            case 22:
                dataTomografia = oTable_tomografia.api(true).rows().data();
                dataTomografia.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataTomografia[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataTomografia[index]["idItem"];
                    //html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataTomografia[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataTomografia[index]["precio"] + '","total":"' + dataTomografia[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';      //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break

            case 1060:
                dataSolicitudCQx = oTable_solicitudCQx.api(true).rows().data();
                dataSolicitudCQx.each(function (value, index) {
                    var txtCant = "#txtCant_" + dataSolicitudCQx[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + dataSolicitudCQx[index]["idItem"];
                    //html += '{"idItem":"' + databancoSangre[index]["idItem"] + '","cantidadPedida":"' + databancoSangre[index]["cantidadPedida"] + '","precio":"' + databancoSangre[index]["precio"] + '","total":"' + databancoSangre[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + dataSolicitudCQx[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + dataSolicitudCQx[index]["precio"] + '","total":"' + dataSolicitudCQx[index]["total"] + '","dx":"' + $(cboDx).val() + '"},';      //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break

            case 12: // con especialidad
                datainterconsulta = oTable_interconsulta.api(true).rows().data();
                datainterconsulta.each(function (value, index) {
                    var txtCant = "#txtCant_" + datainterconsulta[index]["idItem"];            //KHOYOSI
                    //html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + datainterconsulta[index]["cantidadPedida"] + '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() +
                        '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] +
                        '","idEspecialidad":"' + datainterconsulta[index]["idEspecialidad"] + '", "otraEspecialidad":"' + datainterconsulta[index]["otraEspecialidad"] + '"},';       //KHOYOSI
                    //console.log(data[index]["idItem"] + '- ' + index);
                });
                break;
            //case 12: // original
            //    datainterconsulta = oTable_interconsulta.api(true).rows().data();
            //    datainterconsulta.each(function (value, index) {
            //        var txtCant = "#txtCant_" + datainterconsulta[index]["idItem"];            //KHOYOSI
            //        //html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + datainterconsulta[index]["cantidadPedida"] + '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
            //        html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] + '"},';       //KHOYOSI
            //        //console.log(data[index]["idItem"] + '- ' + index);
            //    });
            //    break;

            //case 12: // para una sola interconsulta
            //    let idProducto = $('#cbointerconsultasCE>option:selected').attr('idproducto')
            //    let precioUnitario = await Ordenes.asignaPrecio(idProducto, idCatalogo, $('#hdIdTipoFuenteFian').val())

            //    //var txtCant = "#txtCant_" + idProducto;            //KHOYOSI
            //    //html += '{"idItem":"' + datainterconsulta[index]["idItem"] + '","cantidadPedida":"' + datainterconsulta[index]["cantidadPedida"] + '","precio":"' + datainterconsulta[index]["precio"] + '","total":"' + datainterconsulta[index]["total"] + '"},';       //KHOYOSI(COMENTADO)
            //    html += '{"idItem":"' + idProducto + '","cantidadPedida":"' + 1 + '","precio":"' + precioUnitario + '","total":"' + precioUnitario + '"},';       //KHOYOSI

            //    break;

            case 5:
                let tieneAntimic = false;
                databafarmacia = oTable_farmacia.api(true).rows().data();
                databafarmacia.each(function (value, index) {
                    if (value.tipoProducto == "ANT") {
                        tieneAntimic = true;
                    }

                    var txtFrec = "#txtFrec_" + databafarmacia[index]["idItem"];
                    var txtCant = "#txtCant_" + databafarmacia[index]["idItem"];            //KHOYOSI
                    var cboDx = "#cboDx_" + databafarmacia[index]["idItem"];            //KHOYOSI
                    //html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idDosisRecetada":"' + databafarmacia[index]["idDosisRecetada"] + '","idViaAdministracion":"' + databafarmacia[index]["idViaAdministracion"] + '","observaciones":"' + $(txtFrec).val() + '"},';       //KHOYOSI(COMENTADO)
                    html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] +
                        '","idDosisRecetada":"' + (isEmpty(databafarmacia[index]["idDosisRecetada"]) ? 0 : databafarmacia[index]["idDosisRecetada"]) +
                        '","idViaAdministracion":"' + (isEmpty(databafarmacia[index]["idViaAdministracion"]) ? 0 : databafarmacia[index]["idViaAdministracion"]) +
                        '","observaciones":"' + $(txtFrec).val() + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
                });
                if (tieneAntimic) {
                    html = "[";
                }
                break;
        }
        html += ']';
        var htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },

    DevolverRecetaAntimicrobianoDetalle() {
        let lstRecetadetalle = []
        let html = "";
        html += '[';
        let tieneAntimic = false;
        let databafarmacia = oTable_farmaciaAntimic.api(true).rows().data();      //SE COMENTO POR QUE SE CAMBIO LA LOGICA EN UN SOLO VISTA TODOS LOS MEDIACMENTOS Y ANTIMICROBIANOS
        //let databafarmacia = oTable_farmacia.api(true).rows().data();
        databafarmacia.each(function (value, index) {
            //if (value.tipoProducto == "ANT") {
            //    tieneAntimic = true;
            //}
            tieneAntimic = true;

            //SE COMENTO POR QUE SE CAMBIO LA LOGICA EN UN SOLO VISTA TODOS LOS MEDIACMENTOS Y ANTIMICROBIANOS
            let txtFrec = "#txtFrecAntimic_" + databafarmacia[index]["idItem"];
            let txtCant = "#txtCantAntimic_" + databafarmacia[index]["idItem"];            //KHOYOSI
            let cboDx = "#cboDxAntimic_" + databafarmacia[index]["idItem"];            //KHOYOSI

            //let txtFrec = "#txtFrec_" + databafarmacia[index]["idItem"];
            //let txtCant = "#txtCant_" + databafarmacia[index]["idItem"];            //KHOYOSI
            //let cboDx = "#cboDx_" + databafarmacia[index]["idItem"];            //KHOYOSI
            //html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idDosisRecetada":"' + databafarmacia[index]["idDosisRecetada"] + '","idViaAdministracion":"' + databafarmacia[index]["idViaAdministracion"] + '","observaciones":"' + $(txtFrec).val() + '"},';       //KHOYOSI(COMENTADO)
            html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] +
                '","idDosisRecetada":"' + (isEmpty(databafarmacia[index]["idDosisRecetada"]) ? 0 : databafarmacia[index]["idDosisRecetada"]) +
                '","idViaAdministracion":"' + (isEmpty(databafarmacia[index]["idViaAdministracion"]) ? 0 : databafarmacia[index]["idViaAdministracion"]) +
                '","observaciones":"' + $(txtFrec).val() + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
        });
        if (!tieneAntimic) {
            html = "[";
        }
        html += ']';
        let htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },

    DevolverRecetaIntervencionSanitariaDetalle() {
        let lstRecetadetalle = []
        let html = "";
        html += '[';
        let databafarmacia = oTable_farmaciaIntSanit.api(true).rows().data();
        databafarmacia.each(function (value, index) {
            let txtFrec = "#txtFrecIntSanit_" + databafarmacia[index]["idItem"];
            let txtCant = "#txtCantIntSanit_" + databafarmacia[index]["idItem"];            //KHOYOSI
            let cboDx = "#cboDxIntSanit_" + databafarmacia[index]["idItem"];            //KHOYOSI
            //html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + databafarmacia[index]["cantidadPedida"] + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idDosisRecetada":"' + databafarmacia[index]["idDosisRecetada"] + '","idViaAdministracion":"' + databafarmacia[index]["idViaAdministracion"] + '","observaciones":"' + $(txtFrec).val() + '"},';       //KHOYOSI(COMENTADO)
            html += '{"idItem":"' + databafarmacia[index]["idItem"] + '","cantidadPedida":"' + $(txtCant).val() + '","precio":"' + databafarmacia[index]["precio"] + '","total":"' + databafarmacia[index]["total"] + '","idFrecuencia": "' +
                '","idDosisRecetada":"' + (isEmpty(databafarmacia[index]["idDosisRecetada"]) ? 0 : databafarmacia[index]["idDosisRecetada"]) +
                '","idViaAdministracion":"' + (isEmpty(databafarmacia[index]["idViaAdministracion"]) ? 0 : databafarmacia[index]["idViaAdministracion"]) +
                '","observaciones":"' + $(txtFrec).val() + '","dx":"' + $(cboDx).val() + '"},';       //KHOYOSI
        });
        html += ']';
        let htmlCompleto = html.replace(",]", "]")
        return htmlCompleto;
    },

    DevolverRecetaDetalleFarmacia() {
        var lstfarmacia = oTable_farmacia.api(true).rows().data();
        return lstfarmacia;
    },

    validaActivabtnPaquete() {

        cantidadFm = oTable_farmacia.api(true).rows().data().length
        cantidadRx = oTable_farmacia.api(true).rows().data().length
        cantidadEgen = oTable_ecoGeneral.api(true).rows().data().length
        cantidadEobs = oTable_ecoObs.api(true).rows().data().length
        cantidadEobsProc = oTable_ecoObsProc.api(true).rows().data().length
        cantidadPatClin = oTable_PatoClinica.api(true).rows().data().length
        cantidadAntPat = oTable_anatPatologica.api(true).rows().data().length
        cantidadBs = oTable_bancoSangre.api(true).rows().data().length
        cantidadTomografia = oTable_tomografia.api(true).rows().data().length
        if (cantidadFm > 0 ||
            cantidadRx > 0 ||
            cantidadEgen > 0 ||
            cantidadEobs > 0 ||
            cantidadEobsProc > 0 ||
            cantidadPatClin > 0 ||
            cantidadAntPat > 0 ||
            cantidadBs > 0 ||
            cantidadTomografia > 0) {
            $('#btnMuestraPaquete').css("visibility", 'hidden')
            return false;
        }
        else {
            $('#btnMuestraPaquete').css("visibility", 'visible');
            return true;
        }

    },
    eventos() {

        $('#ListNavTiposOrdenes a').on('click', function (e) {
            if (isSwitchingTabsTiposOrdenes) {
                e.preventDefault(); // Prevenir el cambio si ya está en transición
                return;
            }

            isSwitchingTabsTiposOrdenes = true; // Marcar como en transición

            // Esperar a que la transición termine antes de permitir otro cambio
            $(this).on('shown.bs.tab', function () {
                isSwitchingTabsTiposOrdenes = false; // Liberar el bloqueo una vez completado
            });
        });

        ObjtableBusquedaSolicitudCQxDiagnostico.on('click', function (e, datatable, key, cell, originalEvent) {
            Ordenes.AgregarDiagnosticoBusqueda();
        })

        $('#modalReceta').on('shown.bs.modal', function (e) {
            oTable_farmacia.resize();
            oTable_farmaciaAntimic.resize();
            oTable_PatoClinica.resize();
            oTable_anatPatologica.resize();
            oTable_bancoSangre.resize();
            oTable_ecoObs.resize();
            oTable_ecoObsProc.resize();
            oTable_ecoGeneral.resize();
            oTable_rayos.resize();
            oTable_tomografia.resize();
            oTable_interconsulta.resize();
            oTable_solicitudCQx.resize();

        });

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let shownTab = $(e.target).attr('href');
            console.log('El tabpanel ahora visible es:', shownTab);
            if (shownTab === '#farmacia' || shownTab === '#farmaciaMedInsum' || shownTab === '#farmaciaAntimicro' || shownTab === '#farmaciaIntSanit' ||
                shownTab === '#patoClinica' || shownTab === '#anatoPato' || shownTab === '#bancoSangre' || shownTab === '#ecoObst' ||
                shownTab === '#ecoGene' || shownTab === '#rayos' || shownTab === '#tomografia' || shownTab === '#interconsultas' || shownTab === '#solicitudCQx') {
                oTable_farmacia.resize();
                oTable_farmaciaAntimic.resize();
                oTable_PatoClinica.resize();
                oTable_anatPatologica.resize();
                oTable_bancoSangre.resize();
                oTable_ecoObs.resize();
                oTable_ecoObsProc.resize();
                oTable_ecoGeneral.resize();
                oTable_rayos.resize();
                oTable_tomografia.resize();
                oTable_interconsulta.resize();
                oTable_solicitudCQx.resize();

                if (shownTab === '#farmaciaIntSanit') {
                    //Ordenes.CargarPrescriptores("05");
                } else {
                    //Ordenes.CargarPrescriptores("01,05");
                }      

                //$('.chzn-select').chosen().trigger("chosen:updated");
            }

        });


        $("#txtCodigoDiagSolicitudCQx").keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                e.preventDefault();
                if ($("#txtCodigoDiagSolicitudCQx").val() != "") {
                    Ordenes.AbrirModalBusqueda();
                    Ordenes.BuscarDiagnostico($("#txtCodigoDiagSolicitudCQx").val());
                    $("#txtCodigoDiagSolicitudCQxFiltro").val($("#txtCodigoDiagSolicitudCQx").val());
                } else {
                    alerta(2, "Debe ingresar el código");
                }
            }
        });

        $('#lstDiagnosticosSolicitudCQxBusqueda tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosSolicitudCQxBusqueda  tbody tr').removeClass("selected");
            $(this).addClass('selected');
        });

        $('#lstDiagnosticosSolicitudCQx tbody').on('click', 'tr', function () {
            $('#lstDiagnosticosSolicitudCQx  tbody tr').removeClass("selected");
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                $(this).addClass('selected');
            }
        });





        $('#btnCargarPaqueteDetalle').on('click', async function () {
            Cargando(1);

            let error = ''
            let grabaProducto = true

            dataPq = oTable_paquete.api(true).rows().data();
            for (const [index, value] of dataPq.toArray().entries()) {
                idPuntoCarga = dataPq[index]["idPuntoCarga"]
                idProducto = dataPq[index]["idProducto"]
                idFuente = $('#hdIdTipoFuenteFian').val()
                //precioUnitario = await Ordenes.asignaPrecio(idProducto, idPuntoCarga, idFuente)
                precioUnitario =dataPq[index]["precio"]

                //alert("Precio Unitario: " + dataPq[index]["precio"]);
                //alert("Función asignaPrecio : " + precioUnitario);

                //RQ0002 RMOREANO
                var objRow
                if (idPuntoCarga == 5) {
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
                        observaciones: "", //$('#txtFrecuencia').val()
                        dx: ""

                    }
                } else {
                    objRow = {
                        idItem: idProducto,
                        producto: dataPq[index]["descripcion"],
                        cantidadPedida: dataPq[index]["cantidad"],
                        precio: precioUnitario,
                        total: precioUnitario * dataPq[index]["cantidad"],
                        dx: "",
                        idFrecuencia: "",
                        frecuencia: ""
                    }
                }
                // FIN RQ0002
                let dataTable
                let existe = false

                switch (idPuntoCarga) {
                    case 21:

                        dataTable = oTable_rayos.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_rayos.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 23:
                        dataTable = oTable_ecoObs.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_ecoObs.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 24:
                        dataTable = oTable_ecoObsProc.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_ecoObsProc.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 20:
                        dataTable = oTable_ecoGeneral.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 2:
                        dataTable = oTable_PatoClinica.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_PatoClinica.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 3:
                        dataTable = oTable_anatPatologica.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_anatPatologica.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 11:
                        dataTable = oTable_bancoSangre.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_bancoSangre.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 5:
                        dataTable = oTable_farmacia.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        // JDELGADOSTOCK
                        let stockProducto
                        if ($('#hdUtilizaValidaciones').val() == 1) {
                            stockProducto = await Ordenes.ConsultarStockProductoPorFarmacia($('#cboFarmacia').val(), objRow.idItem) // JDELGADOPM

                            if (stockProducto.table.length == 0) {
                                error = error + "Saldo del producto " + objRow.producto + " es: " + "0" + "\n"
                                grabaProducto = false
                            }
                            else {
                                if (stockProducto.table[0].cantidad < $('#txtCAntidadFarmacia').val()) {

                                    error = error + "Saldo del producto " + stockProducto.table[0].nombre + " es: " + stockProducto.table[0].cantidad + "\n"

                                    grabaProducto = false
                                }
                            }
                        }



                        if (!existe && grabaProducto) {
                            oTable_farmacia.api(true).row.add(objRow).draw(false);
                        }
                        grabaProducto = true

                        if (error != '') {
                            //swal({
                            //    title: 'Sin Stock',
                            //    text: error,
                            //    type: 'warning',
                            //    allowOutsideClick: false,
                            //}).done();
                            alerta2("warning", "Sin Stock", error);
                            Cargando(0)
                            //return false
                        }

                        break;
                    case 22:
                        dataTable = oTable_tomografia.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_tomografia.api(true).row.add(objRow).draw(false);
                        }
                        break;
                    case 12:
                        dataTable = oTable_interconsulta.api(true).data()
                        existe = false
                        $(dataTable).each((index, row) => {
                            if (row.idItem == objRow.idItem) {
                                console.log('YA existe el ' + objRow.producto)
                                existe = true
                            }
                        })

                        if (!existe) {
                            oTable_interconsulta.api(true).row.add(objRow).draw(false);
                        }
                        break;

                }
                $('#modalPaquete').modal('hide');
                Cargando(0)



                //switch (idPuntoCarga) {
                //    case 21: oTable_rayos.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 23: oTable_ecoObs.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 24: oTable_ecoObsProc.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 20: oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 2: oTable_PatoClinica.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 3: oTable_anatPatologica.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 11: oTable_bancoSangre.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 5: oTable_farmacia.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 22: oTable_tomografia.api(true).row.add(objRow).draw(false);
                //        break;
                //    case 12: oTable_interconsulta.api(true).row.add(objRow).draw(false);
                //        break;

                //}
                //Cargando(0)
                //$('#modalPaquete').modal('hide');

            }






        });

        //$('#btnCargarPaqueteDetalle').on('click', function () {
        //    Cargando(1);

        //    if ((Ordenes.validaActivabtnPaquete()) === false) {
        //        alerta("2", "Ya existen productos en las recetas por lo cual no se puede agregar un paquete", "Aviso");
        //        Cargando(0);
        //        return false;
        //    }
        //    else {
        //        dataPq = oTable_paquete.api(true).rows().data();
        //        dataPq.each(function (value, index) {
        //            idPuntoCarga = dataPq[index]["idPuntoCarga"]
        //            idProducto = dataPq[index]["idProducto"]
        //            idFuente = $('#hdIdTipoFuenteFian').val()
        //            precioUnitario = await Ordenes.asignaPrecio(idProducto, idPuntoCarga, idFuente)

        //            //RQ0002 RMOREANO
        //            var objRow
        //            if (idPuntoCarga == 5) {
        //                //objVia = Ordenes.DevuelveViaxIdProducto(idProducto);

        //                //var lstvia = objVia.split("-");


        //                objRow = {
        //                    idItem: idProducto,
        //                    producto: dataPq[index]["descripcion"],
        //                    cantidadPedida: dataPq[index]["cantidad"],
        //                    precio: precioUnitario,
        //                    total: precioUnitario * dataPq[index]["cantidad"],
        //                    idDosisRecetada: 1,
        //                    dosis: "1",
        //                    idViaAdministracion: dataPq[index]["idViaAdministracion"],
        //                    vias: dataPq[index]["vias"],
        //                    observaciones: ""//$('#txtFrecuencia').val()

        //                }
        //            } else {
        //                objRow = {
        //                    idItem: idProducto,
        //                    producto: dataPq[index]["descripcion"],
        //                    cantidadPedida: dataPq[index]["cantidad"],
        //                    precio: precioUnitario,
        //                    total: precioUnitario * dataPq[index]["cantidad"]

        //                }
        //            }
        //            // FIN RQ0002


        //            switch (idPuntoCarga) {
        //                case 21: oTable_rayos.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 23: oTable_ecoObs.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 24: oTable_ecoObsProc.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 20: oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 2: oTable_PatoClinica.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 3: oTable_anatPatologica.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 11: oTable_bancoSangre.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 5: oTable_farmacia.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 22: oTable_tomografia.api(true).row.add(objRow).draw(false);
        //                    break;
        //                case 12: oTable_interconsulta.api(true).row.add(objRow).draw(false);
        //                    break;

        //            }
        //            Cargando(0)
        //            $('#modalPaquete').modal('hide');

        //        });
        //    }

        //});



        $('#btnCerrarPaquete').on('click', function () {
            $('#modalPaquete').modal('hide');
        })

        $('#btnMuestraPaquete').on('click', async function () {
            const resp = await Ordenes.listaCabPaquetes();
            if (resp) {
                $('#modalPaquete').modal('show');
            }
        })

        $("#cboPaquetes").on("change", async function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idPaquete', $("#cboPaquetes").val());
            midata.append('tipo', 0);

            try {
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/Catalogo/FactDetallePaquete?area=Comun",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                Cargando(0);
                oTable_paquete.fnClearTable();
                if (datos.table.length > 0) {
                    oTable_paquete.fnAddData(datos.table)
                }

                oTable_paquete.resize();
                resp = true;
            } catch (error) {
                resp = false;
                alerta("ERROR", "Error listar detalle de paquete!", "2");
            }


        })

        $("#cboFarmacia").on("change", async function () {
            Cargando(1);
            var midata = new FormData();
            midata.append('idFarmacia', $("#cboFarmacia").val());
            
            
            //let urlMedIns = '';
            //if ($('#chkAntimicrobianos').is(':checked')) {
            //    urlMedIns = "/Farmacia/FarmAntimicrobianosSaldoTotalesSoloMayoresAcero?area=Comun";
            //} else {
            //    urlMedIns = "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun";
            //}
            let medicamentos = "";
            urlMedIns = "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun";

            await $.ajax({
                method: "POST",
                url: urlMedIns,
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                //async: false,
                success: function (datos) {
                    Cargando(0);
                    $('#cboMedicamento').empty();


                    $(datos.table).each(function(i, obj) {
                        const textoFinal = (obj.stockActual && parseFloat(obj.stockActual) > 0)
                            ? ` <b class='text-info ml-auto'>(${obj.stockActual})</b>`
                            : ` <spam class='ml-auto'>(sin stock)</spam>`;

                        medicamentos = medicamentos + /*'<option data-tipoProducto="MED" value="' + obj.idProducto + '">' + obj.nombre + ' <div class="stockActual">(' + obj.stockActual + ')</div></option>';                        */
                                `<option value="${String(obj.idProducto).trim()}"
                                    data-nombre="${String(obj.nombre).trim()}"
                                    data-codigo="${obj.codigo}"
                                    data-stockActual="${obj.stockActual}"
                                    data-tipoProducto="MED"
                                    class="d-flex"
                                >${String(obj.nombre).trim()}${textoFinal}</option>`;

                    });

                    $('#cboMedicamento').append("<optgroup label='Medicamentos/Insumos'>" + medicamentos + "</optgroup>");

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

            let antimicrobianos = "";
            urlMedIns = "/Farmacia/FarmAntimicrobianosSaldoTotalesSoloMayoresAcero?area=Comun";
            await $.ajax({
                method: "POST",
                url: urlMedIns,
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                //async: false,
                success: function (datos) {
                    Cargando(0);
                    $('#cboMedicamentoAntimic').empty();
                    $(datos.table).each(function (i, obj) {
                        //$('#cboMedicamentoAntimic').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');
                        antimicrobianos = antimicrobianos + '<option data-tipoProducto="ANT" value="' + obj.idProducto + '">' + obj.nombre + '</option>';

                    });
                    $('#cboMedicamentoAntimic').append("<optgroup label='Antimicrobianos'>" + antimicrobianos + "</optgroup>");

                    $('.chzn-select').chosen().trigger("chosen:updated");

                },
                error: function (msg) {
                    Cargando(0);
                    setTimeout(function () {
                        //                    Cargando(0);
                        alerta("ERROR", "Error listar farmacias Antimicrobianos!", "2");
                    }, 900)
                }
            });

            urlMedIns = "/Farmacia/FarmIntervencionSanitariaSaldoTotalesSoloMayoresAcero?area=Comun";
            await $.ajax({
                method: "POST",
                url: urlMedIns,
                data: midata,
                dataType: "json",
                processData: false,
                contentType: false,
                //async: false,
                success: function (datos) {
                    Cargando(0);
                    $('#cboMedicamentoIntSanit').empty();
                    $(datos.table).each(function (i, obj) {
                        $('#cboMedicamentoIntSanit').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');


                    });

                    $('.chzn-select').chosen().trigger("chosen:updated");

                },
                error: function (msg) {
                    Cargando(0);
                    setTimeout(function () {
                        //                    Cargando(0);
                        alerta("ERROR", "Error listar farmacias intervenciones sanitarias!", "2");
                    }, 900)
                }
            });

        });


        ///////////////////////////SOLICITUD ANTIMICROBIANOS////////////////////////////////////////////////////////////////////////
        //$('#chkAntimicrobianos').change(function () {
        //    Cargando(1);
        //    var midata = new FormData();
        //    midata.append('idFarmacia', $("#cboFarmacia").val());

        //    oTable_farmacia.fnClearTable();
        //    Ordenes.LimpiarCamposAntimicrobianos();
        //    let urlMedIns = '';
        //    if ($('#chkAntimicrobianos').is(':checked')) {
        //        $("#cardAntimicrobianos").show();
        //        $("#btnMuestraPaquete").hide();
        //        urlMedIns = "/Farmacia/FarmAntimicrobianosSaldoTotalesSoloMayoresAcero?area=Comun";
        //    } else {
        //        $("#cardAntimicrobianos").hide();
        //        $("#btnMuestraPaquete").show();
        //        urlMedIns = "/Farmacia/FarmSaldoTotalesSoloMayoresAcero?area=Comun";
        //    }

        //    $.ajax({
        //        method: "POST",
        //        url: urlMedIns,
        //        data: midata,
        //        dataType: "json",
        //        processData: false,
        //        contentType: false,
        //        //async: false,
        //        success: function (datos) {
        //            Cargando(0);
        //            $('#cboMedicamento').empty();
        //            $(datos.table).each(function (i, obj) {
        //                $('#cboMedicamento').append('<option  value="' + obj.idProducto + '">' + obj.nombre + '</option>');


        //            });

        //            $('.chzn-select').chosen().trigger("chosen:updated");

        //        },
        //        error: function (msg) {
        //            Cargando(0);
        //            setTimeout(function () {
        //                //                    Cargando(0);
        //                alerta("ERROR", "Error listar farmacias!", "2");
        //            }, 900)
        //        }
        //    });
        //});

        $('input[name="rdbGeneraSolAntimic"]').on('change', function () {
            Ordenes.LimpiarCamposAntimicrobianos();
            if ($(this).val() == 0) {
                Ordenes.BloquearCamposAntimicrobianos();
            } else if ($(this).val() == 1) {
                Ordenes.DesbloquearCamposAntimicrobianos();
            }
        });

        $('#btnAgregarCondicionPacienteSolAntimic').on('click', function () {
            if (Ordenes.ExisteCondicionPaciente() == false) {

                let objRow = {
                    idSolicitudAntimicrobiano: Ordenes.idSolicitudAntimicrobiano,
                    idTipoCondicionAntimicrobiano: $("#cboCondicionPacienteSolAntimic").val(),
                    condicion: $("#cboCondicionPacienteSolAntimic option:selected").text()
                }
                oTable_CondicionPacienteSolAntimic.api(true).row.add(objRow).draw(false);
                oTable_CondicionPacienteSolAntimic.resize();
            }
        });

        $('#tblCondicionPacienteSolAntimic tbody').on('click', '.btnEliminarCondicionPacienteSolAntimic', function () {

            oTable_CondicionPacienteSolAntimic.api(true).row($(this).parents("tr")).remove().draw(false);

        });
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        //////////////////////INTERVENCION SANITARIA///////////////////////////////////////////////
        $("#cboComponenteIntSanit").on("change", async function () {
            let idComponente = $("#cboComponenteIntSanit").val();
            if (idComponente > 0) {
                await Ordenes.ListaSubComponentes(idComponente);
            }
        });

        $("#cboSubComponenteIntSanit").on("change", async function () {
            let codigo = isNull($("#cboSubComponenteIntSanit option:selected").data('cie10'), '');
            await Ordenes.ListaDiagnosticosIntervencionSanitaria(codigo);
            let idDiagnostico = $('#cboDiagnosticoIntSanit option[data-cie10="' + codigo + '"]').val();
            $('#cboDiagnosticoIntSanit').val(idDiagnostico);
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        //$("#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input").on("change", async function () {
        $('#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input').on('input', async function () {
            let filtro = $(this).val();
            await Ordenes.ListaDiagnosticosIntervencionSanitaria(filtro);
        });
        ////////////////////////////////////////////////////////////////////////////////////////


        $('#btnAgregaFarmacia').on('click', function () {
            Ordenes.agregarProd(5);
        })
        $('#btnQuitarFarmacia').on('click', function () {
            Ordenes.quitarProd(5);
        })

        $('#btnAgregaFarmaciaAntimic').on('click', function () {
            Ordenes.agregarProdAntimicrobiano(5);
        })
        $('#btnQuitarFarmaciaAntimic').on('click', function () {
            Ordenes.quitarProdAntimicrobiano(5);
        })

        $('#btnAgregaFarmaciaIntSanit').on('click', function () {
            Ordenes.agregarProdIntervencionSanitaria(5);
        })
        $('#btnQuitarFarmaciaIntSanit').on('click', function () {
            Ordenes.quitarProdIntervencionSanitaria(5);
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

        $('#btnQuitarEcoObsProc').on('click', function () {
            Ordenes.quitarProd(24);
        })
        $('#btnAgregaEcoObsProc').on('click', function () {
            Ordenes.agregarProd(24);
        })

        $('#btnQuitarinterconsultas').on('click', function () {
            Ordenes.quitarProd(12);
        })
        $('#btnAgregainterconsultas').on('click', function () {
            Ordenes.agregarProd(12);
        })


        $('#btnQuitarSolicitudCQx').on('click', function () {
            Ordenes.quitarProd(1060);
        })
        $('#btnAgregaSolicitudCQx').on('click', function () {
            Ordenes.agregarProd(1060);
        })

        $('#btLimpiar').on('click', function () {
            Ordenes.limpiarCatalogo();
        })

        $('#btnCerrar').on('click', function () {
            $('#modalBusquedaCatalogo').modal('hide');
        })


        $('#cbointerconsultasCE').on('change', async function () {
            let idEspecialidadInterconsulta = $('#cbointerconsultasCE>option:selected').attr('idEspecialidadInterconsulta')

            await Ordenes.ListarEspecialidades()

            $('#cboEspecialidades').prop('disabled', true)

            $('#cboEspecialidades').val(idEspecialidadInterconsulta)

            if ($('#cbointerconsultasCE').val() == '99499.11') {
                $('#contEspecialidadesInterconsulta').hide()
                $('#contOtrasEspecialidadesInterconsulta').show()
            } else {
                $('#contEspecialidadesInterconsulta').show()
                $('#contOtrasEspecialidadesInterconsulta').hide()
            }

            //if ($('#cbointerconsultasCE').val() == '99241') {
            //    $('#cboEspecialidades').prop('disabled', false)
            //    await Ordenes.ListarEspecialidadesHospitalizacion()
            //}

            $('.chzn-select').chosen().trigger("chosen:updated")
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

        $('#tblCatalogoEcoObsProc tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ecoObsProc.$('tr.selected').removeClass('selected');
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

        $('#tblCatalogointerconsultas tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_interconsulta.$('tr.selected').removeClass('selected');
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

        $('#tblCatalogoFarmaciaAntimic tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_farmaciaAntimic.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });

        $('#tblCatalogoFarmaciaIntSanit tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_farmaciaIntSanit.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }


        });



        //$('#interconsultas-tab').on('click', async function () { /// COMENTAR ESTO PARA QUE FUNCIONE INTERCONSULTA JDELGADOM
        //    oTable_DiagnosticosInterconsulta.fnClearTable();
        //    let diagnosticos = ObjtableDiagnosticos.api(true).data()
        //    let tableDiagnosticos = []

        //    if (!isEmpty(diagnosticos[0])) {
        //        $(diagnosticos).each((i, obj) => {
        //            console.log(i, obj)
        //            let objRow = {
        //                codigoCIE10: obj.codigoCIE10,
        //                codigoCIEsinPto: obj.codigoCIEsinPto,
        //                descripcion: obj.descripcion,
        //                esActivo: obj.esActivo,
        //                fechaInicioVigencia: obj.fechaInicioVigencia,
        //                iddiagnostico: obj.iddiagnostico,
        //                idTipoDiagnostico: obj.idTipoDiagnostico,
        //                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
        //                tipoDiagnostico: obj.tipoDiagnostico,
        //                intrahospitalario: obj.intrahospitalario
        //            }
        //            tableDiagnosticos.push(objRow)
        //        })
        //        oTable_DiagnosticosInterconsulta.fnAddData(tableDiagnosticos);
        //    }

        //})

        ////////////////////COMENTADO POR KHOYOSI ---- SE MOVIO LOS DAIGNOSTICOS EN LA PARTE SUPERIOR --------------
        //$('#ordenes-tab').on('click', async function () {
        //    oTable_DiagnosticosInterconsulta.fnClearTable();
        //    let diagnosticos = ObjtableDiagnosticos.api(true).data()
        //    let tableDiagnosticos = []

        //    if (!isEmpty(diagnosticos[0])) {
        //        $(diagnosticos).each((i, obj) => {
        //            //console.log(i, obj)
        //            let objRow = {
        //                codigoCIE10: obj.codigoCIE10,
        //                codigoCIEsinPto: obj.codigoCIEsinPto,
        //                descripcion: obj.descripcion,
        //                esActivo: obj.esActivo,
        //                fechaInicioVigencia: obj.fechaInicioVigencia,
        //                iddiagnostico: obj.iddiagnostico,
        //                idTipoDiagnostico: obj.idTipoDiagnostico,
        //                //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
        //                tipoDiagnostico: obj.tipoDiagnostico,
        //                intrahospitalario: obj.intrahospitalario
        //            }
        //            tableDiagnosticos.push(objRow)
        //        })
        //        oTable_DiagnosticosInterconsulta.fnAddData(tableDiagnosticos);
        //    }

        //})

        //MGAMERO - PROA
        $('.chk-cultivo').on('change', async function () {
            let item = parseInt($(this).data('id'));
            let $fila = $(this).closest('tr');
            let $fecha = $fila.find('.txt-fecha-cultivo');

            if ($(this).is(':checked')) {
                $fecha.prop('disabled', false);
            } else {
                $fecha.val('');
                $fecha.prop('disabled', true);
            }

            if (item === 8) {
                if ($(this).is(':checked')) {
                    $('#txtOtroCultivo').show();
                } else {
                    $('#txtOtroCultivo').val('').hide();
                }
            }
        });

        //MGAMERO - PROA
        $('.chk-sindrome').on('change', async function () {
            let item = parseInt($(this).data('id'));
            if (item === 9) {
                if ($(this).is(':checked')) {
                    $('#txtOtroSindrome').show();
                } else {
                    $('#txtOtroSindrome').val('').hide();
                }
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
        oTable_ecoObsProc.fnClearTable();
        oTable_ecoGeneral.fnClearTable();
        oTable_anatPatologica.fnClearTable();
        oTable_bancoSangre.fnClearTable();
        oTable_PatoClinica.fnClearTable();
        oTable_tomografia.fnClearTable();
        oTable_interconsulta.fnClearTable();
        oTable_farmacia.fnClearTable();
        oTable_farmaciaAntimic.fnClearTable();
        oTable_farmaciaIntSanit.fnClearTable();

        $('#txtCAntidadFarmacia').val(1);
        $('#txtCAntidadFarmaciaAntimic').val(1);
        $('#txtCAntidadFarmaciaIntSanit').val(1);
        $('#txtCAntidadRx').val(1);
        $('#txtCAntidadObs').val(1);
        $('#txtCAntidadObsProc').val(1);
        $('#txtCAntidadEcoGeneral').val(1);
        $('#txtCAntidadAPatologica').val(1);
        $('#txtCAntidadPatoClinica').val(1);
        $('#txtCAntidadbancoSangre').val(1);
        $('#txtCAntidadinterconsultas').val(1);
        $('#txtCAntidadtomografia').val(1);
    },

    limpiarCatalogoV2() {
        //oTable_catalogo.fnClearTable();
        oTable_rayos.fnClearTable();
        oTable_ecoObs.fnClearTable();
        oTable_ecoObsProc.fnClearTable();
        oTable_ecoGeneral.fnClearTable();
        oTable_anatPatologica.fnClearTable();
        oTable_bancoSangre.fnClearTable();
        oTable_PatoClinica.fnClearTable();
        oTable_farmacia.fnClearTable();
        oTable_farmaciaAntimic.fnClearTable();
        oTable_farmaciaIntSanit.fnClearTable();
        oTable_interconsulta.fnClearTable();
        oTable_tomografia.fnClearTable();



        $('#txtCAntidadFarmacia').val(1);
        $('#txtCAntidadFarmaciaAntimic').val(1);
        $('#txtCAntidadRx').val(1);
        $('#txtCAntidadObs').val(1);
        $('#txtCAntidadObsProc').val(1);
        $('#txtCAntidadEcoGeneral').val(1);
        $('#txtCAntidadAPatologica').val(1);
        $('#txtCAntidadPatoClinica').val(1);
        $('#txtCAntidadbancoSangre').val(1);
        $('#txtCAntidadinterconsultas').val(1);
        $('#txtCAntidadtomografia').val(1);

        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoObsProc').val(0)
        $('#lblEcoObsProc').html(0)

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

        $('#hdIdRecetaFarmaciaAntimic').val(0)
        $('#lblFarmaciaAntimic').html(0)

        $('#hdIdRecetaFarmaciaIntSanit').val(0)
        $('#lblFarmaciaIntSanit').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        //$('#cboMedicoReceta').val(ObtenerIdMedicoSesion());
        //console.log(this.ObtenerIdMedicoSesion());
        Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());
        Ordenes.listaFecha();

        Ordenes.idSolicitudAntimicrobiano = 0;
        $('#cboMotivoSolAntimic').val(0);
        $('#txtTratamientoActualSolAntimic').val("");
        $('#cboCondicionPacienteSolAntimic').val(0);
        oTable_CondicionPacienteSolAntimic.fnClearTable();

    },

    async CargarDiagnosticosOrdenesMedicas(idReceta) {
        oTable_DiagnosticosOrdenesMedicas.fnClearTable();

        if (idReceta > 0) {
           
           // let diagnosticos = oTable_DiagnosticosOrdenesMedicas.api(true).data()
        } else {
            let diagnosticos = ObjtableDiagnosticos.api(true).data()
            let tableDiagnosticos = []
            if (!isEmpty(diagnosticos[0])) {
                $(diagnosticos).each((i, obj) => {
                    //console.log(i, obj)
                    let objRow = {
                        codigoCIE10: obj.codigoCIE10,
                        codigoCIEsinPto: obj.codigoCIEsinPto,
                        descripcion: obj.descripcion,
                        esActivo: obj.esActivo,
                        fechaInicioVigencia: obj.fechaInicioVigencia,
                        iddiagnostico: obj.iddiagnostico,
                        idTipoDiagnostico: obj.idTipoDiagnostico,
                        //tipoDiagnostico: $('select[name="cboTipoDiagnostico"] option:selected').text()
                        tipoDiagnostico: obj.tipoDiagnostico,
                        intrahospitalario: obj.intrahospitalario
                    }
                    tableDiagnosticos.push(objRow)
                })
                oTable_DiagnosticosOrdenesMedicas.fnAddData(tableDiagnosticos);
            }
        }

    },

    async ListarDiagnosticosRecetasPorAtencion(idAtencion, evaluacion) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        data.append('idAtencion', idAtencion);
        //data.append('clasificacionDiagnostico', clasificacion);             // 1: ingreso, 2: atencion o evaluacion, 3: egreso
        data.append('evaluacion', evaluacion);

        Ordenes.lstDxAtencion = null;
        oTable_DiagnosticosOrdenesMedicas.fnClearTable()
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Diagnosticos/ListarDiagnosticosRecetasPorAtencion?area=Comun",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0)
            resp = true;

            if (datos.table.length > 0) {
                oTable_DiagnosticosOrdenesMedicas.fnAddData(datos.table);
                oTable_DiagnosticosOrdenesMedicas.resize();
                Ordenes.lstDxAtencion = datos.table;
            }



        } catch (error) {
            resp = false;
            //console.error(error)
            alerta(3, error);
        }

        //return datos;
        return resp;

    },


    CargaInicial() {
        if (Ordenes.tipoServicio == "HOSP") {
            $(".cboFrecuencia").show();
        } else {
            $(".cboFrecuencia").hide()
        }
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

        if (idCatalogo == 24) {
            var objselec = oTable_ecoObsProc.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_ecoObsProc.api(true).row('.selected').remove().draw(false);

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
        if (idCatalogo == 2) {
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

            //----CONTROLA LA VISTA DE SOLCITUD DE ANTIMICROBISNO-----------------------//
            let tieneAntimic = false;
            dataTableFarmacia = oTable_farmacia.api(true).rows().data();
            dataTableFarmacia.each(function (value, index) {
                if (value.tipoProducto == "ANT") {
                    tieneAntimic = true;
                }
            });

            Ordenes.productosSinSolicitud = Ordenes.productosSinSolicitud.filter(item => item.idProducto !== objselec.idItem);

            if (!tieneAntimic) {
                $("#frmSolicitudAntimicrobianos").hide();
                Ordenes.LimpiarCamposAntimicrobianos();
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

    quitarProdAntimicrobiano(idCatalogo) {
        if (idCatalogo == 5) {
            var objselec = oTable_farmaciaAntimic.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_farmaciaAntimic.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }
    },

    quitarProdIntervencionSanitaria(idCatalogo) {
        if (idCatalogo == 5) {
            var objselec = oTable_farmaciaIntSanit.api(true).row('.selected').data();
            if (!isEmpty(objselec)) {
                oTable_farmaciaIntSanit.api(true).row('.selected').remove().draw(false);

            } else {
                alerta(2, "Debe Seleccionar el registro para eliminar.");
            }
        }
    },

    existeProd(idproducto, idCatalogo) {
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
            lstProductosEco = oTable_ecoObs.api(true).rows().data();
            if (lstProductosEco.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosEco.length; i++) {
                if (lstProductosEco[i].idItem == idproducto) {
                    return true;
                }
            }
        }

        if (idCatalogo == 24) {
            lstProductosEcoProc = oTable_ecoObsProc.api(true).rows().data();
            if (lstProductosEcoProc.length == 0) {
                return false;
            }
            for (var i = 0; i < lstProductosEcoProc.length; i++) {
                if (lstProductosEcoProc[i].idItem == idproducto) {
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

        if (idCatalogo == 11) {

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

        if (idCatalogo == 1060) {

            lstProductosSolicitudCQx = oTable_solicitudCQx.api(true).rows().data();
            if (lstProductosSolicitudCQx.length == 0) {
                return false;
            }

            for (var i = 0; i < lstProductosSolicitudCQx.length; i++) {
                if (lstProductosSolicitudCQx[i].idItem == idproducto) {
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

    existeProdAntimicrobiano(idproducto, idCatalogo) {
        if (idCatalogo == 5) {
            lstProductosFarmacia = oTable_farmaciaAntimic.api(true).rows().data();
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

    existeProdIntervencionSanitaria(idproducto, idCatalogo) {
        if (idCatalogo == 5) {
            lstProductosFarmacia = oTable_farmaciaIntSanit.api(true).rows().data();
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
    //listaCabeceraRecetasByIdCuentaPorNroEvaluacion(idCuentaAtencion, idTipoFuenteFina, nroEvaluacion, idServicio, idMedico) {

    //    $('#hdIdTipoFuenteFian').val(idTipoFuenteFina)
    //    var midata = new FormData();

    //    midata.append('idCuentaAtencion', idCuentaAtencion);
    //    midata.append('nroEvaluacion', nroEvaluacion);
    //    midata.append('idServicio', idServicio);
    //    midata.append('idMedico', idMedico);

    //    $.ajax({
    //        method: "POST",
    //        url: "/Receta/ListaRecetasCabeceraIdCuentaAtencionPorNroEvaluacion?area=Comun",
    //        data: midata,
    //        dataType: "json",
    //        processData: false,
    //        contentType: false,

    //        success: function (datos) {
    //            $('#hdIdRecetaRX').val(0)
    //            $('#lblRx').html(0)

    //            $('#hdIdRecetaEcoObs').val(0)
    //            $('#lblEcoObs').html(0)

    //            $('#hdIdRecetaEcoObsProc').val(0)
    //            $('#lblEcoObsProc').html(0)

    //            $('#hdIdRecetaEcoGene').val(0)
    //            $('#lblEcoGene').html(0)

    //            $('#hdIdRecetaPatoClinica').val(0)
    //            $('#lblPatoClinica').html(0)

    //            $('#hdIdRecetaAnaPatologica').val(0)
    //            $('#lblanaPatologica').html(0)

    //            $('#hdIdRecetabancoSangre').val(0)
    //            $('#lblbancoSangre').html(0)

    //            $('#hdIdRecetaFarmacia').val(0)
    //            $('#lblFarmacia').html(0)

    //            $('#hdIdRecetaInterconsulta').val(0)
    //            $('#lblInterconsulta').html(0)

    //            $('#btnAgregaRayosX').css("visibility", 'visible');
    //            $('#btnQuitarRayos').css("visibility", 'visible');
    //            $('#btnAgregaEcoObs').css("visibility", 'visible');
    //            $('#btnQuitarEcoObs').css("visibility", 'visible');
    //            $('#btnAgregaEcoObsProc').css("visibility", 'visible');
    //            $('#btnQuitarEcoObsProc').css("visibility", 'visible');
    //            $('#btnAgregaEcoGene').css("visibility", 'visible');
    //            $('#btnQuitarEcoGene').css("visibility", 'visible');
    //            $('#btnAgregaPatoClinica').css("visibility", 'visible');
    //            $('#btnQuitarPatoClinica').css("visibility", 'visible');
    //            $('#btnAgregaanaPatologica').css("visibility", 'visible');
    //            $('#btnQuitaranaPatologica').css("visibility", 'visible');
    //            $('#btnAgregabancoSangre').css("visibility", 'visible');
    //            $('#btnQuitarbancoSangre').css("visibility", 'visible');
    //            $('#btnAgregaFarmacia').css("visibility", 'visible');
    //            $('#btnQuitarFarmacia').css("visibility", 'visible');

    //            if (datos.table.length > 0) {//rx

    //                $(datos.table).each(function (i, obj) {
    //                    if (obj.idPuntoCarga == 21) //rx
    //                    {
    //                        $('#lblRx').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaRX').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 21)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaRayosX').css("visibility", 'visible');
    //                            $('#btnQuitarRayos').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaRayosX').css("visibility", 'hidden')
    //                            $('#btnQuitarRayos').css("visibility", 'hidden')
    //                            $('#lblRx').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 23) {//eco obs
    //                        $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaEcoObs').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 23)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaEcoObs').css("visibility", 'visible');
    //                            $('#btnQuitarEcoObs').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaEcoObs').css("visibility", 'hidden')
    //                            $('#btnQuitarEcoObs').css("visibility", 'hidden')
    //                            $('#lblEcoObs').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 24) {//eco obs proc
    //                        $('#lblEcoObsProc').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaEcoObsProc').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 24)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaEcoObsProc').css("visibility", 'visible');
    //                            $('#btnQuitarEcoObsProc').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaEcoObsProc').css("visibility", 'hidden')
    //                            $('#btnQuitarEcoObsProc').css("visibility", 'hidden')
    //                            $('#lblEcoObsProc').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 20) {//eco gene
    //                        $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaEcoGene').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 20)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaEcoGene').css("visibility", 'visible');
    //                            $('#btnQuitarEcoGene').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaEcoGene').css("visibility", 'hidden')
    //                            $('#btnQuitarEcoGene').css("visibility", 'hidden')
    //                            $('#lblEcoGene').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 2) {//pt clinica
    //                        $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaPatoClinica').val(obj.idReceta);
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 2)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaPatoClinica').css("visibility", 'visible');
    //                            $('#btnQuitarPatoClinica').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaPatoClinica').css("visibility", 'hidden')
    //                            $('#btnQuitarPatoClinica').css("visibility", 'hidden')
    //                            $('#lblPatoClinica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 3) {//anat patologica
    //                        $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaAnaPatologica').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 3)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaanaPatologica').css("visibility", 'visible');
    //                            $('#btnQuitaranaPatologica').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaanaPatologica').css("visibility", 'hidden')
    //                            $('#btnQuitaranaPatologica').css("visibility", 'hidden')
    //                            $('#lblanaPatologica').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 11) {//sangre
    //                        $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetabancoSangre').val(obj.idReceta)
    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 11)

    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregabancoSangre').css("visibility", 'visible');
    //                            $('#btnQuitarbancoSangre').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregabancoSangre').css("visibility", 'hidden')
    //                            $('#btnQuitarbancoSangre').css("visibility", 'hidden')
    //                            $('#lblbancoSangre').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    if (obj.idPuntoCarga == 5) {//farmacia
    //                        $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta);
    //                        $('#hdIdRecetaFarmacia').val(obj.idReceta)
    //                        //$('#txtFechaVigencia').val(obj.fechaVigenciaWeb)
    //                        $("#txtFechaVigencia").datepicker("setDate", obj.fechaVigenciaWeb);

    //                        Ordenes.listaRecetasByIdRecetaByPuntoCarga(obj.idReceta, 5)
    //                        if (obj.idEstado === 1) {
    //                            $('#btnAgregaFarmacia').css("visibility", 'visible');
    //                            $('#btnQuitarFarmacia').css("visibility", 'visible');
    //                        }
    //                        else {
    //                            $('#btnAgregaFarmacia').css("visibility", 'hidden')
    //                            $('#btnQuitarFarmacia').css("visibility", 'hidden')
    //                            $('#lblFarmacia').html("Receta Nro.: " + obj.idReceta + ' - Estado: Despachada');
    //                        }
    //                    }
    //                    else {
    //                        //Ordenes.listaFecha();
    //                    }
    //                    Ordenes.ubicaMedico(obj.idMedicoReceta);
    //                    //OrdenesRecetasMedicas = datos.table;
    //                });

    //                //('#lblPatoClinica').html("Receta Nro.: " + datos.table3[0]["idReceta"]);
    //                //$('#hdIdRecetaPatoClinica').val(datos.table3[0]["idReceta"]);
    //            }
    //            else {
    //                Ordenes.ubicaMedico(idMedico);
    //                Ordenes.listaFecha();
    //            }
    //            OrdenesRecetasMedicas = datos.table;
    //            console.log(OrdenesRecetasMedicas);
    //            Ordenes.validaActivabtnPaquete();
    //        },
    //        error: function (msg) {
    //            setTimeout(function () {
    //                //                    Cargando(0);
    //                alerta("ERROR", "Error listar recetas!", "2");
    //            }, 900)
    //        }
    //    });
    //},

    async ObtenerIdMedicoSesion() {
        let datos = null;
        let resp = false;
        let idMed = 0;

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ObtenerIdMedicoLogeado?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    //data: data,
                    //dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            idMed = datos;
        } catch (error) {
            alerta2("error", "", error);
        }

        return idMed;
    },

    ubicaMedico(valor) {
        //console.log("Medico: " + valor);
        let colegio = "";
        $('#cboMedicoReceta').val(valor);
        if (valor > 0) {
            if (isEmpty($('#cboMedicoReceta').val())) {
                $('#cboMedicoReceta').attr('disabled', false);
            } else {
                $('#cboMedicoReceta').attr('disabled', true);
                $("#cboMedicoReceta").find(":selected").data("colegio");

                /*if (colegio == "05") {
                    $("#farmaciaMedInsum-tab").hide();
                    $("#farmaciaAntimicro-tab").hide();
                    $("#farmaciaIntSanit-tab").click();
                } else {
                    $("#farmaciaMedInsum-tab").show();
                    $("#farmaciaAntimicro-tab").show();
                }*/
            }
        } else {
            $('#cboMedicoReceta').attr('disabled', false);
        }
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    LimpiarOrdenesMedicas() {
        //oTable_catalogo.fnClearTable();
        oTable_DiagnosticosOrdenesMedicas.fnClearTable();

        oTable_rayos.fnClearTable();
        oTable_ecoObs.fnClearTable();
        oTable_ecoObsProc.fnClearTable();
        oTable_ecoGeneral.fnClearTable();
        oTable_anatPatologica.fnClearTable();
        oTable_bancoSangre.fnClearTable();
        oTable_PatoClinica.fnClearTable();
        oTable_farmacia.fnClearTable();
        oTable_farmaciaAntimic.fnClearTable();
        oTable_farmaciaIntSanit.fnClearTable();
        oTable_interconsulta.fnClearTable();
        oTable_tomografia.fnClearTable();
        oTable_solicitudCQx.fnClearTable();

        $('#txtCAntidadFarmacia').val(1);
        $('#txtCAntidadFarmaciaAntimic').val(1);
        $('#txtCAntidadFarmaciaIntSanit').val(1);
        $('#txtCAntidadRx').val(1);
        $('#txtCAntidadObs').val(1);
        $('#txtCAntidadObsProc').val(1);
        $('#txtCAntidadEcoGeneral').val(1);
        $('#txtCAntidadAPatologica').val(1);
        $('#txtCAntidadPatoClinica').val(1);
        $('#txtCAntidadbancoSangre').val(1);
        $('#txtCAntidadinterconsultas').val(1);
        $('#txtCAntidadtomografia').val(1);

        $('#hdIdRecetaRX').val(0)
        $('#lblRx').html(0)

        $('#hdIdRecetaEcoObs').val(0)
        $('#lblEcoObs').html(0)

        $('#hdIdRecetaEcoObsProc').val(0)
        $('#lblEcoObsProc').html(0)

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

        $('#hdIdRecetaFarmaciaAntimic').val(0)
        $('#lblFarmaciaAntimic').html(0)

        $('#hdIdRecetaFarmaciaIntSanit').val(0)
        $('#lblFarmaciaIntSanit').html(0)

        $('#hdIdRecetaInterconsulta').val(0)
        $('#lblInterconsulta').html(0)

        $('#hdIdRecetatomografia').val(0)
        $('#lbltomografia').html(0)

        $('#hdIdRecetaSolicitudCQx').val(0)
        $('#lblSolicitudCQx').html(0)


        $('#btnAgregaRayosX').css("visibility", 'visible');
        $('#btnQuitarRayos').css("visibility", 'visible');
        $('#btnAgregaEcoObs').css("visibility", 'visible');
        $('#btnQuitarEcoObs').css("visibility", 'visible');
        $('#btnAgregaEcoObsProc').css("visibility", 'visible');
        $('#btnQuitarEcoObsProc').css("visibility", 'visible');
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
        $('#btnAgregaFarmaciaAntimic').css("visibility", 'visible');
        $('#btnQuitarFarmaciaAntimic').css("visibility", 'visible');
        $('#btnAgregaFarmaciaIntSanit').css("visibility", 'visible');
        $('#btnQuitarFarmaciaIntSanit').css("visibility", 'visible');

        $('#btnAgregainterconsultas').css("visibility", 'visible');
        $('#btnQuitarinterconsultas').css("visibility", 'visible');

        $('#btnAgregatomografia').css("visibility", 'visible');
        $('#btnQuitartomografia').css("visibility", 'visible');

        $('#btnAgregaSolicitudCQx').css("visibility", 'visible');
        $('#btnQuitarSolicitudCQx').css("visibility", 'visible');

        $(`#cboEspecialidades option[value='${0}']`).attr("selected", true);
        $(`#cboTipoAtencion option[value='${0}']`).attr("selected", true);
        $('#txtResumenHistoriaClinica').val('')
        $('#txtMotivoInterconsulta').val('')

        //Ordenes.idCuentaAtencion = 0;
        //Ordenes.idServicio = 0;

        //------------ANTIMICROBIANOS==============================
        Ordenes.productosSinSolicitud = [];
        Ordenes.LimpiarCamposAntimicrobianos();
        Ordenes.DesbloquearCamposAntimicrobianos();
        $("#frmSolicitudAntimicrobianos").hide();
        //------------ANTIMICROBIANOS==============================

        //------------INTERVENCION SANITARIA==============================       
        Ordenes.LimpiarCamposIntervencionSanitaria();
        Ordenes.DesbloquearCamposIntervencionSanitaria();
        //------------INTERVENCION SANITARIA==============================

        // ------------ PROA ------------
        $('.chk-sindrome, .chk-cultivo').prop('checked', false);
        $('.txt-fecha-cultivo').val('').prop('disabled', true);
        $('#txtOtroSindrome').val('').hide();
        $('#txtOtroCultivo').val('').hide();
        // ------------ PROA ------------

        //$('#cboMedicoReceta').val(ObtenerIdMedicoSesion());
        //console.log(this.ObtenerIdMedicoSesion());
        //Ordenes.ubicaMedico(Ordenes.ObtenerIdMedicoSesion());     //UBICAR MEDICO 
        //Ordenes.listaFecha();
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////KHOYOSI/////////////////
    async agregarProd(idCatalogo) {

        console.log("agregar Producto a la receta, idCatalogo: " + idCatalogo);

        //////////////////KHOYOSI/////////////////////////////////////
        if ($("#cboMedicoReceta").val() == 0 || $("#cboMedicoReceta").val() == null || $("#cboMedicoReceta").val() == '') {
            alerta(2, "Seleccione el médico que receta.");
            return false;
        }
        /////////////////////////////////////////////////////////////////

        //if ($('#hdIdTipoFuenteFian').val() == "" || $('#hdIdTipoFuenteFian').val() == 0) {
        if (Variables.IdFuenteFinanciamiento == 0) {
            //alerta(3, "Existe problemas con el producto, guarde la atención y vuelva a generar las recetas");
            alerta(2, "No se ha asignado la fuente de financiamiento a esta cuenta. Vuelva a cargar la atención.");
        }
        else {
            if (idCatalogo == 21) {
                var objselec = $("#cboRx option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboRx option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadRx').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboRx option:selected').text(),
                            cantidadPedida: $('#txtCAntidadRx').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadRx').val(),
                            dx: null
                        }
                        oTable_rayos.api(true).row.add(objRow).draw(false);
                        oTable_rayos.resize();
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadObs').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboEcoObs option:selected').text(),
                            cantidadPedida: $('#txtCAntidadObs').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadObs').val(),
                            dx: null
                        }
                        oTable_ecoObs.api(true).row.add(objRow).draw(false);
                        oTable_ecoObs.resize();
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadObs").focus();
                        return false;
                    }
                }
            }

            if (idCatalogo == 24) {
                var objselec = $("#cboEcoObsProc option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboEcoObsProc option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadObsProc').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboEcoObsProc option:selected').text(),
                            cantidadPedida: $('#txtCAntidadObsProc').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadObsProc').val(),
                            dx: null
                        }
                        oTable_ecoObsProc.api(true).row.add(objRow).draw(false);
                        oTable_ecoObsProc.resize();
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadObsProc").focus();
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadEcoGeneral').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboecoGene option:selected').text(),
                            cantidadPedida: $('#txtCAntidadEcoGeneral').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadEcoGeneral').val(),
                            dx: null
                        }
                        oTable_ecoGeneral.api(true).row.add(objRow).draw(false);
                        oTable_ecoGeneral.resize();

                        $('#txtCAntidadEcoGeneral').val('1');
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadAPatologica').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboanaPatologica option:selected').text(),
                            cantidadPedida: $('#txtCAntidadAPatologica').val(),
                            idFrecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaAPatologica').val() : 0),
                            frecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaAPatologica option:selected').text() : '--'),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadAPatologica').val(),
                            dx: null
                        }
                        oTable_anatPatologica.api(true).row.add(objRow).draw(false);
                        oTable_anatPatologica.resize();

                        $('#txtCAntidadAPatologica').val('1');
                        $('#cboFrecuenciaAPatologica').val(1);
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadPatoClinica').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboPatoClinica option:selected').text(),
                            cantidadPedida: $('#txtCAntidadPatoClinica').val(),
                            idFrecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaPatoClinica').val() : 0),
                            frecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaPatoClinica option:selected').text() : '--'),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadPatoClinica').val(),
                            dx: null
                        }
                        oTable_PatoClinica.api(true).row.add(objRow).draw(false);
                        oTable_PatoClinica.resize();

                        $('#txtCAntidadPatoClinica').val('1');
                        $('#cboFrecuenciaPatoClinica').val(1);
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadbancoSangre').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbobancoSangre option:selected').text(),
                            cantidadPedida: $('#txtCAntidadbancoSangre').val(),
                            idFrecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaBancoSangre').val() : 0),
                            frecuencia: (Ordenes.tipoServicio == 'HOSP' ? $('#cboFrecuenciaBancoSangre option:selected').text() : '--'),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadbancoSangre').val(),
                            dx: null
                        }
                        oTable_bancoSangre.api(true).row.add(objRow).draw(false);
                        oTable_bancoSangre.resize();

                        $('#txtCAntidadbancoSangre').val('1');
                        $('#cboFrecuenciaBancoSangre').val(1);
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
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadtomografia').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbotomografia option:selected').text(),
                            cantidadPedida: $('#txtCAntidadtomografia').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadtomografia').val(),
                            dx: null
                        }
                        oTable_tomografia.api(true).row.add(objRow).draw(false);
                        oTable_tomografia.resize();

                        $('#txtCAntidadtomografia').val('1');
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadtomografia").focus();
                        return false;
                    }
                }
            }

            //if (idCatalogo == 12) {
            //    var objselec = $("#cbointerconsultas option:selected").attr("idproducto")

            //    if (Ordenes.existeProd(objselec, idCatalogo)) {
            //        alerta(2, $('#cbointerconsultas option:selected').text() + " ya fue agregado.");
            //        return false;
            //    }
            //    else {
            //        precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
            //        if ($('#txtCAntidadinterconsultas').val() > 0) {
            //            var objRow = {
            //                idItem: objselec,
            //                producto: $('#cbointerconsultas option:selected').text(),
            //                cantidadPedida: $('#txtCAntidadinterconsultas').val(),
            //                precio: precioUnitario,
            //                total: precioUnitario * $('#txtCAntidadinterconsultas').val(),
            //            }
            //            oTable_interconsulta.api(true).row.add(objRow).draw(false);

            //            $('#txtCAntidadinterconsultas').val('1');
            //        }
            //        else {
            //            alerta(2, "Ingrese una cantidad correcta");
            //            $("#txtCAntidadinterconsultas").focus();
            //            return false;
            //        }
            //    }
            //}

            if (idCatalogo == 1060) {
                var objselec = $("#cboProcedimientoQuirurgico option:selected").attr("idproducto")

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboProcedimientoQuirurgico option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    var objRow = {
                        idItem: objselec,
                        producto: $('#cboProcedimientoQuirurgico option:selected').text(),
                        cantidadPedida: 1,
                        precio: precioUnitario,
                        total: precioUnitario * 1,
                        dx: null
                    }
                    oTable_solicitudCQx.api(true).row.add(objRow).draw(false);
                    oTable_solicitudCQx.resize();
                }
            }


            if (idCatalogo == 12) {
                var objselec = $("#cbointerconsultasCE option:selected").attr("idproducto")

                if (!isEmpty(objselec)) {
                    if (Ordenes.existeProd(objselec, idCatalogo)) {
                        alerta(2, $('#cbointerconsultas option:selected').text() + " ya fue agregado.");
                        return false;
                    }
                    else {
                        precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cbointerconsultasCE option:selected').text(),
                            cantidadPedida: 1,
                            precio: precioUnitario,
                            total: precioUnitario * 1,
                            idEspecialidad: $('#cboEspecialidades').val(),
                            especialidad: $('#cboEspecialidades option:selected').text(),
                            otraEspecialidad: $('#txtOtrasEspecialidadesInterconsulta').val()
                        }
                        oTable_interconsulta.api(true).row.add(objRow).draw(false);
                        oTable_interconsulta.resize();
                    }
                } else {
                    alerta(2, 'Seleccione un procedimiento');
                }
            }

            if (idCatalogo == 5) {
                var objselec = $("#cboMedicamento").val()
                var productosNoAgregadosFarmacia = [];

                if ($('#hdUtilizaValidaciones').val() == 1) {
                    let stockProducto = await Ordenes.ConsultarStockProductoPorFarmacia($('#cboFarmacia').val(), $('#cboMedicamento').val()) // JDELGADOPM
                    
                    if (stockProducto.table[0].cantidad < $('#txtCAntidadFarmacia').val()) {

                        //swal({
                        //    title: 'Sin Stock',
                        //    text: "No puedes agregar la cantidad solicitada. \n\n El stock actual de " + stockProducto.table[0].nombre + " es: " + stockProducto.table[0].cantidad,
                        //    type: 'warning',
                        //    allowOutsideClick: false,
                        //}).done();
                        alerta2("warning", "Sin Stock", "No puedes agregar la cantidad solicitada. \n\n El stock actual de " + stockProducto.table[0].nombre + " es: " + stockProducto.table[0].cantidad);
                        return false
                    }
                }

                const validacionMedicamentoReciente = await Ordenes.ValidarMedicamentoRecientePaciente(Variables.IdPaciente, objselec);
                if (validacionMedicamentoReciente && validacionMedicamentoReciente.mostrarAlerta) {
                    let mensajeAlertaReciente = validacionMedicamentoReciente.mensajeAlerta;
                    if (!isEmpty(validacionMedicamentoReciente.fechaUltimoUso)) {
                        mensajeAlertaReciente = `Ha utilizado recientemente (${validacionMedicamentoReciente.fechaUltimoUso}) el mismo medicamento en el paciente.`;
                    }

                    alerta2("warning", "Cuidado", mensajeAlertaReciente);
                }

                if (Ordenes.existeProd(objselec, idCatalogo)) {
                    alerta(2, $('#cboMedicamento option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadFarmacia').val() > 0) {
                        let tipoProducto = $("#cboMedicamento option:selected").attr("data-tipoproducto");

                        var objRow = {
                            idItem: objselec,
                            //producto: $('#cboMedicamento option:selected').text(),
                            producto: $('#cboMedicamento option:selected').data('nombre'), // MGAMERO
                            stockActual: $('#cboMedicamento option:selected').data('stockactual'), // MGAMERO
                            cantidadPedida: $('#txtCAntidadFarmacia').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadFarmacia').val(),
                            //RQ0003 RMOREANO 
                            idDosisRecetada: $('#cboDosis').val(),
                            dosis: $('#cboDosis option:selected').text(),
                            idViaAdministracion: $('#cboVia').val(),
                            vias: $('#cboVia option:selected').text(),
                            observaciones: $('#txtFrecuencia').val(),
                            dx: null,
                            tipoProducto: tipoProducto
                            //RQ0003 RM
                        }

                            //MGAMERO
                        let stock = parseInt(objRow.stockActual, 10); 
                        if (isNaN(stock)) stock = 0;
                        if (stock < 1) { // Si no hay stock
                            let nuevoMedicamento = `${objRow.cantidadPedida}-${objRow.producto}`;
                            let contenidoActual = $('#txtOtrosMedicamentos').val().trim();
                            let medicamentosSet = new Set(
                                contenidoActual ? contenidoActual.split('\n').filter(x => x.trim() !== '') : []
                            );
                            medicamentosSet.add(nuevoMedicamento);
                            productosNoAgregadosFarmacia = Array.from(medicamentosSet);
                            $('#txtOtrosMedicamentos').val(Array.from(medicamentosSet).join('\n'));
                            //MGAMERO
                        }
                        else 
                        {
                             oTable_farmacia.api(true).row.add(objRow).draw(false);
                            //oTable_farmacia.fnAdjustColumnSizing();
                            oTable_farmacia.resize();

                        }
                        





                        $('#txtCAntidadFarmacia').val('1');
                        $('#txtFrecuencia').val('');
                        $('#cboDosis').val(0);
                        $('#cboVia').val(0);

                        if (tipoProducto == "ANT") {                            
                            $("#frmSolicitudAntimicrobianos").show();                            
                        }

                        dataTableFarmacia = oTable_farmacia.api(true).rows().data();
                        dataTableFarmacia.each(function (value, index) {
                            var cboDx = "#cboDx_" + dataTableFarmacia[index]["idItem"];            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS

                            //AGREAGADO POR KHOYOSI
                            $(cboDx).empty()
                            $(Diagnosticos?.DevolverDiagnosticos()?.toArray()||[]).each(function (i, obj) {
                                $(cboDx).append('<option  value="'+obj.codigoCIE10 +'">' + obj.codigoCIE10 + '</option>')
                            });

                            $('.chzn-select').chosen().trigger("chosen:updated")

                        });

                        $('.chzn-select').chosen().trigger("chosen:updated");
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadFarmacia").focus();
                        return false;
                    }
                }
            }
        }

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    async agregarProdAntimicrobiano(idCatalogo) {
        //////////////////KHOYOSI/////////////////////////////////////
        if ($("#cboMedicoReceta").val() == 0 || $("#cboMedicoReceta").val() == null || $("#cboMedicoReceta").val() == '') {
            alerta(2, "Seleccione el médico que receta.");
            return false;
        }
        /////////////////////////////////////////////////////////////////

        //if ($('#hdIdTipoFuenteFian').val() == "" || $('#hdIdTipoFuenteFian').val() == 0) {
        if (Variables.IdFuenteFinanciamiento == 0) {
            //alerta(3, "Existe problemas con el producto, guarde la atención y vuelva a generar las recetas");
            alerta(2, "No se ha asignado la fuente de financiamiento a esta cuenta. Vuelva a cargar la atención.");
        }
        else {
            if (idCatalogo == 5) {
                let objselec = $("#cboMedicamentoAntimic").val()

                if (Ordenes.existeProdAntimicrobiano(objselec, idCatalogo)) {
                    alerta(2, $('#cboMedicamentoAntimic option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadFarmaciaAntimic').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboMedicamentoAntimic option:selected').text(),
                            cantidadPedida: $('#txtCAntidadFarmaciaAntimic').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadFarmaciaAntimic').val(),
                            //RQ0003 RMOREANO 
                            idDosisRecetada: $('#cboDosisAntimic').val(),
                            dosis: $('#cboDosisAntimic option:selected').text(),
                            idViaAdministracion: $('#cboViaAntimic').val(),
                            vias: $('#cboViaAntimic option:selected').text(),
                            observaciones: $('#txtFrecuenciaAntimic').val(),
                            dx: null
                            //RQ0003 RM
                        }
                        oTable_farmaciaAntimic.api(true).row.add(objRow).draw(false);
                        //oTable_farmacia.fnAdjustColumnSizing();
                        oTable_farmaciaAntimic.resize();

                        $('#txtCAntidadFarmaciaAntimic').val('1');
                        $('#txtFrecuenciaAntimic').val('');
                        $('#cboDosisAntimic').val(0);
                        $('#cboViaAntimic').val(0);

                        let dataTableFarmaciaAntimic = oTable_farmaciaAntimic.api(true).rows().data();
                        dataTableFarmaciaAntimic.each(function (value, index) {
                            let cboDx = "#cboDxAntimic_" + dataTableFarmaciaAntimic[index]["idItem"];            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS

                            //let lstDx = ObjtableDiagnosticos.api(true).data()

                            //if (lstDx.length > 0) {
                            //    $(cboDx).empty()
                            //    $(lstDx).each(function (i, obj) {
                            //        $(cboDx).append('<option  value="' + obj.codigoCIE10 + '">' + obj.codigoCIE10 + '</option>')
                            //    });

                            //    $('.chzn-select').chosen().trigger("chosen:updated")
                            //}

                            //AGREAGADO POR KHOYOSI
                            $(cboDx).empty()
                            $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                                $(cboDx).append('<option  value="' + obj.codigoCIEsinPto + '">' + obj.codigoCIE10 + '</option>')
                            });

                            $('.chzn-select').chosen().trigger("chosen:updated")


                            //COMENTADO POR KHOYOSI
                            //let formData = new FormData()

                            //formData.append('IdAtencion', Variables.IdAtencion)
                            //return HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                            //    .then(res => {
                            //        if (!isEmpty(res)) {
                            //            if (res.estado) {
                            //                let data = res.data
                            //                if (data.table.length > 0) {
                            //                    $(cboDx).empty()
                            //                    $(data.table).each(function (i, obj) {
                            //                        $(cboDx).append('<option  value="' + obj.codigoCIEsinPto + '">' + obj.codigoCIE10 + '</option>')
                            //                    });

                            //                    $('.chzn-select').chosen().trigger("chosen:updated")
                            //                }
                            //            } else {
                            //                alerta('3', 'Error: ' + res.msg)
                            //                return null
                            //            }
                            //        }

                            //    })
                            //    .catch((e) => {
                            //        alerta(3, 'Algo salio mal ' + e)
                            //        return null
                            //    })

                            console.log('cboDx', cboDx)
                        });

                        $('.chzn-select').chosen().trigger("chosen:updated");
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadFarmaciaAntimic").focus();
                        return false;
                    }
                }
            }


        }
    },

    async agregarProdIntervencionSanitaria(idCatalogo) {
        //////////////////KHOYOSI/////////////////////////////////////
        if (isEmpty($("#cboMedicoReceta").val()) && isEmpty($("#cboObstetraReceta").val())) {
            alerta(2, "Seleccione el médico u obstetra que receta.");
            return false;
        }
        /////////////////////////////////////////////////////////////////

        //if ($('#hdIdTipoFuenteFian').val() == "" || $('#hdIdTipoFuenteFian').val() == 0) {
        if (Variables.IdFuenteFinanciamiento == 0) {
            //alerta(3, "Existe problemas con el producto, guarde la atención y vuelva a generar las recetas");
            alerta(2, "No se ha asignado la fuente de financiamiento a esta cuenta. Vuelva a cargar la atención.");
        }
        else {
            if (idCatalogo == 5) {
                let objselec = $("#cboMedicamentoIntSanit").val()

                if (Ordenes.existeProdIntervencionSanitaria(objselec, idCatalogo)) {
                    alerta(2, $('#cboMedicamentoIntSanit option:selected').text() + " ya fue agregado.");
                    return false;
                }
                else {
                    precioUnitario = await Ordenes.asignaPrecio(objselec, idCatalogo, $('#hdIdTipoFuenteFian').val())
                    if ($('#txtCAntidadFarmaciaIntSanit').val() > 0) {
                        var objRow = {
                            idItem: objselec,
                            producto: $('#cboMedicamentoIntSanit option:selected').text(),
                            cantidadPedida: $('#txtCAntidadFarmaciaIntSanit').val(),
                            precio: precioUnitario,
                            total: precioUnitario * $('#txtCAntidadFarmaciaIntSanit').val(),
                            //RQ0003 RMOREANO 
                            idDosisRecetada: $('#cboDosisIntSanit').val(),
                            dosis: $('#cboDosisIntSanit option:selected').text(),
                            idViaAdministracion: $('#cboViaIntSanit').val(),
                            vias: $('#cboViaIntSanit option:selected').text(),
                            observaciones: $('#txtFrecuenciaIntSanit').val(),
                            dx: null
                            //RQ0003 RM
                        }
                        oTable_farmaciaIntSanit.api(true).row.add(objRow).draw(false);
                        //oTable_farmacia.fnAdjustColumnSizing();
                        oTable_farmaciaIntSanit.resize();

                        $('#txtCAntidadFarmaciaIntSanit').val('1');
                        $('#txtFrecuenciaIntSanit').val('');
                        $('#cboDosisIntSanit').val(0);
                        $('#cboViaIntSanit').val(0);

                        let dataTableFarmaciaIntSanit = oTable_farmaciaIntSanit.api(true).rows().data();
                        dataTableFarmaciaIntSanit.each(function (value, index) {
                            let cboDx = "#cboDxIntSanit_" + dataTableFarmaciaIntSanit[index]["idItem"];            // JDELGADO CAMBIOS PARA AGREGAR DX A LAS RECETAS

                            //let lstDx = ObjtableDiagnosticos.api(true).data()

                            //if (lstDx.length > 0) {
                            //    $(cboDx).empty()
                            //    $(lstDx).each(function (i, obj) {
                            //        $(cboDx).append('<option  value="' + obj.codigoCIE10 + '">' + obj.codigoCIE10 + '</option>')
                            //    });

                            //    $('.chzn-select').chosen().trigger("chosen:updated")
                            //}

                            //AGREAGADO POR KHOYOSI
                            $(cboDx).empty()
                            $(Diagnosticos.DevolverDiagnosticos()?.toArray() || []).each(function (i, obj) {
                                $(cboDx).append('<option  value="' + obj.codigoCIEsinPto + '">' + obj.codigoCIE10 + '</option>')
                            });

                            $('.chzn-select').chosen().trigger("chosen:updated")


                            //COMENTADO POR KHOYOSI
                            //let formData = new FormData()

                            //formData.append('IdAtencion', Variables.IdAtencion)
                            //return HttpClient.Post('/Diagnosticos/SeleccionarDiagnosticosByIdAtencion?area=Comun', formData)
                            //    .then(res => {
                            //        if (!isEmpty(res)) {
                            //            if (res.estado) {
                            //                let data = res.data
                            //                if (data.table.length > 0) {
                            //                    $(cboDx).empty()
                            //                    $(data.table).each(function (i, obj) {
                            //                        $(cboDx).append('<option  value="' + obj.codigoCIEsinPto + '">' + obj.codigoCIE10 + '</option>')
                            //                    });

                            //                    $('.chzn-select').chosen().trigger("chosen:updated")
                            //                }
                            //            } else {
                            //                alerta('3', 'Error: ' + res.msg)
                            //                return null
                            //            }
                            //        }

                            //    })
                            //    .catch((e) => {
                            //        alerta(3, 'Algo salio mal ' + e)
                            //        return null
                            //    })

                            console.log('cboDx', cboDx)
                        });

                        $('.chzn-select').chosen().trigger("chosen:updated");
                    }
                    else {
                        alerta(2, "Ingrese una cantidad correcta");
                        $("#txtCAntidadFarmaciaIntSanit").focus();
                        return false;
                    }
                }
            }


        }
    },


    ListarProcedimientosInterconsulta() {
        return HttpClient.Get('/Receta/ListarProcedimientosInterconsulta?area=Comun')
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        console.log('res', res.data)
                        $('#cbointerconsultasCE').empty()
                        $('#cbointerconsultasCE').append(`<option idproducto="${0}" idEspecialidadInterconsulta="${0}" value="${0}"> -- Seleccionar -- </option>`);
                        $(res.data.table).each((i, obj) => {
                            $('#cbointerconsultasCE').append(`<option idproducto="${obj.idProducto}" idEspecialidadInterconsulta="${obj.idEspecialidadInterconsulta}" value="${obj.codigo}"> ${obj.nombre}</option>`);
                        })
                        $('.chzn-select').chosen().trigger("chosen:updated");
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


    async ListarCatalogoTotal() {
        var respuesta;
        var resp = false;
        let datos
        var midata = new FormData();

        midata.append('tipoServicio', Ordenes.tipoServicio);

        Cargando(1);
        try {

            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Catalogo/ListarCatalogoCompleto?area=Comun",
                    //contentType: "application/json; charset=utf-8",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            if (!isEmpty(datos.resultado.table)) {
                $('#cboRx').empty();
                $('#cboEcoObs').empty();
                $('#cboEcoObsProc').empty();
                $('#cboecoGene').empty();
                $('#cboanaPatologica').empty();
                $('#cboPatoClinica').empty();
                $('#cbobancoSangre').empty
                $('#cbotomografia').empty();
                $('#cbointerconsultas').empty();
                $('#cbointerconsultasCE').empty()
                $('#cboProcedimientoQuirurgico').empty()

                $('.chzn-select').chosen().trigger("chosen:updated");
                $(datos.resultado.table).each(function (i, obj) {
                    if (obj.idEstado == 1) {
                        if (obj.idPuntoCarga === 21) {
                            $('#cboRx').append('<option  idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 23) {
                            $('#cboEcoObs').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 24) {
                            $('#cboEcoObsProc').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 20) {
                            $('#cboecoGene').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 3) {
                            $('#cboanaPatologica').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 2) {
                            $('#cboPatoClinica').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 11) {
                            $('#cbobancoSangre').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 12) {
                            $('#cbointerconsultas').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idPuntoCarga === 22) {
                            $('#cbotomografia').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                        if (obj.idEspecialidadInterconsulta > 0) {
                            $('#cbointerconsultasCE').append(`<option idproducto="${obj.idProducto}" idEspecialidadInterconsulta="${obj.idEspecialidadInterconsulta}" value="${obj.codigo}"> ${obj.nombre}</option>`);
                        }

                        // JDELGADO CENTRO QUIRURGICO
                        if (obj.idPuntoCarga === 1060) {
                            $('#cboProcedimientoQuirurgico').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                        }
                    }
                });
                $('#cbointerconsultasCE').val(0);
                //$('#cboEspecialidades').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");

            }
            else {
                resp = [];
            }
        } catch (error) {
            alerta(3, error);
        }

        return resp;
    },

    async BuscarCatalogo(idPunto, idFarmacia) {
        var midata = new FormData();
        midata.append('idPuntoCarga', idPunto);
        midata.append('idFarmacia', idFarmacia);
        await $.ajax({
            method: "POST",
            url: "/Catalogo/CatalogoServiciosSeleccionarSoloConPreciosEnParticular?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                if (idPunto === 21) {
                    $('#cboRx').empty();
                }
                if (idPunto === 23) {
                    $('#cboEcoObs').empty();
                }
                if (idPunto === 24) {
                    $('#cboEcoObsProc').empty();
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
                    $('#cbointerconsultas').append('<option idproducto="0" value="0"> ' + '-- Seleccionar --' + '</option>');
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
                                if (obj.idProducto == 52935 ||
                                    obj.idProducto == 3138 ||
                                    obj.idProducto == 52921 ||
                                    obj.idProducto == 52923 ||
                                    obj.idProducto == 52924 ||
                                    obj.idProducto == 52925 ||
                                    obj.idProducto == 52926 ||
                                    obj.idProducto == 52927 ||
                                    obj.idProducto == 52928 ||
                                    obj.idProducto == 52929 ||
                                    obj.idProducto == 52930 ||
                                    obj.idProducto == 3146 ||
                                    obj.idProducto == 52937 ||
                                    obj.idProducto == 52938 ||
                                    obj.idProducto == 3147 ||
                                    obj.idProducto == 3148 ||
                                    obj.idProducto == 52931 ||
                                    obj.idProducto == 52932 ||
                                    obj.idProducto == 3149 ||
                                    obj.idProducto == 3150 ||
                                    obj.idProducto == 52933 ||
                                    obj.idProducto == 52934) {
                                    $('#cboEcoObs').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
                                }
                            }
                            if (idPunto === 24) {
                                $('#cboEcoObsProc').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
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

    //////////////////////////KHOYOSI//////////////////////////////////////
    async BuscarCatalogoPorServicio(idPunto, idServicio) {
        var midata = new FormData();
        midata.append('idPuntoCarga', idPunto);
        midata.append('idServicio', idServicio);
        await $.ajax({
            method: "POST",
            url: "/Catalogo/CatalogoServiciosSeleccionarPorPtoCargaPorServSoloConPreciosEnParticular?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            ////async: false,
            success: function (datos) {
                if (idPunto === 21) {

                    $('#cboRx').empty();
                }
                if (idPunto === 23) {
                    $('#cboEcoObs').empty();
                }
                if (idPunto === 24) {
                    $('#cboEcoObsProc').empty();
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
                            if (idPunto === 24) {
                                $('#cboEcoObsProc').append('<option idproducto="' + obj.idProducto + '" value="' + obj.codigo + '"> ' + obj.nombre + '</option>');
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
    //////////////////////////////////////////////////////////////////////

    async DevuelveViaxIdProducto(idProducto) {

        var Via = "";

        precio = 0
        var midata = new FormData();
        midata.append('idproducto', idProducto);


        await $.ajax({
            method: "POST",
            url: "/Receta/ListarViasAdministracionbyProducto?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,

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
    async listaMedicos() {
        await $.ajax({
            method: "POST",
            url: "/Receta/ListaMedicos?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
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

    /////////////////////JDELGADO//////////////////////////////////
    async ListarM_ClaseIntervencionCQx() {
        await $.ajax({
            method: "POST",
            url: "/SalaOperaciones/ListarM_ClaseIntervencionCQx?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboClaseIntervencion').empty();
                $(datos.data.table).each(function (i, obj) {
                    $('#cboClaseIntervencion').append('<option  value="' + obj.idClaseIntervencion + '">' + obj.descripcion + '</option>');
                });
                $('#cboClaseIntervencion').val(0);
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

    async ListarM_ClasificacionPacienteCQx() {
        await $.ajax({
            method: "POST",
            url: "/SalaOperaciones/ListarM_ClasificacionPacienteCQx?area=Comun",
            data: null,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboClasePlaciente').empty();
                $(datos.data.table).each(function (i, obj) {
                    $('#cboClasePlaciente').append('<option  value="' + obj.idClasificacion + '">' + obj.descripcion + '</option>');
                });
                $('#cboClasePlaciente').val(0);
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

    //////////////////////////////////SOLICITUD ANTIMICROBIANOS//////////////////////////////////////////////////////////////////
    async ListaMotivoSolicitud() {

        await $.ajax({
            url: "/Antimicrobianos/ListaMotivoSolicitud?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboMotivoSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMotivoSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboMotivoSolAntimic').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaCondicionSolicitud() {

        await $.ajax({
            url: "/Antimicrobianos/ListaCondicionSolicitud?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboCondicionPacienteSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCondicionPacienteSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboCondicionPacienteSolAntimic').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar condicion paciente!", "2");
                }, 900)
            }
        });
    },

    async ListaMotivosRechazo() {

        await $.ajax({
            url: "/Antimicrobianos/ListaMotivosRechazo?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboMotivoRechazoSolAntimic').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboMotivoRechazoSolAntimic').append('<option  value="' + obj.valor + '">' + obj.descripcion + '</option>');
                });
                $('#cboMotivoRechazoSolAntimic').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivo rechazo!", "2");
                }, 900)
            }
        });
    },

    ExisteCondicionPaciente() {
        let lstCondicion = oTable_CondicionPacienteSolAntimic.api(true).rows().data();

        if (isEmpty($("#cboCondicionPacienteSolAntimic").val()) || $("#cboCondicionPacienteSolAntimic").val() == 0) {
            alerta2("info", "", "Por favor seleccione una condición de la lista.");
            return true;
        }

        for (let i = 0; i < lstCondicion.length; i++) {
            if (lstCondicion[i].idTipoCondicionAntimicrobiano == $("#cboCondicionPacienteSolAntimic").val()) {
                alerta2("info", "", "Ya existe la condición del paciente.");
                return true;
            }
        }

        return false;
    },

    async SeleccionarSolicitudAntimicrobiano(idSolicitud) {
        let resp = false;
        let datos
        let data = new FormData();

        data.append('idSolicitud', idSolicitud);

        try {

            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Antimicrobianos/SeleccionaSolicitudAntimicrobiano?area=Farmacia",
                    //contentType: "application/json; charset=utf-8",
                    data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.table.length > 0) {
                cabecera = datos.table[0];
                Ordenes.idSolicitudAntimicrobiano = cabecera.idSolicitudAntimicrobiano;
                //GestionAntimicrobianos.idReceta = cabecera.idReceta;                
                $("#cboMotivoSolAntimic").val(cabecera.idMotivo);
                $("#txtTratamientoActualSolAntimic").val(cabecera.tratamientoPrevio);

                if (cabecera.autorizaAntimicrobiano == 1) {
                    $('#rdbAutorizaSolAntimicSI').prop('checked', true);
                } else if (cabecera.autorizaAntimicrobiano == 0) {
                    $('#rdbAutorizaSolAntimicNO').prop('checked', true);
                    $("#cboMotivoRechazoSolAntimic").val(cabecera.idMotivoRechazo);
                }

                Ordenes.AutorizaAntimicrobianos_Change();
                $("#txtFechaRespuestaSolAntimic").datepicker("setDate", cabecera.fechaApruebaSolicitud);
                $("#txtSugerenciaTratamientoSolAntimic").val(cabecera.sugerenciasTratamiento);

                //if (GestionAntimicrobianos.accion == "M") {
                //    $("#contentAutorizaAntimicrobiano").hide();
                //} else if (GestionAntimicrobianos.accion == "C" || GestionAntimicrobianos.accion == "AP") {
                //    if (isEmpty(cabecera.fechaAutoriza)) {
                //        $("#contentAutorizaAntimicrobiano").hide();
                //        let fechaHoy = await Utilitario.FechaHoraServidor();
                //        $("#txtFechaRespuestaSolAntimic").datepicker("setDate", fechaHoy.substring(0, 10));
                //    } else {
                //        $("#contentAutorizaAntimicrobiano").show();
                //        if (cabecera.autorizaAntimicrobiano == 1) {
                //            $('#rdbAutorizaSolAntimicSI').prop('checked', true);
                //        } else if (cabecera.autorizaAntimicrobiano == 0) {
                //            $('#rdbAutorizaSolAntimicNO').prop('checked', true);
                //            $("#cboMotivoRechazoSolAntimic").val(cabecera.idMotivoRechazo);
                //        }
                //        GestionAntimicrobianos.Autoriza_Change();
                //        $("#txtFechaRespuestaSolAntimic").datepicker("setDate", cabecera.fechaApruebaSolicitud);
                //        $("#txtSugerenciaTratamientoSolAntimic").val(cabecera.sugerenciasTratamiento);
                //    }

                //    if (GestionAntimicrobianos.accion == "AP") {
                //        $("#contentAutorizaAntimicrobiano").show();
                //    }
                //}

                oTable_CondicionPacienteSolAntimic.fnAddData(datos.table1);
                //oTable_DetalleRecetaSolAntimic.fnAddData(datos.table2);
                //oTable_DiagnosticosRecetaSolAntimic.fnAddData(datos.table3);

                if (cabecera.autorizaAntimicrobiano == 0 || cabecera.autorizaAntimicrobiano == 1) {
                    Ordenes.BloquearCamposAntimicrobianos();
                }

                $('.chzn-select').chosen().trigger("chosen:updated");

                resp = true;
            }
            else {
                alerta2("error", "", "Hubo un problema al cargar la solicitud.");
                resp = false;
            }



        } catch (error) {
            Cargando(0);
            resp = false;
            alerta2("error", "", error);
        }

        return resp;
    },

    AutorizaAntimicrobianos_Change() {
        $("#contentRechazaAntimicrobiano").hide();
        if ($("#rdbAutorizaSolAntimicSI").is(':checked')) {
            //$("#cboMotivoRechazoSolAntimic").val("");
            $('.chzn-select').chosen().trigger("chosen:updated");
            $("#contentRechazaAntimicrobiano").hide();
        } else if ($("#rdbAutorizaSolAntimicNO").is(':checked')) {
            $("#contentRechazaAntimicrobiano").show();
        }

    },


    LimpiarCamposAntimicrobianos() {

        Ordenes.idSolicitudAntimicrobiano = 0;        
        $('#cboMotivoSolAntimic').val("");
        $('#txtTratamientoActualSolAntimic').val("");
        $('#cboCondicionPacienteSolAntimic').val("");

        $(".rdbAutorizaSolAntimic").removeAttr("checked");
        $('#cboMotivoRechazoSolAntimic').val("");
        $('#txtSugerenciaTratamientoSolAntimic').val("");
        $('#txtFechaRespuestaSolAntimic').val("");

        oTable_CondicionPacienteSolAntimic.fnClearTable();
        $('#contentRechazaAntimicrobiano').hide();

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    BloquearCamposAntimicrobianos() {
        if (Ordenes.accion == "C") {
            $(".rdbGeneraSolAntimic").attr("disabled", true);
        } else {
            $(".rdbGeneraSolAntimic").removeAttr("disabled");
        }

        $('#cboMotivoSolAntimic').attr("disabled", true);
        $('#txtTratamientoActualSolAntimic').attr("disabled", true);
        $('#cboCondicionPacienteSolAntimic').attr("disabled", true);
        oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, false)
        $('#contentCondicionAntimicrobiano').hide();

        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCamposAntimicrobianos() {
        if (Ordenes.accion == "C") {
            $(".rdbGeneraSolAntimic").attr("disabled", true);
        } else {
            $(".rdbGeneraSolAntimic").removeAttr("disabled");
        }

        $('#cboMotivoSolAntimic').removeAttr("disabled");
        $('#txtTratamientoActualSolAntimic').removeAttr("disabled");
        $('#cboCondicionPacienteSolAntimic').removeAttr("disabled");
        oTable_CondicionPacienteSolAntimic.fnSetColumnVis(2, true)
        $('#contentCondicionAntimicrobiano').show();

        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    //////////////////////////////////INTERVENCION SANITARIA//////////////////////////////////////////////////////////////////
    async ListaCoordinadores() {

        await $.ajax({
            url: "/IntervencionSanitaria/ListaCoordinadores?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboCoordinadorIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboCoordinadorIntSanit').append('<option  value="' + obj.idEmpleado + '">' + obj.apNom + '</option>');
                });
                $('#cboCoordinadorIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaComponentes() {

        await $.ajax({
            url: "/IntervencionSanitaria/ListaComponentes?area=Farmacia",
            datatype: "json",
            data: null,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                $('#cboComponenteIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboComponenteIntSanit').append('<option  value="' + obj.idComponente + '">' + obj.descripcion + '</option>');
                });
                $('#cboComponenteIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaSubComponentes(idComponente) {
        let midata = new FormData();
        midata.append('idComponente', idComponente);

        Cargando(1);
        await $.ajax({
            url: "/IntervencionSanitaria/ListaSubComponentes?area=Farmacia",
            datatype: "json",
            data: midata,
            type: "post",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                $('#cboSubComponenteIntSanit').empty();
                $(datos.table).each(function (i, obj) {
                    $('#cboSubComponenteIntSanit').append('<option data-cie10="' + obj.diagnostico + '" value="' + obj.idSubComponente + '">' + obj.descripcion + '</option>');
                });
                $('#cboSubComponenteIntSanit').val("");
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                Cargando(0);
                setTimeout(function () {
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar motivos solicitudes!", "2");
                }, 900)
            }
        });
    },

    async ListaDiagnosticosIntervencionSanitaria(filtro) {
        let datos = null;
        let midata = new FormData();
        //let filtro = '';

        $('#cboDiagnosticoIntSanit').empty();
        $('#cboDiagnosticoIntSanit').append('<option  value="0">Busque y seleccione un diagnóstico</option>');
        $('#cboDiagnosticoIntSanit').val("0");
        $('.chzn-select').chosen().trigger("chosen:updated");
        if (filtro.length >= 3) {
            try {

                midata.append('filtro', filtro);

                //Cargando(1);
                datos = await
                    $.ajax({
                        method: "POST",
                        url: "/IntervencionSanitaria/ListaDiagnosticosIntervencionSanitaria?area=Farmacia",
                        data: midata,
                        dataType: "json",
                        cache: false,
                        processData: false,
                        contentType: false,
                    });

                //Cargando(0)

                $(datos.table).each(function (i, obj) {
                    $('#cboDiagnosticoIntSanit').append('<option data-cie10="' + obj.codigoCIE10 + '" value="' + obj.idDiagnostico + '">' + obj.diagnostico + '</option>');
                });

                $('#cboDiagnosticoIntSanit').val("0");
                $('.chzn-select').chosen().trigger("chosen:updated");

            } catch (error) {
                resp = false;
                //console.error(error)
                alerta(3, error);
            }
        }

        $('#cboDiagnosticoIntSanit_chosen .chosen-drop .chosen-search input').val(filtro);
    },

    LimpiarCamposIntervencionSanitaria() {
        $('#cboCoordinadorIntSanit').val("");
        $('#cboComponenteIntSanit').val("");
        $('#cboSubComponenteIntSanit').val("");
        $('#cboDiagnosticoIntSanit').val("");
        $('#txtObservacionesIntSanit').val("");
        $('.chzn-select').chosen().trigger("chosen:updated");
        Ordenes.ListaDiagnosticosIntervencionSanitaria('');
    },

    BloquearCamposIntervencionSanitaria() {
        $('#cboCoordinadorIntSanit').attr("disabled", true);
        $('#cboComponenteIntSanit').attr("disabled", true);
        $('#cboSubComponenteIntSanit').attr("disabled", true);
        $('#cboDiagnosticoIntSanit').attr("disabled", true);
        $('#txtObservacionesIntSanit').attr("disabled", true);
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    DesbloquearCamposIntervencionSanitaria() {
        $('#cboCoordinadorIntSanit').removeAttr("disabled");
        $('#cboComponenteIntSanit').removeAttr("disabled");
        $('#cboSubComponenteIntSanit').removeAttr("disabled");
        $('#cboDiagnosticoIntSanit').removeAttr("disabled");
        $('#txtObservacionesIntSanit').removeAttr("disabled");
        $('.chzn-select').chosen().trigger("chosen:updated");
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    async GuardarOrdenesMedicas() {
        var formData = new FormData();
        let datos;
        let resp = false;

        var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21);
        var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23);
        var ListaRecetaDetalleEcobsProc = Ordenes.DevolverRecetaDetalle(24);
        var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20);
        var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3);
        var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2);
        var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11);
        var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5);
        var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12); // jdelgado011
        var ListaRecetaDetalleTomografia = Ordenes.DevolverRecetaDetalle(22); // jdelgado011

        var ListaRecetaDetalleSolicitudCQx = Ordenes.DevolverRecetaDetalle(1060); // jdelgado011

        if (ListaRecetaDetalleRx == "[]" && ListaRecetaDetalleEcobs == "[]" && ListaRecetaDetalleEcobsProc == "[]" && ListaRecetaDetalleEcoGeneral == "[]" && ListaRecetaDetalleAnatoPatologica == "[]" &&
            ListaRecetaDetallePatalogiaClinica == "[]" && ListaRecetaDetalleBancoSangre == "[]" && ListaRecetaDetalleFarmacia == "[]" && ListaRecetaDetalleInterconsulta == "[]" && ListaRecetaDetalleTomografia == "[]"
            && ListaRecetaDetalleSolicitudCQx == "[]") {
            return true;
        }

        //rayos
        formData.append('lstRecetaRx', ListaRecetaDetalleRx);
        formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
        //ecoobst
        formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
        formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());
        //ecoobst procedimiento
        formData.append('lstRecetaEcoObsProc', ListaRecetaDetalleEcobsProc);
        formData.append('idRecetaEcoObsProc', $('#hdIdRecetaEcoObsProc').val());
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


        formData.append('lstRecetaSolicitudCQx', ListaRecetaDetalleSolicitudCQx); //jdelgado011
        formData.append('idRecetaSolicitudCQx', $('#hdIdRecetaSolicitudCQx').val()); //jdelgado011

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
        formData.append('otrosMedicamentos', $('#txtOtrosMedicamentos').val()); //MGAMERO

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
                        console.log(datos)
                        var recetas = [
                            { "idPuntoCarga": 21, "idReceta": datos.lrcRx },
                            { "idPuntoCarga": 2, "idReceta": datos.lrcPatoClin },
                            { "idPuntoCarga": 3, "idReceta": datos.lrcAnaPato },
                            { "idPuntoCarga": 11, "idReceta": datos.lrcBancoS },
                            { "idPuntoCarga": 20, "idReceta": datos.lrcEcoGene },
                            { "idPuntoCarga": 23, "idReceta": datos.lrcEcoObst },
                            { "idPuntoCarga": 24, "idReceta": datos.lrcEcoObstProc },
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmacia },
                            { "idPuntoCarga": 22, "idReceta": datos.lrcTomografia },
                            { "idPuntoCarga": 12, "idReceta": datos.lrcInterconsulta },
                            { "idPuntoCarga": 1060, "idReceta": datos.lrcSolicitudCQx },
                        ]
                        console.log(recetas)
                        VisorReceta.AbrirVisorRecetas(recetas);

                        resp = true;

                        //swal({
                        //    title: 'Recetas',
                        //    text: datos.msjReceta,
                        //    type: 'info',
                        //}).done();
                        alerta2("info", "Recetas", datos.msjReceta);

                    }

                    alerta('1', 'Se  registro correctamente las recetas');
                    return resp;
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
    },


    async GuardarOrdenesMedicasV2() {
        var formData = new FormData();
        let datos;
        let resp = [];

        var ListaRecetaDetalleRx = Ordenes.DevolverRecetaDetalle(21);
        var ListaRecetaDetalleEcobs = Ordenes.DevolverRecetaDetalle(23);
        var ListaRecetaDetalleEcobsProc = Ordenes.DevolverRecetaDetalle(24);
        var ListaRecetaDetalleEcoGeneral = Ordenes.DevolverRecetaDetalle(20);
        var ListaRecetaDetalleAnatoPatologica = Ordenes.DevolverRecetaDetalle(3);
        var ListaRecetaDetallePatalogiaClinica = Ordenes.DevolverRecetaDetalle(2);
        var ListaRecetaDetalleBancoSangre = Ordenes.DevolverRecetaDetalle(11);
        var ListaRecetaDetalleFarmacia = Ordenes.DevolverRecetaDetalle(5);
        var ListaRecetaDetalleFarmaciaAntimicrobiano = Ordenes.DevolverRecetaAntimicrobianoDetalle();
        var ListaRecetaDetalleFarmaciaIntervencionSanitaria = Ordenes.DevolverRecetaIntervencionSanitariaDetalle();
        var ListaRecetaDetalleInterconsulta = Ordenes.DevolverRecetaDetalle(12); // jdelgado011

        var ListaRecetaDetalleTomografia = Ordenes.DevolverRecetaDetalle(22); // jdelgado011

        var ListaRecetaDetalleSolicitudCQx = Ordenes.DevolverRecetaDetalle(1060); // jdelgado011

        if (ListaRecetaDetalleRx == "[]" && ListaRecetaDetalleEcobs == "[]" && ListaRecetaDetalleEcobsProc == "[]" && ListaRecetaDetalleEcoGeneral == "[]" && ListaRecetaDetalleAnatoPatologica == "[]" &&
            ListaRecetaDetallePatalogiaClinica == "[]" && ListaRecetaDetalleBancoSangre == "[]" && ListaRecetaDetalleFarmacia == "[]" && ListaRecetaDetalleFarmaciaAntimicrobiano == "[]" && ListaRecetaDetalleFarmaciaIntervencionSanitaria == "[]" &&
            ListaRecetaDetalleInterconsulta == "[]" && ListaRecetaDetalleTomografia == "[]" && ListaRecetaDetalleSolicitudCQx == "[]") {
            alerta2('warning', '', 'No existe ningún item para registrar en la receta.');
            //return true;
            return resp;
        }

        /////////////////VALIDAR SI ES RECETA DE ANTIMICROBIANOS//////////////////////////////        
        let generarSolicitudAntimicrobiano = 0;
        if (ListaRecetaDetalleFarmaciaAntimicrobiano != "[]") {
            if (!Ordenes.ValidarProaAntimicrobiano()) {
                return false;
            }
            Ordenes.productosSinSolicitud = await Ordenes.DevolverProductosSinSolicitudAntimicrobianos();                      
                        
            if (Ordenes.productosSinSolicitud.length > 0) {
                if ($('input[name="rdbGeneraSolAntimic"]:checked').val() == 0 || isEmpty($('input[name="rdbGeneraSolAntimic"]:checked').val())) {
                    let tblProductos = "";
                    Ordenes.productosSinSolicitud.forEach(item => {
                        tblProductos = tblProductos + '<tr><td class="text-sm-center" style="font-weight: normal;">' + item.producto + '</td><tr>';
                    });

                    let mensajeAntimic = 'Existen productos que aún no cuentan con una solicitud de antimicrobianos. Por favor genere la solicitud de antimicrobianos.' + 
                                         '<table class="table table-sm table-bordered table-content-md border mx-auto mt-1">' +
                                         '<tr>' +
                                         '<th class="text-sm-center" style="background: lightsteelblue;">Producto</th>' +
                                         '</tr>' +
                                         tblProductos +                                   
                                        '</table>';
                    alerta2("info", "", mensajeAntimic);

                    $("#rdbGeneraSolAntimicSI").prop("checked", true);
                    Ordenes.DesbloquearCamposAntimicrobianos();
                    return resp;
                }
                
            }

            if ($('input[name="rdbGeneraSolAntimic"]:checked').val() == 1) {
                generarSolicitudAntimicrobiano = 1;
                if (isEmpty($("#cboMotivoSolAntimic").val()) == true) {
                    $('#cboMotivoSolAntimic').trigger('chosen:activate');
                    alerta2('info', '', 'Seleccione el Motivo de la Solicitud para la receta de antimicrobianos.');
                    return resp;
                }

                if (isEmpty($("#txtTratamientoActualSolAntimic").val())) {
                    $("#txtTratamientoActualSolAntimic").focus();
                    alerta2("info", "", "Por favor ingrese el Tratamiento Actual en la solicitud para la receta de antimicrobianos.");
                    return resp;
                }

                let lstCondicion = oTable_CondicionPacienteSolAntimic.api(true).rows().data();
                if (lstCondicion.length == 0) {
                    alerta2("info", "", "Por favor agregue almenos una Condición del Paciente en la solicitud para la receta de antimicrobianos.");
                    return resp;
                }
            } else {
                generarSolicitudAntimicrobiano = 0;
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////

        /////////////////VALIDAR SI ES RECETA DE INTERVENCION SANITARIA//////////////////////////////        
        if (ListaRecetaDetalleFarmaciaIntervencionSanitaria != "[]") {

        }
        /////////////////////////////////////////////////////////////////////////////////////

        formData.append('idCuentaAtencion', $('#hdIdCuentaAtencion').val());
        //==============rayos==============
        formData.append('lstRecetaRx', ListaRecetaDetalleRx);
        formData.append('idRecetaRx', $('#hdIdRecetaRX').val());
        //==============ecoobst==============
        formData.append('lstRecetaEcoObs', ListaRecetaDetalleEcobs);
        formData.append('idRecetaEcoObs', $('#hdIdRecetaEcoObs').val());
        //==============ecoobst procedimiento==============
        formData.append('lstRecetaEcoObsProc', ListaRecetaDetalleEcobsProc);
        formData.append('idRecetaEcoObsProc', $('#hdIdRecetaEcoObsProc').val());
        //==============EcoGeneral==============
        formData.append('lstRecetaEcoGeneral', ListaRecetaDetalleEcoGeneral);
        formData.append('idRecetaEcoGene', $('#hdIdRecetaEcoGene').val());
        //==============anatoPatolg==============
        formData.append('lstRecetaAnatoPatologica', ListaRecetaDetalleAnatoPatologica);
        formData.append('idRecetaAnaPatologica', $('#hdIdRecetaAnaPatologica').val());
        //==============patogClinica==============
        formData.append('lstRecetaPatalogiaClinica', ListaRecetaDetallePatalogiaClinica);
        formData.append('idRecetaPatoClinica', $('#hdIdRecetaPatoClinica').val());
        //==============patogClinica==============
        formData.append('lstRecetaBancoSangre', ListaRecetaDetalleBancoSangre);
        formData.append('idRecetaBancoSangre', $('#hdIdRecetabancoSangre').val());
        //==============farmacia==============
        formData.append('lstRecetaFarmacia', ListaRecetaDetalleFarmacia);
        formData.append('idRecetaFarmacia', $('#hdIdRecetaFarmacia').val());
        //==============farmacia SOLICITUD ANTIMICROBIANOS//==============
        //formData.append('recetaAntimicrobiano', ($("#chkAntimicrobianos").is(':checked') == true ? 1 : 0));
        formData.append('lstRecetaFarmaciaAntimicrobiano', ListaRecetaDetalleFarmaciaAntimicrobiano);
        formData.append('idRecetaFarmaciaAntimicrobiano', $('#hdIdRecetaFarmaciaAntimic').val());
        formData.append('recetaAntimicrobiano', (ListaRecetaDetalleFarmaciaAntimicrobiano != "[]" ? 1 : 0));
        formData.append('GenerarSolicitudAntimicrobiano', generarSolicitudAntimicrobiano);
        formData.append('IdSolicitudAntimicrobiano', Ordenes.idSolicitudAntimicrobiano);
        formData.append('FechaSolicitud', '');
        formData.append('IdMotivo', $('#cboMotivoSolAntimic').val());
        let lstCondiciones = oTable_CondicionPacienteSolAntimic.api(true).rows().data();
        formData.append('CondicionPaciente', JSON.stringify(lstCondiciones.toArray()));
        formData.append('TratamientoPrevio', $('#txtTratamientoActualSolAntimic').val());
        formData.append('AutorizaAntimicrobiano', null);
        formData.append('IdMotivoRechazo', null);
        formData.append('FechaRespuesta', null);
        formData.append('SugerenciasTratamiento', null);
        formData.append('EstaAutorizando', 0);

        //==============farmacia INTERVENCION SANITARIA//==============
        formData.append('lstRecetaFarmaciaIntervencionSanitaria', ListaRecetaDetalleFarmaciaIntervencionSanitaria);
        formData.append('idRecetaFarmaciaIntervencionSanitaria', $('#hdIdRecetaFarmaciaIntSanit').val());
        formData.append('recetaIntervencionSanitaria', (ListaRecetaDetalleFarmaciaIntervencionSanitaria != "[]" ? 1 : 0));
        formData.append('idCoordinadorIS', $('#cboCoordinadorIntSanit').val());
        formData.append('idComponenteIS', $('#cboComponenteIntSanit').val());
        formData.append('idSubComponenteIS', $('#cboSubComponenteIntSanit').val());
        formData.append('idDiagnosticoIS', $('#cboDiagnosticoIntSanit').val());
        formData.append('observacionesIS', $('#txtObservacionesIntSanit').val());

        //==============JDELGADO011 INTERCONSULTA==============
        formData.append('lstRecetaInterconsulta', ListaRecetaDetalleInterconsulta); //jdelgado011
        formData.append('idRecetaInterconsulta', $('#hdIdRecetaInterconsulta').val()); //jdelgado011

        formData.append("idEspecialidadInterconsulta", $("#cboEspecialidades").val());
        formData.append("idTipoConsultaInterconsulta", $("#cboTipoAtencion").val());
        formData.append("resumenHistoriaClinica", $("#txtResumenHistoriaClinica").val());
        formData.append("motivoInterconsulta", $("#txtMotivoInterconsulta").val());
        //==============JDELGADO011 INTERCONSULTA==============

        //==============JDELGADO011 CQx==============
        formData.append('lstRecetaSolicitudCQx', ListaRecetaDetalleSolicitudCQx); //jdelgado011
        formData.append('idRecetaSolicitudCQx', $('#hdIdRecetaSolicitudCQx').val()); //jdelgado011

        formData.append("IdSolicitudSOP", Ordenes.IdSolicitudSOP);

        formData.append("IdMedicoSolicita", $('#cboMedicoReceta').val());


        formData.append("ClaseIntervencion", $("#cboClaseIntervencion").val());
        formData.append("IdUbicacionPaciente", $("#cboUbicacionPlaciente").val());
        formData.append("ClasePlaciente", $("#cboClasePlaciente").val());
        formData.append("SolicitudCirujano", $("#cboSolicitudCirujano").val());
        formData.append("SolicitudPrimerAyudante", $("#cboSolicitudPrimerAyudante").val());
        formData.append("SolicitudAnestesiologoCQx", $("#cboSolicitudAnestesiologoCQx").val());
        formData.append("SolicitudTipoAnestesiaPreviaCQx", $("#cboSolicitudTipoAnestesiaPreviaCQx").val());
        formData.append("SalaSolicitudCQx", $("#cboSalaSolicitudCQx").val());
        formData.append("FechaParaCQx", $("#txtFechaParaCQx").val());
        formData.append("HoraParaCqx", $("#txtHoraParaCqx").val());
        formData.append("FechaSolicitudCQx", $("#txtFechaSolicitudCQx").val());
        formData.append("HoraSolicitudCQx", $("#txtHoraSolicitudCQx").val());
        formData.append("FechaSolicitudCQxAceptada", $("#txtFechaSolicitudCQxAceptada").val());
        formData.append("HoraSolicitudCQxAceptada", $("#txtHoraSolicitudCQxAceptada").val());

        //==============JDELGADO011 TOMOGRAFIA==============
        formData.append('lstRecetaTomografia', ListaRecetaDetalleTomografia); //jdelgado011
        formData.append('idRecetaTomografia', $('#hdIdRecetatomografia').val()); //jdelgado011




        //formData.append('idMedico', $('#cboMedico').val());
        formData.append('idMedico', $('#cboMedicoReceta').val());
        formData.append('fechaVigencia', $('#txtFechaVigencia').val());
        //formData.append('idServicioReceta', $('#cboProcedencia').val());
        formData.append('idServicioReceta', $('#hdIdServicioPaciente').val());
        formData.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        formData.append('nroEvaluacion', $('#hdNroEvaluacion').val());

        formData.append('otrosMedicamentos', $('#txtOtrosMedicamentos').val()); //MGAMERO

        formData.append('lstDiagnosticosPre', JSON.stringify(ObjtableDiagnosticosSolicitudCQx.api(true).data().toArray()));

        //============= PROA =============
        let lstProa = Ordenes.ObtenerProaAntimicrobiano();
        console.log('lstProa:', lstProa);
        formData.append('lstRecetaFarmaciaAntimicrobianoPROA', lstProa);

        alerta(4, 'Generando recetas, por favor espere.');
        //AQUI ES !!!!!! MGAMERO
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
                        var objRecetas = datos.objRecetas;

                        console.log('objRecetas:', objRecetas);

                        const obtenerCodePorIdReceta = (idReceta) => {
                            if (!idReceta) return '';

                            const receta = objRecetas.find(x => String(x.idReceta) === String(idReceta));
                            return receta ? receta.code : '';
                        };

                        var recetas = [
                            { "idPuntoCarga": 21, "idReceta": datos.lrcRx, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 21)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 21).code },
                            { "idPuntoCarga": 2, "idReceta": datos.lrcPatoClin, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 2)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 2).code },
                            { "idPuntoCarga": 3, "idReceta": datos.lrcAnaPato, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 3)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 3).code },
                            { "idPuntoCarga": 11, "idReceta": datos.lrcBancoS, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 11)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 11).code },
                            { "idPuntoCarga": 20, "idReceta": datos.lrcEcoGene, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 20)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 20).code },
                            { "idPuntoCarga": 23, "idReceta": datos.lrcEcoObst, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 23)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 23).code },
                            { "idPuntoCarga": 24, "idReceta": datos.lrcEcoObstProc, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 24)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 24).code },

                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmacia, "code": obtenerCodePorIdReceta(datos.lrcFarmacia), esRecetaAntimicrobiano: 0 },
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmaciaAntimicrobiano, "code": obtenerCodePorIdReceta(datos.lrcFarmaciaAntimicrobiano), esRecetaAntimicrobiano: 1 },
                            { "idPuntoCarga": 5, "idReceta": datos.lrcFarmaciaIntervencionSanitaria, "code": obtenerCodePorIdReceta(datos.lrcFarmaciaIntervencionSanitaria), esRecetaIntervencionSanitaria: 1 },

                            { "idPuntoCarga": 22, "idReceta": datos.lrcTomografia, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 22)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 22).code },
                            { "idPuntoCarga": 12, "idReceta": datos.lrcInterconsulta, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 12)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 12).code },
                            { "idPuntoCarga": 1060, "idReceta": datos.lrcSolicitudCQx, "code": isEmpty(objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 1060)) ? '' : objRecetas.find(({ idPuntoCarga }) => idPuntoCarga == 1060).code }
                        ];

                        resp = recetas;
                    }

                    alerta('1', 'Se  registro correctamente las recetas');
                    return resp;
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
    },

    async EliminarOrdenesMedicas(idReceta) {
        var midata = new FormData();
        midata.append('idReceta', idReceta);
        midata.append('idServicioGeneral', $('#hdIdTipoServicio').val());
        Cargando(1);
        await $.ajax({
            method: "POST",
            url: "/Receta/EliminaReceta?area=Comun",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                if (datos.session) {

                    if (datos.rpt) {
                        alerta2('succes', 'Receta', "Se elimino correctamente la receta");
                    }
                    else {
                        //alerta('3', datos.msj);
                        alerta2('danger', 'Receta', datos.msj);
                        return false;
                    }
                }
                else {
                    Cargando(0);
                    location.reload();
                }
            },
            error: function (msg) {
                Cargando(0);
                //alerta('3', "Error al eliminar receta");
                alerta2('danger', 'Receta', "Error al eliminar receta");
            }
        });

    },

    ModoVistaIndividual() {
        $("#TabListOrdenes").hide();
        $("#TabContentOrdenes").removeClass("col-xl-10");
        $("#TabContentOrdenes").addClass("col-xl-12");
    },

    ModoVistaMultiple() {
        $("#TabListOrdenes").show();
        $("#TabContentOrdenes").removeClass("col-xl-12");
        $("#TabContentOrdenes").addClass("col-xl-10");
    },

    /////////////////////////INICAR SCRIPT//////////////////////////////
    IniciarScript() {
        Ordenes.CargaInicial();
        Ordenes.plugins();
        //Ordenes.initDatablesCatalogo();
        Ordenes.initDatablesFarmacia();
        Ordenes.initDatablesFarmaciaAntimirobianos();
        Ordenes.initDatablesFarmaciaIntervencionSanitaria();
        Ordenes.initDatablesRayos();
        Ordenes.initDatablesEcoObs();
        Ordenes.initDatablesEcoObsProc();
        Ordenes.initDatablesEcoGeneral();
        Ordenes.initDatablesAnatomiaPatologica();
        Ordenes.initDatablesParologiaClinica();
        Ordenes.initDatablesBancoSangre();
        Ordenes.initDatablesTomografia();
        Ordenes.initDatablesPaquetes();
        Ordenes.initDatablesInterconsulta()
        //Ordenes.initDiagnosticosInterconsulta()                   //COMENTADO POR KHOYOSI ---- SE MOVIO LOS DAIGNOSTICOS EN LA PARTE SUPERIOR --------------
        Ordenes.initDiagnosticosOrdenesMedicas();

        Ordenes.initDatablesSolicitudCQx()

        Ordenes.InitDatableBusquedaDiagnostico()
        Ordenes.InitDatableDiagnostico()

        Ordenes.InitDataTableCondicionPaciente();

        Ordenes.eventos();
    },

    async IniciarData() {
        await Ordenes.ListarEspecialidades() // JDELGADO011
        await Ordenes.ListarCatalogoTotal();
        await Ordenes.listaFarmacias();
        await Ordenes.ListarDosis();
        await Ordenes.ListarVias();
        await Ordenes.ListarFrecuencias();  //KHOYOSi
        await Ordenes.ListarPrescriptores();  //KHOYOSi
        await Ordenes.ListarMedicos() // JDELGADO010
        await Ordenes.ListarTiposConsulta() // JDELGADO011
        await Ordenes.ListarM_ClaseIntervencionCQx() // JDELGADO011
        await Ordenes.ListarM_ClasificacionPacienteCQx() // JDELGADO011

        ////////////ANTIMICROBIANOS//////////////////////////
        await Ordenes.ListaMotivoSolicitud();
        await Ordenes.ListaCondicionSolicitud();
        await Ordenes.ListaMotivosRechazo();
        $("#frmSolicitudAntimicrobianos").hide();
        Ordenes.LimpiarCamposAntimicrobianos();
        ////////////////////////////////////////////////////

        /////////////INTERVENCION SANITARIA////////////////////
        await Ordenes.ListaCoordinadores();
        await Ordenes.ListaComponentes();
        //await Ordenes.ListaSubComponentes();
        await Ordenes.ListaDiagnosticosIntervencionSanitaria('');
        //////////////////////////////////////////////////////

    },

    async ValidarMedicamentoRecientePaciente(idPaciente, idProducto) {
        let data = new FormData();
        data.append('idPaciente', idPaciente);
        data.append('idProducto', idProducto);

        return HttpClient.Post('/Receta/ValidarMedicamentoRecientePaciente?area=Comun', data)
            .then(res => {
                if (!isEmpty(res) && res.session) {
                    return res;
                }

                return null;
            })
            .catch((e) => {
                console.log("ValidarMedicamentoRecientePaciente", e);
                return null;
            });
    },

    //PROA
    /*armarProaJson() {
        var proa = {
            sindromes: [],
            cultivos: []
        };

        $('.chk-sindrome').each(function () {
            proa.sindromes.push({
                id: $(this).data('id'),
                texto: $(this).data('texto'),
                marcado: $(this).is(':checked')
            });
        });

        $('.chk-cultivo').each(function () {
            var $fila = $(this).closest('tr');
            var fecha = $fila.find('.txt-fecha-cultivo').val();

            proa.cultivos.push({
                id: $(this).data('id'),
                texto: $(this).data('texto'),
                marcado: $(this).is(':checked'),
                fecha: fecha
            });
        });

        $('#hdProaJson').val(JSON.stringify(proa));
    },*/

    ObtenerProaAntimicrobiano() {
        let lista = [];

        $('.chk-sindrome:checked').each(function () {
            let item = parseInt($(this).data('id'));
            let descripcionOtro = null;

            if (item === 9) {
                descripcionOtro = $('#txtOtroSindrome').val().trim();
            }

            lista.push({
                tipoRegistro: 'S',
                item: item,
                fechaCultivo: null,
                descripcionOtro: isEmpty(descripcionOtro) ? null : descripcionOtro
            });
        });

        $('.chk-cultivo:checked').each(function () {
            let item = parseInt($(this).data('id'));
            let fecha = $(this).closest('tr').find('.txt-fecha-cultivo').val();
            let descripcionOtro = null;

            if (item === 8) {
                descripcionOtro = $('#txtOtroCultivo').val().trim();
            }

            lista.push({
                tipoRegistro: 'C',
                item: item,
                fechaCultivo: isEmpty(fecha) ? null : fecha,
                descripcionOtro: isEmpty(descripcionOtro) ? null : descripcionOtro
            });
        });

        return JSON.stringify(lista);
    },

    ValidarProaAntimicrobiano() {

        if ($('.chk-sindrome[data-id="9"]').is(':checked') && isEmpty($('#txtOtroSindrome').val().trim())) {
            alerta(2, 'Debe especificar el otro síndrome.');
            $('#txtOtroSindrome').focus();
            return false;
        }

        if ($('.chk-cultivo[data-id="8"]').is(':checked') && isEmpty($('#txtOtroCultivo').val().trim())) {
            alerta(2, 'Debe especificar el otro cultivo.');
            $('#txtOtroCultivo').focus();
            return false;
        }

        let valido = true;

        $('.chk-cultivo:checked').each(function () {
            let $fila = $(this).closest('tr');
            let $fecha = $fila.find('.txt-fecha-cultivo');
            let fecha = ($fecha.val() || '').trim();

            if (isEmpty(fecha) || isNaN(new Date(fecha).getTime())) {
                alerta(2, 'Debe seleccionar una fecha válida para cada cultivo marcado.');
                $fecha.focus();
                valido = false;
                return false;
            }
        });

        if (!valido) {
            return false;
        }

        return true;
    },

    async SeleccionarProaAntimicrobiano(idReceta) {
        let data = new FormData();
        let datos;

        data.append('idReceta', idReceta);

        try {
            datos = await $.ajax({
                method: "POST",
                url: "/Receta/ListarRecetaFarmaciaAntimicrobianoPROA?area=Comun",
                data: data,
                dataType: "json",
                cache: false,
                processData: false,
                contentType: false,
            });

            // limpiar antes de cargar
            $('.chk-sindrome, .chk-cultivo').prop('checked', false);
            $('.txt-fecha-cultivo').val('').prop('disabled', true);
            $('#txtOtroSindrome').val('').hide();
            $('#txtOtroCultivo').val('').hide();

            if (!isEmpty(datos.table)) {
                $(datos.table).each(function (i, obj) {

                    if (obj.tipoRegistro == 'S') {
                        $('.chk-sindrome[data-id="' + obj.item + '"]').prop('checked', true);

                        if (parseInt(obj.item) === 9 && !isEmpty(obj.descripcionOtro)) {
                            $('#txtOtroSindrome').val(obj.descripcionOtro).show();
                        }
                    }

                    if (obj.tipoRegistro == 'C') {
                        let $chk = $('.chk-cultivo[data-id="' + obj.item + '"]');
                        let $fila = $chk.closest('tr');
                        let $fecha = $fila.find('.txt-fecha-cultivo');

                        $chk.prop('checked', true);
                        $fecha.prop('disabled', false);

                        if (!isEmpty(obj.fechaCultivo)) {
                            let fecha = obj.fechaCultivo.toString().substring(0, 10);
                            $fecha.val(fecha);
                        }

                        if (parseInt(obj.item) === 8 && !isEmpty(obj.descripcionOtro)) {
                            $('#txtOtroCultivo').val(obj.descripcionOtro).show();
                        }
                    }
                });
            }

        } catch (error) {
            alerta(3, error);
        }
    },    

};




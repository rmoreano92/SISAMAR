/*var listaDxRefCon = [{}];
var tratamientoRefCon = '';
var moduloActualRefCon = '';*/
var idPacienteGlobal = 0;


var AdmisionEmergencia = {

    CargaInicial() {
        //Referencias.limpiar();

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        $('#txtFechaAtencionBuscar').val(fechaP);

        /*$("#cboTipoConsulta").attr('disabled', 'disabled');
        $("#cboTipoConsulta").trigger("chosen:updated");
        $("#ceAtencion-tab").css("pointer-events", "none");*/

        $('.modalRefCon').modal({ backdrop: 'static', keyboard: false });
        $('.modalRefCon').modal('hide');

        //EstablecimientosSaludTodos();
        //ListaDepartamentos();
               
    },

    
    plugins() {


        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: false });
        $(".chzn-select-deselect,#select2_sample").chosen();
        $('.chzn-select').chosen().trigger("chosen:updated");
       
        $('#txtFinEmb,#txtFechaAtencion,#txtFechaAtencionBuscar,#txtFUM,#txtFPP,#txtFEcog,#txtFechaControl,#txtFPPControl,#txtProximaConsulta').datepicker({ // se agrego txtProximaConsulta RQ0002
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"

        });

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#HoraInicioAtencion").mask("Hn:Nn");
        

    },


    /*=============================================ADMISIÓN EMERGENCIA======================================*/    
    Eventos() {

        $('.search').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                $('.search').blur();
                $("#btnBuscarAtencionesEmergencia").click();
            }
        });

        /*================================ADMISION EMERGENCIA=====================================*/
        $('#tblAtencionEmer tbody').on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_atencionesEmer.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }

            var pos = oTable_atencionesEmer.api(true).row($(this)).index();
            var row = oTable_atencionesEmer.fnGetData(pos);
            
        });
        /*===================================================================================*/
        

        /*============================ADMISION EMRGENCIAS==============================*/

        $('#btnBuscarAtencionesEmergencia').on('click', function () {
            //$('#lblMedicoProgramado').html('');
            if ($('#txtFechaAtencionBuscar').val() == "") {
                alerta('2', 'Ingrese la fecha de ingreso');
                return false;
            }
            else {
                //$('#lblMedicoProgramado').html("Medico: " + $('#cboConsultorio>option:selected').attr("med"))
                AdmisionEmergencia.ListarAtenciones();
            }
            ReposicionarVista();
        });

        ///////////////////////////EVENTOS IMPRIMIR INFORME///////////////////////////////////
        $('#tblAtencionEmer tbody').on('click', '.ImprimirEvalNeoEmerSinF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'NEOE-1');

            if (typeof firma === 'undefined') {
                alerta('2', 'El documento no esta generado, se procedera a generar el documento.')
                const pdf = await Utilitario.GenerarHojaEvaluacionNeonatal(row.idCuentaAtencion, row.idAtencion, row.idServicioEgreso, 1);
                if (pdf) {
                    alerta('1', 'Se generó el documento correctamente.')
                    $("#btnBuscarAtenciones").click();
                } else {
                    alerta('2', 'El documento no ha podido ser generado por falta de información. Por favor modifique y guarde la atención nuevamente.')
                }
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
        });

        $('#tblAtencionEmer tbody').on('click', '.ImprimirEvalNeoEmerConF', async function () {
            var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
            var row = oTable_atencionesEmer.fnGetData(objrow);

            const firma = await Utilitario.SeleccionarFirmaDigital(row.idCuentaAtencion, row.idCuentaAtencion, 'NEOE-1')               //KHOYOSI
            imprimirDocumentoConFirma(firma.idCuentaAtencion, firma.code, firma.idDoc, firma.tipo);
            //imprimirDocumentoConFirma(row.idCuentaAtencion, row.code, row.idDoc, row.tipo);            
        });
        //$('#tblAtencionEmer tbody').on('click', '.ImprimirEvaEmerSF', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atencionesEmer.fnGetData(objrow);
           
        //    ImprimirEvaEmerSF(row.rutaArchivo)


        //});
        //$('#tblAtencionEmer tbody').on('click', '.ImprimirEvaEmerCF', function () {
        //    var objrow = oTable_atencionesEmer.api(true).row($(this).parents("tr")[0]).index();
        //    var row = oTable_atencionesEmer.fnGetData(objrow);
        //    tipoDoc = '';
        //    if (row.idReferencia > 0) {
        //        tipoDoc = 'RF';
        //    }
        //    if (row.idContraReferencia > 0) {
        //        tipoDoc = 'CRF';
        //    }
        //    ImprimirEvaEmerCF(row.idCuentaAtencion, row.idRegistroRefCon, row.codeRefCon, "", tipoDoc)
        //});
        //////////////////////////////////////////////////////////////////////////////////////
        /*============================================================================*/

        

        $('#cboServicioDestinoCR').on('change', function () {
            //$('#lblMedicoProgramado').html("")
            $('#txtServContraRefCR').val($('#cboServicioDestinoCR_chosen span').html())
            //console.log("Seleccionadnooo");
        });

        $('#FechaInicioAtencion').on('keydown', function () {
            return false;
        });

        ////////////////MODIFFICAR EVALUACION///////////////////////
        $("#btnModificarAtenciones").on('click', async function () {
            
            MostrarAreaRegistro();
        });

    },

    LimpiarModal() {
        //$('.campo').val("");
        $("#modalEvaluacionNeonatal input").val("");
        $("#modalEvaluacionNeonatal textarea").val("");
        //$("#modalRef select").html("");
        $('#modalEvaluacionNeonatal .chzn-select').chosen().trigger("chosen:updated");

        $("#modalEvaluacionNeonatal input").val("");
        $("#modalEvaluacionNeonatal textarea").val("");
        // $("#modalConRef select").html("");
        $('#modalEvaluacionNeonatal .chzn-select').chosen().trigger("chosen:updated");
    },

    DeshabilitarModal() {
        $(".campo").attr('disabled', 'disabled');
    },

    HabilitarModal() {
        $(".campo").removeAttr('disabled', 'disabled');
    },

    AbrirModal() {
        $('#modalEvaluacionNeonatal').modal('show');
    },
    /*
    CerrarModal() {
        $('.modalRefCon').modal('hide');
    },

    ConsultarRefCon() {
        //console.log("ENTROOOOO");    
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        this.LimpiarModal();
        this.DeshabilitarModal();
        this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardar").hide();
    },

    ModificarRefCon() {
        //console.log("ENTROOOOO");       
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        console.log(objrowTb);
        this.LimpiarModal();
        this.HabilitarModal();
        this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);
        $("#btnGuardar").show();
    },
    */
    /*===================================ADMISION EMERGENCIA==========================*/
    async Accion(tipo) {
        $("#modulo").html("");
        opcionModificar = false;
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();

        if (isEmpty(objrowTb)) {
            alerta(2, 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta(2, 'La cuenta esta cerrada.');
            if (tipo == 'M') {
                return false;
            }
        }

        if (objrowTb.fechaEgreso != '' && objrowTb.fechaEgreso != null) {
            alerta(2, 'El paciente tiene alta médica.');
            if (tipo == 'M') {
                return false;
            }
        }

        if (tipo != 'A') {
            if (objrowTb.idServicioIngreso == 6) {
                if (objrowTb.tipoPaciente == "Neonatologia") {
                    Cargando(1);
                    Variables.Cargar(objrowTb);
                    await this.CargarModulo('neonatal');
                    await EvaluacionNeonatal.IniciarScript();

                    BusquedaDiagnosticos.IniciarScript();
                    /////////////DIAGNOSTICOS//////////////
                    Diagnosticos.PanelDx = '#PanelDiagnostico ';
                    Diagnosticos.IniciarScript();
                    ///////////////////////////////////////
                    ConsumoServicio.IniciarScript();
                    Ordenes.IniciarScript();
                    Cargando(0);
                    if (tipo == 'C') { EvaluacionNeonatal.ConsultarEvaluacionNeonatal(); }
                    if (tipo == 'M') { EvaluacionNeonatal.ModificarEvaluacionNeonatal(); }
                } else {
                    alerta(2, 'El paciente no es Neonato.');
                    return false;
                }
            } else {
                Cargando(1);
                Variables.Cargar(objrowTb);
                await this.CargarModulo('emergencia');
                await EvaluacionEmergencia.IniciarScript();

                BusquedaDiagnosticos.IniciarScript();
                /////////////DIAGNOSTICOS//////////////
                Diagnosticos.PanelDx = '#PanelDiagnostico ';
                Diagnosticos.IniciarScript();
                ///////////////////////////////////////
                ConsumoServicio.IniciarScript();
                Ordenes.IniciarScript();
                Cargando(0);
                if (tipo == 'C') { EvaluacionEmergencia.ConsultarEvaluacionNeonatal(); }
                if (tipo == 'M') { EvaluacionEmergencia.ModificarEvaluacionNeonatal(); }
            }
            
        }

        if (tipo == 'A') {          //TIPO ALTA MEDICA
            Cargando(1);
            Variables.Cargar(objrowTb);
            await Utilitario.CargarModuloAlta();
            await AltaMedica.IniciarScript();
            await AltaMedica.ModificarAltaMedica();                        
            Cargando(0);
        }        
    },
    
    ModificarEvaluacion() {
        //console.log("ENTROOOOO");       
        var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        //console.log(objrowTb);
        this.LimpiarModal();
        this.HabilitarModal();
        this.AbrirModal();
        //this.CargarData(objrowTb.idCuentaAtencion, objrowTb.idAtencion, objrowTb.tipoRef);

        $("#btnGuardar").show();
    },
    ListarAtenciones(filtro) {
        Cargando(1);
        //console.log("F1");
        oTable_atencionesEmer.fnClearTable();
        var midata = new FormData();
        var fechaFin = $('#txtFechaAtencionFinBuscar').val(); // JDELGADOPM
        if ($('#txtNroCuentaBuscar').val() != '' || $('#txtNroDniBuscar').val() != '' || $('#txtNroHistoriaBuscar').val() != '' || $('#txtApPaternoBuscar').val() != '') {
            fecha = '';
            fechaFin = ''; // JDELGADOPM
        }

        midata.append('idCuenta', $('#txtNroCuentaBuscar').val());
        midata.append('dni', $('#txtNroDniBuscar').val());
        midata.append('historia', $('#txtNroHistoriaBuscar').val());
        midata.append('apPaterno', $('#txtApPaternoBuscar').val());
        midata.append('fecha', fecha);

        midata.append('idServicio', $('#cboServicioEmergenciaBuscar').val());
        var dataAtenciones = {};

        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/BuscarAtencionesEmergenciaPorFiltro?area=Emergencia",
            //contentType: "application/json; charset=utf-8",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            //async: false,
            success: function (datos) {
                Cargando(0);
                //console.log(datos.lsAtenciones.table)
                if (datos.session) {
                    if (datos.lsAtenciones.table.length > 0) {
                        dataAtenciones = datos.lsAtenciones.table;
                        oTable_atencionesEmer.fnAddData(dataAtenciones);
                    }
                    else {
                        dataAtenciones = {};
                    }

                }
                else {
                    alert("La sesion ya expiro se volvera a recargar la pagina")
                    location.reload();
                }
            }
        })
    },
    ///////////////KHOYOSI/////////////////////////////////////////////
    ObtenerIdUsuarioSesion() {
        var idUser = 0;
        $.ajax({
            method: "POST",
            url: "/Utilitario/ObtenerIdUsuarioLogeado?area=Comun",
            //data: midata,
            //dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                idUser = datos;
            },
            error: function (msg) {
                alerta("ERROR", "Error aal obtener Id del Medico!", "2");
            }
        });

        return idUser;
    },
    /////////////////////////////////////////////////////////////////////



    /*===============================SECCION ADMISION EMERGENCIA==============================================*/
    ListarServiciosAdmisionEmergencia() {
        var midata = new FormData();
        midata.append('filtro', ' (2,4) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/AdmisionEmergencia/DevuelveServiciosDelHospitalFiltro?area=Emergencia",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                //console.log(datos.lsServicios)
                Cargando(0);
                $('#cboServicioEmergenciaBuscar').empty();
                $(datos.lsServicios.table).each(function (i, obj) {
                    $('#cboServicioEmergenciaBuscar').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });

                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    //                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });
    },
       

    async CargarModulo(modulo) {
        var midata = new FormData();
        midata.append('modulo', modulo);
        $("#ModuloAlta").html("");
        $("#modulo").html("");

        let datos;
        try {
            datos = await
            $.ajax({
                method: "POST",
                url: "/AdmisionEmergencia/CargarModulo?area=Emergencia",
                data: midata,
                dataType: "HTML",
                cache: false,
                processData: false,
                contentType: false,
            });

            $("#modulo").html(datos);
            //console.log(datos);
        } catch (error) {
            //console.error(error)
            alerta(3, JSON.stringify(error));
        }
    },

    CerrarModulo() {
        $("#modulo").html("");
    },
    /*===========================================================================================================*/

     

    ///////////////////////////////////ADMISION EMERGENCIA////////////////////////////////////////
    BuscaAtencionesCptCEparaFormatoHIS(idCuentaAtencion) {
        var midata = new FormData();
        midata.append('idCuentaAtencion', idCuentaAtencion);
        Cargando(1)
        oTable_consumoServAtencion.fnClearTable();
        $.ajax({
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
                        oTable_consumoServAtencion.fnAddData(datos.listaCpt.table);
                    }
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

        oTable_consumoServAtencion.resize();
    },

    //////////////ADMISION EMERGENCIA////////////////////
    limpiarRecetas() {
        idRecetaRX = 0;
        idRecetaPatCli = 0;
        idRecetaAnatPat = 0;
        idRecetaBs = 0;
        idRecetaEcoGene = 0;
        idRecetaEcoObs = 0;
        idRecetaFarm = 0;


        $("#ifrmRecetaFarm").contents().find("body").html('');
        $("#ifrmRecetaRx").contents().find("body").html('');
        $("#ifrmRecetaEcoObs").contents().find("body").html('');
        $("#ifrmRecetaEcoGene").contents().find("body").html('');
        $("#ifrmRecetaAnaPatolg").contents().find("body").html('');
        $("#ifrmRecetaPatoClini").contents().find("body").html('');
        $("#ifrmRecetaBs").contents().find("body").html('');

    },
    ///////////////////////////////////////////////////////

    initDatables() {
        var parms = {
            "paging": true,
            "ordering": false,
            "info": false,
            "searching": false,
            "scrollX": true,
            "ordering": true,
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
                    width: '10%',
                    targets: 1,
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 2,
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 3,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html((rowData.primerNombre == null ? '' : rowData.primerNombre.toUpperCase()) + " " + (rowData.segundoNombre == null ? '' : rowData.segundoNombre.toUpperCase()));
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
                    width: '5%',
                    targets: 5,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(FormatearFecha(rowData.fecNacim));
                    }
                },
                {
                    width: '10%',
                    targets: 6,
                    data: "tipoPaciente",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 7,
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 8,
                    data: "horaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '10%',
                    targets: 9,
                    data: "servicioActual",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 10,
                    data: "plan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                    }
                },
                {
                    width: '5%',
                    targets: 11,
                    data: "cantEvaluacion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center')

                    }
                },
                {
                    width: '10%',
                    targets: 12,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).css('text-align', 'center')
                        if (!isEmpty(rowData.id) && rowData.id>0) {
                            var btnRuta = "";
                            var btnImprime = "";
                            var btnImprimeSinF = "";

                            btnImprimeSinF = '<button class="ImprimirEvalNeoEmerSinF btn btn-sm btn-warning glow_button" title="Visualiza Atencion" data-toggle="tooltip"><i class="fa fa-eye"></i> </button>';

                             /*SE COMENTO PORQUE SOLO PERMITIRA FIRMAR DESDE EL MODULO DEL DETALLE DE LA EVALUACION*/
                            if (rowData.statusFirma == 0) {
                                btnRuta = '<a href="' + rowData.ruta + '" class="btn btn-sm btn-danger" title="Firmar Atención" data-toggle="tooltip"> <i class="fa fa-pencil"></i></a>';
                            }
                            
                            if (rowData.statusFirma == 1 || rowData.statusFirma == 0) {
                                btnImprime = ' <button class="ImprimirEvalNeoEmerConF btn btn-sm btn-success glow_button" title="Imprime Atención Firmada" data-toggle="tooltip"><i class="fa fa-print"></i> </button>';

                                btnRuta = "";
                            }

                            $(td).html(btnRuta + " " + btnImprime + " " + btnImprimeSinF);
                        }
                        else {
                            $(td).html('');
                        }

                        if (!isEmpty(rowData.fechaRegistroEvaluacion)) {
                            $(td).parent().css('color', '#347dff');
                            $(td).parent().css('font-weight', 'bold');
                        }

                    }
                }


            ]

        }

        var tableWrapper = $('#tblAtencionEmer'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        //tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown
        oTable_atencionesEmer = $("#tblAtencionEmer").dataTable(parms);


    },



    /*=========================KHOYOSI========================*/
    ImprimirEvaEmerSF(rutaArchivo) {
        $('#ifrmReporte').attr('src', rutaArchivo);
        var myIframe = document.getElementById("ifrmReporte").contentWindow;
        myIframe.focus();
        myIframe.print();
    },
    ImprimirEvaEmerCF(idCuentaAtencion, idRegistro, code, idDoc, tipo) {
        //var objrow = oTable_atenciones.api(true).row('.selected').data();
        //var midata = new FormData();

        var url = "/Referencia/statusAndDownload?area=Comun&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idRegistro + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
        //$('#ifrmReporte').attr('src', url);

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", url);
        request.onload = function () {

            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = "REFCON-" + idCuentaAtencion + "-" + $.now()
            a.click();

            ListaAtencionesCE();
        }
        request.send();
    }
    /*========================================================*/
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

}

//////////////////////KHOYOSI////////////////////////////////
var imprimirDocumentoConFirma = async function (idCuentaAtencion, code, idDoc, tipo) {
    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {

        if (this.response.size > 0) {
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = "EMERNEOEVA-" + idCuentaAtencion + "-" + $.now()

            AbrirVisorDocumento(url, 1);
            AdmisionEmergencia.ListarAtenciones();
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);               
    }
    request.send();
}

var imprimirDocumentoConFirma2 = function (idCuentaAtencion, code, idDoc, tipo) {
    //var objrow = oTable_atenciones.api(true).row('.selected').data();
    //var midata = new FormData();
    Cargando(1);
    var url = "/Atencion/statusAndDownload?area=ConsultaExterna&idCuentaAtencion=" + idCuentaAtencion + "&idRegistro=" + idCuentaAtencion + "&code=" + code + "&documentId=" + idDoc + "&tipo=" + tipo;
    //$('#ifrmReporte').attr('src', url);

    var request = new XMLHttpRequest();
    request.responseType = "blob";
    request.open("GET", url);
    request.onload = function () {

        if (this.response.size > 0) {
            var url = window.URL.createObjectURL(this.response);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = url;
            //a.download = this.response.name || "CE-" + $.now()
            a.download = "EMERNEOEVA-" + idCuentaAtencion + "-" + $.now()

            AbrirVisorDocumento(url, 1);            
        } else {
            alerta(2, "El documento aún no está firmado digitalmente.")
        }
        Cargando(0);
    }
    request.send();
}
//////////////////////////////////////////////////////////////////

//////////////ADMISION DE EMERGENCIA//////////////////////
function valida_hora(valor) {
    //que no existan elementos sin escribir
    if (valor.indexOf(":") != -1) {
        var hora = valor.split(":")[0];
        if (parseInt(hora) > 23) {
            $("#HoraInicioAtencion").val("");
            alerta(2, "Hora incorrecta");

        }//end if
    }//end if
}//end function

function asigna_FechaHoraAtencion(f) {
    //('#cboFechaInicioAtencion').empty();
    // cargo por defecto la hora
    var dt = new Date();
    var time = dt.getHours() + ":" + (dt.getMinutes() < 10 ? ("0" + dt.getMinutes()) : dt.getMinutes());
    //var date = ((dt.getDay() + 1) < 10 ? ("0" + (dt.getDay() + 1)) : (dt.getDay() + 1)) + "/" + ((dt.getMonth() + 1) < 10 ? ("0" + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) + "/" + dt.getFullYear();

    if (f == null) {
        var fecha = new Date();
        var fecha2 = new Date();
    } else {
        var fecha = new Date(f);
        var fecha2 = new Date(f);
    }

    
    var dia = fecha.getDate();
    var mes = parseInt(fecha.getMonth()) + 1;
    var yyy = fecha.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia
       
    $('#HoraInicioAtencion').val(time);
    $('#FechaInicioAtencion').val(fechaP);
    $('#FechaInicioAtencion').attr("max", fechaP);

    //$('#cboFechaInicioAtencion').append('<option  value="' + fechaP + '">' + fechaP + '</option>');

    
    fecha2.setDate(fecha.getDate() - 1);
    dia = fecha2.getDate();
    mes = parseInt(fecha2.getMonth()) + 1;
    yyy = fecha2.getFullYear();
    if (dia < 10)
        dia = '0' + dia; //agrega cero si el menor de 10
    if (mes < 10)
        mes = '0' + mes
    fechaP = yyy + "-" + mes + "-" + dia

    $('#FechaInicioAtencion').attr("min", fechaP);    
}

//function asigna_FechaAyerAtencion() {
//    var fecha = new Date();
//    fecha = fecha.setDate(fecha.getDate() - 1);
//    var dia = fecha.getDate();
//    var mes = parseInt(fecha.getMonth()) + 1;
//    var yyy = fecha.getFullYear();
//    if (dia < 10)
//        dia = '0' + dia; //agrega cero si el menor de 10
//    if (mes < 10)
//        mes = '0' + mes
//    fechaP = dia + "/" + mes + "/" + yyy

//    $('#FechaInicioAtencion').val(fechaP);
//}
//function asigna_FechaHoyAtencion() {
//    var fecha = new Date();
//    fecha = fecha.setDate(fecha.getDate());
//    var dia = fecha.getDate();
//    var mes = parseInt(fecha.getMonth()) + 1;
//    var yyy = fecha.getFullYear();
//    if (dia < 10)
//        dia = '0' + dia; //agrega cero si el menor de 10
//    if (mes < 10)
//        mes = '0' + mes
//    fechaP = dia + "/" + mes + "/" + yyy

//    $('#FechaInicioAtencion').val(fechaP);
//}
//////////////////////////////////////////////////////////

$(document).ready(function () {
    AdmisionEmergencia.CargaInicial();
    //AdmisionEmergencia.IniciarCombos();
    AdmisionEmergencia.plugins();

    AdmisionEmergencia.initDatables();
    

    AdmisionEmergencia.Eventos();
    //listaDestinosCE();
    //listaServicios();
    AdmisionEmergencia.ListarServiciosAdmisionEmergencia();

    //VisorReceta.Eventos();  
    EstablecimientosSalud.IniciarScript();
    

    $("#cboServicioEmergenciaBuscar").val(6);

    //InicializarComponentesConstanciaRn();

    //ListarHospitalizados();
    // Eventos();
    //$(".dataTables_scrollHeadInner .table").addClass("table-responsive");
    //$(".dataTables_wrapper .dt-buttons .btn").addClass('btn-secondary').removeClass('btn-default');

    //$('#cboServiciosAdmisionEmergencia_chosen').attr('style', 'width:' + $('#cboServiciosAdmisionEmergencia_chosen').parent().parent().width() + 'px !important');
    $('.chzn-select').chosen().trigger("chosen:updated");
});


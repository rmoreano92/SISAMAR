var AltaMedica = {

    mortalidad: false,
    infeccionIntraHosp: false,
    cierreControlPrenatal: false,
    idProCabecera: 0,
    limiteHorasEmer: 0,
    envioFuaLima: false,
    horaEstanciaMax: '',
    diasEstancia1: 0,
    diasEstancia2: 0,
    diasEstancia3: 0,
    //idEstadoFacturacion: 0,
    idMedicoSesion: 0,
    idTipoServicio: 0,
    idEspecialidad: 0,
    tipoServicio: '',
    accion: '',
    code: '',
    permisoRefCon: "",
    codeEpicrisis: '',

    async cargaInicial() {
        //nuevaEvalNeo = false;
        //modificaEvalNeo = false;
        AltaMedica.plugins();

        if (AltaMedica.tipoServicio == 'EMER') {
            await AltaMedica.ListarDestinosConsultorioEmergencia();
        } else if (AltaMedica.tipoServicio == 'HOSP' || AltaMedica.tipoServicio == 'UCI') {
            await AltaMedica.ListarDestinosHospitalizacion();
        }

        await AltaMedica.ListarTiposAlta();
        await AltaMedica.ListarCondicionAlta();
        await AltaMedica.ListarServiciosAdmisionEmergencia();
        await AltaMedica.ListarMedicos();
        await AltaMedica.ListarTiposReferencia();
        await AltaMedica.ListaEpisodiosAlta();

        const param = await Utilitario.SeleccionarParametro(324);
        AltaMedica.limiteHorasEmer = param.valorTexto;

        const param2 = await Utilitario.SeleccionarParametro(302);
        AltaMedica.envioFuaLima = param2.valorTexto;

        const param3 = await Utilitario.SeleccionarParametro(201);
        AltaMedica.horaEstanciaMax = param3.valorTexto;

        const param4 = await Utilitario.SeleccionarParametro(202);
        AltaMedica.diasEstancia1 = param4.valorTexto;

        const param5 = await Utilitario.SeleccionarParametro(203);
        AltaMedica.diasEstancia2 = param5.valorTexto;

        const param6 = await Utilitario.SeleccionarParametro(204);
        AltaMedica.diasEstancia3 = param6.valorTexto;

        //const param7 = await Utilitario.SeleccionarParametro(382);
        //AltaMedica.idEstadoFacturacion = param7.valorTexto;

        const permisosGenerales = await PermisoGeneral.SeleccionarPermisosGenerales();
        //console.log(permisosGenerales);
        if (!isEmpty(permisosGenerales)) {
            AltaMedica.permisoRefCon = permisosGenerales.table.find(item => item.codigo === 'REFCON').valorInt;
        }

        $('#btnRefCon').hide()
    },

    plugins() {

        var fecha = new Date();
        var dia = fecha.getDate();
        var mes = parseInt(fecha.getMonth()) + 1;
        var yyy = fecha.getFullYear();
        if (dia < 10)
            dia = '0' + dia; //agrega cero si el menor de 10
        if (mes < 10)
            mes = '0' + mes
        fechaP = dia + "/" + mes + "/" + yyy

        //$('#txtFechaAlta').val(fechaP);        

        $('#txtFechaAlta, #txtFechaIntervencionQuirurgicaAlta, #txtFechaInicioDescansoMedico, #txtFechaFinDescansoMedico').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $('#txtFechaAlta').datepicker("setDate", moment().toDate().format('dd/mm/yyyy'));

        var hora = fecha.getHours();
        var min = fecha.getMinutes();
        if (hora < 10)
            hora = '0' + hora;
        if (min < 10)
            min = '0' + min
        horaP = hora + ':' + min;
        $('#txtHoraAlta').val(horaP);

        $.mask.definitions['H'] = '[012]';
        $.mask.definitions['N'] = '[012345]';
        $.mask.definitions['n'] = '[0123456789]';
        $("#txtHoraAlta, #txtHoraIntervencionQuirurgicaAlta").mask("Hn:Nn");


        $.mask.definitions['D'] = '[0123]';
        $.mask.definitions['d'] = '[123456789]';
        $.mask.definitions['M'] = '[01]';
        $.mask.definitions['m'] = '[0123456789]';
        $.mask.definitions['a'] = '[12]';
        $.mask.definitions['b'] = '[0123456789]';
        $.mask.definitions['c'] = '[0123456789]';
        $.mask.definitions['d'] = '[0123456789]';

        $('#txtFechaAlta, #txtFechaIntervencionQuirurgicaAlta, #txtFechaInicioDescansoMedico, #txtFechaFinDescansoMedico').mask("Dd/Mm/abcd");

    },

    /*==================================INICIALIZAR TABLAS=======================================*/
    initDatables() {

    },

    InicializarComponentes() {
        visible = true;
        if (Diagnosticos.PanelDx == "#PanelComplicaciones ") {
            visible = false;
        }

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


        if ($("#tblDiagnosticoIngresoAlta").length != 0) {
            oTable_DiagnosticoIngresoAlta = $("#tblDiagnosticoIngresoAlta").dataTable(params);
        }



        //Cargando(0);
    },
    /*===================================================================================*/

    /*================================EVENTOS=====================================*/
    EventosInicial() {
        $('#btnAltaMedica').on('click', async function () {
            $("#ModuloAlta").html("");
            await AltaMedica.CargarAltaMedica();
            //AltaMedica.ListaEpisodiosAlta();
            //AltaMedica.AbrirModal(); 
            if (isEmpty($('#cboMedicoAlta').val()) && AltaMedica.idMedicoSesion != 0) {
                swal({
                    title: 'Alta Médica',
                    text: "El medico no puede realizar el alta debido a que no pertenece a esta especialidad",
                    type: 'warning',
                }).done();
                $('#modalAltaMedica').modal('hide')
            }
        });
    },

    Eventos() {
        $('#btnCerrarAltaMedica').on('click', function () {
            AltaMedica.CerrarModuloAlta();
        });

        $('#dxEgreso-tab-link').on('click', function () {
            Diagnosticos.PanelDx = '#PanelDiagnostico ';
        });

        $('#dxComplicacion-tab-link').on('click', function () {
            Diagnosticos.PanelDx = '#PanelComplicaciones ';
        });

        $('#dxNacimiento-tab-link').on('click', function () {
            Diagnosticos.PanelDx = '#PanelDiagnostico2 ';
        });

        $('#dxMortalidad-tab-link').on('click', function () {
            Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        });



        $('#cboDestinoAlta').on('change', function () {
            $('#cboTipoAlta').val(0);
            $('#cboCondicionAlta').val(0);
            AltaMedica.DeshabilitarReferencia();
            AltaMedica.DeshabilitarMortalidad();
            AltaMedica.mortalidad = false;

            if ($('#cboDestinoAlta').val() == 20 || $('#cboDestinoAlta').val() == 26 || $('#cboDestinoAlta').val() == 55 || $('#cboDestinoAlta').val() == 65 ||
                $('#cboDestinoAlta').val() == 30 || $('#cboDestinoAlta').val() == 34) {
                $('#cboTipoAlta').val(1);
                $('#cboCondicionAlta').val(2);
                AltaMedica.DeshabilitarReferencia();
                AltaMedica.DeshabilitarMortalidad();
                AltaMedica.mortalidad = false;
            }

            if ($('#cboDestinoAlta').val() == 21) {
                $('#cboTipoAlta').val(6);
                $('#cboCondicionAlta').val(2);
                AltaMedica.DeshabilitarReferencia();
                AltaMedica.DeshabilitarMortalidad();
                AltaMedica.mortalidad = false;
            }

            if ($('#cboDestinoAlta').val() == 23 || $('#cboDestinoAlta').val() == 24 || $('#cboDestinoAlta').val() == 31 || $('#cboDestinoAlta').val() == 32) {
                $('#cboTipoAlta').val(4);
                $('#cboCondicionAlta').val(2);
                AltaMedica.HabilitarReferencia();
                AltaMedica.DeshabilitarMortalidad();
                AltaMedica.mortalidad = false;
            }

            if ($('#cboDestinoAlta').val() == 25 || $('#cboDestinoAlta').val() == 33 || $('#cboDestinoAlta').val() == 35) {
                $('#cboTipoAlta').val(1);
                $('#cboCondicionAlta').val(4);
                AltaMedica.DeshabilitarReferencia();
                AltaMedica.HabilitarMortalidad();
                AltaMedica.mortalidad = true;
            }

            if ($('#cboDestinoAlta').val() == 56) {
                $('#cboTipoAlta').val(3);
                $('#cboCondicionAlta').val(2);
                AltaMedica.DeshabilitarReferencia();
                AltaMedica.DeshabilitarMortalidad();
                AltaMedica.mortalidad = false;
            }

            $("#CardRefCon").hide();
            if (AltaMedica.permisoRefCon == '1') {
                if ($("#cboDestinoAlta").val() == 23 || $("#cboDestinoAlta").val() == 24 || $("#cboDestinoAlta").val() == 31 || $("#cboDestinoAlta").val() == 32) {
                    Referencias.estadoGuardadoRefCon = false;           //asigna que no aun no se ha guardado la hoja de refcon, a causa de que se ha seleccionado un nuevo destino
                    $("#CardRefCon").show();
                    if ($("#cboDestinoAlta").val() == 23 || $("#cboDestinoAlta").val() == 31) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Referencia");
                        $('#TituloCardRefCon').html("Referencia");
                        $('#LabelNroRefConInterno').html("N° Referencia");
                    }
                    if ($("#cboDestinoAlta").val() == 24 || $("#cboDestinoAlta").val() == 32) {
                        $('#btnRefCon').html("<i class='fa-solid fa-file-plus mr-1'></i>" + " Contrareferencia");
                        $('#TituloCardRefCon').html("Contrareferencia");
                        $('#LabelNroRefConInterno').html("N° Contrareferencia");
                    }
                    $('#btnRefCon').show()
                } else {
                    $("#CardRefCon").hide();
                    Referencias.estadoGuardadoRefCon = true //asiga que se ha guardado la hoja de refcon, ya que el destino es diferente a las opciones de Referencia o Contrareferencia
                    $('#btnRefCon').hide()
                }
            }

            EstablecimientosSalud.LimpiarVariables();

            $('.chzn-select').chosen().trigger("chosen:updated");
        });


        $('#cboEpisodioAlta').on('change', function () {
            var fecha = null
            var episodio = 0
            var idAtencion = $("#cboEpisodioAlta option:selected").attr("atencion");
            episodio = $('#cboEpisodioAlta').val();
            $('#chkNuevoAlta').prop('checked', false);
            $('#chkCierreAlta').prop('checked', false);

            $(listaEpisodios.table).each(function (i, obj) {
                //console.log(obj.idEpisodio + '---' + episodio + '----' + obj.fechaCierre);

                if (obj.idEpisodio == episodio) {

                    if (isEmpty(obj.fechaCierre) || obj.fechaCierre == null || obj.fechaCierre == 'null') {
                        //$('#chkCierreAlta').prop('checked', false)
                    }
                    else {
                        $('#chkNuevoAlta').prop('checked', false);
                        $('#chkCierreAlta').prop('checked', false);

                        $('#cboEpisodioAlta').val(0);
                        alerta(2, "Solo podrá elegir EPISODIOS sin FECHA CIERRE.");
                        $('.chzn-select').chosen().trigger("chosen:updated");
                    }
                }

                //if (obj.idAtencion == idAtencion) {
                //    $('#chkNuevoAlta').prop('checked', true)
                //}
            });
        });

        $('#chkNuevoAlta').on('click', function () {
            $('#cboEpisodioAlta').val(0);
            $('.chzn-select').chosen().trigger("chosen:updated");
        });

        $('#chk_descansoMedico').on('change', function () {
            AltaMedica.ToggleControlesDescansoMedico($(this).is(':checked'));
        });

        $('#btnGuardarAltaMedica').on('click', async function () {
            Cargando(1);
            const alta = await AltaMedica.GuardarAltaMedica();
            if (alta) {
                AltaMedica.CerrarModuloAlta();
            }
            Cargando(0);
        });

        $('#btnEliminarAltaMedica').on('click', async function () {
            AltaMedica.AbrirModalRevertir();
        });

        $('#btnGuardarAltaMedicaRevertir').on('click', async function () {
            Cargando(1);
            const alta = await AltaMedica.EliminarAltaMedica();
            if (alta) {
                AltaMedica.CerrarModuloAlta();
                AltaMedica.CerrarModalRevertir();
                ReposicionarVista();
            }
            Cargando(0);
        });

        $('#btnCerrarAltaMedicaRevertir').on('click', async function () {
            AltaMedica.CerrarModalRevertir();
        });

        $('#btnEpicrisis').on('click', async function () {
            //var objrow = oTable_atenciones.api(true).row($(this).parents("tr")[0]).index();
            //var row = oTable_atenciones.fnGetData(objrow);

            Cargando(1);
            const firma = await Utilitario.SeleccionarFirmaDigitalV2(AltaMedica.codeEpicrisis)
            if (typeof firma === 'undefined') {
                alerta('2', 'La hoja de epicrisis no se generado, por favor guarde el alta médica para generar el documento.')
            } else {
                AbrirVisorDocumento(firma.rutaArchivo, 0);
            }
            Cargando(0);
        });


        $("#modalBusquedaDiagnostico").off().on("shown.bs.modal", function () {
            $(document).on("keydown", function (e) {
                let index = ObjtableBusquedaDiagnostico.api(true).row('.selected').index();
                let row = ObjtableBusquedaDiagnostico.fnGetData(index);
                console.log('index', index)
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (index !== undefined) {
                        ObjtableBusquedaDiagnostico.$('tr.selected').removeClass('selected');
                        let $nuevaFila = $($('#lstDiagnosticosBusqueda tbody tr')[index + 1]).addClass('selected')

                        AltaMedica.ajustarScroll($nuevaFila);
                    } else {
                        $($('#lstDiagnosticosBusqueda tbody tr')[0]).addClass('selected')
                    }
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (index !== undefined && index > 0) {
                        ObjtableBusquedaDiagnostico.$('tr.selected').removeClass('selected');
                        let $nuevaFila = $($('#lstDiagnosticosBusqueda tbody tr')[index - 1]).addClass('selected')

                        AltaMedica.ajustarScroll($nuevaFila);
                    }
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    let filaSeleccionada = ObjtableBusquedaDiagnostico.api(true).row('.selected').data();
                    if (filaSeleccionada) {
                        BusquedaDiagnosticos.AgregarDiagnosticoBusqueda(filaSeleccionada);
                    }
                }
            });
        });

        $("#modalBusquedaDiagnostico").on("hidden.bs.modal", function () {
            $(document).off("keydown");
        });

        $('#cboTipoDiagnostico').on('change', function (e) {
            if ($('#cboTipoDiagnostico').val() > 0) {
                $('#btnAñadirDiagnostico').focus()
            }

        })

        //$('#btnEstablecimientoDestinoRef').on('click', function () {
        //    EstablecimientosSalud.LimpiarBusquedaEstablecimiento();
        //    EstablecimientosSaludVar.opcionEst = 'DR';
        //    $('#modalEstablecimientosBuscar').modal('show')
        //});


    },

    ToggleControlesDescansoMedico(mostrar) {
        if (mostrar) {
            $('#rowDescansoMedico').show();
        } else {
            $('#rowDescansoMedico').hide();
            $('#txtFechaInicioDescansoMedico').val('');
            $('#txtFechaFinDescansoMedico').val('');
        }
    },

    HabilitarReferencia() {
        $('#btnEstablecimientoDestinoRef').show();
        $("#nroreferencia").attr("disabled", false);
    },

    DeshabilitarReferencia() {
        $('#btnEstablecimientoDestinoRef').hide();
        $("#nroreferencia").attr("disabled", true);
        $("#ipressdestino").val("");
        $("#destino").val("");
        $("#nroreferencia").val("");

        $("#ipressdestinoAlta").val("");
        $("#destinoAlta").val("");

    },

    HabilitarMortalidad() {
        $('#dxMortalidad-tab-link').show();
        //$('#chkNecropsia').prop('checked', false);
        //Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        //Diagnosticos.LimpiarDiagnosticosAtencion();
    },
    DeshabilitarMortalidad() {
        $('#dxMortalidad-tab-link').hide();
        //$('#chkNecropsia').prop('checked', false);
        //Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        //Diagnosticos.LimpiarDiagnosticosAtencion();
    },
    /*===================================================================================*/

    // Función para ajustar el scroll según la fila seleccionada
    ajustarScroll: function ($elemento) {
        let $contenedor = $("#lstDiagnosticosBusqueda").parent(); // Contenedor con scroll
        let posicionElemento = $elemento.position().top;
        let alturaContenedor = $contenedor.height();

        if (posicionElemento < 0 || posicionElemento > alturaContenedor - $elemento.height()) {
            $contenedor.scrollTop($contenedor.scrollTop() + posicionElemento - alturaContenedor / 2);
        }
    },

    /////////////////////////////////LLENAR COMBOS////////////////////////////////////////////////
    async ListarDestinosConsultorioEmergencia() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/ListaDestinosConsultorioEmergencia?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboDestinoAlta').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboDestinoAlta').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarDestinosHospitalizacion() {
        let datos;
        var midata = new FormData();
        midata.append('tipoServicio', 1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/ListaDestinosHospitalizacion?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboDestinoAlta').append('<option  value="' + obj.idDestinoAtencion + '">' + obj.descripcionLarga + '</option>');
                });
                $('#cboDestinoAlta').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposAlta() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/ListaTiposAlta?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboTipoAlta').append('<option  value="' + obj.idTipoAlta + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoAlta').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarCondicionAlta() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/ListaCondicionAlta?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboCondicionAlta').append('<option  value="' + obj.idCondicionAlta + '">' + obj.descripcion + '</option>');
                });
                $('#cboCondicionAlta').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarServiciosAdmisionEmergencia() {
        var midata = new FormData();
        let datos;
        if (AltaMedica.tipoServicio == 'HOSP' || AltaMedica.tipoServicio == 'UCI') {
            midata.append('filtro', ' (3) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
        } else if (AltaMedica.tipoServicio == 'EMER') {
            midata.append('filtro', ' (2,4) ORDER BY dbo.TiposServicio.Descripcion,dbo.Servicios.Nombre');
        }

        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AdmisionEmergencia/DevuelveServiciosDelHospitalFiltro?area=Emergencia",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboServicioAlta').empty();
                $(datos.lsServicios.table).each(function (i, obj) {
                    $('#cboServicioAlta').append('<option value="' + obj.idServicio + '">' + obj.dservicioHosp + '</option>');
                });
                $('#cboServicioAlta').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarMedicos() {
        var midata = new FormData();
        let datos;
        midata.append('idEspecialidad', AltaMedica.idEspecialidad);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarMedicosPorFiltro?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboMedicoAlta').empty();
                $('#cboMedicoIntervencionQuirurgicaAlta').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboMedicoAlta').append('<option data-MedicoNombre="' + obj.medicoNombre + '" data-TipoEmpleado="' + obj.tipoEmpleado + '"  data-Colegio="' + obj.colegio + '"  data-Empleado="' + obj.idEmpleado + '" value="' + obj.idMedico + '">' + obj.apellidoPaterno + ' ' + obj.apellidoMaterno + ' ' + obj.nombres + '</option>');
                    $('#cboMedicoIntervencionQuirurgicaAlta').append('<option data-MedicoNombre="' + obj.medicoNombre + '" data-TipoEmpleado="' + obj.tipoEmpleado + '"  data-Colegio="' + obj.colegio + '"  data-Empleado="' + obj.idEmpleado + '" value="' + obj.idMedico + '">' + obj.apellidoPaterno + ' ' + obj.apellidoMaterno + ' ' + obj.nombres + '</option>');
                });
                $('#cboMedicoAlta').val(0);
                $('#cboMedicoIntervencionQuirurgicaAlta').val(0);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarTiposReferencia() {
        let datos;
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/ListaTiposReferencia?area=Comun",
                    //data: data,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                $('#cboTipoReferenciaAlta').empty();
                $(datos.lsResultado.table).each(function (i, obj) {
                    $('#cboTipoReferenciaAlta').append('<option  value="' + obj.idTipoReferencia + '">' + obj.descripcion + '</option>');
                });
                $('#cboTipoReferenciaAlta').val(0);

                $('.chzn-select').chosen().trigger("chosen:updated");
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListaEpisodiosAlta() {
        var midata = new FormData();
        let datos;
        midata.append('idPaciente', Variables.IdPaciente);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Atencion/ListaEpisodiosByAtencion?area=ConsultaExterna",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            var nroEpisodio = 0;
            var fecha = null;
            var control = false;
            $('#cboEpisodioAlta').empty();
            $('#cboEpisodioAlta').append('<option  value="0">-Seleccione-</option>');

            $(datos.table).each(function (i, obj) {
                $('#cboEpisodioAlta').append('<option atencion="' + obj.idAtencion + '" value="' + obj.idEpisodio + '"> N°. ' + obj.idEpisodio + ' -  Fech. Apertura: ' + obj.fechaApertura +
                    ' -  Diagnostico: ' + obj.diagnosticoWeb +
                    ' -  FechaCierre: ' + obj.fechaCierre +
                    ' -  Servicio ' + obj.servicioGeneralweb + '</option>');

                //if (obj.idAtencion == $('#idAtencion').val()) {
                if (obj.idAtencion == Variables.IdAtencion && control == false) {
                    nroEpisodio = obj.idEpisodio;
                    $('#chkNuevo').prop('checked', true)
                    fecha = obj.fechaCierre;
                    control = true;
                }

            });

            if (isEmpty(fecha)) {
                $('#chkCierreAlta').prop('checked', false)
            }
            else {
                $('#chkCierreAlta').prop('checked', true)
            }
            $('#cboEpisodioAlta').val(nroEpisodio);
            $('.chzn-select').chosen().trigger("chosen:updated");
            listaEpisodios = datos
        } catch (error) {
            alerta(3, error);
        }
    },

    async ListarAtencionAltaMedica(idAtencion) {
        var midata = new FormData();
        var resultado = [];
        let datos;
        midata.append('idAtencion', idAtencion);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/SeleccionarAtencionAtencionDatosAdicionalesPaciente?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                resultado = datos.lsResultado.table[0];
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resultado;
    },

    async SeleccionarCierreControlPrenatal(idAtencion) {
        var midata = new FormData();
        var resultado = [];
        let datos;
        midata.append('idAtencion', idAtencion);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/SeleccionarCierreControlPrenatal?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            if (datos.session) {
                resultado = datos.lsResultado.table[0];
            }
            else {
                Cargando(0);
                alert("La sesion ya expiro se volvera a recargar la pagina")
                location.reload();
            }
        } catch (error) {
            alerta(3, error);
        }

        return resultado;
    },

    async SeleccionarDiagnosticos(idAtencion, clasiDiagnostico) {
        var respuesta;
        var resp = false;
        let datos;
        var data = new FormData();

        Diagnosticos.LimpiarDiagnosticosAtencion();

        data.append('idAtencion', idAtencion);
        data.append('clasificacionDiagnostico', clasiDiagnostico);

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

            if (datos.table.length !== 0) {
                if (!isEmpty(datos.table)) {

                    if (typeof oTable_DiagnosticoIngresoAlta !== 'undefined') {
                        oTable_DiagnosticoIngresoAlta.fnAddData(datos.table); // VERIFICANDO AGREGANDO PARA INTERCONSULTA JDELGADOM                
                    } else {

                    }
                }
            }
            //else {
            //    Cargando(0)
            //}
            resp = true;
        } catch (error) {
            //console.error(error)
            resp = false;
            alerta(3, error);
        }

        //return datos;
        return resp;
    },
    //////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////CARGAR DATOS A LA PANTALLA///////////////////////////////////

    async CargarAltaMedica() {
        $("#modalClap").html("");
        //var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        if (AltaMedica.tipoServicio == 'EMER') {
            var objrowTb = oTable_atencionesEmer.api(true).row('.selected').data();
        }

        if (AltaMedica.tipoServicio == 'HOSP') {
            var objrowTb = oTable_atencionesHosp.api(true).row('.selected').data();
        }

        if (AltaMedica.tipoServicio == 'UCI') {
            var objrowTb = oTable_AtencionesUCI.api(true).row('.selected').data();
        }

        if (isEmpty(objrowTb)) {
            alerta2('info', '', 'Seleccione un registro por favor.');
            return false;
        }

        if (objrowTb.idEstadoAtencion == 2) {
            alerta2('info', '', 'La cuenta se encuentra cerrada.');
            if (AltaMedica.tipoServicio == 'EMER' || AltaMedica.tipoServicio == 'UCI') {
                AltaMedica.accion = 'C';
            }

            if (AltaMedica.tipoServicio == 'HOSP') {
                AltaMedica.accion = 'M';
            }
        } else if (!isEmpty(objrowTb.fechaEgreso)) {
            alerta2('info', '', 'El paciente tiene alta médica.');
            AltaMedica.accion = 'M';
        }

        if (objrowTb.llegoAlServicio == 0) {
            if (AltaMedica.tipoServicio == 'EMER') {
                //if (isEmpty(objrowTb.idCamaIngreso)) {
                //    alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
                //    return false;
                //}

                if (objrowTb.esObservacionEmergencia) {
                    alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
                    return false;
                }
            } else {
                if (isEmpty(objrowTb.idCamaIngreso)) {
                    alerta2('warning', '', 'El paciente aún no se le asignado cama de ingreso.<br>Por favor realice la recepción.');
                    return false;
                }

                alerta2('warning', '', 'El paciente aún no llega al servicio.<br>Por favor realice la recepción.');
                return false;
            }
        }

        Variables.Cargar(objrowTb);
        AltaMedica.idEspecialidad = objrowTb.idEspecialidad;
        await Utilitario.CargarModuloAlta();
        await AltaMedica.IniciarScript();
        //await AltaMedica.ModificarAltaMedica(objrowTb);

        //console.log(objrowTb);
        if (AltaMedica.accion == 'M') {
            $("#btnEliminarAltaMedica").show();
            $("#btnGuardarAltaMedica").show();
            $("#btnEpicrisis").show();
        } else if (AltaMedica.accion == 'C') {
            $("#btnEliminarAltaMedica").hide();
            $("#btnGuardarAltaMedica").hide();
            $("#btnEpicrisis").hide();
        }

        $("#txtNroCuentaAltaMedica").val(objrowTb.idCuentaAtencion);
        $("#txtHistoriaAltaMedica").val(objrowTb.nroHistoriaClinica);
        $("#txtPacienteNombreAltaMedica").val((objrowTb.primerNombre == null ? '' : objrowTb.primerNombre) + ' ' + (objrowTb.segundoNombre == null ? '' : objrowTb.segundoNombre) + ' ' + objrowTb.apellidoPaterno + ' ' + objrowTb.apellidoMaterno);
        $("#txtTipoDocumentoAltaMedica").val(objrowTb.tipoDocumento);
        $("#txtNroDocumentoAltaMedica").val(objrowTb.nroDocumento);

        //RMOREANO 28032026
        $("#txtCipPacienteEmer").val(objrowTb.titularCIP);
        $("#txtCipTitularPacienteEmer").val(objrowTb.titularNombre);
        $("#txtObservacionAltaMedica").val(objrowTb.observacionAltaMedica);
      
        $('#chk_descansoMedico').prop('checked', false);
        AltaMedica.ToggleControlesDescansoMedico(false);
        //RMOREANO 28032026

        let diagIngreso = AltaMedica.SeleccionarDiagnosticos(Variables.IdAtencion, 2)

        const resp = await AltaMedica.ListarAtencionAltaMedica(Variables.IdAtencion);
        AltaMedica.idMedicoSesion = await Utilitario.ObtenerIdMedicoSesion();

        $("#CardRefCon").hide();
        if (resp.fechaEgreso != null && resp.fechaEgreso != '') {
            $('#cboDestinoAlta').val(resp.idDestinoAtencion);
            $('#cboDestinoAlta').change();
            $('#cboTipoAlta').val(resp.idTipoAlta);
            $('#cboCondicionAlta').val(resp.idCondicionAlta);
            $('#cboServicioAlta').val(resp.idServicioEgreso);
            $('#cboMedicoAlta').val(resp.idMedicoEgreso);

            //$('#txtFechaAlta').val(FormatearFecha(resp.fechaEgreso));
            //console.log("FechaErgreso:" + resp.fechaEgreso);
            $("#txtFechaAlta").datepicker("setDate", FormatearFecha(resp.fechaEgreso));
            $('#txtHoraAlta').val(resp.horaEgreso);

            $('#txtIntervencionQuirurgicaAlta').val(resp.intervencionQuirurgica);
            $('#cboOpcionIntervenciónQuirurgica').val(resp.opcionIntervenciónQuirurgica);
            $("#txtFechaIntervencionQuirurgicaAlta").datepicker("setDate", FormatearFecha(resp.fechaIntervencionQuirurgica));
            $('#txtHoraIntervencionQuirurgicaAlta').val(resp.horaIntervencionQuirurgica);
            $('#cboMedicoIntervencionQuirurgicaAlta').val(resp.idMedicoIntervencionQuirurgica);
            $('#cboGrupoGoAlta').val(resp.idGrupoGo);

            const tieneDescansoMedico = resp.tieneDescansoMed === true || resp.tieneDescansoMed === 1 || resp.tieneDescansoMed === '1';
            $('#chk_descansoMedico').prop('checked', tieneDescansoMedico);
            AltaMedica.ToggleControlesDescansoMedico(tieneDescansoMedico);
            if (tieneDescansoMedico) {
                $('#txtFechaInicioDescansoMedico').datepicker('setDate', FormatearFecha(resp.fechaInicioDescansoMed));
                $('#txtFechaFinDescansoMedico').datepicker('setDate', FormatearFecha(resp.fechaFinDescansoMed));
            }

            if (isEmpty(resp.codeEpicrisis)) {
                AltaMedica.codeEpicrisis = '';
                $("#btnEpicrisis").hide();
            } else {
                AltaMedica.codeEpicrisis = resp.codeEpicrisis;
                $("#btnEpicrisis").show();
            }
        } else {
            $('#cboServicioAlta').attr('disabled', true);
            $('#cboServicioAlta').val(Variables.IdServicioEgreso);
            $('.chzn-select').chosen().trigger("chosen:updated");

            if (AltaMedica.idMedicoSesion > 0) {
                $('#cboMedicoAlta').attr('disabled', true);
                $('#cboMedicoAlta').val(AltaMedica.idMedicoSesion);
                $('.chzn-select').chosen().trigger("chosen:updated");
            }

            AltaMedica.codeEpicrisis = '';
            $("#btnEpicrisis").hide();
            $("#btnEliminarAltaMedica").hide();
            $('#chk_descansoMedico').prop('checked', false);
            AltaMedica.ToggleControlesDescansoMedico(false);
        }

        if (AltaMedica.idMedicoSesion > 0) {
            $('#cboMedicoAlta').attr('disabled', true);
            $('.chzn-select').chosen().trigger("chosen:updated");
        }



        if (resp.idTipoReferenciaDestino == 1) {
            EstablecimientosSalud.idTipo = 1;
            EstablecimientosSalud.idEstablecimiento = resp.idEstablecimientoDestino;
            EstablecimientosSalud.codigo = resp.codigoDestinoReferencia;
            EstablecimientosSalud.nombre = resp.nombreDestinoReferencia;
            EstablecimientosSalud.nroReferencia = resp.nroReferenciaDestino;
            $('#ipressdestinoAlta').val(EstablecimientosSalud.codigo);
            $('#destinoAlta').val(EstablecimientosSalud.nombre);
            $('#nroreferencia').val(EstablecimientosSalud.nroReferencia);

            AltaMedica.HabilitarReferencia();
        }


        BusquedaDiagnosticos.IniciarScript();
        /////////////DIAGNOSTICO EGRESO//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        Diagnosticos.IniciarScript();
        $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("Diagnósticos de Egreso");
        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 3);

        /////////////DIAGNOSTICO COMPLICACIONES//////////////
        Diagnosticos.PanelDx = '#PanelComplicaciones ';
        Diagnosticos.IniciarScript();
        $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("Complicaciones");
        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 6);

        /////////////DIAGNOSTICO NACIMIENTO//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico2 ';
        Diagnosticos.IniciarScript();
        $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("Diagnósticos de Muerte Fetal");
        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 5);

        /////////////DIAGNOSTICO MORTALIDAD//////////////
        Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        Diagnosticos.IniciarScript();
        $(Diagnosticos.PanelDx + "#TituloCardDiagnostico").html("Diagnósticos de Mortalidad");
        await Diagnosticos.SeleccionarDiagnosticos(Variables.IdAtencion, 4);

        $('#dxEgreso-tab-link').click();

        if ($('#cboDestinoAlta').val() == 25) {
            AltaMedica.mortalidad = true;
            AltaMedica.HabilitarMortalidad();
            $('#chkNecropsia').prop('checked', resp.tieneNecropsia);
        } else {
            AltaMedica.mortalidad = false;
            AltaMedica.DeshabilitarMortalidad();
        }


        const infeccion = await Diagnosticos.HuboDiagnosticoInfeccion(Variables.IdAtencion, 8);
        //AltaMedica.infeccionIntraHosp = infeccion;

        if (objrowTb.idEstadoAtencion == 1 && (resp.fechaEgreso == null || resp.fechaEgreso == '')) {
            if (infeccion) {
                swal({
                    title: 'Infección Intrahospitalaria',
                    text: "Los diagnosticos muestran la existencia de infección intrahospitalaria. ¿Es correcto?",
                    type: 'warning',
                    allowOutsideClick: false,
                    showCancelButton: true,
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#6c6c6c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No',
                }).then(function () {
                    AltaMedica.infeccionIntraHosp = 1;
                }, function (dimiss) {
                    AltaMedica.infeccionIntraHosp = 0;
                });
            }
        }


        ///////////////////CIERRE CONTROL PRENATAL/////////////////////
        $("#CierreCicloPrenatal").hide();
        $('#chkCierreCicloPrenatal').prop('checked', false);
        AltaMedica.cierreControlPrenatal = false;
        const prenatal = await AltaMedica.SeleccionarCierreControlPrenatal(Variables.IdAtencion);
        //console.log(prenatal);
        if (typeof prenatal != 'undefined') {
            if (prenatal.length > 0) {
                $("#CierreCicloPrenatal").show();
                $('#chkCierreCicloPrenatal').prop('checked', prenatal.estadoCierre);
                AltaMedica.idProCabecera = prenatal.idProCabecera;
                AltaMedica.cierreControlPrenatal = true;
            }
        }
        //////////////////////////////////////////////////////////////

        await EstablecimientosSalud.eventos();
    },

    CargarFormAltaMedica() {
        var formData = new FormData();
        var ListDiagnosticos;
        var epiNuevo = 0
        var epiCierre = 0

        formData.append('idCuentaAtencion', Variables.IdCuentaAtencion);
        formData.append('idAtencion', Variables.IdAtencion);
        formData.append('idPaciente', Variables.IdPaciente);
        formData.append('nroCamaEgreso', $("#nroCamaEgreso").val());
        formData.append('idServicioEgreso', isEmpty($("#cboServicioAlta").val()) ? null : $("#cboServicioAlta").val());
        formData.append('idTipoAlta', $("#cboTipoAlta").val());
        formData.append('idCondicionAlta', $("#cboCondicionAlta").val());
        formData.append('idDestinoAtencion', $("#cboDestinoAlta").val());
        formData.append('fechaEgreso', $("#txtFechaAlta").val());
        formData.append('horaEgreso', $("#txtHoraAlta").val());
        formData.append('idMedicoEgreso', $("#cboMedicoAlta").val());
        formData.append('ObservacionAltaMedica', $("#txtObservacionAltaMedica").val());
        formData.append('conExoneracion', $("#chk_exoneracion").prop("checked") ? 1 : 0);
        formData.append('conDescansoMedico', $("#chk_descansoMedico").prop("checked") ? 1 : 0);
        formData.append('TieneDescansoMedico', $("#chk_descansoMedico").prop("checked"));
        formData.append('FechaInicioDescansoMedico', $("#txtFechaInicioDescansoMedico").val());
        formData.append('FechaFinDescansoMedico', $("#txtFechaFinDescansoMedico").val());


        /////////////////INFECCION INTRAHOSPITALARIA///////////////////////
        if (AltaMedica.infeccionIntraHosp) {
            formData.append('HuboInfeccionIntraHospitalaria', AltaMedica.infeccionIntraHosp);
        }
        //////////////////////////////////////////////////////////////////

        ///////////////////REFERENCIA//////////////////////
        if (EstablecimientosSalud.idTipo == 1) {
            formData.append('IdTipoReferenciaDestino', EstablecimientosSalud.idTipo);
            formData.append('IdEstablecimientoDestino', EstablecimientosSalud.idEstablecimiento);
            formData.append('NroReferenciaDestino', $("#nroreferencia").val());
        }
        ///////////////////////////////////////////////////

        //////////////////EPISODIO//////////////////////
        if ($('#chkNuevoAlta').prop('checked') === true) {
            epiNuevo = 1
        }

        if ($('#chkCierreAlta').prop('checked') === true) {
            epiCierre = 1
        }
        formData.append('numeroEpisodio', $('#cboEpisodioAlta').val());
        formData.append('epiNuevo', epiNuevo);
        formData.append('epiCierre', epiCierre);
        /////////////////////////////////////////////////////////

        /////////////////////CIERRE CONTROL PRENATAL/////////////////////
        if (AltaMedica.cierreControlPrenatal) {
            formData.append('estadoCierreControlPrenatal', $('#chkCierreCicloPrenatal').is(":checked"));
            formData.append('IdProCabecera', AltaMedica.idProCabecera);
        }
        ////////////////////////////////////////////////////

        /////////////////////MORTALIDAD/////////////////////
        if (AltaMedica.mortalidad) {
            formData.append('TieneNecropsia', $('#chkNecropsia').is(":checked"));
        }
        ////////////////////////////////////////////////////

        Diagnosticos.PanelDx = '#PanelDiagnostico ';
        ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticosEgreso', JSON.stringify(ListDiagnosticos.toArray()));

        Diagnosticos.PanelDx = '#PanelComplicaciones ';
        ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticosComplicaciones', JSON.stringify(ListDiagnosticos.toArray()));

        Diagnosticos.PanelDx = '#PanelDiagnostico2 ';
        ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
        formData.append('lstDiagnosticosNacimientos', JSON.stringify(ListDiagnosticos.toArray()));

        Diagnosticos.PanelDx = '#PanelDiagnostico3 ';
        if (AltaMedica.mortalidad) {
            ListDiagnosticos = Diagnosticos.DevolverDiagnosticos();
            formData.append('lstDiagnosticosMortalidad', JSON.stringify(ListDiagnosticos.toArray()));
        } else {
            formData.append('lstDiagnosticosMortalidad', '[]');
        }


        formData.append('IntervencionQuirurgica', $("#txtIntervencionQuirurgicaAlta").val());
        formData.append('OpcionIntervenciónQuirurgica', $("#cboOpcionIntervenciónQuirurgica").val());
        formData.append('FechaIntervencionQuirurgica', $("#txtFechaIntervencionQuirurgicaAlta").val());
        formData.append('HoraIntervencionQuirurgica', $("#txtHoraIntervencionQuirurgicaAlta").val());
        formData.append('IdMedicoIntervencionQuirurgica', $("#cboMedicoIntervencionQuirurgicaAlta").val());
        formData.append('IdGrupoGo', $("#cboGrupoGoAlta").val());
        //formData.append('idEstadoFacturacion', AltaMedica.idEstadoFacturacion);

        return formData;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////VALIDACIONES//////////////////////////////////////////
    async ValidarDatosObligatorios() {
        if ($("#cboDestinoAlta").val() == 0 || $("#cboDestinoAlta").val() == null || $("#cboDestinoAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $("#cboDestinoAlta_chosen").attr("tabindex", -1).focus();
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#cboDestinoAlta_chosen").attr("tabindex", -1).focus();
            });
            alerta2('info', '', 'Seleccione el Destino de la Alta Médica.');
            return false;
        } else {
            if ($('#cboDestinoAlta').val() == 23 || $('#cboDestinoAlta').val() == 24) {
                if (EstablecimientosSalud.idEstablecimiento == '') {
                    alerta2('info', '', 'Seleccione el Establecimiento de la Referencia o Contrareferencia');
                    return false;
                }
                if ($('#nroreferencia').val() == '') {
                    alerta2('info', '', 'Ingrese el número de referencia o contrareferencia');
                    return false;
                }
            }
        }

        if ($("#cboTipoAlta").val() == 0 || $("#cboTipoAlta").val() == null || $("#cboTipoAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $("#cboTipoAlta_chosen").attr("tabindex", -1).focus();
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#cboTipoAlta_chosen").attr("tabindex", -1).focus();
            });
            alerta2('info', '', 'Seleccione el Tipo de Alta Médica.');
            return false;
        }

        if ($("#cboCondicionAlta").val() == 0 || $("#cboCondicionAlta").val() == null || $("#cboCondicionAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $("#cboCondicionAlta_chosen").attr("tabindex", -1).focus();
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#cboCondicionAlta_chosen").attr("tabindex", -1).focus();
            });
            alerta2('info', '', 'Seleccione la Condición de la Alta Médica.');
            return false;
        }

        if ($("#cboServicioAlta").val() == 0 || $("#cboServicioAlta").val() == null || $("#cboServicioAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $("#cboServicioAlta_chosen").attr("tabindex", -1).focus();
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#cboCondicionAlta_chosen").attr("tabindex", -1).focus();
            });
            alerta2('info', '', 'Seleccione el Servicio de la Alta Médica.');
            return false;
        }

        if ($("#txtFechaAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#txtFechaAlta").focus();
            });
            alerta2('info', '', 'Seleccione la Fecha de la Alta Médica.');
            return false;
        } else {
            var fechaInicio = moment(ConvertirFormatoFecha(Variables.FechaIngreso));
            var fechaAlta = moment(ConvertirFormatoFecha($("#txtFechaAlta").val()));


            if (fechaAlta.isValid()) {
                horasEmer = fechaAlta.diff(fechaInicio, 'hours');
                if (horasEmer < 0) {
                    $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                    $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                        $("#txtFechaAlta").focus();
                    });
                    $("#txtFechaAlta").focus();
                    alerta2('info', '', 'La Fecha de la Alta Médica no puede ser menor que la Fecha de Ingreso.');
                    return false;
                } else {
                    if (AltaMedica.tipoServicio == 'EMER') {
                        if (horasEmer > AltaMedica.limiteHorasEmer) {
                            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                                $("#txtFechaAlta").focus();
                            });
                            $("#txtFechaAlta").focus();
                            alerta2('info', '', 'En Emergencia la Fecha de Alta Médica no  puede pasar de ' + AltaMedica.limiteHorasEmer + ' horas.');
                            return false;
                        }
                    }
                }

                if (!isEmpty(Variables.FechaEgresoAdministrativo)) {
                    var fechaEgresoAdm = moment(ConvertirFormatoFecha(Variables.FechaEgresoAdministrativo));
                    if (fechaEgresoAdm.diff(fechaAlta, 'days') < 0) {
                        $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                        $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                            $("#txtFechaAlta").focus();
                        });
                        $("#txtFechaAlta").focus();
                        alerta2('info', '', 'La Fecha de Egreso Administrativo no puede ser menor que la Fecha de Alta Médica.');
                        return false;
                    }
                }
            } else {
                $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                    $("#txtFechaAlta").focus();
                });
                $("#txtFechaAlta").focus();
                alerta2('info', '', 'La Fecha de la Alta Médica no es valida.');
                return false;
            }
        }

        if ($('#chk_descansoMedico').is(':checked')) {
            if ($('#txtFechaInicioDescansoMedico').val() == '' || $('#txtFechaFinDescansoMedico').val() == '') {
                $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                alerta2('info', '', 'Ingrese la fecha de inicio y fin del descanso médico.');
                return false;
            }

            const fechaInicioDescanso = moment(ConvertirFormatoFecha($('#txtFechaInicioDescansoMedico').val()));
            const fechaFinDescanso = moment(ConvertirFormatoFecha($('#txtFechaFinDescansoMedico').val()));

            if (!fechaInicioDescanso.isValid() || !fechaFinDescanso.isValid()) {
                $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                alerta2('info', '', 'Las fechas de descanso médico no son válidas.');
                return false;
            }

            if (fechaFinDescanso.diff(fechaInicioDescanso, 'days') < 0) {
                $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
                alerta2('info', '', 'La fecha fin del descanso médico no puede ser menor a la fecha inicio.');
                return false;
            }
        }

        if ($("#txtHoraAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#txtHoraAlta").focus();
            });
            alerta2('info', '', 'Seleccione la Hora de la Alta Médica.');
            return false;
        }

        if ($("#cboMedicoAlta").val() == 0 || $("#cboMedicoAlta").val() == null || $("#cboMedicoAlta").val() == '') {
            $('.nav-tabs a[href="#dxEgreso-tab"]').tab('show');
            $("#cboMedicoAlta_chosen").attr("tabindex", -1).focus();
            $('a[href="#dxEgreso-tab"]').on('shown.bs.tab', function (e) {
                $("#cboMedicoAlta_chosen").attr("tabindex", -1).focus();
            });
            alerta2('info', '', 'Seleccione el Médico que da autoriza la Alta Médica.');
            return false;
        }

        if ($('#cboCondicionAlta').val() == 4) {
            if (Diagnosticos.ValidaExisteDiagnostico3() == false) {
                alerta2('info', '', 'Debe agregar un Diagnóstico de Mortalidad.');
                $('#dxMortalidad-tab-link').click();
                return false;
            }
        } else {
            if (Diagnosticos.ValidaExisteDiagnostico() == false) {
                alerta2('info', '', 'Debe agregar un Diagnóstico de Egreso.');
                $('#dxEgreso-tab-link').click();
                return false;
            } else {
                if (Diagnosticos.ValidaExisteDxPrincipal() == false) {
                    alerta2('info', '', 'Debe agregar un diagnostico principal en Diagnóstico de Egreso.');
                    $('#dxEgreso-tab-link').click();
                    return false;
                }
            }
        }

        const sisFua = await AltaMedica.SisFUAyaFueEnviadoAlSisLIMA();
        if (sisFua) {
            return false;
        }

        ////////////FALTA VALIDAR PARA EL REGISTRO DE NACIMIENTOS//////////////////
        //if (Variables.IdTipoSexo == 2 && DestinoAntecionChequeaEnPartos == true) {

        //}
        /////////////////////////////////////////////////////////////////////////

        return true;
    },

    //async CalculaEstanciaParaPacienteConAltaMedica() {
    //    var lndiasEstancia = DiasDelPacienteEnHospitalizacionEmergencia();
    //    var lnhorasEstancia = HorasDelPacienteEnHospitalizacionEmergencia();
    //    var lnIdServicio = 0;

    //    if (Variables.IdTipoServicio == TipoServicio.hospitalizacion) {
    //        lnIdServicio = AltaMedica.diasEstancia1;
    //    } else if (lnhorasEstancia < 12) {
    //        lnIdServicio = AltaMedica.diasEstancia2;
    //    } else if (lnhorasEstancia <= 24) {
    //        lnIdServicio = AltaMedica.diasEstancia3;
    //    } else {
    //        lnIdServicio = AltaMedica.diasEstancia3;
    //    }
    //},

    //DiasDelPacienteEnHospitalizacionEmergencia() {
    //    var diasEstancia = 0;
    //    var fecInicio = moment(ConvertirFormatoFecha(Variables.FechaIngreso + ' ' + Variables.HoraIngreso));
    //    var fecAlta = moment(ConvertirFormatoFecha($("#txtFechaAlta").val() + ' ' + $("#txtHoraAlta").val()));

    //    var hAlta = moment($("#txtHoraAlta").val());
    //    var hEstanciaMax = moment(AltaMedica.horaEstanciaMax);

    //    diasEstancia = fecAlta.diff(fecInicio, 'days');

    //    if (diasEstancia == 0) {
    //        diasEstancia = 1;
    //    } else {
    //        if (hAlta > hEstanciaMax) {
    //            diasEstancia = diasEstancia + 1;
    //        }
    //    }
    //    return diasEstancia;
    //},

    //HorasDelPacienteEnHospitalizacionEmergencia() {
    //    var horasEstancia = 0;
    //    var fecInicio = moment(ConvertirFormatoFecha(Variables.FechaIngreso + ' ' + Variables.HoraIngreso));
    //    var fecAlta = moment(ConvertirFormatoFecha($("#txtFechaAlta").val() + ' ' + $("#txtHoraAlta").val()));

    //    horasEstancia = fecAlta.diff(fecInicio, 'hours');

    //    return horasEstancia;
    //},


    async SisFUAyaFueEnviadoAlSisLIMA() {
        if (AltaMedica.envioFuaLima = 'S' && Variables.IdTipoFinanciamiento == 2) {
            const sisFua = await Utilitario.SisFuaAtencionSeleccionarPorId(Variables.IdCuentaAtencion);
            if (typeof sisFua != 'undefined') {
                if (sisFua.length > 0) {
                    if (sisFua.cabNroEnvioAlSIS > 0) {
                        alerta(2, 'El Formato FUA de la Cuenta ya fué enviada al SIS CENTRAL - LIMA. \n' + 'FUA N°: ' + sisFua.fuaDisa + '-' + sisFua.fuaLote + '-' + sisFua.fuaNumero);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    },

    DestinoAntecionChequeaEnPartos() {
        if ($('#cboDestinoAlta').val() == 20 || $('#cboDestinoAlta').val() == 65) {
            return true;
        }

        if ($('#cboDestinoAlta').val() == 30 || $('#cboDestinoAlta').val() == 52 || $('#cboDestinoAlta').val() == 68) {
            return true;
        }

        return false;
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

    InsertFactCatalogo: async function () {

        const resp = await AltaMedica.ListarAtencionAltaMedica(Variables.IdAtencion);

        if (resp.idTipoServicio != 3) {
            return false
        }

        const fechaInicio = parsearFecha(resp.fechaHoraIngreso);
        const fechaFin = parsearFecha($('#txtFechaAlta').val() + ' ' + $('#txtHoraAlta').val());

        // Calcula la diferencia en milisegundos
        const diferenciaEnMilisegundos = fechaFin - fechaInicio;

        // Convierte la diferencia de milisegundos a días
        const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

        console.log(`La diferencia entre las fechas es de ${Math.round(diferenciaEnDias)} días.`);

        let diferenciaEntero = Math.round(diferenciaEnDias)


        let items = await AltaMedica.FactCatalogoServiciosXidTipoFinanciamiento(50018, resp.idFormaPago)
        let detalleConsumo = []
        $(items).each((i, item) => {
            detalleConsumo.push({
                "idProducto": item.idProducto,
                "cantidad": diferenciaEntero,
                "precio": item.precioUnitario,
                "total": item.precioUnitario,
                "labConfHIS": "",
                "grupoHIS": 0,
                "subgrupoHIS": 0,
            })
        })

        var formData = new FormData();

        formData.append('IdOrden', $('#hdIdOrden').val());
        formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
        formData.append('IdPuntoCarga', 1);
        formData.append('IdPaciente', resp.idPaciente);
        formData.append('IdCuentaAtencion', resp.idCuentaAtencion);
        formData.append('IdServicioPaciente', $('#cboServicioAlta').val());
        formData.append('idTipoFinanciamiento', resp.idFormaPago);
        formData.append('idFuenteFinanciamiento', resp.idFuenteFinanciamiento);

        formData.append('IdEstadoFacturacion', 1);
        formData.append('FechaHoraRealizaCpt', $('#txtFechaAlta').val());
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                //if (res.estado) {
                //    return res
                //} else {
                //    alerta(3, res.msg)
                //    Cargando(0)
                //    return null
                //}

                //alerta(2, res.msjReceta)
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    //////////////////////OPCIONES DE EDICION Y CONSULTA////////////////////////////// 
    //async ModificarAltaMedica(objrowTb) {        
    //    //console.log(datos.idServicioEgreso);
    //    await AltaMedica.CargarDatosAltaMedica(objrowTb);
    //},

    async GuardarAltaMedica() {
        var midata;
        var resultado = false;
        let datos;

        ///////////////COMENTADO POR KHOYOSI (SE REEMEPLAZO DENTRO DEL PROCEDIMIENTO DE GUARDADO)/////////////////////////////
        //if ($('#hdAgregaProcedimientosPorDefecto').val() == 1) {

        //    let factOrdenServicio = await AltaMedica.InsertFactCatalogo()

        //    console.log('factOrdenServicio', factOrdenServicio)

        //}
        const validacion = await AltaMedica.ValidarDatosObligatorios();

        if (validacion) {
            if (!isEmpty($('#idAltaUCIMaterno').val())) {
                midata = AltaMedica.CargarFormAltaMedica();
                Cargando(1);
                try {
                    datos = await
                        $.ajax({
                            method: "POST",
                            url: "/AltaMedica/AltaMedicaUCIModificar?area=Comun",
                            data: midata,
                            dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                        });
                    Cargando(0);
                    if (datos.session) {
                        if (datos.lsResultado) {





                            alerta2('success', '', 'El Alta Médica se ha registrado correctamente.');
                        } else {
                            alerta2('danger', '', 'Hubo un error al momento de registrar la Alta Médica.');
                        }

                        resultado = datos.lsResultado;
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina.")
                        location.reload();
                    }
                } catch (error) {
                    Cargando(0);
                    alerta(3, error);
                }
            } else {
                midata = AltaMedica.CargarFormAltaMedica();
                Cargando(1);
                try {
                    datos = await
                        $.ajax({
                            method: "POST",
                            url: "/AltaMedica/AltaMedicaModificar?area=Comun",
                            data: midata,
                            dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                        });
                    Cargando(0);
                    if (datos.session) {
                        if (datos.lsResultado) {





                            alerta2('success', '', 'El Alta Médica se ha registrado correctamente.');
                        } else {
                            alerta2('danger', '', 'Hubo un error al momento de registrar la Alta Médica.');
                        }

                        resultado = datos.lsResultado;
                    }
                    else {
                        alert("La sesion ya expiro se volvera a recargar la pagina.")
                        location.reload();
                    }
                } catch (error) {
                    Cargando(0);
                    alerta(3, error);
                }
            }
        }

        return resultado;
    },

    async GenerarPapeletaHospitalizacion() {
        var midata;
        var resultado = false;
        let datos;

        const validacion = await AltaMedica.ValidarDatosObligatorios();

        if (validacion) {
            if (!isEmpty($('#idAltaUCIMaterno').val())) {
                midata = AltaMedica.CargarFormAltaMedica();
                Cargando(1);
                try {
                    datos = await
                        $.ajax({
                            method: "POST",
                            url: "/AltaMedica/GenerarPapeletaHospitalizacionPrueba?area=Comun",
                            data: midata,
                            dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                        });
                    Cargando(0);
                    console.log("Resultado Guardado")
                } catch (error) {
                    Cargando(0);
                    alerta(3, error);
                }
            } else {
                midata = AltaMedica.CargarFormAltaMedica();
                Cargando(1);
                try {
                    datos = await
                        $.ajax({
                            method: "POST",
                            url: "/AltaMedica/GenerarPapeletaHospitalizacionPrueba?area=Comun",
                            data: midata,
                            dataType: "json",
                            cache: false,
                            processData: false,
                            contentType: false,
                        });
                    Cargando(0);
                    console.log("Resultado Guardado")
                } catch (error) {
                    Cargando(0);
                    alerta(3, error);
                }
            }
        }

        return resultado;
    },

    async EliminarAltaMedica() {
        var formData = new FormData();
        var resultado = false;
        let datos;

        formData.append('idAtencion', Variables.IdAtencion);
        formData.append('motivo', $("#txtMotivoRevertirAlta"));

        Cargando(1);
        try {
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/AltaMedica/AltaMedicaEliminar?area=Comun",
                    data: formData,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });
            Cargando(0);
            if (datos.session) {
                if (datos.lsResultado) {
                    alerta2('success', '', 'El Alta Médica se ha eliminado correctamente.');
                } else {
                    alerta2('danger', '', 'Hubo un error al momento de eliminar la Alta Médica.');
                }

                resultado = datos.lsResultado;
            }
            else {
                alert("La sesion ya expiro se volvera a recargar la pagina.")
                location.reload();
            }
        } catch (error) {
            Cargando(0);
            alerta(3, error);
        }

        return resultado;
    },

    LimpiarModal() {
        $('#cboEpisodioAlta').empty();
        $('.chzn-select').chosen().trigger("chosen:updated");
    },

    AbrirModal() {
        $('#modalAltaMedica').modal('show');
    },

    CerrarModal() {
        //AltaMedica.LimpiarModal();
        $('#modalAltaMedica').modal('hide');
        $('#btnAltaMedica').focus();
    },

    CerrarModuloAlta() {
        Variables.Limpiar();
        EstablecimientosSalud.LimpiarVariables();
        AltaMedica.mortalidad = false;
        AltaMedica.cierreControlPrenatal = false;
        AltaMedica.idProCabecera = 0;
        $("#modalAltaMedica").modal("hide");

        $("#modalAltaMedica").on('hidden.bs.modal', function () {
            $("#ModuloAlta").html("");
            $("#btnBuscarAtencionesEmergencia").click();
            $("#btnBuscarAtencionesHospitalizacion").click();
        });

        $('#btnAltaMedica').focus();
    },

    AbrirModalRevertir() {
        $('#modalALtaMedicaRevertir').modal('show');
    },

    CerrarModalRevertir() {
        $("#txtMotivoRevertirAlta").val("");
        $('#modalALtaMedicaRevertir').modal('hide');
    },

    async IniciarScript() {
        await AltaMedica.cargaInicial();
        AltaMedica.initDatables();
        AltaMedica.InicializarComponentes();
        AltaMedica.Eventos();
    }

}

function parsearFecha(fechaString) {
    const [fechaPart, horaPart] = fechaString.split(' ');
    const [dia, mes, anio] = fechaPart.split('/');
    const [hora, minutos] = horaPart.split(':');

    return new Date(anio, mes - 1, dia, hora, minutos);
}

async function ModificarRefCon() {
    //const permisoRefcon = await PermisoGeneral.SeleccionarPermisoGeneral("REFCON");
    if (AltaMedica.permisoRefCon == '1') {
        //var objrow = otable.api(true).row('.selected').data();

        if (isEmpty($("#cboMedicoAlta").val())) {
            alerta2("info", "", "Por favor seleccione el Médico Alta.");
            return false;
        }

        if ($("#cboDestinoAlta").val() == 23 || $("#cboDestinoAlta").val() == 31) {
            var tipoRef = 1;
            $('.txtTituloRefCon').html('REFERENCIA');
        }
        if ($("#cboDestinoAlta").val() == 24 || $("#cboDestinoAlta").val() == 32) {
            var tipoRef = 2;
            $('.txtTituloRefCon').html('CONTRAREFERENCIA');
        }

        if ($('#nroreferencia').val() == '') {
            alerta(2, 'Ingrese el N° de Referencia.');
            //$('.nav-tabs a[href="#lsAtenciones"]').tab('show');
            $('#nroreferencia').focus()
            return false;
        }

        if (tipoRef == 1) {
            $('#NroHojaReferencia').val($('#nroreferencia').val())
        } else {
            $('#txtNroContraReferencia').val($('#nroreferencia').val())
        }

        //if (objrow.usaModuloMaterno) {
        //    var modulo = "ModuloMaterno";
        //} else if (objrow.usaModuloNinoSano) {
        //    var modulo = "ModuloNinoSano";
        //} else {
        //    var modulo = "ModuloCE"
        //}
        var modulo = "AltaMedica"
        await Referencias.Iniciar();

        const data = await Referencias.CargarDataSinValidar(Variables.IdCuentaAtencion, Variables.IdAtencion, tipoRef, modulo);

        $("#btnGuardar").show();
    }
}


//$(document).ready(function () {
//    AltaMedica.cargaInicial();
//    AltaMedica.initDatables();
//    AltaMedica.Eventos();

//});


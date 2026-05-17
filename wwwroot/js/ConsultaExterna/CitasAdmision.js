window.superCm = function () {

    var settings = {
        'minWidth': null,
        'maxHeight': null,
        'autoClose': false,
        'searchBar': false,
        'searchBarPlaceholder': 'Search...',
        'zIndex': 50
    };

    var cmTemplate = $('<div>').addClass('context-menu')
        .append(
            $('<div>').addClass(`context-menu-options`)
        );

    var cmOptTemplate = $('<div>');

    var optIconTemplate = $('<i>').addClass('option-icon');
    //var optTextTemplate = $('<span>').addClass('option-text');
    var optSeparatorTemplate = $('<hr>').addClass('option-separator');

    var cms = [];

    var activeOpt = null;

    function getOpts(cmIndex, actualOpts) {
        var cm = cms[cmIndex];
        return cm.search.result && !actualOpts ? cm.search.result : cm.opts;
    }

    function getOptContainer(cmIndex) {
        return cms[cmIndex].element.find('.context-menu-options');
    }

    function getOptElements(cmIndex) {
        return getOptContainer(cmIndex).children();
    }

    function getOptElement(cmIndex, optIndex) {
        return getOptContainer(cmIndex).children().eq(optIndex);
    }

    function setCurrentActiveOver(cmIndex, optIndex) {
        if (activeOpt == null || activeOpt.cmIndex != cmIndex || activeOpt.optIndex != optIndex) {
            if (activeOpt != null) {
                let cmOptElement = getOptElement(activeOpt.cmIndex, activeOpt.optIndex);

                if (cmOptElement.hasClass('active')) {
                    cmOptElement.removeClass('active');
                }
            }

            if (cmIndex != -1 && optIndex != -1) {
                let cmOptElement = getOptElement(cmIndex, optIndex);

                if (!cmOptElement.hasClass('active')) {
                    cmOptElement.addClass('active');
                }

                activeOpt = {
                    'cmIndex': cmIndex,
                    'optIndex': optIndex
                };
            } else {
                activeOpt = null;
            }
        }
    }

    function setActiveOptSubmenu(cmIndex, optIndex) {
        var activeSubmenu = cms[cmIndex].activeSubmenu;
        if (activeSubmenu != optIndex) {
            if (activeSubmenu != -1) {
                let cmOptElement = getOptElement(cmIndex, activeSubmenu);

                if (cmOptElement.hasClass('active-submenu')) {
                    cmOptElement.removeClass('active-submenu');
                }
            }

            if (optIndex != -1) {
                let cmOptElement = getOptElement(cmIndex, optIndex);

                if (!cmOptElement.hasClass('active-submenu')) {
                    cmOptElement.addClass('active-submenu');
                }
            }

            cms[cmIndex].activeSubmenu = optIndex;
        }
    }

    function destroyCm(cmIndex = 0) {
        if (activeOpt != null && cmIndex <= activeOpt.cmIndex) {
            setCurrentActiveOver(-1, -1);
        }

        for (let i = cms.length - 1; i >= cmIndex; i--) {
            cms.pop().element.remove();
        }
    }

    function updateCm(cmIndex) {
        var cm = cms[cmIndex];

        var opts = getOpts(cmIndex, false);

        if (opts.length == 0) {
            opts = [
                {
                    'label': '&lt; Empty &gt;',
                    'disabled': true
                }
            ];
        }

        opts.forEach(function (opt, optIndex) {
            var cmOptElement = getOptElement(cmIndex, optIndex);

            var separator = typeof opt.separator !== 'undefined';
            var icon = typeof opt.icon !== 'undefined' && opt.icon;
            var label = typeof opt.label !== 'undefined' && opt.label;
            var disabled = typeof opt.disabled !== 'undefined' && opt.disabled;
            var action = typeof opt.action !== 'undefined' && opt.action;
            var submenu = typeof opt.submenu !== 'undefined' && opt.submenu;

            if (cmOptElement.length) {
                cmOptElement.empty();
                cmOptElement.off();
                cmOptElement.removeClass();
            } else {
                cmOptElement = cmOptTemplate.clone();
                cmOptElement.appendTo(getOptContainer(cmIndex));
            }

            if (separator) {
                if (!cmOptElement.hasClass('context-menu-separator')) {
                    cmOptElement.addClass('context-menu-separator');
                }

                cmOptElement.append(
                    optSeparatorTemplate.clone()
                );

                return;
            }

            if (icon) {
                cmOptElement.append(
                    optIconTemplate.clone().addClass(opt.icon)
                );
            }

            if (label) {
                cmOptElement.append(
                    opt.label
                );
            }

            if (disabled) {
                if (!cmOptElement.hasClass('context-menu-disabled')) {
                    cmOptElement.addClass('context-menu-disabled');
                }
                return;
            }

            if (action) {
                cmOptElement.click(function () {
                    if (settings.autoClose) {
                        destroyCm();
                    } else {
                        destroyCm(cmIndex + 1);
                        setActiveOptSubmenu(cmIndex, -1);
                    }

                    opt.action(opt, cmIndex, optIndex);
                });
            }

            if (submenu) {
                if (!cmOptElement.hasClass('context-menu-submenu')) {
                    cmOptElement.addClass('context-menu-submenu');
                }
            } else {
                cmOptElement.mouseenter(function () {
                    setCurrentActiveOver(cmIndex, optIndex);
                    setActiveOptSubmenu(cmIndex, -1);
                    destroyCm(cmIndex + 1);
                });

                if (!cmOptElement.hasClass('context-menu-option')) {
                    cmOptElement.addClass('context-menu-option ' + opt.class);
                }
            }

            cmOptElement.mouseleave(function () {
                if (activeOpt.cmIndex == cmIndex && activeOpt.optIndex == optIndex) {
                    setCurrentActiveOver(-1, -1);
                }
            });
        });

        var cmElementChildren = getOptElements(cmIndex);
        for (let i = cmElementChildren.length - 1; i >= opts.length; i--) {
            cmElementChildren.eq(i).remove();
        }
    }

    function updateCmPosition(cmIndex, repositionX = true, repositionY = true) {
        var cm = cms[cmIndex];

        if (cmIndex > 0) {
            var parentCmIndex = cmIndex - 1;
            var parentCm = cms[parentCmIndex];
            var activeSubmenu = getOptElement(parentCmIndex, parentCm.activeSubmenu);

            cm.position = {
                'x': parentCm.position.x + parentCm.element.outerWidth(),
                'y': parentCm.position.y + activeSubmenu[0].offsetTop - activeSubmenu[0].parentElement.scrollTop - parseInt(getOptContainer(cmIndex).css('padding-top'))
            };
        }

        if (repositionX) {
            var cmElementWidth = cm.element.outerWidth();
            if (cm.position.x - $(window).scrollLeft() + cmElementWidth >= $(window).innerWidth()) {
                cm.position.x -= cmElementWidth;

                if (cmIndex > 0) {
                    cm.position.x -= parentCm.element.outerWidth();
                }

                if (cm.position.x < $(window).scrollLeft()) {
                    cm.position.x = $(window).scrollLeft();
                }
            }

            cm.element.css('left', `${cm.position.x}px`);
        }

        if (repositionY) {
            var cmElementHeight = cm.element.outerHeight();
            if (cm.position.y - $(window).scrollTop() + cmElementHeight >= $(window).innerHeight()) {
                cm.position.y -= cmElementHeight;

                if (cmIndex > 0) {
                    var paddingBottom = parseInt(getOptContainer(cmIndex).css('padding-bottom'));
                    var lastOpt = getOptElements(cmIndex).last();
                    var paddingTop = parseInt(getOptContainer(cmIndex).css('padding-top'));
                    cm.position.y += paddingBottom + paddingTop + lastOpt.outerHeight();
                }

                if (cm.position.y < $(window).scrollTop()) {
                    cm.position.y = $(window).scrollTop();
                }
            }

            cm.element.css('top', `${cm.position.y}px`);
        }

        if (settings.maxHeight === null) {
            var leftoverHeight = cm.position.y - $(window).scrollTop();
            cm.element.css('max-height', `calc(100vh - ${leftoverHeight}px)`);
        } else {
            cm.element.css('max-height', settings.maxHeight);
        }

        if (settings.minWidth !== null) {
            cm.element.css('min-width', settings.minWidth);
        }

        cm.element.css('z-index', settings.zIndex + cmIndex);
    }

    function populateSearchResult(result, opts, keyword) {
        opts.forEach(function (opt) {
            var match = false;

            if (typeof opt.label !== 'undefined' && opt.label) {
                var label = opt.label.toLowerCase();

                if (label && label.indexOf(keyword) != -1) {
                    result.push(opt);
                    match = true;
                }
            }

            if (!match && typeof opt.submenu !== 'undefined' && opt.submenu.length) {
                populateSearchResult(result, opt.submenu, keyword);
            }
        });
    }

    function updateSearch(cmIndex) {
        var cm = cms[cmIndex];
        if (cm.search.input === null) {
            return;
        }

        var keyword = cm.search.input.val().trim();
        if (keyword == '') {
            cm.search.result = null;
            updateCm(cmIndex);
            return;
        }

        setCurrentActiveOver(-1, -1);

        var result = [];

        populateSearchResult(result, cm.opts, keyword.toLowerCase());
        cm.search.result = result;
    }

    function showCm(opts, cmIndex, position = null) {
        var cmElement = cmTemplate.clone();

        if (settings.searchBar && cmIndex == 0) {
            var cmSearch = cmSearchTemplate.clone();
            cmSearch.prependTo(cmElement);
        }

        var cm = {
            'element': cmElement,
            'position': position,
            'opts': opts,
            'activeSubmenu': -1,
            'search': {
                'input': cmSearch ? cmSearch.find('input') : null,
                'result': null
            }
        };
        cms.push(cm);

        getOptContainer(cmIndex).scroll(function () {
            setActiveOptSubmenu(cmIndex, -1);
            destroyCm(cmIndex + 1);
        });

        setCurrentActiveOver(-1, -1);
        activeOpt = {
            'cmIndex': cmIndex,
            'optIndex': -1
        };

        cmElement.appendTo(document.body);
        updateCm(cmIndex);
        updateCmPosition(cmIndex);

        if (cmSearch) {
            cm.search.input
                .on('input', function () {
                    destroyCm(cmIndex + 1);
                    updateSearch(cmIndex);
                    updateCm(cmIndex);
                    updateCmPosition(cmIndex, true, false);
                })
                .focus();
        }
    }

    function isSelectable(cmIndex, optIndex) {
        var opt = getOpts(cmIndex, false)[optIndex];
        return typeof opt.separator === 'undefined' && (typeof opt.disabled === 'undefined' || !opt.disabled);
    }

    function findSuitableSelectable(cmIndex, optIndex, reverse) {
        var optElements = getOptElements(cmIndex);

        if (optIndex >= optElements.length) {
            optIndex = 0;
        } else if (optIndex < 0) {
            optIndex = optElements.length - 1;
        }

        var currentOptIndex = optIndex;
        while (!isSelectable(cmIndex, currentOptIndex)) {
            currentOptIndex += reverse ? -1 : 1;

            if (currentOptIndex == optIndex) {
                return -1;
            }

            if (currentOptIndex >= optElements.length) {
                currentOptIndex = 0;
            } else if (currentOptIndex < 0) {
                currentOptIndex = optElements.length - 1;
            }
        }

        return currentOptIndex;
    }

    function activeUp() {
        if (activeOpt == null || activeOpt.optIndex == -1) {
            var cmIndex = cms.length - 1;
            var cmOpts = getOpts(cmIndex);

            if (cmOpts.length <= 0) {
                return;
            }

            setCurrentActiveOver(cmIndex, cmOpts.length - 1);
            return;
        }

        var previousOptIndex = findSuitableSelectable(activeOpt.cmIndex, activeOpt.optIndex - 1, true);

        if (previousOptIndex != -1) {
            setCurrentActiveOver(activeOpt.cmIndex, previousOptIndex);
        }
    }

    function activeDown() {
        if (activeOpt == null || activeOpt.optIndex == -1) {
            var cmIndex = cms.length - 1;
            var cmOpts = getOpts(cmIndex);

            if (cmOpts.length <= 0) {
                return;
            }

            setCurrentActiveOver(cmIndex, 0);
            return;
        }

        var nextOptIndex = findSuitableSelectable(activeOpt.cmIndex, activeOpt.optIndex + 1, false);

        if (nextOptIndex != -1) {
            setCurrentActiveOver(activeOpt.cmIndex, nextOptIndex);
        }
    }

    $(document).on('mousedown.scm contextmenu.scm', '.context-menu, .opt-text, .opt-icon, .opt-separator', function (e) {
        e.stopPropagation();
    });

    $(document).on('keydown.scm', function (e) {
        if (e.key == 'Escape' || e.which == 27) {
            destroyCm();
        }

        if (cms.length > 0) {
            if (e.key == 'ArrowUp' || e.which == 38) {
                e.preventDefault();
                activeUp();
            } else if (e.key == 'ArrowDown' || e.which == 40) {
                e.preventDefault();
                activeDown();
            } else if (e.key == 'Enter' || e.which == 13) {
                e.preventDefault();
                getOptElement(activeOpt.cmIndex, activeOpt.optIndex)
                    .click();
            } else if (e.key == 'ArrowLeft' || e.which == 37) {
                if (activeOpt != null && activeOpt.cmIndex > 0) {
                    e.preventDefault();
                    var parentCmIndex = activeOpt.cmIndex - 1;
                    var parentCm = cms[parentCmIndex];

                    var parentContextActiveSubmenu = parentCm.activeSubmenu;
                    destroyCm(activeOpt.cmIndex);
                    setActiveOptSubmenu(parentCmIndex, -1);

                    setCurrentActiveOver(parentCmIndex, parentContextActiveSubmenu);
                }
            } else if (e.key == 'ArrowRight' || e.which == 39) {
                if (activeOpt != null && activeOpt.optIndex != -1) {
                    var optElement = getOptElement(activeOpt.cmIndex, activeOpt.optIndex);

                    if (optElement.hasClass('context-menu-submenu')) {
                        e.preventDefault();
                        optElement.trigger('submenu');
                    }
                }
            }
        }
    });

    $(document).on('mousedown.scm', function () {
        destroyCm();
    });

    $(window).on('scroll.scm resize.scm', function () {
        destroyCm();
    });

    return {
        settings: settings,
        createMenu: function (opts, event) {
            destroyCm();
            showCm(opts, 0, { x: event.pageX, y: event.pageY });
        },
        destroyMenu: function () {
            destroyCm();
        },
        updateMenu: function (repositionX, repositionY) {
            cms.forEach(function (cm, cmIndex) {
                updateSearch(cmIndex);
                updateCm(cmIndex);
                updateCmPosition(cmIndex, repositionX, repositionY);
            });
        },
        getMenuOptions: function (cmIndex) {
            return cms[cmIndex].opts;
        },
        addMenuOption: function (cmIndex, opt, optIndex) {
            if (typeof optIndex !== 'undefined') {
                cms[cmIndex].opts.splice(optIndex, 0, opt);
            } else {
                cms[cmIndex].opts.push(opt);
            }
        },
        addMenuOptions: function (cmIndex, opts, optIndex) {
            if (typeof optIndex !== 'undefined') {
                cms[cmIndex].opts.splice(optIndex, 0, ...opts);
            } else {
                cms[cmIndex].opts = cms[cmIndex].opts.concat(opts);
            }
        },
        deleteMenuOption: function (cmIndex, optIndex) {
            cms[cmIndex].opts.splice(optIndex, 1);
        },
        setMenuOption: function (cmIndex, optIndex, opt) {
            cms[cmIndex].opts[optIndex] = opt;
        },
        setMenuOptions: function (cmIndex, opts) {
            cms[cmIndex].opts = opts;
        }
    };

}();

window.onbeforeunload = async function (e) { // -M
    CitasAdmision.EliminarCitaBloqueada()
};

let CitasAdmision = {
    dia: 0,
    mes: 0,
    anio: 0,
    fechaActual: '',
    tipoAccion: 0,

    idMedico: 0,
    idEspecialidad: 0,
    idServicio: 0,
    idProgramacion: 0,

    idProducto: 0,
    idCuentaAtencion: 0,
    idPaciente: 0,
    tipoCita: null,
    idReceta: 0,



    totalCupos: 0,
    cuposAsignados: 0,

    nroContinuadores: 0,
    nroNuevos: 0,
    nroReingresantes: 0,

    esCitaAdicional: 0,

    IdVentanilla: 0,
    NombreVentanilla: "",
    PacientesEnCola: null,
    IdTurnoLlamado: 0,

    myMenu: [
        {
            icon: 'fa fa-plus',
            class: '.btnAgregarCita',
            label: '<a id="btnAgregarCita">Agregar cita</a>',
            action: function (option, contextMenuIndex, optionIndex) {
                //let objRow = oTable_medicosProgramados.api(true).row('.selected').data()
                ModalCita(optionIndex)
            }
        },
        {
            icon: 'fa fa-pen',
            class: '.btnModificarCita',
            label: '<a id="btnModificarCita">Modificar cita</a>',
            action: function (option, contextMenuIndex, optionIndex) {
                ModalCita(optionIndex)
            }
        },
        {
            icon: 'fa fa-eye',
            class: '.btnConsultarCita',
            label: '<a id="btnConsultarCita">Consultar cita</a>',
            action: function (option, contextMenuIndex, optionIndex) {
                ModalCita(optionIndex)
            }
        },
        {
            icon: 'fa-solid fa-notes-medical',
            class: '.btnInterconsulta',
            label: '<a id="btnInterconsulta">Interconsultas C.E.</a>',
            action: function (option, contextMenuIndex, optionIndex) {
                /*oTable_ProcedimientosInterconsulta.fnClearTable()*/

                $('#txtNroOrden').val('')
                $('#modalInterConsulta').modal('show')

            }
        },
        {
            icon: 'fa fa-trash',
            class: '.btnEliminarCita',
            label: '<a id="btnEliminarCita">Eliminar cita</a>',
            action: function (option, contextMenuIndex, optionIndex) {
                ModalCita(optionIndex)
            }
        },
        {
            icon: 'fa fa-unlock',
            class: '.btnDesbloquearCupo',
            label: '<a id="btnDesbloquearCupo">Desbloquear cupo</a>',
            action: function () {
                CitasAdmision.DesbloquearCupo()
            }
        }
    ],

    Plugins: function () {
        $(".hide_search").chosen({ disable_search_threshold: 10 });
        $(".chzn-select").chosen({ allow_single_deselect: true, placeholder_text_single: 'Seleccione una opción' });
        $(".chzn-select-deselect,#select2_sample").chosen();
    },


    CargaInicial: function () {
        //limpiar();
        var fecha = new Date()
        CitasAdmision.dia = fecha.getDate()
        CitasAdmision.mes = parseInt(fecha.getMonth()) + 1
        var mesSincero = CitasAdmision.mes
        var yyy = fecha.getFullYear()
        if (CitasAdmision.dia < 10)
            CitasAdmision.dia = '0' + CitasAdmision.dia; //agrega cero si el menor de 10
        if (CitasAdmision.mes < 10)
            CitasAdmision.mes = '0' + CitasAdmision.mes
        //fechaP = dia + "/" + mes + "/" + yyy
        CitasAdmision.anio = yyy
        CitasAdmision.fechaActual = CitasAdmision.dia + "/" + CitasAdmision.mes + "/" + yyy

        for (i = 1992; i < 2072; i += 1) {
            $('#cboAnio').append(`<option value="${i}">${i}</option>`)
        }

        opts = {
            /*header: {
                left: '',
                center: 'title',
                right: '',
            },*/
            header: false,
            locale: 'es',
            height: 280,
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayClick: async function (date, jsEvent, view) {
                Cargando(1)
                let fecha = date.format()
                CitasAdmision.anio = fecha.substr(0, 4)
                CitasAdmision.mes = fecha.substr(5, 2)
                CitasAdmision.dia = fecha.substr(8, 2)

                //CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                await CitasAdmision.ListaServicios(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                $(".day-highlight").removeClass("day-highlight");
                $(this).addClass("day-highlight");
                Cargando(0)
            },
            dayRender: function (date, cell) {
                let today = new Date()
                if (moment(Date.now()).format('L') === date.format('L')) {
                    $(cell).addClass("day-highlight");
                }
            },
            eventRender: function (event, element) {
                if (event.title) {
                    element.find('.fc-title').html(event.title);  // Interpreta el HTML del título
                }
            },
            eventClick: async function (event) {
                Cargando(1)
                let fecha = event.start.format('YYYY-MM-DD');
                CitasAdmision.anio = fecha.substr(0, 4)
                CitasAdmision.mes = fecha.substr(5, 2)
                CitasAdmision.dia = fecha.substr(8, 2)

                //CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
                await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                await CitasAdmision.ListaServicios(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

                $(".day-highlight").removeClass("day-highlight");
                $('.fc-day').removeClass('highlight');

                $('.fc-day[data-date="' + fecha + '"]').addClass('day-highlight');
                //$($(this).parent()).addClass("day-highlight");
                Cargando(0)
            },
        }

        $('.chzn-select').chosen().trigger("chosen:updated")

        $(`#cboAnio option[value='${yyy}']`).attr("selected", true);
        $(`#cboMes option[value='${mesSincero}']`).attr("selected", true)

        $('.chzn-select').chosen().trigger("chosen:updated")

        $("#MesCalendario").text($("#cboMes option:selected").text() + ' ' + $("#cboAnio option:selected").text());

        $('#calendar').fullCalendar(opts);

        CitasAdmision.ListaDepartamentosReferencia()
    },

    CargarDatosGenerales: (data) => {
        CitasAdmision.idMedico = data.idMedico
        CitasAdmision.idEspecialidad = data.idEspecialidad
        CitasAdmision.idServicio = data.idServicio
        CitasAdmision.idProgramacion = data.idProgramacion
    },
    BuscarPacienteEnEstablecimiento: async function (funcionExtrabuscar = null) {

        if ($('#txtDni').val() != '') {
            let paciente = await CitasAdmision.PacientesFiltraPorNroDocumentoYtipo()

            if (paciente.data.table.length > 0) {
                paciente = await CitasAdmision.PacientesSeleccionarPorId(paciente.data.table[0].idPaciente)

                RegistroPaciente.CompletarDatosPaciente(paciente, 1)
            } else {
                if(typeof funcionExtrabuscar === 'function') {
                    return funcionExtrabuscar()
                }
                alerta(2, 'No se encontro información en la Base de Datos del Establecimiento')
            }
        } else {
            let pacientes = await CitasAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()

            if (pacientes.data.table.length > 0) {
                oTable_pacientesBusqueda.fnClearTable()
                oTable_pacientesBusqueda.fnAddData(pacientes.data.table)
                $('#modalPacientesBusqueda').modal('show')
            }
        }
    },

    SisFiliacionesAgregar: function () {
        let formData = new FormData();
        formData.append("idSiasis", $('#hdIdSiaSis').val())
        formData.append("Codigo", $('#hdCodigo').val())
        formData.append("AfiliacionDisa", $('#hdAfiliacionDisa').val())
        formData.append("AfiliacionTipoFormato", $('#hdAfiliacionTipoFormato').val())
        formData.append("AfiliacionNroFormato", $('#hdAfiliacionNroFormato').val())
        formData.append("AfiliacionNroIntegrante", $('#hdAfiliacionNroIntegrante').val())
        formData.append("DocumentoTipo", $('#hdDocumentoTipo').val())
        formData.append("CodigoEstablAdscripcion", $('#hdCodigoEstablAdscripcion').val())
        formData.append("AfiliacionFecha", $('#hdAfiliacionFecha').val())
        formData.append("Paterno", $('#hdPaterno').val())
        formData.append("Materno", $('#hdMaterno').val())
        formData.append("Pnombre", $('#hdPnombre').val())
        formData.append("Onombres", $('#hdOnombres').val())
        formData.append("Genero", $('#hdGenero').val())
        formData.append("Fnacimiento", $('#hdFnacimiento').val())
        formData.append("IdDistritoDomicilio", $('#hdIdDistritoDomicilio').val())
        formData.append("Estado", $('#hdEstado').val())
        formData.append("Fbaja", $('#hdFbaja').val())
        formData.append("DocumentoNumero", $('#hdDocumentoNumero').val())
        formData.append("MotivoBaja", $('#hdMotivoBaja').val())
        formData.append("FbajaOK", $('#').val())

        return HttpClient.Post('/Sis/web_SisFiliacionesAgregar?area=Comun', formData)
            .then(res => {
                if (res.estado) {
                    return res
                } else {
                    alerta(3, res.msg)
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
            })
    },

    CrearModificarCuentasAtenciones: function (idCuentaAtencion, idAtencion, idPaciente, estadoAtencion) {
        let formData = new FormData();
        //formData.append("IdCuentaAtencion", $('#txtNroCuentaPaciente').val())
        formData.append("IdCuentaAtencion", $('#txtNroCuentaPaciente').val())
        //formData.append("TotalPorPagar", null)
        formData.append("IdEstado", estadoAtencion == 0 ? 9 : estadoAtencion)
        //formData.append("TotalPagado", null)
        //formData.append("TotalAsegurado", null)
        //formData.append("TotalExonerado", null)
        //formData.append("HoraCierre", null)
        //formData.append("FechaCierre", null)
        formData.append("HoraApertura", $('#txtHoraInicioCita').val())
        formData.append("FechaApertura", $('#txtFechaCita').val())
        formData.append("IdPaciente", idPaciente)
        formData.append("FechaCreacion", Date.now())



        formData.append("horaIngreso", $('#txtHoraInicioCita').val())
        formData.append("fechaIngreso", $('#txtFechaCita').val())
        formData.append("idTipoServicio", 1)
        formData.append("idPaciente", idPaciente)
        formData.append("idAtencion", idAtencion)
        formData.append("idTipoCondicionALEstab", $('#hdtipoCondicionPaciente').val())
        formData.append("idTipoEdad", $('#cboTipoEdadPaciente').val())
        formData.append("idOrigenAtencion", $('#cboTipoOrigenCita').val())
        formData.append("idTipoCondicionAlServicio", $('#hdtipoCondicionPaciente').val())
        formData.append("edad", $('#txtEdadPaciente').val())
        formData.append("idEspecialidadMedico", $('#cboEspecialidadCita').val())
        formData.append("idMedicoIngreso", CitasAdmision.idMedico)
        formData.append("idServicioIngreso", $('#cboServicioCita').val())
        formData.append("idCuentaAtencion", idCuentaAtencion)
        formData.append("idFormaPago", $('#cboProductoPlan').val()) // Capturar el valor - 1 -> Contado
        formData.append("idFuenteFinanciamiento", $('#cboFuenteFinanciamientoCita').val())

        formData.append("idEstadoAtencion", estadoAtencion)
        formData.append("esPacienteExterno", 0)
        formData.append("idSunasaPacienteHistorico", $('#').val())
        formData.append("esDecretoUrgencia", 0)


        formData.append("idAtencion", idAtencion)
        formData.append("horaIngreso", $('#txtHoraInicioCita').val())
        formData.append("fechaIngreso", $('#txtFechaCita').val())
        formData.append("idTipoServicio", 1)
        formData.append("idPaciente", idPaciente)
        //formData.append("idAtencion", objrowCita != 'undefined' ? objrowCita?.idAtencion : 0)
        formData.append("idTipoCondicionALEstab", $('#hdtipoCondicionPaciente').val())
        formData.append("idTipoEdad", $('#cboTipoEdadPaciente').val())
        formData.append("idOrigenAtencion", $('#cboTipoOrigenCita').val())
        formData.append("idTipoCondicionAlServicio", $('#hdtipoCondicionPaciente').val())
        formData.append("edad", $('#txtEdadPaciente').val())
        formData.append("idEspecialidadMedico", $('#cboEspecialidadCita').val())
        formData.append("idMedicoIngreso", CitasAdmision.idMedico)
        formData.append("idServicioIngreso", $('#cboServicioCita').val())
        formData.append("idCuentaAtencion", idCuentaAtencion)
        formData.append("idFormaPago", $('#cboProductoPlan').val()) // Capturar el valor - 1 -> Contado
        formData.append("idFuenteFinanciamiento", $('#cboFuenteFinanciamientoCita').val())

        formData.append("idEstadoAtencion", estadoAtencion)
        formData.append("esPacienteExterno", 0)
        formData.append("idSunasaPacienteHistorico", $('#').val())
        formData.append("esDecretoUrgencia", 0)



        formData.append("DireccionDomicilio", $('#txtDireccionDomicilio').val())
        formData.append("NombreAcompaniante", '')
        formData.append("Observacion", $('#txtObservacionPaciente').val())
        //formData.append("ProximaCita", null)
        //formData.append("NumeroDeHijos", null)
        formData.append("IdSiaSis", $('#hdIdSiaSis').val()) //
        formData.append("FuaCodigoPrestacion", $('#cboCodPrestacion').val())
        formData.append("SisCodigo", $('#hdCodigo').val()) //
        //formData.append("IdTipoReferenciaDestino", null)
        formData.append("IdTipoReferenciaOrigen", $('#cboTipoReferenciaCita').val())
        //formData.append("IdEstablecimientoDestino", null)
        formData.append("IdEstablecimientoOrigen", $('#cboTipoReferenciaCita').val() == 1 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("IdEstablecimientoNoMinsaDestino", null)
        formData.append("IdEstablecimientoNoMinsaOrigen", $('#cboTipoReferenciaCita').val() == 2 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("HuboInfeccionIntraHospitalaria", )
        //formData.append("TieneNecropsia", null)
        //formData.append("IdMedicoRespNacimiento", null)

        //formData.append("RecienNacido", null)
        formData.append("NroReferenciaOrigen", $('#txtNroReferenciaCita').val())
        //formData.append("NroReferenciaDestino", null)

        return HttpClient.Post('/Atencion/CrearModificarCuentasAtenciones?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {
                    return res.data
                    Cargando(0)
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

    CrearModificarFacturacionCuentasAtencion: function (idPaciente, estadoAtencion) {
        let formData = new FormData();
        //formData.append("IdCuentaAtencion", $('#txtNroCuentaPaciente').val())
        formData.append("IdCuentaAtencion", $('#txtNroCuentaPaciente').val())
        //formData.append("TotalPorPagar", null)
        formData.append("IdEstado", estadoAtencion == 0 ? 9 : estadoAtencion)
        //formData.append("TotalPagado", null)
        //formData.append("TotalAsegurado", null)
        //formData.append("TotalExonerado", null)
        //formData.append("HoraCierre", null)
        //formData.append("FechaCierre", null)
        formData.append("HoraApertura", $('#txtHoraInicioCita').val())
        formData.append("FechaApertura", $('#txtFechaCita').val())
        formData.append("IdPaciente", idPaciente)
        formData.append("FechaCreacion", Date.now())

        return HttpClient.Post('/Atencion/CrearModificarFacturacionCuentasAtencion?area=ConsultaExterna', formData)
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
    CrearModificarAtenciones: function (idCuentaAtencion, idPaciente, estadoAtencion) {

        let objrow = oTable_medicosProgramados.api(true).row('.selected').data()
        let objrowCita = oTable_cupos.api(true).row('.selected').data()
        let formData = new FormData();


        formData.append("horaIngreso", $('#txtHoraInicioCita').val())
        formData.append("fechaIngreso", $('#txtFechaCita').val())
        formData.append("idTipoServicio", 1)
        formData.append("idPaciente", idPaciente)
        formData.append("idAtencion", objrowCita != 'undefined' ? objrowCita?.idAtencion : 0)
        formData.append("idTipoCondicionALEstab", $('#hdtipoCondicionPaciente').val())
        formData.append("idTipoEdad", $('#cboTipoEdadPaciente').val())
        formData.append("idOrigenAtencion", $('#cboTipoOrigenCita').val())
        formData.append("idTipoCondicionAlServicio", $('#hdtipoCondicionPaciente').val())
        formData.append("edad", $('#txtEdadPaciente').val())
        formData.append("idEspecialidadMedico", $('#cboEspecialidadCita').val())
        formData.append("idMedicoIngreso", CitasAdmision.idMedico)
        formData.append("idServicioIngreso", $('#cboServicioCita').val())
        formData.append("idCuentaAtencion", idCuentaAtencion)
        formData.append("idFormaPago", $('#cboProductoPlan').val()) // Capturar el valor - 1 -> Contado
        formData.append("idFuenteFinanciamiento", $('#cboFuenteFinanciamientoCita').val())

        formData.append("idEstadoAtencion", estadoAtencion)
        formData.append("esPacienteExterno", 0)
        formData.append("idSunasaPacienteHistorico", $('#').val())
        formData.append("esDecretoUrgencia", 0)

        return HttpClient.Post('/Atencion/CrearModificarAtenciones?area=ConsultaExterna', formData)
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
    CrearModificarAtencionesDatosAdicionales: function (idAtencion) { // JDELGADO003-C
        let formData = new FormData();

        formData.append("idAtencion", idAtencion)
        formData.append("DireccionDomicilio", $('#txtDireccionDomicilio').val())
        formData.append("NombreAcompaniante", '')
        formData.append("Observacion", $('#txtObservacionPaciente').val())
        //formData.append("ProximaCita", null)
        //formData.append("NumeroDeHijos", null)
        formData.append("IdSiaSis", $('#hdIdSiaSis').val()) //
        formData.append("FuaCodigoPrestacion", $('#cboCodPrestacion').val())
        formData.append("SisCodigo", $('#hdCodigo').val()) //
        //formData.append("IdTipoReferenciaDestino", null)
        formData.append("IdTipoReferenciaOrigen", $('#cboTipoReferenciaCita').val())
        //formData.append("IdEstablecimientoDestino", null)
        formData.append("IdEstablecimientoOrigen", $('#cboTipoReferenciaCita').val() == 1 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("IdEstablecimientoNoMinsaDestino", null)
        formData.append("IdEstablecimientoNoMinsaOrigen", $('#cboTipoReferenciaCita').val() == 2 ? $('#hdIdEstablecimientoReferenciaOrigen').val() : null)
        //formData.append("HuboInfeccionIntraHospitalaria", )
        //formData.append("TieneNecropsia", null)
        //formData.append("IdMedicoRespNacimiento", null)

        //formData.append("RecienNacido", null)
        formData.append("NroReferenciaOrigen", $('#txtNroReferenciaCita').val())
        //formData.append("NroReferenciaDestino", null)

        return HttpClient.Post('/Atencion/CrearModificarAtencionesDatosAdicionales?area=ConsultaExterna', formData)
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
    InsertFactCatalogo: async function (idCuentaAtencion, idPaciente) {

        let items = await CitasAdmision.FactCatalogoServiciosXidTipoFinanciamiento()
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

        formData.append('IdOrden', $('#hdIdOrden').val());
        formData.append('idOrdenPago', $('#hdIdOrdenPago').val());
        formData.append('IdPuntoCarga', 6);
        formData.append('IdPaciente', idPaciente);
        formData.append('IdCuentaAtencion', idCuentaAtencion);
        formData.append('IdServicioPaciente', $('#cboServicioCita').val());
        formData.append('idTipoFinanciamiento', $('#cboProductoPlan').val());
        formData.append('idFuenteFinanciamiento', $('#cboFuenteFinanciamientoCita').val());

        formData.append('IdEstadoFacturacion', 1);
        formData.append('FechaHoraRealizaCpt', CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio);
        formData.append('LstDetalleConsumo', JSON.stringify(detalleConsumo));
        formData.append('permiso', 1);

        return HttpClient.Post('/ConsumoServicio/InsertaFactOrdenServicio?area=Facturacion', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                if (res.estado) {
                    return res
                    Cargando(0)
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
    CitasAgregar: function (idAtencion, idPaciente) {
        let formData = new FormData();
        let objrow = oTable_medicosProgramados.api(true).row('.selected').data()
        let objrowCita = oTable_cupos.api(true).row('.selected').data()

        let date = new Date()
        let horas = date.getHours()
        let minutos = date.getMinutes()

        formData.append("HoraSolicitud", horas + ":" + minutos)
        formData.append("FechaSolicitud", CitasAdmision.fechaActual)
        formData.append("IdProducto", $('#cboTipoConsultaCita').val())
        formData.append("IdProgramacion", objrow.idProgramacion)
        formData.append("IdServicio", objrow.idServicio)

        if (CitasAdmision.esCitaAdicional == 0) {
            formData.append("HoraFin", objrowCita.turnoHoraFin.substr(0, 5))
            formData.append("HoraInicio", objrowCita.turnoHoraInicio.substr(0, 5))
            

        } else {
            formData.append("HoraFin", $('#txtHoraFinCita').val())
            formData.append("HoraInicio", $('#txtHoraInicioCita').val())
        }
       
        

        //formData.append("IdCita", objrowCita.idCita)
        formData.append("IdCita", 0)

        formData.append("Fecha", CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)
        formData.append("IdEstadoCita", 1)
        formData.append("IdMedico", objrow.idMedico)
        formData.append("IdEspecialidad", $('#cboEspecialidadCita').val())
        formData.append("IdAtencion", idAtencion) //
        formData.append("IdPaciente", idPaciente) //
        formData.append("EsCitaAdicional", CitasAdmision.esCitaAdicional) // Es cita adicional verificar
        formData.append("TipoCita", CitasAdmision.tipoCita) // Es cita adicional verificar

        return HttpClient.Post('/Citas/CitasAgregar?area=ConsultaExterna', formData)
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
    CitasModificar: function (idAtencion, idPaciente) {
        let formData = new FormData();
        let objrow = oTable_medicosProgramados.api(true).row('.selected').data()
        let objrowCita = oTable_cupos.api(true).row('.selected').data()

        let date = new Date()
        let horas = date.getHours()
        let minutos = date.getMinutes()

        formData.append("HoraSolicitud", horas + ":" + minutos)
        formData.append("FechaSolicitud", CitasAdmision.fechaActual)
        formData.append("IdProducto", $('#cboTipoConsultaCita').val())
        formData.append("IdProgramacion", objrow.idProgramacion)
        formData.append("IdServicio", objrow.idServicio)
        formData.append("HoraFin", objrowCita.turnoHoraFin.substr(0, 5))
        formData.append("HoraInicio", objrowCita.turnoHoraInicio.substr(0, 5))
        formData.append("IdCita", objrowCita.idCita)
        formData.append("Fecha", CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)
        formData.append("IdEstadoCita", 1)
        formData.append("IdMedico", objrow.idMedico)
        formData.append("IdEspecialidad", $('#cboEspecialidadCita').val())
        formData.append("IdAtencion", idAtencion) //
        formData.append("IdPaciente", idPaciente) //
        //formData.append("EsCitaAdicional", 0) // Es cita adicional verificar

        return HttpClient.Post('/Citas/CitasModificar?area=ConsultaExterna', formData)
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

        //.then(res => {
        //    if (res.estado) {
        //        alerta(1, 'Cita Modificada!')

        //        $('#btnCerrarModalCita').trigger("click")
        //        $("#modalTicket").modal('show')
        //        var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + res.idCita;
        //        $('#ifrmTicketCita').attr('src', url);

        //    } else {
        //        alerta(3, res.mensaje)
        //    }
        //    return res
        //})
        //.catch(e => {
        //    alerta(2, 'Error: ' + e)
        //})
    },
    CitasEliminar: function () {
        let formData = new FormData();
        let objrowCita = oTable_cupos.api(true).row('.selected').data()
        formData.append("idCita", objrowCita.idCita)

        return HttpClient.Post('/Citas/CitasEliminar?area=ConsultaExterna', formData)
            .then(res => {
                if (res.estado) {

                    $('#btnCerrarModalCita').trigger("click")

                } else {
                    alerta(3, res.mensaje)
                }
                return res
            })
            .catch(e => {
                alerta(2, 'Error: ' + e)
            })
    },


    CambiarEstadoRecetaDetalleInterconsulta(idReceta, idProducto, idEstado) {
        let formData = new FormData()
        formData.append('idReceta', idReceta)
        formData.append('idProducto', idProducto)
        formData.append('idEstado', idEstado)
        return HttpClient.Post('/Receta/CambiarEstadoRecetaDetalleInterconsulta?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
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













    SeleccionarServicioById: function (idServicio) {
        var formData = new FormData();
        formData.append('idServicio', idServicio)

        return HttpClient.Post('/Citas/SeleccionarServicioById?area=ConsultaExterna', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
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
    ListaEstablecimientosByCodigo: function (codigo) {
        Cargando(1)
        let formData = new FormData();
        formData.append('codigo', codigo)

        return HttpClient.Post('/Utilitario/ListaEstablecimientosByCodigo?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
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
    ListaDepartamentosReferencia: async function () {
        HttpClient.Get('/Utilitario/ListaDepartamentos?area=Comun').then(res => {
            $('#cmbdepEstbuscar').empty();
            $(res.lsDeparta.table).each(function (i, obj) {
                $('#cmbdepEstbuscar').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
            })

            $(`#cmbdepEstbuscar`).val(15);
            $('.chzn-select').chosen().trigger("chosen:updated");

            RegistroPaciente.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
        })

    },
    ListarTipoServicio: function () {
        return HttpClient.Get('/Utilitario/listarTipoServicio?area=Comun').then(res => {
            $('#cboTipoServicioCita').empty();
            $(res.data.table).each(function (i, obj) {
                $('#cboTipoServicioCita').append(`<option value="${obj.valor}">${obj.descripcion}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated")
            $(`#cboTipoServicioCita option[value='1']`).attr("selected", true)
        })
    },
    ListarDepartamentosHospital: function () {

        return HttpClient.Get('/Citas/listarDepartamentosHospital?area=ConsultaExterna').then(res => {

        })
    },
    ListaServicios: (dia, mes, anio) => {

        var midata = new FormData();
        midata.append('fecha', dia + '/' + mes + '/' + anio);
        Cargando(1);
        $.ajax({
            method: "POST",
            url: "/Atencion/ListaProgramacionBtFecha?area=ConsultaExterna",
            data: midata,
            dataType: "json",
            processData: false,
            contentType: false,
            async: false,
            success: function (datos) {
                Cargando(0);
                $('#cboConsultorio').empty();
                var servicios = datos.table

                //$(servicios).each(function (i, obj) {
                //    $('#cboConsultorio').append('<option status="' + obj.statusFirma + '" code="' + obj.code + '" prog="' + obj.idProgramacion + '" med="' + obj.medico + '" idEmpleado="' + obj.idEmpleado + '" idEspecialidad="' + obj.idEspecialidad + '"  value="' + obj.valor + '">' + obj.nombreServicio + '</option>');
                //});

                $('#cboDepartamentosHospital').empty();
                $('#cboDepartamentosHospital').append(`<option value="0">--Seleccionar--</option>`)
                $(servicios).each(function (i, obj) {
                    $('#cboDepartamentosHospital').append(`<option value="${obj.valor}">${obj.nombreServicio}</option>`)
                })
                $('.chzn-select').chosen().trigger("chosen:updated");

            },
            error: function (msg) {
                setTimeout(function () {
                    Cargando(0);
                    alerta("ERROR", "Error listar servicios!", "2");
                }, 900)
            }
        });

    },

    //MGAMERO
    ListarDepartamentoHospitalario: function() {
        let formData = new FormData();
        //formData.append("lcFiltro", " where IdEstado = 1 order by IdDepartamento") 
        formData.append("tipoListado", 2) 
        return HttpClient.Post('/Departamentos/ListarDepartamentos?area=General', formData).then(res => {
            $('#cboDepartamentoHospital').empty();
            $('#cboDepartamentoHospital').append(`<option value="0">--Seleccionar--</option>`)
            $(res?.lsResultado?.table).each(function(i, obj) {
                $('#cboDepartamentoHospital').append(`<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    //MGAMERO
    ListarEspecialidadPorDepartamento: function() {
        let IdDepartamento = $('#cboDepartamentoHospital').val();

        $('#cboEspecialidad').html('<option value="0">--Seleccionar--</option>');
        $('.chzn-select').trigger("chosen:updated");

        if (!IdDepartamento || IdDepartamento === "0") return;

        let formData = new FormData();
        formData.append("lcFiltro", ` where IdEstado = 1 AND IdDepartamento = ${IdDepartamento} order by Nombre`);

        return HttpClient.Post('/Citas/listarEspecialidadPorDepartamento?area=ConsultaExterna', formData).then(res => {
            $(res.dataSet.table).each((i, obj) => {
                $('#cboEspecialidad').append(`<option value="${obj.idEspecialidad}">${obj.descripcionLarga}</option>`);
            });

            $('.chzn-select').trigger("chosen:updated");
        });
    },
    //MGAMERO
    ListarMedicosPorFiltroConEspecialidad: function() { //  AND Especialidades.IdEspecialidad = ${IdEspecialidad}
        //let IdEspecialidad = $('#cboEspecialidad').val();

        $('#cboMedico').html('<option value="0">--Seleccionar--</option>');
        $('.chzn-select').trigger("chosen:updated");

        //if (!IdEspecialidad || IdEspecialidad === "0") return;

        let formData = new FormData();
        formData.append("lcFiltro", ` where EsActivo = 1 order by Nombre`);

        return HttpClient.Post('/Citas/listarMedicosPorFiltroConEspecialidad?area=ConsultaExterna', formData).then(res => {
            $(res.dataSet.table).each(function(i, obj) {
                $('#cboMedico').append(`<option value="${obj.idmedico}">${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    /*
    ListarMedicosPorFiltroConEspecialidad: function () {

        return HttpClient.Get('/Citas/listarMedicosPorFiltroConEspecialidad?area=ConsultaExterna').then(res => {
            $('#cboMedico').empty();
            $('#cboMedico').append(`<option value="0">--Seleccionar--</option>`)
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboMedico').append(`<option value="${obj.idmedico}">${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },*/


    ListarProgramacionMedicaPorIdMedicoMesAnio: function (idMedico, mes, anio, idServicio) {
        let formData = new FormData();

        formData.append("idMedico", idMedico)
        formData.append("mes", mes)
        formData.append("anio", anio)
        formData.append("idServicio", idServicio)

        return HttpClient.Post('/Citas/ProgramacionMedicaPorIdMedicoMesAnio?area=ConsultaExterna', formData).then(res => {
            $('#calendar').fullCalendar('removeEvents')
            $(res.dataSet.table).each(function (i, obj) {
                console.log('fecha para probar', obj)
                $("#calendar").fullCalendar('renderEvent',
                    {
                        start: obj.fecha.substr(0, 10),
                        end: obj.fecha.substr(0, 10),
                        overlap: false,
                        rendering: 'background',
                        title: '<i class="fa fa-edit"></i>',
                        color: '#7fcbfb'

                    });

                $("#calendar").fullCalendar('renderEvent',
                    {
                        start: obj.fecha.substr(0, 10),
                        end: obj.fecha.substr(0, 10),
                        overlap: false,
                        //rendering: 'background',
                        title: `<b style="font-size: 11px"><i class="far fa-clock" style="text-center"></i> ${obj.turno} / ${obj.cuposLibres}</b>`,
                        color: '#fff0'

                    });
            })
        })
    },
    ListarFuentesFinanciamientoSegunFiltro: function () {

        return HttpClient.Get('/Citas/listarFuentesFinanciamientoSegunFiltro?area=consultaexterna').then(res => {
            $('#cboFuenteFinanciamientoCita').empty()
            $('#cboFuenteFinanciamientoCita').append(`<option value="0">--Seleccionar--</option>`)
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboFuenteFinanciamientoCita').append(`<option value="${obj.idFuenteFinanciamiento}">${obj.descripcion}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated")
        })
    },
    ListarTiposFinanciamientosTarifaSeleccionarPorPlan: function (idFuenteFinanciamiento) {
        let formData = new FormData();
        formData.append("idFuenteFinanciamiento", idFuenteFinanciamiento)

        return HttpClient.Post('/Citas/listarTiposFinanciamientosTarifaSeleccionarPorPlan?area=ConsultaExterna', formData).then(res => {
            $('#cboProductoPlan').empty();
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboProductoPlan').append(`<option value="${obj.idTipoFinanciamiento}">${obj.descripcion}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    ListarSisServiciosSeleccionarPorFiltro: function () {
        return HttpClient.Get('/Citas/listarSisServiciosSeleccionarPorFiltro?area=ConsultaExterna').then(res => {
            $('#cboCodPrestacion').empty();
            $('#cboCodPrestacion').append(`<option value="0">--Seleccionar--</option>`)
            /*$(res.dataSet.table).each(function (i, obj) {
                $('#cboCodPrestacion').append(`<option value="${obj.dServicioCodigo}">${obj.dServicioCodigo} - ${obj.dServicio}</option>`)
            })*/
            $(res.dataSet.table).each(function (i, obj) {
                var codigo = obj.dServicioCodigo;

                if ($('#cboCodPrestacion option[value="' + codigo + '"]').length === 0) {
                    $('#cboCodPrestacion').append(
                        '<option value="' + codigo + '">' +
                        codigo + ' - ' + obj.dServicio +
                        '</option>'
                    );
                }
            });

        })
    },
    ListarTiposReferenciaSeleccionarTodos: function () {
        return HttpClient.Get('/Citas/listarTiposReferenciaSeleccionarTodos?area=ConsultaExterna').then(res => {
            $('#cboTipoReferenciaCita').empty();
            $('#cboTipoReferenciaCita').append(`<option value="0">--Seleccionar--</option>`)
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboTipoReferenciaCita').append(`<option value="${obj.idTipoReferencia}">${obj.descripcion}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    ListarTipoFormatoSIS: function () {
        return HttpClient.Get('/Citas/listarTipoFormatoSIS').then(res => {
            $('#cboTipoAfiliacion').empty();
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboTipoAfiliacion').append(`<option value="${obj.lot_IdTablaSiasis}">${obj.com_Descripcion} - ${obj.tfrm_Descripcion}</option>`)
            })
            $(`#cboTipoAfiliacion option[value='7']`).attr("selected", true);
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    ListarAfiliadosSis: function () {
        let formData = new FormData();

        if ($('#txtDni').val() != '' && $('#chbBusquedaSis').is(':checked')) {
            formData.append("disa", '250')
            formData.append("tipoFormato", '2')
            formData.append("contrato", $('#txtDni').val())
            formData.append("tipoTabla", $('#cboTipoAfiliacion').val())
        } else {
            formData.append("disa", $('#txtDisa').val())
            formData.append("tipoFormato", $('#txtTipo').val())
            formData.append("contrato", $('#txtNroAfiliacion').val())
            formData.append("tipoTabla", $('#cboTipoAfiliacion').val())
        }
        Cargando(1)
        return HttpClient.Post('/Sis/ListarAfiliadosSis', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    Cargando(0)
                    return res.data.body.buscarAseguradosResult
                } else {
                    alerta(2, 'PROBLEMAS CON LA WEB \n Hay problemas con el Web Service del SIS')
                    Cargando(0)
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })
    },

    ConsultarAfiliadoFuaE: async function (intOpcion, strTipoDocumento, strNroDocumento, strDisa, strTipoFormato, strNroContrato, strCorrelativo) {

        let formData = new FormData();

        formData.append("intOpcion", intOpcion)
        formData.append("strTipoDocumento", strTipoDocumento)
        formData.append("strNroDocumento", strNroDocumento)
        formData.append("strDisa", strDisa)
        formData.append("strTipoFormato", strTipoFormato)
        formData.append("strNroContrato", strNroContrato)
        formData.append("strCorrelativo", strCorrelativo)

        return HttpClient.Post('/MicroServicios/ConsultarAfiliadoFuaE', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    ConsultarAfiliadoIAFAS: async function (strNroDocumento) {

        let formData = new FormData();

        formData.append("nroDocumento", strNroDocumento)
    
        return HttpClient.Post('/MicroServicios/ConsultarAfiliadoIAFAS', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    ConsultarAfiliadoPN: async function (strNroDocumento) {

        let formData = new FormData();

        formData.append("nroDocumento", strNroDocumento)
    
        return HttpClient.Post('/Paciente/SelectBuscarFuentePorDNI?comun=ConsultaExterna', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res
                } else {
                    return null
                }
            })
            .catch(e => {
                alerta(3, 'Error: ' + e)
            })

    },

    SeleccionarAfiliacionSis: function () {
        Cargando(1)
        let formData = new FormData();

        formData.append("disa", '250')
        formData.append("tipoFormato", '2')
        formData.append("contrato", $('#txtDniPaciente').val())
        formData.append("tipoTabla", 7)

        Cargando(1)
        return HttpClient.Post('/Sis/ListarAfiliadosSis', formData)
            .then(res => {
                console.log('res', res)
                if (res.estado) {
                    //alerta(1, res.msg)
                    Cargando(0)
                    return res.data.body.buscarAseguradosResult
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
    TiposEdadSeleccionarTodos: function () {
        return HttpClient.Get('/Utilitario/TiposEdadSeleccionarTodos?area=Comun').then(res => {

            $('#cboTipoEdadCita').empty();
            $('#cboTipoEdadCita').append(`<option value="0">--Seleccionar--</option>`)
            $(res.data.table).each(function (i, obj) {
                $('#cboTipoEdadCita').append(`<option value="${obj.idTipoEdad}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated")
        })
    },
    ListarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos: function () {
        return HttpClient.Get('/Utilitario/listarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos?area=Comun').then(res => {
            $('#cboTipoOrigenCita').empty();
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboTipoOrigenCita').append(`<option value="${obj.idOrigenAtencion}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },
    PacientesFiltraPorNroDocumentoYtipoFiltro: function () {
        let formData = new FormData()

        formData.append("nroDocumento", $('#txtDniPaciente').val())
        formData.append("idDocIdentidad", $('#cboTipoDocPaciente').val())
        return HttpClient.Post('/Citas/PacientesFiltraPorNroDocumentoYtipo?area=ConsultaExterna', formData).then(res => {
            if (res.data.table.length > 0) {
                alerta(2, `El N° DOCUMENTO ya existe para el Paciente: ${res.dataSet.table[0].apellidoPaterno} ${res.dataSet.table[0].apellidoMaterno} ${res.dataSet.table[0].primerNombre}`)
                $('#txtDniPaciente').focus()
            }
            Cargando(0)
        })
    },
    BuscarPacienteReniec: function () { // JDELGADO003
        let formData = new FormData();

        formData.append("dniAuto", $('#').val())
        formData.append("dniCon", $('#txtDni').val())

        return HttpClient.Post('/Sis/listarReniec?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
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

    ListarCuposV2: async function (idProgramacion) {
        let formData = new FormData();
        formData.append("idProgramacion", idProgramacion)

        return HttpClient.Post('/Citas/listarCupos?area=Comun', formData).then(res => {
            oTable_cupos.fnClearTable()
            if (res.dataSet.table.length > 0) {

                CitasAdmision.totalCupos = res.dataSet.table.length
                CitasAdmision.cuposAsignados = 0
                console.log('res.dataSet.table', res.dataSet.table)

                $(res.dataSet.table).each((index, obj) => {
                    if (obj.idEstadoCita != 0 && obj.idEstadoCita != 0) {
                        CitasAdmision.cuposAsignados += 1
                    }
                })

                oTable_cupos.fnAddData(res.dataSet.table)

                $('#spCuposLibres').text("Cupos Libres: " + (CitasAdmision.totalCupos - CitasAdmision.cuposAsignados))
                $('#spCuposAsignados').text("Cupos Asignados: " + CitasAdmision.cuposAsignados)

                $('#spNroCuposLibres').text((CitasAdmision.totalCupos - CitasAdmision.cuposAsignados))
                $('#spNroCuposAsignados').text(CitasAdmision.cuposAsignados)

                if ((CitasAdmision.totalCupos - CitasAdmision.cuposAsignados) == 0) {
                    $('#btnCitaAdicional').attr('disabled', false)
                } else {
                    $('#btnCitaAdicional').attr('disabled', true)
                }
            }
        })
    },
    ObtenerTurnosSeleccionarPorId: function (idTurno) {
        let formData = new FormData();
        formData.append("idTurno", idTurno)

        return HttpClient.Post('/Citas/obtenerTurnosSeleccionarPorId?area=ConsultaExterna', formData).then(res => {
            return res.dataSet.table
        })
    },
    ObtenerEspecialidadCEseleccionarIdServicio: function (idServicio) {
        let formData = new FormData();
        formData.append("idServicio", idServicio)

        return HttpClient.Post('/citas/obtenerEspecialidadCEseleccionarIdServicio?area=ConsultaExterna', formData).then(res => {
            return res.dataSet.table
        })
    },
    ObtenerMedicosSeleccionarPorIdMedicoPlanilla: function (idMedico) {
        let formData = new FormData();
        formData.append("idMedico", idMedico)

        return HttpClient.Post('/Citas/obtenerMedicosSeleccionarPorIdMedicoPlanilla?area=ConsultaExterna', formData).then(res => {
            if (res.estado) {
                if (res.data.table.length > 0) {
                    return res.data.table[0]
                } else {
                    return null
                }

            } else {
                alerta(2, res.msg)
                return null
            }

        })
    },
    ObtenerEspecialidadesSeleccionarPorMedico: async function (idMedico) {
        let formData = new FormData();
        formData.append("idMedico", idMedico)

        return HttpClient.Post('/Citas/obtenerEspecialidadesSeleccionarPorMedico?area=ConsultaExterna', formData).then(res => {
            return res.dataSet.table
        })
    },
    ObtenerEspecialidadesSeleccionarPorMedicoV2: async function (idMedico) {
        let formData = new FormData();
        formData.append("idMedico", idMedico)

        return HttpClient.Post('/Citas/obtenerEspecialidadesSeleccionarPorMedico?area=ConsultaExterna', formData).then(res => {
            $('#cboEspecialidadCita').empty()
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboEspecialidadCita').append(`<option value="${obj.idEspecialidad}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated")
        })
    },
    CitasBloqueadasByFecha: function (fecha) {
        var formData = new FormData();
        formData.append('fecha', fecha);

        return HttpClient.Post('/Citas/CitasBloqueadasByFecha?area=ConsultaExterna', formData).then(res => {
            return res.dataSet.table
        })
    },
    EliminarCitaBloqueada: function () { // mejorar codigo desde el controlador
        objrowCita = oTable_cupos.api(true).row('.selected').data()

        let formData = new FormData();
        formData.append("idCitaBloqueada", objrowCita.idCitaBloquear)

        return HttpClient.Post('/Citas/CitasBloqueadasEliminar?area=ConsultaExterna', formData).then(res => {
            console.log("Se elimino cita bloqueada desde actualizar")
        })
    },
    DesbloquearCupo: async function () {
        let filaCupoSeleccionada = oTable_cupos.api(true).row('.selected')
        let objrowCita = filaCupoSeleccionada.data()

        if (isEmpty(objrowCita)) {
            alerta(2, 'Seleccione un cupo para desbloquear')
            return false
        }

        if (parseInt(objrowCita.idEstadoCita) != 6) {
            alerta(2, 'El cupo seleccionado no se encuentra bloqueado')
            return false
        }

        Cargando(1)
        let idCitaBloqueada = objrowCita.idCita

        objrowCita.idEstadoCita = "0"
        objrowCita.idCita = null
        objrowCita.idCitaBloquear = null

        filaCupoSeleccionada.data(objrowCita)

        let nroCupo = objrowCita.id < 10 ? '0' + objrowCita.id : objrowCita.id
        let NroCupoCita = "<div style='width:25px;line-height: 15px;'><span>[" + nroCupo + "]</span></div>";
        let EstadoCita = "<span class='mr-1'>Estado: DISPONIBLE</span>";
        let HorarioCita = "<span class='mr-1'>" + objrowCita.turnoHoraInicio.substr(0, 5) + " - " + objrowCita.turnoHoraFin.substr(0, 5) + "</span>";
        let InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
        let InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
        let InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
        let InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
        InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

        let filaNodo = $(filaCupoSeleccionada.node())
        let celdaCupo = $(filaNodo).children()[0]

        $(celdaCupo).css('background', '#6fcf72')
        $(celdaCupo).html("<b>" + InfoCupoCita + "</b>")

        oTable_cupos.$('tr.selected').removeClass('selected')
        filaNodo.addClass('selected')
        $(celdaCupo).addClass("day-highlight")

        alerta(1, 'Cupo desbloqueado correctamente')
        Cargando(0)
    },
    ListarServiciosSeleccionarConsultoriosPorEspecialidad: function (idEspecialidad) {
        let formData = new FormData();
        formData.append("idEspecialidad", idEspecialidad)

        return HttpClient.Post('/Citas/listarServiciosSeleccionarConsultoriosPorEspecialidad?area=consultaexterna', formData).then(res => {
            $('#cboServicioCita').empty()
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboServicioCita').append(`<option value="${obj.idServicio}">${obj.descripcionLarga}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated")
        })
    },
    ListarFactCatalogoServiciosSeleccionarTipoConsulta: function (idEspecialidad) {
        let formData = new FormData();
        formData.append("idEspecialidad", idEspecialidad)

        return HttpClient.Post('/Citas/listarFactCatalogoServiciosSeleccionarTipoConsulta?area=ConsultaExterna', formData).then(res => {
            $('#cboTipoConsultaCita').empty();
            $(res.dataSet.table).each(function (i, obj) {
                $('#cboTipoConsultaCita').append(`<option value="${obj.idProducto}">${obj.descripcion}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
        })
    },


    web_buscarEstablecimientoPorTipoMinsa: function (idTipo, idEstablecimiento) {
        var formData = new FormData();
        formData.append('idTipo', idTipo);
        formData.append('idEstablecimiento', idEstablecimiento);

        return HttpClient.Post('/Atencion/web_buscarEstablecimientoPorTipoMinsa', formData).then(res => {
            return res.dataSet.table[0]
        })
    },
    
    FactOrdenServicioFiltraPorIdCuenta: function (idCuentaAtencion) {
        var formData = new FormData();
        formData.append('idCuentaAtencion', idCuentaAtencion);

        return HttpClient.Post('/ConsumoServicio/FactOrdenServicioFiltraPorIdCuenta', formData).then(res => {
            if (res.dataSet.table.length > 0) {
                return res.dataSet.table
            }
            return null
        })
    },
    CatalogoServiciosSeleccionarSoloConPreciosEnParticular: function (idPuntoCarga, idFarmacia) {
        let formData = new FormData();
        formData.append('idPuntoCarga', idPuntoCarga)
        formData.append('idFarmacia', idFarmacia)

        return HttpClient.Post('/Catalogo/CatalogoServiciosSeleccionarSoloConPreciosEnParticularV2', formData).then(res => {
            return res
        })
    },
    ListarProcedimientosInterconsulta: function () {
        return HttpClient.Get('/Receta/ListarProcedimientosInterconsulta').then(res => {
            $('#cboTipoConsultaCita').empty();
            if (res.data.table.length > 0) {
                $(res.data.table).each(function (i, obj) {
                    $('#cboTipoConsultaCita').append(`<option value="${obj.idProducto}">${obj.descripcion}</option>`)
                })
            }
            $('.chzn-select').chosen().trigger("chosen:updated");

        })
    },
    FactCatalogoServiciosXidTipoFinanciamiento: function () {
        let formData = new FormData();
        formData.append("idProducto", $('#cboTipoConsultaCita').val())
        formData.append("idTipoFinanciamiento", $('#cboProductoPlan').val())

        return HttpClient.Post('/Utilitario/FactCatalogoServiciosXidTipoFinanciamiento?area=Comun', formData).then(res => {
            if (res.dataSet.table.length > 0) {
                return res.dataSet.table
            } else {
                return null
            }

        })
    },

    ListaRecetasInterconsulta: function (nroOrden, idEspecialidad) {
        let formData = new FormData();
        formData.append('nroOrden', nroOrden)
        formData.append('idEspecialidad', idEspecialidad)

        return HttpClient.Post('/Citas/ListaRecetasInterconsulta', formData).then(res => {
            if (res.dataSet.table.length > 0) {
                return res.dataSet.table
            }
            return null
        })
    },

    PacientesFiltraPorNroDocumentoYtipo: function () {
        let formData = new FormData();
        formData.append("nroHistoriaClinica", $('#txtNroHistoria').val())
        formData.append("apellidoPaterno", $('#txtApellidoPaterno').val())
        formData.append("apellidoMaterno", $('#txtApellidoMaterno').val())
        formData.append("primerNombre", $('#txtPrimerNombre').val())
        formData.append("segundoNombre", $('#txtSegundoNombre').val())
        formData.append("idDocIdentidad", $('#txtDni').val().trim().length == 8 ? 1 : 2)
        formData.append("nroDocumento", $('#txtDni').val())

        return HttpClient.Post('/Citas/PacientesFiltraPorNroDocumentoYtipo?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
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
    PacientesFiltrarTodosSoloHistoriasDefinitivas: function () {
        let formData = new FormData();
        formData.append("nroHistoriaClinica", $('#txtNroHistoria').val())
        formData.append("apellidoPaterno", $('#txtApellidoPaterno').val())
        formData.append("apellidoMaterno", $('#txtApellidoMaterno').val())
        formData.append("primerNombre", $('#txtPrimerNombre').val())
        formData.append("segundoNombre", $('#txtSegundoNombre').val())
        formData.append("idDocIdentidad", 1)
        formData.append("nroDocumento", $('#txtDni').val())

        return HttpClient.Post('/Citas/PacientesFiltrarTodosSoloHistoriasDefinitivas', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res
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
    PacientesSeleccionarPorId: function (idPaciente) {
        let formData = new FormData();
        formData.append("idPaciente", idPaciente)
        return HttpClient.Post('/Paciente/PacientesSeleccionarPorId', formData)
            .then(res => {
                //PacientesDatosAdicionalesPersonalesAgregar(res.idPaciente, 0) -- habilitar luego
                Cargando(0)
                if (res.estado) {
                    if (res.data.table.length > 0) {
                        return res.data.table[0]
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
    AtencionesDatosAdicionalesSeleccionarPorIdCuenta: function (idCuenta) {
        var formData = new FormData();
        formData.append('idCuentaAtencion', idCuenta);
        return HttpClient.Post('/Atencion/web_AtencionesDatosAdicionalesSeleccionarPorIdCuenta', formData).then(res => {
            return res.dataSet.table[0]
        })
    },
    ListaAtencionByCuenta: function (idCuenta) {
        var formData = new FormData();
        formData.append('idCuenta', idCuenta);
        return HttpClient.Post('/Atencion/ListaAtencionByIdCuentaAtencion', formData).then(res => {
            return res.lstAtenciones.table[0]
        })
    },
    ListarMedicosFiltrarPorProgramacion: function (dia, mes, anio) {
        let formData = new FormData();

        let lcFiltro = `WHERE dbo.ProgramacionMedica.Fecha = CONVERT(DATETIME,'${dia + '/' + mes + '/' + anio}',103) `

        if ($('#cboDepartamentoHospital').val() != '0' && !isEmpty($('#cboDepartamentoHospital').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdDepartamento = ${$('#cboDepartamentoHospital').val()} `
        }
        if ($('#cboEspecialidad').val() != '0' && !isEmpty($('#cboEspecialidad').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdEspecialidad = ${$('#cboEspecialidad').val()} `
        }
        if ($('#cboMedico').val() != '0' && !isEmpty($('#cboMedico').val())) {
            lcFiltro += ` and dbo.Medicos.IdMedico = ${$('#cboMedico').val()} `
        }
        if ($('#cboDepartamentosHospital').val() != '0' && !isEmpty($('#cboDepartamentosHospital').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdServicio = ${$('#cboDepartamentosHospital').val()} `
        }

        lcFiltro += ` and dbo.Servicios.activaProcedimiento=0 ORDER BY dbo.Servicios.Nombre`
        console.log('lcFiltro', lcFiltro)

        formData.append("lcFiltro", lcFiltro)

        return HttpClient.Post('/Citas/listarmedicosfiltrarporprogramacion?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {
                        return res.data.table
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

    ListarMedicosFiltrarPorProgramacionV2: function (dia, mes, anio) {
        let formData = new FormData();

        let lcFiltro = `WHERE dbo.ProgramacionMedica.Fecha = CONVERT(DATETIME,'${dia + '/' + mes + '/' + anio}',103) `

        if ($('#cboDepartamentoHospital').val() != '0' && !isEmpty($('#cboDepartamentoHospital').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdDepartamento = ${$('#cboDepartamentoHospital').val()} `
        }
        if ($('#cboEspecialidad').val() != '0' && !isEmpty($('#cboEspecialidad').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdEspecialidad = ${$('#cboEspecialidad').val()} `
        }
        if ($('#cboMedico').val() != '0' && !isEmpty($('#cboMedico').val())) {
            lcFiltro += ` and dbo.Medicos.IdMedico = ${$('#cboMedico').val()} `
        }
        if ($('#cboDepartamentosHospital').val() != '0' && !isEmpty($('#cboDepartamentosHospital').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdServicio = ${$('#cboDepartamentosHospital').val()}`
        }

        lcFiltro += ` and dbo.Servicios.activaProcedimiento=0 ORDER BY dbo.Servicios.Nombre`
        lcFiltro += ``

        formData.append("lcFiltro", lcFiltro)

        oTable_medicosProgramados.fnClearTable()
        oTable_cupos.fnClearTable()
        oTable_pacientesCitas.fnClearTable()
        return HttpClient.Post('/Citas/listarmedicosfiltrarporprogramacion?area=Comun', formData)
            .then(res => {
                if (!isEmpty(res)) {
                    if (res.estado) {

                        if (res.data.table.length > 0) {

                            oTable_medicosProgramados.fnAddData(res.data.table)

                            $('#tblMedicosProgramados tbody tr:first').addClass('selected')

                            let objrow = oTable_medicosProgramados.api(true).row('.selected').data();

                            CitasAdmision.CargarDatosGenerales(objrow)
                        } else {
                            alerta(4, `No hay medicos programados para la fecha (${dia}/${mes}/${anio})`)
                        }

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

    MostrarProgramacionMedica: async function (dia, mes, anio) {
        let objRow
        let especialidadByServicio = []
        let turno

        Cargando(1)

        objRow = oTable_medicosProgramados.api(true).row('.selected').data()

        if (!isEmpty(objRow)) {
            await CitasAdmision.ListarProgramacionMedicaPorIdMedicoMesAnio(objRow.idMedico, mes, anio, objRow.idServicio)
            await CitasAdmision.ListarCitasSeleeccionarPacientePorMedicoFechaHorasV2(objRow.idMedico, anio + '/' + mes + '/' + dia, objRow.horaInicio, objRow.horaFin)
            await CitasAdmision.ObtenerEspecialidadesSeleccionarPorMedicoV2(objRow.idMedico)

            especialidadByServicio = await CitasAdmision.ObtenerEspecialidadCEseleccionarIdServicio(objRow.idServicio)
            turno = await CitasAdmision.ObtenerTurnosSeleccionarPorId(objRow.idturno)

            //await CitasAdmision.ListarCitasSeleccionarPorMedicoYFecha(objrow.idMedico, anio + '/' + mes + '/' + dia)
            await CitasAdmision.ListarServiciosSeleccionarConsultoriosPorEspecialidad(especialidadByServicio[0].idEspecialidad)
            await CitasAdmision.ListarFactCatalogoServiciosSeleccionarTipoConsulta(especialidadByServicio[0].idEspecialidad)
            await CitasAdmision.ListarCuposV2(objRow.idProgramacion)


            //$(`#cboEspecialidadCita`).attr("selected", true);
            $(`#cboEspecialidadCita`).val(especialidadByServicio[0].idEspecialidad)
            $('.chzn-select').chosen().trigger("chosen:updated")
            $('#lblEspecialidadMedica').html(`( Esp: ${$('#cboEspecialidadCita>option:selected').text()} )`)
            $('#lblTurnoMedico').html(`(Turno: ${turno[0].codigo} de ${turno[0].horaInicio} a ${turno[0].horaFin})`)
            $('#lblMedico').html(`Medico: ${objRow.nombre}`)
            $('#lblNombreMedico').html(`${objRow.nombre.substr(0, objRow.nombre.indexOf('('))} `)
        }

        Cargando(0)
    },


    ListarCitasSeleccionarPorMedicoYFecha: function (idMedico, fecha) { // mejorar codigo
        let formData = new FormData();

        formData.append("idMedico", idMedico)
        formData.append("fecha", fecha)

        fetch('/citas/listarCitasSeleccionarPorMedicoYFecha?area=consultaexterna', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .catch(error => console.error('error:', error))
            .then(response => {

                //console.log(response)

            });
    },
    ListarCitasSeleeccionarPacientePorMedicoFechaHoras: function (idMedico, fecha, horaInicio, horaFin) {
        let formData = new FormData()
        formData.append("idMedico", idMedico)
        formData.append("fecha", fecha)
        formData.append("horaInicio", horaInicio)
        formData.append("horaFin", horaFin)

        return HttpClient.Post('/Citas/listarCitasSeleeccionarPacientePorMedicoFechaHoras?area=ConsultaExterna', formData).then(res => {
            return res.dataSet.table
        })
    },
    ListarCitasSeleeccionarPacientePorMedicoFechaHorasV2: function (idMedico, fecha, horaInicio, horaFin) {
        let formData = new FormData()
        formData.append("idMedico", idMedico)
        formData.append("fecha", fecha)
        formData.append("horaInicio", horaInicio)
        formData.append("horaFin", horaFin)

        return HttpClient.Post('/Citas/listarCitasSeleeccionarPacientePorMedicoFechaHoras?area=ConsultaExterna', formData).then(res => {
            oTable_pacientesCitas.fnClearTable()

            CitasAdmision.nroNuevos = 0
            CitasAdmision.nroContinuadores = 0
            CitasAdmision.nroReingresantes = 0

            if (res.dataSet.table.length > 0) {

                $(res.dataSet.table).each((index, obj) => {
                    console.log('obj', obj)
                    if (obj.especialidad == 'NUEVO') {
                        CitasAdmision.nroNuevos += 1
                    }
                    if (obj.especialidad == 'CONTINUADOR') {
                        CitasAdmision.nroContinuadores += 1
                    }
                    if (obj.especialidad == 'REINGRESANTE') {
                        CitasAdmision.nroReingresantes += 1
                    }
                })

                oTable_pacientesCitas.fnAddData(res.dataSet.table)

            }

            //$('#spNroContinuadores').text('Nro de Continuadores: ' + CitasAdmision.nroContinuadores)
            //$('#spNroNuevos').text('Nro de Nuevos: ' + CitasAdmision.nroNuevos)
            //$('#spNroReingresantes').text('Nro de Reingresantes: ' + CitasAdmision.nroReingresantes)

            $('#spNroPacContinuadores').text(CitasAdmision.nroContinuadores)
            $('#spNroPacNuevos').text(CitasAdmision.nroNuevos)
            $('#spNroPacReingresantes').text(CitasAdmision.nroReingresantes)
        })
    },
    ListaPacienteTieneCitaByIdPacienteIdServicio: function (idPaciente, idServicio, fechaCita) { // JDELGADO010
        let formData = new FormData();
        formData.append('idPaciente', idPaciente);
        formData.append('idServicio', idServicio);
        formData.append('fechaCita', fechaCita);

        return HttpClient.Post('/Citas/ListaPacienteTieneCitaByIdPacienteIdServicio?area=Comun', formData)
            .then(res => {
                if (res.estado) {
                    //alerta(1, res.msg)
                    return res.data.table
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


    ////////////////////////////////////KHOYOSI///////////////////////////////////////////////////////////////////////////
    async ListarVentanillas() {
        var midata = new FormData();

        let datos;
        try {
            Cargando(1);
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListarVentanillas?area=Comun",
                    data: null,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            $(datos.respuesta.table).each(function (i, obj) {
                $('#cboVentanillas').append(`<option value="${obj.idVentanilla}">${obj.codigo} - ${obj.nombre}</option>`)
            })
            $('.chzn-select').chosen().trigger("chosen:updated");
            Cargando(0);
            //console.log(datos);
        } catch (error) {
            Cargando(0);
            //console.error(error)
            alerta2("danger", "", JSON.stringify(error));
            return false;
        }
    },

    async CargarTurnosPorVentanilla() {
        var midata = new FormData();
        midata.append('idVentanilla', CitasAdmision.IdVentanilla);

        let datos;
        try {
            //Cargando(1);
            //oTable_PacientesEnCola.fnClearTable();            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/ListaTurnosPorVentanilla?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            //console.log(datos.respuesta.table);            
            if (datos.respuesta.table.length > 0) {
                //oTable_PacientesEnCola.fnAddData(datos.respuesta.table);               
                CitasAdmision.PacientesEnCola = datos.respuesta.table;
                CitasAdmision.CargarListaTurnos();
                var PacientesEnColaEsperando = CitasAdmision.PacientesEnCola.filter((obj) => obj.idEstadoAtencion == 1);
                $("#NroPacienteEnCola").html(PacientesEnColaEsperando.length);
                if (PacientesEnColaEsperando.length > 0) {
                    $("#btnPacientesEnCola").addClass("btnPacienteEnColaPendiente");
                } else {
                    $("#btnPacientesEnCola").removeClass("btnPacienteEnColaPendiente");
                }
            }
            //Cargando(0);
            return true;

            //console.log(datos);
        } catch (error) {
            //Cargando(0);
            console.error(error)
            alerta2("error", "", JSON.stringify(error));
            return false;
        }
    },

    async GenerarAccionFlujoAdmision(idTurno, estado) {
        var midata = new FormData();
        midata.append('idTurno', idTurno);
        midata.append('idEstado', estado);

        let datos;
        try {
            Cargando(1);
            //oTable_PacientesEnCola.fnClearTable();            
            datos = await
                $.ajax({
                    method: "POST",
                    url: "/Utilitario/GenerarAccionFlujoAdmision?area=Comun",
                    data: midata,
                    dataType: "json",
                    cache: false,
                    processData: false,
                    contentType: false,
                });

            Cargando(0);
            return true;

            //console.log(datos);
        } catch (error) {
            //Cargando(0);
            console.error(error)
            alerta2("error", "", JSON.stringify(error));
            return false;
        }
    },

    CargarListaTurnos() {
        $('#tblPacientesEnCola tbody').html("");
        $(CitasAdmision.PacientesEnCola).each(function (i, obj) {
            $('#tblPacientesEnCola tbody').append("<tr>" +
                "<td>" + obj.id + "</td>" +
                "<td class='font-weight-bold'>" + obj.turno + "</td>" +
                "<td><span class='chip " + CitasAdmision.ObtenerColorEstaAtencionCola(obj.idEstadoAtencion) + "'>" + obj.estadoAtencion + "</span></td>" +
                "<td>" + obj.fecha + "</td>" +
                "<td style = 'text-align:center'><button class='btn btn-success btn-sm " + ((obj.id > 1 || obj.idEstadoAtencion == 4) ? "d-none" : "") + "' onClick='CitasAdmision.GenerarLlamadoPaciente(" + "`" + obj.turno + "`" + "," + obj.idTurnos + ")'>LLAMAR</button>" +
                "<button class='btn btn-info btn-sm " + ((obj.id > 1 || obj.idEstadoAtencion == 4) ? "d-none" : "") + "' onClick='CitasAdmision.AtenderPaciente(" + obj.idTurnos + ")'>ATENDER</button>" +
                "<button class='btn btn-secondary btn-sm " + ((obj.id > 1 || obj.idEstadoAtencion == 4) ? "d-none" : "") + "' onClick='CitasAdmision.FinalizarPaciente(" + obj.idTurnos + ")'>FINALIZAR</button></td>" +
                "</tr>");
        });
        oTable_PacientesEnCola.resize();
    },

    ObtenerColorEstaAtencionCola(idEstado) {
        if (idEstado == 1) { return "orange"; }
        if (idEstado == 2) { return "success"; }
        if (idEstado == 3) { return "primary"; }
        if (idEstado == 4) { return "secondary"; }
    },

    async GenerarLlamadoPaciente(cupo, idTurno) {
        $("#txtLlamadoCupo").html(cupo);
        const accion = await CitasAdmision.GenerarAccionFlujoAdmision(idTurno, 2);      //2: Llamar Paciente
        if (accion) {
            await CitasAdmision.CargarTurnosPorVentanilla();
        }
        CitasAdmision.IdTurnoLlamado = idTurno;
        $("#modalLlamadoPaciente").modal("show");

    },

    async CancelarLlamadoPaciente() {
        $("#txtLlamadoCupo").val("");
        const accion = await CitasAdmision.GenerarAccionFlujoAdmision(CitasAdmision.IdTurnoLlamado, 1);      //1: Cancelar llamado Paciente
        if (accion) {
            await CitasAdmision.CargarTurnosPorVentanilla();
        }
        CitasAdmision.IdTurnoLlamado = 0;
        $("#modalLlamadoPaciente").modal("hide");
    },

    async AtenderPaciente(idTurno) {
        const accion = await CitasAdmision.GenerarAccionFlujoAdmision(idTurno, 3);      //3: Atender Paciente
        if (accion) {
            await CitasAdmision.CargarTurnosPorVentanilla();
        }
    },

    async FinalizarPaciente(idTurno) {
        const accion = await CitasAdmision.GenerarAccionFlujoAdmision(idTurno, 4);      //4: Finalzar Paciente
        if (accion) {
            await CitasAdmision.CargarTurnosPorVentanilla();
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    InitDatablesMedicosProgramados: function () {
        hProgram = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - $("#filtroProgramacion").height() - 25) + 'px';
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            //scrollY: '50vh',
            scrollY: hProgram,
            scrollCollapse: true,
            bFilter: false,
            columns: [
                {
                    data: "nombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "dservicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_medicosProgramados = $("#tblMedicosProgramados").dataTable(parms);
    },
    InitDatablesProcedimientosInterconsulta: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '30vh',
            scrollCollapse: true,
            columns: [
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
                }
            ]
        }

        oTable_ProcedimientosInterconsulta = $("#tblProcedimientosInterconsulta").dataTable(parms);
    },
    InitDatablesBusquedaSis: function () {

        var parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '40vh',
            scrollCollapse: true,
            columns: [
                { title: 'ApPaterno' },
                { title: 'ApMaterno' },
                { title: 'PNombre' },
                { title: 'SNombre' },
                { title: 'Fnacimiento' },
                { title: 'cAfiliacion' },
                { title: 'estado' },
                { title: 'fBajaOK' },
                { title: 'DNI' },
                { title: 'sexo' },
                { title: 'distritoDomicilio' },
                { title: 'cDisa' },
                { title: 'cFormato' },
                { title: 'cNumero' },
                { title: 'AfiliacionNroIntegrante' },
                { title: 'codigo' },
                { title: 'idSiaSis' },
                { title: 'MotivoBaja' },
                { title: 'CodigoEstablAdscripcion' },
                { title: 'AfiliacionFecha' },
                { title: 'IdTipoDoc' }
            ]
        }

        oTable_busquedaSis = $("#tblBusquedaSis").dataTable(parms);
    },
    InitDatablesCupos: function () {
        hCupos = ($(window).height() - $("#top").height() - $("#top").height() - $("#header").height() - 55) + 'px';
        let parms = {
            data: null,
            info: false,
            bFilter: false,
            paging: false,
            ordering: false,
            //scrollY: '70vh',
            scrollY: hCupos,
            scrollCollapse: true,
            columns: [
                {
                    data: "id",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')

                        let tipoCita = 'P'

                        if (rowData.idReferencia > 0) {
                            tipoCita = 'RF'
                        }
                        if (rowData.tipoCita == 'I ') {
                            tipoCita = 'I'
                        }

                        //let tipoCita = rowData.tipoCita.trim() == 'I' ? 'I' : rowData.tipoCita.trim() == 'R' ? 'R' : 'P'

                        let estado = "[" + (rowData.id < 10 ? '0' + rowData.id : rowData.id) + "] &nbsp;"
                        let datosAtencion = "N° Cuenta: " + rowData.idCuentaAtencion + " &nbsp; &nbsp; &nbsp;" + " Plan: " + rowData.fuenteFinanciamiento
                        let datosPaciente = "&nbsp; &nbsp; &nbsp; &nbsp; HC: " + rowData.nroHistoria + " &nbsp; &nbsp; &nbsp;" + " Paciente: " + rowData.pacienteNombre
                        let info = '&nbsp; &nbsp; &nbsp; &nbsp; H. I. ' + rowData.turnoHoraInicio.substr(0, 5) + '&nbsp; &nbsp; H. F. ' + rowData.turnoHoraFin.substr(0, 5)

                        let boton = ""
                        //let datosAtencion = 'HC: ' + rowData. + '  &nbsp;   &nbsp; : ' + rowData.
                        let NroCupoCita = "<div style='width:25px;line-height: 15px;'><span>[" + (rowData.id < 10 ? '0' + rowData.id : rowData.id) + "]</span></div>";
                        let NroCuentaCita = "<span class='mr-1'>N° Cuenta: " + rowData.idCuentaAtencion + "</span>";
                        let PlanCita = "<span>Plan: " + rowData.fuenteFinanciamiento + "</span>";
                        let HistoriaCita = "<span class='mr-1'>HC: " + rowData.nroHistoria + "</span>";
                        let PacienteCita = "<span>Paciente: " + rowData.pacienteNombre + "</span>";
                        let HorarioCita = "<span class='mr-1'>" + rowData.turnoHoraInicio.substr(0, 5) + " - " + rowData.turnoHoraFin.substr(0, 5) + "</span>";
                        let TipoCita = "<span class='mr-1'>Tipo Cita: " + tipoCita + "</span>";
                        let UsuarioCita = "<span>Usuario: " + rowData.usuarioCita + "</span>"

                        let TipoPaciente = "<span class='mr-1'>Tipo Paciente: " + rowData.tipoPaciente + "</span>";
                        let FechaSolicitud = "<span>Fecha Solicitud: " + rowData.fechaSolicitud + "</span>"
                        /*console.log(fila1)
                        console.log(fila2)
                        console.log(fila3)*/
                        let EstadoCita = "";
                        let InfoFila1CupoCita = "";
                        let InfoFila2CupoCita = "";
                        let InfoFila3CupoCita = "";
                        let InfoCupoCita = "";

                        if (rowData.idEstadoCita == "1") {
                            EstadoCita = "<span class='mr-1'>Estado: SEPARADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: SEPARADO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCita

                            if (rowData.estaHospitalizado > 0) {
                                $(td).css('background', '#ff00e0');
                            } else {
                                $(td).css('background', '#f79836');
                            }
                        }
                        if (rowData.idEstadoCita == "4") {
                            EstadoCita = "<span class='mr-1'>Estado: PAGADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: PAGADO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCitam

                            $(td).css('background', '#00a1ff;');
                        }
                        if (rowData.idEstadoCita == "2") {
                            EstadoCita = "<span class='mr-1'>Estado: ATENDIDO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + NroCuentaCita + PlanCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;' class='text-truncate'>" + HistoriaCita + PacienteCita + "</div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + TipoCita + UsuarioCita + "</div>";
                            InfoFila4CupoCita = "<div style='line-height: 15px;'>" + TipoPaciente + FechaSolicitud + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + InfoFila4CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: ATENDIDO &nbsp; &nbsp; &nbsp;" + datosAtencion + "<br>" + datosPaciente
                            //info = info + '&nbsp; &nbsp; Tipo Cita: ' + tipoCita + '  &nbsp; &nbsp; Usuario: ' + rowData.usuarioCita
                        }
                        if (rowData.idEstadoCita == "0" || rowData.idEstadoCita == "3") {
                            EstadoCita = "<span class='mr-1'>Estado: DISPONIBLE</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            //InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " Estado: &nbsp DISPONIBLE"
                            $(td).css('background', '#6fcf72');
                        }
                        if (rowData.idEstadoCita == "6") {
                            EstadoCita = "<span class='mr-1'>Estado: BLOQUEADO</span>";
                            InfoFila1CupoCita = "<div style='line-height: 15px;'>" + EstadoCita + "</div>";
                            InfoFila2CupoCita = "<div style='line-height: 15px;'><span>&nbsp;</span></div>";
                            InfoFila3CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";
                            /*InfoFila4CupoCita = "<div style='line-height: 15px;'>" + HorarioCita + "</div>";*/
                            InfoCupoCita = "<div>" + InfoFila1CupoCita + InfoFila2CupoCita + InfoFila3CupoCita + "</div>";
                            InfoCupoCita = "<div class='d-flex'>" + NroCupoCita + InfoCupoCita + "</div>";

                            //estado += " ESTADO: &nbsp BLOQUEADO"
                            $(td).css('background', '#f0ff14');
                        }

                        //$(td).html("<b>" + InfoCupoCita + estado + ' <BR> ' + info + "</b>")
                        $(td).html("<b>" + InfoCupoCita + "</b>");
                    }
                }
            ]
        }

        var tableWrapper = $('#tblCupos'); // datatable creates the table wrapper by adding with id {your_table_id}_wrapper
        oTable_cupos = $("#tblCupos").dataTable(parms);
    },
    InitDatablesPacientesCitas: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            bFilter: false,
            columns: [
                {
                    data: "hi",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "hf",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apMaterno",
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
                    data: "fechaSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html(moment(rowData.fechaSolicitud).format('L'))
                    }
                },
                {
                    data: "idCuentaAtencion",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "financiamiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "productoPlan",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "numGarante",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "atendido",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "estadoCita",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "horaSolicitud",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "especialidad",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_pacientesCitas = $("#tblPacientesCitas").dataTable(parms);
    },
    InitDatablesEstablecimientos: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '25vh',
            scrollCollapse: true,
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
                },
                {
                    data: "distrito",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "provincia",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "departamento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    width: '10%',
                    targets: 8,
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                        $(td).html('<span class="chip orange">' + 'Estab' + '</span >');
                    }
                }
            ]
        }
        oTable_establecimientos = $("#tblEstSalud").dataTable(parms);
    },
    InitDatablesBusquedaPacientes: function () {
        let parms = {
            "paging": false,
            "ordering": true,
            "info": false,
            "scrollX": true,
            scrollY: '40vh',
            scrollCollapse: true,
            columns: [
                {
                    data: "apellidoPaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "apellidoMaterno",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "primerNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "segundoNombre",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "nroHistoriaClinica",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaNacimiento",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "tipoServicio",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "servicioIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaIngreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "fechaEgreso",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                },
                {
                    data: "idEstadoHistoria",
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left')
                    }
                }
            ]
        }
        oTable_pacientesBusqueda = $("#tblPacientesBusqueda").dataTable(parms);
    },

    /////////////////////////KHOYOSI/////////////////////////////////////////////////////////
    InitDatablesPacienteEnCola: function () {
        var indexCola = 0;
        let parms = {
            "paging": false,
            "bFilter": false,
            "ordering": false,
            "info": false,
            "scrollX": true,
            scrollY: '40vh',
            columns: [
                {
                    data: null,
                    width: '5%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: null,
                    width: '15%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: null,
                    width: '20%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'left');
                    }
                },
                {
                    data: null,
                    width: '20%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                    }
                },
                {
                    data: null,
                    width: '40%',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('align', 'center');
                    }
                },
            ]
        }

        oTable_PacientesEnCola = $("#tblPacientesEnCola").dataTable(parms);
    },
    /////////////////////////////////////////////////////////////////////////////////////////

    Events() {

        $("#chkPacienteOnconaval").on('change', function () {
            console.log(this.checked);
            if (this.checked) {
                $('#cboFuenteFinanciamientoCita').val(8).chosen().trigger("chosen:updated").change();
            }else{
                let IdFuenteFinanciamiento = $("#hdIdFuenteFinanciamiento")?.val() || '';
                let ProductoPlan = $("#hdProductoPlan")?.val() || '';
                if(IdFuenteFinanciamiento && ProductoPlan){
                    $('#cboFuenteFinanciamientoCita').val(IdFuenteFinanciamiento).chosen().trigger("chosen:updated").change();
                    setTimeout(()=> $("#cboProductoPlan").val(ProductoPlan).chosen().trigger("chosen:updated").change(),500)
                }else{
                    $('#cboFuenteFinanciamientoCita').val("").chosen().trigger("chosen:updated").change();
                }
                
            }
        })

        $('#cboMes').on('change', async function () {
            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnio>option:selected').val(), $('#cboMes>option:selected').val() - 1));

            //CitasAdmision.ListarProgramacionCitas(1, $('#cboMes>option:selected').val(), $('#cboAnio>option:selected').val())
            Cargando(1)
            $("#calendar").fullCalendar('renderEvent',
                {
                    start: $('#cboAnio').val() + '-' + $('#cboMes').val().toString().padStart(2, '0') + '-' + '01',
                    end: $('#cboAnio').val() + '-' + $('#cboMes').val().toString().padStart(2, '0') + '-' + '01',
                    overlap: false,
                    rendering: 'background',
                    color: '#5bbefe'
                });

            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(1, $('#cboMes').val(), $('#cboAnio').val())
            await CitasAdmision.MostrarProgramacionMedica(1, $('#cboMes').val(), $('#cboAnio').val())

            $("#MesCalendario").text($("#cboMes option:selected").text() + ' ' + $("#cboAnio option:selected").text());

            Cargando(0)
            //CitasAdmision.MostrarProgramacionMedica(1, $('#cboMes>option:selected').val(), $('#cboAnio>option:selected').val())
        })
        $('#cboAnio').on('change', async function () {
            $('#calendar').fullCalendar('gotoDate', new Date($('#cboAnio>option:selected').val(), $('#cboMes>option:selected').val() - 1));

            Cargando(1)
            $("#calendar").fullCalendar('renderEvent',
                {
                    start: $('#cboAnio').val() + '-' + $('#cboMes').val().toString().padStart(2, '0') + '-' + '01',
                    end: $('#cboAnio').val() + '-' + $('#cboMes').val().toString().padStart(2, '0') + '-' + '01',
                    overlap: false,
                    rendering: 'background',
                    color: '#5bbefe'
                });

            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(1, $('#cboMes').val(), $('#cboAnio').val())
            await CitasAdmision.MostrarProgramacionMedica(1, $('#cboMes').val(), $('#cboAnio').val())

            $("#MesCalendario").text($("#cboMes option:selected").text() + ' ' + $("#cboAnio option:selected").text());
            Cargando(0)
            //CitasAdmision.ListarProgramacionCitas(1, $('#cboMes>option:selected').val(), $('#cboAnio>option:selected').val())
        })
        $('#cboFuenteFinanciamientoCita').on('change', function () {
            console.log(this.value)
            if (this.value == 0) {
                $('#cboProductoPlan').empty()
                //$('#cboProductoPlan').attr('disabled', true)
                $('#divParticular').hide()
                $('#divSis').hide()
                $('.chzn-select').chosen().trigger("chosen:updated")
                return false
            }
            //if (!$('#chbBusquedaSis').is(':checked') && this.value == 3 && CitasAdmision.tipoAccion == 1) {
            //    $('#cboFuenteFinanciamientoCita').val(0)
            //    alerta(2, 'No se encontró Paciente en tabla de FILIACIONES DEL SIS. Por favor busque al Paciente en la tabla del SIS AFILIACIONES, pulsando check en "Buscar en IAFAS"') // corregir despues
            //    $('.chzn-select').chosen().trigger("chosen:updated")
            //    return false
            //}

            CitasAdmision.ListarTiposFinanciamientosTarifaSeleccionarPorPlan($('#cboFuenteFinanciamientoCita').val())

            $('#cboCodPrestacion').val('0')
            $('.chzn-select').chosen().trigger("chosen:updated");

            if (this.value == 1) {
                $('#divParticular').show()
                $('#divSis').hide()
            } else if (this.value == 23) {
                $('#divParticular').hide()
                $('#divSis').hide()
            } else if (this.value == 3) {
                $('#divParticular').hide()
                $('#divSis').show()


                //$('#cboCodPrestacion').val('056')
                //$('.chzn-select').chosen().trigger("chosen:updated");
            }
        })
        $('#cboTipoOrigenCita').on('change', function () {
            if ($('#cboTipoOrigenCita>option:selected').val() == 12) {
                $('#cboTipoReferenciaCita').attr('disabled', false)
                $('#txtNroReferenciaCita').attr('disabled', false)
                $('#btnOpenModalEstablecimientoReferenciaCita').attr('disabled', false)

                $('#lblTipoRefCon').text('Tipo Referencia')
                $('#lblEstabRefCon').text('Estab. Referencia')

            } else if ($('#cboTipoOrigenCita>option:selected').val() == 13) {
                $('#cboTipoReferenciaCita').attr('disabled', false)
                $('#txtNroReferenciaCita').attr('disabled', false)
                $('#btnOpenModalEstablecimientoReferenciaCita').attr('disabled', false)

                $('#lblTipoRefCon').text('Tipo Contrareferencia')
                $('#lblEstabRefCon').text('Estab. Contrareferencia')

            } else {
                $('#cboTipoReferenciaCita').attr('disabled', true)
                $('#txtNroReferenciaCita').attr('disabled', true)
                $('#btnOpenModalEstablecimientoReferenciaCita').attr('disabled', true)

                $(`#cboTipoReferenciaCita`).val(0);
                $('#txtIdReferenciaCita').val('')
                $('#txtDescripcionReferenciaCita').val('')
                $('#txtNroReferenciaCita').val('')
            }
            $('.chzn-select').chosen().trigger("chosen:updated")
        })

        $('#cboDepartamentoHospital').on('change', async function() { // MGAMERO
            Cargando(1)
            await CitasAdmision.ListarEspecialidadPorDepartamento()
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)

        })
        $('#cboEspecialidad').on('change', async function() { // MGAMERO
            Cargando(1)
            //await CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)

        })
        $('#cboDepartamentosHospital').on('change', async function () { 
            Cargando(1)
            //await CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)

        })
        $('#cboMedico').on('change', async function () {
            Cargando(1)
            //await CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)
        })
        $('#cmbdepEstbuscar').on('change', function () {
            RegistroPaciente.ListaProvinciasByDepartamentos($('#cmbdepEstbuscar').val(), 'cmbprovEstBuscar')
            RegistroPaciente.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })
        $('#cmbprovEstBuscar').on('change', function () {
            RegistroPaciente.ListaDistritosByProvincia($('#cmbprovEstBuscar').val(), 'cmbdistEstBuscar')
        })

        $('#txtDniPaciente').on('focusout', function () {
            CitasAdmision.PacientesFiltraPorNroDocumentoYtipoFiltro()
        })

        $('#chbBusquedaSis').on('click', function () {
            if ($('#chbBusquedaSis').is(':checked')) {
                $('#txtNroHistoria').prop("disabled", true)
            } else {
                $('#txtNroHistoria').prop("disabled", false)
            }
        })
        $('#chbPacienteNuevo').on('click', function () {
            if ($('#chbPacienteNuevo').is(':checked')) {


                if ($('#hdIdSiaSis').val() != '') {
                    $('#cboTipoDocPaciente').val(($('#hdAfiliacionTipoFormato').val() == 2 ? 1 : 2))

                    $('#txtDniPaciente').val($('#hdAfiliacionNroFormato').val())

                    $('#txtApellidoPaternoPaciente').val($('#hdPaterno').val())
                    $('#txtApellidoMaternoPaciente').val($('#hdMaterno').val())
                    $('#txtPrimerNombrePaciente').val($('#hdPnombre').val())
                    $('#txtSegundoNombrePaciente').val($('#hdOnombres').val())
                    $('#txtPacienteFechaNacimiento').val($('#hdFnacimiento').val())
                    $('#cboSexoPaciente').val(($('#hdGenero').val() == 1 ? 1 : 2))

                    $('#txtPacienteFechaNacimiento').trigger('change')
                } else {
                    LimpiarCampos()
                }

                $('#chbPacienteNuevo').prop('checked', true)

                $('#txtNroHistoria').prop("disabled", true)
                $('#txtDni').prop("disabled", true)
                $('#txtApellidoPaterno').prop("disabled", true)
                $('#txtApellidoMaterno').prop("disabled", true)
                $('#txtPrimerNombre').prop("disabled", true)
                $('#txtSegundoNombre').prop("disabled", true)
                $('#cboTipoAfiliacion').prop("disabled", true)
                $('#txtDisa').prop("disabled", true)
                $('#txtTipo').prop("disabled", true)
                $('#txtNroAfiliacion').prop("disabled", true)
            } else {
                $('#txtNroHistoria').prop("disabled", false)
                $('#txtDni').prop("disabled", false)
                $('#txtApellidoPaterno').prop("disabled", false)
                $('#txtApellidoMaterno').prop("disabled", false)
                $('#txtPrimerNombre').prop("disabled", false)
                $('#txtSegundoNombre').prop("disabled", false)
                $('#cboTipoAfiliacion').prop("disabled", false)
                $('#txtDisa').prop("disabled", false)
                $('#txtTipo').prop("disabled", false)
                $('#txtNroAfiliacion').prop("disabled", false)
            }
        })
        $('#chbBusquedaReniec').on('click', function () {
            if ($('#chbBusquedaReniec').is(':checked')) {
                $('#chbPacienteNuevo').prop("disabled", true)
                $('#chbBusquedaSis').prop("disabled", true)
                $("#chbPacienteNuevo").prop('checked', false)
                $("#chbBusquedaSis").prop('checked', false)

                $('#txtNroHistoria').prop("disabled", true)
                $('#txtDni').prop("disabled", false)
                $('#txtApellidoPaterno').prop("disabled", true)
                $('#txtApellidoMaterno').prop("disabled", true)
                $('#txtPrimerNombre').prop("disabled", true)
                $('#txtSegundoNombre').prop("disabled", true)
                $('#cboTipoAfiliacion').prop("disabled", true)
                $('#txtDisa').prop("disabled", true)
                $('#txtTipo').prop("disabled", true)
                $('#txtNroAfiliacion').prop("disabled", true)
            } else {
                $('#chbPacienteNuevo').prop("disabled", false)
                $('#chbBusquedaSis').prop("disabled", false)

                $('#txtNroHistoria').prop("disabled", false)
                $('#txtDni').prop("disabled", false)
                $('#txtApellidoPaterno').prop("disabled", false)
                $('#txtApellidoMaterno').prop("disabled", false)
                $('#txtPrimerNombre').prop("disabled", false)
                $('#txtSegundoNombre').prop("disabled", false)
                $('#cboTipoAfiliacion').prop("disabled", false)
                $('#txtDisa').prop("disabled", false)
                $('#txtTipo').prop("disabled", false)
                $('#txtNroAfiliacion').prop("disabled", false)
            }
        })

        $('#btnLimpiarBusqueda').on('click', async () => {
            $('#cboDepartamentoHospital').val(0) // MGAMERO
            $('#cboEspecialidad').val(0) // MGAMERO
            $('#cboMedico').val(0)
            $('#cboDepartamentosHospital').val(0)
            $('.chzn-select').chosen().trigger("chosen:updated");

            Cargando(1)
            //await CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.ListarEspecialidadPorDepartamento() // MGAMERO
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            Cargando(0)
        })
        $('#btnBuscar').on('click', async function () {

            Cargando(1)

            if (!$('#chbBusquedaSis').is(':checked') && !$('#chbPacienteNuevo').is(':checked') && !$('#chbBusquedaReniec').is(':checked')) {
                if ($('#txtDni').val() == '' && $('#txtNroHistoria').val() == '' && $('#txtApellidoPaterno').val() == '' && $('#txtApellidoMaterno').val() == ''
                    && $('#txtPrimerNombre').val() == '' && $('#txtSegundoNombre').val() == '') {
                    alerta(2, 'Ingrese alguno de los valores de busqueda')
                    Cargando(0)
                    return false
                }
            }

            if ($('#chbBusquedaReniec').is(':checked')) {
                if ($('#txtDni').val() == '') {
                    alerta(2, 'Debe ingresar el DNI')
                    Cargando(0)
                    return false
                }
            }

            if ($('#chbBusquedaReniec').is(':checked')) {
                let paciente = await CitasAdmision.BuscarPacienteReniec()

                if (paciente.estado) {
                    if (paciente.data[0] != '0000') {
                        alerta(2, 'No existen datos de la persona')
                        Cargando(0)
                        return false
                    }

                    let datosReniec = paciente.data

                    $(`#cboTipoDocPaciente`).val(1)
                    $('#txtDniPaciente').val(datosReniec[21])
                    $('#txtApellidoPaternoPaciente').val(datosReniec[1])
                    $('#txtApellidoMaternoPaciente').val(datosReniec[2])
                    $('#txtPrimerNombrePaciente').val(datosReniec[3].split(' ')[0])
                    $('#txtSegundoNombrePaciente').val(datosReniec[3].split(' ')[1])
                    $(`#cboSexoPaciente`).val(datosReniec[17])
                    $("#txtPacienteFechaNacimiento").datepicker("setDate", FormatearFecha(moment(datosReniec[18])));
                    $('#txtDireccionDomicilio').val(datosReniec[16])

                    $('#txtPacienteFechaNacimiento').trigger('change')

                    await CitasAdmision.BuscarPacienteEnEstablecimiento()
                }

                Cargando(0)
                return false
            }

            if ($('#chbBusquedaSis').is(':checked')) {
                //$(`#cboFuenteFinanciamientoCita`).val(3);
                //$('.chzn-select').chosen().trigger("chosen:updated")
                //$(`#cboFuenteFinanciamientoCita`).trigger('change')
                //CompletarDatosAfiliacion()
                //await CitasAdmision.BuscarPacienteEnEstablecimiento( CompletarDatosAfiliacionIAFAS )
                CompletarDatosAfiliacionIAFAS();
                //CompletarDatosAfiliacionPN();
                Cargando(0)
                return false
            }

            await CitasAdmision.BuscarPacienteEnEstablecimiento()

            Cargando(0)

        })

        $('#btnCitaAdicional').on('click', async () => {

            let citaBloqueada = false
            let fechaCita = ''
            let fechaActual = ''
            let citasBloqueadas = []

            CitasAdmision.esCitaAdicional = 1

            Cargando(1)
            await LimpiarCampos()
            await IniciarFormularioModal() // cambiar para que tambien jale la adicionals

            CitasAdmision.tipoAccion = 1


            const format = 'DD-MM-YYYY HH:mm';
            fechaCita = moment(CitasAdmision.dia + '-' + CitasAdmision.mes + '-' + CitasAdmision.anio + ' 00:00', format)
            fechaActual = moment(CitasAdmision.fechaActual.substr(0, 2) + '-' + CitasAdmision.fechaActual.substr(3, 2) + '-' + CitasAdmision.fechaActual.substr(6, 4) + ' 00:00', format)

            if (fechaActual > fechaCita) {
                alerta(2, "No se puede agregar una cita con fecha anterior a la fecha actual: ")
                Cargando(0)
                return false
            }

            $('#btnguardarCita').show()
            $('#btnguardarCita').text('Guardar')
            $('#btnguardarCita').removeClass('btn-danger')
            $('#btnguardarCita').addClass('btn-info')



            $('.BusquedaPacienteContenedor input').prop('disabled', false)
            $('.BusquedaPacienteContenedor select').prop('disabled', false)
            $('.BusquedaPacienteContenedor button').prop('disabled', false)
            $('.bloquear-campos').prop('disabled', false)

            $('#txtNroHistoriaPaciente').prop('disabled', true)

            $('#cboTipoOrigenCita').val(10)
            $('#cboTipoReferenciaCita').val(0)
            $(`#cboReligionPaciente`).val(4)

            $('.chzn-select').chosen().trigger("chosen:updated");


            $('#cboTipoReferenciaCita').trigger('change')
            $('#cboTipoOrigenCita').trigger('change')

            $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

            Cargando(0)
        })
        $('#btnBuscarInterconsulta').on('click', async () => {
            let txtNroOrden = $('#txtNroOrden')
            let txtNombrePaciente = $('#txtNombrePaciente')

            let listaRecetasInterconsulta = await this.ListaRecetasInterconsulta(txtNroOrden.val(), $('#cboEspecialidadCita').val())

            console.log('listaRecetasInterconsulta', listaRecetasInterconsulta)

            if (isEmpty(listaRecetasInterconsulta)) {
                alerta(2, 'No hay interconsultas para la especialidad: ' + $('#lblEspecialidadMedica').text())
                return false
            }

            if ($('#cboEspecialidadCita').val() != listaRecetasInterconsulta[0].idEspecialidad) {
                alerta(2, 'No hay interconsultas para la especialidad: ' + $('#lblEspecialidadMedica').text())
                return false
            }
            oTable_ProcedimientosInterconsulta.fnClearTable()
            oTable_ProcedimientosInterconsulta.fnAddData(listaRecetasInterconsulta)
        })
        $('#btnSeleccionarInterconsulta').on('click', async () => {
            let objRow = oTable_ProcedimientosInterconsulta.api(true).row('.selected').data()

            if (isEmpty(objRow)) {
                alerta(2, "Selecciona un procedimiento")
                return false
            }

            CitasAdmision.idEspecialidad = objRow.idEspecialidad
            CitasAdmision.idProducto = objRow.idProducto
            CitasAdmision.idCuentaAtencion = objRow.idCuentaAtencion
            CitasAdmision.idPaciente = objRow.idPaciente
            CitasAdmision.tipoCita = 'I'
            CitasAdmision.idReceta = objRow.idReceta

            ModalCita(3)
        })
        $('#btnCerrarModalInterconsulta').on('click', async () => {
            oTable_ProcedimientosInterconsulta.fnClearTable()
            CitasAdmision.idEspecialidad = 0
            CitasAdmision.idProducto = 0
            CitasAdmision.idCuentaAtencion = 0
            CitasAdmision.idPaciente = 0
            CitasAdmision.tipoCita = null
            CitasAdmision.idReceta = 0
        })

        $('#btnLimpiarDatosBusquedaSis').on('click', () => {
            Cargando(1)
            LimpiarCampos()
            Cargando(0)
        })
        $('#btnLimpiarBusquedaEstablecimiento').on('click', () => {
            Cargando(1)
            $('#codigoEstBuscar').val('')
            $('#nombreEstBuscar').val('')

            $('#cmbdepEstbuscar').val(15)
            $('#cmbdepEstbuscar').trigger('change')
            $('.chzn-select').chosen().trigger("chosen:updated");
            Cargando(0)
        })
        $('#btnCerraEstablecimientoBuscar').on('click', function () {
            $('#modalEstablecimientosBuscar').modal('hide')
        })
        $('#btnOpenModalEstablecimientoReferenciaCita').on('click', function () {

            if (($('#cboTipoReferenciaCita>option:selected').val() == 0)) {
                alert("Seleccionar el tipo de referencia/contrareferencia")
                return false
            }

            oTable_establecimientos.fnClearTable()
            if ($('#cboTipoReferenciaCita>option:selected').val() == 2) {
                $('#divCodigoRenaes').hide()
            } else {
                $('#divCodigoRenaes').show()
            }
            $('#modalEstablecimientosBuscar').modal('show')
        })
        $('#btneliminarCita').on('click', async function () {
            // Para modificar y crear, se envian 3 parametros
            let tipoAccion = 3, estadoAtencion = 0 // cambiar estado a 0
            // 1° - idPaciente
            // 2° - tipoAccion (0-agregar, 1-modificar, 2-consultar, 3-eliminar)
            // 3° - estadoAtencion
            GuardarCita(tipoAccion, estadoAtencion)
        })
        $('#btnguardarCita').on('click', async function () {

            let medicosProgramados = oTable_medicosProgramados.api(true).row('.selected').data()

            if (isEmpty(medicosProgramados)) {
                alerta(3, 'Seleccione un registro de la tabla medicos')
                return false
            }


            if ($('#cboTipoEdadPaciente').val() == 1 && $('#txtEdadPaciente').val() > medicosProgramados.edadAnios) {
                swal({
                    title: 'Atenciones',
                    text: "Para el Servicio: " + medicosProgramados.dservicio + " \n" + " La Edad es entre " + medicosProgramados.edadMinimaDias + " y " + medicosProgramados.edadDias + " dias " +
                        "(en meses: " + medicosProgramados.edadMinimaMeses + ", " + medicosProgramados.edadMeses + ") (en años: " + medicosProgramados.edadMinimaAnios + ", " + medicosProgramados.edadAnios + ").",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return false
            } else if ($('#cboTipoEdadPaciente').val() == 2 && $('#txtEdadPaciente').val() > medicosProgramados.edadMeses) {
                swal({
                    title: 'Atenciones',
                    text: "Para el Servicio: " + medicosProgramados.dservicio + " \n" + " La Edad es entre " + medicosProgramados.edadMinimaDias + " y " + medicosProgramados.edadDias + " dias " +
                        "(en meses: " + medicosProgramados.edadMinimaMeses + ", " + medicosProgramados.edadMeses + ") (en años: " + medicosProgramados.edadMinimaAnios + ", " + medicosProgramados.edadAnios + ").",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return false
            } else if ($('#cboTipoEdadPaciente').val() == 3 && $('#txtEdadPaciente').val() > medicosProgramados.edadDias) {
                swal({
                    title: 'Atenciones',
                    text: "Para el Servicio: " + medicosProgramados.dservicio + " \n" + " La Edad es entre " + medicosProgramados.edadMinimaDias + " y " + medicosProgramados.edadDias + " dias " +
                        "(en meses: " + medicosProgramados.edadMinimaMeses + ", " + medicosProgramados.edadMeses + ") (en años: " + medicosProgramados.edadMinimaAnios + ", " + medicosProgramados.edadAnios + ").",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();
                return false
            }

            CrearModificarCita(CitasAdmision.tipoAccion)

        })
        $('#btnCerrarModalCita').on('click', async function () {
            Cargando(1)
            LimpiarCampos()
            let objrowCitas = oTable_cupos.api(true).row('.selected').data()

            oTable_ProcedimientosInterconsulta.fnClearTable()
            CitasAdmision.idEspecialidad = 0
            CitasAdmision.idProducto = 0
            CitasAdmision.idCuentaAtencion = 0
            CitasAdmision.idPaciente = 0
            CitasAdmision.tipoCita = null
            CitasAdmision.idReceta = 0

            if (CitasAdmision.esCitaAdicional == 0) {
                if (objrowCitas.idCitaBloquear != null && objrowCitas.idCitaBloquear != '') {
                    let formData = new FormData();
                    formData.append("idCitaBloqueada", objrowCitas.idCitaBloquear)

                    fetch('/citas/CitasBloqueadasEliminar?area=consultaexterna', {
                        method: 'POST',
                        body: formData
                    })
                        .then(res => res.json())
                        .catch(error => console.error('error:', error))
                        .then(response => {
                        });

                }
            }



            $('#modalCita').modal('hide')

            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

            Cargando(0)
        })
        $('#btnBuscarEstablecimiento').on('click', function () {
            let formData = new FormData()

            formData.append('codigoRenaes', $('#codigoEstBuscar').val())
            formData.append('nombreEstablecimiento', $('#nombreEstBuscar').val())
            formData.append('idDepartamento', $('#cmbdepEstbuscar').val())
            formData.append('idProvincia', $('#cmbprovEstBuscar').val())
            formData.append('idDistrito', $('#cmbdistEstBuscar').val())
            formData.append('tipoReferencia', $('#cboTipoReferenciaCita').val())

            fetch('/citas/listarEstablecimientosReferencia?area=ConsultaExterna', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .catch(error => console.error('error:', error))
                .then(response => {
                    Cargando(1)
                    oTable_establecimientos.fnClearTable()
                    if (response.dataSet.table.length > 0) {
                        oTable_establecimientos.fnAddData(response.dataSet.table);
                    }
                    Cargando(0)
                });
        })
        $('#btnCerrarTicket').on('click', function () {
            $('#modalTicket').modal('hide')
        })

        $('#btnImprimirTicket').on('click', function () {
            let objCupo = oTable_cupos.api(true).row('.selected').data()

            var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + objCupo.idCita + "&nroCupo=" + objCupo.id
            //$('#ifrmTicketCita').attr('src', url)
            newIframe.src = url;

            //$('#btnCerrarModalCita').trigger("click")
            //$("#modalTicket").modal('show')
        })
        $('#btnImprimeHojaFiliacionConsultorio').on('click', function () {
            let objCupo = oTable_cupos.api(true).row('.selected').data()

            var url = "/Citas/ImprimeHojaFiliacionConsultorio?area=ConsultaExterna&idPaciente=" + objCupo.idPaciente + "&idCita=" + objCupo.idCita
            $('#ifrmTicketCita').attr('src', url)

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalTicket").modal('show')
        })

        $('#ImprimeFormatoFiliacionArchivoClinico').on('click', function () {
            let objCupo = oTable_cupos.api(true).row('.selected').data()

            var url = "/Citas/ImprimeFormatoFiliacionArchivoClinico?area=ConsultaExterna&idPaciente=" + objCupo.idPaciente + "&idCita=" + objCupo.idCita
            $('#ifrmTicketCita').attr('src', url)

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalTicket").modal('show')
        })

        $('#ImprimeFormatoFO030').on('click', function () {
            let objCupo = oTable_cupos.api(true).row('.selected').data()

            var url = "/Citas/ImprimeFormatoFO030?area=ConsultaExterna&idPaciente=" + objCupo.idPaciente + "&idCita=" + objCupo.idCita
            $('#ifrmTicketCita').attr('src', url)

            //$('#btnCerrarModalCita').trigger("click")
            $("#modalTicket").modal('show')
        })


        $('#tblMedicosProgramados tbody').on('click', 'tr', async function (e) {

            oTable_medicosProgramados.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_medicosProgramados.api(true).row('.selected').data();

            CitasAdmision.CargarDatosGenerales(objrow)

            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

        })
        $('#tblProcedimientosInterconsulta tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                oTable_ProcedimientosInterconsulta.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
        $('#tblBusquedaSis tbody').on('click', 'tr', function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');
        })
        $('#tblBusquedaSis tbody').on('dblclick', 'tr', async function () {
            oTable_busquedaSis.$('tr.selected').removeClass('selected')
            $(this).addClass('selected')

            let objRowSis = oTable_busquedaSis.api(true).row('.selected').data()

            if (objRowSis[6] == 1) {
                swal({
                    title: 'Cuidado',
                    text: "La afiliacion de este paciente tiene probelmas \n\n Motivo de baja: \nEstado: " + (objRowSis[6] == 1 ? "Inactivo " : objRowSis[6]) +
                        "\nFecha Baja:  " + objRowSis[7] + "\n",
                    type: 'warning',
                    allowOutsideClick: false,
                }).done();

                return false
            }

            $('#hdIdSiaSis').val(objRowSis[16]) //
            $('#hdCodigo').val(objRowSis[15]) //
            $('#hdAfiliacionDisa').val(objRowSis[11]) //
            $('#hdAfiliacionTipoFormato').val(objRowSis[12]) //
            $('#hdAfiliacionNroFormato').val(objRowSis[13]) //
            $('#hdAfiliacionNroIntegrante').val(objRowSis[14]) //
            $('#hdDocumentoTipo').val(objRowSis[20])
            $('#hdCodigoEstablAdscripcion').val(objRowSis[18]) //
            $('#hdAfiliacionFecha').val(objRowSis[19]) //
            $('#hdPaterno').val(objRowSis[0]) //
            $('#hdMaterno').val(objRowSis[1]) //
            $('#hdPnombre').val(objRowSis[2]) //
            $('#hdOnombres').val(objRowSis[3])
            $('#hdGenero').val(objRowSis[9]) //
            $('#hdFnacimiento').val(objRowSis[4]) //
            $('#hdIdDistritoDomicilio').val(objRowSis[10]) //
            $('#hdEstado').val(objRowSis[6]) //
            $('#hdFbaja').val(objRowSis[7]) //
            $('#hdDocumentoNumero').val(objRowSis[8]) //
            $('#hdMotivoBaja').val(objRowSis[17]) //

            $('#txtApellidoPaterno').val(objRowSis[0])
            $('#txtApellidoMaterno').val(objRowSis[1])
            $('#txtPrimerNombre').val(objRowSis[2])
            $('#txtSegundoNombre').val(objRowSis[3])

            $(`#cboFuenteFinanciamientoCita`).val(3);
            $('.chzn-select').chosen().trigger("chosen:updated")
            $(`#cboFuenteFinanciamientoCita`).trigger('change')


            $('#modalBusquedaSis').modal('hide')

            //await BuscarPacientes()
            await CitasAdmision.BuscarPacienteEnEstablecimiento()
        })
        $('#tblCupos tbody').on('click', 'tr', function () {

            $(oTable_cupos.$('tr.selected').children()[0]).removeClass('day-highlight');

            oTable_cupos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            $($(this).children()[0]).addClass("day-highlight")
        })
        $('#tblCupos tbody').on('contextmenu', 'tr', function (e) {
            e.preventDefault();
            let objrowCita = oTable_cupos.api(true).row(this).data()
            let menuContextual = CitasAdmision.myMenu.filter(opcion => {
                if (opcion.class == '.btnDesbloquearCupo') {
                    return !isEmpty(objrowCita) && parseInt(objrowCita.idEstadoCita) == 6 && isEmpty(objrowCita.idCita) //si no tiene CitaBloqueada pero es cupo bloqueado, quizas por horario de refrigerio.
                }
                return true
            })

            superCm.createMenu(menuContextual, e);
        })
        $('#tblEstSalud tbody').on('click', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblEstSalud tbody').on('dblclick', 'tr', function (e) {

            oTable_establecimientos.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            let objrow = oTable_establecimientos.api(true).row('.selected').data();

            console.log("obvis", objrow)

            $('#hdIdEstablecimientoReferenciaOrigen').val(objrow.idEstablecimiento)
            $('#txtIdReferenciaCita').val(objrow.codigo)
            $('#txtDescripcionReferenciaCita').val(objrow.nombre)

            $('#modalEstablecimientosBuscar').modal('hide')
        })
        $('#tblPacientesBusqueda tbody').on('click', 'tr', function (e) {
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        })
        $('#tblPacientesBusqueda tbody').on('dblclick', 'tr', async function (e) {
            Cargando(1)
            oTable_pacientesBusqueda.$('tr.selected').removeClass('selected')
            $(this).addClass('selected');

            let objrow = oTable_pacientesBusqueda.api(true).row('.selected').data()
            let paciente = await CitasAdmision.PacientesSeleccionarPorId(objrow.idPaciente)

            console.log('paciente', paciente)

            RegistroPaciente.CompletarDatosPaciente(paciente, 1)

            Cargando(0)
            $('#modalPacientesBusqueda').modal('hide')
        })

        /////////////////////////////KHOYOSI//////////////////////////////////////////////
        $('#modalPacienteseEnCola').on('shown.bs.modal', function (e) {
            oTable_PacientesEnCola.resize();
        });

        $('#btnPacientesEnCola').on('click', async function () {
            if (CitasAdmision.IdVentanilla > 0) {
                //const resp = await CitasAdmision.CargarTurnosPorVentanilla();
                $("#modalPacienteseEnCola").modal("show");
                /*if (resp) {
                    $("#modalPacienteseEnCola").modal("show");
                }*/
            } else {
                alerta2("warning", "", "No ha seleccionado niguna ventanilla, por favor actualice la pagina para iniciar la selección.");
            }
        });

        $('#btnAceptarVentanilla').on('click', async function () {
            CitasAdmision.IdVentanilla = $("#cboVentanillas").val();
            $("#lblNombreVentanilla").html("(" + $("#cboVentanillas option:selected").text() + ")")
            CitasAdmision.CargarTurnosPorVentanilla();
            setInterval(CitasAdmision.CargarTurnosPorVentanilla, 10000);
            $("#modalVentanilla").modal("hide");
        });

        $("#btnCancelarVentanilla").on('click', async function () {

            let validarVentanilla = await alertaAsync('question', 'CERRAR VENTANILLA',
                'Recuerde que si no selecciona la ventanilla, no podra acceder a la funcion de llamado de turnos.<br>¿Esta seguro que no seleccionara ninguna ventanilla?',
                cancelButtonText = 'No, deseo continuar', preConfirm = null, confirmButtonText = 'Si, estoy seguro')

            if (validarVentanilla.isConfirmed) {
                $("#modalVentanilla").modal("hide");
            }
        });


        ////////////////////////////////////////////////////////////////////////////////

    },

    Init: async () => {
        await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
        await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

        //$("#modalVentanilla").modal("show");        //KHOYOSI 
        
    }
}

let BuscarPacientes = async function () {
    Cargando(1)

    if ($('#chbBusquedaSis').is(':checked')) {
        alerta(4, 'Se realizará la busqueda por SIS')

        let pacientes = await CitasAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()

        if (pacientes.length > 0) {

            if (pacientes.length == 1) {
                let paciente = await CitasAdmision.PacientesSeleccionarPorId(pacientes[0].idPaciente)

                RegistroPaciente.CompletarDatosPaciente(paciente, 1)
            } else {
                oTable_pacientesBusqueda.fnClearTable()
                oTable_pacientesBusqueda.fnAddData(pacientes)
                $('#modalPacientesBusqueda').modal('show')
            }

        } else {
            alerta(2, 'No se encontro información en la Base de Datos del Establecimiento')



            $('#cboTipoDocPaciente').val(($('#hdAfiliacionTipoFormato').val() == 2 ? 1 : 2))

            $('#txtDniPaciente').val($('#hdAfiliacionNroFormato').val())

            $('#txtApellidoPaternoPaciente').val($('#hdPaterno').val())
            $('#txtApellidoMaternoPaciente').val($('#hdMaterno').val())
            $('#txtPrimerNombrePaciente').val($('#hdPnombre').val())
            $('#txtSegundoNombrePaciente').val($('#hdOnombres').val())
            $('#txtPacienteFechaNacimiento').val($('#hdFnacimiento').val())
            $('#cboSexoPaciente').val(($('#hdGenero').val() == 2 ? 0 : 1))

            $('#txtPacienteFechaNacimiento').trigger('change')

            console.log('fechanacimiento', $('#hdFnacimiento').val())

            console.log($('#hdIdSiaSis').val()) //
            console.log($('#hdCodigo').val()) //
            console.log($('#hdDocumentoNumero').val()) //
            console.log($('#hdDocumentoTipo').val()) //

            $('.chzn-select').chosen().trigger("chosen:updated")
            //$('#hdAfiliacionDisa').val(objRowSis[11]) //
            //$('#hdAfiliacionTipoFormato').val(objRowSis[12]) //
            //$('#hdAfiliacionNroFormato').val(objRowSis[13]) //
            //$('#hdAfiliacionNroIntegrante').val(objRowSis[14]) //

            //$('#hdCodigoEstablAdscripcion').val(objRowSis[18]) //
            //$('#hdAfiliacionFecha').val(objRowSis[19]) //
            //$('#hdGenero').val(objRowSis[9]) //
            // //
            //$('#hdIdDistritoDomicilio').val(objRowSis[10]) //
            //$('#hdEstado').val(objRowSis[6]) //
            //$('#hdFbaja').val(objRowSis[7]) //
            // //
            //$('#hdMotivoBaja').val(objRowSis[17]) //
            //LimpiarCampos()
        }
    } else {
        alerta(4, 'Se realizará la busqueda en la Base de Datos del Establecimiento')

        if ($('#txtDni').val() != '') {
            let paciente = await CitasAdmision.PacientesFiltraPorNroDocumentoYtipo()
            if (paciente.length > 0) {
                RegistroPaciente.CompletarDatosPaciente(paciente[0], 1)
            } else {
                alerta(2, 'No se encontro información en la Base de Datos del Establecimiento')
            }
        } else {
            let pacientes = await CitasAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()
            if (pacientes.length == 1) {
                let paciente = await CitasAdmision.PacientesSeleccionarPorId(pacientes[0].idPaciente)
                RegistroPaciente.CompletarDatosPaciente(paciente, 1)
            } else {
                oTable_pacientesBusqueda.fnClearTable()
                oTable_pacientesBusqueda.fnAddData(pacientes)
                $('#modalPacientesBusqueda').modal('show')
            }
        }
    }

    //if ($('#txtDni').val() != '' && !$('#chbBusquedaSis').is(':checked')) {
    //    

    //    
    //} else {
    //    let lsPacientes = await CitasAdmision.PacientesFiltrarTodosSoloHistoriasDefinitivas()

    //    if (lsPacientes.length > 0) {

    //        if (lsPacientes.length == 1) {
    //            let paciente = await CitasAdmision.PacientesSeleccionarPorId(lsPacientes[0].idPaciente)
    //            RegistroPaciente.CompletarDatosPaciente(paciente[0], 1)
    //        } else {
    //            oTable_pacientesBusqueda.fnClearTable()
    //            oTable_pacientesBusqueda.fnAddData(lsPacientes)
    //            $('#modalPacientesBusqueda').modal('show')
    //        }

    //    } else {
    //        alerta(2, 'No se encontro información en la Base de Datos del Establecimiento')
    //    }
    //}
    Cargando(0)
}

let ListaServicioyCatalogoByEspecialidad = async function (idServicio) {
    let especialidadByServicio = await CitasAdmision.ObtenerEspecialidadCEseleccionarIdServicio(idServicio)

    await CitasAdmision.ListarServiciosSeleccionarConsultoriosPorEspecialidad(especialidadByServicio[0].idEspecialidad)


    $(`#cboEspecialidadCita option[value=${especialidadByServicio[0].idEspecialidad}]`).attr("selected", true);
    $('.chzn-select').chosen().trigger("chosen:updated")
    $('#lblEspecialidadMedica').html(`( Esp: ${$('#cboEspecialidadCita>option:selected').text()} )`)

    await CitasAdmision.ListarFactCatalogoServiciosSeleccionarTipoConsulta(especialidadByServicio[0].idEspecialidad)
}

let completarDatosAtencion = async function (dataAtencion, dataAtencionDatosAdicionales) { // JDELGADO003-M
    Cargando(1)
    let ordenServicio = await CitasAdmision.FactOrdenServicioFiltraPorIdCuenta(dataAtencion.idCuentaAtencion)

    console.log()

    if (CitasAdmision.idEspecialidad == 0 && CitasAdmision.idReceta == 0) {
        $('#hdIdOrden').val(ordenServicio == null ? 0 : ordenServicio[0].idOrden)
    }

    $('#hdtipoCondicionPaciente').val(dataAtencion.idTipoCondicionAlServicio)

    $('#cboTipoOrigenCita').val(dataAtencion.idOrigenAtencion)
    $('#cboTipoEdadCita').val(dataAtencion.tipoEdad)

    $('#txtEdadCita').val(dataAtencion.edad)

    $('#cboTipoConsultaCita').val(ordenServicio == null ? 0 : ordenServicio[0].idProducto)
    $('.chzn-select').chosen().trigger("chosen:updated")

    // todo referencias
    let establecimiento = await CitasAdmision.web_buscarEstablecimientoPorTipoMinsa(dataAtencionDatosAdicionales.idTipoReferenciaOrigen, dataAtencionDatosAdicionales.idEstablecimientoOrigen)

    $('#cboTipoReferenciaCita').val(dataAtencionDatosAdicionales.idTipoReferenciaOrigen)
    $('.chzn-select').chosen().trigger("chosen:updated")
    $('#txtNroReferenciaCita').val(dataAtencionDatosAdicionales.nroReferenciaOrigen)

    $('#hdIdEstablecimientoReferenciaOrigen').val(dataAtencionDatosAdicionales.idEstablecimientoOrigen)

    $('#txtIdReferenciaCita').val(establecimiento?.codigo)
    $('#txtDescripcionReferenciaCita').val(establecimiento?.nombre)

    $('#cboTipoEdadCita').val(dataAtencion.tipoEdadAtencion)
    $('.chzn-select').chosen().trigger("chosen:updated")

    //if (dataAtencion.idFuenteFinanciamiento == 3) {
    //    $("#chbBusquedaSis").prop('checked', true)
    //}

    console.log('dataAtencion.idFuenteFinanciamiento', dataAtencion.idFuenteFinanciamiento)
    $('#cboFuenteFinanciamientoCita').val(dataAtencion.idFuenteFinanciamiento)
    $('.chzn-select').chosen().trigger("chosen:updated")

    $('#cboTipoOrigenCita').trigger('change')
    $('.chzn-select').chosen().trigger("chosen:updated")

    $('#cboFuenteFinanciamientoCita').trigger('change')
    $('#cboCodPrestacion').val(dataAtencionDatosAdicionales.fuaCodigoPrestacion)
    $('.chzn-select').chosen().trigger("chosen:updated")

    Cargando(0)
}

let CompletarDatosAfiliacion = async function () {

    let response
    let dni = $('#txtDni').val()
    if (dni != '') {

        if (dni.length == 8) {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '1', strNroDocumento = $('#txtDni').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        } else {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '3', strNroDocumento = $('#txtDni').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        }
        
    } else {

        if ($('#txtTipo').val().trim() == 3) {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '3', strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        } else {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '2', strTipoDocumento = $('#txtTipo').val().trim(), strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                strDisa = $('#txtDisa').val().trim(), strTipoFormato = $('#txtTipo').val().trim(), strNroContrato = $('#txtNroAfiliacion').val().trim(), strCorrelativo = '1')
        }
    }

    if (response.data.idError == '0') {
        console.log('response', response)

        let data = response.data

        let dataSet = [
            data.apePaterno, data.apeMaterno, data.nombres, '', data.fecNacimiento.substr(6, 2) + '/' + data.fecNacimiento.substr(4, 2) + '/' + data.fecNacimiento.substr(0, 4),
            data.disa + '-' + data.contrato, 0, '', data.nroDocumento, (data.genero == '0' ? '2' : '1'), data.idUbigeo, data.disa, data.tipoFormato, data.nroContrato, '',
            data.tabla, data.idNumReg, '', data.eess, data.fecAfiliacion.substr(6, 2) + '/' + data.fecAfiliacion.substr(4, 2) + '/' + data.fecAfiliacion.substr(0, 4),
            data.tipoDocumento





            //array_data[9], array_data[10], array_data[11], array_data[12], array_data[14], array_data[2] + ' ' + array_data[3] + ' ' + array_data[4],
            //array_data[16], array_data[17], array_data[18], array_data[13], array_data[15], array_data[2], array_data[3], array_data[4], array_data[5],
            //array_data[1], array_data[0], array_data[19], array_data[7], array_data[8]
        ]

        oTable_busquedaSis.fnClearTable()
        oTable_busquedaSis.fnAddData(dataSet)

        $('#modalBusquedaSis').modal('show')
    } else {
        swal({
            title: 'Cuidado',
            text: response.data.resultado,
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true
        })
        Cargando(0)
    }





    //let datosAfiliacion = await CitasAdmision.ListarAfiliadosSis()

    //if (!isEmpty(datosAfiliacion)) {
    //    if (datosAfiliacion != '') {
    //        let array_data = datosAfiliacion.split('|')

    //        if (array_data[0] != '-1') {
    //            let dataSet = [
    //                array_data[9], array_data[10], array_data[11], array_data[12], array_data[14], array_data[2] + ' ' + array_data[3] + ' ' + array_data[4],
    //                array_data[16], array_data[17], array_data[18], array_data[13], array_data[15], array_data[2], array_data[3], array_data[4], array_data[5],
    //                array_data[1], array_data[0], array_data[19], array_data[7], array_data[8]
    //            ]
    //            oTable_busquedaSis.fnClearTable()
    //            oTable_busquedaSis.fnAddData(dataSet)

    //            $('#modalBusquedaSis').modal('show')
    //        } else {
    //            alerta(2, 'No existe afiliacion para los datos ingresados')
    //        }

    //    } else {
    //        alerta(2, 'No existe afiliacion para los datos ingresados')
    //    }
    //} 
}
let CompletarDatosAfiliacionIAFAS = async function () {

    let response
    let dni = $('#txtDni').val()
    /*if (dni != '') {

        if (dni.length == 8) {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '1', strNroDocumento = $('#txtDni').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        } else {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '3', strNroDocumento = $('#txtDni').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        }
        
    } else {

        if ($('#txtTipo').val().trim() == 3) {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '1', strTipoDocumento = '3', strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                strDisa = '', strTipoFormato = '', strNroContrato = '', strCorrelativo = '1')
        } else {
            response = await CitasAdmision.ConsultarAfiliadoFuaE(
                intOpcion = '2', strTipoDocumento = $('#txtTipo').val().trim(), strNroDocumento = $('#txtNroAfiliacion').val().trim(),
                strDisa = $('#txtDisa').val().trim(), strTipoFormato = $('#txtTipo').val().trim(), strNroContrato = $('#txtNroAfiliacion').val().trim(), strCorrelativo = '1')
        }
    }*/

    response = await CitasAdmision.ConsultarAfiliadoIAFAS($('#txtDni').val().trim());

    function separarNombreCompleto(paciente) {
        if (!paciente) return null;

        const partes = paciente.trim().split(/\s+/);

        let apellidoPaterno = "";
        let apellidoMaterno = "";
        let nombres = "";

        if (partes.length >= 2) {
            apellidoPaterno = partes[0];
            apellidoMaterno = partes[1];
            nombres = partes.slice(2).join(" ");
        } else if (partes.length === 1) {
            nombres = partes[0];
        }

        return {
            apellidoPaterno,
            apellidoMaterno,
            nombres
        };
    }
    response.data = JSON.parse(response.data);
    
    if (response.data.CodigoResult == '00') {
        console.log('response', response)

        let data = response.data.AfiliadosIafas[0];
        let dataNombres = separarNombreCompleto(data.PACIENTE);

        let dataSet = [
            dataNombres.apellidoPaterno,
            dataNombres.apellidoMaterno,
            dataNombres.nombres,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            1
        ]

        oTable_busquedaSis.fnClearTable()
        oTable_busquedaSis.fnAddData(dataSet)

        $('#modalBusquedaSis').modal('show')
    } else {
        swal({
            title: 'Cuidado',
            text: response.data.resultado,
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true
        })
        Cargando(0)
    }



}
let CompletarDatosAfiliacionPN = async function () {

    let response
    let dni = $('#txtDni').val()
    
    response = await CitasAdmision.ConsultarAfiliadoPN($('#txtDni').val().trim());

    function separarNombreCompleto(paciente) {
        if (!paciente) return null;

        const partes = paciente.trim().split(/\s+/);

        let apellidoPaterno = "";
        let apellidoMaterno = "";
        let nombres = "";

        if (partes.length >= 2) {
            apellidoPaterno = partes[0];
            apellidoMaterno = partes[1];
            nombres = partes.slice(2).join(" ");
        } else if (partes.length === 1) {
            nombres = partes[0];
        }

        return {
            apellidoPaterno,
            apellidoMaterno,
            nombres
        };
    }
    response.data = JSON.parse(response.data);
    
    if (response.data.CodigoResult == '00') {
        console.log('response', response)

        let data = response.data.AfiliadosIafas[0];
        let dataNombres = separarNombreCompleto(data.PACIENTE);

        let dataSet = [
            dataNombres.apellidoPaterno,
            dataNombres.apellidoMaterno,
            dataNombres.nombres,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            1
        ]

        oTable_busquedaSis.fnClearTable()
        oTable_busquedaSis.fnAddData(dataSet)

        $('#modalBusquedaSis').modal('show')
    } else {
        swal({
            title: 'Cuidado',
            text: response.data.resultado,
            type: 'warning',
            allowOutsideClick: false,
            showCancelButton: true
        })
        Cargando(0)
    }



}
let LimpiarCampos = function () {

    $('#txtNroCuentaPaciente').val('')
    $('#txtidAtencion').val('')

    $('#txtDni').val('')
    $('#txtNroHistoria').val('')
    $('#txtApellidoPaterno').val('')
    $('#txtApellidoMaterno').val('')
    $('#txtPrimerNombre').val('')
    $('#txtSegundoNombre').val('')
    $('#txtDisa').val('')
    $('#txtTipo').val('')
    $('#txtNroAfiliacion').val('')

    $(`#cboTipoDocPaciente`).val(0)
    $('#txtDniPaciente').val('')
    $('#txtNroHistoriaPaciente').val('')
    $('#txtFechaCreacionPaciente').val('')

    $('#txtApellidoPaternoPaciente').val('')
    $('#txtApellidoMaternoPaciente').val('')
    $('#txtPrimerNombrePaciente').val('')
    $('#txtSegundoNombrePaciente').val('')
    $('#txtTercerNombrePaciente').val('')
    $('#txtIdPaciente').val('')

    $('#txtPacienteFechaNacimiento').val('')
    $('#txtHoraNacimientoPaciente').val('00:00')
    $('#txtEdadPaciente').val('')
    $(`#cboTipoEdadPaciente`).val(0)
    $('#txtEsNroHijoPaciente').val('')
    $(`#cboSexoPaciente`).val(0)
    $(`#cboEstadoCivilPaciente`).val(2)
    $(`#cboEtniaPaciente`).val(0)

    $(`#cboIdiomaMaternoPaciente`).val(0)
    $(`#cboGradoInstruccionPaciente`).val(0)
    $(`#cboOcupacionPaciente`).val(142)
    $(`#cboProcedenciaPaciente`).val(4)
    $(`#cboReligionPaciente`).val(4)

    $('#txtTelefonoPaciente').val('')
    $('#txtEmailPaciente').val('')
    $('#txtNombrePadrePaciente').val('')
    $('#txtObservacionPaciente').val('')


    $(`#cboTipoDocMadre`).val(0)
    $('#txtNroDocMadre').val('')
    $('#txtApellidoPaternoMadre').val('')
    $('#txtApellidoMaternoMadre').val('')
    $('#txtPrimerNombreMadre').val('')
    $('#txtSegundoNombreMadre').val('')


    //$(`#cboDepartamentoDomicilio`).val(15)
    $('#cboProvinciaDomicilio').empty();
    $('#cboDistritoDomicilio').empty();
    //$(`#cboDepartamentoDomicilio`).trigger('change')
    $(`#cboProvinciaDomicilio`).trigger('change')
    $(`#cboDistritoDomicilio`).trigger('change')
    $(`#cboPaisDomicilio`).val(166)
    $('#txtDireccionDomicilio').val('')

    $(`#cboDepartamentoProcedencia`).val(0)
    $('#cboProvinciaProcedencia').empty();
    $('#cboDistritoProcedencia').empty();
    $(`#cboDepartamentoProcedencia`).trigger('change')
    $(`#cboProvinciaProcedencia`).trigger('change')
    $(`#cboDistritoProcedencia`).trigger('change')
    $(`#cboPaisProcedencia`).val(166)

    $(`#cboDepartamentoNacimiento`).val(0)
    $('#cboProvinciaNacimiento').empty();
    $('#cboDistritoNacimiento').empty();
    $(`#cboDepartamentoNacimiento`).trigger('change')
    $(`#cboProvinciaNacimiento`).trigger('change')
    $(`#cboDistritoNacimiento`).trigger('change')
    $(`#cboPaisNacimiento`).val(166)

    $(`#cboPaisDomicilio`).trigger('change')
    $(`#cboPaisProcedencia`).trigger('change')
    $(`#cboPaisNacimiento`).trigger('change')


    $('#cboTipoOrigenCita').val(10)
    $('#cboTipoOrigenCita').trigger('change')

    $('#cboFuenteFinanciamientoCita').val(0)
    $('#cboFuenteFinanciamientoCita').trigger('change')


    $('#txtIdReferenciaCita').val('')
    $('#txtDescripcionReferenciaCita').val('')
    $('#txtNroReferenciaCita').val('')


    $("#chbBusquedaSis").prop('checked', false)
    $("#chbPacienteNuevo").prop('checked', false)
    $("#chbBusquedaReniec").prop('checked', false)


    $("#txtDni").prop('disabled', false)
    $("#txtNroHistoria").prop('disabled', false)
    $("#txtApellidoPaterno").prop('disabled', false)
    $("#txtApellidoMaterno").prop('disabled', false)
    $("#txtPrimerNombre").prop('disabled', false)
    $("#txtSegundoNombre").prop('disabled', false)


    // Borrar Campos Ocultos
    $('#tipoPaciente').html("")
    $('#hdtipoCondicionPaciente').val('')


    $('#hdIdEstablecimientoReferenciaOrigen').val('')


    $('#hdIdSiaSis').val('')
    $('#hdCodigo').val('')
    $('#hdAfiliacionDisa').val('')
    $('#hdAfiliacionTipoFormato').val('')
    $('#hdAfiliacionNroFormato').val('')
    $('#hdAfiliacionNroIntegrante').val('')
    $('#hdDocumentoTipo').val('')
    $('#hdCodigoEstablAdscripcion').val('')
    $('#hdAfiliacionFecha').val('')
    $('#hdPaterno').val('')
    $('#hdMaterno').val('')
    $('#hdPnombre').val('')
    $('#hdOnombres').val('')
    $('#hdGenero').val('')
    $('#hdFnacimiento').val('')
    $('#hdIdDistritoDomicilio').val('')
    $('#hdEstado').val('')
    $('#hdFbaja').val('')
    $('#hdDocumentoNumero').val('')
    $('#hdMotivoBaja').val('')
    $('#hdtipoCondicionPaciente').val('')

    $('#hdIdOrden').val('')
    $('#hdIdOrdenPago').val('')

    $("#hdIdFuenteFinanciamiento").val('')
    $("#hdProductoPlan").val('')
    $("#chkPacienteOnconaval").prop("checked",false).change();

    //CitasAdmision.tipoAccion = 0
    // Borrar Campos Ocultos
    $('.chzn-select').chosen().trigger("chosen:updated")

}

let IniciarFormularioModal = async function () {

    if (CitasAdmision.esCitaAdicional == 0) {
        let objrowCupos = oTable_cupos.api(true).row('.selected').data()
        let objrowMed = oTable_medicosProgramados.api(true).row('.selected').data()

        let medico = await CitasAdmision.ObtenerMedicosSeleccionarPorIdMedicoPlanilla(objrowMed.idMedico)

        if (isEmpty(medico)) {
            alerta('3', 'Debe seleccionar un medico')
            return false
        }

        $('#txtMedicoCita').val(`${medico.apellidoPaterno} ${medico.apellidoMaterno} ${medico.nombres} (${medico.codigoPlanilla})`)
        $('#txtFechaCita').val(CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)

        $('#txtHoraInicioCita').val(objrowCupos.turnoHoraInicio.substr(0, 5))
        $('#txtHoraFinCita').val(objrowCupos.turnoHoraFin.substr(0, 5))

        $(`#cboServicioCita`).val(objrowMed.idServicio)


        $('.chzn-select').chosen().trigger("chosen:updated")

    } else if (CitasAdmision.esCitaAdicional == 1) {
        let objrowMed = oTable_medicosProgramados.api(true).row('.selected').data()

        let medico = await CitasAdmision.ObtenerMedicosSeleccionarPorIdMedicoPlanilla(objrowMed.idMedico)

        if (isEmpty(medico)) {
            alerta('3', 'Debe seleccionar un medico')
            return false
        }

        $('#txtMedicoCita').val(`${medico.apellidoPaterno} ${medico.apellidoMaterno} ${medico.nombres} (${medico.codigoPlanilla})`)
        $('#txtFechaCita').val(CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)

        var nuevaHora = agregarMinutosAHora(objrowMed.horaFin.substr(0, 5), parseInt(objrowMed.tiempoPromedioAtencion.toString().padStart(2, '0')));

        let horaFin = nuevaHora

        console.log('horaFin', horaFin)

        $('#txtHoraInicioCita').val(objrowMed.horaFin.substr(0, 5))
        $('#txtHoraFinCita').val(horaFin)

        $(`#cboServicioCita`).val(objrowMed.idServicio)


        $('.chzn-select').chosen().trigger("chosen:updated")
    }



}
let GuardarCita = async function (tipo) {
    // tipo = 1: Guardar, tipo = 2: Modificar, tipo = 3: Eliminar
    Cargando(1)

    let idPaciente = null, idCuentaAtencion = 0, idAtencion = 0, paciente = null, cita = null

    if (tipo == 1) {

        if ($('#cboFuenteFinanciamientoCita').val() == 3 && ($('#hdIdSiaSis').val() == '' || $('#hdCodigo').val() == '') && CitasAdmision.idReceta == 0 && CitasAdmision.idEspecialidad == 0) {
            alerta(2, 'El paciente es SIS: Debe realizar la busqueda haciendo click en "Buscar en IAFAS"')
            Cargando(0)
            return false
        }
        let citasPaciente = await CitasAdmision.ListaPacienteTieneCitaByIdPacienteIdServicio($('#txtIdPaciente').val(), $('#cboServicioCita').val(), (CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio))

        if (citasPaciente.length > 0) {
            if (citasPaciente[0].totalCitas > 0) {
                alerta(2, "El paciente ya tiene una cita en este servicio para la fecha indicada")
                Cargando(0)
                return false
            }
        }

        idPaciente = await RegistroPaciente.CrearModificarHistoria()

        if (isEmpty(idPaciente)) {
            alerta(2, 'Problema al Agregar o Modificar datos del Paciente.')
            Cargando(0)
            return false
        }

        let cuentasAtencion = await CitasAdmision.CrearModificarCuentasAtenciones(idCuentaAtencion, idAtencion, idPaciente, 1)

        idAtencion = cuentasAtencion.value.idAtencion
        idCuentaAtencion = cuentasAtencion.value.idCuentaAtencion

        console.log('Datos ccita idAtencion', idAtencion)
        //idCuentaAtencion = await CitasAdmision.CrearModificarFacturacionCuentasAtencion(idPaciente, 1)

        //if (isEmpty(idCuentaAtencion)) {
        //    alerta(2, 'Problema al Agregar o Modificar Facturacion Cuentas Atencion.')
        //    Cargando(0)
        //    return false
        //}

        //idAtencion = await CitasAdmision.CrearModificarAtenciones(idCuentaAtencion, idPaciente, 1)

        //if (isEmpty(idAtencion)) {
        //    alerta(2, 'Problema al Agregar o Modificar Atencion.')
        //    Cargando(0)
        //    return false
        //}

        //idAtencionDatosAdicionales = await CitasAdmision.CrearModificarAtencionesDatosAdicionales(idAtencion)

        //if (isEmpty(idAtencionDatosAdicionales)) {
        //    alerta(2, 'Problema al Agregar o Modificar Atencion Datos Adicionales.')
        //    Cargando(0)
        //    return false
        //}

        insertFactCatalogo = await CitasAdmision.InsertFactCatalogo(idCuentaAtencion, idPaciente)

        if (!insertFactCatalogo.estado) {
            alerta(2, 'Problema al Agregar o Modificar FactCatalogo.')
            Cargando(0)
            return false
        }

        if ($('#cboFuenteFinanciamientoCita').val() == 3 && ($('#hdIdSiaSis').val() != '' || $('#hdCodigo').val() != '')) {
            let sisFiliacion = await CitasAdmision.SisFiliacionesAgregar()

            if (!sisFiliacion.estado) {
                alerta(2, 'Problema al Agregar o Modificar sisFiliacion.')
                Cargando(0)
                return false
            }
        }

        cita = await CitasAdmision.CitasAgregar(idAtencion, idPaciente)

        if (isEmpty(cita)) {
            alerta(2, 'Problema al Agregar o Modificar Cita.')
            Cargando(0)
            return false
        }

        if (CitasAdmision.idReceta != 0 && CitasAdmision.idProducto != 0) {
            await CitasAdmision.CambiarEstadoRecetaDetalleInterconsulta(CitasAdmision.idReceta, CitasAdmision.idProducto, 1)
        }

        paciente = await CitasAdmision.PacientesSeleccionarPorId(idPaciente)

        swal({
            title: 'Cita Creada ',
            html:
                'Los datos se agregaron correctamente para \n N° Historia: ' + paciente.nroHistoriaClinica + "<br> " +
                'N° Cuenta: ' + idCuentaAtencion + "<br> " +
                'N° Orden Pago: ' + insertFactCatalogo.ordenPago + "<br> ",
            //+ 
            type: 'info',
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#EF6F6C',
            confirmButtonText: 'Aceptar'
        })

        let objCupo = oTable_cupos.api(true).row('.selected').data()

        let idCupo = 0

        Cargando(0)
        if (isEmpty(objCupo)) {
            idCupo = oTable_cupos.api(true).data().length + 1
        } else {
            idCupo = objCupo.id
        }

        var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + cita + "&nroCupo=" + idCupo
        $('#ifrmTicketCita').attr('src', url)

        $('#btnCerrarModalCita').trigger("click")
        $("#modalTicket").modal('show')


        Cargando(0)

        //

        //alerta(1, 'Cita Creada!')

    }

    if (tipo == 2) {

        idPaciente = await RegistroPaciente.CrearModificarHistoria()

        if (isEmpty(idPaciente)) {
            alerta(2, 'Problema al Agregar o Modificar datos del Paciente.')
            Cargando(0)
            return false
        }

        idCuentaAtencion = await CitasAdmision.CrearModificarFacturacionCuentasAtencion($('#txtIdPaciente').val(), 1)

        if (isEmpty(idCuentaAtencion)) {
            alerta(2, 'Problema al Agregar o Modificar Facturacion Cuentas Atencion.')
            Cargando(0)
            return false
        }

        idAtencion = await CitasAdmision.CrearModificarAtenciones(idCuentaAtencion, $('#txtIdPaciente').val(), 1)

        if (isEmpty(idAtencion)) {
            alerta(2, 'Problema al Agregar o Modificar Atencion.')
            Cargando(0)
            return false
        }

        idAtencionDatosAdicionales = await CitasAdmision.CrearModificarAtencionesDatosAdicionales(idAtencion)

        if (isEmpty(idAtencionDatosAdicionales)) {
            alerta(2, 'Problema al Agregar o Modificar Atencion Datos Adicionales.')
            Cargando(0)
            return false
        }

        //insertFactCatalogo = await CitasAdmision.InsertFactCatalogo(idCuentaAtencion, $('#txtIdPaciente').val()) // SE PUEDE ACTUALIZAR AHORA

        //if (!insertFactCatalogo.estado) {
        //    alerta(2, 'Problema al Agregar o Modificar FactCatalogo.')
        //    Cargando(0)
        //    return false
        //} // SE PUEDE ACTUALIZAR AHORA

        cita = await CitasAdmision.CitasModificar(idAtencion, $('#txtIdPaciente').val())

        if (isEmpty(cita)) {
            alerta(2, 'Problema al Agregar o Modificar Cita.')
            Cargando(0)
            return false
        }

        paciente = await CitasAdmision.PacientesSeleccionarPorId($('#txtIdPaciente').val())

        swal({
            title: 'Cita Modificada: ',
            text: 'Los datos se modificaron correctamente para \n N° Historia: ' + paciente.nroHistoriaClinica + "\n " +
                'N° Cuenta: ' + idCuentaAtencion + "\n " +
                'N° Orden Pago: ' + $('#txtOrdenPagoPaciente').val() + "\n ", // SE PUEDE ACTUALIZAR AHORA
            type: 'info',
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#EF6F6C',
            confirmButtonText: 'Aceptar'
        })

        let objCupo = oTable_cupos.api(true).row('.selected').data()

        var url = "/Citas/ImprimeTicketCita?area=ConsultaExterna&idCita=" + cita + "&nroCupo=" + objCupo.id
        $('#ifrmTicketCita').attr('src', url)

        $('#btnCerrarModalCita').trigger("click")
        $("#modalTicket").modal('show')



        Cargando(0)
    }

    if (tipo == 3) {
        idCuentaAtencion = await CitasAdmision.CrearModificarFacturacionCuentasAtencion($('#txtIdPaciente').val(), 0)

        if (isEmpty(idCuentaAtencion))
            return false

        idAtencion = await CitasAdmision.CrearModificarAtenciones(idCuentaAtencion, $('#txtIdPaciente').val(), 0)

        if (isEmpty(idAtencion))
            return false

        idAtencionDatosAdicionales = await CitasAdmision.CrearModificarAtencionesDatosAdicionales(idAtencion)

        paciente = await CitasAdmision.PacientesSeleccionarPorId($('#txtIdPaciente').val())

        cita = await CitasAdmision.CitasEliminar()


        //await CitasAdmision.CambiarEstadoRecetaDetalleInterconsulta(CitasAdmision.idReceta, CitasAdmision.idProducto, 0)

        if (isEmpty(cita))
            return false

        alerta(1, 'Cita Eliminada!')

        swal({
            title: 'Cita Eliminada: ',
            text: 'La cita fue eliminada para \n N° Historia: ' + paciente.nroHistoriaClinica + "\n " +
                'N° Cuenta: ' + idCuentaAtencion + "\n ",
            //+ 'N° Cuenta: ' + insertFactCatalogo.ordenPago + "\n "
            type: 'info',
            confirmButtonColor: '#4fb7fe',
            cancelButtonColor: '#EF6F6C',
            confirmButtonText: 'Aceptar'
        })

        Cargando(0)
    }

}
let BloquearCupo = async function () {

    let objrowCita = oTable_cupos.api(true).row('.selected').data()
    let objrowMedico = oTable_medicosProgramados.api(true).row('.selected').data()

    let formData = new FormData();
    formData.append("horaBloqueo", moment(Date.now()).format('LT').substr(0, 5))
    formData.append("fechaBloqueo", moment(Date.now()).format('L'))
    formData.append("idMedico", objrowMedico.idMedico)
    formData.append("horaInicio", objrowCita.turnoHoraInicio.substr(0, 5))
    formData.append("horaFin", objrowCita.turnoHoraFin.substr(0, 5))
    formData.append("fecha", CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)


    return await HttpClient.Post('/Citas/CitasBloqueadasAgregar?area=consultaexterna', formData).then(res => {
        if (res.estado) {
            objrowCita.idCitaBloquear = res.data
        } else {
            alerta(2, res.msg)
            Cargando(0)
            return null
        }

    })

}


let CrearModificarCita = async (tipo) => {
    // tipo = 1: Guardar, tipo = 2: Modificar, tipo = 3: Eliminar

    let codigoIpress = '06208'

    let obrowMedicos = oTable_medicosProgramados.api(true).row('.selected').data()

    if (tipo == 1) {
        let servicio = await CitasAdmision.SeleccionarServicioById(CitasAdmision.idServicio)

        if (!REGISTROPACIENTE.ValidarCampos()) {
            Cargando(0)
            return false
        }

        if (servicio.soloTipoSexo == 2 && $('#cboSexoPaciente').val() != 2) {
            alerta(2, `Para el servicio: ${servicio.nombre} \n solo acepta Pacientes con el Sexo: Femenino`)
            Cargando(0)
            return false
        }

        if ($('#cboFuenteFinanciamientoCita').val() == 0) {
            alerta(2, 'Seleccione Fuente Finaciamiento')
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            Cargando(0)
            return false
        }

        if ($('#cboTipoConsultaCita').val() == 0) {
            alerta(2, "Seleccione el tipo de consulta")
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            Cargando(0)
            return false
        }

        if ($('#cboCodPrestacion').val() == 0 && $('#cboFuenteFinanciamientoCita').val() == 3) {
            alerta(2, "Seleccione el codigo prestacional")
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            Cargando(0)
            return false
        }

        // Se agrega el ultimo parametro para determinar si ha seleccionado un establecimiento
        if (codigoIpress != $('#hdCodigoEstablAdscripcion').val().substr(3, 5) && $('#cboFuenteFinanciamientoCita').val() == 3 && $('#txtIdReferenciaCita').val() != $('#hdCodigoEstablAdscripcion').val().substr(3, 5) && $('#hdCodigoEstablAdscripcion').val().substr(3, 5) != '' && $('#txtIdReferenciaCita').val() == '') {
            alerta(4, 'La afiliacion es de otro establecimiento se registrara como una referencia')

            let establecimiento = await CitasAdmision.ListaEstablecimientosByCodigo($('#hdCodigoEstablAdscripcion').val().substr(3, 5))

            console.log('establecimiento', establecimiento)

            $('#hdIdEstablecimientoReferenciaOrigen').val(establecimiento.idEstablecimiento)
            $('#txtIdReferenciaCita').val(establecimiento.codigo)
            $('#txtDescripcionReferenciaCita').val(establecimiento.nombre)

            $('#cboTipoOrigenCita').val(12)
            $('#cboTipoReferenciaCita').val(1)

            $('.chzn-select').chosen().trigger("chosen:updated")
            $('#cboTipoReferenciaCita').trigger('change')
            $('#cboTipoOrigenCita').trigger('change')
        }

        if ($('#cboTipoOrigenCita').val() == 12 && $('#txtNroReferenciaCita').val() == '') {
            alerta(2, "EL numero de referencia es obligatorio")
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            $('#txtNroReferenciaCita').focus()
            Cargando(0)
            return false
        }

        if ($('#cboFuenteFinanciamientoCita').val() == 3 && $('#hdIdSiaSis').val() == '' && tipo == 1 && CitasAdmision.idReceta == 0 && CitasAdmision.idEspecialidad == 0) {
            alerta(4, 'Se selecciono plan de financiamiento SIS, se realizara la busqueda en la Base de Datos del SIS')

            let datosAfiliado = await CitasAdmision.SeleccionarAfiliacionSis()

            console.log('datosAfiliado', datosAfiliado)

            let array = datosAfiliado.split('|')
            let datosIncorrectos = ''

            if (array[0] != '-1') {
                if (array[9].toUpperCase() != $('#txtApellidoPaternoPaciente').val().toUpperCase()) {
                    datosIncorrectos += ' Apellido Paterno'
                }
                if (array[10].toUpperCase() != $('#txtApellidoMaternoPaciente').val().toUpperCase()) {
                    datosIncorrectos += ' Apellido Materno'
                }
                if (array[11].toUpperCase() != $('#txtPrimerNombrePaciente').val().toUpperCase()) {
                    datosIncorrectos += ' Primer Nombre'
                }

                if (datosIncorrectos != '') {
                    swal({
                        title: 'Afiliacion Incorrecta',
                        text: `Los datos: \n ${datosIncorrectos}  No corresponden para la afiliacion ${$('#txtDniPaciente').val()}`,
                        type: 'warning',
                        confirmButtonColor: '#4fb7fe',
                        cancelButtonColor: '#EF6F6C',
                        confirmButtonText: 'Aceptar'
                    })
                    Cargando(0)
                    return false
                }

                $('#hdIdSiaSis').val(array[0]) //
                $('#hdCodigo').val(array[1]) //
                $('#hdAfiliacionDisa').val(array[2]) //
                $('#hdAfiliacionTipoFormato').val(array[3]) //
                $('#hdAfiliacionNroFormato').val(array[4]) //
                $('#hdAfiliacionNroIntegrante').val(array[5]) //
                $('#hdDocumentoTipo').val(array[6])
                $('#hdCodigoEstablAdscripcion').val(array[7]) //
                $('#hdAfiliacionFecha').val(array[8]) //
                $('#hdPaterno').val(array[9]) //
                $('#hdMaterno').val(array[10]) //
                $('#hdPnombre').val(array[11]) //
                $('#hdOnombres').val(array[12])
                $('#hdGenero').val(array[13]) //
                $('#hdFnacimiento').val(array[14]) //
                $('#hdIdDistritoDomicilio').val(array[15]) //
                $('#hdEstado').val(array[16]) //
                $('#hdFbaja').val(array[17]) //
                $('#hdDocumentoNumero').val(array[18]) //
                $('#hdMotivoBaja').val(array[19]) //

            } else {
                alerta(2, 'El paciente no tiene CODIGO DE ESTABLECIMIENTO DE ADSCRIPCION')
                $('#cboFuenteFinanciamientoCita').val(0)
                $('.chzn-select').chosen().trigger("chosen:updated")
                Cargando(0)
                return false
            }

            Cargando(0)
            return false
        } else {
            let items = await CitasAdmision.FactCatalogoServiciosXidTipoFinanciamiento()

            console.log('items', items)
            if (isEmpty(items) || items == []) {
                Cargando(0)

                swal({
                    title: 'No se pudo agregar los datos',
                    text: `No se puede agregar los datos. \n El Servicio (id: ${$('#cboServicioCita').val()}): ${$('#cboServicioCita>option:selected').text()} \n Tiene problemas con CPT: ${$('#cboTipoConsultaCita>option:selected').text()} \n
                           Para el Producto/Plan: ${$('#cboProductoPlan').val()} - ${$('#cboProductoPlan>option:selected').text()} \n\n (Consulte con el administrador del sistema)`,
                    type: 'warning',
                    confirmButtonColor: '#4fb7fe',
                    cancelButtonColor: '#EF6F6C',
                    confirmButtonText: 'Aceptar'
                })
                return false
            }
            GuardarCita(tipo)
        }

    }

    if (tipo == 2) {
        if (!REGISTROPACIENTE.ValidarCampos()) {
            return false
        }
        if ($('#cboFuenteFinanciamientoCita').val() == 0) {
            alerta(2, 'Seleccione Fuente Finaciamiento')
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }
        if ($('#cboTipoConsultaCita').val() == 0) {
            alerta(2, 'Seleccione el tipo de consulta')
            $('.nav-tabs a[href="#tabCita"]').tab('show');
            $('.nav-tabs a[href="#tabAtencion"]').tab('show');
            return false
        }

        GuardarCita(tipo)
    }

    if (tipo == 3) {
        GuardarCita(tipo)
    }

}
let ModalCita = async (index) => {
    Cargando(1)
    //let objrow = oTable_cupos.api(true).row('.selected').data()
    let objrowCita = oTable_cupos.api(true).row('.selected').data()
    let objrowMedico = oTable_medicosProgramados.api(true).row('.selected').data()

    let citaBloqueada = false
    let fechaCita = ''
    let fechaActual = ''
    let citasBloqueadas = []

    if (isEmpty(objrowCita)) {
        alerta(2, 'Seleccione un cupo disponible')
        Cargando(0)
        return false
    }

    await LimpiarCampos()
    await IniciarFormularioModal()

    const format = 'DD-MM-YYYY HH:mm';

    fechaCita = moment(CitasAdmision.dia + '-' + CitasAdmision.mes + '-' + CitasAdmision.anio + ' 00:00', format)
    fechaActual = moment(CitasAdmision.fechaActual.substr(0, 2) + '-' + CitasAdmision.fechaActual.substr(3, 2) + '-' + CitasAdmision.fechaActual.substr(6, 4) + ' 00:00', format)

    citasBloqueadas = await CitasAdmision.CitasBloqueadasByFecha(CitasAdmision.dia + '/' + CitasAdmision.mes + '/' + CitasAdmision.anio)

    $(citasBloqueadas).each((i, obj) => {
        if (obj.horaInicio == objrowCita.turnoHoraInicio.substr(0, 5) && obj.horaFin == objrowCita.turnoHoraFin.substr(0, 5) && obj.idMedico == objrowMedico.idMedico) {
            citaBloqueada = true
        } else {
            citaBloqueada = false
        }
    })

    $('#btnguardarCita').show()
    $('#btnguardarCita').text('Guardar')
    $('#btnguardarCita').removeClass('btn-danger')
    $('#btnguardarCita').addClass('btn-info')

    console.log('objrowCita', objrowCita.tipoCita)
    if (objrowCita.tipoCita == 'I ') {
        await CitasAdmision.ListarProcedimientosInterconsulta()
    }

    if (index == 0) {

        if (fechaActual > fechaCita) {
            alerta(2, "No se puede agregar una cita con fecha anterior a la fecha actual: ")
            Cargando(0)
            return false
        }
        if (citaBloqueada) {
            await CitasAdmision.ListarMedicosFiltrarPorProgramacionV2(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            await CitasAdmision.MostrarProgramacionMedica(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            alerta(2, "Esta cita se encuentra bloqueada por otro ususario")
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita == 6) {
            alerta(2, "Este cupo ha sido bloqueado por otro usuario")
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita != 0) {
            alerta(2, "Ya existe una cita registrada")
            Cargando(0)
            return false
        }

        await BloquearCupo()

        CitasAdmision.tipoAccion = 1
        CitasAdmision.esCitaAdicional = 0

        $('.BusquedaPacienteContenedor input').prop('disabled', false)
        $('.BusquedaPacienteContenedor select').prop('disabled', false)
        $('.BusquedaPacienteContenedor button').prop('disabled', false)
        $('.bloquear-campos').prop('disabled', false)

        $('#txtNroHistoriaPaciente').prop('disabled', true)


        $('#cboTipoOrigenCita').val(10)
        $('#cboTipoReferenciaCita').val(0)
        $(`#cboReligionPaciente`).val(4)

        $('.chzn-select').chosen().trigger("chosen:updated");

        $('#cboTipoReferenciaCita').trigger('change')
        $('#cboTipoOrigenCita').trigger('change')

        $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

        Cargando(0)

    }

    //$('#btnImprimeHojaFiliacionConsultorio').attr('disabled', true)
    //$('#btnImprimirTicket').attr('disabled', true)
    //$('#ImprimeFormatoFiliacionArchivoClinico').attr('disabled', true)

    if (index == 1) {

        if (objrowCita.idEstadoCita == 0 || objrowCita.idEstadoCita == 6) {
            alerta(2, "No existe una cita registrada en este cupo")
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita == 2) {
            alert("La cita ya fue atendida, no se puede Modificar")
            Cargando(0)
            return false
        }
        if (fechaActual > fechaCita) {
            alerta(2, "No se puede modificar una cita con fecha anterior a la fecha actual: ")
            Cargando(0)
            return false
        }


        $('#txtNroCuentaPaciente').val(objrowCita.idCuentaAtencion)
        $('#txtOrdenPagoPaciente').val(objrowCita.idOrdenPago) // SE PUEDE ACTUALIZAR AHORA
        $('#txtidAtencion').val(objrowCita.idAtencion)
        paciente = await CitasAdmision.PacientesSeleccionarPorId(objrowCita.idPaciente)
        atencion = await CitasAdmision.ListaAtencionByCuenta(objrowCita.idCuentaAtencion)
        atencionDatosAdicionales = await CitasAdmision.AtencionesDatosAdicionalesSeleccionarPorIdCuenta(objrowCita.idCuentaAtencion)

        await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
        await completarDatosAtencion(atencion, atencionDatosAdicionales)

        CitasAdmision.tipoAccion = 2

        $('#txtNroHistoriaPaciente').prop('disabled', true)
        $('.bloquear-campos').prop('disabled', false)
        //$(".RegistroPacienteContenedor input").prop('disabled', true)
        //$(".RegistroPacienteContenedor select").prop('disabled', true)
        //$(".RegistroPacienteContenedor textarea").prop('disabled', true)
        $('.BusquedaPacienteContenedor input').prop('disabled', true)
        $('.BusquedaPacienteContenedor select').prop('disabled', true)
        $('.BusquedaPacienteContenedor button').prop('disabled', true)

        $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

        Cargando(0)
    }

    if (index == 2) {

        if (objrowCita.idEstadoCita == 0 || objrowCita.idEstadoCita == 6) {
            alerta(2, 'No existe una cita registrada para este cupo')
            Cargando(0)
            return false
        }

        $('#btnguardarCita').hide()

        paciente = await CitasAdmision.PacientesSeleccionarPorId(objrowCita.idPaciente)
        atencion = await CitasAdmision.ListaAtencionByCuenta(objrowCita.idCuentaAtencion)
        atencionDatosAdicionales = await CitasAdmision.AtencionesDatosAdicionalesSeleccionarPorIdCuenta(objrowCita.idCuentaAtencion)

        await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
        await completarDatosAtencion(atencion, atencionDatosAdicionales)

        $('#txtNroCuentaPaciente').val(objrowCita.idCuentaAtencion)
        $('#txtidAtencion').val(objrowCita.idAtencion)

        $('.bloquear-campos').prop('disabled', true)
        $('#btnOpenModalEstablecimientoReferenciaCita').prop('disabled', true)
        $('#txtNroReferenciaCita').prop('disabled', true)

        $('.BusquedaPacienteContenedor input').prop('disabled', true)
        $('.BusquedaPacienteContenedor select').prop('disabled', true)
        $('.BusquedaPacienteContenedor button').prop('disabled', true)

        $('#txtNroReferenciaCita').prop('disabled', true)

        $('.chzn-select').chosen().trigger("chosen:updated")
        $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

        Cargando(0)

    }

    if (index == 3) {
        console.log(fechaActual, ' > ', fechaCita, ' = ', fechaActual > fechaCita)

        if (fechaActual > fechaCita) {
            alerta(2, "No se puede agregar una cita con fecha anterior a la fecha actual: ")
            Cargando(0)
            return false
        }
        if (citaBloqueada) {
            CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
            alerta(2, "Esta cita se encuentra bloqueada por otro ususario")
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita == 6) {
            alerta(2, "Este cupo ha sido bloqueado por otro usuario")
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita != 0) {
            alerta(2, "Ya existe una cita registrada")
            Cargando(0)
            return false
        }

        BloquearCupo()

        CitasAdmision.tipoAccion = 1

        $('#txtNroCuentaPaciente').val('')
        $('#txtidAtencion').val('')

        //$(".RegistroPacienteContenedor input").prop('disabled', false)
        //$(".RegistroPacienteContenedor select").prop('disabled', false)
        //$(".RegistroPacienteContenedor textarea").prop('disabled', false)

        $('.BusquedaPacienteContenedor input').prop('disabled', true)
        $('.BusquedaPacienteContenedor select').prop('disabled', true)
        $('.BusquedaPacienteContenedor button').prop('disabled', true)
        //$('.bloquear-campos').prop('disabled', false)

        $('#txtNroHistoriaPaciente').prop('disabled', true)

        $('#cboTipoOrigenCita').val(10)
        $('#cboTipoReferenciaCita').val(0)
        $(`#cboReligionPaciente`).val(4)

        $('.chzn-select').chosen().trigger("chosen:updated");


        $('#cboTipoReferenciaCita').trigger('change')
        $('#cboTipoOrigenCita').trigger('change')


        await CitasAdmision.ListarProcedimientosInterconsulta() // CONTINUAR
        let paciente = await CitasAdmision.PacientesSeleccionarPorId(CitasAdmision.idPaciente)
        let atencionDatosAdicionales = await CitasAdmision.AtencionesDatosAdicionalesSeleccionarPorIdCuenta(CitasAdmision.idCuentaAtencion)
        let atencion = await CitasAdmision.ListaAtencionByCuenta(CitasAdmision.idCuentaAtencion)

        await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
        await completarDatosAtencion(atencion, atencionDatosAdicionales)


        $('#cboTipoConsultaCita').val(CitasAdmision.idProducto)
        $('.chzn-select').chosen().trigger("chosen:updated");

        //console.log('tiposConsultaCita', tiposConsultaCita)

        $('#modalInterConsulta').modal('hide')
        $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

        Cargando(0)

    }

    if (index == 4) {

        if (objrowCita.idEstadoCita == 0 || objrowCita.idEstadoCita == 6) {
            alerta(2, 'No existe una cita registrada para este cupo')
            Cargando(0)
            return false
        }
        if (objrowCita.idEstadoCita == 2) {
            alerta(2, "La cita ya fue atendida, no se puede Eliminar")
            Cargando(0)
            return
        }
        if (objrowCita.idEstadoCita == 4) {
            alerta(2, "La cita esta pagada, no se puede Eliminar")
            Cargando(0)
            return
        }
        if (fechaActual > fechaCita) {
            alerta(2, "No se puede eliminar una cita con fecha anterior a la fecha actual: ")
            Cargando(0)
            return false
        }

        $('#btnguardarCita').text('Eliminar')
        $('#btnguardarCita').addClass('btn-danger')
        $('#btnguardarCita').removeClass('btn-info')

        paciente = await CitasAdmision.PacientesSeleccionarPorId(objrowCita.idPaciente)
        atencion = await CitasAdmision.ListaAtencionByCuenta(objrowCita.idCuentaAtencion)
        atencionDatosAdicionales = await CitasAdmision.AtencionesDatosAdicionalesSeleccionarPorIdCuenta(objrowCita.idCuentaAtencion)

        await RegistroPaciente.CompletarDatosPaciente(paciente, 0)
        await completarDatosAtencion(atencion, atencionDatosAdicionales)

        CitasAdmision.tipoAccion = 3

        $('#txtNroCuentaPaciente').val(objrowCita.idCuentaAtencion)
        $('#txtidAtencion').val(objrowCita.idAtencion)

        $(".RegistroPacienteContenedor input").prop('disabled', true)
        $(".RegistroPacienteContenedor select").prop('disabled', true)
        $(".RegistroPacienteContenedor textarea").prop('disabled', true)

        $('.BusquedaPacienteContenedor input').prop('disabled', true)
        $('.BusquedaPacienteContenedor select').prop('disabled', true)
        $('.BusquedaPacienteContenedor button').prop('disabled', true)
        $('.bloquear-campos').prop('disabled', true)

        $('#txtNroReferenciaCita').prop('disabled', true)

        $('.chzn-select').chosen().trigger("chosen:updated")

        $('#modalCita').modal({ backdrop: 'static', keyboard: false }).modal('show')

        Cargando(0)

    }


    if (CitasAdmision.tipoAccion != 1) {
        $('#btnImprimeHojaFiliacionConsultorio').attr('disabled', false)
        $('#btnImprimirTicket').attr('disabled', false)
        $('#ImprimeFormatoFiliacionArchivoClinico').attr('disabled', false)
        $('#ImprimeFormatoFO030').attr('disabled', false)
    } else {
        $('#btnImprimeHojaFiliacionConsultorio').attr('disabled', true)
        $('#btnImprimirTicket').attr('disabled', true)
        $('#ImprimeFormatoFiliacionArchivoClinico').attr('disabled', true)
        $('#ImprimeFormatoFO030').attr('disabled', true)
    }
}

$(document).ready(function () {
    CitasAdmision.Plugins()
    CitasAdmision.CargaInicial()

    CitasAdmision.InitDatablesMedicosProgramados()
    CitasAdmision.InitDatablesBusquedaPacientes()
    CitasAdmision.InitDatablesProcedimientosInterconsulta()
    CitasAdmision.InitDatablesCupos()
    CitasAdmision.InitDatablesBusquedaSis()
    CitasAdmision.InitDatablesPacientesCitas()
    CitasAdmision.InitDatablesEstablecimientos()
    CitasAdmision.InitDatablesPacienteEnCola();     //KHOYOSI 

    CitasAdmision.ListarDepartamentoHospitalario()   // MGAMERO
    CitasAdmision.ListarEspecialidadPorDepartamento()   // MGAMERO

    CitasAdmision.ListarMedicosPorFiltroConEspecialidad()
    CitasAdmision.ListaServicios(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)

    // Se carga para el modal registro de cita
    CitasAdmision.ListarTipoFormatoSIS()

    CitasAdmision.ListarTiposOrigenAtencionSeleccionarViasDeConsultoriosExternos()
    CitasAdmision.ListarTipoServicio()

    CitasAdmision.TiposEdadSeleccionarTodos()
    CitasAdmision.ListarFuentesFinanciamientoSegunFiltro()
    CitasAdmision.ListarTiposReferenciaSeleccionarTodos()
    CitasAdmision.ListarSisServiciosSeleccionarPorFiltro()
    // Se carga para el modal registro de cita

    //CitasAdmision.ListarVentanillas();          //KAHOYOSI

    CitasAdmision.Init()


    //
    //
    //

    //

    ////CitasAdmision.ListarProgramacionCitas(CitasAdmision.dia, CitasAdmision.mes, CitasAdmision.anio)
    //

    CitasAdmision.Events()
});

function agregarMinutosAHora(hora, minutos) {
    var partesHora = hora.split(':');
    var horas = parseInt(partesHora[0]);
    var minutosActuales = parseInt(partesHora[1]);

    var totalMinutos = horas * 60 + minutosActuales + minutos;

    var horaNueva = Math.floor(totalMinutos / 60);
    var minutosNuevos = totalMinutos % 60;

    horaNueva = horaNueva.toString();
    minutosNuevos = minutosNuevos.toString().padStart(2, '0');

    return horaNueva + ':' + minutosNuevos;
}



//var newIframe = document.getElementById('iframePrintDoc');
//newIframe.addEventListener('load', function () {
//    // La lógica que quieras ejecutar después de que el iframe haya cargado completamente
//    //console.log('El iframe ha cargado completamente.');
//    // Ejemplo: Obtener el contenido del iframe
//    var contenidoIframe = newIframe.contentDocument || newIframe.contentWindow.document;
//    newIframe.contentWindow.focus();
//    newIframe.contentWindow.print();
//});
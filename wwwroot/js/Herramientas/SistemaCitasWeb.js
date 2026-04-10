let SistemaCitasWeb = {

    /* =========================================================
       INICIO / CARGA INICIAL
    ========================================================= */
    async Iniciar() {
        SistemaCitasWeb.Plugins();
        SistemaCitasWeb.Eventos();
        SistemaCitasWeb.AsignarMesActual();

        await SistemaCitasWeb.CargarCombosIniciales();

        // Dibuja tabla al abrir
        SistemaCitasWeb.BuscarProgramacionCitasWeb();
    },

    Plugins() {
        // El HTML y los estilos ya fueron movidos al archivo .cshtml
    },

    /* =========================================================
       EVENTOS PRINCIPALES
    ========================================================= */
    Eventos() {
        $('#btnBuscarSistemaCitasWeb').off('click').on('click', async function () {
            Cargando(1);
            await SistemaCitasWeb.BuscarProgramacionCitasWeb();
            Cargando(0);
        });

        $('#btnLimpiarBusqueda').off('click').on('click', async function () {
            Cargando(1);
            await SistemaCitasWeb.Limpiar();
            Cargando(0);
        });

        $('#txtMesAnioSistemaCitasWeb').off('change').on('change', async function() {
            Cargando(1);
            await SistemaCitasWeb.BuscarProgramacionCitasWeb();
            Cargando(0);
        });

        $('#cboDepartamentoHospital').off('change').on('change', async function () {
            Cargando(1);
            await SistemaCitasWeb.ListarEspecialidadPorDepartamento();
            await SistemaCitasWeb.ListarMedicosPorFiltroConEspecialidad();
            await SistemaCitasWeb.BuscarProgramacionCitasWeb();
            Cargando(0);
        });

        $('#cboEspecialidad').off('change').on('change', async function () {
            Cargando(1);
            await SistemaCitasWeb.ListarMedicosPorFiltroConEspecialidad();
            await SistemaCitasWeb.BuscarProgramacionCitasWeb();
            Cargando(0);
        });

        $('#cboMedico').off('change').on('change', async function() {
            Cargando(1);
            await SistemaCitasWeb.BuscarProgramacionCitasWeb();
            Cargando(0);
        });

        $('#btnCerrarSistemaCitasWeb').off('click').on('click', function () {
            $('#modalSistemaCitasWeb').modal('hide');
        });

        // Click sobre celda activa de la tabla principal
        $(document).off('click', '#tblSistemaCitasWeb td.celda-dia').on('click', '#tblSistemaCitasWeb td.celda-dia', async function () {
            let valor = ($(this).text() || '').trim();

            if (!valor) return;

            let idServicio = parseInt($(this).attr('data-idservicio') || '0', 10);
            let fechaYmd = $(this).attr('data-fecha') || '';
            let servicio = $(this).attr('data-servicio') || '';

            if (!idServicio || !fechaYmd) return;

            Cargando(1);
            await SistemaCitasWeb.AbrirDetalleDiaServicio(idServicio, fechaYmd, servicio);
            Cargando(0);
        });

        // Cambio de checks del detalle
        $(document).off('change', '#tblDetalleSistemaCitasWeb .chk-citas-web').on('change', '#tblDetalleSistemaCitasWeb .chk-citas-web', function () {
            SistemaCitasWeb.ActualizarResumenDetalleModal();
        });

        // Botón de totalización (si está presente)
        $('#btnTotalizaCuposWebSistemaCitasWeb').off('click').on('click', function () {
            SistemaCitasWeb.ActualizarResumenDetalleModal();
        });

        // Guardado del detalle
        $('#btnGuardarDetalleSistemaCitasWeb').off('click').on('click', function () {
            SistemaCitasWeb.GuardarDetalleSistemaCitasWeb();
        });

        /* -----------------------------------------------------
           MODALES APILADOS / Z-INDEX DEL BACKDROP
        ----------------------------------------------------- */
        $(document)
            .off('shown.bs.modal.detalleSistemaCitas', '#modalDetalleSistemaCitasWeb')
            .on('shown.bs.modal.detalleSistemaCitas', '#modalDetalleSistemaCitasWeb', function () {
                $(this).css('z-index', 1065);

                $('.modal-backdrop').last()
                    .addClass('modal-backdrop-detalle-sistema-citas')
                    .css('z-index', 1060);
            });

        $(document)
            .off('hidden.bs.modal.detalleSistemaCitas', '#modalDetalleSistemaCitasWeb')
            .on('hidden.bs.modal.detalleSistemaCitas', '#modalDetalleSistemaCitasWeb', function () {
                $('body').addClass('modal-open');
            });
    },

    /* =========================================================
       LIMPIEZA / FECHA ACTUAL
    ========================================================= */
    AsignarMesActual() {
        let fecha = new Date();
        let anio = fecha.getFullYear();
        let mes = String(fecha.getMonth() + 1).padStart(2, '0');
        $('#txtMesAnioSistemaCitasWeb').val(`${anio}-${mes}`);
    },

    async Limpiar() {
        SistemaCitasWeb.AsignarMesActual();

        $('#cboDepartamentoHospital').val('0');
        $('#cboEspecialidad').html('<option value="0">--Seleccionar--</option>');
        $('#cboMedico').html('<option value="0">--Seleccionar--</option>');

        if ($.fn.chosen) {
            $('.chzn-select').trigger('chosen:updated');
        }

        SistemaCitasWeb.BuscarProgramacionCitasWeb();
    },

    /* =========================================================
       CARGA DE COMBOS
    ========================================================= */
    async CargarCombosIniciales() {
        await SistemaCitasWeb.ListarDepartamentoHospitalario();
        await SistemaCitasWeb.ListarEspecialidadPorDepartamento();
        await SistemaCitasWeb.ListarMedicosPorFiltroConEspecialidad();
    },

    ListarDepartamentoHospitalario() {
        if (typeof HttpClient === 'undefined') return Promise.resolve();

        let formData = new FormData();
        formData.append('lcFiltro', ' where IdEstado = 1 order by IdDepartamento');

        return HttpClient.Post('/Citas/listarDepartamentoHospitalario?area=ConsultaExterna', formData)
            .then(res => {
                $('#cboDepartamentoHospital').html('<option value="0">--Seleccionar--</option>');

                if (res && res.dataSet && res.dataSet.table) {
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboDepartamentoHospital').append(
                            `<option value="${obj.idDepartamento}">${obj.descripcionLarga}</option>`
                        );
                    });
                }

                if ($.fn.chosen) {
                    $('.chzn-select').chosen();
                    $('.chzn-select').trigger('chosen:updated');
                }
            })
            .catch(() => Promise.resolve());
    },

    ListarEspecialidadPorDepartamento() {
        let idDepartamento = $('#cboDepartamentoHospital').val();

        $('#cboEspecialidad').html('<option value="0">--Seleccionar--</option>');
        $('#cboMedico').html('<option value="0">--Seleccionar--</option>');

        if ($.fn.chosen) {
            $('.chzn-select').trigger('chosen:updated');
        }

        if (!idDepartamento || idDepartamento === '0') {
            return Promise.resolve();
        }

        if (typeof HttpClient === 'undefined') return Promise.resolve();

        let formData = new FormData();
        formData.append('lcFiltro', ` where IdEstado = 1 AND IdDepartamento = ${idDepartamento} order by Nombre`);

        return HttpClient.Post('/Citas/listarEspecialidadPorDepartamento?area=ConsultaExterna', formData)
            .then(res => {
                if (res && res.dataSet && res.dataSet.table) {
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboEspecialidad').append(
                            `<option value="${obj.idEspecialidad}">${obj.descripcionLarga}</option>`
                        );
                    });
                }

                if ($.fn.chosen) {
                    $('.chzn-select').trigger('chosen:updated');
                }
            })
            .catch(() => Promise.resolve());
    },

    ListarMedicosPorFiltroConEspecialidad() {
        let idEspecialidad = $('#cboEspecialidad').val();

        $('#cboMedico').html('<option value="0">--Seleccionar--</option>');

        if ($.fn.chosen) {
            $('.chzn-select').trigger('chosen:updated');
        }

        if (!idEspecialidad || idEspecialidad === '0') {
            return Promise.resolve();
        }

        if (typeof HttpClient === 'undefined') return Promise.resolve();

        let formData = new FormData();
        formData.append('lcFiltro', ` where EsActivo = 1 AND Especialidades.IdEspecialidad = ${idEspecialidad} order by Nombre`);

        return HttpClient.Post('/Citas/listarMedicosPorFiltroConEspecialidad?area=ConsultaExterna', formData)
            .then(res => {
                if (res && res.dataSet && res.dataSet.table) {
                    $(res.dataSet.table).each(function (i, obj) {
                        $('#cboMedico').append(
                            `<option value="${obj.idmedico}">${obj.nombre}</option>`
                        );
                    });
                }

                if ($.fn.chosen) {
                    $('.chzn-select').trigger('chosen:updated');
                }
            })
            .catch(() => Promise.resolve());
    },

    /* =========================================================
       TABLA PRINCIPAL
    ========================================================= */
    ObtenerCantidadDiasMes() {
        let valorMesAnio = $('#txtMesAnioSistemaCitasWeb').val();

        if (!valorMesAnio) return 0;

        let partes = valorMesAnio.split('-');
        let anio = parseInt(partes[0], 10);
        let mes = parseInt(partes[1], 10);

        return new Date(anio, mes, 0).getDate();
    },

    DibujarCabeceraTablaCitasWeb(cantidadDias) {
        let html = '<tr>';
        html += '<th class="col-servicio">Servicio</th>';

        for (let dia = 1; dia <= cantidadDias; dia++) {
            html += `<th class="col-dia">${dia}</th>`;
        }

        html += '</tr>';

        $('#tblSistemaCitasWeb thead').html(html);
    },

    DibujarTablaCitasWeb(lista) {
        let cantidadDias = SistemaCitasWeb.ObtenerCantidadDiasMes();

        if ($('#tblSistemaCitasWeb').length === 0) {
            console.warn('No existe #tblSistemaCitasWeb');
            return;
        }

        $('#tblSistemaCitasWeb thead').empty();
        $('#tblSistemaCitasWeb tbody').empty();

        if (!cantidadDias) {
            $('#rowTablaSistemaCitasWeb').hide();
            return;
        }

        SistemaCitasWeb.DibujarCabeceraTablaCitasWeb(cantidadDias);

        if (!lista || lista.length === 0) {
            $('#tblSistemaCitasWeb tbody').html(`
                <tr>
                    <td colspan="${cantidadDias + 1}" class="sin-registros">
                        No se encontraron registros.
                    </td>
                </tr>
            `);
            $('#rowTablaSistemaCitasWeb').show();
            return;
        }

        let htmlBody = '';

        $(lista).each(function (i, item) {
            htmlBody += '<tr>';
            htmlBody += `<td class="col-servicio">${SistemaCitasWeb.EscaparHtml(item.Servicio || '')}</td>`;

            for (let dia = 1; dia <= cantidadDias; dia++) {
                let valor = '';

                if (item.Dias && item.Dias[dia] !== undefined && item.Dias[dia] !== null) {
                    valor = item.Dias[dia];
                }

                let claseActiva = valor !== '' ? 'celda-activa' : '';
                let fechaYmd = SistemaCitasWeb.ObtenerFechaYmdDesdeDia(dia);

                htmlBody += `
                    <td class="celda-dia ${claseActiva}"
                        data-idservicio="${item.IdServicio || 0}"
                        data-dia="${dia}"
                        data-fecha="${fechaYmd}"
                        data-servicio="${SistemaCitasWeb.EscaparHtmlAtributo(item.Servicio || '')}">
                        ${SistemaCitasWeb.EscaparHtml(valor)}
                    </td>
                `;
            }

            htmlBody += '</tr>';
        });

        $('#tblSistemaCitasWeb tbody').html(htmlBody);
        $('#rowTablaSistemaCitasWeb').show();
    },

    /* =========================================================
       BÚSQUEDA GENERAL (MES COMPLETO)
    ========================================================= */
    BuscarProgramacionCitasWeb() {
        let mesAnio = $('#txtMesAnioSistemaCitasWeb').val();

        if (!mesAnio) {
            alerta2('warning', '', 'Seleccione un mes.');
            return Promise.resolve();
        }

        let lcFiltroProgramacion = SistemaCitasWeb.ConstruirFiltroProgramacionMedica();
        let lcFiltroCupos = SistemaCitasWeb.ConstruirFiltroCitasWebCupos();

        let formDataProgramacion = new FormData();
        formDataProgramacion.append('lcFiltro', lcFiltroProgramacion);

        let formDataCupos = new FormData();
        formDataCupos.append('lcFiltro', lcFiltroCupos);

        return Promise.all([
            HttpClient.Post('/Citas/BuscarProgramacionCitasWeb?area=ConsultaExterna', formDataProgramacion),
            HttpClient.Post('/Citas/BuscarCitasWebCuposBloqueados?area=ConsultaExterna', formDataCupos)
        ])
            .then(([resProgramacion, resCupos]) => {
                let dataProgramacion = [];
                let dataCupos = [];

                if (resProgramacion && resProgramacion.dataSet && resProgramacion.dataSet.table) {
                    dataProgramacion = resProgramacion.dataSet.table;
                }

                if (resCupos && resCupos.dataSet && resCupos.dataSet.table) {
                    dataCupos = resCupos.dataSet.table;
                }

                let listaAgrupada = SistemaCitasWeb.AgruparProgramacionPorDia(dataProgramacion);
                let mapaBloqueados = SistemaCitasWeb.AgruparCuposBloqueadosPorDia(dataCupos);
                let listaFinal = SistemaCitasWeb.CombinarProgramacionConBloqueados(listaAgrupada, mapaBloqueados);

                SistemaCitasWeb.DibujarTablaCitasWeb(listaFinal);
            })
            .catch(error => {
                console.error(error);
                alerta2('error', '', 'Ocurrió un error al obtener la programación y los bloqueos.');
                SistemaCitasWeb.DibujarTablaCitasWeb([]);
            });
    },

    ConstruirFiltroProgramacionMedica() {
        let mesAnio = $('#txtMesAnioSistemaCitasWeb').val();

        if (!mesAnio) return '';

        let partes = mesAnio.split('-');
        let anio = partes[0];
        let mes = partes[1];

        let ultimoDia = new Date(parseInt(anio, 10), parseInt(mes, 10), 0).getDate();

        let fechaInicio = `${anio}${mes}01`;
        let fechaFin = `${anio}${mes}${String(ultimoDia).padStart(2, '0')}`;

        let lcFiltro =
            ` WHERE dbo.Servicios.IdTipoServicio=1 ` +
            `and dbo.ProgramacionMedica.Fecha Between '${fechaInicio}' and '${fechaFin}' ` 


        if ($('#cboDepartamentoHospital').val() != '0' && !isEmpty($('#cboDepartamentoHospital').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdDepartamento = ${$('#cboDepartamentoHospital').val()} `
        }
        if ($('#cboEspecialidad').val() != '0' && !isEmpty($('#cboEspecialidad').val())) {
            lcFiltro += ` and dbo.ProgramacionMedica.IdEspecialidad = ${$('#cboEspecialidad').val()} `
        }
        if ($('#cboMedico').val() != '0' && !isEmpty($('#cboMedico').val())) {
            lcFiltro += ` and dbo.Medicos.IdMedico = ${$('#cboMedico').val()} `
        }

        lcFiltro += ` ORDER BY dbo.Servicios.Nombre, dbo.ProgramacionMedica.IdServicio, dbo.ProgramacionMedica.Fecha,dbo.ProgramacionMedica.HoraInicio `


        return lcFiltro;
    },

    ConstruirFiltroCitasWebCupos() {
        let mesAnio = $('#txtMesAnioSistemaCitasWeb').val();

        if (!mesAnio) return '';

        let partes = mesAnio.split('-');
        let anio = partes[0];
        let mes = partes[1];

        let ultimoDia = new Date(parseInt(anio, 10), parseInt(mes, 10), 0).getDate();

        let fechaInicio = `${anio}${mes}01`;
        let fechaFin = `${anio}${mes}${String(ultimoDia).padStart(2, '0')}`;

        let lcFiltro =
            ` WHERE Fecha Between (CONVERT(DATETIME,'${fechaInicio}', 103)) and (CONVERT(DATETIME,'${fechaFin}', 103)) ` +
            `ORDER BY Fecha `;

        return lcFiltro;
    },

    AgruparProgramacionPorDia(data) {
        let mapa = new Map();

        (data || []).forEach(item => {
            let idServicio = item.IdServicio || item.idServicio || 0;
            let nombreServicio = item.Nombre || item.nombre || '';
            let fecha = item.Fecha || item.fecha || null;

            let dia = SistemaCitasWeb.ObtenerDiaDesdeFecha(fecha);

            if (!idServicio || !dia) return;

            if (!mapa.has(idServicio)) {
                mapa.set(idServicio, {
                    IdServicio: idServicio,
                    Servicio: nombreServicio,
                    Dias: {}
                });
            }

            mapa.get(idServicio).Dias[dia] = 'X';
        });

        return Array.from(mapa.values()).sort((a, b) => {
            let cmp = (a.Servicio || '').localeCompare((b.Servicio || ''), 'es', { sensitivity: 'base' });
            if (cmp !== 0) return cmp;

            return (a.IdServicio || 0) - (b.IdServicio || 0);
        });
    },

    AgruparCuposBloqueadosPorDia(data) {
        let mapa = new Map();

        (data || []).forEach(item => {
            let idEstado = parseInt(item.idEstadoCitaWeb || item.IdEstadoCitaWeb || 0, 10);

            if (idEstado !== 2) return;

            let idServicio = item.idServicio || item.IdServicio || 0;
            let fecha = item.fecha || item.Fecha || null;
            let dia = SistemaCitasWeb.ObtenerDiaDesdeFecha(fecha);

            if (!idServicio || !dia) return;

            let key = `${idServicio}_${dia}`;

            if (!mapa.has(key)) {
                mapa.set(key, 0);
            }

            mapa.set(key, mapa.get(key) + 1);
        });

        return mapa;
    },

    CombinarProgramacionConBloqueados(listaProgramacion, mapaBloqueados) {
        let listaFinal = (listaProgramacion || []).map(item => {
            return {
                IdServicio: item.IdServicio,
                Servicio: item.Servicio,
                Dias: { ...(item.Dias || {}) }
            };
        });

        listaFinal.forEach(item => {
            for (let dia = 1; dia <= 31; dia++) {
                let key = `${item.IdServicio}_${dia}`;

                if (mapaBloqueados.has(key)) {
                    item.Dias[dia] = String(mapaBloqueados.get(key));
                }
            }
        });

        return listaFinal;
    },

    /* =========================================================
       HELPERS DE TEXTO / FECHA / HORA
    ========================================================= */
    EscaparHtml(texto) {
        return String(texto || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    EscaparHtmlAtributo(texto) {
        return SistemaCitasWeb.EscaparHtml(texto);
    },

    ObtenerDiaDesdeFecha(fecha) {
        if (!fecha) return 0;

        let texto = String(fecha);

        if (texto.indexOf('-') > -1 && texto.length >= 10) {
            return parseInt(texto.substring(8, 10), 10);
        }

        let match = /\/Date\((\d+)\)\//.exec(texto);
        if (match) {
            let f = new Date(parseInt(match[1], 10));
            return f.getDate();
        }

        let f = new Date(texto);
        if (!isNaN(f.getTime())) {
            return f.getDate();
        }

        return 0;
    },

    ObtenerFechaYmdDesdeDia(dia) {
        let mesAnio = $('#txtMesAnioSistemaCitasWeb').val();

        if (!mesAnio) return '';

        let partes = mesAnio.split('-');
        let anio = partes[0];
        let mes = partes[1];

        return `${anio}${mes}${String(dia).padStart(2, '0')}`;
    },

    FormatearFechaYmd(fechaYmd) {
        if (!fechaYmd || String(fechaYmd).length !== 8) return '';

        let texto = String(fechaYmd);
        return `${texto.substring(6, 8)}/${texto.substring(4, 6)}/${texto.substring(0, 4)}`;
    },

    ObtenerFechaActualYmd() {
        let hoy = new Date();
        let anio = hoy.getFullYear();
        let mes = String(hoy.getMonth() + 1).padStart(2, '0');
        let dia = String(hoy.getDate()).padStart(2, '0');

        return `${anio}${mes}${dia}`;
    },

    EsFechaEditable(fechaYmd) {
        let fecha = String(fechaYmd || '').trim();

        if (!/^\d{8}$/.test(fecha)) {
            return false;
        }

        // Solo editable desde la fecha actual
        return fecha >= SistemaCitasWeb.ObtenerFechaActualYmd();
    },


    ActualizarModoEdicionDetalle(fechaYmd) {
        let esEditable = SistemaCitasWeb.EsFechaEditable(fechaYmd);

        if (esEditable) {
            $('#btnGuardarDetalleSistemaCitasWeb').show();
        } else {
            $('#btnGuardarDetalleSistemaCitasWeb').hide();
        }

        return esEditable;
    },

    FechaAyyyymmdd(fecha) {
        if (!fecha) return '';

        let texto = String(fecha);

        if (/^\d{8}$/.test(texto)) {
            return texto;
        }

        if (texto.indexOf('-') > -1 && texto.length >= 10) {
            return texto.substring(0, 4) + texto.substring(5, 7) + texto.substring(8, 10);
        }

        let match = /\/Date\((\d+)\)\//.exec(texto);
        if (match) {
            let f = new Date(parseInt(match[1], 10));
            if (!isNaN(f.getTime())) {
                return `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, '0')}${String(f.getDate()).padStart(2, '0')}`;
            }
        }

        let f = new Date(texto);
        if (!isNaN(f.getTime())) {
            return `${f.getFullYear()}${String(f.getMonth() + 1).padStart(2, '0')}${String(f.getDate()).padStart(2, '0')}`;
        }

        return '';
    },

    NormalizarHora(hora) {
        if (!hora) return '';

        let texto = String(hora).trim();

        if (texto.length >= 5 && texto.indexOf(':') > -1) {
            return texto.substring(0, 5);
        }

        return texto;
    },

    HoraATotalMinutos(hora) {
        let texto = SistemaCitasWeb.NormalizarHora(hora || '');
        if (!texto || texto.indexOf(':') === -1) return 0;

        let partes = texto.split(':');
        let hh = parseInt(partes[0] || '0', 10);
        let mm = parseInt(partes[1] || '0', 10);

        return (hh * 60) + mm;
    },

    TotalMinutosAHora(totalMinutos) {
        totalMinutos = parseInt(totalMinutos || 0, 10);

        let hh = Math.floor(totalMinutos / 60);
        let mm = totalMinutos % 60;

        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    },

    ObtenerNombreMedico(item) {
        let apellidoPaterno = item.ApellidoPaterno || item.apellidoPaterno || '';
        let apellidoMaterno = item.ApellidoMaterno || item.apellidoMaterno || '';
        let nombres = item.Nombres || item.nombres || '';

        let nombre = `${apellidoPaterno} ${apellidoMaterno} ${nombres}`.replace(/\s+/g, ' ').trim();

        if (!nombre) {
            nombre = item.NombreMedico || item.nombreMedico || '';
        }

        return nombre;
    },

    ConstruirClaveDetalle(idServicio, fechaYmd, idMedico, horaInicio, horaFinal) {
        return [
            parseInt(idServicio || 0, 10),
            fechaYmd || '',
            parseInt(idMedico || 0, 10),
            SistemaCitasWeb.NormalizarHora(horaInicio || ''),
            SistemaCitasWeb.NormalizarHora(horaFinal || '')
        ].join('|');
    },

    /* =========================================================
       FILTROS DEL MODAL DETALLE
    ========================================================= */
    ConstruirFiltroProgramacionMedicaPorFechaServicio(fechaYmd, idServicio) {
        idServicio = parseInt(idServicio || 0, 10);

        let lcFiltro =
            ` WHERE dbo.Servicios.IdTipoServicio=1 ` +
            `and dbo.ProgramacionMedica.IdServicio=${idServicio} ` +
            `and dbo.ProgramacionMedica.Fecha='${fechaYmd}' ` +
            `ORDER BY dbo.Servicios.Nombre, dbo.ProgramacionMedica.IdServicio, dbo.ProgramacionMedica.Fecha,dbo.ProgramacionMedica.IdMedico,dbo.ProgramacionMedica.HoraInicio `;

        return lcFiltro;
    },

    ConstruirFiltroCitasWebCuposPorFechaServicio(fechaYmd, idServicio) {
        idServicio = parseInt(idServicio || 0, 10);

        let lcFiltro =
            ` WHERE Fecha = (CONVERT(DATETIME,'${fechaYmd}', 103)) ` +
            `and SIGH_EXTERNA..CitasWebCupos.idServicio=${idServicio} ` +
            `ORDER BY idMedico, HoraInicio `;

        return lcFiltro;
    },

    /* =========================================================
       APERTURA DEL MODAL DETALLE
    ========================================================= */
    async AbrirDetalleDiaServicio(idServicio, fechaYmd, servicio) {
        let lcFiltroProgramacion = SistemaCitasWeb.ConstruirFiltroProgramacionMedicaPorFechaServicio(fechaYmd, idServicio);
        let lcFiltroCupos = SistemaCitasWeb.ConstruirFiltroCitasWebCuposPorFechaServicio(fechaYmd, idServicio);

        let formDataProgramacion = new FormData();
        formDataProgramacion.append('lcFiltro', lcFiltroProgramacion);

        let formDataCupos = new FormData();
        formDataCupos.append('lcFiltro', lcFiltroCupos);

        let formDataCitas = new FormData();
        formDataCitas.append('idServicio', idServicio);
        formDataCitas.append('fechaYmd', fechaYmd);

        return Promise.all([
            HttpClient.Post('/Citas/BuscarProgramacionCitasWeb?area=ConsultaExterna', formDataProgramacion),
            HttpClient.Post('/Citas/BuscarCitasWebCuposBloqueados?area=ConsultaExterna', formDataCupos),
            HttpClient.Post('/Citas/BuscarCitasProgramadasPorServicioYFecha?area=ConsultaExterna', formDataCitas)
        ]).then(([resProgramacion, resCupos, resCitas]) => {
            let dataProgramacion = [];
            let dataCupos = [];
            let dataCitas = [];

            if (resProgramacion && resProgramacion.dataSet && resProgramacion.dataSet.table) {
                dataProgramacion = resProgramacion.dataSet.table;
            }

            if (resCupos && resCupos.dataSet && resCupos.dataSet.table) {
                dataCupos = resCupos.dataSet.table;
            }

            if (resCitas && resCitas.dataSet && resCitas.dataSet.table) {
                dataCitas = resCitas.dataSet.table;
            }

            let filasDetalle = SistemaCitasWeb.CombinarDetalleProgramacionYCupos(
                dataProgramacion,
                dataCupos,
                dataCitas,
                fechaYmd,
                idServicio,
                servicio
            );

            SistemaCitasWeb.GraficarDetalleDiaServicio(filasDetalle, {
                fechaYmd: fechaYmd,
                idServicio: idServicio,
                servicio: servicio
            });

            $('#modalDetalleSistemaCitasWeb').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#modalDetalleSistemaCitasWeb').modal('show');
        }).catch(error => {
            console.error(error);
            alerta2('error', '', 'Ocurrió un error al cargar el detalle del servicio.');
        });
    },

    /* =========================================================
       DETALLE: EXPANDIR PROGRAMACIÓN EN CUPOS
    ========================================================= */
    ExpandirProgramacionEnCupos(dataProgramacion, fechaYmd, idServicio, servicio) {
        let filas = [];

        (dataProgramacion || []).forEach(item => {
            let horaInicioBase = SistemaCitasWeb.NormalizarHora(item.HoraInicio || item.horaInicio);
            let horaFinBase = SistemaCitasWeb.NormalizarHora(item.HoraFin || item.horaFin);
            let tiempoPromedio = parseInt(item.TiempoPromedioAtencion || item.tiempoPromedioAtencion || 0, 10);

            let inicioMin = SistemaCitasWeb.HoraATotalMinutos(horaInicioBase);
            let finMin = SistemaCitasWeb.HoraATotalMinutos(horaFinBase);

            if (!inicioMin && inicioMin !== 0) return;
            if (!finMin || finMin <= inicioMin) return;

            if (!tiempoPromedio || tiempoPromedio <= 0) {
                tiempoPromedio = 20;
            }

            let medico = SistemaCitasWeb.ObtenerNombreMedico(item);
            let idMedico = item.IdMedico || item.idMedico || 0;

            for (let actual = inicioMin; actual < finMin; actual += tiempoPromedio) {
                let siguiente = actual + tiempoPromedio;

                if (siguiente > finMin) {
                    siguiente = finMin;
                }

                filas.push({
                    IdProgramacion: item.IdProgramacion || item.idProgramacion || 0,
                    IdServicio: item.IdServicio || item.idServicio || idServicio,
                    Servicio: item.Nombre || item.nombre || servicio || '',
                    FechaYmd: fechaYmd,
                    IdMedico: idMedico,
                    Medico: medico,
                    HoraInicio: SistemaCitasWeb.TotalMinutosAHora(actual),
                    HoraFinal: SistemaCitasWeb.TotalMinutosAHora(siguiente),
                    TiempoPromedioAtencion: tiempoPromedio,
                    ProgramacionRaw: item
                });
            }
        });

        filas.sort((a, b) => {
            let cmpHora = (a.HoraInicio || '').localeCompare(b.HoraInicio || '');
            if (cmpHora !== 0) return cmpHora;

            let cmpMedico = (a.Medico || '').localeCompare(b.Medico || '');
            if (cmpMedico !== 0) return cmpMedico;

            return (a.IdMedico || 0) - (b.IdMedico || 0);
        });

        return filas;
    },

    /* =========================================================
       DETALLE: CRUCE PROGRAMACIÓN + CUPOS WEB
    ========================================================= */
    CombinarDetalleProgramacionYCupos(dataProgramacion, dataCupos, dataCitas, fechaYmd, idServicio, servicio) {
        let filasProgramacion = SistemaCitasWeb.ExpandirProgramacionEnCupos(
            dataProgramacion,
            fechaYmd,
            idServicio,
            servicio
        );

        let mapaCupos = new Map();
        let mapaCitas = new Map();
        let matchedKeys = new Set();

        (dataCupos || []).forEach(item => {
            let key = SistemaCitasWeb.ConstruirClaveDetalle(
                parseInt(item.idServicio || item.IdServicio || idServicio || 0, 10),
                SistemaCitasWeb.FechaAyyyymmdd(item.fecha || item.Fecha || fechaYmd),
                parseInt(item.idMedico || item.IdMedico || 0, 10),
                SistemaCitasWeb.NormalizarHora(item.HoraInicio || item.horaInicio),
                SistemaCitasWeb.NormalizarHora(item.HoraFinal || item.horaFinal)
            );

            mapaCupos.set(key, item);
        });

        (dataCitas || []).forEach(item => {
            let key = SistemaCitasWeb.ConstruirClaveCita(
                parseInt(item.idServicio || item.IdServicio || idServicio || 0, 10),
                SistemaCitasWeb.FechaAyyyymmdd(item.Fecha || item.fecha || fechaYmd),
                SistemaCitasWeb.NormalizarHora(item.HoraInicio || item.horaInicio)
            );

            mapaCitas.set(key, item);
        });

        let filas = filasProgramacion.map(item => {
            let keyDetalle = SistemaCitasWeb.ConstruirClaveDetalle(
                item.IdServicio,
                item.FechaYmd,
                item.IdMedico,
                item.HoraInicio,
                item.HoraFinal
            );

            let keyCita = SistemaCitasWeb.ConstruirClaveCita(
                item.IdServicio,
                item.FechaYmd,
                item.HoraInicio
            );

            let cupo = mapaCupos.get(keyDetalle) || null;
            let cita = mapaCitas.get(keyCita) || null;

            if (cupo) {
                matchedKeys.add(keyDetalle);
            }

            let tieneCita = !!cita;
            let idEstadoCitaWeb = cupo ? parseInt(cupo.idEstadoCitaWeb || cupo.IdEstadoCitaWeb || 1, 10) : 1;

            return {
                IdProgramacion: item.IdProgramacion || 0,
                IdServicio: item.IdServicio || 0,
                Servicio: item.Servicio || servicio || '',
                FechaYmd: item.FechaYmd || fechaYmd || '',
                HoraInicio: item.HoraInicio || '',
                HoraFinal: item.HoraFinal || '',
                IdMedico: item.IdMedico || 0,
                Medico: item.Medico || '',
                IdWeb: cupo ? (cupo.idWeb || cupo.IdWeb || 0) : 0,
                IdCitaBloqueada: cupo ? (cupo.idCitaBloqueada || cupo.IdCitaBloqueada || 0) : 0,
                IdEstadoCitaWeb: tieneCita ? 1 : idEstadoCitaWeb,
                CitasWebChecked: tieneCita ? false : idEstadoCitaWeb === 2,
                CitasWebDisabled: tieneCita,
                TieneCita: tieneCita,
                Paciente: tieneCita ? SistemaCitasWeb.ObtenerNombrePaciente(cita) : '',
                NroHistoriaClinica: tieneCita ? (cita.NroHistoriaClinica || cita.nroHistoriaClinica || '') : '',
                NroDocumento: tieneCita ? (cita.NroDocumento || cita.nroDocumento || '') : '',
                EsFueraProgramacion: false
            };
        });

        (dataCupos || []).forEach(item => {
            let idServicioItem = parseInt(item.idServicio || item.IdServicio || idServicio || 0, 10);
            let fechaItem = SistemaCitasWeb.FechaAyyyymmdd(item.fecha || item.Fecha || fechaYmd);
            let horaInicio = SistemaCitasWeb.NormalizarHora(item.HoraInicio || item.horaInicio);
            let horaFinal = SistemaCitasWeb.NormalizarHora(item.HoraFinal || item.horaFinal);
            let idMedico = parseInt(item.idMedico || item.IdMedico || 0, 10);

            let keyDetalle = SistemaCitasWeb.ConstruirClaveDetalle(
                idServicioItem,
                fechaItem,
                idMedico,
                horaInicio,
                horaFinal
            );

            if (matchedKeys.has(keyDetalle)) return;

            let keyCita = SistemaCitasWeb.ConstruirClaveCita(
                idServicioItem,
                fechaItem,
                horaInicio
            );

            let cita = mapaCitas.get(keyCita) || null;
            let tieneCita = !!cita;
            let idEstadoCitaWeb = parseInt(item.idEstadoCitaWeb || item.IdEstadoCitaWeb || 1, 10);

            filas.push({
                IdProgramacion: 0,
                IdServicio: idServicioItem,
                Servicio: servicio || '',
                FechaYmd: fechaItem,
                HoraInicio: horaInicio,
                HoraFinal: horaFinal,
                IdMedico: idMedico,
                Medico: '',
                IdWeb: item.idWeb || item.IdWeb || 0,
                IdCitaBloqueada: item.idCitaBloqueada || item.IdCitaBloqueada || 0,
                IdEstadoCitaWeb: tieneCita ? 1 : idEstadoCitaWeb,
                CitasWebChecked: tieneCita ? false : idEstadoCitaWeb === 2,
                CitasWebDisabled: tieneCita,
                TieneCita: tieneCita,
                Paciente: tieneCita ? SistemaCitasWeb.ObtenerNombrePaciente(cita) : '',
                NroHistoriaClinica: tieneCita ? (cita.NroHistoriaClinica || cita.nroHistoriaClinica || '') : '',
                NroDocumento: tieneCita ? (cita.NroDocumento || cita.nroDocumento || '') : '',
                EsFueraProgramacion: true
            });
        });

        filas.sort((a, b) => {
            let cmpMedico = (a.Medico || '').localeCompare((b.Medico || ''), 'es', { sensitivity: 'base' });
            if (cmpMedico !== 0) return cmpMedico;

            let cmpHora = (a.HoraInicio || '').localeCompare(b.HoraInicio || '');
            if (cmpHora !== 0) return cmpHora;

            let cmpHoraFin = (a.HoraFinal || '').localeCompare(b.HoraFinal || '');
            if (cmpHoraFin !== 0) return cmpHoraFin;

            return 0;
        });

        return filas;
    },

    /* =========================================================
       DETALLE: GRAFICAR MODAL
    ========================================================= */
    GraficarDetalleDiaServicio(filasDetalle, info) {
        $('#hdDetalleFechaYmdSistemaCitasWeb').val(info.fechaYmd || '');
        $('#hdDetalleIdServicioSistemaCitasWeb').val(info.idServicio || 0);

        SistemaCitasWeb.AsignarTextoOValor('#txtDetalleServicioSistemaCitasWeb', info.servicio || '');
        SistemaCitasWeb.AsignarTextoOValor('#txtDetalleFechaSistemaCitasWeb', SistemaCitasWeb.FormatearFechaYmd(info.fechaYmd || ''));

        let esEditable = SistemaCitasWeb.ActualizarModoEdicionDetalle(info.fechaYmd || '');
        let html = '';

        if (!filasDetalle || filasDetalle.length === 0) {
            html = `
            <tr>
                <td colspan="5" class="text-center">No se encontraron registros.</td>
            </tr>
        `;
        } else {
            filasDetalle.forEach((fila, index) => {
                html += `
                <tr
                    data-index="${index}"
                    data-idprogramacion="${fila.IdProgramacion || 0}"
                    data-idweb="${fila.IdWeb || 0}"
                    data-idcitabloqueada="${fila.IdCitaBloqueada || 0}"
                    data-idservicio="${fila.IdServicio || 0}"
                    data-fecha="${fila.FechaYmd || ''}"
                    data-horainicio="${fila.HoraInicio || ''}"
                    data-horafinal="${fila.HoraFinal || ''}"
                    data-idmedico="${fila.IdMedico || 0}"
                    data-es-fuera-programacion="${fila.EsFueraProgramacion ? 1 : 0}"
                    data-tiene-cita="${fila.TieneCita ? 1 : 0}">
                    <td class="text-center">
                        <input type="checkbox"
                               class="chk-citas-web"
                               ${fila.CitasWebChecked ? 'checked' : ''}
                               ${(fila.CitasWebDisabled || !esEditable) ? 'disabled' : ''}>
                    </td>
                    <td>${SistemaCitasWeb.EscaparHtml(fila.HoraInicio || '')}</td>
                    <td>${SistemaCitasWeb.EscaparHtml(fila.HoraFinal || '')}</td>
                    <td>${SistemaCitasWeb.EscaparHtml(fila.Medico || '')}</td>
                    <td class="td-paciente">
                        ${fila.TieneCita
                        ? `
                                <div class="paciente-inline">
                                    <span class="paciente-nombre-inline">
                                        ${SistemaCitasWeb.EscaparHtml(fila.Paciente || '')}
                                    </span>
                                    ${fila.NroHistoriaClinica
                            ? `<span class="chip chip-hc"><span class="chip-label">HC</span><span class="chip-value">${SistemaCitasWeb.EscaparHtml(fila.NroHistoriaClinica)}</span></span>`
                            : ''
                        }
                                    ${fila.NroDocumento
                            ? `<span class="chip chip-doc"><span class="chip-label">Doc</span><span class="chip-value">${SistemaCitasWeb.EscaparHtml(fila.NroDocumento)}</span></span>`
                            : ''
                        }
                                </div>
                              `
                        : ''
                    }
                    </td>
                </tr>
            `;
            });
        }

        $('#tblDetalleSistemaCitasWeb tbody').html(html);
        SistemaCitasWeb.ActualizarResumenDetalleModal();
    },

    ActualizarResumenDetalleModal() {
        let $rows = $('#tblDetalleSistemaCitasWeb tbody tr').filter(function() {
            return $(this).find('td').length > 1;
        });

        let totalProgramados = $rows.filter(function() {
            return String($(this).attr('data-es-fuera-programacion') || '0') !== '1';
        }).length;

        let totalFueraProgramacion = $rows.filter(function() {
            return String($(this).attr('data-es-fuera-programacion') || '0') === '1';
        }).length;

        let totalCitasWeb = $rows.find('.chk-citas-web:checked').length;

        SistemaCitasWeb.AsignarTextoOValor('#txtDetalleTotalProgramadosSistemaCitasWeb', totalProgramados);
        SistemaCitasWeb.AsignarTextoOValor('#txtDetalleTotalCitasWebSistemaCitasWeb', totalCitasWeb);
        SistemaCitasWeb.AsignarTextoOValor('#txtDetalleTotalRefConSistemaCitasWeb', '0');

        let textoLeyenda = 'Gris = Cupos fuera de programación';
        if (totalFueraProgramacion > 0) {
            textoLeyenda += ` (${totalFueraProgramacion})`;
        }

        SistemaCitasWeb.AsignarTextoOValor('#txtLeyendaFueraProgramacionSistemaCitasWeb', textoLeyenda);
    }, 

    /* =========================================================
       DETALLE: Buscar Citas Programadas PorServicio Y Fecha
    ========================================================= */
    ConstruirClaveCita(idServicio, fechaYmd, horaInicio) {
        return [
            parseInt(idServicio || 0, 10),
            fechaYmd || '',
            (horaInicio || '').trim()
        ].join('|');
    },

    ObtenerNombrePaciente(item) {
        let apellidoPaterno = item.ApellidoPaterno || item.apellidoPaterno || '';
        let apellidoMaterno = item.ApellidoMaterno || item.apellidoMaterno || '';
        let primerNombre = item.PrimerNombre || item.primerNombre || '';
        let segundoNombre = item.SegundoNombre || item.segundoNombre || '';

        return [
            apellidoPaterno,
            apellidoMaterno,
            primerNombre,
            segundoNombre
        ].join(' ').replace(/\s+/g, ' ').trim();
    },
    AsignarTextoOValor(selector, valor) {
        let $el = $(selector);

        if (!$el.length) return;

        if ($el.is('input, textarea, select')) {
            $el.val(valor);
        } else {
            $el.text(valor);
        }
    },
    /* =========================================================
       DETALLE: GUARDADO
    ========================================================= */
    GuardarDetalleSistemaCitasWeb() {
        let payload = [];
        let fechaYmd = $('#hdDetalleFechaYmdSistemaCitasWeb').val();
        let idServicio = parseInt($('#hdDetalleIdServicioSistemaCitasWeb').val() || '0', 10);
        let idUsuario = parseInt($('#hdIdUsuarioSistemaCitasWeb').val() || '0', 10);
        
        if (!SistemaCitasWeb.EsFechaEditable(fechaYmd)) {
            alerta2('warning', '', 'Solo puede modificar fechas desde la fecha actual.');
            return;
        }

        if (!idUsuario) {
            alerta2('warning', '', 'No se encontró el IdUsuario.');
            return;
        }

        $('#tblDetalleSistemaCitasWeb tbody tr').each(function() {
            if ($(this).find('td').length <= 1) return;

            let tieneCita = String($(this).attr('data-tiene-cita') || '0') === '1';
            let checked = !tieneCita && $(this).find('.chk-citas-web').is(':checked');

            payload.push({
                Fecha: fechaYmd,
                IdServicio: idServicio,
                IdProgramacion: parseInt($(this).attr('data-idprogramacion') || '0', 10),
                IdWeb: parseInt($(this).attr('data-idweb') || '0', 10),
                IdCitaBloqueada: parseInt($(this).attr('data-idcitabloqueada') || '0', 10),
                IdMedico: parseInt($(this).attr('data-idmedico') || '0', 10),
                HoraInicio: $(this).attr('data-horainicio') || '',
                HoraFinal: $(this).attr('data-horafinal') || '',
                IdEstadoCitaWeb: checked ? 2 : 1,
                EsFueraProgramacion: parseInt($(this).attr('data-es-fuera-programacion') || '0', 10),
                IdUsuario: idUsuario
            });
        });

        if (payload.length === 0) {
            alerta2('warning', '', 'No hay datos para guardar.');
            return;
        }

        console.log('Payload GuardarDetalleSistemaCitasWeb:', payload);

        Cargando(1);

        return fetch('/Citas/GuardarDetalleSistemaCitasWeb?area=ConsultaExterna', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(res => {
            Cargando(0);

            if (res && res.session === false) {
                return;
            }

            if (res.estado) {
                alerta2('success', '', res.mensaje || 'Datos guardados correctamente.');
                $('#modalDetalleSistemaCitasWeb').modal('hide');
                SistemaCitasWeb.BuscarProgramacionCitasWeb();
            } else {
                alerta2('warning', '', res.mensaje || 'No se pudieron guardar los datos.');
            }

            return res;
        })
        .catch(error => {
            Cargando(0);
            console.error('Error:', error);
            alerta2('error', '', 'Ocurrió un error al guardar los datos.');
        });
    }


};
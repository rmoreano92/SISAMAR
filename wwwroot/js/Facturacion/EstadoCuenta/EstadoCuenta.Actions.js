import * as Api from './EstadoCuenta.Api.js'
import * as Utils from './EstadoCuenta.Utils.js'

export class EstadoCuentaActions {

    constructor(ctx) {
        this.ctx = ctx;
    }

    async IncializarCombos() {
        const fuentesFinanciamiento = await Api.FuentesFinanciamientoSegunFiltro('UtilizadoEn=1 or UtilizadoEn=3  or UtilizadoEn=2')

        Utils.renderFuentesFinaciamiento(fuentesFinanciamiento)
    }

    async ListarProductoPlanPorFuenteFinanciamiento(IdFuenteFinanciamiento) {
        const productoPlan = await Api.TiposFinanciamientosTarifaSeleccionarPorPlan(IdFuenteFinanciamiento)

        Utils.renderProductoPlan(productoPlan)
    }

    async ConfiguraPermisosUsuario(IdtipoFinanciamiento, nivelEvaluacion) {
        let TrabajaEstadosCuenta = await Api.TiposFinanciamientoDevuelveComoSeTrabajaEnEstadoCuenta(IdtipoFinanciamiento)
        this.ctx.idAreaLabora = await Api.DevuelveSubAreaDondeLaboraElUsuarioDelSistema(4)

        if ((this.ctx.idAreaLabora == TrabajaEstadosCuenta.generaPago) || (this.ctx.idAreaLabora == 9 && TrabajaEstadosCuenta.generaPago == 1)) {
            this.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf = this.ctx.idAreaLabora

            if (this.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 9) {

                if (nivelEvaluacion == 'BRS') {
                    this.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf = 0
                    alerta2('info', 'Riesgo Social', 'Evaluación del paciente: Riesgo social bajo. No aplica exoneración.');
                    return
                }

                $('#thImpExoServicios').attr('style', 'background: red !important')
                $('.contExoneracion').show()
                $('#btnActualizaExoneracionSis').html('<i class="fa fa-file mb-1" style="font-size: 20px;"></i> <br /> ACTUALIZA EXONERACIONES')
            } else if (this.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf == 2 && IdtipoFinanciamiento == 2) {
                $('.tb-header-sis').attr('style', 'background: red !important')
                $('.contTodosNingunoSis').show()
                $('.contExoneracion').show()
                $('#btnActualizaExoneracionSis').html('<i class="fa fa-file mb-1" style="font-size: 20px;"></i> <br /> ACTUALIZA SIS')

            }
        } else {
            this.ctx.idUsuarioConPermisoEnSISoEXOoSOATconf = 0

            $('.contTodosNingunoSis').hide()
            $('.contExoneracion').hide()
        }
    }

    async BuscarEstadoCuentaPacientePorIdCuentaAtencion(idCuentaAtencion) {

        try {
            Cargando(1)

            const cabecera = await Api.AtencionesFiltraDatosCabecera(idCuentaAtencion);
            if (!cabecera || cabecera.length === 0) {
                Cargando(0);
                return alerta2('warning', 'Estado Cuenta', 'Cuenta no encontrada');
            }

            const data = cabecera[0];

            let config = await this.ConfiguraPermisosUsuario(data.idTipoFinanciamiento, data.nivelEval)


            let deudaSangre = await this.ObtenerCuentasConDudaDeSangrePorPaciente(data.idPaciente)

            if(deudaSangre != '') {
                Cargando(0)
                let confirmaDebeSangre = await alertaAsync('warning', '', deudaSangre)
            }

            if (data.idEstado != 1) {
                alerta2('warning', 'Estado Cuenta', `Cuenta cerrada [Estado: ${data.estadoCta}]`);
            }

            Variables.Cargar(data)

            this.ctx.IdCuentaAtencion = data.idCuentaAtencion
            this.ctx.IdPaciente = data.idPaciente
            this.ctx.idTipoFinanciamiento = data.idTipoFinanciamiento
            this.ctx.IdEstadoCuentaAtencion = data.idEstado
            this.ctx.VecesAbierto = data.vecesAbierto

            const [servicios, farmacia, consolidado, listaCuentas] = await Promise.all([
                Api.FacturacionServicioDespachoXcuenta(idCuentaAtencion),
                Api.FarmMovimientoVentasDetalleXcuenta(idCuentaAtencion),
                Api.ListarConsolidadoPorEstadoCuenta(idCuentaAtencion),
                Api.AtencionesListaCuentasXpaciente(data.idPaciente)
            ]);

            Utils.renderComboCuentasAtencion(listaCuentas)
            Utils.renderTablas(this.ctx, { servicios, farmacia, consolidado });
            Utils.renderDatosCabecera(data);



            $('.nav-tabs a[href="#TabPorPaciente"]').tab('show');

        } catch (err) {
            console.error("Error en BuscarEstadoCuentaPacientePorIdCuentaAtencion", err);
            alerta2('error', 'Estado Cuenta', 'Ocurrió un error al cargar la cuenta');
        } finally {
            Cargando(0);
        }
    }

    async ListarAtencionesPorPaciente() {

        let data = await Api.ListarAtencionesPorPaciente(this.ctx.IdPaciente)

        Utils.cargarTabla(this.ctx.oTable_TableListaCuentasPacientesBusqueda, data)
    }

    async BuscarListaPacientes() {
        const fechaInicioDate = Utils.parseDateDMY($('#txtFechaIngresoBusq').val());
        const fechaFinDate = Utils.parseDateDMY($('#txtFechaHastaBusq').val());

        if (fechaInicioDate > fechaFinDate) {
            alerta(2, 'La fecha inicio no puede ser mayor que la fecha fin');
            return
        }

        if (fechaInicioDate == '' || fechaFinDate == '') {
            alerta2('warning', '', 'Por favor ingrese la Fecha de Inicio y Fin')
            return
        }

        Cargando(1);
        Utils.ocultarContenedores();

        const opcion = $('input[name="rdbTipoBusqueda"]:checked').val();
        let listaPacientes = [];

        switch (opcion) {
            case '1':
            case '2':
            case '3':
                listaPacientes = await Api.AtencionesSeleccionarPorTipoServicio();
                break;
            case '4':
                listaPacientes = await Api.FactOrdenServicioPreventasServicio();
                break;
            case '5':
                listaPacientes = await Api.farmMovimientoVentasExoneracionesEnFarmacia();
                break;
            case '6':
                listaPacientes = await Api.AtencionesSeleccionarPacExtPorFechas();
                break;
        }

        Utils.mostrarContenedorPorOpcion(this.ctx, opcion, listaPacientes);
        Cargando(0);
    }
    async SeleccionarFilaTablaPacientes(trElement) {
        Utils.toggleRowSelection(this.ctx.oTable_TableListaPacientes, trElement);

        let rowData = this.ctx.oTable_TableListaPacientes.api(true).row('.selected').data()
        if (!rowData) return;

        await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(rowData.idCuentaAtencion)
    }

    async SeleccionarFilaTablaPacientesBusqueda(trElement) {
        // Utils.toggleRowSelection(this.ctx.oTable_TableListaPacientesBusqueda, trElement);

        this.ctx.oTable_TableListaPacientesBusqueda.$('tr.selected').removeClass('selected')
        $(trElement).addClass('selected')

        let rowData = this.ctx.oTable_TableListaPacientesBusqueda.api(true).row('.selected').data()
        if (!rowData) return;

        this.ctx.IdPaciente = rowData.idPaciente;

        await this.ListarAtencionesPorPaciente(rowData.idPaciente)

        $('#modalBusquedaCuentasPaciente').modal('show')
    }

    async ModificarCantidadServiciosSis(element) {
        const input = element;
        const tr = input.closest('tr');
        const table = this.ctx.oTable_TableServicios.api(true);
        const row = table.row(tr);
        const data = row.data();

        const valor = input.val();

        if (valor == '') {
            return
        }
        if (valor > data.cantidad) {
            alerta2('info', '', `La cantidad autorizada (SIS, SOAT) = ${valor} <br> pasa de la cantidad ${data.cantidad}`)
            input.val(0)
            return
        }

        let calculoTotal = parseFloat(data.precioUnitario) * (data.cantidad - valor);

        data.cantidadFinanciadaSis = valor
        data.cantidadPagar = data.cantidad - valor
        data.totalPagar = calculoTotal

        const colIndex = input.closest('td').index(); // para ubicar el input exacto
        const rowIndex = row.index();

        if (calculoTotal > 0) {
            tr.css({
                'color': '#FF00FF',
                'font-weight': 'bold'
            });
        } else {
            tr.css({
                'color': '',
                'font-weight': ''
            });
        }

        row.data(data).draw();

        const nuevoInput = $('#tblServicios tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-cantidad-sis');
        nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
    }

    async ValidarCantidadServiciosSis(element) {
        const input = element;
        const tr = input.closest('tr');
        const table = this.ctx.oTable_TableServicios.api(true);
        const row = table.row(tr);
        const data = row.data();

        const valor = input.val();

        if (valor == '') {
            alerta2('info', '', `Ingrse un valor valido`)
            input.val(data.cantidadFinanciadaSis)
            input.focus()
            return
        }
    }

    async ModificarCantidadFarmaciaSis(element) {
        const input = element;
        const tr = input.closest('tr');
        const table = this.ctx.oTable_TableFarmacia.api(true);
        const row = table.row(tr);
        const data = row.data();

        const valor = input.val();

        if (valor == '') {
            return
        }
        if (valor > data.cantidad) {
            alerta2('info', '', `La cantidad autorizada (SIS, SOAT) = ${valor} <br> pasa de la cantidad ${data.cantidad}`)
            input.val(0)
            return
        }

        let calculoTotal = parseFloat(data.precioUnitario) * (data.cantidad - valor);

        data.cantidadFinanciadaSis = valor
        data.cantidadPagar = data.cantidad - valor
        data.totalPagar = calculoTotal

        const colIndex = input.closest('td').index(); // para ubicar el input exacto
        const rowIndex = row.index();

        if (calculoTotal > 0) {
            tr.css({
                'color': '#FF00FF',
                'font-weight': 'bold'
            });
        } else {
            // Restablecer estilos si ya no cumple la condición
            tr.css({
                'color': '',
                'font-weight': ''
            });
        }

        // Reasignar los datos para que el render se active
        row.data(data).draw();


        // Esperar al redibujado y volver a enfocar
        const nuevoInput = $('#tblFarmacia tbody tr').eq(rowIndex).find('td').eq(colIndex).find('.input-table-cantidad-sis');
        nuevoInput.focus()[0].setSelectionRange(nuevoInput.val().length, nuevoInput.val().length + 1);
    }

    async ValidarCantidadFarmaciaSis(element) {
        const input = element;
        const tr = input.closest('tr');
        const table = this.ctx.oTable_TableFarmacia.api(true);
        const row = table.row(tr);
        const data = row.data();

        const valor = input.val();

        if (valor == '') {
            alerta2('info', '', `Ingrse un valor valido`)
            input.val(data.cantidadFinanciadaSis)
            input.focus()
            return
        }
    }

    async SolicitarConfirmacionCredenciales() {
        let verificar = await alertaAsync(
            '',
            'Confirmar Usuario',
            `<label for="txtUsuarioConfirmacion" style="text-align:left; display:block; margin-bottom:15px !important;">Usuario</label>
        <div class="form-group">
            <input type="text" id="txtUsuarioConfirmacion" class="form-control" placeholder="Ingrese usuario" value=${$('#hdIdUsuario').val()} disabled>
        </div>
        
        <label for="txtContraseniaConfirmacion" style="text-align:left; display:block; margin-bottom:15px !important;">Contraseña</label>
        <div class="form-group">
        <input type="password" id="txtContraseniaConfirmacion" class="form-control" placeholder="Ingrese contraseña">
        </div>
        
        `,
            'Cancelar',
            async function () {
                let password = $('#txtContraseniaConfirmacion').val();
                if (!password) {
                    Swal.showValidationMessage('Debe ingresar una contraseña');
                    return false; // No cierra
                }
                return password; // Devuelve password, irá a result.value
            }
        );

        if (verificar.isConfirmed) {

            let usuario = $('#txtUsuarioConfirmacion').val()
            let password = $('#txtContraseniaConfirmacion').val()

            let validacion = await Api.ValidarInicioSesion(usuario, password)

            if (validacion.success) {
                return true
            } else {
                alerta(2, 'La contraseña no es correcta, intentalo nuevamente.')

                return this.SolicitarConfirmacionCredenciales()
            }

        } else {
            return false
        }
    }

    async GenerarExoneracionCuentaPaciente() {

        let lstServicios = JSON.stringify(this.ctx.oTable_TableServicios.api(true).data().toArray())
        let lstFarmacias = JSON.stringify(this.ctx.oTable_TableFarmacia.api(true).data().toArray())

        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un número de cuenta');
            return;
        }

        try {

            let confirmar = await alertaAsync('question', '', 'Para realizar este paso todos los procesos tienen que haberse cumplido correctamente <br><br> ¿Está seguro de realizar este paso?');

            if (confirmar.isConfirmed) {
                let validarInicioSesion = await this.SolicitarConfirmacionCredenciales();

                if (validarInicioSesion) {
                    Cargando(1);
                    let exoneracion = await Api.GenerarExoneracionCuentaPaciente(this.ctx.IdCuentaAtencion, lstServicios, lstFarmacias)

                    if (exoneracion.successNumber == 1) {
                        alerta2('success', '', exoneracion.successMessage)

                        await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
                    } else {
                        alerta2('error', '', exoneracion.errorMessage)
                    }
                    Cargando(0);
                }
            }

        } catch (error) {
            console.error('Error en proceso de exoneración:', error);
        }

    }

    async CambiarEstadoCuentaPacientePagada() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado = PENDIENTE PAGO SEGURO?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.ctx.actions.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {

                Cargando(1);

                let cuentaPagada = await Api.FacturacionCuentasAtencionPagada(this.ctx.IdCuentaAtencion, this.ctx.IdPaciente)
                Cargando(0);
                if (cuentaPagada.successNumber == 1) {
                    alerta2('success', '', `La cuenta paso a estado (PAGADA)`)

                    await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
                } else {
                    alerta2('error', '', data.errorMessage)
                }
            }
        }
    }

    async CambiarEstadoCuentaPendienteDePagoSeguros() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let verificaTipoDoc = (await Utilitario.SeleccionarParametro(403)).valorTexto

        if (verificaTipoDoc == 1) {
            let paciente = await Api.PacientesSeleccionarPorId(this.ctx.IdPaciente)

            if (!isEmpty(paciente)) {
                if (paciente.idDocIdentidad == 0) {
                    alerta2('warning', '', 'No se puede cerrar la cuenta porque tiene que regularizar su tipo de documento de indentidad, no se permite alta con tipo de documento -> (SIN DOCUMENTO), ACERCARSE A ADMISION')
                    return
                }
            } else {
                alerta2('warning', '', 'No se puede cerrar la cuenta porque tiene que regularizar su tipo de documento de indentidad, no se permite alta con tipo de documento -> (SIN DOCUMENTO), ACERCARSE A ADMISION')
                return
            }

        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado = PENDIENTE PAGO SEGURO?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {
                Cargando(1)
                let cuentaPagada = await Api.FacturacionCuentasAtencionPendientePagoSeguro(this.ctx.IdCuentaAtencion, this.ctx.IdPaciente)
                Cargando(0)
                if (cuentaPagada.successNumber == 1) {
                    alerta2('success', '', `La Cuenta se ha Cerrado correctamente`)
                    await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
                } else {
                    alerta2('error', '', data.errorMessage)
                }
            }
        }
    }

    async CambiarEstadoCuentaAbierta() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let permisoAbrirCuenta = await Api.ValidarPermisoAbrirCuentas()

        if (permisoAbrirCuenta?.permiso != 1) {
            alerta2('warning', '', 'No cuenta con permiso para abrir cuentas')
            return
        }

        if (this.ctx.IdEstadoCuentaAtencion == 1) {
            alerta2('info', '', 'La cuenta esta ABIERTA')
            return
        }

        //if (this.ctx.IdEstadoCuentaAtencion == 4) {
        //    alerta2('info', '', 'La cuenta esta PAGADA Y CERRADA. No se podra abrir.')
        //    return
        //}

        if (this.ctx.IdEstadoCuentaAtencion == 12) {
            alerta2('info', '', 'La cuenta esta CERRADA porque el paciente tiene una transferencia pendiente. Por favor recepcione al paciente en el servicio. Si desea ABRIR la cuenta es posible que genere inconsistencia en la cuenta del paciente.')
            return
        }

        if (Utils.obtenerDiasTranscurridos($('#txtFechaEgresoAdministrativo').val().substr(0, 10)) > 30) {
            alerta2('info', '', 'La cuenta esta CERRADA más de 30 dias. No se podra abrir.')
            return
        }

        if (this.ctx.VecesAbierto >= 1) {
            alerta2('info', '', 'Ya se realizó una apertura anterior de cuenta, por favor notifique al personal de la Unidad de Seguros')
            return
        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea ABRIR la Cuenta?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {
                Cargando(1)
                let cuentaAbierta = await Api.FacturacionCuentasAtencionAbrir(this.ctx.IdCuentaAtencion)
                Cargando(0)
                if (cuentaAbierta.successNumber == 1) {
                    alerta2('success', '', `La Cuenta se ha Abierto correctamente`)
                    await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
                } else {
                    alerta2('error', '', data.errorMessage)
                }
            }
        }
    }

    async CambiarEstadoCuentaCerrada() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea CERRAR la Cuenta?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {
                Cargando(1)
                let cuentaCerrada = await Api.FacturacionCuentasAtencionCerrar(this.ctx.IdCuentaAtencion, this.IdPaciente)
                Cargando(0)

                if (cuentaCerrada.successNumber == 1) {
                    alerta2('success', '', `La Cuenta se ha Cerrado correctamente`)
                } else {
                    alerta2('error', '', data.errorMessage)
                }
                await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
            }
        }
    }

    async CambiarEstadoCuentaAnulada() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que la Cuenta pase a estado=ANULADA?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {
                Cargando(1)
                let cuentaAnulada = await Api.FacturacionCuentasAtencionAnulada(this.ctx.IdCuentaAtencion, this.IdPaciente)
                Cargando(0)

                if (cuentaAnulada.successNumber == 1) {
                    alerta2('success', '', `La Cuenta pasó a estado=ANULADA`)
                } else {
                    alerta2('error', '', data.errorMessage)
                }
                await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
            }

        }

    }

    async CambiarEstadoCuentaConGarante() {
        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debes ingresar un numero de cuenta')
            return
        }

        let confirmar = await alertaAsync('question', '', '¿Esta seguro que desea CERRAR la CUENTA del paciente que tiene un GARANTE Y DEUDA PENDIENTE?')

        if (confirmar.isConfirmed) {
            let validarInicioSesion = await this.SolicitarConfirmacionCredenciales()

            if (validarInicioSesion) {
                Cargando(1)
                let cuentaGarante = await Api.FacturacionCuentasAtencionAltaConDeudaYGarante(this.ctx.IdCuentaAtencion, this.ctx.IdPaciente)
                Cargando(0)

                if (cuentaGarante.successNumber == 1) {
                    alerta2('success', '', `La Cuenta pasó a estado=CUENTA CERRADA, PENDIENTE DE PAGO CON GARANTE`)
                } else {
                    alerta2('error', '', data.errorMessage)
                }

                await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
            }
        }
    }

    async BuscarPacientes() {

        if ($('#txtDniPacienteBusqueda').val() == '' && $('#txtNroHistoriaPacienteBusqueda').val() == '' && $('#txtApPaternoPacienteBusqueda').val() == ''
            && $('#txtApMaternoPacienteBusqueda').val() == '' && $('#txtPrimerNombrePacienteBusqueda').val() == '') {
            alerta(2, 'Debe ingresar al menos un campo para la busqueda.')
            return
        }

        try {
            Cargando(1)

            let pacientes = await Api.PacientesFiltrarTodosSoloHistorias()

            Utils.cargarTabla(this.ctx.oTable_TableListaPacientesBusqueda, pacientes)
        } catch (e) {
            console.error(e)
        } finally {
            Cargando(0)
        }

    }

    async SeleccionarPacienteListaCuentasPacientesBusqueda(trElement) {

        Utils.toggleRowSelection(this.ctx.oTable_TableListaCuentasPacientesBusqueda, trElement)

        let rowData = this.ctx.oTable_TableListaCuentasPacientesBusqueda.api(true).row('.selected').data()


        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (isEmpty(rowData)) {
            alerta(2, 'Ingrese un registro valido')
            return false
        }

        await this.ctx.actions.BuscarEstadoCuentaPacientePorIdCuentaAtencion(rowData.idCuentaAtencion)

        $('.modal').modal('hide')

        $('#txtNroCuentaBusq').val(rowData.idCuentaAtencion)
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    async CambiarFuenteFinanciamientoPaciente() {

        if (this.ctx.IdCuentaAtencion == 0) {
            alerta2('warning', '', 'Debe ingresar un número de cuenta');
            return;
        }

        if (isEmpty($('#cboFuenteFinancimiento').val()) || isEmpty($('#cboFuenteFinancimiento').val())) {
            alerta2('info', '', 'Tiene que elegir un nuevo plan de atención del paciente.')
            return
        }

        try {

            let confirmar = await alertaAsync('question', '', '¿Está seguro del Cambio de Plan de Cuenta de Atención ?');

            if (confirmar.isConfirmed) {
                let validarInicioSesion = await this.SolicitarConfirmacionCredenciales();

                if (validarInicioSesion) {
                    Cargando(1);
                    let data = await Api.CambiarFuenteFinancimiento(this.ctx.IdCuentaAtencion)
                    Cargando(0);

                    if (data.successNumber == 1) {
                        alerta2('success', '', data.successMessage)

                        await this.BuscarEstadoCuentaPacientePorIdCuentaAtencion(this.ctx.IdCuentaAtencion)
                    } else {
                        alerta2('error', '', data.errorMessage)
                    }
                }
            }
        } catch (error) {
            console.error('Error en proceso de exoneración:', error);
        } finally {

            Cargando(0);
        }
    }

    async ObtenerCuentasConDudaDeSangrePorPaciente(idPaciente) {

        let cuentasConDeuda = await Api.ObtenerCuentasConDudaDeSangrePorPaciente(idPaciente)

        let tdCuentas = ''
        let tableCuentas = ''
        if (cuentasConDeuda.length > 0) {
            cuentasConDeuda.forEach(element => {
                tdCuentas += `<td style="text-align: left;">${element.idCuentaAtencion}</td>`
            });

            tableCuentas = `<h2 style="color: #ff3535; font-weight: bold;">DEBE SANGRE</h2>
            Las siguientes cuentas del paciente DEBEN SANGRE:
                <table class="table table-bordered mt-1 mb-1" style="font-size: 12px;">
                    <tbody>
                    <tr>
                        <th style="width: 45%; background: #f0f0f0; text-align: left; !important">Nª Cuenta</th>
                    </tr>
                        ${tdCuentas}
                    </tbody>
                </table>`
        }

        return tableCuentas

    }

    TableListaCuentasPacientesBusquedafnDraw() {
        this.ctx.oTable_TableListaCuentasPacientesBusqueda.fnDraw()
    }
}




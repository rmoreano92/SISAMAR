import { EstadoCuentaActions } from "./EstadoCuenta.Actions.js";
import { EstadoCuentaEvents } from "./EstadoCuenta.Events.js";
import { EstadoCuentaComponents } from "./EstadoCuenta.Components.js";

export class EstadoCuenta {

    idAreaLabora = 0;
    idUsuarioConPermisoEnSISoEXOoSOATconf = 0;
    idTipoFinanciamiento = 0;
    idPagosACuenta = 0;
    idDevoluciones = 0;

    IdCuentaAtencion = 0;
    IdPaciente = 0;
    IdEstadoCuentaAtencion = 0;
    VecesAbierto = 0;

    constructor() {

        this.components = new EstadoCuentaComponents(this);
        this.actions = new EstadoCuentaActions(this);
        this.events = new EstadoCuentaEvents(this);

    }

    async Plugins() {
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
    }

    async init() {
        let FechaHora = await Utilitario.FechaHoraServidor();        
        let FechaDia = FechaHora.substring(0, 10);

        let fechaDividida = FechaDia.split('/'); // partes[0]=día, partes[1]=mes, partes[2]=año

        // Construir el primer día del mes
        let primerDiaDelMes = `01/${fechaDividida[1]}/${fechaDividida[2]}`;

        $('.maskFecha').datepicker({
            todayHighlight: true,
            autoclose: true,
            orientation: "bottom"
        });

        $("#txtFechaIngresoBusq").datepicker("setDate", primerDiaDelMes);
        $("#txtFechaHastaBusq").datepicker("setDate", FechaDia);    

        this.Plugins();

        this.components.init();
        this.events.bindAll();

        this.actions.IncializarCombos()

        ///////////CONSUMO EN EL SERVICIO//////////////
        ConsumoServicio.IniciarScript();
        /////////////////////////////////////////////
    }

}
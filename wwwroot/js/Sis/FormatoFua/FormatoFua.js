import { FormatoFuaActions } from "./FormatoFua.Actions.js";
import { FormatoFuaEvents } from "./FormatoFua.Events.js";
import { FormatoFuaTables } from "./FormatoFua.Tables.js";

import Helpers from "../../Helpers.js";

export class FormatoFua {

    IdInstitucionEducativa;

    constructor(){
        this.actions = new FormatoFuaActions(this)
        this.tables = new FormatoFuaTables(this)
        this.events = new FormatoFuaEvents(this)
    }

    async init() {

        Helpers.inicializarChosen()
        Helpers.inicializarDatepicker()

        this.tables.init()
        this.events.bindAll()
    }
}
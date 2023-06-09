import { Negotiation } from "../models/Negotiation.js";
import "../models/ListNegotiations.js";
import { HttpService } from "./Http.js";

export class NegotiationService {

    constructor() {

        this._http = new HttpService();
        this._error = "Não foi possível obter as negociações da ";
    }

    async getWeekNegotiations() {

        try {

            const negotiations = await this._http.get('server/negotiations/week');

            return negotiations.map(negotiation => new Negotiation(new Date(negotiation.date), negotiation.quantity, negotiation.value));
            
        } catch (error) {
            console.log(error);
            throw new Error(this._error + "semana.");
        }

    }

    async getNegotiationsWeekPast() {

        try {

            const negotiations = await this._http.get('server/negotiations/past');

            return negotiations.map(negotiation => new Negotiation(new Date(negotiation.date), negotiation.quantity, negotiation.value));

        } catch (error) {
            console.log(error);
            throw new Error(this._error + "semana passada.");
        }

    }

    async getNegotiationsWeekBeforeLast() {

        try {

            const negotiations = await this._http.get('server/negotiations/before-last');

            return negotiations.map(negotiation => new Negotiation(new Date(negotiation.date), negotiation.quantity, negotiation.value));

        } catch (error) {
            console.log(error);
            throw new Error(this._error + "semana retrasada.");
        }
        
    }

    async getNegotiations() {

        try {

            const period = await Promise.all([
                this.getWeekNegotiations(),
                this.getNegotiationsWeekPast(),
                this.getNegotiationsWeekBeforeLast()
            ]);

            let negotiations = period.reduce((arrayFlat, array) => arrayFlat.concat(array), []);
            return negotiations;

        } catch (error) {
            throw new Error(error);
        }
    }

    async post(negotition, cleanForm) {

        try {

            const addNegotiation = await this._http.post('/server/add-negotiations/send', negotition)
            .then(() => {

                cleanForm; 
                console.log("Negociação enviada com sucesso");
            })

            return addNegotiation;
        } catch(err) {

            throw new Error(`Não foi possível enviar a negociação: ${err}`)
        }
    }
}
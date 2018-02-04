import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'; //observable 3rd party library
import { Observable } from 'rxjs';

import { Message } from "./message.model";

// With this you can inject the http service to MessageService class
@Injectable()
export class MessageService {
    private messages: Message[] = [];

    constructor(private http: Http) {

    }

    addMessage(message: Message) {
        this.messages.push(message);
        const requestBody = JSON.stringify(message);
        // Sets up/Creates an observable, which holds the request and subscribe to any data this request will give us back.
        // Why the request isn't set yet No one is subscribed to this observable, no one is listening.
        // It doesn't send a request yet.
        // map((response: Response) => response.json() assigns reponse.json() to response.
        // .catch doesn't turn the return statement to observable automatically, while .map does.
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/message', requestBody, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.messages;
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
    }
}
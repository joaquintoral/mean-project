import {EventEmitter, Injectable} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'; //observable 3rd party library
import 'rxjs/add/operator/map'; //observable 3rd party library
import { Observable } from 'rxjs';

import { Message } from "./message.model";

// With this you can inject the http service to MessageService class
@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http) {}

    addMessage(message: Message) {
        const requestBody = JSON.stringify(message);
        // Sets up/Creates an observable, which holds the request and subscribe to any data this request will give us back.
        // Why the request isn't set yet No one is subscribed to this observable, no one is listening.
        // It doesn't send a request yet.
        // map((response: Response) => response.json() assigns reponse.json() to response.
        // .catch doesn't turn the return statement to observable automatically, while .map does.
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';
        return this.http.post('http://localhost:3000/message' + token, requestBody, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                // .obj.content refers to the result found in the router/message
                const message = new Message(
                    result.obj.content,
                    result.obj.user.firstName,
                    result.obj._id,
                    result.obj.user._id);
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((response: Response) => {
                // .obj is taken from routes/messages.js - obj: messages
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for(let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id)
                    );
                }

                this.messages = transformedMessages;

                return transformedMessages;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    editMessage(message: Message) {
        //middle man between message component and this service
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const requestBody = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

        return this.http.patch('http://localhost:3000/message/' + message.messageId + token, requestBody, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}
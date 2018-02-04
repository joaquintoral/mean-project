import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
    selector: 'app-message',
    // ./ indicates relative path
    templateUrl: './message.component.html',
    styles: [`
        .author {
            display: inline-block;
            font-style: italic;
            font-size: 12px;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            font-size: 12px;
            widh: 19%;
        }
    `]
})
export class MessageComponent {
    // Allows to pass an argument to the app.component.html app-message tag 
    //<app-message [message]="message"></app-message>
    // With Alias @Input('inputMessage') message: Message = 
    @Input('inputMessage') message: Message;

    color = "red";

    // EventEmitter<any> can take any type
    @Output() editClicked = new EventEmitter<string>();

    constructor(private messageService: MessageService) {}

    onEdit() {
        this.editClicked.emit('A new value');
    }

    onDelete() {
        this.messageService.deleteMessage(this.message);
    }
}
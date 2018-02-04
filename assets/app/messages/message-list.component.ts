import { Component, OnInit } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
    selector: 'app-message-list',
    template: `
        <!-- $event holds the value you passed -->
        <div class="col-md-8 col-md-offset-2">
            <app-message 
            [inputMessage]="message" 
            (editClicked)="message.content = $event"
            *ngFor="let message of messages"></app-message>
        </div>`,
    // Creates an instance of MessageService only for this component!
    // Add it to app.component instead to share this instance with its child components
    //providers: [MessageService]
})

export class MessageListComponent implements OnInit{
    messages: Message[];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.messages = this.messageService.getMessages();
    }
}
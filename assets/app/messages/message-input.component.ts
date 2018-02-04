import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MessageService } from './message.service';
import { Message } from "./message.model";

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html',
    
    //providers: [MessageService] // Able to create an instance of this messageservice and pass it to the constructor (Dependency Injection)
})
export class MessageInputComponent {
    constructor(private messageService: MessageService) {}
    
    onSubmit(form: NgForm) {
        const message = new Message(form.value.content, 'Max');
        this.messageService.addMessage(message)
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        form.resetForm();
    }
}
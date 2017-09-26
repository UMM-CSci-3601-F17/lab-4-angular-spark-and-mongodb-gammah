import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    providers: []
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];

    //Inject the UserListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(private todoListService: TodoListService) {

    }

    public filterTodos(searchOwner: string, searchStatus: boolean, searchBody: string, searchCategory: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by owner
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }


        //Filter by status
        if (searchStatus != null) {

                this.filteredTodos = this.filteredTodos.filter(todo => {
                    return todo.status == searchStatus;
                })
            }


//Filter by Body
        if (searchBody != null) {
            searchBody = searchBody.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchBody || todo.body.toLocaleLowerCase().indexOf(searchBody) !== -1;
            })
        }

        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLocaleLowerCase().indexOf(searchCategory) !== -1;
            })
        }

        return this.filteredTodos;
    }

    ngOnInit(): void {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }
}

import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    providers: []
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];
    private todoAddSuccess: Boolean = false;

    public todoOwner: string;
    public todoStatus: boolean;

    public newTodoOwner: string;
    public newTodoStatus: number;
    public newTodoCategory: string;
    public newTodoBody: string;

    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(private todoListService: TodoListService) {

    }


    addNewTodo(owner: string, status: boolean, category: string, body: string): void {

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoCategory = null;
        this.newTodoBody = null;

        this.todoListService.addNewTodo(owner, status, category, body).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                this.refreshTodos();
            });
    }

    public filterTodos(searchOwner: string, searchStatus: boolean, searchBody: string, searchCategory: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by owner and or content
        if (searchOwner != null || searchBody != null) {
            if (searchOwner != null) {
                searchOwner = searchOwner.toLocaleLowerCase();
            }

            if (searchBody != null) {
                searchBody = searchBody.toLocaleLowerCase();
            }
          this.todoListService.getTodosWithFilters(searchOwner, searchBody).subscribe(
              todos => {
                  this.todos = todos;
                  this.filteredTodos = this.todos;
              },
              err => {
                  console.log(err);
              })
        }


//Filter by status
        if (searchStatus != null) {

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return todo.status == searchStatus;
            })
        }


// //Filter by Body
//         if (searchBody != null) {
//             searchBody = searchBody.toLocaleLowerCase();
//
//             this.filteredTodos = this.filteredTodos.filter(todo => {
//                 return !searchBody || todo.body.toLocaleLowerCase().indexOf(searchBody) !== -1;
//             })
//         }

        if (searchCategory != null) {
            searchCategory = searchCategory.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchCategory || todo.category.toLocaleLowerCase().indexOf(searchCategory) !== -1;
            })
        }

        return this.filteredTodos;
    }

    refreshTodos(): void {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filterTodos(this.todoOwner, this.todoStatus, null, null);
            },
            err => {
                console.log(err);
            });
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

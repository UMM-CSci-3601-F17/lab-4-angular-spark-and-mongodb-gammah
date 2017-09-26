import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Todo} from './todo';
import {TodoListComponent} from './todo-list.component';
import {TodoListService} from './todo-list.service';
import {Observable} from 'rxjs';

describe('Todo list', () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    id: 'fry_id',
                    owner: 'Fry',
                    status: true,
                    body: 'pure and incandescent rage',
                    category: 'homework'
                },
                {
                    id: 'pat_id',
                    owner: 'Pat',
                    status: false,
                    body: 'gripping, uncontainable despair',
                    category: 'software design'
                },
                {
                    id: 'Jon_id',
                    owner: 'Jon',
                    status: true,
                    body: 'gnawing, hallowed hollow hunger',
                    category: 'groceries'
                }

            ])
        };

        TestBed.configureTestingModule({
            // imports: [PipeModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the todos', () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains a todo from 'Fry'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Fry')).toBe(true);
    });

    it("contain a todo from 'Pat'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner=== 'Pat')).toBe(true);
    });

    it("doesn't contain a todo from 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === 'Santa')).toBe(false);
    });

    it('should have one homework todo', ()=>{
        expect(todoList.filterTodos(null,null,null,'homework').length).toBe(1);
    });

    it('should have one rage filled todo', ()=>{
        expect(todoList.filterTodos(null,null,'rage',null).length).toBe(1);
    });

    it('should have two done todos', ()=>{
        expect(todoList.filterTodos(null,true,null,null).length).toBe(2);
    });

    it('should have no despairing todos that are done', ()=>{
        expect(todoList.filterTodos(null,true,'despair',null).length).toBe(0);
    });

    it('should have one hungry done grocery todo', ()=>{
        expect(todoList.filterTodos(null,true,'hunger','groceries').length).toBe(1);
    });



});

describe('Misbehaving Todo List', () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});

import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';

// let origFn = browser.driver.controlFlow().execute;

//https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/


describe('angular-spark-lab', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todo Owner attribute ', () => {
        page.navigateTo();

        expect(page.getTodoTitle()).toEqual('Todo Owner');
    });


    it('should type something in filter name box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeTodoOwner("Fry");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Fry");
        expect(page.getFirstTodo()).not.toContain("Blanche")
        expect(page.getFirstTodo()).not.toContain("Workman")
        expect(page.getFirstTodo()).not.toContain("Barry")
        expect(page.getFirstTodo()).not.toContain("Dawn")
    });

    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeTodoCategory("video games");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Ipsum esse est");
    });

    it("should type something unique in filter content box and check that it returned the correct element", () =>{
        page.navigateTo();
        page.typeTodoContent("dolor nostrud");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Dawn");
        page.navigateTo();
        page.typeTodoContent("dolor nostrud amet");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Roberta");
        page.navigateTo();
        page.typeTodoContent("I'm a lumberjack");
        page.clickFilter();
        expect(page.getIfNoTodos());
    });

    it("should type a valid and then an invalid category and see the correct responses", () =>{
        page.navigateTo();
        page.typeTodoCategory("homework");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Ullamco irure laborum");
        page.navigateTo();
        page.typeTodoCategory("invalid");
        page.clickFilter();
        expect(page.getIfNoTodos());
    });

    it("should select showing done and undone todos and then return to showing both", ()=>{
        page.navigateTo();
        page.typeTodoStatus("true");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Fry");

        page.typeTodoStatus("false");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain ("In sunt ex non tempor");
        page.navigateTo();
        expect(page.getFirstTodo()).toContain ("In sunt ex non tempor");
    });

    it('should create a new user then find it by searching', () => {
        page.navigateTo();
        page.addANewTodo("Spudson", "false", "groceries", "become a tomato");
        expect(page.getFirstTodo()).toContain("Blanche");

        page.typeTodoOwner("Spudson");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Spudson");

        page.navigateTo();
        page.typeTodoOwner("Spudson");
        page.clickFilter();
        expect(page.getFirstTodo()).toContain("Spudson");
    })
});


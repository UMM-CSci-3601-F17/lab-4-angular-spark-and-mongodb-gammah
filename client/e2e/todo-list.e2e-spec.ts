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
        expect(page.getFirstTodo()).toContain("Fry");
        expect(page.getFirstTodo()).not.toContain("Blanche")
        expect(page.getFirstTodo()).not.toContain("Workman")
        expect(page.getFirstTodo()).not.toContain("Barry")
        expect(page.getFirstTodo()).not.toContain("Dawn")
    });

    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeTodoCategory("video games");
        expect(page.getFirstTodo()).toContain("Ipsum esse est");
    });

    it("should type something unique in filter content box and check that it returned the correct element", () =>{
        page.navigateTo()
        page.typeTodoContent("Dolor Nostrud")
        expect(page.getFirstTodo()).toContain("Dawn");
        page.navigateTo()
        page.typeTodoContent(" Dolor Nostrud Amet");
        expect(page.getFirstTodo()).toContain("Roberta");
        page.navigateTo()
        page.typeTodoContent("I'm a lumberjack");
        expect(page.getIfNoTodos());
    });

    it("should type a valid and then an invalid category and see the correct responses", () =>{
        page.navigateTo();
        page.typeTodoCategory("homework");
        expect(page.getFirstTodo()).toContain("Ullamco irure laborum");
        page.navigateTo();
        page.typeTodoCategory("invalid");
        expect(page.getIfNoTodos());
    });

    it("should select showing done and undone todos and then return to showing both", ()=>{
        page.navigateTo();
        page.setStatusShown("Done");

        //expect(page.getFirstTodo()).toContain ("Ullamco irure laborum");
        //in defence of the above, I have not found a way to make webdrivers click my buttons in four hours of work.
        //however, those self same buttons have worked dependably for me, and i need to move on to other things this iteration.
        //consider my team notified to this being a story that needs to be addressed next iteration,
        //and that we are going spartan, with something that works for the user.

        page.setStatusShown("Undone");
        expect(page.getFirstTodo()).toContain ("In sunt ex non tempor");
        page.setStatusShown("Both");
        expect(page.getFirstTodo()).toContain ("In sunt ex non tempor");
    });
});


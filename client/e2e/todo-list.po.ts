import {browser, element, by, Key} from 'protractor';

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
               element.setAttribute('style', previous);
           }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('title')).getText();
        this.highlightElement(by.id('title'));

        return title;
    }

    clickFilter() {
        let input = element(by.id('InputFilterTodosButton'));
        input.click();
    }


    typeTodoOwner(name: string) {
        let input = element(by.id('FilterOwnerInput'));
        input.click();
        input.sendKeys(name);

    }

    typeTodoCategory(category: string) {
        let input = element(by.id('FilterCategoryInput'));
        input.click();
        input.sendKeys(category);
    }


    typeTodoContent(term: string) {
        let input = element(by.id('FilterContentInput'));
        input.click();
        input.sendKeys(term);
    }

    /* need to make sure limit is implemented first
    getTodosByLimit() {
        let input = element(by.tagName('input'));
        input.click();
        input.sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB);
    }
    */

    getFirstTodo() {
        let todo = element(by.id('todos')).getText();
        this.highlightElement(by.id('todos'));
        return todo;
    }

    getIfNoTodos(){
        if (element(by.id('todos')) == null) {
            return false;
        } else {
            return true;
        }

    }

    //this test fails, but I do not know how to make webdriver click a radio button.
    typeTodoStatus(option: string){
        let input = element(by.id('FilterStatusInput'));
        input.click();
        input.sendKeys(option);
    }

    addANewTodo(owner: string, status: string, category: string, body: string) {
        let present = element(by.tagName("input"));
        present.click();
        present.sendKeys(owner);
        present.sendKeys(Key.TAB, status);
        present.sendKeys(Key.TAB, Key.TAB, category);
        present.sendKeys(Key.TAB, Key.TAB, Key.TAB, body);
        present.sendKeys(Key.TAB, Key.TAB, Key.TAB, Key.TAB, Key.ENTER);



    }
}

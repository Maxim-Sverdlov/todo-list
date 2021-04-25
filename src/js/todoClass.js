class Todo {
    constructor() {
        this.todoArr = [];
        this.visibleList = [];
        this.filterValue = 'All';
        this.search = document.querySelector('.search');
        this.filter = document.querySelector('.filter');
        this.addTodoBtn = document.querySelector('.task-block__btn');
        this.textarea = document.querySelector('.task-block__text');
        this.listTask = document.querySelector('.list-task');

        this.search.addEventListener('keyup', (e) => {
            this.searchTodo(e);
        });
        this.filter.addEventListener('click', (e) => {
            this.filterHandler(e);
        });
        this.addTodoBtn.addEventListener('click', () => {
            this.addTodo();
        });
        this.listTask.addEventListener('click', (e) => {
            this.processAction(e);
        });
    }

    saveToLocalStorage(task) {
        this.todoArr.push(task);
        localStorage.setItem('todo-list', JSON.stringify(this.todoArr));
    }

    removeFromLocalStorage(todoIndex) {
        this.todoArr.splice(todoIndex, 1);
        localStorage.setItem('todo-list', JSON.stringify(this.todoArr));
    }

    filterOut() {
        const todoItems = document.querySelectorAll('.list-task__item');

        switch (this.filterValue) {
            case 'All':
                todoItems.forEach((item) => item.classList.remove('not-display'));
                break;
            case 'Active':
                todoItems.forEach((item) => {
                    if (item.classList.contains('list-task__item--done')) {
                        item.classList.add('not-display');
                    } else {
                        item.classList.remove('not-display');
                    }
                });
                break;
            case 'Done':
                todoItems.forEach((item) => {
                    if (!item.classList.contains('list-task__item--done')) {
                        item.classList.add('not-display');
                    } else {
                        item.classList.remove('not-display');
                    }
                });
                break;
            default:
                break;
        }

        this.visibleList = this.listTask.querySelectorAll('li:not(.not-display)');
    }

    addTodo() {
        if (this.textarea.value.trim() !== null && this.textarea.value.trim() !== '') {
            const li = document.createElement('li');
            li.classList.add('list-task__item');

            const p = document.createElement('p');
            p.innerText = this.textarea.value;

            li.append(p);

            const task = {
                name: p.innerText,
                type: 'active',
                important: false,
            };

            // ADD TO LOCAlSTORAGE
            this.saveToLocalStorage(task);

            const div = document.createElement('div');
            div.classList.add('list-task__control');

            const btnImportant = document.createElement('button');
            btnImportant.innerText = 'Mark important';
            btnImportant.classList.add('btn');
            btnImportant.classList.add('btn--important');

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<span class="visually-hidden">Delete</span>';
            btnDelete.classList.add('btn');
            btnDelete.classList.add('btn--delete');

            div.append(btnImportant);
            div.append(btnDelete);

            li.append(div);

            this.listTask.append(li);

            // FILTER TODO
            this.filterOut();

            this.textarea.value = '';
        }
    }

    getList() {
        return localStorage.getItem('todo-list') !== null ? JSON.parse(localStorage.getItem('todo-list')) : [];
    }

    renderList(arr) {
        arr.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('list-task__item');

            // eslint-disable-next-line no-unused-expressions
            item.type === 'done' ? li.classList.add('list-task__item--done') : '';
            // eslint-disable-next-line no-unused-expressions
            item.important === true ? li.classList.add('list-task__item--important') : '';

            const p = document.createElement('p');
            p.innerText = item.name;

            li.append(p);

            const div = document.createElement('div');
            div.classList.add('list-task__control');

            const btnImportant = document.createElement('button');
            btnImportant.classList.add('btn');

            if (item.important === true) {
                btnImportant.innerText = 'Not important';
                btnImportant.classList.add('btn--not-important');
            } else {
                btnImportant.innerText = 'Mark important';
                btnImportant.classList.add('btn--important');
            }

            if (item.type === 'done') {
                btnImportant.classList.add('not-display');
            }

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<span class="visually-hidden">Delete</span>';
            btnDelete.classList.add('btn');
            btnDelete.classList.add('btn--delete');

            div.append(btnImportant);
            div.append(btnDelete);

            li.append(div);

            this.listTask.append(li);
        });
    }

    getIndexTodo(parent) {
        let index = -1;
        const text = parent.children[0].innerText;
        const findedObj = this.todoArr.find((o) => o.name === text);

        index = this.todoArr.indexOf(findedObj);
        return index;
    }

    changeTodoType(index, type) {
        switch (type) {
            case 'active':
                this.todoArr[index].type = 'active';
                break;
            case 'done':
                this.todoArr[index].type = 'done';
                break;
            case 'important':
                this.todoArr[index].important = true;
                break;
            case 'not-important':
                this.todoArr[index].important = false;
                break;
            default:
                break;
        }

        localStorage.setItem('todo-list', JSON.stringify(this.todoArr));
    }

    searchTodo(e) {
        const val = this.search.value.trim();

        if (val !== '') {
            this.visibleList.forEach((item) => {
                if (item.children[0].innerText.search(val) === -1) {
                    item.classList.add('not-display');
                } else {
                    item.classList.remove('not-display');
                }
            });
        } else {
            this.visibleList.forEach((item) => {
                item.classList.remove('not-display');
            });
        }

        if (e.code === 'Escape') {
            this.search.value = '';
            this.visibleList.forEach((item) => item.classList.remove('not-display'));
        }
    }

    filterHandler(e) {
        const { target } = e;

        if (target.classList.contains('filter__item') && !target.classList.contains('filter__item--active')) {
            this.filter.querySelector('.filter__item--active').classList.toggle('filter__item--active');

            target.classList.toggle('filter__item--active');

            this.filterValue = target.innerText;

            this.filterOut();

            this.search.value = '';
        }
    }

    processAction(e) {
        const { target } = e;

        if (target.classList.contains('list-task__item') && !target.classList.contains('list-task__item--done')) {
            target.classList.add('list-task__item--done');

            const index = this.getIndexTodo(target);
            this.changeTodoType(index, 'done');

            const btn = target.querySelector('.btn');
            btn.classList.add('not-display');

            if (this.filterValue === 'Active') {
                target.classList.add('not-display');
            } else {
                target.classList.remove('not-display');
            }
        } else if (target.classList.contains('list-task__item') && target.classList.contains('list-task__item--done')) {
            target.classList.remove('list-task__item--done');

            const index = this.getIndexTodo(target);
            this.changeTodoType(index, 'active');

            const btn = target.querySelector('.btn');
            btn.classList.remove('not-display');

            if (this.filterValue === 'Done') {
                target.classList.add('not-display');
            } else {
                target.classList.remove('not-display');
            }
        } else if (target.classList.contains('btn--important')) {
            const parent = target.parentNode.parentNode;
            parent.classList.add('list-task__item--important');

            target.classList.add('btn--not-important');
            target.classList.remove('btn--important');

            target.innerText = 'Not important';

            const index = this.getIndexTodo(parent);
            this.changeTodoType(index, 'important');
        } else if (target.classList.contains('btn--not-important')) {
            const parent = target.parentNode.parentNode;
            parent.classList.remove('list-task__item--important');

            target.classList.remove('btn--not-important');
            target.classList.add('btn--important');

            target.innerText = 'Mark important';

            const index = this.getIndexTodo(parent);
            this.changeTodoType(index, 'not-important');
        } else if (target.classList.contains('btn--delete')) {
            const parent = target.parentNode.parentNode;

            const index = this.getIndexTodo(parent);
            this.removeFromLocalStorage(index);

            parent.remove();
        }
    }

    init() {
        this.todoArr = this.getList();

        this.renderList(this.todoArr);

        this.visibleList = this.listTask.querySelectorAll('li:not(.not-display)');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const todo = new Todo();

    todo.init();
});

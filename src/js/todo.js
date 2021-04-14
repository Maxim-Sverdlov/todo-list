document.addEventListener('DOMContentLoaded', () => {
    // VARIABLES
    let todoArr = [];

    const filter = document.querySelector('.filter');
    let filterValue = 'All';

    const addTodoBtn = document.querySelector('.task-block__btn');
    const textarea = document.querySelector('.task-block__text');
    const listTask = document.querySelector('.list-task');

    // FUNCTIONS
    function saveToLocalStorage(task) {
        todoArr.push(task);
        localStorage.setItem('todo-list', JSON.stringify(todoArr));
    }

    function removeFromLocalStorage(todoIndex) {
        todoArr.splice(todoIndex, 1);
        localStorage.setItem('todo-list', JSON.stringify(todoArr));
    }

    function addTodo() {
        if (textarea.value.trim() !== null && textarea.value.trim() !== '') {
            const li = document.createElement('li');
            li.classList.add('list-task__item');

            const p = document.createElement('p');
            p.innerText = textarea.value;

            li.append(p);

            const task = {
                name: textarea.value,
                type: 'active',
                important: false,
            };

            // ADD TO LOCAlSTORAGE
            saveToLocalStorage(task);

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

            listTask.append(li);

            textarea.value = '';
        }
    }

    function getList() {
        return localStorage.getItem('todo-list') !== null ? JSON.parse(localStorage.getItem('todo-list')) : [];
    }

    function renderList(arr) {
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

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = '<span class="visually-hidden">Delete</span>';
            btnDelete.classList.add('btn');
            btnDelete.classList.add('btn--delete');

            div.append(btnImportant);
            div.append(btnDelete);

            li.append(div);

            listTask.append(li);
        });
    }

    function getIndexTodo(parent) {
        let index = -1;
        const text = parent.children[0].innerText;
        const findedObj = todoArr.find((o) => o.name === text);

        index = todoArr.indexOf(findedObj);
        return index;
    }

    function changeTodoType(index, type) {
        switch (type) {
            case 'active':
                todoArr[index].type = 'active';
                break;
            case 'done':
                todoArr[index].type = 'done';
                break;
            case 'important':
                todoArr[index].important = true;
                break;
            case 'not-important':
                todoArr[index].important = false;
                break;
            default:
                break;
        }

        localStorage.setItem('todo-list', JSON.stringify(todoArr));
    }

    todoArr = getList();

    renderList(todoArr);

    filter.addEventListener('click', (e) => {
        const { target } = e;

        if (target.classList.contains('filter__item') && !target.classList.contains('filter__item--active')) {
            const todoItems = document.querySelectorAll('.list-task__item');

            filter.querySelector('.filter__item--active').classList.toggle('filter__item--active');

            target.classList.toggle('filter__item--active');

            filterValue = target.innerText;

            switch (target.innerText) {
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
        }
    });

    addTodoBtn.addEventListener('click', addTodo);

    listTask.addEventListener('click', (e) => {
        const { target } = e;

        if (target.classList.contains('list-task__item') && !target.classList.contains('list-task__item--done')) {
            target.classList.add('list-task__item--done');

            const index = getIndexTodo(target);
            changeTodoType(index, 'done');

            if (filterValue === 'Active') {
                target.classList.add('not-display');
            } else {
                target.classList.remove('not-display');
            }
        } else if (target.classList.contains('list-task__item') && target.classList.contains('list-task__item--done')) {
            target.classList.remove('list-task__item--done');

            const index = getIndexTodo(target);
            changeTodoType(index, 'active');

            if (filterValue === 'Done') {
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

            const index = getIndexTodo(parent);
            changeTodoType(index, 'important');
        } else if (target.classList.contains('btn--not-important')) {
            const parent = target.parentNode.parentNode;
            parent.classList.remove('list-task__item--important');

            target.classList.remove('btn--not-important');
            target.classList.add('btn--important');

            target.innerText = 'Mark important';

            const index = getIndexTodo(parent);
            changeTodoType(index, 'not-important');
        } else if (target.classList.contains('btn--delete')) {
            const parent = target.parentNode.parentNode;

            const index = getIndexTodo(parent);
            removeFromLocalStorage(index);

            parent.remove();
        }
    });
});

const express = require('express');
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 8080;

const TASKS = [
    {
        id: 1,
        name: 'Run the demo application',
        description: 'Run this current demo application',
        done: true
    },
    {
        id: 2,
        name: 'See the README file',
        description: 'Read the README file to learn how to use this library',
        done: true
    },
    {
        id: 3,
        name: 'See this application code',
        description: 'See this application code which demonstrate how to use this library',
        done: false
    },
    {
        id: 4,
        name: 'Test something into this application code',
        description: 'Test to do something into this application code to learn how to use this library',
        done: false
    },
    {
        id: 5,
        name: 'Dummy task 1',
        description: 'Dummy task 1 description',
        done: false
    },
    {
        id: 6,
        name: 'Another dummy task',
        description: 'Another dummy task description',
        done: false
    }
];

for (let i = 1; i <= 20; i++) {
    TASKS.push({
        id: TASKS.length + 1,
        name: `Another dummy task ${i}`,
        description: `Another dummy task ${i} description`,
        done: Math.random() < 0.5
    });
}

app.get('/api/tasks', (req, res) => {
    let tasks = [...TASKS];
    const searchText = req.query.text;
    const searchState = (req.query.state && req.query.state.length > 0) ? (['all', 'done', 'todo'].includes(req.query.state.toLowerCase()) ? req.query.state.toLowerCase() : 'all') : 'all';
    
    tasks = tasks.filter(task => {
        const matchText = (searchText && searchText.length > 0) ? (task.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 || task.description.toLowerCase().indexOf(searchText.toLowerCase())  > -1) : true;        
        const matchState = (searchState !== 'all') ? ((searchState === 'done') ? task.done === true : task.done === false) : true;
        return matchState && matchText;
    });
    
    const totalCount = tasks.length;
    const pageSize = parseInt((req.query.size || 10), 10);
    const totalPages = Math.ceil(totalCount / pageSize);
    let page = parseInt((req.query.page || 1), 10);
    let sort = req.query.sort || [];

    console.log(`GET tasks {sort: ${JSON.stringify(sort)}, page: ${page}, page size: ${pageSize}, text filter: ${searchText}, state filter: ${searchState}}`);
    if (sort) {
        if (!(sort instanceof Array)) {
            sort = [sort];
        }

        tasks = tasks.sort((a, b) => {
            for (let item of sort) {
                const sortParts = item.split(',');
                const fieldName = sortParts[0];
                let sortDir = 'asc';
                if (sortParts.length === 2) {
                    sortDir = sortParts[1].toLowerCase().trim();
                }

                const asc = 1;
                if (a[fieldName] > b[fieldName]) return (sortDir === 'asc') ? asc : -asc;
                if (a[fieldName] < b[fieldName]) return (sortDir === 'asc') ? -asc : asc;
            }
        });
    }

    // normalize page number
    if (page > totalPages) {
        page = totalPages;
    } else if (page < 1) {
        page = 1;
    }

    // compute page chunk
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    tasks = tasks.slice(start, end);

    res.status(200).json({
        size: tasks.length,
        totalElements: totalCount,
        totalPages: totalPages,
        number: page,
        content: tasks
    });
});

app.put('/api/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    console.log(`UPDATE task with id ${taskId}...`);
    const tasks = TASKS.filter(task => task.id === taskId);
    if (!tasks || tasks.length === 0) {
        res.status(400).json({ errorCode: 'TASK_NOT_FOUND' });
        return;
    }

    const task = tasks[0];
    const body = req.body;
    if (!body.name || body.name.trim().length === 0) {
        res.status(400).json({ errorCode: 'TASK_NAME_IS_EMPTY' });
        return;
    }

    if (body.name !== task.name) {
        task.name = body.name;
    }

    if (body.description && body.description.trim().length > 0 && body.description !== task.description) {
        task.description = body.description;
    }

    res.status(200).json(task);
});

app.put('/api/tasks/:taskId/state', (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const tasks = TASKS.filter(task => task.id === taskId);
    if (!tasks || tasks.length === 0) {
        res.status(400).json({ errorCode: 'TASK_NOT_FOUND' });
        return;
    }

    const task = tasks[0];
    const body = req.body;
    console.log(`Mark task with id ${taskId} to ${(body === true) ? 'done' : 'not done'}`);
    if (typeof body.done !== 'boolean') {
        res.status(400).json({ errorCode: 'INVALID_TASK_STATE' });
        return;
    }

    task.done = body.done;
    res.status(200).json(task);
});

app.delete('/api/tasks/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    console.log(`DELETE task with id ${taskId}...`);
    const taskIndex = TASKS.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
        TASKS.splice(taskIndex, 1);
    }
    res.status(200).json();
});

app.post('/api/tasks', (req, res) => {
    const body = req.body;

    if (!body.name || body.name.trim().length === 0) {
        res.status(400).json({ errorCode: 'TASK_NAME_IS_EMPTY' });
        return;
    }

    const task = {
        id: TASKS.length + 1,
        name: body.name,
        description: body.description,
        done: false
    };
    TASKS.push(task);

    console.log(`Task ${JSON.stringify(task)} created !`);
    res.status(201).json(task);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});
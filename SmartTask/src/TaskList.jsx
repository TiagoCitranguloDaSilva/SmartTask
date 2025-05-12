import React, { useState, useEffect } from 'react'

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState('')
    const [newTaskDueDate, setNewTaskDueDate] = useState('')
    const [newTaskPriority, setNewTaskPriority] = useState('')
    const [qtdeTasks, setQtdeTasks] = useState(0);
    const [editingTask, setEditingTask] = useState({});

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            document.querySelector('.button-delete').style.display = 'flex'
        } else {
            document.querySelector('.button-delete').style.display = 'none'
        }
    }, [isEditing])

    useEffect(() => {
        if (localStorage.getItem('tasks') != '[]' && tasks.length == 0) {
            orderingTasks(JSON.parse(localStorage.getItem('tasks')))
            return;
        }

    }, [])

    useEffect(() => {
        setQtdeTasks(q => tasks.length);
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])



    function showForm() {
        setIsEditing(i => false);
        setNewTaskTitle(n => '');
        setNewTaskDescription(n => '');
        setNewTaskDueDate(n => '');
        setNewTaskPriority(n => '1');
        document.querySelector("#idEdicao").value = ''
        document.querySelector(".form").style.display = 'flex'
        document.querySelector(".inputTitle").focus()
    }

    function handleSaveTask() {
        if (newTaskTitle.trim() == '' || newTaskDueDate == '' || newTaskDueDate < Date.now() || !(newTaskPriority <= 10 && newTaskPriority >= 1)) {
            return;
        }
        document.querySelector('.form').style.display = 'none'
        if (isEditing) {
            let tempTask = [...tasks]
            let index = document.querySelector("#idEdicao").value
            tempTask[index] = { title: newTaskTitle, description: newTaskDescription, dueDate: newTaskDueDate, priority: newTaskPriority }
            orderingTasks([...tempTask]);
            return;
        }
        orderingTasks([...tasks, { title: newTaskTitle, description: newTaskDescription, dueDate: newTaskDueDate, priority: newTaskPriority }]);

        // document.querySelector('.form').style.display = 'none'
    }

    function handleTitleInputChange(e) {
        setNewTaskTitle(n => e.target.value)
    }

    function handleDescriptionChange(e) {
        setNewTaskDescription(n => e.target.value)
    }

    function handleDueDateChange(e) {
        setNewTaskDueDate(n => e.target.value)
    }

    function handleCancel() {

        document.querySelector('.form').style.display = 'none'

    }

    function handleDelete() {
        if (!document.querySelector("#idEdicao").value) {
            return;
        }
        let index = document.querySelector("#idEdicao").value
        orderingTasks(tasks.filter((_, i) => i != index))

        if (document.querySelector('.form').style.display != 'none') {
            document.querySelector('.form').style.display = 'none'
        }

    }

    function handlePriorityChange(e) {
        setNewTaskPriority(n => e.target.value)
    }

    function handleEditTask(index) {
        setIsEditing(i => true)
        setNewTaskTitle(n => tasks[index].title);
        setNewTaskDescription(n => tasks[index].description);
        setNewTaskDueDate(n => tasks[index].dueDate);
        setNewTaskPriority(n => tasks[index].priority);

        setEditingTask(tasks[index]);

        document.querySelector("#idEdicao").value = index

        document.querySelector(".form").style.display = 'flex'
        document.querySelector(".inputTitle").focus()
    }

    function orderingTasks(newTasksArray) {
        let organizedByDate = newTasksArray.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        let groupedDate = {}
        let tempArray = []
        let key;
        for (let c = 0; c < organizedByDate.length; c++) {
            if (c == 0) {
                key = `${organizedByDate[c].dueDate}`
                tempArray.push(organizedByDate[c])
            } else if (organizedByDate[c - 1].dueDate == organizedByDate[c].dueDate) {
                tempArray.push(organizedByDate[c])
            } else if (organizedByDate[c - 1].dueDate != organizedByDate[c].dueDate) {
                groupedDate[key] = tempArray
                tempArray = []
                key = `${organizedByDate[c].dueDate}`
                tempArray.push(organizedByDate[c])
            }
            if (c == organizedByDate.length - 1) {
                groupedDate[key] = tempArray
            }
        }
        let fullOrganizedDates = []
        for(let date in groupedDate){
            let tempArray = groupedDate[date]
            fullOrganizedDates.push(tempArray.sort((a, b) => parseInt(a.priority) - parseInt(b.priority)));
        };
        let orderedTasks = []
        fullOrganizedDates.forEach((date) => {
            date.forEach((task) => {
                orderedTasks.push(task)
            })
        })
        
        setTasks(t => orderedTasks)

    }

    return (
        <>
            <div className="container">
                <h1>Smart Task</h1>
                <button onClick={showForm}>New</button>
                <div className="listContainer">
                    <ul>
                        {tasks.map((task, index) =>
                            <li key={index} onClick={() => handleEditTask(index)}>
                                <span>{task.title}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="form">
                <div className="formContainer">
                    <input type="hidden" id='idEdicao' />
                    <div className="inputs" onKeyDown={(e) => { e.key === "Enter" && handleSaveTask() }}>
                        <input type="text" className="inputTitle" value={newTaskTitle} onChange={handleTitleInputChange} />
                        <textarea id="" onChange={handleDescriptionChange} value={newTaskDescription}></textarea>
                        <input type="date" onChange={handleDueDateChange} value={newTaskDueDate} />
                        <div className="range">
                            <input type="range" onChange={handlePriorityChange} min='1' max='10' value={newTaskPriority} />
                            <span>{newTaskPriority}</span>
                        </div>
                    </div>
                    <button onClick={handleSaveTask} className='button-save'>Save</button>
                    <button onClick={handleCancel} className='button-cancel'>Cancel</button>
                    <button onClick={handleDelete} className='button-delete'>Delete</button>
                </div>
            </div>
            <p>Quantidade de tarefas: {qtdeTasks}</p>
        </>
    )

}

export default TaskList;
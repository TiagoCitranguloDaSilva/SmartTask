import React, { useState, useEffect } from 'react'

function TaskList() {

    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState('')
    const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0])
    const [newTaskPriority, setNewTaskPriority] = useState(1)
    const [qtdeTasks, setQtdeTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState([])
    const [qtdeCompletedTasks, setQtdeCompletedTasks] = useState(0)

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isEditing) {
            document.querySelector('.button-delete').style.display = 'flex'
        } else {
            document.querySelector('.button-delete').style.display = 'none'
        }
    }, [isEditing])

    useEffect(() => {
        document.querySelector(".form").style.display = 'none'
        if (!localStorage.getItem("tasks")) {
            localStorage.setItem("tasks", '[]')
        }
        if (!localStorage.getItem("completedTasks")) {
            localStorage.setItem("completedTasks", '[]')
        }
        if ((localStorage.getItem('tasks') != '[]' || localStorage.getItem('completedTasks') != '[]') && tasks.length == 0) {
            if (localStorage.getItem('tasks') != '[]') {
                orderingTasks(JSON.parse(localStorage.getItem('tasks')))
            }
            if (localStorage.getItem('completedTasks') != '[]') {
                setCompletedTasks(JSON.parse(localStorage.getItem('completedTasks')))
            }
            return;
        }

    }, [])

    useEffect(() => {
        setQtdeTasks(q => tasks.length);
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        setQtdeCompletedTasks(q => completedTasks.length);
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
    }, [completedTasks])



    function showForm() {
        setIsEditing(i => false);
        setNewTaskTitle(n => '');
        setNewTaskDescription(n => '');
        setNewTaskDueDate(n => new Date().toISOString().split('T')[0]);
        setNewTaskPriority(n => '1');
        document.querySelector("#idEdicao").value = ''
        document.querySelector(".form").style.display = 'flex'
        document.querySelector(".inputTitle").focus()
    }

    function handleSaveTask() {
        let hora = new Date().toLocaleString('pt-br').split(',')[0]
        hora = hora.split('/')
        hora = `${hora[2]}-${hora[1]}-${hora[0]}`
        if (newTaskTitle.trim() == '' || newTaskDueDate == '' || newTaskDueDate < hora || !(newTaskPriority <= 10 && newTaskPriority >= 1)) {
            alert("Dados invalidos")
            return;
        }
        document.querySelector('.form').style.display = 'none'
        if (isEditing) {
            let whereCameFrom = document.querySelector("#tipoTaskEditando").value
            let tempTask = whereCameFrom == 'completedTasks' ? [...completedTasks] : [...tasks]
            let index = document.querySelector("#idEdicao").value
            let checked = whereCameFrom == 'completedTasks' ? true : false
            tempTask[index] = { title: newTaskTitle, description: newTaskDescription, dueDate: newTaskDueDate, priority: newTaskPriority, checked: checked }
            whereCameFrom == 'completedTasks' ? setCompletedTasks(t => [...tempTask]) : orderingTasks([...tempTask]);
            return;
        }
        orderingTasks([...tasks, { title: newTaskTitle, description: newTaskDescription, dueDate: newTaskDueDate, priority: newTaskPriority, checked: false }]);


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

    function handleEditTask(index, whereCamefrom) {
        setIsEditing(i => true)
        setNewTaskTitle(n => whereCamefrom == 'completedTasks' ? completedTasks[index].title : tasks[index].title);
        setNewTaskDescription(n => whereCamefrom == 'completedTasks' ? completedTasks[index].description : tasks[index].description);
        setNewTaskDueDate(n => whereCamefrom == 'completedTasks' ? completedTasks[index].dueDate : tasks[index].dueDate);
        setNewTaskPriority(n => whereCamefrom == 'completedTasks' ? completedTasks[index].priority : tasks[index].priority)


        document.querySelector("#idEdicao").value = index
        document.querySelector("#tipoTaskEditando").value = (whereCamefrom == 'completedTasks') ? 'completedTasks' : 'normalTasks'


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
        for (let date in groupedDate) {
            let tempArray = groupedDate[date]
            fullOrganizedDates.push(tempArray.sort((a, b) => parseInt(b.priority) - parseInt(a.priority)));
        };
        let orderedTasks = []
        fullOrganizedDates.forEach((date) => {
            date.forEach((task) => {
                orderedTasks.push(task)
            })
        })

        setTasks(t => orderedTasks)

    }

    function handleCheckboxChange(e, index) {
        if (e.target.checked) {

            let newCompletedTask = tasks[index]
            newCompletedTask.checked = true
            setCompletedTasks(c => [...completedTasks, newCompletedTask])

            let tempTasks = [...tasks]
            tempTasks = tempTasks.filter((_, i) => i != index)
            orderingTasks(tempTasks)

        } else {
            let hora = new Date().toLocaleString('pt-br').split(',')[0]
            hora = hora.split('/')
            hora = `${hora[2]}-${hora[1]}-${hora[0]}`
            if (completedTasks[index].dueDate < hora) {
                alert("Data invalida")
                return;
            }
            let newTask = completedTasks[index]
            newTask.checked = false
            orderingTasks([...tasks, newTask])

            let tempTasks = [...completedTasks]
            tempTasks = tempTasks.filter((_, i) => i != index)
            setCompletedTasks(tempTasks)
        }

    }

    return (
        <>
            <div className="container">
                <h1>Smart Task</h1>
                <div className="containerButton">
                    <button onClick={showForm} className='novaTarefaButton'>Nova tarefa</button>
                </div>
                <div className="containerLists">
                    <div className="listContainer">
                        <h2>Tarefas não feitas</h2>
                        <ul>
                            {tasks.map((task, index) =>
                                <li key={index}>
                                    <input type="checkbox" onChange={(e) => handleCheckboxChange(e, index)} checked={task.checked} />
                                    <span onClick={(e) => handleEditTask(index, 'normalTask')}>{task.title}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="completeListContainer">
                        <h2>Tarefas feitas</h2>
                        <ul>
                            {completedTasks.map((task, index) =>
                                <li key={index}>
                                    <input type="checkbox" onChange={(e) => handleCheckboxChange(e, index)} checked={task.checked} />
                                    <span onClick={(e) => handleEditTask(index, 'completedTasks')}>{task.title}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="info">
                        <p>Quantidade de tarefas restantes: {qtdeTasks}</p>
                        <p>Quantidade de tarefas feitas: {qtdeCompletedTasks}</p>
                    </div>
                </div>
                <div className="form">
                    <div className="formContainer">
                        <input type="hidden" id='idEdicao' />
                        <input type="hidden" id='tipoTaskEditando' />
                        <div className="inputs" onKeyDown={(e) => { e.key === "Enter" && handleSaveTask() }}>
                            <p><label htmlFor="titulo">Titulo: </label><input type="text" className="inputTitle" id='titulo' value={newTaskTitle} onChange={handleTitleInputChange} /></p>
                            <p><label htmlFor="descricao">Descrição: </label><textarea id="descricao" onChange={handleDescriptionChange} value={newTaskDescription}></textarea></p>
                            <p><label htmlFor="data">Até: </label><input type="date" id='data' onChange={handleDueDateChange} value={newTaskDueDate} /></p>
                            <div className="range">
                                <p>
                                    <label htmlFor="prioridade">Prioridade: </label>
                                    <input type="range" id='prioridade' onChange={handlePriorityChange} min='1' max='10' value={newTaskPriority} />
                                    <span>{newTaskPriority}</span>
                                </p>
                            </div>
                        </div>
                        <div className="buttons">
                            <button onClick={handleSaveTask} className='button-save'>Save</button>
                            <button onClick={handleCancel} className='button-cancel'>Cancel</button>
                            <button onClick={handleDelete} className='button-delete'>Delete</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default TaskList;
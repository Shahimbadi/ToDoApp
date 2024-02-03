import React, { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


var taskId=1;

const Home=()=>{
    const [email, setEmail]=useState('')
    const [currentTaskId, setCurrentTaskId]=useState('0')
    const [title, setTitle]=useState('')
    const [description, setDescription]=useState('')
    const [todos, setTodos]=useState([]);
    const [taskMode, setTaskMode]=useState('add')
    const [isDone, setIsDone]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(!userEmail){
            navigate('/login')
        }else{
            setEmail(userEmail)
        }
        loadDisplayAPI()
    }, [{title}, {description}])

    const loadDisplayAPI=async()=>{
        const result=await axios.post("http://localhost:4000/display",{user_id:localStorage.getItem('userEmail')})
        setTodos(result.data);
    }

    const logout=()=>{
        localStorage.removeItem('userEmail')
        navigate('/login')
    }
    const changeColor = (event) => {
        event.target.style.backgroundColor='#0078FF'
    }
   
    const defaultColor = (event) => {
        event.target.style.backgroundColor='white'
    }
    const defaultColor1 = (event) => {
        event.target.style.backgroundColor='darkblue'
    }

    const handleTitle=(event)=>{
        setTitle(event.target.value)
    }

    const handleDescription=(event)=>{
        setDescription(event.target.value)
    }

    const submitToDo=async()=>{
        const Todo=await axios.post('http://localhost:4000/newtodo',{taskId:todos.length+1, user_id:localStorage.getItem('userEmail'), title:title, description:description, isDone:isDone})
        if(Todo.data.flag===1){
            alert("Please enter a title and description for the todo")
        }else if(Todo.data.flag===2){
            alert("Please enter a description for the todo")
        }else if(Todo.data.flag===3){
            alert("Please enter a title for the todo")
        }else if(Todo.data.flag===4){
            alert("Todo successfully added to do list!")
        }else{
            alert("Some error occured!:/")
        }
        setTitle('')
        setDescription('')
    }

    function editTask(id){
        const edit=async()=>{
           const todo=await axios.put(`http://localhost:4000/idTodo/${id}`)
           setTaskMode(todo.data.mode)
           taskId=todo.data.id
           setCurrentTaskId(todo.data.id)
           setTitle(todo.data.title)
           setDescription(todo.data.description)
        }

        return()=>{
            edit()
        }
    }

    const editTodo=async()=>{
        const currentTodo=await axios.put(`http://localhost:4000/edit/${currentTaskId}`, {taskId:currentTaskId, title:title, description:description})
        if(currentTodo.data.completed=='true'){
            alert("Todo successfully edited!")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }else{
            console.log('edit failed')
        }
    }

    function markTask(id){
        const markAsCompleted=async()=>{
           await axios.put(`http://localhost:4000/completed/${id}`, {isDone:true})
        }
        return()=>{
            markAsCompleted()
        }
    }
    
    function deleteTask(id){
        const deleteTodo=async()=>{
            const todo=await axios.delete(`http://localhost:4000/delete/${id}`, {deleted:true})
            if(todo.data.deleted=='true'){
                taskId=todos.length
            }else{

            }
        }
        return()=>{
            deleteTodo()
        }
    }

    return(
        <Box>
            <Box sx={{position:'fixed', width:'100vw', height:'10vh', backgroundColor:'darkblue', display:'flex', alignItems:'center' , justifyContent:'space-evenly'}}>
                <Box sx={{display:'flex', justifyContent:'space-evenly', alignItems:'center'}}>
                    <Typography sx={{color: 'white', marginRight:'80vw', }}>TO-DO LIST</Typography>
                     <Button onMouseOver={changeColor} onMouseOut= {defaultColor} onClick={logout} variant='contained' sx={{backgroundColor:'white', color:'blue', marginRight:'30px', fontFamily:'verdana', boxShadow:'2px 2px 10px #4F4F4F', borderRadius: 9, width:120, left:'1vw'}}>Logout</Button>
                </Box>
            </Box>
        
            <Box sx={{display:'flex', justifyContent:'center', flexDirection:'column', backgroundImage:"url(/bg3.jpg)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', paddingTop:'7vh'}}>
                <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'30vh'}}>
                    <Card sx={{backgroundColor:'transparent', boxShadow:'none',}}>
                        <CardContent>  
                            <Typography variant='h1' sx={{display:'flex', justifyContent:'center', fontFamily:'helvetica', fontStyle:'bold', fontSize:35, color: 'black'}}>Welcome Home!</Typography>
                            <Typography variant='h1' component='div' sx={{display:'flex', justifyContent:'center', fontSize:30, color: 'black'}}>{email}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{display:"flex", justifyContent:'space-evenly', marginTop:'-8vh', backgroundColor: 'transparent'}}>
                    {taskMode=='add'?
                        <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh'}}>
                            <Card sx={{width: "40vw",
                                height: "60vh",
                                background:'transparent',
                                border: '2px solid rgba(255, 255, 255, .2)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '30px',
                                padding: '30px 40px',
                                boxShadow:' 0 0 10px rgba(0, 0, 0, 0.5)',
                                marginTop:'-220px'}}>
                                <CardContent>
                                <Typography variant='h1' sx={{display:'flex', justifyContent:'left', paddingTop: 1.5, paddingBottom: 1.5, fontStyle: 'bold', fontFamily: 'Verdana', fontSize: 25}}>Enter the Task:</Typography>
                                    <TextField 
                                        onChange={handleTitle}
                                        type='text'
                                        value={title}
                                        placeholder=' Enter the title here:'
                                        sx={{mt:2}}/><br/><br/>
                                    <TextField
                                        onChange={handleDescription}
                                        value={description}
                                        minRows={5}
                                        placeholder=' Enter the task here:'
                                        style={{mt:2 }}
                                                onFocus={(event)=>{
                                                    event.target.style.borderBottomColor='#0018D5';
                                                }}
                                                onBlur={(event)=>{
                                                    event.target.style.borderBottomColor='lightgrey';
                                                }}
                                                onMouseOver={(event)=>{
                                                    event.target.style.borderBottomColor='black';
                                                }}
                                                onMouseOut={(event)=>{
                                                    event.target.style.borderBottomColor='lightgrey';
                                                }}
                                    /><br /><br/>
                                    <Button onClick={submitToDo} variant='contained' onMouseOver={changeColor} onMouseOut= {defaultColor1} sx={{ borderRadius:'20px', width:'120px', backgroundColor:'darkblue', marginTop:'1vh'}}>Add To Do</Button>
                                </CardContent>
                            </Card>
                        </Box>
                        :
                        <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh'}}>
                            <Card sx={{width: "40vw",
                                height: "60vh",
                                background:'transparent',
                                border: '2px solid rgba(255, 255, 255, .2)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '30px',
                                padding: '30px 40px',
                                boxShadow:' 0 0 10px rgba(0, 0, 0, 0.5)',
                                marginTop:'-220px'
                                }}>
                                <CardContent>
                                <Typography variant='h1' sx={{display:'flex', justifyContent:'left', paddingTop: 1.5, paddingBottom: 1.5, fontStyle: 'bold', fontFamily: 'Verdana', fontSize: 25}}>Edit the Task:</Typography>
                                    <TextField
                                         onChange={handleTitle}
                                         type='text'
                                         value={title}
                                         placeholder=' Enter the title here:'
                                         sx={{mt:2}}/><br/><br/>
                                    <TextField
                                        onChange={handleDescription}
                                        value={description}
                                        minRows={5}
                                        placeholder=' Enter the task here:'
                                        style={{mt:2 }}
                                                onFocus={(event)=>{
                                                    event.target.style.borderBottomColor='#0018D5';
                                                }}
                                                onBlur={(event)=>{
                                                    event.target.style.borderBottomColor='lightgrey';
                                                }}
                                                onMouseOver={(event)=>{
                                                    event.target.style.borderBottomColor='black';
                                                }}
                                                onMouseOut={(event)=>{
                                                    event.target.style.borderBottomColor='lightgrey';
                                                }}
                                    /><br /><br/>
                                    <Button onClick={editTodo} variant='contained' onMouseOver={changeColor} onMouseOut= {defaultColor1} sx={{ borderRadius:'20px', width:'120px', backgroundColor:'darkblue', marginTop:'1vh'}}>Edit To Do</Button>
                                </CardContent>
                            </Card>
                        </Box>}
                    
                    <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'transparent', alignItems:'center', minHeight:'100vh', marginTop: '-30vh'}}>
                        <Card sx={{width: "40vw",
                            height: "60vh",
                            background:'transparent',
                            border: '2px solid rgba(255, 255, 255, .2)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '30px',
                            padding: '30px 40px',
                            boxShadow:' 0 0 10px rgba(0, 0, 0, 0.5)',
                            overflowY:'scroll'}}>  
                            <CardContent sx={{}}>
                                <ol type='1'>
                                    {todos.map((todo)=>(
                                    <li key={todo.title} style={{background:'lightblue',
                                        border: '3px solid rgba(255, 255, 255, .5)',
                                        borderRadius: '20px',
                                        padding: '0px 2px',
                                        marginTop: '10px'}} >
                                        {todo.isDone==true?<h2 style={{
                                            textDecoration:'line-through',
                                            paddingLeft: '1vw',
                                            paddingTop: '1vh'}}>{todo.title}</h2>:<h2 style={{
                                                                    paddingLeft: '1vw',
                                                                    paddingTop: '1vh'}}>{todo.title}</h2>}
                                        {todo.isDone==true?<p style={{
                                            textDecoration:'line-through',
                                            paddingLeft: '1vw',
                                            paddingTop: '1vh'}}>{todo.description}</p>:<p style={{
                                                                    paddingLeft: '1vw',
                                                                    paddingTop: '0vh'}}>{todo.description}</p>}
                                        {todo.isDone==true?<button onClick={editTask(todo.taskId)} disabled style={{
                                            marginLeft: '1vw',
                                            marginTop: '1vh',
                                            marginRight: '1vw',
                                            marginBottom: '1vh',
                                            borderRadius: '10px',
                                            border: '0px',
                                            paddingLeft: '1vw',
                                            paddingRight: '1vw',
                                            paddingTop: '0.5vh',
                                            paddingBottom: '0.5vh'}}>Edit</button>:<button onClick={editTask(todo.taskId)} style={{
                                                                    marginLeft: '1vw',
                                                                    marginTop: '1vh',
                                                                    marginRight: '0.3vw',
                                                                    marginBottom: '1vh',
                                                                    border: '0px',
                                                                    borderRadius: '10px',
                                                                    paddingLeft: '1vw',
                                                                    paddingRight: '1vw',
                                                                    paddingTop: '0.5vh',
                                                                    paddingBottom: '0.5vh'}}>Edit</button>}
                                        {todo.isDone==true?<button onClick={markTask(todo.taskId)} disabled style={{
                                            marginLeft: '0.1vw',
                                            marginTop: '1vh',
                                            marginRight: '1vw',
                                            marginBottom: '1vh',
                                            borderRadius: '10px',
                                            border: '0px',
                                            paddingLeft: '1vw',
                                            paddingRight: '1vw',
                                            paddingTop: '0.5vh',
                                            paddingBottom: '0.5vh'}}>Mark as Completed</button>:<button onClick={markTask(todo.taskId)} style={{
                                                                    marginLeft: '0.1vw',
                                                                    marginTop: '1vh',
                                                                    marginRight: '0.3vw',
                                                                    marginBottom: '1vh',
                                                                    border: '0px',
                                                                    borderRadius: '10px',
                                                                    paddingLeft: '1vw',
                                                                    paddingRight: '1vw',
                                                                    paddingTop: '0.5vh',
                                                                    paddingBottom: '0.5vh'}}>Mark as Completed</button>}
                                        {todo.isDone==true?<button onClick={deleteTask(todo.taskId)} style={{
                                            marginLeft: '0.1vw',
                                            marginTop: '1vh',
                                            marginRight: '1vw',
                                            marginBottom: '1vh',
                                            border: '0px',
                                            borderRadius: '10px',
                                            paddingLeft: '1vw',
                                            paddingRight: '1vw',
                                            paddingTop: '0.5vh',
                                            paddingBottom: '0.5vh'}}>Delete</button>:<button onClick={markTask(todo.taskId)} disabled style={{
                                                                    marginLeft: '0.1vw',
                                                                    marginTop: '1vh',
                                                                    marginRight: '0.3vw',
                                                                    marginBottom: '1vh',
                                                                    border: '0px',
                                                                    borderRadius: '10px',
                                                                    paddingLeft: '1vw',
                                                                    paddingRight: '1vw',
                                                                    paddingTop: '0.5vh',
                                                                    paddingBottom: '0.5vh'}}>Delete</button>}
                                    </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Home
import {createContext, useContext, useState, useEffect} from 'react'
import axios from 'axios'


const TaskAndProjectContext = createContext()

export const TaskAndProjectContextProvider = ({Children}) =>{

    const [project, setProject] = useState([])
    

}
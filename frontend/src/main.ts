/// <reference types="vite/client" />
import van from 'vanjs-core'
import Home from './route/home'
import About from './route/about'
import Login from './route/login'
import Register from './route/register'
import Work from './route/work'
import User from './route/user'
import Add from './route/add'
import { Navbar } from './view/navber'
import 'bootstrap/dist/css/bootstrap.css'
import { checkLogin } from './util'
import '../scss/main.scss'

checkLogin().then(() => {
    van.add(document.body, Navbar(), Home(), About(), Login(), Register(), Work(), User(), Add())
})
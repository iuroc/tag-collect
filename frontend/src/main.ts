/// <reference types="vite/client" />
import van from 'vanjs-core'
import home from './route/home'
import about from './route/about'
import login from './route/login'
import register from './route/register'
import work from './route/work'
import user from './route/user'
import { Navbar } from './view/navber'
import 'bootstrap/dist/css/bootstrap.css'
import { checkLogin } from './util'
import '../scss/main.scss'

checkLogin().then(() => {
    van.add(document.body, Navbar(), home, about, login, register, work, user)
})
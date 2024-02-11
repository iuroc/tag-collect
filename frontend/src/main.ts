/// <reference types="vite/client" />
import van from 'vanjs-core'
import Home from './route/home'
import About from './route/about'
import Login from './route/login'
import Register from './route/register'
import Work from './route/work'
import User from './route/user'
import Edit from './route/edit'
import Search from './route/search'
import { Navbar } from './view/navber'
import 'bootstrap/dist/css/bootstrap.css'
import { checkLogin } from './util'
import '../scss/main.scss'
import 'github-markdown-css/github-markdown-light.css'

checkLogin().then(() => {
    van.add(
        document.body,
        Navbar(),
        Home(),
        About(),
        Login(),
        Register(),
        Work(),
        User(),
        Edit(),
        Search()
    )
})
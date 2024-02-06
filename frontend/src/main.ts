/// <reference types="vite/client" />
import van from 'vanjs-core'
import home from './route/home'
import about from './route/about'
import { Header } from './view'
import 'bootstrap/dist/css/bootstrap.css'

van.add(document.body, Header(), home, about)
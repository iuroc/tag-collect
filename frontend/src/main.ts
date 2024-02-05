/// <reference types="vite/client" />
import van from 'vanjs-core'
import home from './route/home'
import about from './route/about'

van.add(document.body, home, about)
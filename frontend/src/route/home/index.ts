import van from 'vanjs-core'
import { Route } from 'vanjs-router'
import sg from './state'

const { button, div } = van.tags

const PanelA = () => {
    return div(sg.obj('panelA').get<number>('num'))
}

export default Route({ name: 'home' },
    div('主页面'),
    PanelA(),
    button({
        onclick() {
            sg.obj('panelA').get<number>('num').val = Math.random() * 1000
        }
    }, 'Change')
)
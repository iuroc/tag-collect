import van from 'vanjs-core'
import { Route } from 'vanjs-router'
import sg from './state'

const { button, div, img, span } = van.tags

export default Route({ name: 'home' },
    div('主页面'),
    div({ class: 'text-dark' },
        '这些类名看起来是用于网页或应用程序中的文本颜色设置的样式命名。',
        span({ class: 'text-dark-emphasis' }, '尽管它们'),
        '的确切意义可能因具体上下文而异，但可以从字面意思上推测它们的大致含义：'
    ),
    sg.get('a')
)
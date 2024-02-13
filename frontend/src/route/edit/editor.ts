import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { markdownLanguage } from '@codemirror/lang-markdown'
import { basicSetup } from 'codemirror'

export const setupEditor = (editorEle: HTMLDivElement) => {
    const view = new EditorView({
        parent: editorEle,
        state: EditorState.create({
            extensions: [
                basicSetup,
                EditorView.lineWrapping,
                markdownLanguage,
                keymap.of([indentWithTab]),
                EditorState.tabSize.of(8),
                indentUnit.of('    '),
            ]
        })
    })
    return view
}
import { Compartment, EditorState, type Extension } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { bracketMatching, defaultHighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { cpp } from '@codemirror/lang-cpp';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { searchKeymap } from '@codemirror/search';

export interface CppEditor {
  setValue(value: string): void;
  setReadOnly(value: boolean): void;
  focus(): void;
}

/** Kept behind this adapter so articles and the compiler don't depend on CodeMirror. */
export function createCppEditor(parent: HTMLElement, source: HTMLTextAreaElement, onChange: () => void): CppEditor {
  const permissions = new Compartment();
  const extensions: Extension[] = [
      EditorState.phrases.of({
        'Find': '查找', 'Replace': '替换', 'next': '下一个', 'previous': '上一个',
        'all': '全部', 'match case': '区分大小写', 'regexp': '正则表达式',
        'by word': '整词匹配', 'replace': '替换', 'replace all': '全部替换', 'close': '关闭',
        'Go to line': '跳转到行', 'go': '跳转',
      }),
      cpp(),
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      drawSelection(),
      history(),
      indentUnit.of('    '),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      syntaxHighlighting(defaultHighlightStyle),
      keymap.of([...closeBracketsKeymap, indentWithTab, ...defaultKeymap, ...historyKeymap, ...searchKeymap]),
      permissions.of([EditorState.readOnly.of(false), EditorView.editable.of(true)]),
      EditorView.contentAttributes.of({
        'aria-label': 'C++ 源代码编辑器',
        'aria-describedby': source.getAttribute('aria-describedby') || '',
        spellcheck: 'false',
        autocapitalize: 'off',
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          source.value = update.state.doc.toString();
          onChange();
        }
      }),
      EditorView.theme({
        '&': { fontSize: '1rem', backgroundColor: '#faf9fc', color: '#262626' },
        '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', lineHeight: '1.65' },
        '.cm-content': { padding: '1rem 0', minHeight: '12rem' },
        '.cm-line': { padding: '0 1rem' },
        '.cm-gutters': { backgroundColor: '#faf9fc', color: '#666', borderRight: '1px solid #e8e6eb' },
        '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#f2edff' },
        '.cm-cursor': { borderLeftColor: '#262626' },
        '&.cm-focused': { outline: '2px solid #6d3fd1', outlineOffset: '-2px' },
        '.cm-search': { fontFamily: 'system-ui, sans-serif' },
      }),
  ];
  const view = new EditorView({ parent, doc: source.value, extensions });

  return {
    setValue(value) {
      // Reset also clears undo history, so undo cannot silently restore pre-reset edits.
      view.setState(EditorState.create({ doc: value, extensions }));
      source.value = value;
    },
    setReadOnly(value) {
      view.dispatch({ effects: permissions.reconfigure([
        EditorState.readOnly.of(value), EditorView.editable.of(!value),
      ]) });
    },
    focus() { view.focus(); },
  };
}

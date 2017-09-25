import { dirname } from 'path'
import nrequire from 'native-require'
import markdownIt from 'markdown-it'
import markdownItFootnote from 'markdown-it-footnote'
import markdownItEmoji from 'markdown-it-emoji'
import markdownItLinkAttributes from 'markdown-it-link-attributes'

const highlightLib = nrequire.from(dirname(nrequire.resolve('highlight.js')))

const highlightLanguages = [ 'xml', 'css', 'javascript' ]

const hljs = highlightLib.require('./highlight')
// hljs.configure({ tabReplace: '  ' })
highlightLanguages.forEach(lang => hljs.registerLanguage(lang, highlightLib.require('./languages/' + lang)))

const md = markdownIt({
  html: true,
  highlight (text, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(lang, text).value
    } else {
      return ''
    }
  }
})
md.use(markdownItFootnote)
md.use(markdownItEmoji, { shortcuts: {} })
md.use(markdownItLinkAttributes, {
  pattern: /^https?:/,
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

export function highlight (text, { lang } = {}) {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(lang, text).value
  } else {
    return md.utils.escapeHtml(text)
  }
}

export function markdown (text) {
  return md.render(text)
}

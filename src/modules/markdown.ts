import markdownit from 'markdown-it'
import hljs from 'highlight.js' // https://highlightjs.org

// Actual default values
export const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
  langPrefix:   'language-',
  highlight: function (str, lang):any {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {
        //
      }
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});
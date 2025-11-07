import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Surface runtime errors to the page to avoid silent white screen
function showFatalError(err) {
  const el = document.getElementById('root') || document.body
  const pre = document.createElement('pre')
  pre.style.whiteSpace = 'pre-wrap'
  pre.style.background = '#fff5f5'
  pre.style.color = '#b91c1c'
  pre.style.border = '1px solid #fecaca'
  pre.style.padding = '12px'
  pre.style.borderRadius = '8px'
  pre.style.fontSize = '12px'
  pre.textContent = `App failed to start.\n${err?.stack || err}`
  el.innerHTML = ''
  el.appendChild(pre)
}

window.onerror = function (message, source, lineno, colno, error) {
  showFatalError(error || message)
}
window.onunhandledrejection = function (event) {
  showFatalError(event.reason || 'Unhandled promise rejection')
}

try {
  const rootEl = document.getElementById('root')
  const root = ReactDOM.createRoot(rootEl)
  // Render a minimal placeholder immediately
  root.render(React.createElement('div', { style: { padding: 12, color: '#334155', fontFamily: 'ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif' } }, 'Starting application...'))

  import('./App.jsx')
    .then(({ default: App }) => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
      window.__APP_MOUNTED__ = true
      const boot = document.getElementById('boot-msg')
      if (boot && boot.parentNode) boot.parentNode.removeChild(boot)
    })
    .catch((err) => {
      showFatalError(err)
    })
} catch (err) {
  showFatalError(err)
}


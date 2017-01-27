function renderCSS() {
  return `
    * {
      box-sizing: border-box;
      line-height: 1.2;
    }
    label{
      cursor: pointer;
    }
    body {
      color: #fff;
      font-size: 12px;
      font-family: Menlo, monaco, Consolas;
      padding: 0 15px 0 0;
      max-width: 100%;
    }
    .h2 {
      font-weight:bold;
      text-transform: uppercase;
      font-size: 12px;
      display: block;
      margin: 20px 0;
    }
    code {
      opacity: 0.8;
    }
  `;
}

export function getHTML() {  
  return `
    <style>${renderCSS()}</style>
    <body>
        <h2>You must provide a variable list</h2>
        <p>
          Location:
        </p>
        <p>
          <code>.vscode/style-variables.json</code>
        </p>
        <p>
          Format:
<pre><code>{
  "$red": "#f00",
  "$my-font": "Times, serif"
  // ...
}</code></pre>
        </p>
    </body>
  `;
}


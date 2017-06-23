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
      padding: 0 15px;
      max-width: 100%;
      line-height: 1.2em;
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
    a, a:hover, a:visited {
      color: #fff;
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
          <code>.vscode/style-vars.json</code>
        </p>
        <p>
          Format:
<pre><code>{
  "$red": "#f00",
  "$my-font": "Times, serif"
  // ...
}</code></pre>
        </p>
        <p>
          If you are using SCSS, you can generate this file easily with
          <a href="https://github.com/testerez/extract-sass-vars">extract-sass-vars</a>:
        </p>
        <p>
          <code>npm i -g extract-sass-vars</code><br />
          <code>extract-sass-vars yourVariablesFile.scss &gt; .vscode/style-vars.json</code>
        </p>
        <p>
          To keep it up to date, add a <code>postinstall</code> script in your package.json ;)
        </p>
    </body>
  `;
}


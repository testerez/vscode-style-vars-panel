Access your style variables from a side panel (SASS, LESS, PostCSS...)

<img src="screenshot.png" height="500"/>

### Variables matching

If you use SASS, LESS, PostCSS or any CSS prepocessor, you probably use variables to set colors, font sizes, dimentions...
And if you integrate your UI based on images provided by your design team, you probably try to match the colors from the design with your existing variables. This process is not fun and it's temptating to use a color picker and just paste static values.

The good new is that if you do take this lazy route, it's ok! The side panel will show you the closest available variables for your cursor position. Click on the one you want to insert and youre done!

It makes it also supper easy to update your existing code to use more variables.

### How to use it:

To open the panel, run this vscode command: **"> Show style vars panel"**

Right now this extention is not able to gather the available variables accros your project. So you have to provide the list yourself:

#### Variables list format:

File: `.vscode/style-vars.json`

```json
{
  "$red": "#f00",
  "$my-font": "Times, serif"
  // ...
}
```
> `vscode-sass-vars` will sort and categorize those variables (color, dimention, other...)

### PRs are welcome!

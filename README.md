If you use SASS, LESS, PostCSS or any CSS prepocessor you probably use variables to set colors, font sizes, dimentions...
And if you integrate your UI based on images provided by your design team, you probably try to match the colors from the design with your existing variables.
This extention make this process easy by promoting a simple workflow:
1- Use a color picker to get the exact colors from the design and just paste those static values in your CSS
2- Once your done, `Open style vars panel` and simply put your cursor on a color code (`#FFFFFF`), a dimentions (`12px`) or basically anything... The side panel will show you the closest available variables.
3- Click on the variable you want to use and your static value will be replaced!

### How to use it:

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

Once installed, run this command: **"> Show style vars panel"**

### Screenshot
<img src="screenshot.png" width="644"/>

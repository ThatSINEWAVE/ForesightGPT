<div align="center">

# [ForesightGPT](https://thatsinewave.github.io/ForesightGPT)

![Banner](https://raw.githubusercontent.com/ThatSINEWAVE/ForesightGPT/refs/heads/main/.github/SCREENSHOTS/ForesightGPT.png)

ForesightGPT is a web-based prediction tool that leverages OpenAI's GPT models to generate probabilistic forecasts based on user-defined parameters.

**[Live Demo Here](https://thatsinewave.github.io/ForesightGPT)**

</div>

## Features

- **AI-Powered Predictions**: Utilize OpenAI's GPT models (GPT-4, GPT-4 Turbo, GPT-3.5 Turbo) to generate intelligent predictions
- **Customizable Parameters**: Define and adjust the relevant factors affecting your prediction
- **Visual Results**: View outcomes as clear probability charts and confidence indicators
- **Detailed Analysis**: Get comprehensive explanations of prediction reasoning
- **Key Factors Identification**: Understand which parameters have the most significant impact
- **Local API Key Storage**: Your OpenAI API key is stored securely in your browser's local storage only

<div align="center">

## ☕ [Support my work on Ko-Fi](https://ko-fi.com/thatsinewave)

</div>

## How It Works

1. **Configure API**: Enter your OpenAI API key and select a model
2. **Define Your Question**: Enter what you want to predict
3. **Set Parameters**: Add relevant factors with their value ranges and importance weights
4. **Generate**: Get detailed probabilistic predictions with visual representations
5. **Analyze**: Review the detailed explanation and key influencing factors

## Requirements

- An OpenAI API key with access to GPT models
- A modern web browser with JavaScript enabled
- Internet connection to access the OpenAI API

## Privacy & Security

- Your OpenAI API key is stored only in your browser's local storage
- No data is sent to any servers except directly to OpenAI's API
- All processing happens in your browser

## Installation for Local Development

1. Clone the repository:
   ```
   git clone https://github.com/ThatSINEWAVE/ForesightGPT.git
   ```

2. Navigate to the project directory:
   ```
   cd ForesightGPT
   ```

3. Open `index.html` in your preferred browser or use a local development server.

## Cost Considerations

This tool uses the OpenAI API which may incur charges to your account based on token usage. GPT-4 provides the most accurate predictions but costs more per API call. GPT-3.5 Turbo is more cost-effective for frequent use.

## Usage Tips

- **Be Specific**: The more precise your prediction question, the better the results
- **Relevant Parameters**: Include all factors that might influence the outcome
- **Weight Appropriately**: Assign higher weights (1-10) to more influential factors
- **Multiple Scenarios**: Run predictions with different parameter values to compare outcomes

## Limitations

- Predictions are probabilistic estimates, not guarantees
- Results depend on the quality of parameters and their assigned weights
- The tool is subject to the limitations of the underlying OpenAI models
- Internet connection is required for generating predictions

<div align="center">

## [Join my discord server](https://discord.gg/2nHHHBWNDw)

</div>

## Technical Details

ForesightGPT is built using:
- HTML5, CSS3, and vanilla JavaScript
- Chart.js for data visualization
- Font Awesome for icons
- OpenAI Chat Completions API

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the GPT API
- [Chart.js](https://www.chartjs.org/) for the visualization library
- [Font Awesome](https://fontawesome.com/) for the icons

## Contributing

Feel free to submit issues or contribute improvements via pull requests.

## License

This project is open-source and available under the [MIT License](LICENSE)
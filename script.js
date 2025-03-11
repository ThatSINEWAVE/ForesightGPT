document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const apiKeyInput = document.getElementById('apiKey');
    const toggleApiKeyBtn = document.getElementById('toggleApiKey');
    const addParameterBtn = document.getElementById('addParameter');
    const parametersContainer = document.getElementById('parametersContainer');
    const generatePredictionBtn = document.getElementById('generatePrediction');
    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const predictionDetailsEl = document.getElementById('predictionDetails');
    const factorsContainerEl = document.getElementById('factorsContainer');
    const predictionQuestionEl = document.getElementById('predictionQuestion');
    const modelSelectionEl = document.getElementById('modelSelection');

    // New DOM elements
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const deleteApiKeyBtn = document.getElementById('deleteApiKey');

    // Charts
    let probabilityChart = null;
    let confidenceChart = null;

    // Initialize with one parameter field
    addParameter();

    // Load saved values from localStorage if available
    loadSavedApiKey();

    if (localStorage.getItem('openaiModel')) {
        modelSelectionEl.value = localStorage.getItem('openaiModel');
    }

    // Toggle API Key visibility
    toggleApiKeyBtn.addEventListener('click', function() {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            toggleApiKeyBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            apiKeyInput.type = 'password';
            toggleApiKeyBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    // Save API key to localStorage when changed
    apiKeyInput.addEventListener('change', function() {
        localStorage.setItem('openaiApiKey', apiKeyInput.value);
    });

    // Save API key when the save button is clicked
    saveApiKeyBtn.addEventListener('click', function() {
        saveApiKey();
    });

    // Delete saved API key
    deleteApiKeyBtn.addEventListener('click', function() {
        deleteApiKey();
    });

    // Save selected model to localStorage when changed
    modelSelectionEl.addEventListener('change', function() {
        localStorage.setItem('openaiModel', modelSelectionEl.value);
    });

    // Add parameter field
    addParameterBtn.addEventListener('click', addParameter);

    // Generate prediction
    generatePredictionBtn.addEventListener('click', generatePrediction);

    // Function to save API key to localStorage
    function saveApiKey() {
        const apiKey = apiKeyInput.value.trim();

        if (apiKey) {
            localStorage.setItem('openaiApiKey', apiKey);

            // Show save animation
            saveApiKeyBtn.classList.add('save-animation');
            saveApiKeyBtn.innerHTML = '<i class="fas fa-check"></i>';

            // Reset button after animation
            setTimeout(() => {
                saveApiKeyBtn.classList.remove('save-animation');
                saveApiKeyBtn.innerHTML = '<i class="fas fa-save"></i>';
            }, 1000);
        } else {
            alert('Please enter an API key to save');
        }
    }

    // Function to load saved API key from localStorage
    function loadSavedApiKey() {
        const savedApiKey = localStorage.getItem('openaiApiKey');
        if (savedApiKey) {
            apiKeyInput.value = savedApiKey;
        }
    }

    // Function to delete saved API key
    function deleteApiKey() {
        if (confirm('Are you sure you want to delete the saved API key?')) {
            localStorage.removeItem('openaiApiKey');
            apiKeyInput.value = '';

            // Show delete confirmation
            deleteApiKeyBtn.innerHTML = '<i class="fas fa-check"></i>';

            // Reset button after animation
            setTimeout(() => {
                deleteApiKeyBtn.innerHTML = '<i class="fas fa-trash"></i>';
            }, 1000);
        }
    }

    function addParameter() {
        const paramRow = document.createElement('div');
        paramRow.className = 'parameter-row';

        // Parameter name input
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'param-name';
        nameInput.placeholder = 'Parameter name (e.g., Historical Data)';
        nameInput.required = true;

        // Min value input
        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.className = 'param-min';
        minInput.placeholder = 'Min';
        minInput.required = true;

        // Max value input
        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.className = 'param-max';
        maxInput.placeholder = 'Max';
        maxInput.required = true;

        // Weight input
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.className = 'param-weight';
        weightInput.placeholder = 'Weight (1-10)';
        weightInput.min = 1;
        weightInput.max = 10;
        weightInput.required = true;

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', function() {
            // Only remove if there's more than one parameter
            if (parametersContainer.children.length > 1) {
                paramRow.remove();
            } else {
                alert('At least one parameter is required.');
            }
        });

        // Append all elements to the parameter row
        paramRow.appendChild(nameInput);
        paramRow.appendChild(minInput);
        paramRow.appendChild(maxInput);
        paramRow.appendChild(weightInput);
        paramRow.appendChild(removeBtn);

        // Append the row to the parameters container
        parametersContainer.appendChild(paramRow);
    }

    function validateInputs() {
        // Check if API key is provided
        if (!apiKeyInput.value.trim()) {
            alert('Please enter your OpenAI API key.');
            return false;
        }

        // Check if prediction question is provided
        if (!predictionQuestionEl.value.trim()) {
            alert('Please enter a prediction question.');
            return false;
        }

        // Check if all parameter fields are filled
        const paramRows = parametersContainer.querySelectorAll('.parameter-row');
        for (let row of paramRows) {
            const name = row.querySelector('.param-name').value;
            const min = row.querySelector('.param-min').value;
            const max = row.querySelector('.param-max').value;
            const weight = row.querySelector('.param-weight').value;

            if (!name || !min || !max || !weight) {
                alert('Please fill in all parameter fields.');
                return false;
            }

            // Validate min < max
            if (parseFloat(min) >= parseFloat(max)) {
                alert('Min value must be less than Max value.');
                return false;
            }

            // Validate weight is between 1-10
            if (weight < 1 || weight > 10) {
                alert('Weight must be between 1 and 10.');
                return false;
            }
        }

        return true;
    }

    function collectParameters() {
        const parameters = [];
        const paramRows = parametersContainer.querySelectorAll('.parameter-row');

        for (let row of paramRows) {
            parameters.push({
                name: row.querySelector('.param-name').value,
                min: parseFloat(row.querySelector('.param-min').value),
                max: parseFloat(row.querySelector('.param-max').value),
                weight: parseInt(row.querySelector('.param-weight').value)
            });
        }

        return parameters;
    }

    async function generatePrediction() {
        if (!validateInputs()) return;

        const apiKey = apiKeyInput.value;
        const question = predictionQuestionEl.value;
        const parameters = collectParameters();

        // Show results section and loading indicator
        resultsSection.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultsContainer.style.display = 'none';

        // Scroll to results section
        resultsSection.scrollIntoView({
            behavior: 'smooth'
        });

        try {
            const response = await callOpenAI(apiKey, question, parameters);
            displayResults(response);
        } catch (error) {
            alert('Error generating prediction: ' + error.message);
            loadingIndicator.style.display = 'none';
        }
    }

    async function callOpenAI(apiKey, question, parameters) {
        // Get the selected model
        const selectedModel = modelSelectionEl.value;

        // Construct prompt for OpenAI
        const prompt = constructPrompt(question, parameters);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: selectedModel, // Use the selected model instead of hardcoded 'gpt-4'
                    messages: [{
                            role: 'system',
                            content: 'You are ForesightGPT, a predictive analysis AI. Provide probability estimates for different outcomes based on parameters. Respond only with JSON data that includes probabilities, confidence levels, detailed analysis, and key factors affecting the prediction.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }

            const data = await response.json();

            // Parse the content as JSON
            try {
                return JSON.parse(data.choices[0].message.content);
            } catch (e) {
                // If not valid JSON, try to extract JSON from the response
                const content = data.choices[0].message.content;
                const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) ||
                    content.match(/```\n([\s\S]*?)\n```/) ||
                    content.match(/{[\s\S]*}/);

                if (jsonMatch) {
                    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
                } else {
                    throw new Error('Could not parse prediction results');
                }
            }
        } catch (error) {
            console.error('OpenAI API call failed:', error);
            throw error;
        }
    }

    function constructPrompt(question, parameters) {
        let prompt = `Analyze the following prediction question: "${question}"\n\n`;
        prompt += 'Consider these parameters:\n';

        parameters.forEach(param => {
            prompt += `- ${param.name} (Range: ${param.min} to ${param.max}, Weight: ${param.weight}/10)\n`;
        });

        prompt += `\nRespond ONLY with a JSON object containing the following fields:
1. "outcomes": Array of possible outcomes with their probability percentages (all probabilities should add up to 100%)
2. "confidence": Overall confidence level in the prediction (0-100%)
3. "analysis": Detailed explanation of the prediction and reasoning
4. "keyFactors": Array of key factors affecting the prediction, with their impact level (1-10)

Format your response as:
{
  "outcomes": [
    {"outcome": "Outcome 1", "probability": 65},
    {"outcome": "Outcome 2", "probability": 35}
  ],
  "confidence": 80,
  "analysis": "Detailed analysis text goes here...",
  "keyFactors": [
    {"factor": "Factor 1", "impact": 8},
    {"factor": "Factor 2", "impact": 6}
  ]
}

DO NOT include any text before or after the JSON object. Your entire response must be valid JSON.`;

        return prompt;
    }

    function displayResults(data) {
        // Hide loading indicator and show results
        loadingIndicator.style.display = 'none';
        resultsContainer.style.display = 'block';

        // Display detailed analysis
        predictionDetailsEl.innerHTML = `<p>${data.analysis}</p>`;

        // Display key factors
        factorsContainerEl.innerHTML = '';
        data.keyFactors.forEach(factor => {
            const factorEl = document.createElement('div');
            factorEl.className = 'factor-item';
            factorEl.innerHTML = `
                <span class="factor-name">${factor.factor}</span>
                <span class="factor-value">Impact: ${factor.impact}/10</span>
            `;
            factorsContainerEl.appendChild(factorEl);
        });

        // Create/update probability chart
        renderProbabilityChart(data.outcomes);

        // Create/update confidence chart
        renderConfidenceChart(data.confidence);
    }

    function renderProbabilityChart(outcomes) {
        const ctx = document.getElementById('probabilityChart').getContext('2d');

        // If chart already exists, destroy it
        if (probabilityChart) {
            probabilityChart.destroy();
        }

        // Prepare data
        const labels = outcomes.map(item => item.outcome);
        const data = outcomes.map(item => item.probability);
        const backgroundColors = generateColors(outcomes.length);

        // Create chart
        probabilityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Probability (%)',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    function renderConfidenceChart(confidence) {
        const ctx = document.getElementById('confidenceChart').getContext('2d');

        // If chart already exists, destroy it
        if (confidenceChart) {
            confidenceChart.destroy();
        }

        // Create chart
        confidenceChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Confidence', 'Uncertainty'],
                datasets: [{
                    data: [confidence, 100 - confidence],
                    backgroundColor: [
                        'rgba(108, 92, 231, 0.7)',
                        'rgba(218, 218, 218, 0.7)'
                    ],
                    borderColor: [
                        'rgba(108, 92, 231, 1)',
                        'rgba(218, 218, 218, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw + '%';
                            }
                        }
                    }
                }
            }
        });

        // Add center text
        Chart.register({
            id: 'confidenceText',
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;

                ctx.restore();
                ctx.font = 'bold 24px Arial';
                ctx.fillStyle = '#2d3436';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(confidence + '%', width / 2, height / 2);
                ctx.font = '14px Arial';
                ctx.fillText('Confidence', width / 2, height / 2 + 25);
                ctx.save();
            }
        });
    }

    function generateColors(count) {
        const baseColors = [
            'rgba(108, 92, 231, 0.7)', // Purple
            'rgba(0, 184, 148, 0.7)', // Green
            'rgba(253, 121, 168, 0.7)', // Pink
            'rgba(9, 132, 227, 0.7)', // Blue
            'rgba(255, 159, 67, 0.7)', // Orange
            'rgba(45, 52, 54, 0.7)' // Dark
        ];

        // If we need more colors than in our base array
        if (count > baseColors.length) {
            const extraColors = [];
            for (let i = 0; i < count - baseColors.length; i++) {
                const r = Math.floor(Math.random() * 200) + 20;
                const g = Math.floor(Math.random() * 200) + 20;
                const b = Math.floor(Math.random() * 200) + 20;
                extraColors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
            }
            return [...baseColors, ...extraColors];
        }

        return baseColors.slice(0, count);
    }
});
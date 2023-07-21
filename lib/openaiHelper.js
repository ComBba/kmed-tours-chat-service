// located at /lib/openaiHelper.js
const { Configuration, OpenAIApi } = require('openai');
const { sleep } = require('./utils');

// Set up OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// Create OpenAI API instance
const openai = new OpenAIApi(configuration);

let cntRetry = 0;

// Model costs per token
const modelCosts = {
    'gpt-4': 0.09,
    'gpt-3.5': 0.007
};

// Function to create text completion using OpenAI API
export async function createCompletion(messages, temperature = 1.0) {
    const formattedMessages = messages.map((message) => ({
        role: message.role,
        content: message.content,
    }));

    const model = process.env.OPENAI_MODEL;
    let modelCostPerToken;
    
    if (model.startsWith('gpt-4')) {
        modelCostPerToken = modelCosts['gpt-4'];
    } else if (model.startsWith('gpt-3.5')) {
        modelCostPerToken = modelCosts['gpt-3.5'];
    } else {
        console.error('Invalid model specified.');
        return '';
    }

    try {
        const response = await openai.createChatCompletion({
            model: model,
            messages: formattedMessages,
            temperature: temperature,
            max_tokens: 3000,
        });
        if (response && response.data && response.data.choices && response.data.choices.length > 0) {
            console.log('[OpenAI API] Using Model:', model);
            console.log('[OpenAI API] Prompt tokens:', response.data.usage.prompt_tokens);
            console.log('[OpenAI API] Completion tokens:', response.data.usage.completion_tokens);
            console.log('[OpenAI API] Total tokens used:', response.data.usage.total_tokens);
            console.log('[OpenAI API] Estimated cost:', ((response.data.usage.total_tokens / 1000) * modelCostPerToken).toFixed(8), 'USD');
            return response.data.choices[0].message.content.trim();
        } else {
            console.error('No choices returned by OpenAI API');
            return '';
        }
    } catch (error) {
        console.error('Error using OpenAI API:', error.response == undefined ? error : error.response);
        if (error.response?.status == 429) {
            for (let cntTimeout = 60; cntTimeout > 0; cntTimeout--) {
                await sleep(1 * 1000);
                console.log(cntTimeout, "초... 대기중...");
            }
        } else {
            for (let cntTimeout = 10; cntTimeout > 0; cntTimeout--) {
                await sleep(1 * 1000);
                console.log(cntTimeout, "초...  대기중...");
            }
        }
        if (cntRetry > 10) {
            cntRetry = 0;
            return '';
        }
        cntRetry += 1;
        return await createCompletion(messages, temperature);
    }
}

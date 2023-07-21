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
// Function to create text completion using OpenAI API
export async function createCompletion(messages, temperature = 1.0) {
    const formattedMessages = messages.map((message) => ({
        role: message.role,
        content: message.content,
    }));

    try {
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_MODEL, //gpt-4,gpt-3.5-turbo,gpt-3.5-turbo-16k-0613,gpt-3.5-turbo-16k,gpt-3.5-turbo-0613,gpt-4-0613
            messages: formattedMessages,
            temperature: temperature,
            max_tokens: 3000,
            //top_p: 1.0,
            //n: 1,
            //stop: "None",
            //frequency_penalty: 0.5,
            //presence_penalty: 0.5,
        });
        if (response && response.data && response.data.choices && response.data.choices.length > 0) {
            console.log('[OpenAI API] Prompt tokens:', response.data.usage.prompt_tokens);
            console.log('[OpenAI API] Completion tokens:', response.data.usage.completion_tokens);
            console.log('[OpenAI API] Total tokens used:', response.data.usage.total_tokens);
            console.log('[OpenAI API] Estimated cost:', ((response.data.usage.total_tokens / 1000) * 0.002).toFixed(8), 'USD'); // 토큰당 비용인 $0.002를 사용하여 비용 추정
            return response.data.choices[0].message.content.trim();
        } else {
            console.error('No choices returned by OpenAI API');
            return '';
        }
    } catch (error) {
        console.error('Error using OpenAI API:', error.response == undefined ? error : error.response);
        if (error.response?.status == 429) {
            for (let cntTimeout = 60; cntTimeout > 0; cntTimeout--) {
                await sleep(1 * 1000); // 60초 대기
                console.log(cntTimeout, "초... 대기중...");
            }

        } else {
            for (let cntTimeout = 10; cntTimeout > 0; cntTimeout--) {
                await sleep(1 * 1000); // 10초 대기
                console.log(cntTimeout, "초...  대기중...");
            }
        }
        if (cntRetry > 10) {
            cntRetry = 0;
            return {
                messageContent: '',
            };
        }
        cntRetry += 1;
        return await createCompletion(messages);
    }
}
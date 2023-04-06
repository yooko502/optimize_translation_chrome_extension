checkApiKeyInLocalStorage();

function getApiKey() {
  const apiKey = document.forms["save_api_key"]["api_key"].value;
  console.log("apiKey", apiKey)
  localStorage.setItem('OPEN_AI_API_KEY', apiKey);
  checkApiKeyInLocalStorage();
}

function checkApiKeyInLocalStorage() {
  const localApiKey = localStorage.getItem('OPEN_AI_API_KEY');
  if (localApiKey) {
    document.getElementById('optimize_body').innerHTML = `<div><form id='translation_context'>
        <div id="optimize_input">
          <p>Input your content:</p>
          <div>
            <textarea type="text" name="prompt" class="prompt_input" maxlength=150></textarea>
          </div>
        </div>
        <div>
          <button type="button" id="submit_context" class="submit_btn">submit</button>
        </div>
        </form></div>
        <div id="result"></div>`;
    
    document.addEventListener('DOMContentLoaded', function () {
          document.querySelector('#submit_context').addEventListener('click', getTranslationResult);
        });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('#submit').addEventListener('click', getApiKey);
    });
  }
}

function getTranslationResult() {
  const promptInput = document.forms["translation_context"]["prompt"].value;
  const resultDiv = document.getElementById('result');
  const localApiKey = localStorage.getItem('OPEN_AI_API_KEY');
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const opition = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      'Authorization': `Bearer ${localApiKey}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": `Optimize the following sentences to be more natural, just return optimize result and reply me same language:
              Text"""${promptInput}"""`
        },
        {
          "role": "system",
          "content": `Use the following format:
                Optimized: <optimized_content>
              `
        }
      ],
      "temperature": 0
    }),
  }

  fetch(apiUrl, opition)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const result = data.choices[0].message.content;
      resultDiv.innerText = result;
    })
    .catch((error) => {
      // 处理API错误
      console.error(error);
    });
}
import axios from "axios";

// Class to call OpenAI API to translate content
// param:
//   - language
//   - message
// return:
//   - translated content

class OpenAiCaller {
  constructor() {
    this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
  }

  async translateContent(message, language, openAiSecret) {
    let reqData = {
      data: {
        lang: language,
        message: message,
        openAiSecret: openAiSecret,
      }
    }

    let response = await axios.post(`${this.baseUrl}/api/translate`, reqData);
    return response;
  }
}

export default OpenAiCaller;

import axios from "axios";
import OpenAiCaller from "../../Translate/openAiCaller.js";

class FetchIssuesData {
    constructor(){
        this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
        this.badge = process.env.BADGE || "By Kiara Translator（⌒▽⌒）";
        this.language = process.env.language || 'Japanese'
    }

    checkString(string){
        const sentencePart = this.badge;
        return string.includes(sentencePart);
    }

    async call(reqData){ 
        console.log("reqData", reqData);
        let data = {
            data: {
                owner: reqData.owner,
                repo: reqData.repo,
                query: reqData.query,
                accessToken: reqData.accessToken,
            }
        }

        let issues = await axios.post(`${this.baseUrl}/api/github/list-of-issues`, data);
        let comments;
        let result = [];
        if (issues?.data?.data?.length > 0) {
            issues.data.data.map(async (issue) => {
                // get replies for each comment
                let reqDataForGetAllIssueComments = {
                  data: {
                    owner: reqData.owner,
                    repo: reqData.repo,
                    issue_number: issue.id,
                    accessToken: reqData.accessToken,
                  }
                }
                let getAllIssueComments = await axios.post(`${this.baseUrl}/api/github/list-of-issues-comments`, reqDataForGetAllIssueComments);
                comments = getAllIssueComments.data.data;

                comments.map(async comment =>{
                    if(!this.checkString(comment.body)){
                        let openAiCaller = new OpenAiCaller();
                        let reqDataForTranslate = {
                            data: {
                                text: comment.body,
                                language: reqData.language,
                                openAiSecret: reqData.openAiSecret
                            }
                        }
                        let translate = await openAiCaller.translateContent(reqDataForTranslate.data.language, reqDataForTranslate.data.text);

                        let resultString = comment.body + ' \n ' +'  **Translated to**'+'\n'+' > '+translate.data.data + '\n \n '+ this.badge;
                        
                        
                        let reqDataForUpdateIssueComment = {
                            data: {
                                owner: reqData.owner,
                                repo: reqData.repo,
                                comment_id: comment.id,
                                body: resultString,
                                accessToken: reqData.accessToken
                            }
                        }
                        let updateIssueComment = await axios.post(`${this.baseUrl}/api/github/update-issue-comment`, reqDataForUpdateIssueComment);
                        result.push(updateIssueComment); 
                        
                    }
                });
            });
        }
        console.log("comments result:", result);
    }


}

export default FetchIssuesData;

import axios from "axios";
import OpenAiCaller from "../../Translate/openAiCaller.js";
import WriteTranslatedCommentToPr from "../WritePrData/writeTranslatedCommentToPr.js";
import WriteTranslatedReply from "../WritePrData/writeTranslatedReply.js";

class FetchPrData {
  constructor() {
    this.baseUrl = process.env.BASE_URL || "http://localhost:3000";
    this.language = process.env.LANGUAGE || "en";
    this.commentIds = [];
    this.replyIds = [];
  }

  async call(owner, repo, query) {
    let reqDataForGetAllPr = {
      data: {
        owner: owner,
        repo: repo,
        query: {
          state: query.state
        }
      }
    }

    let getAllPrs = await axios.post(`${this.baseUrl}/api/github/prs`, reqDataForGetAllPr);

    // For all the open prs, get the comments
    // And then get also get all the replies for each comment
    // and save the ids / node of the replies 
    // IF: Node ID is already not available and field 'translated' is false
    // THEN: Translate the comment and save the translated text in the db
    // call the service for the translation
    // Write Service for the comment and reply translation
    // return the saved data, language, and the translated text
    let comments;

    getAllPrs.data.data.map(async (pr) => {
      let reqDataForGetAllPrComments = {
        data: {
          owner: owner,
          repo: repo,
          pr_number: pr.number
        }
      }
      let getAllPrComments = await axios.post(`${this.baseUrl}/api/github/pr-comments`, reqDataForGetAllPrComments);
      comments = getAllPrComments.data.data;
    });
    
    console.log("comments", comments);
    if(comments && comments.length > 0){
      
      comments.map(async (comment) => {
        // get replies for each comment
        let reqDataForGetAllPrReplies = {
          data: {
            owner: owner,
            repo: repo,
            comment_id: comment.id
          }
        }
        let getAllPrReplies = await axios.post(`${this.baseUrl}/api/github/pr-replies`, reqDataForGetAllPrReplies);
        let replies = getAllPrReplies.data.data;
        
        // save the replies in the db
        replies.map(async (reply) => {
          // TODO: Check and save the replies in the db
          let openAiCaller = new OpenAiCaller();
          let getTranslatedData = openAiCaller.translateContent(this.language, reply.body);

          // TODO: write the translated data in the db
          // WriteService for the reply translation or comments
          let reqDataForWriteTranslatedReply = {
            data: {
              owner: owner,
              repo: repo,
              pr_number: pr.number,
              reply_id: reply.id,
              translated_text: getTranslatedData.data.data.translated_text
            }
          }

          let writeTranslatedReply = new WriteTranslatedReply();
          let result = writeTranslatedReply.call(reqDataForWriteTranslatedReply);
          // TODO: save the result to DB.
          this.replyIds.push(reply.id);
        });

        let reqDataForWriteTranslatedData = {
          data: {
            owner: owner,
            repo: repo,
            pr_number: pr.number,
            comment_id: comment.id,
            reply_id: reply.id,
            translated_text: getTranslatedData.data.data.translated_text
          }
        }

        let writeTranslatedCommentToPr = new WriteTranslatedCommentToPr();
        let result = writeTranslatedCommentToPr.call(reqDataForWriteTranslatedData);
        // TODO: save result in the db
        this.commentIds.push(reply.id);
      });
    }

    return {
      data: "success",
      commentIds: this.commentIds,
      replyIds: this.replyIds
    }
  }
}

export default FetchPrData;

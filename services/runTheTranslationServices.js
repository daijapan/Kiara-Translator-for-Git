import Setting from "../models/setting.js";
import TranslationAction from "../models/translationAction.js";
import FetchIssuesData from '../services/Github/FetchPrData/fetchIssuesData.js';
import { setNewTime } from "../helpers/utils.js";

const runJob = () => {
    setInterval(() => {
        console.log('runTheTranslationServices');
        // get the translation actions
        // for each translation action
        // check the next run at time
        // if the next run at time is less than the current time
        // then run the translation action
        // update the next run at time

        TranslationAction.findAll({ include: Setting }).then(translationActions => {
                translationActions.forEach(translationAction => {
                    let nextRunAt = new Date(translationAction.nextRun);
                    let currentTime = new Date();                    

                    if (nextRunAt < currentTime || translationAction.nextRun === null) {
                        // run the translation action
                        console.log('running the translation action');
                        let issuesService = new FetchIssuesData();
                        // setting run
                        let settingRepoOwner = translationAction.Setting.repoOwner;
                        let settingRepoName = translationAction.Setting.repoName;
                        let settingAccessToken = translationAction.Setting.accessToken;
                        let settingOpenAiSecret = translationAction.Setting.openAiSecret;
                        
                        // call the service
                        issuesService.call({ owner: settingRepoOwner, 
                                             repo: settingRepoName,
                                             accessToken: settingAccessToken,
                                             openAiSecret: settingOpenAiSecret,
                                             language: translationAction.language,
                                             query: { state: 'open' } });
                        
                        // run the translation action
                        //update the next run at time
                        translationAction.nextRun = setNewTime(translationAction.delay);                    
                        translationAction.save();
                    }
                }
            )
        }).catch(err => {
            console.log(err);
        });
    }, 1000);
}


export const runTheTranslationServices = async () => {
    console.log("------------------------------------------");
    try{        
        runJob();
    } catch (error) {
        console.error(error);
        runJob();
    }
}


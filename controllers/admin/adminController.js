import Setting from '../../models/setting.js';
import TranslationAction from '../../models/translationAction.js';
import { seedSettings } from '../../seeds/settings.js';
import { seedTranslationAction } from '../../seeds/translationActions.js';


export const getDashboard =async (req, res) => {
    let settingsCount = await Setting.count();
    let actionsCount = await TranslationAction.count();
    let languagesCount = await TranslationAction.count({ distinct: true, col: 'language' });
    res.render('admin/dashboard', { title: 'Dashboard', settingsCount, actionsCount, languagesCount });
}

export const getSettingList = async (req, res) => {
    let settings = await Setting.findAll();
    res.render('admin/settings/index', { title: 'Settings', settings });
}

export const getSetting = (req, res) => {
    res.render('admin/settings/new', { title: 'Settings', errors: [] });
}

// create a new setting
// param: 
// req.body.title
// req.body.repoName
// req.body.repoOwner
// req.body.accessToken
// req.body.openAiSecret

export const createSetting = async (req, res) => {
    if(!req.body.title || !req.body.repoName || !req.body.repoOwner || !req.body.accessToken || !req.body.openAiSecret){
        res.render('admin/settings/new', { title: 'Settings', error: "Please fill in all the fields" });
    }
    let { title, repoName, repoOwner, accessToken, openAiSecret } = req.body;
    
    try {
        let setting = await Setting.create({
            title: title,
            repoName: repoName,
            repoOwner: repoOwner,
            accessToken: accessToken,
            openAiSecret: openAiSecret
        });
        res.render('admin/settings', { title: 'Settings', setting: setting });
    }catch{
        res.render('admin/settings/new', { title: 'Settings', errors: ["Could not create the Setting."] });
    }
}

//---------------------------------------------------------------------------------------------
// ACTIONS
//---------------------------------------------------------------------------------------------

// New form for the action

export const getAction = async (req, res) => {
    let actions = await TranslationAction.findAll({ include: Setting });
    let settings = await Setting.findAll();
    res.render('admin/actions/new', { title: 'Actions', actions, settings });
}

export const getActionList = async (req, res) => {
    let actions = await TranslationAction.findAll({ include: Setting });
    
    res.render('admin/actions/index', { title: 'Actions', actions });
}

// create a new action
// param:
// req.body.title
// req.body.settingId

export const createAction = async (req, res) => {
    if(!req.body.title || !req.body.settingId || !req.body.language || !req.body.delay){
        res.render('admin/actions/new', { title: 'Actions', error: "Please fill in all the fields" });
    }
    let { title, settingId, language, delay } = req.body;    
    console.log("body",req.body)
    
    try {
        await TranslationAction.create({
            title: title,
            settingId: settingId,
            language: language,
            delay: delay,
        });

        let actions = await TranslationAction.findAll({ include: Setting });
        res.render('admin/actions/index', { actions });
    }catch{
        res.render('admin/actions/new', { title: 'Actions', errors: ["Could not create the Action."] });
    }
}


// Responsible for the Syncing of the database
// With Model Attributes.
// Should be ran after any Migration Changes happened into the model schema.
export const postSync = async (req, res) => {
    console.log("Syncing the database")
    try {
        Setting.sync({ alter: true });
        TranslationAction.sync({ alter: true });
        let settings = await Setting.findAll();
        let actions = await TranslationAction.findAll();
        res.status(200).json({ data: "Updated the schema successfully", results: { actions, settings } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// API endpoint to enlist the seeders file function from /seed/**.js 
// and run the function to seed the database.
// For quicker demonstration.
export const postSeed = async (req, res) => {
    try {
        let settings = await seedSettings();
        let actions = await seedTranslationAction();
        res.status(200).json({data: "Seeded the database successfully", results: { actions, settings }});
    }catch{
        res.status(500).json({ error: error.message });
    }
}
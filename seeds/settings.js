import Setting from "../models/setting.js";

// Will Seed the database once called

export const seedSettings = async (req, res) => {
    try {
        let setting = await Setting.create({
                            title: 'Some Name Titile',
                            repoName: 'repoName',
                            repoOwner: 'repoOwner',
                            accessToken: 'accessToken',
                            openAiSecret: 'openAiSecret',
                            
                    })

        return setting;
    }
    catch (error) {
        console.error(error.message);
    }
}
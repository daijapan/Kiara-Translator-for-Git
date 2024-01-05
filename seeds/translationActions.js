import TranslationAction from "../models/translationAction.js";
import Setting from "../models/setting.js";
import { setNewTime } from "../helpers/utils.js";
// Will Seed the database once called

export const seedTranslationAction = async (req, res) => {
    const setting = await Setting.findOne({ where: { id: 1 } });

    try {
        if (!setting) {
            throw new Error('Setting not found!');
        }

        let action = await TranslationAction.create({            
                title: 'Some Name Titile',
                settingId: setting.id,
                language: 'Japanese',
                delay: 10,
                nextRun: setNewTime(10),             
        })
        return action;
    }
    catch (error) {
        console.error(error.message);
    }
}
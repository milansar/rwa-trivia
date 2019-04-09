import { Question, QuestionsConstants, UserConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';
import { Utils } from './utils';

export class QuestionBifurcation {
    static basePath = `/${QuestionsConstants.QUESTION}`;
    static profileImagePath = UserConstants.AVATAR;
    static originalImagePath = UserConstants.ORIGINAL;
    static async getQuestionList(collectionName) {
        try {
            const questions: Question[] = await QuestionService.getQuestion(collectionName);
            const promises = [];
            for (const questionObj of questions) {
                if (questionObj.bulkUploadId) {
                    questionObj[QuestionsConstants.SOURCE] = QuestionsConstants.BULK_QUESTION;
                } else {
                    questionObj[QuestionsConstants.SOURCE] = QuestionsConstants.QUESTION;
                }
                promises.push(QuestionService.updateQuestion(collectionName, questionObj));
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async uploadQuestionImage(question: any): Promise<any> {

        const filePath =
            `${QuestionBifurcation.basePath}/${question.userId}/${question.id}/${question.questionImage}`;
        question.croppedImageUrl = question.croppedImageUrl.replace(/^data:image\/\w+;base64,/, '');
        const bufferStream = new Buffer(question.croppedImageUrl, GeneralConstants.BASE64);

        try {

            await QuestionService.uploadQuestionImage(bufferStream, question.imageType, filePath);
            return question;

        } catch (error) {
            return Utils.throwError(error);
        }

    }
}

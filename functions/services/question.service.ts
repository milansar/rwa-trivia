import { CollectionConstants, GeneralConstants, Question, QuestionsConstants, UserConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class QuestionService {

    private static fireStoreClient = admin.firestore();
    private static QC = CollectionConstants.QUESTIONS;
    private static bucket: any = Utils.getFireStorageBucket(admin);

    /**
     * getAllQuestions
     * return questions
     */
    static async getAllQuestions(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(QuestionService.QC).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getQuestionById
     * return question
     */
    static async getQuestionById(questionId): Promise<any> {
        try {
            const questionResult = await QuestionService.fireStoreClient
                .doc(`/${QuestionService.QC}/${questionId}`)
                .get();
            return Question.getViewModelFromDb(questionResult.data());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAllUnpublishedQuestions
     * return questions
     */
    static async getQuestion(collectionName): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(`${collectionName}`).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setQuestion
     * return ref
     */
    static async updateQuestion(collectionName: string, question: any): Promise<any> {
        try {
            return await QuestionService.fireStoreClient
                .doc(`/${collectionName}/${question.id}`)
                .set(question);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    /**
     * getUserProfileImage
     * return stream;
     */
    static async getQuestionImage(userId: string, questionId: string): Promise<any> {
        try {
            const question: Question = await QuestionService.getQuestionById(questionId);
            return await QuestionService.generateQuestionImage(userId, question.questionImage, questionId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * generateQuestionImage
     * return stream
     */
    static async generateQuestionImage(userId: string, questionImage: string, questionId: string ): Promise<string> {
        const fileName =  `${QuestionsConstants.QUESTION}/${userId}/${questionId}/${questionImage}`;

        const file = QuestionService.bucket.file(fileName);
        try {
            const streamData = await file.download();
            return streamData[0];
        } catch (error) {
            return Utils.throwError(error);
        }
    }

        /**
     * uploadProfileImage
     * return status
    */
   static async uploadQuestionImage(data: any, mimeType: any, filePath: string, ): Promise<any> {
    const stream = require('stream');

    const file = QuestionService.bucket.file(filePath);
    const dataStream = new stream.PassThrough();
    dataStream.push(data);
    dataStream.push(null);
    mimeType = (mimeType) ? mimeType : dataStream.mimetype;

    return new Promise((resolve, reject) => {
        dataStream.pipe(file.createWriteStream({
            metadata: {
                contentType: mimeType,
                metadata: {
                    custom: UserConstants.META_DATA
                }
            }
        }))
            .on(GeneralConstants.ERROR, (error) => {
                Utils.throwError(error);
            })
            .on(GeneralConstants.FINISH, () => {
                resolve(UserConstants.UPLOAD_FINISHED);
            });
    });
}

}

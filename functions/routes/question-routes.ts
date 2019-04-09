

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class QuestionRoutes {

    public questionRoutes: any;

    constructor() {

        this.questionRoutes = express.Router();

        //  '/day/:nextQ'
        this.questionRoutes.get(`/${RoutesConstants.DAY}/:${RoutesConstants.NEXT_Q}`,
            QuestionController.getQuestionOfDay);

        //  '/next/:gameId'
        this.questionRoutes.post(`/${RoutesConstants.NEXT}/:${RoutesConstants.GAME_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getNextQuestion);

        //  'uploadImage/:questionId'
        this.questionRoutes.post(`/${RoutesConstants.UPLOAD_IMAGE}/:${RoutesConstants.QUESTION_ID}`,
        AuthMiddleware.authorizedOnly, QuestionController.uploadQuestionImage);

        //  'image/:userId/:questionId/:imageName'
        this.questionRoutes.get(
            `/${RoutesConstants.IMAGE}/:${RoutesConstants.USER_ID}/:${RoutesConstants.QUESTION_ID}/:${RoutesConstants.IMAGE_NAME}`,
            QuestionController.getQuestionImages);

        //  '/:start/:size'
        this.questionRoutes.post(`/:${RoutesConstants.START}/:${RoutesConstants.SIZE}`,
            AuthMiddleware.adminOnly, QuestionController.getQuestions);

        //  '/:questionId'
        this.questionRoutes.post(`/:${RoutesConstants.QUESTION_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getUpdatedQuestion);


    }
}

export default new QuestionRoutes().questionRoutes;


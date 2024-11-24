import express from 'express';
import { createContactController, getAllContactsController } from '../controllers/contact.controller.js';

const contactRouter = express.Router();

// Định tuyến yêu cầu POST tới API liên hệ
contactRouter.post('/', createContactController);
contactRouter.get('/getall', getAllContactsController);

export default contactRouter;

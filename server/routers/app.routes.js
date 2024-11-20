import express from 'express';
import { csrfProtection } from '../middlewares/csrufToken.middleware.js';
const router = express.Router();

router.get('/', (req, res) => res.send('Hello, world!'));

router.get('/form', csrfProtection, (req, res) => {
  res.send({ csrfToken: req.csrfToken() });
});

export default router;

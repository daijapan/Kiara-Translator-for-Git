import express from 'express';
const router = express.Router();
import { signIn,
         getListOfRepos,
         getListOfPRs,
         getListOfIssues,
         getListOfIssueComments,
         updateIssueComment,
         writeIssueComment,
         getPR,
         getListOfPRComments,
         writePRComment,
         createPRReviewReply,
         } from '../controllers/githubController.js';

// Define routes for the Github Application
router.get('/signin', signIn);
router.post('/list-of-repos', getListOfRepos);
router.post('/list-of-prs', getListOfPRs);
router.post('/list-of-issues', getListOfIssues);
router.post('/list-of-issues-comments', getListOfIssueComments);
router.post('/update-issue-comment', updateIssueComment);
router.post('/write-issue-comment', writeIssueComment);
router.post('/prs', getListOfPRs);
router.post('/issues', getListOfIssues);
router.post('/pr', getPR);
router.post('/pr-comments', getListOfPRComments);
router.post('/write-pr-comment', writePRComment);
router.post('/create-pr-review-reply', createPRReviewReply);
export default router;

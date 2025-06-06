import express from 'express';
import { registerUser,CreateGroup,getMessages ,getUsers, getUserGroups,loginUser} from '../controllers/index.js';


const router = express.Router();

// User routes
router.post('/register', registerUser);
router.get('/users', getUsers);
router.get('/user/groups', getUserGroups);
router.post('/login', loginUser);
// Group routes
router.post('/groups', CreateGroup);

// Message routes
router.get('/messages', getMessages);

export default router;
const {Router} = require('express')
// const router = express.Router();
const { signUp, login, logOut, getUsers, getAllFriends, deleteAccount, blockAndUnblockFriend } = require('../controller/userController')
const authorization = require("../middleware/authorization")

const router = Router()

router.post('/signup', signUp)

router.post('/login', login)

router.post('/logout', authorization, logOut);

router.get('/get-users', authorization, getUsers);

router.get('/get-friends', authorization, getAllFriends);

router.delete('/deactivate-account', authorization, deleteAccount);

router.patch('/block-friend/:id', authorization, blockAndUnblockFriend);

module.exports = router
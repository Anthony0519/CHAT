const {Router} = require('express')
// const router = express.Router();
const { addFriends, acceptRequest, getAllRequest, getAllUsersRequest, declineRequest } = require('../controller/requestController')
const authorization = require("../middleware/authorization")

const router = Router()

router.post('/friend-request/:id', authorization, addFriends)

router.put('/accept-request/:id', authorization, acceptRequest)

router.get('/get-users-request', authorization, getAllUsersRequest);

router.get('/get-request', authorization, getAllRequest);

router.delete('/decline-request/:id', authorization, declineRequest)

module.exports = router
const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    let obj = {
        "notes": "Today is great!!",
        num: 36
    }

    res.json(obj);
})

module.exports = router;
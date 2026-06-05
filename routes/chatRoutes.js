import express from "express";

const router = express.Router();


/*
 Chat API
 POST /api/chat/ask
*/

router.post("/ask", (req, res) => {

    const { message } = req.body;

    res.json({

        userMessage: message,

        aiResponse:
        "AI response will appear here. Future RAG integration ready 🚀"

    });

});


/*
 Chat History API
 GET /api/chat/history
*/

router.get("/history", (req,res)=>{

    res.json({

        message:
        "Conversation history fetched successfully",

        conversations: []

    });

});


export default router;
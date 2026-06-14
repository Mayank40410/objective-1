import express from "express";

const router = express.Router();


// Local LLM Ollama Chat API
router.post("/ask", async (req, res) => {

    try {

        const { message } = req.body;


        if (!message) {
            return res.status(400).json({
                error:"Message required"
            });
        }


        const response = await fetch(
            "http://localhost:11434/api/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    model:"llama3.2:3b",

                    messages:[
                        {
                            role:"user",
                            content:message
                        }
                    ],

                    stream:false

                })
            }
        );


        const data = await response.json();


        res.json({

            aiResponse:data.message.content

        });


    }
    catch(error){

        console.log(
            "Ollama Error:",
            error.message
        );


        res.json({

            aiResponse:
            "Local AI is not running. Start Ollama first."

        });

    }

});


export default router;
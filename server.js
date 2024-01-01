const mongoose = require("mongoose");
const express = require("express")
const PORT = 3000
const app = express()
mongoose.connect("mongodb+srv://hirendhola:kV3x1tGiHKyeM0y0@codex.mrdvtif.mongodb.net/newuser")

app.use(express.json())
const User = mongoose.model('Users', {
    name: String,
    email: String,
    password: String
});
async function checkUserValidationPOST(req, res, next) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            msg: "Please provide all required fields: name, email, and password"
        });
    }
    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                msg: "Email already exists"
            });
        }

        // If the email is unique, proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle any potential errors
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
}
async function checkUserValidationGET(req, res, next) {
    const { name, email, password } = req.body;
    if ( !email || !password) {
        return res.status(400).json({
            msg: "Please provide all required fields: name, email, and password"
        });
    }
    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            next();
        }else{
            return res.status(400).json({
                msg: "Email not exists"
            });
        }

        // If the email is unique, proceed to the next middleware or route handler
        
    } catch (error) {
        // Handle any potential errors
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
}

app.get("/login",checkUserValidationGET, (req, res) => {
    const { email, password } = req.body;
    res.json({
        msg: "You logged in"
    })

})

app.post("/signup", checkUserValidationPOST, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                msg: "Email already exists"
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();
        res.json({
            msg: "Registration successful!"
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log('Server running on port 3000');
});

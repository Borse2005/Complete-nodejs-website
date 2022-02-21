import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import createError from "http-errors";
import path from "path";
import routes from "./routes";
import FeedbackService from "./services/FeedbackService";
import SpeakerService from "./services/SpeakerService";

const app = express();
const PORT = 3000;

// Cookie Session 
app.set('trust proxy', 1);

app.use(cookieSession({
    name: "Darshan Borse",
    keys: ['ashfaksdhjk', "jash;AHJ"]
}));

// Body parser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// Site Name 
app.locals.siteName = "Practise Site";

// Services 
const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService("./data/speakers.json");

// Speaker Name 
app.use(async (req, res, next) => {
    try {
        const name = await speakerService.getNames();
        res.locals.speakerName = name;
        return next();
    } catch (err) {
       return next(err);
    }
});

// EJS set 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// Image 
app.use(express.static('./static'));

// Routes
routes(app, {
    speakerService,
    feedbackService,
});

// Route does not match 
app.use((req, res, next) => {
    const token = createError(404, 'File not found..');
    return res.render('error', { status: token.statusCode, message: token.message });
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    const status = err.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
});

// Te rminal Port 
app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}`);
});

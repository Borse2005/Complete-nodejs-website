import { check, validationResult } from "express-validator";

const validations = [
    check('name').trim().isLength({ min: 3 }).escape().withMessage('A name is required.'),
    check('email').trim().isEmail().normalizeEmail().withMessage(`A valid emial address is required.`),
    check('title').trim().isLength({ min: 3 }).escape().withMessage('A title is required.'),
    check('message').trim().isLength({ min: 5 }).escape().withMessage('A meassage is required.'),
]

const feedbackRoute = (app, params) => {
    // Data 
    const feedbackService = params;

    // Get method 
    app.get('/feedback', async (req, res, next) => {
        try {
            const feedback = await feedbackService.getList();
            const errors = req.session.feedback ? req.session.feedback.errors : false;
            const successMessage = req.session.feedback ? req.session.feedback.message : false;
            req.session.feedback = {};
            return res.render("layout/app.ejs", { pageTitle: "Feedback", templete: "feedback", feedback, errors, successMessage });
        } catch (error) {
            return next(error);
        }
    });

    // Specific speaker 
    app.post('/feedback', validations, async (req, res, next) => {
        const errors = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                req.session.feedback = {
                    errors: errors.array(),
                }
                return res.redirect('/feedback');
            }
            const { name, email, title, message } = req.body;
            await feedbackService.addEntry(name, email, title, message);
            req.session.feedback = {
                message: "Thanks you for your feedback!",
            }
            return res.redirect('/feedback');
        } catch (error) {
            return next(error);
        }
        
    });

    // Api Route
    app.post('/feedback/api', validations, async (req, res, next) => {
        const errors = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }
            const { name, email, title, message } = req.body;
            await feedbackService.addEntry(name, email, title, message);
            const feedback = await feedbackService.getList();
            return res.json({feedback, successMessage: "Thanks you for your feedback!"});
        } catch (error) {
            return next(error);
        }
    });
}

export default feedbackRoute;
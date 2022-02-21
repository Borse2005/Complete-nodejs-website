import feedbackRoute from "./feedback";
import speakerRoute from "./speakers";

const routes = (app, params) => {
        const { speakerService } =  params;
        // Get method 
        app.get('/', async (req, res, next) => {
            try {
                const allAtwork = await speakerService.getAllArtwork();
                const topSpeaker = await speakerService.getList();
                return res.render("layout/app.ejs", { pageTitle: "Welcome", templete: "index", topSpeaker , allAtwork });
            } catch (error) {
                return next(error);
            }
        });

        // Speaker routes 
        speakerRoute(app, params.speakerService);

        // Feedback routes 
        feedbackRoute(app, params.feedbackService);
}

export default routes;
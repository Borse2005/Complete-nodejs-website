const speakerRoute = (app, params) => {
    const speakerService = params;

    // Get method 
    app.get('/speakers', async (req, res, next) => {
        try {
            const speakers = await speakerService.getList();
            return res.render("layout/app.ejs", { pageTitle: "Speakers", templete: "speakers", speakers });
        } catch (error) {
            return next(error);
        }
    });

    // Specific speaker 
    app.get('/speakers/:shortName', async (req, res, next) => {
        try {
            const speaker = await speakerService.getSpeaker(req.params.shortName);
            const atwork = await speakerService.getArtworkForSpeaker(req.params.shortName);
            return res.render("layout/app.ejs", { pageTitle: "Speakers", templete: "speakers-details", speaker, atwork });
        } catch (error) {
            return next(error);
        }
    });
}

export default speakerRoute;
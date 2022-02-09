class IndexController {
    async HomePage(req, res) {
        try {
            res.render('admin/', {
                title: 'Админка',
                layout: 'admin',
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new IndexController();
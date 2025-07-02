// Catches 404 routes
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        errors: [],
        data: null,
    });
}

export default notFoundHandler;
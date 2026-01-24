import Type from '../models/type.model.js';

export const getTypesByCategory = async (req, res) => {
    try {
        const {  category } = req.params;
        // console.log("==========================",category);
        const types = await Type.find({ category: category.toLowerCase()});
        // console.log(types);
        if (!types) {
            return res.status(404).json({ message: 'No types found for this category' });
        }
        res.status(200).json(types);
    } catch (error) {
        console.error("Error in getTypesByCategory controller: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

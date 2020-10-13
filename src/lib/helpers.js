const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (contraseña) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contraseña, salt);
    return hash;
};

helpers.comparePassword = async(contraseña, savedPassword) => {
    try {
        return await bcrypt.compare(contraseña, savedPassword);
    } catch (error) {
        console.log(error);
    }
};

module.exports = helpers;
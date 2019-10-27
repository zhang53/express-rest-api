const bcrypt = require('bcryptjs')

module.exports = [
    {
        model: 'user',
        documents: [
            {
                name: 'admin',
                email: 'admin@myapp.com',
                password: bcrypt.hashSync('12345678'),
                roles: ['admin']
            }
        ]
    }
];
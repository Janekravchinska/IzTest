const faker = require('faker');


const generateList = (n) => {
    const result = []
    for (i = 0; i <= n; i++) {
        result.push({
            id: i + 1,
            name: faker.name.findName(),
            email: faker.internet.email(),
            funds: faker.finance.amount(),
            city: faker.address.city(),
            phone: faker.phone.phoneNumber()
        })
    }
    return result;
}

module.exports = generateList;
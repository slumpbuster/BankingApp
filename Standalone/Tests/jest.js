const {app} = require('../index');
const supertest = require('supertest');
const request = supertest(app);
const faker = require('faker');
const testLogin = require('./puppeteer');

const createUser = () => {
  const uid           = faker.datatype.uuid();
  const firstName     = faker.name.firstName();
  const lastName      = faker.name.lastName();
  const name          = faker.name.findName(firstName, lastName);
  const email         = faker.internet.email(firstName, lastName);
  const password      = faker.internet.password();
  const phone         = faker.phone.phoneNumber();
  const streetaddress = faker.address.streetAddress();
  const citystatezip  = faker.address.city() + ", " + faker.address.stateAbbr() + " "  + faker.address.zipCode();
  const date          = faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)"));
  const dob           = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
  const savings       = faker.datatype.number({min: 0, max: 1});
  const checking       = faker.datatype.number({min: 0, max: 1});

  return {
      uid,
      name,
      dob,
      email,
      password,
      phone,
      streetaddress,
      citystatezip,
      savings,
      checking
  };
}
const user = createUser();

const testCreateUser = () => {
  it('populate data', async () => {
    try {
      const url = `/account/create/${user.uid}/${user.name}/${user.email}/${user.password}/${user.dob}/${user.phone}/${user.streetaddress}/${user.citystatezip}/${user.savings}/${user.checking}`;
      await request.post(url);
    } catch (error) {}
  })
  it('verify data', async () => {
    try {
      const data = await request.get(`/account/findOne/${user.email}`);
      expect(data.body.some(e => e.user === user.email)).toBeTruthy();
    } catch (error) {}
  })

  var server = app.listen(5000, function(){
    console.log('Running on port 5000');
    testLogin();
  });
  
  afterAll(async () => {
    await server.close();
  });
}

module.exports = testCreateUser;
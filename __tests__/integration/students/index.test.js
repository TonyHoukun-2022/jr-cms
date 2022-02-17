const supertest = require("supertest");
const app = require("../../../src/app");
const Student = require("../../../src/models/student");
const mongoose = require("mongoose");
// const { generateToken } = require('../../../src/utils/jwt')

const request = supertest(app);

describe("/students", () => {
  //hooks => life cycle methods => middleware
  //在跑测试之前，建立好数据库连接
  beforeAll(async () => {
    // browser => window
    await mongoose.connect(global.__MONGO_URI__);
  });

  //测试结束后，断开database
  afterAll(async () => {
    await mongoose.connection.close();
  });

    describe("Create student", () => {
      //每次运行create stu 测试前，把数据清空
    beforeEach(async () => {
      await Student.deleteMany({});
    });

    it("should save the student if request is valid", async () => {
      const body = {
        firstName: "xxx",
        lastName: "yyy",
        email: "xxx@example.com",
      };

      // const token = generateToken({}) //然后带入token 进入 测试

      const response = await request.post("/v1/students").send(body);

      expect(response.statusCode).toBe(201);

      const student = await Student.findOne(body).exec();
      //Student.findById(response.body._id) //或者这个

      expect(student).toBeTruthy();

      //check response contains student id
      //check response format
      /**
       * {
       *  data: {}
       * }
       */
    });
  });

  //测试错误
  //map
  // xxx | xxx | xxx
  //val | val | val
  it.each`
    field          | value
    ${"firstName"} | ${undefined}
    ${"firstName"} | ${"a"}
    ${"lastName"}  | ${"12345678941"}
    ${"email"}     | ${"a"}
  `("should return 400 when $field is $value", async ({ field, value }) => {
    const body = {
      firstName: "xxx",
      lastName: "yyy",
      email: "xxx@example.com",
    };

    const invalidBody = {
      ...body,
      [field]: value,
    };

    const res = await request.post("/v1/students").send(invalidBody);

    expect(res.statusCode).toBe(400);
  });
});

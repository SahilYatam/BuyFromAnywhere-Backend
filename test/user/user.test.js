import { expect, jest, test } from '@jest/globals';

jest.mock("../../src/user/models/user.model.js", () => ({
    userModel: jest.fn(),
}))

jest.mock("../../src/shared/utils/helperFunctions.js", () => ({
    helperFun: {
        hashPassword: jest.fn(),
        comparePassword: jest.fn()
    }
}))


import { userServiceFactory } from "../../src/user/services/user.service.js";
import { userModel } from "../../src/user/models/user.model.js";
import  {helperFun}  from "../../src/shared/utils/helperFunctions.js";
import { ApiError } from "../../src/shared/utils/ApiError.js";


const fakeConnection = {
    model: jest.fn()
}

fakeConnection.model.mockImplementation((modelName) => {
     if (modelName === "User") return fakeUserModel;
    return {}
})

const fakeUserModel = {
  findOne: jest.fn(),
  create: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    userModel.mockReturnValue(fakeUserModel);
})

// Signup testing
test("should throw error if user already exists", async () => {
    fakeUserModel.findOne.mockReturnValue({_id: "123", email: "test@example.com"});

    const userService = userServiceFactory(fakeConnection);
    const input = {email: "test@example.com", password: "Password123"};

    await expect(userService.signup(input)).rejects.toThrow(ApiError);
    expect(fakeUserModel.findOne).toHaveBeenCalledWith({email: "test@example.com"})
});


test("should create user if email does not exist", async () => {
  const input = {
    name: "tony",
    email: "tony@example.com",
    password: "Tony12345",
    region: "India",
    currency: "INR"
  };

  const fakeCreatedUser = {
    _id: "12345",
    name: "tony",
    email: "tony@example.com",
    password: "hashed-password",
    region: "India",
    currency: "INR"
  };

  const publicUser = {
    id: "12345",
    name: "tony",
    email: "tony@example.com",
    region: "India",
    currency: "INR"
  };

  // Mock setup
  fakeUserModel.findOne.mockResolvedValue(null);
  fakeUserModel.create.mockResolvedValue(fakeCreatedUser);
  helperFun.hashPassword.mockResolvedValue("hashed-password");

  // Call service
  const service = userServiceFactory(fakeConnection);
  const result = await service.signup(input);

  // Assertions
  expect(fakeUserModel.findOne).toHaveBeenCalledWith({ email: input.email.toLowerCase() });
  expect(helperFun.hashPassword).toHaveBeenCalledWith(input.password);
  expect(fakeUserModel.create).toHaveBeenCalledWith({
    ...input,
    email: input.email.toLowerCase(),
    password: "hashed-password"
  });

  // Final result check
  expect(result).toEqual(publicUser);
});

// Login testing
test("comapare the email & password", async() => {
    const input = {email: "tony@example.com", password: "Tony12345"}

    const fakeUserFromDb = {
        _id: "12345",
        name: "tony",
        email: "tony@example.com",
        password: "hashed-password"
    }

    const expectedOutput = {
        id: "12345",
        name: "tony",
        email: "tony@example.com",
    };

    // Mocking
    fakeUserModel.findOne.mockResolvedValue(fakeUserFromDb);
    helperFun.comparePassword.mockResolvedValue(true);

    const userService = userServiceFactory(fakeConnection);
    const result = await userService.login(input);

    // Assertions
    expect(fakeUserModel.findOne).toHaveBeenCalledWith({
        email: input.email.toLowerCase()
    });

    expect(helperFun.comparePassword).toHaveBeenCalledWith(
        input.password,
        fakeUserFromDb.password
    );

    expect(result).toEqual(expectedOutput)

})

test("should throw error if email is not found", async() => {
    const input = {email: "test@example.com", password: "Password123"};

    fakeUserModel.findOne.mockResolvedValue(null);
    const userService = userServiceFactory(fakeConnection);

    await expect(userService.login(input)).rejects.toThrow("No account found with the provided email address")
})

test("should throw error if password is incorrect", async() => {
    const input = {email: "test@example.com", password: "Password123"};

    const fakeUserFromDb = {
        _id: "12345",
        name: "tony",
        email: "tony@example.com",
        password: "hashed-password"
    };

    fakeUserModel.findOne.mockResolvedValue(fakeUserFromDb);

    helperFun.comparePassword.mockResolvedValue(false);

    const userService = userServiceFactory(fakeConnection);

    await expect(userService.login(input)).rejects.toThrow("The provided password is incorrect.")
})


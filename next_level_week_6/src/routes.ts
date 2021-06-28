import { Router } from "express";
import { CreateUserController } from "./controllers/CreateUserController"
import { CreateTagController } from "./controllers/CreateTagController";
import { CreateComplimentController } from "./controllers/CreateComplimentController";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { ListUserSendComplimentsController } from "./controllers/ListUserSendComplimentsController";
import { ListUserReceiveComplimentsController } from "./controllers/ListUserReceiveComplimentsController";
import { ListTagsController } from "./controllers/ListTagsController";
import { ListUsersController } from "./controllers/ListUsersController";
import { DeleteComplimentController } from "./controllers/DeleteComplimentController";
import { UpdateUserController } from "./controllers/UpdateUserController";
import { UpdateUserPasswordController } from "./controllers/UpdateUserPasswordController";
import { DeleteUserController } from "./controllers/DeleteUserController";
import { DeleteTagController } from "./controllers/DeleteTagController";
import { ensureAdmin } from "./middlewares/ensureAdmin";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();

const createUserController = new CreateUserController();
const createTagController = new CreateTagController();
const authenticateUserController = new AuthenticateUserController();
const createComplimentController = new CreateComplimentController();
const listUserSendComplimentsController = new ListUserSendComplimentsController()
const listUserReceiveComplimentsController = new ListUserReceiveComplimentsController()
const deleteComplimentController = new DeleteComplimentController()
const updateUserController = new UpdateUserController()
const updateUserPasswordController = new UpdateUserPasswordController()
const deleteUserController = new DeleteUserController()
const listTagsController = new ListTagsController()
const listUsersController = new ListUsersController()
const deleteTagController = new DeleteTagController()

// Authentication
router.post("/login", authenticateUserController.handle)

// Users
router.post("/users", createUserController.handle);
router.put("/users", ensureAuthenticated, ensureAdmin, updateUserController.handle);
router.get("/users", ensureAuthenticated, listUsersController.handle);
router.delete("/users/:id", ensureAuthenticated, ensureAdmin, deleteUserController.handle);
router.get("/users/compliments/send", ensureAuthenticated, listUserSendComplimentsController.handle)
router.get("/users/compliments/receive", ensureAuthenticated, listUserReceiveComplimentsController.handle)
router.patch("/users/password", ensureAuthenticated, updateUserPasswordController.handle)

// Tags
router.post("/tags", ensureAuthenticated, ensureAdmin, createTagController.handle);
router.get("/tags", ensureAuthenticated, listTagsController.handle);
router.delete("/tags/:id", ensureAuthenticated, ensureAdmin, deleteTagController.handle);

// Compliments
router.post("/compliments", ensureAuthenticated, createComplimentController.handle)
router.delete("/compliments/:id", ensureAuthenticated, deleteComplimentController.handle)


export { router }
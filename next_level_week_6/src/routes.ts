import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { UsersController } from "./controllers/UsersController";
import { TagsController } from "./controllers/TagsController";
import { ComplimentsController } from "./controllers/ComplimentsController"
import { ensureAdmin } from "./middlewares/ensureAdmin";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const tagsController = new TagsController();
const usersController = new UsersController();
const complimentsController = new ComplimentsController()

// Authentication
router.post("/login", authenticateUserController.handle)

// Users
router.post("/users", usersController.create);
router.put("/users", ensureAuthenticated, ensureAdmin, usersController.edit);
router.get("/users", ensureAuthenticated, usersController.index);
router.get("/users/:id", ensureAuthenticated, ensureAdmin, usersController.search);
router.delete("/users/:id", ensureAuthenticated, ensureAdmin, usersController.remove);
router.patch("/users/password", ensureAuthenticated, usersController.update)
// router.get("/users/compliments/send", ensureAuthenticated, listUserSendComplimentsController.handle)
// router.get("/users/compliments/receive", ensureAuthenticated, listUserReceiveComplimentsController.handle)

// Tags
router.post("/tags", ensureAuthenticated, ensureAdmin, tagsController.create);
router.get("/tags", ensureAuthenticated, tagsController.search);
router.delete("/tags/:id", ensureAuthenticated, ensureAdmin, tagsController.remove);

// Compliments
router.post("/compliments", ensureAuthenticated, complimentsController.create)
router.get("/compliments", ensureAuthenticated, complimentsController.search)
router.delete("/compliments/:id", ensureAuthenticated, complimentsController.remove)


export { router }
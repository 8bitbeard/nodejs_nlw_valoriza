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
router.post("/v1/login", authenticateUserController.handle)

// Users
router.post("/v1/users", usersController.create);
router.put("/v1/users", ensureAuthenticated, ensureAdmin, usersController.edit);
router.get("/v1/users", ensureAuthenticated, usersController.index);
router.get("/v1/users/:id", ensureAuthenticated, usersController.search);
router.delete("/v1/users/:id", ensureAuthenticated, ensureAdmin, usersController.remove);
router.patch("/v1/users/password", ensureAuthenticated, usersController.update)

// Tags
router.post("/v1/tags", ensureAuthenticated, ensureAdmin, tagsController.create);
router.get("/v1/tags", ensureAuthenticated, tagsController.search);
router.put("/v1/tags", ensureAuthenticated, ensureAdmin, tagsController.update);
// router.delete("/tags/:id", ensureAuthenticated, ensureAdmin, tagsController.remove);

// Compliments
router.post("/v1/compliments", ensureAuthenticated, complimentsController.create)
router.delete("/v1/compliments/:id", ensureAuthenticated, complimentsController.remove)
router.patch("/v1/compliments/:id/message", ensureAuthenticated, complimentsController.updateMessage)
router.get("/v1/compliments/sent", ensureAuthenticated, complimentsController.searchBySender)
router.get("/v1/compliments/received", ensureAuthenticated, complimentsController.searchByReceiver)

export { router }

const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./app/controllers/uno-controller");

// Express and Port
const app = express();
const port = process.env.PORT || 3000;

// Requiring our models for syncing
const db = require("./app/models");

// Middleware
app.use(express.static(path.join(__dirname, "/app/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Set Handlebars.
//const exphbs = require("express-handlebars");
//app.engine("handlebars", exphbs({ defaultLayout: "main" }));
//app.set("view engine", "handlebars");

// Routes
app.use("/", routes);

// Syncing our sequelize models and then starting our Express app
db.Values.hasMany(db.sequelize.models.Cards, {foreignKey: "valueId"});
db.Colors.hasMany(db.sequelize.models.Cards, {foreignKey: "colorId"});

// Sounds a bit weird to say but we need to specify that
// a deck has many cards
db.Cards.hasMany(db.sequelize.models.Deck, {foreignKey: "cardId"});
db.Cards.hasMany(db.sequelize.models.Discard, {foreignKey: "cardId"});
db.Cards.hasMany(db.sequelize.models.Hands, {foreignKey: "cardId"});
db.Users.hasMany(db.sequelize.models.Hands, {foreignKey: "userId"});
//db.Cards.belongsTo(db.sequelize.models.Deck, {foreignKey: "cardId"});
//db.Deck.hasMany(db.sequelize.models.Cards, {foreignKey: "deckId"});


db.sequelize.sync({force: true})
.then(() => {
	app.listen(port, () => {
		console.log("Server started, listening on port " + port);
	});
}).catch((error) => {
	console.error(error);
});

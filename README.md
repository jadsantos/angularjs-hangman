Angular JS Hangman
==================

This is a basic single page app (SPA) written using Angular JS.  It's to use as an example for learning Angular.  Specifically, how to create an app, controllers, views, and a model.

First, visit the link below to play the game and guess the answer. Return here after your visit to continue. [http://angularjs-hangman.appspot.com/](http://angularjs-hangman.appspot.com/).

Here is what we'll build to get to the final product you just visited:

1. Shell Page
2. Intro View
3. Game View
4. Game Input/Output
5. Game Model


## Shell Page

To get familiar with the controller-view mechanism in Angular, we'll start by creating a simple intro view. But first we'll first need to create the shell page that holds the views for the app. This shell page is the file index.html. The most significant lines in this file are:

```
<body ng-app="hangmanApp">
```

This line declares a new Angular app named "hangmanApp" using the attribute `ng-app`. For your own, SPA the name can be anything you choose.

```
<div ng-view></div>
```

This `div `is the element where the content of our views will be inserted. It uses the attribute `ng-view` to designate this important element.

```
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-route.js"></script>
<script type="text/javascript" src="hangman.js"></script>
```

These script tags loads the angular.js core framework and the angular-route 
library. The last script tag loads the hangman.js script that powers our app.

If you load the shell page in your browser at this point, it should load a stark 
HTML page that does nothing (yet).

---

***QUIZ YOURSELF!*** - What is the purpose of the shell page?

---

## Intro View

With the shell page created, the intro view can be addressed. The intro view is a simple HTML file named `intro.html`. The contents of this file is just static text that welcomes the user to the game. It will be inserted into the shell page where the `div` with the `ng-view` attribute is declared.

```
<p>
	Hangman is great

	<a href="#/play">Play</a>
</p>
```

### Declare the App
To get the intro view displayed, we need to use the hangman.js file to declare our hangman app. Here is the relevant line that does just that:

```javascript
var hangmanApp = angular.module("hangmanApp", ["ngRoute", "hangmanControllers", "hangmanModels"]);
```

This line has 3 important elements. First, `angular.module()` is the statement that creates a new module for our app. A module in angular is a construct for organizing related code. Next, `"hangmanApp"` is a string that identifies our module. Finally, `["ngRoute", "hangmanControllers", "hangmanModels"]` is an array that lists other modules on which our app module depends. ngRoute is an angular-specific module, hangmanControllers is a module for our controllers and hangmanModels is a module for our model. 

### Create the Dependent Modules
Let's create the hangmanControllers module.

```javascript
var controllers = angular.module("hangmanControllers", []);
```

This line creates a module named hangmanControllers without any dependencies on other modules since the second parameter is an empty array.

Let's create the hangmanModels module with this line:

```javascript
var models = angular.module("hangmanModels", []);
```
---

***QUIZ YOURSELF!*** - What is an angular module used for?

---

### Setup a Route
We now have our view (intro.html), an app module declared, and a module to hold the controller for our view. We need to configure our app module to set up the route to which the intro view will respond.

```javascript
app.config([
    "$routeProvider",
    function configure($routeProvider) {
        $routeProvider.when("/", {templateUrl: "intro.html", controller: "introController"});
    }
]);
```

These lines perform the configuration using a common pattern in angular which is to declare the dependencies we need for our function to execute followed by the function itself. Angular will examine the dependencies and inject them as parameters to our function. In this case, the name of the dependency is `$routeProvider`. This string will be looked up and injected as the first argument to our function.

The `$routeProvider` class is used to map a route to a template + controller pair. The code above specifies that the root route "/" maps to the template `intro.html` and the controller introController.

### Intro Controller
Finally, we'll create the introController itself.

```javascript
controllers.controller("introController", [
    function introController() {
    // intentionally empty
    }
]);
```
These lines create a new controller in our module `hangmanControllers`.  The function for the controller is empty because we're displaying only our view which Angular handles for us.  

If you run the app at this point in your browser, the `intro.html` view's contents will be displayed. 

---

***QUIZ YOURSELF!*** - Describe the common angular pattern for dependency injection.

---

## Game View

The next view to create is the game view.  We'll start with creating a route to the view in the app's config function.

```javascript
$routeProvider.when("/play", {templateUrl: "play.html", controller: "playController"});
```

Next, we'll create the view file itself `play.html`

```html
<div class="row panel radius">
	<h2>The hangman is: {{game.hangman}}</h2>
</div>

<div class="row panel radius">
	<h2>The word is: {{game.runningAnswer}}</h2>
</div>

<div class="row panel radius">
	<label>Guess <input type="text" name="guess" value="" size="3" maxlength="1" ng-model="guess" /></label>
	<a class="button radius" ng-click="submit(guess)">Submit</a>

	<p>{{guess}}</p>

	<p>
	{{message}}
	</p>	
</div>
```
### Expression Bindings
There are a few items in the `play.html` file that are new concepts.  The first of these is`{{expression bindings}}` which is one of Angular's most powerful features.  The expression in the `{{}}` double curly braces gets parsed by Angular and replaced with the value to which it evaluates.

In our game view, the first binding is to a property of our game model.  Angular will update this binding automatically whenever the `game.hangman` property is updated as a result of the user's wrong answer.  The other bindings in the game view are `game.runningAnswer`, `guess`, and `message`.  Each of these bindings will change when we update them in either our controller or our model.

### Game Controller
To see the bindings in action, let's update one of them in the view by creating a controller that changes it.  In the `hangman.js` file, a new game controller is declared with the following lines:

```javascript
controllers.controller("playController", [
	"$scope",
	"game",
	function playController($scope, game) {
		$scope.game = game;
		$scope.submit = function submit(guess) {
			$scope.message = "You guessed: " + guess;
			game.play(guess);
			$scope.message += ". You are: " + game.state;
		}
	}

]);
```
A dependency named `$scope` is injected into our controller function.  This is a pre-defined Angular object that is used to expose data and methods to our view.  We've added a new key named `message` to `$scope` and initialized it with the value "Hello".

If you run the app at this point, you'll see the game view load with the "Hello" message displayed.

---

***Quiz Yourself!*** - Why are expression bindings an important element in Angular?

---

## Game Input/Output

It's time to start making the game view interactive.  We'll collect input from our user and update the view by echoing the input back to the user. To do this, we're using a standard `<input>`tag marked up with an Angular attribute `ng-model="guess"`.

```html
<input type="text" name="guess" value="" size="3" maxlength="1" ng-model="guess" />
```

The value "guess", specifies a key in the `$scope` object of our controller.  Any input the user provides will update the value for `$scope.guess`.  To prove this, we've added a binding for `$scope.guess` in our view.

```html
<p>{{guess}}</p>
```
If you run the app at this point, you can enter any text in the input field and you'll see that text echoed back in the view.

---

***Quiz Yourself!*** - What is the importance of the ng-model attribute in an input field?

---

### Submitting Input

We want users to deliberately submit a guess by clicking a submit button.  We create this button via an anchor tag in our game view with the following line:

```html
<a class="button radius" ng-click="submit(guess)">Submit</a>
```

The attribute `ng-click="submit(guess)` directs Angular to capture the click event for the anchor and call a function named "submit" and pass the value of `$scope.guess` as an argument.

The `submit` method is defined in our game controller as:

```javascript
$scope.submit = function submit(guess) {
	$scope.message = "You guessed: " + guess;
	game.play(guess);
	$scope.message += ". You are: " + game.state;
}
```

These lines perfom the submission of the user's guess to the game model and updates the message with the current state of the game.

The app will not run at this point because the game model has not been defined. We'll do that in the next section.

---

***Quiz Yourself!*** - How do you capture the click event for an anchor?

---

## Game Model

This final section covers the model of our Hangman game.  The model is responsible for tracking the current state of the game and processing a user's guess.

The model is defined in a separate module from our controllers.  Instead of creating a controller in this module we'll create a factory.

```javascript
models.factory("game", [...]);  // shortened for brevity
```

A factory is an object that is responsible for the creation of instances of a class.  We use it in our app to create instances of a Hangman game.  To create a factory, we define a creation function that will be called each time an instance of the game is requested.

```javascript
function game() {
    // ...
    return {
    	hangman: "",
    	runningAnswer: "??????",
    	theAnswer: "fourth",
    	state: "",
    	play: play
    };
}

```

The function was shortened to highlight the `return` statement which shows the properties and methods of the Hangman game model.

---

***Quiz Yourself!*** - What is the purpose of a factory?  How does it relate to the model of an app?

---

### Connect the Model

Finally, let's revisit the game controller and game view to highlight the points where the model is integrated.  First, the game factory is injected into the controller with the following:

```javascript
controllers.controller("playController", [
	"$scope",
	"game",
	function playController($scope, game) {
		$scope.game = game;
```
The "game" dependency matches the name of the factory we created earlier. 

Next, the game instance is assigned to the controller's `$scope` so that it can be referenced in the intro view.

```html
<div class="row panel radius">
	<h2>The hangman is: {{game.hangman}}</h2>
</div>

<div class="row panel radius">
	<h2>The word is: {{game.runningAnswer}}</h2>
</div>
```
We use expression bindings in the view to bind to the game's current hangman and current running answer.

Lastly, the `$scope.submit()` method passes the user's input to the game's `play()` method.  After, the game's state is assigned to `$scope.message` so the user can get feedback on the guess that was just submitted.

```javascript
$scope.submit = function submit(guess) {
	$scope.message = "You guessed: " + guess;
	game.play(guess);
	$scope.message += ". You are: " + game.state;
}
```
---

***Quiz Yourself!*** - Which mechanisms allow an app's model to get used in a view or controller?

---

## Wrap Up
This tutorial walked through Angular's concepts of modules, controllers, views, routes, expression bindings, $scope, and factories in the context of creating a single page app that plays the game of hangman.  These make up only a subset of the full functionality of Angular.js.  Use the source in this tutorial as a starting point to familiarize yourself with the basics so that you can progress further in your Angular learnings.

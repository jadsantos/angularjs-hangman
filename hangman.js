var app = angular.module("hangmanApp", [
	"ngRoute",
	"hangmanControllers",
	"hangmanModels"
]);

app.config([
	"$routeProvider",
	function configure($routeProvider) {
		$routeProvider.when("/", {templateUrl: "intro.html", controller: "introController"});		
		$routeProvider.when("/play", {templateUrl: "play.html", controller: "playController"});
	}
]);

//===== controllers ======

var controllers = angular.module("hangmanControllers", []);

controllers.controller("introController", [
	function introController() {
	}
]);

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


//===== models =======

var models = angular.module("hangmanModels", []);

models.factory("game", [
	function game() {
		var wrongs = 0;
		var FINAL_HANGMAN = "O->-<";

		var play = function play(guess) {
			var indexOfGuess = this.theAnswer.indexOf(guess);

			if (indexOfGuess == -1) {
				this.state = "WRONG";
				this.hangman += FINAL_HANGMAN.charAt(wrongs);
				wrongs++;

				if (this.hangman == FINAL_HANGMAN) {
					this.state = "A LOSER!";
				}
			}
			else {
				this.state = "CORRECT";
				this.runningAnswer = replaceAt(this.runningAnswer, indexOfGuess, this.theAnswer.charAt(indexOfGuess));

				if (this.runningAnswer == this.theAnswer) {
					this.state = "A WINNER!";
				}
			}
		};

		var replaceAt = function replaceAt(str, index, char) {
			return str.slice(0, index) + char + str.slice(index + 1, str.length);
		};	

		return {
			hangman: "",

			runningAnswer: "??????",

			theAnswer: "fourth",

			state: "",

			play: play
		};
	}
]);

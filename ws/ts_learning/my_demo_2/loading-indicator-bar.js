"use strict";
exports.__esModule = true;
var LoadingIndicatorBarDirective = /** @class */ (function () {
    function LoadingIndicatorBarDirective() {
        this.controller = "LoadingIndicatorBarController";
        this.controllerAs = "loadingIndicatorBarController";
        this.restrict = "E";
        /**
         * The link function is responsible for registering DOM listeners as well as updating the DOM.
         *
         * @class LoadingIndicatorBarDirective
         * @method link
         * @param $scope {ng.IScope} The scope for this directive
         * @param $element {ng.IAugmentedJQuery} The JQuery instance members object.
         * @param $attributes {ng.IAttributes} An object containing normalized DOM element attributes.
         * @param loadingIndicatorBarController {LoadingIndicatorBarController} A new instance of the controller.
         */
        this.link = function (scorp, element, attributes, loadingIndicatorBarController) {
            loadingIndicatorBarController.init(element);
        };
    }
    /**
     * Create the directive.
     *
     * @class LoadingIndicatorBarDirective
     * @method Factory
     * @static
     * @return {ng.IDirectiveFactory} A function to create the directive.
     */
    LoadingIndicatorBarDirective.Factory = function () {
        return function () { return new LoadingIndicatorBarDirective(); };
    };
    return LoadingIndicatorBarDirective;
}());
exports.LoadingIndicatorBarDirective = LoadingIndicatorBarDirective;

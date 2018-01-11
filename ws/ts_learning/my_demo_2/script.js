;
var HEROS = [
    { id: 11, name: "Mr.Nice" },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' }
];
// 声明Heros的Controller类
var HerosComponentController = /** @class */ (function () {
    function HerosComponentController() {
    } // 实例化方法
    HerosComponentController.prototype.$onInit = function () {
        this.heros = HEROS;
    };
    return HerosComponentController;
}());
// 声明Heros组件类
var HerosComponent = /** @class */ (function () {
    function HerosComponent() {
        this.controller = HerosComponentController;
        this.controllerAs = "$ctrl";
        this.template = "\n      <ul>\n        <li ng-repeat=\"hero in $ctrl.heros\">{{ hero.name }}</li>\n      </ul>\n    ";
    }
    return HerosComponent;
}());
angular
    .module("mySuperAwesomeApp", [])
    .component("heros", new HerosComponent());
angular.element(document).ready(function () {
    angular.bootstrap(document, ["mySuperAwesomeApp"]);
});
// module.component("heros", {
//   template: `
// 	<ul>
// 		<li ng-repeat="hero in $ctrl.heros">{{ hero.name }}</li>
// 	</ul>
//   `,
//   controller: function() {
//   	this.heros = HEROS;
//   },
//   controllerAs: "$ctrl"
// });

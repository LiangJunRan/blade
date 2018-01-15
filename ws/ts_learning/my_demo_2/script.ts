import { LoadingIndicatorBarDirective } from "./loading-indicator-bar";

angular.module("mySuperAwesomeApp").directive("loadingIndicatorBar", LoadingIndicatorBarDirective.Factory());

interface IHero {
  id: number;
  name: string;
};

const HEROS: IHero[] = [
  { id: 11, name: "Mr.Nice" },
  { id: 12, name: 'Narco' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' }
];

// 声明Heros的Controller类
class HerosComponentController implements ng.IComponentController {
  public heros: IHero[];  // 定义属性

  constructor() {}  // 实例化方法

  public $onInit () {  // 实例化后，初始化方法，赋初值
    this.heros = HEROS;
  }
}

// 声明Heros组件类
class HerosComponent implements ng.IComponentOptions {
  // 声明类型属性（angular的Component的属性）
  public controller: ng.Injectable<ng.IControllerConstructor>;
  public controllerAs: string;
  public template: string;

  constructor() {  // 实例化方法
    this.controller = HerosComponentController;
    this.controllerAs = "$ctrl";
    this.template = `
      <ul>
        <li ng-repeat="hero in $ctrl.heros">{{ hero.name }}</li>
      </ul>
    `;
  }
}

angular
  .module("mySuperAwesomeApp", [])
  .component("heros", new HerosComponent());

angular.element(document).ready(function() {
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

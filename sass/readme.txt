LAYOUT
Layout files should be prefixed with layout_ and then the name of the thing so layout_classname.
They should also describe the dimension's of the layout container

.layout-classname {
  background: #000;
}



MODULE CLASSES
Layout classes contain modules. Modules should have fluid widths. The thing that contains the module should define the width and should be a layout class.


.module {

}


MODULE VARIATION CLASSES
Module variations should be separated by a hyphen

.module-variation {
  background: blue;
}
.module .module-variation {

}


STATE CLASSES
States are designated by using "is" and then a state descriptor separated by hyphens.
If state is module specific, include the module in the sate class like below.

.module-is-active {

}


THEME CLASSES
Elements that should be themed should have a separate theme class that describes the themed properties. The modules themselves should only
contain properties that will not change with the theme such as width font size or border width.

theme-header {
  background-color: $theme-bg-color;
}
theme-link {
  color: $theme-font-color;
}

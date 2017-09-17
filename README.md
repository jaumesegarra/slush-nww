slush-nww
================================
>A NW.JS (Node-Webkit) slush generator for NW.js, [Bootstrap+Jquery] and Angular 

Slush generator for NW.js (Node-Webkit). This generator is a fork of slush-wean but without express and with improved features

As well for [yeoman](https://www.npmjs.com/package/generator-nww)

## Requirements
* [Node](https://nodejs.org)
* [Gulp](http://gulpjs.com/)
* [Slush](https://slushjs.github.io/)
* [Bower](http://bower.io/)

## Installation

Install `slush-nww` globally:

```bash
$ npm install -g slush-nww
```

You need to have node, gulp, slush and bower installed globally before running the command. Therefore download node from the link and run:

`npm install -g slush gulp bower`


---
You could have a error downloading bower components, for solve this execute `bower install --allow-root && gulp bower` with root permissions.

### Scaffold an application

Create a new folder for your project:

```bash
$ mkdir my-slush-nww
```

Run the generator from within the new folder:

```bash
$ cd my-slush-nww && slush nww
```

## Developing

You can use sass in your project. For convert scss to css file you must run `grunt watch`, sure that file is in scss folder. Scss files also be coverted to css before building app.

## Running

To run the app execute 

```bash
$ gulp run
```

## Building

To build the app for mac run

```bash
$ gulp build --mac
```

To build the app for windows run

```bash
$ gulp build --win
```

To build the app for linux run

```bash
$ gulp build --linux32
```

or

```bash
$ gulp build --linux64
```

To build for all platforms run

```bash
$ gulp build
```

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/klei/slush).

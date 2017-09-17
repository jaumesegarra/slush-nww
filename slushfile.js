/*
 * slush-wean
 * https://github.com/arvindr21/slush-wean
 *
 * Copyright (c) 2014, Arvind Ravulavaru
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp'),
  install = require('gulp-install'),
  conflict = require('gulp-conflict'),
  template = require('gulp-template'),
  rename = require('gulp-rename'),
  _ = require('underscore.string'),
  inquirer = require('inquirer');

function format(string) {
  var username = string ? string.toLowerCase() : '';
  return username.replace(/\s/g, '');
}

var defaults = (function() {
  var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
    workingDirName = process.cwd().split('/').pop().split('\\').pop(),
    osUserName = homeDir && homeDir.split('/').pop() || 'root',
    configFile = homeDir + '/.gitconfig',
    user = {};
  if (require('fs').existsSync(configFile)) {
    user = require('iniparser').parseSync(configFile).user;
  }
  return {
    appName: workingDirName,
    userName: format(user.name) || osUserName,
    authorEmail: user.email || ''
  };
})();

gulp.task('default', function(done) {
  var prompts = [
    {
      name: 'appName',
      message: 'What would you love to name this project?',
      default: defaults.appName
    },
    {
      type: 'input',
      name: 'appDescription',
      message: 'Please describe the project',
      default: "No description yet"
    },
    {
      type: 'input',
      name: 'appRepository',
      message: 'What is the project\'s GitHub repository?',
      default: "No repository yet"
    },
    {
      type: 'input',
      name: 'appLicense',
      message: 'How would you love to license the project?',
      default: "MIT"
    },
    {
      type: 'input',
      name: 'nwVersion',
      message: 'What do nw version do you want use?',
      default: 'latest'
    },
    {
      type: 'confirm',
      name: 'bootstrapOpt',
      message: 'Do you want use Bootstrap+Jquery?',
      default: true
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?',
      default: true
    }
  ];
  //Ask
  inquirer.prompt(prompts,
    function(answers) {

      answers.bower_components = {};
      answers.bower_components["angular"] = "1.6.4";

      if (!answers.appName || !answers.moveon) {
        return done();
      }
      answers.appNameSlug = _.slugify(answers.appName);
      answers.isWin = /^win/.test(process.platform);

      answers.bootstrapCSS = '';
      answers.bootstrapJS = '';
      if(answers.bootstrapOpt){
        answers.bower_components["bootstrap"] = "latest";
        answers.bootstrapCSS = '<link rel="stylesheet" href="css/_vendor/bootstrap.min.css"/>';
        answers.bootstrapJS = '<script src="js/_vendor/jquery.js"></script>\r\n <script src="js/_vendor/bootstrap.js"></script>';
      }

      answers.bower_components = JSON.stringify(answers.bower_components);

      gulp.src(__dirname + '/templates/app/**')
        .pipe(template(answers))
        .pipe(rename(function(file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function() {
          done();
        });
    });
});

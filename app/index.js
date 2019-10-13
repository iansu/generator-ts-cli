const Generator = require('yeoman-generator');
const { kebabCase, camelCase } = require('lodash');

module.exports = class extends Generator {
  init() {
    return this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: kebabCase(this.appname)
      },
      {
        name: 'moduleDescription',
        message: 'What is your module description?'
      },
      {
        name: 'githubUser',
        message: 'What is your GitHub user or organization name?',
        store: true,
        validate: x => (x.length > 0 ? true : 'You have to provide a user or organization name')
      }
    ]).then(props => {
      const repoName = props.moduleName;

      const tpl = {
        moduleName: props.moduleName,
        moduleDescription: props.moduleDescription,
        camelModuleName: camelCase(repoName),
        githubUser: props.githubUser,
        repoName,
        name: this.user.git.name(),
        email: this.user.git.email()
      };

      const mv = (from, to) => {
        this.fs.move(this.destinationPath(from), this.destinationPath(to));
      };

      this.fs.copyTpl([`${this.templatePath()}/**`], this.destinationPath(), tpl);

      mv('editorconfig', '.editorconfig');
      mv('eslintrc', '.eslintrc');
      mv('eslintignore', '.eslintignore');
      mv('gitattributes', '.gitattributes');
      mv('gitignore', '.gitignore');
      mv('nvmrc', '.nvmrc');
      mv('prettierrc', '.prettierrc');
      mv('prettierignore', '.prettierignore');
      mv('_package.json', 'package.json');
    });
  }

  git() {
    this.spawnCommandSync('git', ['init']);
  }

  install() {
    this.installDependencies({ yarn: true, npm: false, bower: false });
  }
};

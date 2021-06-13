const GitHubService = require('../../services/GitHub.service');
const TasksRegisterService = require('../../services/TasksRegisterService');
const UserRegisterService = require('../../services/UserRegisterService');

module.exports = () => ({
  gitHubService: GitHubService,
  userRegisterService: UserRegisterService,
  tasksService: TasksRegisterService,
});

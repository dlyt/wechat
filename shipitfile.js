module.exports = function (shipit) {
  //require('shipit-deploy')(shipit);
  require('./shipit')(shipit);
  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/tmp/deploy_to',
      //repositoryUrl: 'https://github.com/debugEagle/ssb_server.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      deleteOnRollback: false,
      key: '/Users/yangyss/.ssh/id_rsa',
      shallowClone: true
    },
    staging: {
      servers: ['root@sb.jomton.com'],
      branch: 'master'
    }
  });
};

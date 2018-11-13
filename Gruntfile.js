module.exports = function(grunt) {
  grunt.initConfig({
    gitinfo: {
      options: {
        cwd: "."
      }
    },
    rename: {
      moveApp: {
        src: "deploy/",
        dest:
          "copy/" +
          "<%= gitinfo.local.branch.current.name %>" +
          "_" +
          "<%= gitinfo.local.branch.current.shortSHA %>" +
          "_" +
          "<%= gitinfo.local.branch.current.lastCommitNumber %>" +
          "_" +
          `${Math.floor(Date.now() / 1000)}` +
          "/"
      }
    },
    gitclone: {
      clone: {
        options: {
          repository:
            "https://github.com/geo-org-ios/git-revision-with-grunt.git",
          branch: "<%= gitinfo.local.branch.current.name %>",
          directory: "deploy/"
        }
      },
      master: {
        options: {
          repository:
            "https://github.com/geo-org-ios/git-revision-with-grunt.git",
          branch: "master",
          directory: "deploy"
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-gitinfo");

  grunt.loadNpmTasks("grunt-rename");

  grunt.loadNpmTasks("grunt-git");

  grunt.registerTask("domagic", ["gitinfo", "rename:moveApp"]);

  grunt.registerTask("deploy", ["gitinfo", "gitclone:clone", "rename:moveApp"]);

  grunt.registerTask("gitclonemaster", ["gitinfo", "gitclone:master"]);
};

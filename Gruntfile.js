module.exports = function(grunt) {
  grunt.initConfig({
    gitinfo: {
      options: {
        cwd: "."
      },
      commands: {
        tagname : ['describe', '--tags']
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
      },
      moveAppTag: {
        src: "deploy/",
        dest:
          "copy/" +
          "<%= gitinfo.tagname %>" +
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
          repository: ".",
          branch: "<%= gitinfo.local.branch.current.name %>",
          directory: "deploy/",
          recursive: true,
        }
      },
      // tag must be on master right now
      tag: {
        options: {
          repository: ".",
          branch: "master",
          directory: "deploy/",
          recursive: true,
        }
      },
      origin: {
        options: {
          repository:
            "https://github.com/geo-org-ios/git-revision-with-grunt.git",
          branch: "<%= gitinfo.local.branch.current.name %>",
          directory: "deploy/",
          recursive: true,
        }
      }
    }
  });

  grunt.task.registerTask("getGitInfo", "get config", function() {
    let gitinfo = grunt.config.data.gitinfo;
    console.log(gitinfo.local);
    console.log(gitinfo.remote);
    console.log(gitinfo.options);
    console.log(gitinfo.tagname);
  });

  grunt.loadNpmTasks("grunt-gitinfo");

  grunt.loadNpmTasks("grunt-rename");

  grunt.loadNpmTasks("grunt-git");

  grunt.registerTask("deploy", ["gitinfo", "gitclone:clone", "rename:moveApp"]);

  grunt.registerTask("deployTag", ["gitinfo", "gitclone:tag", "rename:moveAppTag"]);

  grunt.registerTask("deployOrigin", ["gitinfo", "gitclone:origin", "rename:moveApp"]);
};

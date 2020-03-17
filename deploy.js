var ghpages = require('gh-pages');
 
ghpages.publish('dist', function(err) {
    console.log(err)
});

const { series } = require('gulp');

exports.default = series(() => {
    ghpages.publish('dist', {
        branch: 'gh-pages',
        repo: 'git@github.com:MurphyL/slides.git'
    }, function(err) {
        console.log(err)
    });
    
});
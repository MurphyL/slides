const fs = require('fs');
const del = require('del');
const GithubPages = require('github-pages');
const { src, dest, series } = require('gulp');

const marpCli = require('@marp-team/marp-cli').default;

const slide = process.env.npm_config_file;

const root = `${__dirname}/slides/${slide}`;

if (!fs.existsSync(`${root}/index.md`)) {
    throw new ReferenceError('指定的Slide不存在！');
}

function clean() {
    return del([`dist/${slide}`]);
}

function build(cb) {
    let config = {
        title: slide,
        desc: "使用murph-it创建的课件"
    };

    if (fs.existsSync(`${root}/slide.json`)) {
        const options = require(`${root}/slide.json`);
        config = Object.assign(config, options);
    }

    let args = ` --title "${config.title}" `

    args += `--description "${config.desc} - murphyl.com"`;

    if (fs.existsSync(`${root}/style.css`)) {
        // args += ` --theme-set ${root}/style.css`;
    }

    marpCli(`marp ${root}/index.md  ${args} -o dist/${slide}/index.html`);

    return cb();
}

function copy(cb) {
    src(`${__dirname}/public/*`).pipe(dest(`dist/`));
    src(`${root}/img/*`).pipe(dest(`dist/${slide}/img`));
    return cb();
}

function deploy() {
    const config = require('package.json')['github-pages'];
    config.commit.message = `deploy @ ${new Date()}`;
    const pages = new GithubPages(config);
    pages.publish().then((res) => {
        console.log('published');
        console.log(JSON.stringify(res, null, 2));
    }).catch((err) => {
        console.error('error while publishing');
        console.error(JSON.stringify(err, null, 2));
    });
}

exports.default = series(clean, copy, build);

exports.deploy = series(clean, copy, build, deploy);
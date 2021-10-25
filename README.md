# A Multi-Entry Single-Page-Applications blog template

```shell
$ npm init mespa-blog
/post/2021-10-24/0.md
/post/2021-10-24/1.md
/post/2021-10-22/0.md
/style/post.css
/style/navigation.css
package.json
mespa.config.json
$ npm run build
/dist/style/post.css
/dist/style/navigation.css
/dist/script/navigation.js
/dist/script/spoof_index_url.js
/dist/index.html
/dist/2021-10-24/0.html
/dist/2021-10-24/1.html
/dist/2021-10-22/0.html
/dist/post/2021-10-24/0.html
/dist/post/2021-10-24/1.html
/dist/post/2021-10-22/0.html
```

Note: The first heading of each `md` file will be used as the title of the post.

Pages (html files in the root of the `dist` folder) will all contain their associated post, as well as the styles and scripts needed to display posts and the navigation.
The navigation will at will inject previous/next or an arbitrary post. The previous and next post will always be preloaded using two hidden `iframes`. 

The hidden `iframes` are used as DOM buffers, since they support content streaming, which allows us to load as much of the next/previous post as possible in the background, while the user is viewing the current post.


The `mespa.config.json` file contains all configuration needed to run the build command.
For example:

```json
{
  "input": {
    "style_dir": "./style",
    "post_dir": "./post"
  },
  "output": {
    "dir": "./dist"
  }
}
```

## Resources

SPA vs MPA: https://youtu.be/ivLhf3hq7eM

npm init: https://docs.npmjs.com/cli/v7/commands/npm-init

MDX: https://v2.mdxjs.com/docs/

watch file: https://nodejs.org/docs/latest/api/fs.html

# Single Multiple Page App - Blogg

```shell
$ npx smpa-blog init
/posts/2021_10_24.0.md
/posts/2021_10_22.0.md
/style/post.css
/style/navigation.css
package.json
smpa.config.json
$ npm run build
/dist/serve.js
/dist/manifest.json
/dist/style/post.css
/dist/style/navigation.css
/dist/script/navigation.js
/dist/page/2021_10_24.0.html
/dist/page/2021_10_22.0.html
/dist/post/2021_10_24.0.html
/dist/post/2021_10_22.0.html
```

Note: The first heading of each `md` file will be used as the title of the post.

Pages (html files in the `page` folder) will all contain their associated post, as well as the styles and scripts needed to display posts and the navigation.
The navigation will at will inject previous/next or an arbitrary post. The previous and next post will always be preloaded using two hidden `iframes`. 

The hidden `iframes` are used as DOM buffers, since they support content streaming, which allows us to load as much of the next/previous post as possible in the background, while the user is viewing the current post.

The running `node serve.js` will start up an express server. The express server will serve any `page` or `post` given either the title of the post, 
or its id (the post date + index). If multiple posts have the same title, then the latest post will be selected.
The `manifest.json` file contains mappings from post title to post id.
For example:

```json
{
  "post": {
    "This is my first post": ["2021_10_22.0"],
    "Posting is fun and easy": ["2021_10_24.0"],
  }
}
```


The `smpa.config.json` file contains all configuration needed to run the build command.
For example:

```json
{
  "input": {
    "style_dir": "./style",
    "post_dir": "./post"
  },
  "output": {
    "dir": "./dist"
    "include_manifest": true,
    "include_server": true,
  }
}
```


## Resources

SPA vs MPA: https://youtu.be/ivLhf3hq7eM

MDX: https://v2.mdxjs.com/docs/

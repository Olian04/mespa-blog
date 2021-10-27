# Multi-Entry Single-Page-Application (blog)

Project is still very much a work in progress. In other words, it doesn't yet work as expected.

Usage:

1. Create new repo using this repo as a temple
2. Clone down your repo
3. Edit contents of `post` folder, add new files, remove or change old files.
  1. File names must follow the pattern `YYYY-MM-DD.I.md` where `YYYY` is the year the post was made, `MM` is the month the post was made, `DD` is the day the post was made, and `I` is the index of the post on the given day (`0` for the first post that day, `1` for the seconds post that day etc).
  2. Ex: `2021-10-27.0.md` or `2021-11-04.0.md` or `2021-11-04.1.md`
4. Run `npm install`
5. Run `npm run build`
6. Run `npm run publish`
7. Go to your repo on gihub and enable `pages`, set the pages to the `gh-pages` branch and to serve the root folder `/`
8. Now your blog will be live at `https://<username>.github.io/mespa-blog/`

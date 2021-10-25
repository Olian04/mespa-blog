import FS from 'fs/promises';
import { join as joinPath } from 'path';
import Mustache from 'mustache';
import Markdown from 'markdown-it';

const md = new Markdown();

type TemplateProps = Partial<{
  pageTitle: string;
  postBody: string;
  isIndexPage: boolean;
  pathToLatestPost: string;
}>;

const splitFileName = (fileName: string) =>
  fileName.substring(0, fileName.length - '.md'.length).split('.');

const renderTemplate = (templateString: string, props: TemplateProps) =>
  Mustache.render(templateString, props);

(async () => {
  const { default: config } = await import('../mespa.config.json');

  const Path = {
    relativeToRoot: (...path: string[]) => joinPath(__dirname, '..', ...path),
    relativeToSelf: (...path: string[]) => joinPath(__dirname, ...path),
  };

  const emitFile = (fileContents: string, ...path: string[]) =>
    FS.writeFile(Path.relativeToRoot(config.output.dir, ...path), fileContents);

  const postFiles = (
    await FS.readdir(Path.relativeToRoot(config.input.post_dir))
  )
    .sort()
    .reverse();

  const posts = await Promise.all(
    postFiles.map(async (fileName) => {
      const fileContentsBuffer = await FS.readFile(
        Path.relativeToRoot(config.input.post_dir, fileName)
      );
      return [fileName, md.render(fileContentsBuffer.toString())];
    })
  );

  const pageTemplate = (
    await FS.readFile(Path.relativeToSelf('static', 'page.html'))
  ).toString();

  const [fileName, fileContents] = posts[0];
  const [dateString, indexString] = splitFileName(fileName);
  const spoofIndexURLScriptTemplate = (
    await FS.readFile(Path.relativeToRoot(config.input.post_dir, fileName))
  ).toString();

  const indexPageHTML = renderTemplate(pageTemplate, {
    postBody: fileContents,
    pageTitle: fileName,
    isIndexPage: true,
  });
  emitFile(indexPageHTML, dateString, indexString + '.html');

  const spoofIndexURLScriptContents = renderTemplate(
    spoofIndexURLScriptTemplate,
    {
      isIndexPage: true,
      pathToLatestPost: `./${dateString}/${indexString}`,
    }
  );
  emitFile(spoofIndexURLScriptContents, 'script', 'spoof_index_url.js');

  for (const [fileName, fileContentsHTML] of posts) {
    const [dateString, indexString] = splitFileName(fileName);
    const pageHTML = renderTemplate(pageTemplate, {
      postBody: fileContentsHTML,
      pageTitle: fileName,
      isIndexPage: false,
    });

    emitFile(fileContentsHTML, 'post', dateString, indexString + '.html');
    emitFile(pageHTML, dateString, indexString + '.html');
  }
})();

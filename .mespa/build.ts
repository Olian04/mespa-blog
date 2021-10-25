import FS from 'fs/promises';
import Mustache from 'mustache';
import Markdown from 'markdown-it';
import { Path } from './util';

const md = new Markdown();

type TemplateProps = Partial<{
  pageTitle: string;
  postBody: string;
  isIndexPage: boolean;
  pathToLatestPost: string;
  pathToNextPost: string;
  pathToPreviousPost: string;
}>;

const splitFileName = (fileName: string) =>
  fileName.substring(0, fileName.length - '.md'.length).split('.');

const makeResourcePath = (prefix: string, fileName: string) => {
  const [dateString, indexString] = splitFileName(fileName);
  return `${prefix}${dateString}/${indexString}`;
};

const renderTemplate = (templateString: string, props: TemplateProps) =>
  Mustache.render(templateString, props);

(async () => {
  const { default: config } = await import('../mespa.config.json');

  //TODO: Separate build for development & build for production
  //TODO: Use the public root for production builds
  config.output.publicRoot;

  const emitFile = async (fileContents: string, ...path: string[]) => {
    const joinedPath = Path.relativeToRoot(
      config.output.dir,
      ...path.slice(0, path.length - 1)
    );
    await FS.mkdir(joinedPath, {
      recursive: true,
    });

    return FS.writeFile(
      Path.relativeToRoot(config.output.dir, ...path),
      fileContents
    );
  };

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
  const indexPageHTML = renderTemplate(pageTemplate, {
    postBody: fileContents,
    pageTitle: fileName,
    isIndexPage: true,
    pathToPreviousPost: posts[1]
      ? makeResourcePath('/post/', posts[1][0])
      : undefined,
  });
  emitFile(indexPageHTML, 'index.html');

  const spoofIndexURLScriptTemplate = (
    await FS.readFile(
      Path.relativeToSelf('static', 'script', 'spoof_index_url.js')
    )
  ).toString();
  const spoofIndexURLScriptContents = renderTemplate(
    spoofIndexURLScriptTemplate,
    {
      isIndexPage: true,
      pathToLatestPost: makeResourcePath('', fileName),
    }
  );
  emitFile(spoofIndexURLScriptContents, 'script', 'spoof_index_url.js');

  for (let i = 0; i < posts.length; i++) {
    const [postFileName, postContentsHTML] = posts[i];
    const [dateString, indexString] = splitFileName(postFileName);

    const resourcePathForNextPost = posts[i - 1]
      ? makeResourcePath('/post/', posts[i - 1][0])
      : undefined;

    const resourcePathForPreviousPost = posts[i + 1]
      ? makeResourcePath('/post/', posts[i + 1][0])
      : undefined;

    const pageHTML = renderTemplate(pageTemplate, {
      postBody: postContentsHTML,
      pageTitle: postFileName,
      isIndexPage: false,
      pathToNextPost: resourcePathForNextPost,
      pathToPreviousPost: resourcePathForPreviousPost,
    });

    emitFile(
      `
    <meta name="mespa-blog"
        content="Configuration data for mespa navigation"
        data-next-post="${resourcePathForNextPost}"
        data-previous-post="${resourcePathForPreviousPost}"
        data-this-post="${makeResourcePath('/post/', postFileName)}"
    />
    ${postContentsHTML}`,
      'post',
      dateString,
      indexString + '.html'
    );

    emitFile(pageHTML, dateString, indexString + '.html');
  }
})();

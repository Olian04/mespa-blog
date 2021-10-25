import { publish } from 'gh-pages';
import { Path } from './util';

publish(
  Path.relativeToRoot('dist'),
  {
    branch: 'gh-pages',
  },
  (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info('Published successfully!');
    }
  }
);

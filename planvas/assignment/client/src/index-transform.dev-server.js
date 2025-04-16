import * as cheerio from 'cheerio';
import { readFileSync } from 'fs';

// This is called by the builder "@angular-builders/custom-webpack"
// builder and is set as "indexTransform" in angular.json.  This
// cannot be used by the default builder "@angular-devkit/build-angular".
export default (targetOptions, indexHtml) => {

  const $ = cheerio.load(indexHtml, null, true);

  try {
    // This will mimic creation of the Typesafe config object that config.jsp creates.
    const config = JSON.parse(readFileSync(new URL('./mock/config.mock.json', import.meta.url)));
    $('head').append(`
      <script type="text/javascript">
        window.planvas = {
          assignment: {
            config: ${JSON.stringify(config)}
          }
        };
      </script>
`
    );
  } catch (configLoadError) {
    $('head').append(`
      <script type="text/javascript">
        console.error(${JSON.stringify(''+configLoadError)});
      </script>
`
    );
  }

  return $.html();
};

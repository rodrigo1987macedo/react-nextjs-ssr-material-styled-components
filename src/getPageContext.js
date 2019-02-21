import { create, SheetsRegistry } from 'jss';
import { createMuiTheme, createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const isServer = typeof window === 'undefined'

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
  typography: {
    useNextVariants: true,
  },
});

function createPageContext() {
  return {
    theme,
    jss: create({
      ...jssPreset(),
      // We define a custom insertion point that JSS will look for injecting
      // the styles in the DOM.
      insertionPoint: isServer
        ? null
        : document.getElementById('jss-server-side')
    }),

    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

let pageContext;

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!pageContext) {
    pageContext = createPageContext();
  }

  return pageContext;
}

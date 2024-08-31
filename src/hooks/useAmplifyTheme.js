import {
  useTheme,
} from '@aws-amplify/ui-react';
import {
  useTheme as useMuiTheme
} from "@mui/material";

export const useAmplifyTheme = () => {
  const {tokens} = useTheme();
  const {palette} = useMuiTheme();

  return {
    name: 'Auth Theme',
    tokens: {
      colors: {
        border: {
          error: {
            value: palette.error.main
          }
        },
        background: {
          primary: {
            value: tokens.colors.neutral['90'].value,
          },
          secondary: {
            value: tokens.colors.neutral['100'].value,
          },
        },
        font: {
          interactive: {
            value: tokens.colors.white.value,
          },
        },
        brand: {
          primary: {
            '10': {value: '#447297' },
            '80': {value: palette.primary.dark },
            '90': {value: palette.primary.main },
            '100': {value: palette.primary.dark },
          },
        },
      },
      components: {
        heading: {
          color: { value: "white" }
        },
        textfield: {
          color: { value: "white" }
        },
        text: {
          color: { value: "white" },
          error: {
            color: { value: palette.error.main }
          }
        },
        button: {
          color: tokens.colors.white,
          link: {
            color: tokens.colors.white,
          },
        },
        tabs: {
          item: {
            _focus: {
              color: {
                value: tokens.colors.white.value,
              },
            },
            _hover: {
              color: {
                value: palette.primary.light,
              },
            },
            _active: {
              color: {
                value: tokens.colors.white.value,
              },
            },
          },
        },
      },
    },
  };
}

export default useAmplifyTheme;

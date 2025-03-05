import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, fa } from 'vuetify/iconsets/fa'
import { VNumberInput } from 'vuetify/labs/VNumberInput';

import { VBtn } from 'vuetify/components'

import theme from './theme.js';

export default createVuetify({
      components: {
            ...components,
            VNumberInput,
      },
      directives,
      theme: {
            defaultTheme: 'theme',
            themes: {
              theme,
            },
      },
      icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                  fa,
            },
      },
      aliases: {
            VBtnSecondary: VBtn,
      },
      defaults: {
            VIcon: {
                  color: "primary",
            },
            VBtn: {
                  color: 'primary',
                  variant: 'elevated',
            },
            VBtnSecondary: {
                  color: 'primary',
                  variant: 'outlined',
                  rounded: 'lg',
            },
      },
})

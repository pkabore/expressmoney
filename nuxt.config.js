export default {
	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		titleTemplate: '%s - Express Money',
		title: 'Express Money',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
			{
				rel: 'stylesheet',
				href: `https://fonts.googleapis.com/css2?family=Roboto&display=swap`
			},
			{
				rel: 'stylesheet',
				href: `https://fonts.googleapis.com/css2?family=Open+Sans&display=swap`
			}
		]
	},

	plugins: [],

	loading: {
		color: 'success',
		height: '2px'
	},

	// pageTransition: {
	//   name: 'page',
	//   mode: 'out-in',
	//   // beforeEnter (el) {
	//   //   console.log('Before enter...');
	//   // }
	// },

	components: true,

	buildModules: [ '@nuxtjs/fontawesome' ],

	fontawesome: {
		icons: {
			solid: true,
			brands: true
		}
	},

	telemetry: false,

	modules: [ '@nuxtjs/auth-next', '@nuxtjs/axios', 'nuxt-helmet', 'nuxt-buefy' ],

	css: [ '~/assets/scss/main' ],

	auth: {
		watchLoggedIn: true,
		redirect: {
			logout: '/login',
			home: '/operations'
		},
		strategies: {
			cookie: {
				localStorage: false,
				token: {
					required: false,
					type: false
				},
				user: {
					autoFetch: true,
					property: false
				},
				endpoints: {
					login: { url: '/api/auth/login', method: 'post' },
					logout: { url: '/api/auth/logout', method: 'post' },
					user: { url: '/api/auth/account', method: 'get' }
				}
			}
		}
	},

	router: {
		middleware: [ 'auth' ]
	},

	axios: {
		baseURL: 'http://localhost:3000'
	},

	publicRuntimeConfig: {
		axios: {
			browserBaseURL: process.env.BROWSER_BASE_URL
		}
	},

	privateRuntimeConfig: {
		axios: {
			baseURL: process.env.BASE_URL
		}
	},

	build: {
		cssSourceMap: true
	},

	render: {
		csp: true
		// csp: {
		//   enabled: true,
		//   policies: {
		//     "default-src": ["'self'", "http://localhost:3000"],
		//     "script-src": [
		//       "'self'",
		//       "localhost:3000",
		//       "*.materialdesignicons.com",
		//       "'sha256-pD/ETQvbLmVgJ2RPVy9mSJMw2PTZtcFHOkGnXZnoRKQ='"
		//     ],
		//     "script-src-elem": ["'self'"],
		//     "style-src": [
		//       "'self'",
		//       "https://fonts.googleapis.com",
		//       "*.materialdesignicons.com",
		//       "'sha256-lLIw0d+vGfFp0F/xdGqtakwC8njUipz+kIOuHJreEX0='",
		//       "'sha256-rJW8+OzmHzvUKGDe92Tzz+j6xBsZZkRzR06vggoBoEE='",
		//       "'sha256-q6a3/iQKm/K6ayL/ymw+djTjr/CCgo9FqGww5xsiwIc='",
		//       'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
		//       "'sha256-RMC0h3UnwxCvvv8LJa3EdyhJbQmyBhiqwhrGvNRBQlU='",
		//       "'sha256-fHQpF0N2Dzomy44Lvp68YBqGBlLnI/o5qWwI+3BP54M='",
		//       "'sha256-kOXPaZEkWIL6dmMZyAneAAFOWsGP+Z53fBFHhBxOBWc='",
		//       "'sha256-GZfKMcerdmNt4qlQMeXOPNgXY+cuRQ/RvP4Wt1p9OXs='"
		//     ],
		//     "font-src": [
		//       "https://fonts.gstatic.com",
		//       "https://fonts.googleapis.com",
		//       "*.materialdesignicons.com"
		//     ],
		//     "img-src": ["'self'"]
		//   },
		//   addMeta: true
		// }
	}
	// Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
};

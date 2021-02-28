export default {
	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		titleTemplate: '%s | Express Money',
		title: 'Express Money',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Express Money. Demander du crédit pendant vos temps difficiles'
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
			{
				rel: 'stylesheet',
				href: `https://fonts.googleapis.com/css2?family=Baloo+2:wght@400&display=swap`
			},
			{
				rel: 'stylesheet',
				href: `https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap`
			}
		]
	},

	plugins: [],
	loading: false,
	auth: {
		watchLoggedIn: true,
		redirect: {
			logout: '/login',
			home: '/credit'
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

	loading: {
		color: '#fff',
		height: '3px'
	},

	components: true,

	buildModules: [],
	env: {
		WS_URL: process.env.VERCEL_URL || 'http://localhost:3000'
	},
	telemetry: false,

	serverMiddleware: [
		// redirectSSL.create({
		// 	enabled: process.env.NODE_ENV === 'production'
		// }),
		// { path: '/api', handler: '~/api/server.js' }
		'~api/server.js'
	],

	buildModules: [ 'nuxt-fontawesome' ],
	modules: [ '@nuxtjs/auth-next', '@nuxtjs/axios', 'nuxt-helmet', 'nuxt-buefy' ],

	buefy: {
		materialDesignIcons: false,
		defaultIconPack: 'fas',
		defaultIconComponent: 'font-awesome-icon'
	},
	fontawesome: {
		imports: [
			{
				set: '@fortawesome/free-solid-svg-icons',
				icons: [ 'fas' ]
			}
		]
	},

	css: [ '~/assets/scss/main', '~/assets/css/style' ],

	router: {
		middleware: [ 'auth' ]
	},

	axios: {
		baseURL: '/'
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
	}
};

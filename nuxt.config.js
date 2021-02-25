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

	loading: {
		color: '#3273dc',
		height: '3px'
	},

	components: true,

	buildModules: [],

	telemetry: false,

	modules: [ '@nuxtjs/auth-next', '@nuxtjs/axios', 'nuxt-helmet', 'nuxt-buefy', 'nuxt-fontawesome' ],

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

	css: [ '~/assets/scss/main', '~/assets/css/style', 'animate.css' ],

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

	router: {
		middleware: [ 'auth' ]
	},

	axios: {
		baseURL: process.env.VERCEL_URL || "https://expressmoney-nuxt.vercel.app"
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
		cssSourceMap: true,
		node: {
			__filename: true,
			__dirname: true
		},
		loaders: {
			vue: {
				transformAssetUrls: {
					audio: 'src'
				}
			}
		},
		extend(config, ctx) {
			config.module.rules.push({
				test: /\.(ogg|mp3|wav|mpe?g)$/i,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]'
				}
			});
		}
	},

	render: {
		csp: true
	}
};
